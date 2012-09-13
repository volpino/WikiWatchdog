bzcat $1 | grep -e '<ip>.*</ip>' | sed -e 's/\s*<\/*ip>//g'
