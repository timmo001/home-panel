#!/usr/bin/with-contenv bash
# ==============================================================================
# This updates the internal auth secret for the API
# ==============================================================================
declare key

if [ ! -f /data/secret.txt ]; then
    echo "Generating secret"
    newkey=$(openssl rand -base64 32)
    echo "${newkey}" > /data/secret.txt
fi

key=$(cat /data/secret.txt)

# Set secret to persistent secret file
sed -i "s#API_AUTH_SECRET#${key}#g" /opt/panel/config/default.json

# Set database to /data
sed -i "s#../db#/data#g" /opt/panel/config/default.json
