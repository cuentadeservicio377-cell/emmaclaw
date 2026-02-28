# Sistema de Memoria Profundo Pepito

*La memoria es mi cerebro. Todo pasa por aquí.*

---

## Los 5 Archivos Core

| Archivo | Qué Es |
|---------|--------|
| SOUL.md | Mi personalidad |
| IDENTITY.md | Mi nombre y rol |
| USER.md | TODO sobre ti |
| MEMORY.md | Decisiones y contexto |
| TOOLS.md | Lo que puedo usar |

---

## Archivos de Soporte

| Archivo | Propósito |
|---------|-----------|
| REGRESSIONS.md | Errores que no repetir |
| FRICTION_LOG.md | Contradicciones |
| PREDICTION_LOG.md | Calibración |
| ACTIVE_HOLDS.md | Filtros temporales |
| goals.md | Tareas y metas |
| people.md | Gente importante |
| daily/ | Notas diarias |

---

## Memory Tiers

### Constitutional (trust: 1.0)
Nunca expira. Core de identidad.

```
[trust:1.0|src:direct|used:2026-02-26]
- Nombre real
- Reglas de seguridad
- Cosas que dijiste explícitamente
```

### Strategic (trust: 0.8-0.9)
Refrescar trimestralmente.

```
[trust:0.9|src:direct|refresh:2026-03]
- Metas principales
- Proyectos activos
- Decisiones importantes
```

### Operational (trust: 0.7)
Auto-archivar después de 30 días.

```
[trust:0.7|src:observed|used:2026-02-20]
- Contextos temporales
- Workarounds recientes
```

---

## Metadata

```
[trust:X.X|src:direct|used:YYYY-MM-DD|hits:N]
```

| src | Significado | Trust |
|-----|-------------|-------|
| direct | Lo dijiste explícitamente | 1.0 |
| confirmed | Lo confirmaste | 0.9 |
| observed | Lo observé | 0.7 |
| inferred | Lo inferí | 0.5 |

---

## Flujo de Memoria

### ANTES de responder
1. Leer USER.md
2. Leer MEMORY.md
3. Leer goals.md
4. Leer REGRESSIONS.md

### DESPUÉS de interactuar
- Si hay nueva info → USER.md
- Si hay progreso/decisión → MEMORY.md
- Si me corregiste → REGRESSIONS.md
- Si hay predicción → PREDICTION_LOG.md

---

## Reglas

### NUNCA

- [ ] Preguntar lo que ya sé
- [ ] Asumir sin evidencia
- [ ] Olvidar correcciones
- [ ] Ignorar patrones

### SIEMPRE

- [ ] Atualizar después de cada chat
- [ ] Usar trust scores
- [ ] Conectar información
- [ ] Referenciar contexto previo

---

## Ejemplo

### Input:
"Trabajo mucho y no tengo tiempo para ejercicio"

### Mi Proceso:

**1. Lectura previa:**
```
USER.md → no hay info de ejercicio
MEMORY.md → no hay metas de salud
```

**2. Razonamiento:**
- Nueva información: stress por trabajo
- Meta implícita: quiere ejercicio

**3. Response:**
> "Entendí. Cuántas horas trabajás? Hay algún momento del día que sea más flexible?"

**4. post-Response:**
Actualizo USER.md:
```markdown
## Contexto
- Trabajo: muchas horas [observed]
- Ejercicio: none [observed]
```

---

_Este archivo es el core del sistema de memoria._
