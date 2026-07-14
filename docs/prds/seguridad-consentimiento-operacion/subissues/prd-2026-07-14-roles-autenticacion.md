# PRD: Roles y autenticación funcional

**Tracker Task ID:** [pendiente de asignar]
**Creado:** 2026-07-14 | **Reunión:** Levantamiento proyecto cobranza judicial PJUD
**Participantes:** Equipo Producto ProdBooster, Equipo Legal/Operaciones, Equipo Desarrollo
**Estado:** Draft
**Tipo Linear:** Subissue
**Parent Linear Issue:** seguridad-consentimiento-operacion
**Autonomía:** CONTROL DE ACCESO

---

## 1. Problema y Contexto

Este subissue pertenece a `seguridad-consentimiento-operacion`. El foco es distinguir patrocinante, apoderado y operador de ingesta. El PRD describe qué debe pasar desde el punto de vista legal y operativo, sin cerrar el cómo técnico.

## 2. Objetivos

- [ ] OBJ-01: Confirmar y documentar funcionalmente: distinguir patrocinante, apoderado y operador de ingesta.
- [ ] OBJ-02: Asegurar que acciones de firma y presentación quedan restringidas.
- [ ] OBJ-03: Dejar restricciones legales, operativas y de autonomía visibles para desarrollo.

## 3. No-Goals

> Lo que explícitamente NO entra en este ticket.

- Definir arquitectura, librerías, servicios o decisiones internas de implementación.
- Cambiar reglas legales fuera del flujo de cobranza judicial automotriz por pagaré.
- Automatizar decisiones reservadas al abogado o a la financiera.

## 4. User Stories

| Como... | Quiero... | Para... |
|---------|-----------|---------|
| Equipo legal y operaciones | operar y validar: distinguir patrocinante, apoderado y operador de ingesta | mantener el flujo judicial correcto y trazable |
| Equipo técnico | contar con reglas funcionales claras sobre roles y autenticación funcional | desarrollar sin suponer criterios legales o de negocio |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** Debe garantizar que acciones de firma y presentación quedan restringidas.
- **RF-02:** Debe documentar que correcciones humanas registran actor.
- **RF-03:** Debe documentar la regla funcional o consecuencia: los permisos funcionales no dependen de un proveedor específico de autenticación.
- **RF-04:** Debe dejar trazabilidad suficiente para auditar la decisión o estado del flujo.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: Las acciones de firma y presentación quedan restringidas.
- [ ] AC-02: Las correcciones humanas registran actor.
- [ ] AC-03: Los permisos funcionales se mantienen aunque cambie el proveedor de autenticación.
- [ ] AC-04: El flujo registra fecha, actor u origen y motivo de cada cambio de estado relevante.

## 7. Decisiones y Preguntas Abiertas

| # | Pregunta | Decisión | Owner |
|---|----------|----------|-------|
| 1 | ¿La regla funcional requiere validación adicional del estudio antes de desarrollo? | [Pendiente de confirmar] | Producto / Legal |
| 2 | ¿Existen ejemplos reales o plantillas que deban adjuntarse al ticket? | [Pendiente de adjuntar] | Operaciones |

## 8. Trabajo Futuro

- Automatizar pruebas funcionales sobre los escenarios legales cubiertos por este ticket.
- Ajustar el alcance cuando existan datos reales de operación y retroalimentación del estudio.
