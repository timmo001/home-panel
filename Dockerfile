FROM alpine:3.8

WORKDIR /usr/src/app

# Copy source files
COPY . .

# Install packages
RUN \
    apk add --no-cache \
     nodejs-current=9.11.1-r2 \
     yarn=1.7.0-r0 \
     nginx=1.14.0-r0

# Create nginx directories
RUN mkdir -p /run/nginx && mkdir -p /usr/share/nginx/html

# Add SSL enabled config
RUN echo "server {\
  listen 80 default_server;\
  listen [::]:80 default_server;\
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
}" > /etc/nginx/conf.d/default.conf

# Install dependencies
RUN yarn install

# Expose outbound ports
EXPOSE 80
EXPOSE 443

# Set run CMD
CMD \
    echo "" \
    && echo "Copy config.." \
    && cp config.json ./node_modules/ \
    && echo "" \
    && echo "Build app.." \
    && yarn build --production \
    && echo "" \
    && echo "Move build files to html directory.." \
    && rm -Rf /usr/share/nginx/html/* \
    && mv build/* /usr/share/nginx/html \
    && echo "" \
    && echo "Run nginx server.." \
    && nginx -g "daemon off;"
