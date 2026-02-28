# Emma OpenClaw Distribution

Distribución instalable de Emma sobre OpenClaw + Pepito y workspace preparado para Rovo Dev en Docker.

## Qué resuelve

- Emma no se instala como parche posterior.
- OpenClaw arranca con workspace preconfigurado.
- Pepito ya viene absorbido en memoria base, skills y hooks del workspace.
- La transcripción ya está convertida a seed operativo.
- El repo también queda listo para abrirse con Rovo Dev dentro de un contenedor Linux.
- El asistente nace como operador de negocio + agenda, no como chatbot ni wizard genérico.

## Estructura

- `workspace-seed/`: bootstrap files, memoria base Pepito y memoria específica Emma.
- `config/openclaw.seed.jsonc`: manifiesto con runtime config válida + metadata futura de dashboard.
- `scripts/prepare-openclaw-source.sh`: clona o actualiza OpenClaw dentro de `state/vendor/openclaw`.
- `scripts/init-emma.sh`: siembra `state/config` y `state/workspace`.
- `scripts/install-stack.sh`: ejecuta la preparación automatizable de OpenClaw + Rovo.
- `scripts/cron.seed.sh`: activa heartbeat, hooks y cron usando `openclaw-cli`.
- `docker-compose.yml`: runtime Docker de OpenClaw.
- `Dockerfile.rovodev`: imagen Linux con ACLI + Rovo Dev CLI.
- `docker-compose.rovodev.yml`: workspace container para usar Rovo Dev sobre este repo.
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

## Instalar Rovo Dev en Docker para este repo

Rovo Dev CLI oficial se instala a través de ACLI y se autentica con `acli rovodev auth login`. Este repo ya queda preparado para correrlo dentro de Docker y exponer server mode en el puerto `8123`.

### Preparación

1. Copia `.env.example` a `.env`.
2. Si vas a trabajar desde otra ruta, ajusta:
   - `OPENCLAW_SOURCE_DIR`
   - `ROVODEV_WORKSPACE_DIR`
   - `ROVODEV_HOME_DIR`
   - `ROVODEV_PORT`
3. Construye la imagen de Rovo:

```bash
docker compose -f docker-compose.rovodev.yml build
```

### Preparación automatizable completa

Si quieres dejar casi todo listo antes del login manual:

```bash
scripts/install-stack.sh
```

Ese script:

- crea `.env` si no existe
- clona o actualiza OpenClaw en `state/vendor/openclaw`
- siembra `state/config` y `state/workspace`
- construye la imagen de OpenClaw
- construye la imagen de Rovo Dev

Después solo quedan los pasos interactivos de login y onboarding.

### Login interactivo

Ejecuta una shell dentro del contenedor:

```bash
docker compose -f docker-compose.rovodev.yml run --rm rovodev-cli
```

Dentro del contenedor:

```bash
acli rovodev auth login
acli rovodev auth status
```

El volumen `state/rovodev-home/` conserva la sesión y la configuración entre reinicios.

### Server mode

Levanta Rovo Dev como servidor local:

```bash
docker compose -f docker-compose.rovodev.yml up -d rovodev-server
```

Endpoint expuesto:

- `http://localhost:8123/sse`

Para ver logs:

```bash
docker compose -f docker-compose.rovodev.yml logs -f rovodev-server
```

Para detenerlo:

```bash
docker compose -f docker-compose.rovodev.yml down
```

## Qué leerá Rovo Dev

Cuando Rovo Dev abra este repo, su entrada principal debe ser:

1. `AGENTS.md`
2. `workspace-seed/AGENTS.md`
3. `workspace-seed/MEMORY.md`
4. `workspace-seed/HEARTBEAT.md`
5. `workspace-seed/memory/emma/*`

Eso evita que vuelva a comportarse como wizard genérico y lo mantiene alineado al caso Emma.

Si quieres darle una instrucción exacta para instalar todo, usa el prompt de [ROVODEV_INSTALL_PROMPT.md](/Users/pablomeneses/Documents/New%20project/codex-fleet-os/distributions/emma-openclaw/ROVODEV_INSTALL_PROMPT.md).

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

Y el mismo repo queda listo para:

- abrir una shell Rovo Dev dentro de Docker
- autenticar Rovo Dev con Atlassian
- levantar server mode local por SSE
- trabajar sobre el caso Emma sin reentrenar el contexto base
