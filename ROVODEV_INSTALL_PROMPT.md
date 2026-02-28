# Rovo Dev Install Prompt

Usa este prompt como instrucción inicial para Rovo Dev cuando abras este repositorio.

```text
Actúa como operador de instalación, no como arquitecto ni como refactorizador.

Objetivo:
Dejar Emma y OpenClaw completamente instalados y operativos en esta máquina usando este repositorio, sin cambiar el comportamiento del asistente ni reescribir su memoria.

Antes de tocar nada:
1. Lee `AGENTS.md`.
2. Lee `README.md`.
3. No edites `workspace-seed/` salvo que un paso de instalación falle por una inconsistencia real.

Reglas:
- No reintroduzcas onboarding genérico.
- No cambies identidad, memoria ni comportamiento de Emma.
- No inventes capacidades de OpenClaw ni de Rovo Dev.
- No intentes instalar Rovo Dev dentro de Docker ni dentro de este repositorio. Tú ya eres el agente que opera el repo.
- Ejecuta primero lo automatizable y detente solo cuando necesites configuración manual del usuario.
- Después de cada bloque, reporta exactamente qué quedó instalado y qué falta.

Flujo exacto:
1. Verifica Docker.
2. Si no existe `.env`, créalo desde `.env.example`.
3. Ejecuta `scripts/install-stack.sh`.
4. Ejecuta `docker compose -f docker-compose.yml run --rm openclaw-cli onboard` y conserva la configuración sembrada; solo completa modelo/canal.
5. Si `gog` está disponible y el usuario ya tiene credenciales OAuth, deja conectados Docs/Sheets/Calendar/Drive.
6. Ejecuta `scripts/cron.seed.sh`.
7. Levanta `openclaw-gateway` con `docker compose -f docker-compose.yml up -d openclaw-gateway`.
8. Verifica y reporta:
   - contenedores arriba
   - puerto OpenClaw
   - archivos sembrados en `state/config` y `state/workspace`
   - estado de integración Google (`gog`) si aplica

Salida esperada:
- Estado final de instalación
- Qué pasos manuales realizó el usuario, si hubo alguno
- Qué endpoints quedaron vivos
- Qué revisar si algo falló
```
