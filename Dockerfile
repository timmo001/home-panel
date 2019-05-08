ARG BUILD_FROM=alpine:3.9.2
# hadolint ignore=DL3006
FROM ${BUILD_FROM}

# Environment variables
ENV \
    HOME="/root" \
    LANG="C.UTF-8" \
    PS1="$(whoami)@$(hostname):$(pwd)$ " \
    S6_BEHAVIOUR_IF_STAGE2_FAILS=2 \
    S6_CMD_WAIT_FOR_SERVICES=1 \
    TERM="xterm-256color"

# Copy root filesystem
COPY rootfs /

# Copy api
COPY api /opt/api

# Copy app
COPY build /opt/panel

# Build arch argument
ARG BUILD_ARCH=amd64

# Set shell
SHELL ["/bin/ash", "-o", "pipefail", "-c"]

# Install system
# hadolint ignore=DL3003,DL3018
RUN \
    set -o pipefail \
    \
    && echo '@edge http://dl-cdn.alpinelinux.org/alpine/edge/main' >> /etc/apk/repositories \
    && echo '@edge http://dl-cdn.alpinelinux.org/alpine/edge/community' >> /etc/apk/repositories \
    && echo '@edge http://dl-cdn.alpinelinux.org/alpine/edge/testing' >> /etc/apk/repositories \
    \
    && apk add --no-cache --virtual .build-dependencies \
        curl=7.64.0-r1 \
        git=2.20.1-r0 \
        tar=1.32-r0 \
        yarn=1.12.3-r0 \
    \
    && apk add --no-cache \
        bash=4.4.19-r1 \
        nginx>1.14.2-r0 \
        nodejs-current=11.3.0-r0 \
        tzdata=2019a-r0 \
    \
    && S6_ARCH="${BUILD_ARCH}" \
    && if [ "${BUILD_ARCH}" = "i386" ]; then S6_ARCH="x86"; fi \
    && if [ "${BUILD_ARCH}" = "armv7" ]; then S6_ARCH="arm"; fi \
    \
    && curl -L -s "https://github.com/just-containers/s6-overlay/releases/download/v1.22.1.0/s6-overlay-${S6_ARCH}.tar.gz" \
        | tar zxvf - -C / \
    \
    && mkdir -p /etc/fix-attrs.d \
    \
    && cd /opt/api \
    && yarn install \
    && mkdir -p /data/db \
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
    org.label-schema.url="https://timmo.dev/home-panel" \
    org.label-schema.usage="https://github.com/timmo001/home-panel/tree/master/README.md" \
    org.label-schema.vcs-ref=${BUILD_REF} \
    org.label-schema.vcs-url="https://github.com/timmo001/home-panel" \
    org.label-schema.vendor="Timmo"
