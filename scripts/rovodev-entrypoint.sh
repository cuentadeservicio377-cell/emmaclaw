#!/bin/bash
set -euo pipefail

mkdir -p "$HOME/.rovodev" "$HOME/.config"
git config --global --add safe.directory /workspace

if [[ $# -eq 0 ]]; then
  set -- bash
fi

exec "$@"
