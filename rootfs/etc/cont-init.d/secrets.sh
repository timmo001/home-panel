#!/usr/bin/with-contenv bash
# ==============================================================================
# This updates the internal auth secret for the API
# ==============================================================================
sed -i -e "s/API_AUTH_SECRET/$(openssl rand -base64 32)/g" /opt/panel/config/default.json
