#!/usr/bin/python

# This file is part of WikiWatchdog
# (c) fox - http://volpino.github.com
#
# Ok, this is a CGI. I know is bullshit but it's the only way of running
# code that's not PHP on Wikimedia Toolserver

import cgi

import os
import sys
import gzip
import cStringIO
from socket import gethostbyname, gethostbyaddr, inet_aton
from struct import unpack
from collections import defaultdict, OrderedDict
from time import time

import GeoIP
import oursql
import json


def ip2long(ip):
    try:
        return unpack("!L", inet_aton(ip))[0]
    except:
        return 0


def get_page_title(ns, title):
    if ns == 0 or ns not in NAMESPACES:
        return title
    else:
        return "%s:%s" % (NAMESPACES[ns], title)


def process_ip(ip):
    start, end = gi.range_by_ip(ip)
    pages = defaultdict(list)

    start_long, end_long = ip2long(start), ip2long(end)

    for i, c in enumerate(start):
        if end[i] != c:
            break

    where_ip = "%s%%" % start[:i]

    db = oursql.connect(db='%swiki_p' % lang,
                        host="%swiki-p.rrdb.toolserver.org" % lang,
                        read_default_file=os.path.expanduser("~/.my.cnf"),
                        charset=None,
                        use_unicode=False)

    curs = db.cursor(oursql.DictCursor)

    curs.execute(
        """SELECT /* SLOW_OK */
                  rev_id, page_title, page_namespace, rev_timestamp,
                  rev_user_text, rev_comment, page_id
           FROM revision JOIN page ON rev_page=page_id
           WHERE rev_user=0 AND rev_user_text LIKE ?
           ORDER BY rev_timestamp DESC""",
        (where_ip, )
    )

    for row in curs:
        ip_long = ip2long(row["rev_user_text"])
        if ip_long >= start_long and ip_long <= end_long:
            if row["rev_user_text"] in REVERSE_DNS_CACHE:
                dns = REVERSE_DNS_CACHE[row["rev_user_text"]]
            else:
                try:
                    dns = gethostbyaddr(row["rev_user_text"])[0]
                except:
                    dns = None
                finally:
                    REVERSE_DNS_CACHE[row["rev_user_text"]] = dns

            data = {
                "timestamp": row["rev_timestamp"],
                "ip": row["rev_user_text"],
                "domain": dns,
                "id": row["rev_id"],
                "comment": row["rev_comment"]
            }

            page_title = get_page_title(
                row["page_namespace"], row["page_title"]
            )
            pages[(page_title, row["page_id"])].append(data)
        else:
            result["stats"]["removed"] += 1

    pages = OrderedDict(
        sorted(pages.items(), key=lambda x: len(x[1]), reverse=True)
    )

    for key in pages:
        result["pages"].append(
            {"title": key[0], "id": key[1], "edits": pages[key]}
        )


CACHE_DIR = "/home/sonet/wikiwatchdog_tmp/cache/"
if not os.path.isdir(CACHE_DIR):
    os.makedirs(CACHE_DIR)
SPOOLER_DIR = "/home/sonet/wikiwatchdog_tmp/spooler/"
if not os.path.isdir(SPOOLER_DIR):
    os.makedirs(SPOOLER_DIR)

GEOIP_PATH = "/home/sonet/GeoIPOrg.dat"

NAMESPACES = {
    1: "Talk",
    2: "User",
    3: "User talk",
    4: "Wikipedia",
    5: "Wikipedia talk",
    6: "File",
    7: "File talk",
    8: "MediaWiki",
    9: "MediaWiki talk",
    10: "Template",
    11: "Template talk",
    12: "Help",
    13: "Help talk",
    14: "Category",
    15: "Category talk",
}

REVERSE_DNS_CACHE = {}
START_TIME = time()

form = cgi.FieldStorage()
ip = form.getvalue("ip")
domain = form.getvalue("domain")
lang = form.getvalue("lang") or "en"
no_cache = form.getvalue("nocache")
callback = form.getvalue("callback")

result = {"pages": [], "stats": {"removed": 0, "cached": False}}

gi = GeoIP.open(GEOIP_PATH, GeoIP.GEOIP_STANDARD)


if domain is not None:
    try:
        ip = gethostbyname(domain)
    except:
        try:
            ip = gethostbyname("www.%s" % domain)
        except:
            result["error"] = "Invalid domain %s" % domain

if ip:
    org = gi.org_by_addr(ip)

    start, end = gi.range_by_ip(ip)

    path = os.path.join(CACHE_DIR, "%s_%s_%s" % (lang, start, end))

    if not no_cache:
        try:
            with open(path) as f:
                data = json.load(f)
                result["pages"] = data
                result["stats"]["cached"] = True
        except IOError:
            pass
    if not result["pages"]:
        s_path = os.path.join(
            SPOOLER_DIR, "lang=%s&domain=%s" % (lang, domain)
        )
        try:
            open(s_path, "w")
        except IOError:
            pass

        process_ip(ip)

        try:
            os.remove(s_path)
        except OSError:
            pass

    result["stats"]["execution_time"] = time() - START_TIME

    if result["stats"]["execution_time"] > 10:
        start, end = gi.range_by_ip(ip)
        with open(path, "w") as f:
            f.write(json.dumps(result["pages"]))

    #if org:
    #    process_ip(ip)
    #else:
    #    result["error"] = "%s is not an organization domain" % domain

json_data = json.dumps(result)
if callback:
    json_data = "%s(%s)" % (callback, json_data)

if "gzip" in os.environ.get("HTTP_ACCEPT_ENCODING", ""):
    zbuf = cStringIO.StringIO()
    zfile = gzip.GzipFile(mode='wb', fileobj=zbuf)
    zfile.write(json_data)
    zfile.close()
    zdata = zbuf.getvalue()
    sys.stdout.write("Content-Encoding: gzip\r\n")
    sys.stdout.write("Content-Length: %d\r\n" % len(zdata))
    sys.stdout.write("Content-type: application/json\r\n\r\n")
    sys.stdout.write(zdata)
else:
    sys.stdout.write("Content-type:application/json\r\n\r\n")
    sys.stdout.write(json_data)
