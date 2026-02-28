#!/bin/bash
set -euo pipefail

DIST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG_DIR="${OPENCLAW_CONFIG_DIR:-$DIST_DIR/state/config}"
WORKSPACE_DIR="${OPENCLAW_WORKSPACE_DIR:-$DIST_DIR/state/workspace}"
SEED_FILE="$DIST_DIR/config/openclaw.seed.jsonc"
TARGET_CONFIG="$CONFIG_DIR/openclaw.json"
TARGET_META="$CONFIG_DIR/distribution-meta.json"

mkdir -p "$CONFIG_DIR" "$CONFIG_DIR/identity" "$WORKSPACE_DIR"
rsync -a "$DIST_DIR/workspace-seed/" "$WORKSPACE_DIR/"

SEED_FILE="$SEED_FILE" TARGET_CONFIG="$TARGET_CONFIG" TARGET_META="$TARGET_META" node <<'NODE'
const fs = require('node:fs');

const seedPath = process.env.SEED_FILE;
const targetConfigPath = process.env.TARGET_CONFIG;
const targetMetaPath = process.env.TARGET_META;

function readJson(path) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch {
    return {};
  }
}

function merge(base, incoming) {
  if (Array.isArray(base) || Array.isArray(incoming)) return incoming;
  if (!base || typeof base !== 'object') return incoming;
  if (!incoming || typeof incoming !== 'object') return incoming;
  const out = { ...base };
  for (const [key, value] of Object.entries(incoming)) {
    if (key in out) out[key] = merge(out[key], value);
    else out[key] = value;
  }
  return out;
}

const seed = readJson(seedPath);
const existing = readJson(targetConfigPath);
const runtimeConfig = seed.runtimeConfig && typeof seed.runtimeConfig === 'object' ? seed.runtimeConfig : {};
const distribution = seed.distribution && typeof seed.distribution === 'object' ? seed.distribution : {};
const merged = merge(existing, runtimeConfig);

fs.writeFileSync(targetConfigPath, JSON.stringify(merged, null, 2) + '\n', 'utf8');
fs.writeFileSync(targetMetaPath, JSON.stringify(distribution, null, 2) + '\n', 'utf8');
NODE

echo "Emma seed instalada en: $WORKSPACE_DIR"
echo "Runtime config instalada en: $TARGET_CONFIG"
echo "Metadata futura de dashboard instalada en: $TARGET_META"
echo "Siguiente paso: docker compose build"
echo "Después: docker compose run --rm openclaw-cli onboard"
echo "Luego: $DIST_DIR/scripts/cron.seed.sh"
