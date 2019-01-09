ARG BUILD_FROM=alpine:3.8
# hadolint ignore=DL3006
FROM ${BUILD_FROM}

# Environment variables
ENV \
    HOME="/root" \
    LANG="C.UTF-8" \
    PS1="$(whoami)@$(hostname):$(pwd)$ " \
    S6_BEHAVIOUR_IF_STAGE2_FAILS=2 \
    S6_CMD_WAIT_FOR_SERVICES=1 \
    TERM="xterm" \
    SSL="false" \
    SSL_CERTFILE="/data/ssl/fullchain.pem" \
    SSL_KEYFILE="/data/ssl/privkey.pem"

# Copy root filesystem
COPY rootfs /

# Build arch argument
ARG BUILD_ARCH=amd64

# Set shell
SHELL ["/bin/ash", "-o", "pipefail", "-c"]

# Install system
# hadolint ignore=DL3003
RUN \
    set -o pipefail \
    \
    && echo '@edge http://dl-cdn.alpinelinux.org/alpine/edge/main' >> /etc/apk/repositories \
    && echo '@edge http://dl-cdn.alpinelinux.org/alpine/edge/community' >> /etc/apk/repositories \
    && echo '@edge http://dl-cdn.alpinelinux.org/alpine/edge/testing' >> /etc/apk/repositories \
    \
    && apk add --no-cache --virtual .build-dependencies \
        curl=7.61.1-r1 \
        git=2.18.1-r0 \
        tar=1.30-r0 \
        yarn=1.7.0-r0 \
    \
    && apk add --no-cache \
        apk-tools=2.10.1-r0 \
        bash=4.4.19-r1 \
        busybox=1.28.4-r2 \
        ca-certificates=20171114-r3 \
        nginx=1.14.2-r0 \
        nodejs-current=9.11.1-r2 \
        tzdata=2018f-r0 \
    \
    && if [ "${BUILD_ARCH}" = "i386" ]; then S6_ARCH="x86"; else S6_ARCH="${BUILD_ARCH}"; fi \
    \
    && curl -L -s "https://github.com/just-containers/s6-overlay/releases/download/v1.21.7.0/s6-overlay-${S6_ARCH}.tar.gz" \
        | tar zxvf - -C / \
    \
    && mkdir -p /etc/fix-attrs.d \
    && mkdir -p /etc/services.d \
    \
     && git clone --branch "v0.4.3" --depth=1 \
          "https://github.com/timmo001/home-panel-api.git" /opt/api \
     \
     && curl -J -L -o /tmp/panel.zip \
          "https://github.com/timmo001/home-panel/releases/download/v0.6.9/home-panel-built.zip" \
     && unzip -d /tmp /tmp/panel.zip \
     && mv /tmp/build /opt/panel \
     \
     && cd /opt/api \
     && yarn install \
     \
     && yarn cache clean \
     && apk del --purge .build-dependencies \
     && rm -fr /tmp/*

# Entrypoint & CMD
ENTRYPOINT ["/init"]

# Build arguments
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
