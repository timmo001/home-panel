ARG BUILD_FROM=alpine:3.8
# hadolint ignore=DL3006
FROM ${BUILD_FROM}

WORKDIR /usr/src/app

# Copy source files
COPY . .

# Install packages
RUN \
    apk add --no-cache \
     nginx=1.14.2-r0

# Create nginx directories
RUN mkdir -p /run/nginx && mkdir -p /usr/share/nginx/html

# Move app
RUN rm -Rf /usr/share/nginx/html/* \
    && mv build/* /usr/share/nginx/html \
    && rm -Rf ./*

# Expose outbound ports
EXPOSE 80
EXPOSE 443

# Build arguments
ARG BUILD_ARCH
ARG BUILD_DATE
ARG BUILD_REF
ARG BUILD_VERSION

# Labels
LABEL \
    maintainer="Timmo <contact@timmo.xyz>" \
    org.label-schema.description="A touch-compatible web-app for controlling the home" \
    org.label-schema.build-date=${BUILD_DATE} \
    org.label-schema.name="Home Panel" \
    org.label-schema.schema-version="1.0" \
    org.label-schema.url="https://git.timmo.xyz/home-panel" \
    org.label-schema.usage="https://github.com/timmo001/home-panel/tree/master/README.md" \
    org.label-schema.vcs-ref=${BUILD_REF} \
    org.label-schema.vcs-url="https://github.com/timmo001/home-panel" \
    org.label-schema.vendor="Timmo"

# Set run CMD
# hadolint ignore=DL3025
CMD \
    echo "" \
    && if [ -f /ssl/fullchain.pem ]; then \
      echo "Copy enabled SSL nginx config" \
      && echo "server {\
        listen 443 ssl http2 default_server;\
        listen [::]:443 ssl http2 default_server;\
        root /usr/share/nginx/html;\
        index index.html;\
        server_name 172.0.0.1;\
        ssl_certificate /ssl/fullchain.pem;\
        ssl_certificate_key /ssl/privkey.pem;\
        location / {\
          try_files \$uri /index.html;\
        }\
      }" > /etc/nginx/conf.d/default.conf; \
    else \
      echo "Copy disabled SSL nginx config" \
      && echo "server {\
        listen 80 default_server;\
        listen [::]:80 default_server;\
        root /usr/share/nginx/html;\
        index index.html;\
        server_name 172.0.0.1;\
        location / {\
          try_files \$uri /index.html;\
        }\
      }" > /etc/nginx/conf.d/default.conf; \
    fi \
    && echo "" \
    && echo "Run nginx server.." \
    && nginx -g "daemon off;"
