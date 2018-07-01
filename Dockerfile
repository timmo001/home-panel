# Base image
FROM node:alpine as build

# Copy files
COPY . /usr/src/build

# Set working directory as build dir
WORKDIR /usr/src/build

# Install deps and build
RUN yarn install && yarn cache clean
RUN yarn run build --production

# # Create app dir
# RUN mkdir /usr/src/app

# # Copy files
# COPY ./build/. /usr/src/app

# # Delete build files
# RUN rm -rf *

# # Move to nginx:alpine
# FROM nginx:alpine

# COPY --from=build /usr/src/app /usr/share/nginx/html

# # Set working directory as app dir
# WORKDIR /usr/src/app

# # Expose outbound port
# EXPOSE 80

# # Set run CMD
# CMD ["nginx", "-g", "daemon off;"]
