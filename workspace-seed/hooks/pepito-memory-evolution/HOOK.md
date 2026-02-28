---
name: pepito-memory-evolution
description: "Capture conversational signals and build progressive memory files for Pepito"
metadata:
  {
    "openclaw":
      {
        "emoji": "🧠",
        "events": ["message:received", "message:sent", "command:new", "command:reset"],
      },
  }
---

# Pepito Memory Evolution Hook

Captures each conversation turn and keeps Pepito's memory flowing.

## What It Does

- Appends daily logs under `memory/pepito/daily/YYYY-MM-DD.md`
- Appends human signals to `memory/pepito/inbox.md`
- Extracts lightweight facts/goals and records them in `USER.md` and `MEMORY.md`
- Adds reset/new session markers to the daily log

## Notes

- This hook does not call external APIs.
- It is deterministic and safe to run on every turn.
