# PRD: Detalle agéntico de la demanda con confianza del borrador

**Tracker Task ID:** [pendiente de asignar]
**Creado:** 2026-07-14 | **Reunión:** Levantamiento proyecto cobranza judicial PJUD
**Participantes:** Equipo Producto ProdBooster, Equipo Legal/Operaciones, Equipo Desarrollo
**Estado:** Draft
**Tipo Linear:** Subissue
**Parent Linear Issue:** demanda-redaccion-revision
**Autonomía:** CON APROBACIÓN

---

## 1. Problema y Contexto

Este subissue pertenece a `demanda-redaccion-revision`. El foco es dar una fase agéntica previa a "ver" el borrador: al abrir una demanda, el abogado u operador conversa con el procurador sobre esa demanda (corregir una plantilla mal elegida, pedir cambios) antes de editar o presentar, reutilizando la misma pantalla de una causa con menos información. Además, el agente debe hacer visible la confianza con la que generó o seleccionó el documento sugerido. El PRD describe qué debe pasar desde el punto de vista legal y operativo, sin cerrar el cómo técnico.

## 2. Objetivos

- [ ] OBJ-01: Confirmar y documentar funcionalmente: abrir la demanda en una pantalla agéntica equivalente a la de una causa (con menos datos, porque aún no es causa) centrada en el chat con el procurador.
- [ ] OBJ-02: Permitir que el agente reasigne la plantilla GLOBAL, abra el borrador editable y muestre la confianza del documento en verde/amarillo/rojo.
- [ ] OBJ-03: Dejar restricciones legales, operativas y de autonomía visibles para desarrollo.

## 3. No-Goals

> Lo que explícitamente NO entra en este ticket.

- Definir arquitectura, librerías, servicios o decisiones internas de implementación.
- Cambiar reglas legales fuera del flujo de cobranza judicial automotriz por pagaré.
- Automatizar decisiones reservadas al abogado o a la financiera.

## 4. User Stories

| Como... | Quiero... | Para... |
|---------|-----------|---------|
| Equipo legal y operaciones | operar y validar: conversar con el procurador sobre la demanda y ver su confianza antes de presentar | mantener el flujo judicial correcto y trazable |
| Equipo técnico | contar con reglas funcionales claras sobre el detalle agéntico de la demanda con confianza del borrador | desarrollar sin suponer criterios legales o de negocio |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** Debe garantizar que abrir una demanda lleva a una pantalla de detalle con el chat del procurador, previa a ver o editar el borrador; la demanda no tiene Rol ni reloj judicial hasta presentarse.
- **RF-02:** Debe documentar que el agente puede reasignar la plantilla GLOBAL según deudor, avales y jurisdicción, y abrir el borrador editable ante pedidos en lenguaje natural.
- **RF-03:** Debe documentar la regla funcional o consecuencia: la confianza del documento generado se muestra como indicador verde/amarillo/rojo en la lista, en el detalle y mencionada en el chat, y sube cuando el humano confirma la plantilla o corrige.
- **RF-04:** Debe dejar trazabilidad suficiente para auditar la decisión o estado del flujo.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: La demanda se abre en una pantalla agéntica previa a ver/editar el borrador.
- [ ] AC-02: El agente reasigna la plantilla GLOBAL y abre el borrador editable a pedido.
- [ ] AC-03: La confianza del documento se muestra en verde, amarillo o rojo dentro y fuera de la demanda, y el ingreso de la causa la convierte en causa con Rol.
- [ ] AC-04: El flujo registra fecha, actor u origen y motivo de cada cambio de estado relevante.

## 7. Decisiones y Preguntas Abiertas

| # | Pregunta | Decisión | Owner |
|---|----------|----------|-------|
| 1 | ¿La regla funcional requiere validación adicional del estudio antes de desarrollo? | [Pendiente de confirmar] | Producto / Legal |
| 2 | ¿Existen ejemplos reales o plantillas que deban adjuntarse al ticket? | [Pendiente de adjuntar] | Operaciones |

## 8. Trabajo Futuro

- Automatizar pruebas funcionales sobre los escenarios legales cubiertos por este ticket.
- Ajustar el alcance cuando existan datos reales de operación y retroalimentación del estudio.
