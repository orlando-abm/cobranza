# PRD: Bandeja de demandas previas a causa

**Tracker Task ID:** [pendiente de asignar]
**Creado:** 2026-07-14 | **Reunión:** Levantamiento proyecto cobranza judicial PJUD
**Participantes:** Equipo Producto ProdBooster, Equipo Legal/Operaciones, Equipo Desarrollo
**Estado:** Draft
**Tipo Linear:** Subissue
**Parent Linear Issue:** demanda-redaccion-revision
**Autonomía:** CON APROBACIÓN

---

## 1. Problema y Contexto

Este subissue pertenece a `demanda-redaccion-revision`. El foco es operar demandas sin Rol y sin reloj judicial, separadas del listado de causas. El PRD describe qué debe pasar desde el punto de vista legal y operativo, sin cerrar el cómo técnico.

## 2. Objetivos

- [ ] OBJ-01: Confirmar y documentar funcionalmente: operar demandas sin Rol y sin reloj judicial, separadas del listado de causas.
- [ ] OBJ-02: Asegurar que las demandas no aparecen como causas hasta presentación.
- [ ] OBJ-03: Dejar restricciones legales, operativas y de autonomía visibles para desarrollo.

## 3. No-Goals

> Lo que explícitamente NO entra en este ticket.

- Definir arquitectura, librerías, servicios o decisiones internas de implementación.
- Cambiar reglas legales fuera del flujo de cobranza judicial automotriz por pagaré.
- Automatizar decisiones reservadas al abogado o a la financiera.

## 4. User Stories

| Como... | Quiero... | Para... |
|---------|-----------|---------|
| Equipo legal y operaciones | operar y validar: operar demandas sin Rol y sin reloj judicial, separadas del listado de causas | mantener el flujo judicial correcto y trazable |
| Equipo técnico | contar con reglas funcionales claras sobre bandeja de demandas previas a causa | desarrollar sin suponer criterios legales o de negocio |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** Debe garantizar que las demandas no aparecen como causas hasta presentación.
- **RF-02:** Debe documentar que los estados redactada y por revisar son visibles.
- **RF-03:** Debe documentar la regla funcional o consecuencia: la búsqueda permite encontrar por crédito, RUT, nombre o financiera.
- **RF-04:** Debe dejar trazabilidad suficiente para auditar la decisión o estado del flujo.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: Las demandas no aparecen como causas hasta presentación.
- [ ] AC-02: Los estados redactada y por revisar son visibles.
- [ ] AC-03: La búsqueda permite encontrar por crédito, RUT, nombre o financiera.
- [ ] AC-04: El flujo registra fecha, actor u origen y motivo de cada cambio de estado relevante.

## 7. Decisiones y Preguntas Abiertas

| # | Pregunta | Decisión | Owner |
|---|----------|----------|-------|
| 1 | ¿La regla funcional requiere validación adicional del estudio antes de desarrollo? | [Pendiente de confirmar] | Producto / Legal |
| 2 | ¿Existen ejemplos reales o plantillas que deban adjuntarse al ticket? | [Pendiente de adjuntar] | Operaciones |

## 8. Trabajo Futuro

- Automatizar pruebas funcionales sobre los escenarios legales cubiertos por este ticket.
- Ajustar el alcance cuando existan datos reales de operación y retroalimentación del estudio.
