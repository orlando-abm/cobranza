# PRD: Ingesta ZIP global de financiera

**Tracker Task ID:** [pendiente de asignar]
**Creado:** 2026-07-14 | **Reunión:** Levantamiento proyecto cobranza judicial PJUD
**Participantes:** Equipo Producto ProdBooster, Equipo Legal/Operaciones, Equipo Desarrollo
**Estado:** Draft
**Tipo Linear:** Subissue
**Parent Linear Issue:** demanda-ingesta-validacion
**Autonomía:** AUTOMÁTICO

---

## 1. Problema y Contexto

Este subissue pertenece a `demanda-ingesta-validacion`. El foco es procesar un único ZIP con múltiples operaciones y crear demandas candidatas separadas. El PRD describe qué debe pasar desde el punto de vista legal y operativo, sin cerrar el cómo técnico.

## 2. Objetivos

- [ ] OBJ-01: Confirmar y documentar funcionalmente: procesar un único ZIP con múltiples operaciones y crear demandas candidatas separadas.
- [ ] OBJ-02: Asegurar que el ZIP global crea demandas previas a causa, no causas judiciales.
- [ ] OBJ-03: Dejar restricciones legales, operativas y de autonomía visibles para desarrollo.

## 3. No-Goals

> Lo que explícitamente NO entra en este ticket.

- Definir arquitectura, librerías, servicios o decisiones internas de implementación.
- Cambiar reglas legales fuera del flujo de cobranza judicial automotriz por pagaré.
- Automatizar decisiones reservadas al abogado o a la financiera.

## 4. User Stories

| Como... | Quiero... | Para... |
|---------|-----------|---------|
| Equipo legal y operaciones | operar y validar: procesar un único ZIP con múltiples operaciones y crear demandas candidatas separadas | mantener el flujo judicial correcto y trazable |
| Equipo técnico | contar con reglas funcionales claras sobre ingesta zip global de financiera | desarrollar sin suponer criterios legales o de negocio |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** Debe garantizar que el ZIP global crea demandas previas a causa, no causas judiciales.
- **RF-02:** Debe documentar que cada operación conserva referencia a sus documentos origen.
- **RF-03:** Debe documentar la regla funcional o consecuencia: los documentos no asociables quedan pendientes de revisión.
- **RF-04:** Debe dejar trazabilidad suficiente para auditar la decisión o estado del flujo.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: El ZIP global crea demandas previas a causa, no causas judiciales.
- [ ] AC-02: Cada operación conserva referencia a sus documentos origen.
- [ ] AC-03: Los documentos no asociables quedan pendientes de revisión.
- [ ] AC-04: El flujo registra fecha, actor u origen y motivo de cada cambio de estado relevante.

## 7. Decisiones y Preguntas Abiertas

| # | Pregunta | Decisión | Owner |
|---|----------|----------|-------|
| 1 | ¿La regla funcional requiere validación adicional del estudio antes de desarrollo? | [Pendiente de confirmar] | Producto / Legal |
| 2 | ¿Existen ejemplos reales o plantillas que deban adjuntarse al ticket? | [Pendiente de adjuntar] | Operaciones |

## 8. Trabajo Futuro

- Automatizar pruebas funcionales sobre los escenarios legales cubiertos por este ticket.
- Ajustar el alcance cuando existan datos reales de operación y retroalimentación del estudio.
