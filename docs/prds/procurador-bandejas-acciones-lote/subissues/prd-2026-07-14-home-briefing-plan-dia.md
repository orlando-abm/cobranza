# PRD: Home con briefing y plan del día

**Tracker Task ID:** [pendiente de asignar]
**Creado:** 2026-07-14 | **Reunión:** Levantamiento proyecto cobranza judicial PJUD
**Participantes:** Equipo Producto ProdBooster, Equipo Legal/Operaciones, Equipo Desarrollo
**Estado:** Draft
**Tipo Linear:** Subissue
**Parent Linear Issue:** procurador-bandejas-acciones-lote
**Autonomía:** AUTOMÁTICO

---

## 1. Problema y Contexto

Este subissue pertenece a `procurador-bandejas-acciones-lote`. El foco es traducir movimientos y vencimientos en prioridades del día. El PRD describe qué debe pasar desde el punto de vista legal y operativo, sin cerrar el cómo técnico.

## 2. Objetivos

- [ ] OBJ-01: Confirmar y documentar funcionalmente: traducir movimientos y vencimientos en prioridades del día.
- [ ] OBJ-02: Asegurar que urgencias aparecen antes que métricas.
- [ ] OBJ-03: Dejar restricciones legales, operativas y de autonomía visibles para desarrollo.

## 3. No-Goals

> Lo que explícitamente NO entra en este ticket.

- Definir arquitectura, librerías, servicios o decisiones internas de implementación.
- Cambiar reglas legales fuera del flujo de cobranza judicial automotriz por pagaré.
- Automatizar decisiones reservadas al abogado o a la financiera.

## 4. User Stories

| Como... | Quiero... | Para... |
|---------|-----------|---------|
| Equipo legal y operaciones | operar y validar: traducir movimientos y vencimientos en prioridades del día | mantener el flujo judicial correcto y trazable |
| Equipo técnico | contar con reglas funcionales claras sobre home con briefing y plan del día | desarrollar sin suponer criterios legales o de negocio |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** Debe garantizar que urgencias aparecen antes que métricas.
- **RF-02:** Debe documentar que cada ítem priorizado tiene destino accionable.
- **RF-03:** Debe documentar la regla funcional o consecuencia: causas inactivas no inflan urgencias.
- **RF-04:** Debe dejar trazabilidad suficiente para auditar la decisión o estado del flujo.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: Las urgencias aparecen antes que las métricas.
- [ ] AC-02: Cada ítem priorizado tiene destino accionable.
- [ ] AC-03: Las causas inactivas no inflan urgencias.
- [ ] AC-04: El flujo registra fecha, actor u origen y motivo de cada cambio de estado relevante.

## 7. Decisiones y Preguntas Abiertas

| # | Pregunta | Decisión | Owner |
|---|----------|----------|-------|
| 1 | ¿La regla funcional requiere validación adicional del estudio antes de desarrollo? | [Pendiente de confirmar] | Producto / Legal |
| 2 | ¿Existen ejemplos reales o plantillas que deban adjuntarse al ticket? | [Pendiente de adjuntar] | Operaciones |

## 8. Trabajo Futuro

- Automatizar pruebas funcionales sobre los escenarios legales cubiertos por este ticket.
- Ajustar el alcance cuando existan datos reales de operación y retroalimentación del estudio.
