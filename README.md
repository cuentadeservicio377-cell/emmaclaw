# Emma OpenClaw Distribution

Distribución instalable de Emma sobre OpenClaw + Pepito, preparada para que Rovo Dev opere este repo e instale el stack correcto.

## Qué resuelve

- Emma no se instala como parche posterior.
- OpenClaw arranca con workspace preconfigurado.
- Pepito ya viene absorbido en memoria base, skills y hooks del workspace.
- La transcripción ya está convertida a seed operativo.
- El repo queda listo para que Rovo Dev opere la instalación directamente.
- El asistente nace como operador de negocio + agenda, no como chatbot ni onboarding genérico.

## Estructura

- `workspace-seed/`: bootstrap files, memoria base Pepito y memoria específica Emma.
- `config/openclaw.seed.jsonc`: manifiesto con runtime config válida + metadata futura de dashboard.
- `scripts/prepare-openclaw-source.sh`: clona o actualiza OpenClaw dentro de `state/vendor/openclaw`.
- `scripts/init-emma.sh`: siembra `state/config` y `state/workspace`.
- `scripts/install-stack.sh`: ejecuta la preparación automatizable de Emma + OpenClaw.
- `scripts/update-stack.sh`: re-siembra Emma, reconstruye imagen y reprovisiona después de cambios de base o runtime.
- `scripts/cron.seed.sh`: activa heartbeat, hooks y cron usando `openclaw-cli`.
- `docker-compose.yml`: runtime Docker de OpenClaw.
- `AGENTS.md`: instrucciones de proyecto para Rovo Dev.
- `ROVODEV_INSTALL_PROMPT.md`: prompt listo para pedirle a Rovo Dev que haga la instalación.

## Requisitos para Windows

- Windows 11 o Windows 10 con WSL2 habilitado.
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) corriendo.
- Cuenta de Atlassian con acceso a Rovo Dev.
- Este repo clonado en una ruta local simple.

## Instalar Emma con OpenClaw

1. Clona este repo en la máquina destino.
2. Copia `.env.example` a `.env` si quieres personalizar rutas o puertos.
3. Prepara OpenClaw fuente:

```bash
scripts/prepare-openclaw-source.sh
```

4. Ejecuta `scripts/init-emma.sh`.
5. Construye imagen:

```bash
docker compose build
```

6. Completa setup mínimo de modelo/canal:

```bash
docker compose run --rm openclaw-cli onboard
```

Conserva la configuración sembrada y completa solo lo faltante.

7. Ejecuta:

```bash
scripts/cron.seed.sh
```

8. Levanta gateway:

```bash
docker compose up -d openclaw-gateway
```

## Integración Google

Emma también debe tener `gog` listo de base para exportación operativa, Google Calendar y artefactos compartidos:

```bash
brew install steipete/tap/gogcli
gog auth credentials /path/to/client_secret.json
gog auth add you@gmail.com --services gmail,calendar,drive,contacts,docs,sheets
gog auth list
```

Uso esperado del caso:
- Google Sheets para exportar CRM ligero si hace falta
- Google Calendar para agenda visible
- Google Docs/Drive para material operativo compartido

## Preparación automatizable completa

Si quieres dejar casi todo listo antes del login manual:

```bash
scripts/install-stack.sh
```

Ese script:

- crea `.env` si no existe
- clona o actualiza OpenClaw en `state/vendor/openclaw`
- siembra `state/config` y `state/workspace`
- construye la imagen de OpenClaw

Después solo quedan onboarding, provisión y arranque del gateway.

## Qué leerá Rovo Dev

Cuando Rovo Dev abra este repo, su entrada principal debe ser:

1. `AGENTS.md`
2. `workspace-seed/AGENTS.md`
3. `workspace-seed/MEMORY.md`
4. `workspace-seed/HEARTBEAT.md`
5. `workspace-seed/memory/emma/*`

Eso evita que vuelva a comportarse como onboarding genérico y lo mantiene alineado al caso Emma.

Si quieres darle una instrucción exacta para instalar todo, usa el prompt de [ROVODEV_INSTALL_PROMPT.md](/Users/pablomeneses/Documents/New%20project/codex-fleet-os/distributions/emma-openclaw/ROVODEV_INSTALL_PROMPT.md). Ese prompt asume que Rovo Dev ya está corriendo como tu agente, no que tenga que instalarse dentro del proyecto.

Si quieres que Rovo reprovisione Emma después de cambios de `pepito` o `openclaw`, usa [ROVODEV_UPDATE_PROMPT.md](/Users/pablomeneses/Documents/New%20project/codex-fleet-os/distributions/emma-openclaw/ROVODEV_UPDATE_PROMPT.md).

## Resultado esperado

Emma queda corriendo con:

- objetivo operativo ya sembrado
- memoria base de Pepito
- memoria vertical de Emma
- hooks activos
- cron activo
- heartbeat activo
- daily brief 7 AM
- weekly planning viernes 11 AM

Y el mismo repo queda listo para que Rovo Dev trabaje sobre el caso Emma sin reentrenar el contexto base ni mezclar su propia instalación con la del asistente.
