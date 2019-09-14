#!/usr/bin/with-contenv bash
# ==============================================================================
# This updates the internal auth secret for the API
# ==============================================================================
if [ "$(grep -i 'API_AUTH_SECRET' /opt/panel/config/default.json)" = 0 ]; then
    sed -i -e "s/API_AUTH_SECRET/$(openssl rand -base64 32)/g" /opt/panel/config/default.json
fi

if [ "$(grep -i '../db' /opt/panel/config/default.json)" = 0 ]; then
    # Force database to use /data
    sed -i "s#../db#/data#g" /opt/panel/config/default.json
fi
