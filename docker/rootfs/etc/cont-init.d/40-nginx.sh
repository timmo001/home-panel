#!/usr/bin/with-contenv bash
# ==============================================================================
# Configures NGINX for use with Home Panel
# ==============================================================================
config_file="/config/$(hass.config.get 'config_file')"

declare certfile
declare keyfile

# Enable SSL
if [ -f "$SSL_CERTFILE" ]; then
    certfile=$(hass.config.get 'certfile')
    keyfile=$(hass.config.get 'keyfile')

    sed -i "s/%%certfile%%/${certfile}/g" /etc/nginx/nginx-ssl.conf
    sed -i "s/%%keyfile%%/${keyfile}/g" /etc/nginx/nginx-ssl.conf
fi