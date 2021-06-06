ARG BUILD_FROM=ghcr.io/timmo001/container-base/amd64:1.0.2
# hadolint ignore=DL3006
FROM ${BUILD_FROM}

# Copy root filesystem
COPY rootfs /

# Copy application
COPY . /opt/panel

# Set shell
SHELL ["/bin/ash", "-o", "pipefail", "-c"]

WORKDIR /opt/panel/backend

# Install system
# hadolint ignore=DL3003,DL3018
RUN \
    apk add --no-cache \
        nginx=1.18.0-r15 \
        nodejs-current=15.10.0-r0 \
        yarn=1.22.10-r0 \
    \
    && mkdir -p /data/db \
    \
    && mv /opt/panel/frontend/build/* /opt/panel/backend/public \
    && rm -rf /opt/panel/frontend \
    && rm -rf /opt/panel/rootfs \
    \
    && yarn install \
    \
    && rm -fr /tmp/*

# Build arguments
ARG BUILD_ARCH
ARG BUILD_DATE
ARG BUILD_DESCRIPTION
ARG BUILD_NAME
ARG BUILD_REF
ARG BUILD_REPOSITORY
ARG BUILD_VERSION

# Labels
LABEL \
    maintainer="Aidan Timson <contact@timmo.xyz>" \
    org.opencontainers.image.title="${BUILD_NAME}" \
    org.opencontainers.image.description="${BUILD_DESCRIPTION}" \
    org.opencontainers.image.vendor="Timmo" \
    org.opencontainers.image.authors="Aidan Timson <contact@timmo.xyz>" \
    org.opencontainers.image.licenses="MIT" \
    org.opencontainers.image.url="https://timmo.dev" \
    org.opencontainers.image.source="https://github.com/${BUILD_REPOSITORY}" \
    org.opencontainers.image.documentation="https://github.com/${BUILD_REPOSITORY}/blob/main/README.md" \
    org.opencontainers.image.created=${BUILD_DATE} \
    org.opencontainers.image.revision=${BUILD_REF} \
    org.opencontainers.image.version=${BUILD_VERSION}
