# PRD: Marcar demanda como presentada

**Tracker Task ID:** [pendiente de asignar]
**Creado:** 2026-07-14 | **Reunión:** Levantamiento proyecto cobranza judicial PJUD
**Participantes:** Equipo Producto ProdBooster, Equipo Legal/Operaciones, Equipo Desarrollo
**Estado:** Draft
**Tipo Linear:** Subissue
**Parent Linear Issue:** presentacion-pjud-admisibilidad
**Autonomía:** CON APROBACIÓN

---

## 1. Problema y Contexto

Este subissue pertenece a `presentacion-pjud-admisibilidad`. El foco es registrar presentación manual v1 para crear causa, Rol, reloj e hito 5%. El PRD describe qué debe pasar desde el punto de vista legal y operativo, sin cerrar el cómo técnico.

## 2. Objetivos

- [ ] OBJ-01: Confirmar y documentar funcionalmente: registrar presentación manual v1 para crear causa, Rol, reloj e hito 5%.
- [ ] OBJ-02: Asegurar que la demanda sale de la bandeja de demandas.
- [ ] OBJ-03: Dejar restricciones legales, operativas y de autonomía visibles para desarrollo.

## 3. No-Goals

> Lo que explícitamente NO entra en este ticket.

- Definir arquitectura, librerías, servicios o decisiones internas de implementación.
- Cambiar reglas legales fuera del flujo de cobranza judicial automotriz por pagaré.
- Automatizar decisiones reservadas al abogado o a la financiera.

## 4. User Stories

| Como... | Quiero... | Para... |
|---------|-----------|---------|
| Equipo legal y operaciones | operar y validar: registrar presentación manual v1 para crear causa, Rol, reloj e hito 5% | mantener el flujo judicial correcto y trazable |
| Equipo técnico | contar con reglas funcionales claras sobre marcar demanda como presentada | desarrollar sin suponer criterios legales o de negocio |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** Debe garantizar que la demanda sale de la bandeja de demandas.
- **RF-02:** Debe documentar que se crea causa con Rol o estado en trámite documentado.
- **RF-03:** Debe documentar la regla funcional o consecuencia: se activa hito de cobro 5% con fecha fundante.
- **RF-04:** Debe dejar trazabilidad suficiente para auditar la decisión o estado del flujo.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: La demanda sale de la bandeja de demandas.
- [ ] AC-02: Se crea causa con Rol o estado en trámite documentado.
- [ ] AC-03: Se activa hito de cobro 5% con fecha fundante.
- [ ] AC-04: El flujo registra fecha, actor u origen y motivo de cada cambio de estado relevante.

## 7. Decisiones y Preguntas Abiertas

| # | Pregunta | Decisión | Owner |
|---|----------|----------|-------|
| 1 | ¿La regla funcional requiere validación adicional del estudio antes de desarrollo? | [Pendiente de confirmar] | Producto / Legal |
| 2 | ¿Existen ejemplos reales o plantillas que deban adjuntarse al ticket? | [Pendiente de adjuntar] | Operaciones |

## 8. Trabajo Futuro

- Automatizar pruebas funcionales sobre los escenarios legales cubiertos por este ticket.
- Ajustar el alcance cuando existan datos reales de operación y retroalimentación del estudio.
