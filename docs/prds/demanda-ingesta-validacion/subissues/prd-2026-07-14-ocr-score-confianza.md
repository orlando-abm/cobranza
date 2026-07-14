# PRD: OCR con score de confianza por campo

**Tracker Task ID:** [pendiente de asignar]
**Creado:** 2026-07-14 | **Reunión:** Levantamiento proyecto cobranza judicial PJUD
**Participantes:** Equipo Producto ProdBooster, Equipo Legal/Operaciones, Equipo Desarrollo
**Estado:** Draft
**Tipo Linear:** Subissue
**Parent Linear Issue:** demanda-ingesta-validacion
**Autonomía:** AUTOMÁTICO con desvío humano

---

## 1. Problema y Contexto

Este subissue pertenece a `demanda-ingesta-validacion`. El foco es extraer datos desde escaneos con score por campo y no tratar el OCR dudoso como verdad final. El PRD describe qué debe pasar desde el punto de vista legal y operativo, sin cerrar el cómo técnico.

## 2. Objetivos

- [ ] OBJ-01: Confirmar y documentar funcionalmente: extraer datos desde escaneos con score por campo y no tratar el OCR dudoso como verdad final.
- [ ] OBJ-02: Asegurar que cada campo crítico tiene score visible.
- [ ] OBJ-03: Dejar restricciones legales, operativas y de autonomía visibles para desarrollo.

## 3. No-Goals

> Lo que explícitamente NO entra en este ticket.

- Definir arquitectura, librerías, servicios o decisiones internas de implementación.
- Cambiar reglas legales fuera del flujo de cobranza judicial automotriz por pagaré.
- Automatizar decisiones reservadas al abogado o a la financiera.

## 4. User Stories

| Como... | Quiero... | Para... |
|---------|-----------|---------|
| Equipo legal y operaciones | operar y validar: extraer datos desde escaneos con score por campo y no tratar el OCR dudoso como verdad final | mantener el flujo judicial correcto y trazable |
| Equipo técnico | contar con reglas funcionales claras sobre ocr con score de confianza por campo | desarrollar sin suponer criterios legales o de negocio |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** Debe garantizar que cada campo crítico tiene score visible.
- **RF-02:** Debe documentar que los campos bajo umbral generan revisión humana.
- **RF-03:** Debe documentar la regla funcional o consecuencia: confirmar o corregir campos libera el flujo solo si no hay otros bloqueos.
- **RF-04:** Debe dejar trazabilidad suficiente para auditar la decisión o estado del flujo.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: Cada campo crítico tiene score visible.
- [ ] AC-02: Los campos bajo umbral generan revisión humana.
- [ ] AC-03: Confirmar o corregir campos libera el flujo solo si no hay otros bloqueos.
- [ ] AC-04: El flujo registra fecha, actor u origen y motivo de cada cambio de estado relevante.

## 7. Decisiones y Preguntas Abiertas

| # | Pregunta | Decisión | Owner |
|---|----------|----------|-------|
| 1 | ¿Qué umbral OCR aplica por financiera o documento? | [Pendiente de pauta] | Producto / Operaciones |

## 8. Trabajo Futuro

- Automatizar pruebas funcionales sobre los escenarios legales cubiertos por este ticket.
- Ajustar el alcance cuando existan datos reales de operación y retroalimentación del estudio.
