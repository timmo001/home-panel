# Base image
FROM node:alpine as build

# Copy files
COPY . /usr/src/app

# Set working directory as build dir
WORKDIR /usr/src/app

# Copy config
COPY /config.json ./src/

# Install deps and build
RUN yarn install && yarn cache clean
RUN yarn build --production

# Delete source files
RUN find . -maxdepth 1 \! \( -name build -o -name . \) -exec rm -rf '{}' \;

# Move to nginx:alpine
FROM nginx:alpine

COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose outbound port
EXPOSE 80

# Set run CMD
CMD ["nginx", "-g", "daemon off;"]
