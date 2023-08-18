#!/usr/bin/env bash
set -euo pipefail

if ! node -v | grep -q "v16"; then
    abort "Please make sure you are using node 16"
fi

if [ -z "${1+set}" ]; then
    echo "Usage: createStack.sh TARGET_PATH"
    exit
fi

node init/dist/index.js $1
