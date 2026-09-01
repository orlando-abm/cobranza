# PRD: Estado diario PJUD como respaldo

**Tracker Task ID:** [pendiente de asignar]
**Creado:** 2026-07-14 | **Reunión:** Levantamiento proyecto cobranza judicial PJUD
**Participantes:** Equipo Producto ProdBooster, Equipo Legal/Operaciones, Equipo Desarrollo
**Estado:** Draft
**Fase:** [F2] Ingreso manual y monitoreo PJUD
**Tipo Linear:** Subissue
**Parent Linear Issue:** monitor-pjud-clasificacion
**Autonomía:** AUTOMÁTICO

---

## 1. Problema y Contexto

[F2] Ingreso manual y monitoreo PJUD. Este ticket cubre mostrar una vista auditable de movimientos diarios PJUD cruzable por Rol, tribunal y causa. El dolor operativo de Cobranza Judicial es que el seguimiento manual de cientos de causas provoca atrasos, omisiones y pérdida de recuperación. El PRD debe dejar claro qué puede resolver el agente, qué queda bajo aprobación y qué se deriva a revisión humana.

## 2. Objetivos

- [ ] OBJ-01: Implementar el flujo para mostrar una vista auditable de movimientos diarios PJUD cruzable por Rol, tribunal y causa.
- [ ] OBJ-02: Hacer explícito el gatillante de entrada, el resultado esperado y los bloqueos.
- [ ] OBJ-03: Respetar la autonomía declarada del ticket y derivar a humano cuando corresponda.

## 3. No-Goals

> Lo que explícitamente NO entra en este ticket.

- Automatizar decisiones reservadas al abogado, a la financiera o al receptor cuando la matriz de autonomía exige revisión.
- Cambiar reglas legales del juicio ejecutivo de cobranza automotriz por pagaré.
- Definir arquitectura técnica, proveedor OCR, modelo de datos físico o integración específica fuera del alcance funcional del PRD.
- Automatizar la presentación real en OJV/PJUD en esta iteración; el ingreso efectivo se mantiene manual salvo que un ticket futuro lo habilite.

## 4. User Stories

| Como... | Quiero... | Para... |
|---------|-----------|---------|
| Abogado/a o procurador/a | Mostrar una vista auditable de movimientos diarios PJUD cruzable por Rol, tribunal y causa. | avanzar causas sin perder control sobre decisiones legales |
| Operaciones del estudio | tener bloqueos, motivos y evidencias visibles | priorizar correcciones y evitar causas abandonadas |
| Equipo técnico | implementar sin inventar estados legales ni criterios de negocio fuera de la especificación | construir el flujo correcto desde la primera implementación |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** El sistema debe permitir mostrar una vista auditable de movimientos diarios PJUD cruzable por Rol, tribunal y causa.
- **RF-02:** Es vista de respaldo, no reemplaza priorización del agente.
- **RF-03:** Debe enlazar a causa cuando existe en cartera.
- **RF-04:** Debe permitir filtrar por día y buscar movimientos.
- **RF-05:** Toda acción debe quedar trazada con causa, documento/fuente, actor y fecha cuando aplique.
- **RF-06:** Si falta información mínima o la confianza es baja, el flujo debe detener el avance automático y explicar el motivo.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: La tabla muestra día, Rol, movimiento leído, tribunal y tipo.
- [ ] AC-02: El usuario puede filtrar por fecha.
- [ ] AC-03: Movimientos sin causa asociada quedan visibles sin romper flujo.
- [ ] AC-04: Desde una fila asociada se abre la causa.
- [ ] AC-05: El caso queda trazado con fuente o evidencia suficiente para auditoría funcional.

## 7. Notas de implementación

- Fuente funcional principal: `docs/especificacion-scraper-pjud-v3-2-corregido.md` y reglas condensadas en `.claude/skills/cobranza-legal-pjud/SKILL.md`.
- Fase asignada: [F2] Ingreso manual y monitoreo PJUD. Esta fase ordena implementación y prioridad, pero no cambia el slug ni el parent de Linear.
- El front actual es un prototipo con mock data; los PRDs describen comportamiento funcional esperado para implementación real.
- Validar siempre los casos borde con documentos reales o fixtures que representen pagarés/CAV/estampados escaneados.

## 8. Fuera de alcance v1

- Confiar en títulos de terceros como fuente final.
- Ejecutar acciones externas sin validación de gatillante.
