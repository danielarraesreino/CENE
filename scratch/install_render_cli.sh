#!/bin/bash
# install_render_cli.sh

set -e

mkdir -p bin
cd bin

echo "Downloading Render CLI for Linux x86_64..."
# Using the official installation script logic but targeted to our local bin
curl -fsSL https://raw.githubusercontent.com/render-oss/cli/refs/heads/main/bin/install.sh | INSTALL_DIR=. sh

echo "Render CLI installed in $(pwd)/render"
./render version
