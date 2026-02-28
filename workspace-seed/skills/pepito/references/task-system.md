# Sistema de Tareas Pepito

*Cómo manejo tareas, pendientes y seguimientos*

---

## Tipos de Tareas

### 1. Tareas del Usuario

**Estructura en goals.md:**
```markdown
## Tarea: [Nombre]

- **Qué:** [descripción específica]
- **Por qué:** [importancia/contexto]
- **Próximo paso:** [una acción]
- **Fecha límite:** [si hay]
- **Status:** [pendiente/en-progreso/hecha/bloqueada]
- **Última actualización:** YYYY-MM-DD

### Sub-tareas
- [ ] [sub-tarea 1]
- [ ] [sub-tarea 2]
```

### 2. Tareas de Seguimiento

**Cuándo crear:**
- Decís "quiero hacer X"
- Acordamos un follow-up
- Hay deadline pendiente

### 3. Tareas Automáticas

**Generadas por el sistema:**
- Revisiones programadas
- Actualizaciones de memoria
- Check-ins

---

## Flujo de Tareas

### Recepción

```
Usuario dice: "Quiero [X]"

1. Clarificar:
   - Para cuándo?
   - Por qué ahora?
   - Qué has intentado antes?

2. Estructurar:
   - Crear entrada en goals.md
   - Definir próximo paso específico
   - Definir fecha si aplica

3. Confirmar:
   - "Entendido. Vamos a [próximo paso]. Confirmás?"
```

### Ejecución

```
1. Revisar goals.md para la tarea
2. Si tiene sub-tareas: verificar cada una
3. Ejecutar lo que se pueda
4. Actualizar status
5. Documentar resultado
```

### Seguimiento

```
1. En cada check-in: revisar tareas pendientes
2. Preguntar progreso específico
3. Si no hay progreso: preguntar obstáculos
4. Si está blocked: identificar原因
5. Reprogramar si es necesario
```

---

## Gestión de Pendientes

### Antes del Check-in

1. Leer goals.md
2. Identificar tareas pendientes
3. Identificar tareas próximas (fechas)
4. Preparar preguntas específicas

### Durante Check-in

**No preguntar:**
- "¿Qué tienes pendiente?" (genérico)

**Preguntar:**
- "Mencionaste que ibas a [tarea específica]. ¿Qué pasó?"
- "La fecha es [fecha]. ¿Cómo vas?"
- "[Sub-tarea] está hecha. ¿Pasamos a la siguiente?"

### Después del Check-in

1. Actualizar status en goals.md
2. Si reprogramado: documentar原因
3. Si completado: celebrar
4. Si bloqueado: identificar siguiente paso

---

## Sistema de Priorización

### Matrix de Prioridades

| Prioridad | Criteria | Acción |
|-----------|----------|--------|
| 🔴 Alta | Deadline cerca, bloquea otras | Hoy |
| 🟡 Media | Importante, sin deadline | Esta semana |
| 🟢 Baja | Nice to have | Cuando haya tiempo |

---

## Reglas de Tareas

### Always

- [ ] Una tarea = una acción específica
- [ ] Siempre hay próximo paso
- [ ] Actualizar después de cada interacción
- [ ] Revisar en cada check-in
- [ ] Celebrar completions

### Never

- [ ] Tasks vagos ("trabajar en X")
- [ ] Sin fecha límite cuando importa
- [ ] Olvidar follow-ups
- [ ] No preguntar sobre progreso
- [ ] Dejar tasks sin actualizar

---

_Este archivo complementa goals.md y el sistema de memoria_
