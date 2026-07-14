# PRD: Clasificación por contenido del PDF

**Tracker Task ID:** [pendiente de asignar]
**Creado:** 2026-07-14 | **Reunión:** Levantamiento proyecto cobranza judicial PJUD
**Participantes:** Equipo Producto ProdBooster, Equipo Legal/Operaciones, Equipo Desarrollo
**Estado:** Draft
**Tipo Linear:** Subissue
**Parent Linear Issue:** monitor-pjud-clasificacion
**Autonomía:** AUTOMÁTICO con revisión humana

---

## 1. Problema y Contexto

Este subissue pertenece a `monitor-pjud-clasificacion`. El foco es leer el PDF completo para detectar el gatillante real. El PRD describe qué debe pasar desde el punto de vista legal y operativo, sin cerrar el cómo técnico.

## 2. Objetivos

- [ ] OBJ-01: Confirmar y documentar funcionalmente: leer el PDF completo para detectar el gatillante real.
- [ ] OBJ-02: Asegurar que el título PJUD no es fuente única de verdad.
- [ ] OBJ-03: Dejar restricciones legales, operativas y de autonomía visibles para desarrollo.

## 3. No-Goals

> Lo que explícitamente NO entra en este ticket.

- Definir arquitectura, librerías, servicios o decisiones internas de implementación.
- Cambiar reglas legales fuera del flujo de cobranza judicial automotriz por pagaré.
- Automatizar decisiones reservadas al abogado o a la financiera.

## 4. User Stories

| Como... | Quiero... | Para... |
|---------|-----------|---------|
| Equipo legal y operaciones | operar y validar: leer el PDF completo para detectar el gatillante real | mantener el flujo judicial correcto y trazable |
| Equipo técnico | contar con reglas funcionales claras sobre clasificación por contenido del pdf | desarrollar sin suponer criterios legales o de negocio |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** Debe garantizar que el título PJUD no es fuente única de verdad.
- **RF-02:** Debe documentar que el documento se asocia al cuaderno correcto.
- **RF-03:** Debe documentar la regla funcional o consecuencia: si el contenido no calza queda para revisión.
- **RF-04:** Debe dejar trazabilidad suficiente para auditar la decisión o estado del flujo.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: El título PJUD no es fuente única de verdad.
- [ ] AC-02: El documento se asocia al cuaderno correcto.
- [ ] AC-03: Si el contenido no calza, el documento queda para revisión.
- [ ] AC-04: El flujo registra fecha, actor u origen y motivo de cada cambio de estado relevante.

## 7. Decisiones y Preguntas Abiertas

| # | Pregunta | Decisión | Owner |
|---|----------|----------|-------|
| 1 | ¿La regla funcional requiere validación adicional del estudio antes de desarrollo? | [Pendiente de confirmar] | Producto / Legal |
| 2 | ¿Existen ejemplos reales o plantillas que deban adjuntarse al ticket? | [Pendiente de adjuntar] | Operaciones |

## 8. Trabajo Futuro

- Automatizar pruebas funcionales sobre los escenarios legales cubiertos por este ticket.
- Ajustar el alcance cuando existan datos reales de operación y retroalimentación del estudio.
