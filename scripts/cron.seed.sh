#!/bin/bash
set -euo pipefail

DIST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

compose() {
  docker compose -f "$DIST_DIR/docker-compose.yml" "$@"
}

if ! command -v docker >/dev/null 2>&1; then
  echo "docker no está disponible en PATH"
  exit 1
fi

get_job_id() {
  local job_name="$1"
  compose run --rm openclaw-cli cron list --all --json 2>/dev/null | node -e '
const fs = require("node:fs");
const name = process.argv[1];
const raw = fs.readFileSync(0, "utf8");
if (!raw.trim()) process.exit(0);
const parsed = JSON.parse(raw);
const jobs = Array.isArray(parsed?.jobs) ? parsed.jobs : [];
const match = jobs.find((j) => j && j.name === name);
if (match && match.id) process.stdout.write(String(match.id));
' "$job_name" || true
}

upsert_job() {
  local name="$1"
  local cron_expr="$2"
  local event="$3"
  local job_id
  job_id="$(get_job_id "$name")"

  if [ -n "$job_id" ]; then
    compose run --rm openclaw-cli cron edit "$job_id" \
      --enable \
      --cron "$cron_expr" \
      --session main \
      --system-event "$event" >/dev/null
    echo "Cron actualizado: $name"
  else
    compose run --rm openclaw-cli cron add \
      --name "$name" \
      --cron "$cron_expr" \
      --session main \
      --system-event "$event" >/dev/null
    echo "Cron creado: $name"
  fi
}

compose run --rm openclaw-cli config set agents.defaults.heartbeat.every "2h" >/dev/null
compose run --rm openclaw-cli config set agents.defaults.heartbeat.target "last" >/dev/null
compose run --rm openclaw-cli config set agents.defaults.heartbeat.prompt "Read HEARTBEAT.md and Emma memory files. Follow them strictly. If nothing needs attention, reply HEARTBEAT_OK." >/dev/null

echo "Heartbeat resembrado"

compose run --rm openclaw-cli hooks enable session-memory >/dev/null || true
compose run --rm openclaw-cli hooks enable pepito-memory-evolution >/dev/null || true

echo "Hooks activados: session-memory, pepito-memory-evolution"

upsert_job \
  "Emma Daily Brief" \
  "0 7 * * *" \
  "Emma Daily Brief. Read HEARTBEAT.md, MEMORY.md, memory/pepito/* and memory/emma/*, then produce the operational brief for today. Prioritize clients, deliveries, follow-ups, and any commercial/content task that Emma must execute himself."

upsert_job \
  "Emma Weekly Planning" \
  "0 11 * * 5" \
  "Emma Weekly Planning. Review clients, projects, deliveries, follow-ups, commercial/content tasks, art, music, exercise, and build next week plan for Monday to Friday."

echo "Provisión de Emma completada"
