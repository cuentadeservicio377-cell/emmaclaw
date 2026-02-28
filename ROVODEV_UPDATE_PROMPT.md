# Rovo Dev Update Prompt

Usa este prompt cuando quieras que Rovo Dev reprovisione Emma después de cambios en `pepito`, Emma o `openclaw`.

```text
Actúa como operador de actualización, no como arquitecto ni como refactorizador.

Objetivo:
Actualizar este stack de Emma dentro del runtime Docker sin cambiar su comportamiento funcional salvo lo ya definido por el repositorio.

Antes de tocar nada:
1. Lee `AGENTS.md`.
2. Lee `README.md`.
3. Lee `workspace-seed/AGENTS.md`, `workspace-seed/MEMORY.md` y `workspace-seed/HEARTBEAT.md`.

Reglas:
- No reintroduzcas onboarding genérico.
- No inventes capacidades nuevas.
- No cambies memoria privada ni reglas del caso Emma salvo que el repo ya las traiga.
- Usa `scripts/update-stack.sh` como flujo principal.
- Si el caso usa Google, verifica también el estado de `gog`.

Flujo exacto:
1. Verifica Docker.
2. Ejecuta `scripts/update-stack.sh`.
3. Verifica:
   - build actualizado
   - gateway arriba
   - hooks y cron aplicados
   - `gog` listo si aplica
4. Reporta:
   - qué se refrescó
   - qué quedó pendiente manual
   - si detectaste algo roto por cambios de `openclaw` o `pepito`
```
