import sys
import sqlite3
from socket import gethostbyaddr

import logging
logging.basicConfig(level=logging.INFO)

import pygeoip

GEOIP = None
INVALID = set()


def create_tables(cursor):
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ip
        (ip varchar(32) UNIQUE, domain varchar(128), lat varchar(128),
         lon varchar(128));
    """)


def reverse_dns(ip):
    try:
        return gethostbyaddr(ip)[0]
    except:
        return None


def get_location(ip):
    try:
        info = GEOIP.record_by_addr(ip)
    except:
        return None, None
    else:
        if info:
            return info["latitude"], info["longitude"]
        else:
            return None, None


def store_result(cursor, ip, domain, lat, lon):
    cursor.execute("""
        INSERT INTO ip VALUES (?, ?, ?, ?)
    """, (ip, domain, lat, lon))


def main(fn):
    conn = sqlite3.connect('%s.db' % fn)
    cursor = conn.cursor()

    create_tables(cursor)

    with open(fn) as fp:
        for i, ip in enumerate(fp):
            ip = ip.strip()

            if i % 10 == 0:
                logging.info("[PROGRESS] Analyzed %s ip", i)

            # check that ip is not already in database
            q = "SELECT * FROM ip WHERE ip=?"
            if ip in INVALID or cursor.execute(q, (ip, )).fetchone():
                logging.info("[%s] Already analyzed", ip)
                continue
            domain = reverse_dns(ip)
            lat, lon = get_location(ip)
            if domain and lat and lon:
                store_result(cursor, ip, domain, lat, lon)
                logging.info("[%s] Info stored", ip)
                conn.commit()
            else:
                INVALID.add(ip)
                logging.error("[%s] invalid ip", ip)


if __name__ == "__main__":
    try:
        fn = sys.argv[1]
        GEOIP_PATH = sys.argv[2]
    except IndexError:
        print "Gimme a file name!"
    else:
        GEOIP = pygeoip.GeoIP(GEOIP_PATH)
        main(fn)
