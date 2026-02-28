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

if [ -f "$DIST_DIR/state/config/openclaw.json" ]; then
  "$DIST_DIR/scripts/cron.seed.sh"
else
  echo "Aviso: state/config/openclaw.json no existe todavía. Ejecuta onboard antes de reprovisionar cron."
fi

docker compose -f "$DIST_DIR/docker-compose.yml" up -d openclaw-gateway

echo
echo "Update stack de Emma completado."
echo "Verifica si gog sigue autenticado si este caso usa Google."
