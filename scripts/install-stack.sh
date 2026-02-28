#!/bin/bash
set -euo pipefail

DIST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! command -v docker >/dev/null 2>&1; then
  echo "docker no está disponible en PATH"
  exit 1
fi

if [ ! -f "$DIST_DIR/.env" ] && [ -f "$DIST_DIR/.env.example" ]; then
  cp "$DIST_DIR/.env.example" "$DIST_DIR/.env"
  echo "Archivo .env creado desde .env.example"
fi

"$DIST_DIR/scripts/prepare-openclaw-source.sh"
"$DIST_DIR/scripts/init-emma.sh"

docker compose -f "$DIST_DIR/docker-compose.yml" build
docker compose -f "$DIST_DIR/docker-compose.rovodev.yml" build

echo
echo "Instalación base completada."
echo "Pasos manuales pendientes:"
echo "1. docker compose -f \"$DIST_DIR/docker-compose.rovodev.yml\" run --rm rovodev-cli"
echo "   Dentro: acli rovodev auth login && acli rovodev auth status"
echo "2. docker compose -f \"$DIST_DIR/docker-compose.yml\" run --rm openclaw-cli onboard"
echo "3. \"$DIST_DIR/scripts/cron.seed.sh\""
echo "4. docker compose -f \"$DIST_DIR/docker-compose.yml\" up -d openclaw-gateway"
echo "5. docker compose -f \"$DIST_DIR/docker-compose.rovodev.yml\" up -d rovodev-server"
