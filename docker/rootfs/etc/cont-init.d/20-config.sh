#!/usr/bin/with-contenv bash
# ==============================================================================
# This copies the config json file to its correct location
# ==============================================================================
config_file="/config/$(hass.config.get 'config_file')"

if [ ! -f "$config_file" ]; then
  echo 'Config file does not exist. Creating..'
  cp /etc/home-panel/home-panel-config.default.json "$config_file"
  echo "Created. You should now edit this file at '$config_file'"
fi