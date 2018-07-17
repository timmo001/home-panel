# Base image
FROM node:alpine as build

# Copy files
COPY . /usr/src/app

# Set working directory as build dir
WORKDIR /usr/src/app

# Install dependencies
RUN yarn install && yarn cache clean

# Copy config
COPY /config.json ./node_modules/

# Build app
RUN yarn build --production

# Delete source files
RUN find . -maxdepth 1 \! \( -name build -o -name . \) -exec rm -rf '{}' \;

# Move to nginx:alpine
FROM nginx:alpine

COPY --from=build /usr/src/app/build /usr/share/nginx/html

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

# Expose outbound port
EXPOSE 80
EXPOSE 443

# Set run CMD
CMD ["nginx", "-g", "daemon off;"]
