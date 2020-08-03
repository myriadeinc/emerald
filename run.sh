#!/bin/bash
export LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu/:$LD_LIBRARY_PATH

echo "Booting Emerald"
node src/main.js
# apt-get install -y libboost-all-dev
# cp /usr/lib/x86_64-linux-gnu/libboost_date_time.so /usr/lib/x86_64-linux-gnu/libboost_date_time.so.1.71.0

# npm run start:dev

# while true; do sleep 15 ; echo "background"; done &
# while true; do sleep 12 ; echo "foreground"; done
