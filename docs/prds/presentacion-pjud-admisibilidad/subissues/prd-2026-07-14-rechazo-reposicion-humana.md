# PRD: Rechazo e hipótesis de reposición humana

**Tracker Task ID:** [pendiente de asignar]
**Creado:** 2026-07-14 | **Reunión:** Levantamiento proyecto cobranza judicial PJUD
**Participantes:** Equipo Producto ProdBooster, Equipo Legal/Operaciones, Equipo Desarrollo
**Estado:** Draft
**Tipo Linear:** Subissue
**Parent Linear Issue:** presentacion-pjud-admisibilidad
**Autonomía:** SOLO HUMANO

---

## 1. Problema y Contexto

Este subissue pertenece a `presentacion-pjud-admisibilidad`. El foco es alertar rechazo y plazo, dejando la decisión de reposición o apelación al abogado. El PRD describe qué debe pasar desde el punto de vista legal y operativo, sin cerrar el cómo técnico.

## 2. Objetivos

- [ ] OBJ-01: Confirmar y documentar funcionalmente: alertar rechazo y plazo, dejando la decisión de reposición o apelación al abogado.
- [ ] OBJ-02: Asegurar que un rechazo no avanza automáticamente.
- [ ] OBJ-03: Dejar restricciones legales, operativas y de autonomía visibles para desarrollo.

## 3. No-Goals

> Lo que explícitamente NO entra en este ticket.

- Definir arquitectura, librerías, servicios o decisiones internas de implementación.
- Cambiar reglas legales fuera del flujo de cobranza judicial automotriz por pagaré.
- Automatizar decisiones reservadas al abogado o a la financiera.

## 4. User Stories

| Como... | Quiero... | Para... |
|---------|-----------|---------|
| Equipo legal y operaciones | operar y validar: alertar rechazo y plazo, dejando la decisión de reposición o apelación al abogado | mantener el flujo judicial correcto y trazable |
| Equipo técnico | contar con reglas funcionales claras sobre rechazo e hipótesis de reposición humana | desarrollar sin suponer criterios legales o de negocio |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** Debe garantizar que un rechazo no avanza automáticamente.
- **RF-02:** Debe documentar que el plazo de reposición queda visible.
- **RF-03:** Debe documentar la regla funcional o consecuencia: el abogado decide si procede recurso.
- **RF-04:** Debe dejar trazabilidad suficiente para auditar la decisión o estado del flujo.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: Un rechazo no avanza automáticamente.
- [ ] AC-02: El plazo de reposición queda visible.
- [ ] AC-03: El abogado decide si procede recurso.
- [ ] AC-04: El flujo registra fecha, actor u origen y motivo de cada cambio de estado relevante.

## 7. Decisiones y Preguntas Abiertas

| # | Pregunta | Decisión | Owner |
|---|----------|----------|-------|
| 1 | ¿La regla funcional requiere validación adicional del estudio antes de desarrollo? | [Pendiente de confirmar] | Producto / Legal |
| 2 | ¿Existen ejemplos reales o plantillas que deban adjuntarse al ticket? | [Pendiente de adjuntar] | Operaciones |

## 8. Trabajo Futuro

- Automatizar pruebas funcionales sobre los escenarios legales cubiertos por este ticket.
- Ajustar el alcance cuando existan datos reales de operación y retroalimentación del estudio.
