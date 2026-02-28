# Emma OpenClaw Distribution

## Scope

This repository has two operating surfaces:

1. `workspace-seed/`
   Emma's behavioral source of truth. This is where Pepito base memory, Emma-specific memory, hooks, skills, and operating instructions live.
2. `config/` and `scripts/`
   Runtime provisioning for OpenClaw and local tooling.

## Core Rules

- Do not reintroduce a generic onboarding wizard.
- Emma operates from transcript, seeded memory, and case-specific workflow.
- Business operations and agenda go first.
- The assistant should act as operator and planner, not as a generic consultant or content creator.
- Keep OpenClaw runtime changes separate from Emma-specific workspace changes.

## File Map

- `workspace-seed/AGENTS.md`
  Emma operating contract inside OpenClaw.
- `workspace-seed/MEMORY.md`
  Global memory index for Emma.
- `workspace-seed/HEARTBEAT.md`
  Rules for proactive review and daily/weekly cadence.
- `config/openclaw.seed.jsonc`
  Seeded runtime config and distribution metadata.
- `scripts/init-emma.sh`
  Seeds config and workspace into `state/`.
- `scripts/cron.seed.sh`
  Reapplies heartbeat, hooks, and cron jobs.
- `docker-compose.yml`
  OpenClaw runtime.
- `docker-compose.rovodev.yml`
  Rovo Dev workspace container for this repo.

## Rovo Dev Instructions

- Treat this repository as the project root.
- Read this file first, then `workspace-seed/AGENTS.md`, `workspace-seed/MEMORY.md`, and the relevant `workspace-seed/memory/emma/*` files before proposing changes.
- If asked to change Emma behavior, edit `workspace-seed/` first unless the issue is clearly runtime-level.
- Do not assume undocumented OpenClaw features or Atlassian Rovo capabilities.
