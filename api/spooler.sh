SPOOLER_DIR="/home/sonet/wikiwatchdog_tmp/spooler/"
API="/home/sonet/public_html/cgi-bin/watchdog.py"

for FILE in $(find $SPOOLER_DIR -type f -mmin +0.5); do
    echo "Processing" $FILE > /dev/stderr
    python $API $FILE
    rm -f ${SPOOLER_DIR}${FILE}
done
