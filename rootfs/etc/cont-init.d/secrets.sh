#!/usr/bin/with-contenv bash
# ==============================================================================
# This updates the internal auth secret for the API
# ==============================================================================
# shellcheck disable=2094,2016
jq /opt/panel/config/default.json '.authentication.secret="$(openssl rand -base64 32)"' > /opt/panel/config/default.json
