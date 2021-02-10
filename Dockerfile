ARG BUILD_FROM=alpine:3.13.1
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

# Copy application
COPY . /opt/panel

# Copy root filesystem
COPY rootfs /

# Build arch argument
ARG BUILD_ARCH=amd64

# Set shell
SHELL ["/bin/ash", "-o", "pipefail", "-c"]

WORKDIR /opt/panel

# Install system
# hadolint ignore=DL3003,DL3018
RUN \
    set -o pipefail \
    \
    && apk add --no-cache --virtual .build-dependencies \
        curl=7.69.1-r3 \
        tar=1.32-r1 \
    \
    && apk add --no-cache \
        bash=5.0.17-r0 \
        nginx=1.18.0-r1 \
        nodejs-current=14.5.0-r0 \
        openssl=1.1.1i-r0 \
        tzdata=2021a-r0 \
        yarn=1.22.4-r0 \
    \
    && S6_ARCH="${BUILD_ARCH}" \
    && if [ "${BUILD_ARCH}" = "arm32v6" ]; then S6_ARCH="armhf"; fi \
    && if [ "${BUILD_ARCH}" = "arm32v7" ]; then S6_ARCH="arm"; fi \
    && if [ "${BUILD_ARCH}" = "arm64v8" ]; then S6_ARCH="aarch64"; fi \
    && if [ "${BUILD_ARCH}" = "i386" ]; then S6_ARCH="x86"; fi \
    \
    && curl -L -s "https://github.com/just-containers/s6-overlay/releases/download/v2.0.0.1/s6-overlay-${S6_ARCH}.tar.gz" \
        | tar zxvf - -C / \
    \
    && mkdir -p /etc/fix-attrs.d \
    \
    && mkdir -p /data/db \
    \
    && mv /opt/panel/frontend/build/* /opt/panel/backend/public \
    && rm -rf /opt/panel/frontend \
    && rm -rf /opt/panel/rootfs \
    \
    && yarn install \
    \
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
    maintainer="Aidan Timson <contact@timmo.xyz>" \
    org.label-schema.description="A touch-compatible web-app for controlling the home" \
    org.label-schema.build-date=${BUILD_DATE} \
    org.label-schema.name="Home Panel" \
    org.label-schema.schema-version="1.0" \
    org.label-schema.url="https://home-panel-docs.timmo.dev" \
    org.label-schema.usage="https://github.com/timmo001/home-panel/tree/master/README.md" \
    org.label-schema.vcs-ref=${BUILD_REF} \
    org.label-schema.vcs-url="https://github.com/timmo001/home-panel" \
    org.label-schema.vendor="Timmo"
