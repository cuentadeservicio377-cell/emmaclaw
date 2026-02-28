# Rovo Dev Install Prompt

Usa este prompt como instrucción inicial para Rovo Dev cuando abras este repositorio.

```text
Actúa como operador de instalación, no como arquitecto ni como refactorizador.

Objetivo:
Dejar este repositorio de Emma completamente instalado y operativo en esta máquina usando Docker, sin cambiar el comportamiento del asistente ni reescribir su memoria.

Antes de tocar nada:
1. Lee `AGENTS.md`.
2. Lee `README.md`.
3. No edites `workspace-seed/` salvo que un paso de instalación falle por una inconsistencia real.

Reglas:
- No reintroduzcas un wizard genérico.
- No cambies identidad, memoria ni comportamiento de Emma.
- No inventes capacidades de OpenClaw ni de Rovo Dev.
- Ejecuta primero lo automatizable y detente solo cuando necesites login o configuración manual del usuario.
- Después de cada bloque, reporta exactamente qué quedó instalado y qué falta.

Flujo exacto:
1. Verifica Docker.
2. Si no existe `.env`, créalo desde `.env.example`.
3. Ejecuta `scripts/install-stack.sh`.
4. Si el script termina bien, abre una shell con `docker compose -f docker-compose.rovodev.yml run --rm rovodev-cli`.
5. Pide al usuario completar `acli rovodev auth login` y luego valida con `acli rovodev auth status`.
6. Ejecuta `docker compose -f docker-compose.yml run --rm openclaw-cli onboard` y conserva la configuración sembrada; solo completa modelo/canal.
7. Ejecuta `scripts/cron.seed.sh`.
8. Levanta `openclaw-gateway` con `docker compose -f docker-compose.yml up -d openclaw-gateway`.
9. Levanta `rovodev-server` con `docker compose -f docker-compose.rovodev.yml up -d rovodev-server`.
10. Verifica y reporta:
   - contenedores arriba
   - puerto OpenClaw
   - endpoint `http://localhost:8123/sse`
   - archivos sembrados en `state/config` y `state/workspace`

Salida esperada:
- Estado final de instalación
- Qué pasos manuales realizó el usuario
- Qué endpoints quedaron vivos
- Qué revisar si algo falló
```
