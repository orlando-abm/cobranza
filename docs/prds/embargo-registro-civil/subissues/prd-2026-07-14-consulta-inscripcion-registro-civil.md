# PRD: Consulta de inscripción en Registro Civil

**Tracker Task ID:** [pendiente de asignar]
**Creado:** 2026-07-14 | **Reunión:** Levantamiento proyecto cobranza judicial PJUD
**Participantes:** Equipo Producto ProdBooster, Equipo Legal/Operaciones, Equipo Desarrollo
**Estado:** Draft
**Tipo Linear:** Subissue
**Parent Linear Issue:** embargo-registro-civil
**Autonomía:** AUTOMÁTICO

---

## 1. Problema y Contexto

Este subissue pertenece a `embargo-registro-civil`. El foco es consultar inscripción por patente desde el día 25 y reintentar si sigue pendiente. El PRD describe qué debe pasar desde el punto de vista legal y operativo, sin cerrar el cómo técnico.

## 2. Objetivos

- [ ] OBJ-01: Confirmar y documentar funcionalmente: consultar inscripción por patente desde el día 25 y reintentar si sigue pendiente.
- [ ] OBJ-02: Asegurar que no hay consulta antes del día 25 salvo decisión explícita.
- [ ] OBJ-03: Dejar restricciones legales, operativas y de autonomía visibles para desarrollo.

## 3. No-Goals

> Lo que explícitamente NO entra en este ticket.

- Definir arquitectura, librerías, servicios o decisiones internas de implementación.
- Cambiar reglas legales fuera del flujo de cobranza judicial automotriz por pagaré.
- Automatizar decisiones reservadas al abogado o a la financiera.

## 4. User Stories

| Como... | Quiero... | Para... |
|---------|-----------|---------|
| Equipo legal y operaciones | operar y validar: consultar inscripción por patente desde el día 25 y reintentar si sigue pendiente | mantener el flujo judicial correcto y trazable |
| Equipo técnico | contar con reglas funcionales claras sobre consulta de inscripción en registro civil | desarrollar sin suponer criterios legales o de negocio |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** Debe garantizar que no hay consulta antes del día 25 salvo decisión explícita.
- **RF-02:** Debe documentar que resultado pendiente agenda reintento.
- **RF-03:** Debe documentar la regla funcional o consecuencia: aceptada y rechazada producen caminos distintos.
- **RF-04:** Debe dejar trazabilidad suficiente para auditar la decisión o estado del flujo.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: No hay consulta antes del día 25 salvo decisión explícita.
- [ ] AC-02: Un resultado pendiente agenda reintento.
- [ ] AC-03: Una inscripción aceptada y una rechazada producen caminos distintos.
- [ ] AC-04: El flujo registra fecha, actor u origen y motivo de cada cambio de estado relevante.

## 7. Decisiones y Preguntas Abiertas

| # | Pregunta | Decisión | Owner |
|---|----------|----------|-------|
| 1 | ¿La regla funcional requiere validación adicional del estudio antes de desarrollo? | [Pendiente de confirmar] | Producto / Legal |
| 2 | ¿Existen ejemplos reales o plantillas que deban adjuntarse al ticket? | [Pendiente de adjuntar] | Operaciones |

## 8. Trabajo Futuro

- Automatizar pruebas funcionales sobre los escenarios legales cubiertos por este ticket.
- Ajustar el alcance cuando existan datos reales de operación y retroalimentación del estudio.
