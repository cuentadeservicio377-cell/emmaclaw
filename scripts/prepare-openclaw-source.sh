#!/bin/bash
set -euo pipefail

DIST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEFAULT_SOURCE_DIR="$DIST_DIR/state/vendor/openclaw"
OPENCLAW_SOURCE_DIR="${OPENCLAW_SOURCE_DIR:-$DEFAULT_SOURCE_DIR}"
OPENCLAW_GIT_URL="${OPENCLAW_GIT_URL:-https://github.com/openclaw/openclaw.git}"
OPENCLAW_GIT_REF="${OPENCLAW_GIT_REF:-main}"

if ! command -v git >/dev/null 2>&1; then
  echo "git no está disponible en PATH"
  exit 1
fi

mkdir -p "$(dirname "$OPENCLAW_SOURCE_DIR")"

if [ -d "$OPENCLAW_SOURCE_DIR/.git" ]; then
  echo "Actualizando OpenClaw en $OPENCLAW_SOURCE_DIR"
  git -C "$OPENCLAW_SOURCE_DIR" fetch --depth 1 origin "$OPENCLAW_GIT_REF"
  git -C "$OPENCLAW_SOURCE_DIR" checkout --force FETCH_HEAD
else
  if [ -e "$OPENCLAW_SOURCE_DIR" ]; then
    echo "La ruta $OPENCLAW_SOURCE_DIR existe pero no es un repo git utilizable"
    exit 1
  fi
  echo "Clonando OpenClaw en $OPENCLAW_SOURCE_DIR"
  git clone --depth 1 --branch "$OPENCLAW_GIT_REF" "$OPENCLAW_GIT_URL" "$OPENCLAW_SOURCE_DIR"
fi

echo "OpenClaw listo en: $OPENCLAW_SOURCE_DIR"
