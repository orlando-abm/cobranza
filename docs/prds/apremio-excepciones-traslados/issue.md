# PRD: Apremio, excepciones y traslados

**Tracker Task ID:** [pendiente de asignar]
**Creado:** 2026-07-14 | **Reunión:** Levantamiento proyecto cobranza judicial PJUD
**Participantes:** Equipo Producto ProdBooster, Equipo Legal/Operaciones, Equipo Desarrollo
**Estado:** Draft
**Tipo Linear:** Issue padre

---

## 1. Problema y Contexto

Este issue padre agrupa una capacidad funcional completa para Linear. El foco es vigilar el cuaderno de apremio en paralelo sin responder defensas del deudor automáticamente. El PRD describe qué debe pasar desde el punto de vista legal y operativo, sin cerrar el cómo técnico.

## 2. Objetivos

- [ ] OBJ-01: Confirmar y documentar funcionalmente: vigilar el cuaderno de apremio en paralelo sin responder defensas del deudor automáticamente.
- [ ] OBJ-02: Asegurar que el requerimiento de pago inicie el reloj de 8 días desde la fecha correcta.
- [ ] OBJ-03: Dejar restricciones legales, operativas y de autonomía visibles para desarrollo.

## 3. No-Goals

> Lo que explícitamente NO entra en este ticket.

- Definir arquitectura, librerías, servicios o decisiones internas de implementación.
- Cambiar reglas legales fuera del flujo de cobranza judicial automotriz por pagaré.
- Automatizar decisiones reservadas al abogado o a la financiera.

## 4. User Stories

| Como... | Quiero... | Para... |
|---------|-----------|---------|
| Equipo legal y operaciones | operar y validar: vigilar el cuaderno de apremio en paralelo sin responder defensas del deudor automáticamente | mantener el flujo judicial correcto y trazable |
| Equipo técnico | contar con reglas funcionales claras sobre apremio, excepciones y traslados | desarrollar sin suponer criterios legales o de negocio |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** Debe garantizar que el requerimiento de pago inicie el reloj de 8 días desde la fecha correcta.
- **RF-02:** Debe documentar que excepciones y traslados sean siempre SOLO HUMANO.
- **RF-03:** Debe documentar la regla funcional o consecuencia: el embargo no se bloquee por plazos de defensa que corren en paralelo.
- **RF-04:** Debe dejar trazabilidad suficiente para auditar la decisión o estado del flujo.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: El requerimiento de pago inicia el reloj de 8 días desde la fecha correcta.
- [ ] AC-02: Las excepciones y los traslados son siempre SOLO HUMANO.
- [ ] AC-03: El embargo no se bloquee por plazos de defensa que corren en paralelo.
- [ ] AC-04: El flujo registra fecha, actor u origen y motivo de cada cambio de estado relevante.

## 7. Decisiones y Preguntas Abiertas

| # | Pregunta | Decisión | Owner |
|---|----------|----------|-------|
| 1 | ¿La regla funcional requiere validación adicional del estudio antes de desarrollo? | [Pendiente de confirmar] | Producto / Legal |
| 2 | ¿Existen ejemplos reales o plantillas que deban adjuntarse al ticket? | [Pendiente de adjuntar] | Operaciones |

## 8. Trabajo Futuro

- Automatizar pruebas funcionales sobre los escenarios legales cubiertos por este ticket.
- Ajustar el alcance cuando existan datos reales de operación y retroalimentación del estudio.
