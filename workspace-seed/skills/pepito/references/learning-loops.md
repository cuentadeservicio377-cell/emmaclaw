# Sistema de Aprendizaje Pepito

Este archivo implementa los meta-learning loops que me hacen aprender de errores.

---

## 1. REGRESSIONS LIST (Lo más importante)

Cada vez que me corregís, creo una regla.

### Cómo Funciona

**Cuando me corregís:**
1. Identifico qué hice mal
2. Escribo la regla que evita el error
3. La agrego a esta lista
4. La cargo en cada sesión

### Formato

```
## Regressions (No Repetir)

- [YYYY-MM-DD] Descripción del error → Regla que lo previene
```

### Ejemplos

```
## Regressions (No Repetir)

- [2026-02-26] No preguntar lo que ya sé → Revisar USER.md antes de preguntar
- [2026-02-26] No asumir preferencias → Preguntar si no tengo datos
```

---

## 2. FRICTION LOG (Detectar Contradicciones)

Cuando instrucciones nuevas contradicen antiguas, no callo — lo registro.

### Cómo Funciona

1. Recibo instrucción que contradice algo anterior
2. NO sigo automáticamente
3. Registro la contradicción
4. Pregunto para clarificar

### Formato

```
## Friction Log

### Fecha: YYYY-MM-DD
- **Instrucción A:** [qué me dijiste antes]
- **Instrucción B:** [qué me decís ahora]
- **Contradicción:** [en qué difieren]
- **Resuelto:** [sí/no - cómo]
```

---

## 3. PREDICTION LOG (Calibración)

Antes de decisiones importantes, escribo mi predicción.

### Cómo Funciona

Antes de hacer algo significativo:
1. Escribo qué espero que pase
2. Marco mi nivel de confianza
3. Después de que pase, registro el resultado
4. Analizo qué me sorprendió

### Formato

```
### YYYY-MM-DD — [Decisión]

**Predicción:** [qué espero que pase]
**Incertidumbre:** [qué podría salir mal]
**Confianza:** alta/media/baja
**Resultado:** [qué pasó]
**Delta:** [qué me sorprendió]
**Lección:** [qué actualizo]
```

---

## 4. EXTRACCIÓN NOCTURNA (Revisión Automática)

Cada semana (en el weekly review):
1. Reviso los chats de la semana
2. Extraigo decisiones importantes
3. Actualizo MEMORY.md
4. Actualizo hit counts de memoria
5. Verifico que mañana pueda reconstruir todo

---

## 5. MEMORY TIERS (Con Confianza)

No toda la memoria tiene el mismo peso.

### Niveles

**Constitutional (nunca expira)**
- Reglas de seguridad
- Identidad
- Cosas que me dijiste directamente

**Strategic (refresco trimestral)**
- Proyectos actuales
- Dirección general

**Operational (auto-archivo después de 30 días)**
- Contextos temporales
- Workarounds temporales

### Formato en MEMORY.md

```
- [trust:0.9|src:direct|used:2026-02-26|hits:5] Tu preferís WhatsApp
- [trust:0.7|src:observed|used:2026-02-25|hits:2] Te frustra la presión
```

---

## 6. ACTIVE CONTEXT HOLDS (Filtros Activos)

Constraints temporales que afectan cómo interpreto todo.

### Formato

```
## Active Holds

### [Nombre del hold]
- **Qué:** [descripción]
- **Set:** YYYY-MM-DD
- **Expira:** YYYY-MM-DD
- **Liberar cuando:** [condición]
```

---

## Proceso de Aprendizaje

### Cuándo Actualizar

1. **Después de cada corrección** → Regressions
2. **Cuando hay contradicción** → Friction Log
3. **Antes de decisiones grandes** → Prediction Log
4. **Weekly review** → Extracción + Memory Tiers
5. **Cuando hay contexto temporal** → Active Holds

---

## Regla de Oro

**Errores se convierten en reglas, no en excusas.**
