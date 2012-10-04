#!/usr/bin/python

# This file is part of WikiWatchdog
# (c) fox - http://volpino.github.com
#
# Ok, this is a CGI. I know is bullshit but it's the only way of running
# code that's not PHP on Wikimedia Toolserver

import cgi

import os
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
        """SELECT SQL_CACHE rev_id, page_title, page_namespace, rev_timestamp,
                            rev_user_text, rev_comment
           FROM revision JOIN page ON rev_page=page_id
           WHERE rev_user=0 AND rev_user_text LIKE ?
           ORDER BY rev_timestamp DESC""",
        (where_ip, )
    )

    for row in curs:
        ip_long = ip2long(row["rev_user_text"])
        if ip_long >= start_long and ip_long <= end_long:
            if row["rev_user_text"] in REVERSE_DNS_CACHE:
                domain = REVERSE_DNS_CACHE[row["rev_user_text"]]
            else:
                try:
                    domain = gethostbyaddr(row["rev_user_text"])[0]
                except:
                    domain = None
                finally:
                    REVERSE_DNS_CACHE[row["rev_user_text"]] = domain

            data = {
                "timestamp": row["rev_timestamp"],
                "ip": row["rev_user_text"],
                "domain": domain,
                "id": row["rev_id"],
                "comment": row["rev_comment"]
            }

            page_title = get_page_title(
                row["page_namespace"], row["page_title"]
            )
            result["pages"][page_title].append(data)

    result["pages"] = OrderedDict(
        sorted(result["pages"].items(), key=lambda x: len(x[1]), reverse=True)
    )


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
callback = form.getvalue("callback")

result = {"pages": defaultdict(list), "stats": {}}

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

    if org:
        process_ip(ip)
    else:
        result["error"] = "%s is not an organization domain" % domain


result["stats"]["execution_time"] = time() - START_TIME

print "Content-type:application/json\r\n\r\n"

if callback:
    print "%s(%s)" % (callback, json.dumps(result))
else:
    print json.dumps(result)
