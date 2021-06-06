FROM gitpod/workspace-full

# Set shell
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Install packages
# hadolint ignore=DL3008,DL3009,SC2086
RUN sudo apt-get update \
    && sudo apt-get install -y --no-install-recommends \
        apt-transport-https \
        build-essential \
        software-properties-common \
        wget \
        zsh \
    && sudo apt-get clean \
    && curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash \
    && sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" \
    && git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# Set the default shell to zsh
ENV SHELL /bin/zsh

# Copy zshrc with plugin config
COPY .devcontainer/.zshrc /root/.zshrc
