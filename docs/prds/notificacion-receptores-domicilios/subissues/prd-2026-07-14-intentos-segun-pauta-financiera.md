# PRD: Intentos según pauta financiera

**Tracker Task ID:** [pendiente de asignar]
**Creado:** 2026-07-14 | **Reunión:** Levantamiento proyecto cobranza judicial PJUD
**Participantes:** Equipo Producto ProdBooster, Equipo Legal/Operaciones, Equipo Desarrollo
**Estado:** Draft
**Fase:** [F3] Notificación y flujo post-monitor
**Tipo Linear:** Subissue
**Parent Linear Issue:** notificacion-receptores-domicilios
**Autonomía:** AUTOMÁTICO con decisión humana al límite

---

## 1. Problema y Contexto

[F3] Notificación y flujo post-monitor. Este ticket cubre contar intentos de notificación según política de Tanner, OLX u otra financiera. El dolor operativo de Cobranza Judicial es que el seguimiento manual de cientos de causas provoca atrasos, omisiones y pérdida de recuperación. El PRD debe dejar claro qué puede resolver el agente, qué queda bajo aprobación y qué se deriva a revisión humana.

## 2. Objetivos

- [ ] OBJ-01: Implementar el flujo para contar intentos de notificación según política de Tanner, OLX u otra financiera.
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
| Abogado/a o procurador/a | Contar intentos de notificación según política de Tanner, OLX u otra financiera. | avanzar causas sin perder control sobre decisiones legales |
| Operaciones del estudio | tener bloqueos, motivos y evidencias visibles | priorizar correcciones y evitar causas abandonadas |
| Equipo técnico | implementar sin inventar estados legales ni criterios de negocio fuera de la especificación | construir el flujo correcto desde la primera implementación |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** El sistema debe permitir contar intentos de notificación según política de Tanner, OLX u otra financiera.
- **RF-02:** Tanner usa 2 intentos como referencia.
- **RF-03:** OLX permite hasta 5 intentos.
- **RF-04:** Al límite, el agente alerta; no castiga automáticamente.
- **RF-05:** Toda acción debe quedar trazada con causa, documento/fuente, actor y fecha cuando aplique.
- **RF-06:** Si falta información mínima o la confianza es baja, el flujo debe detener el avance automático y explicar el motivo.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: Cada búsqueda negativa incrementa contador de intento.
- [ ] AC-02: La pauta activa define límite por financiera.
- [ ] AC-03: Al acercarse al último intento se muestra alerta.
- [ ] AC-04: Castigo o nuevo domicilio queda como decisión humana.
- [ ] AC-05: El caso queda trazado con fuente o evidencia suficiente para auditoría funcional.

## 7. Notas de implementación

- Fuente funcional principal: `docs/especificacion-scraper-pjud-v3-2-corregido.md` y reglas condensadas en `.claude/skills/cobranza-legal-pjud/SKILL.md`.
- Fase asignada: [F3] Notificación y flujo post-monitor. Esta fase ordena implementación y prioridad, pero no cambia el slug ni el parent de Linear.
- El front actual es un prototipo con mock data; los PRDs describen comportamiento funcional esperado para implementación real.
- Validar siempre los casos borde con documentos reales o fixtures que representen pagarés/CAV/estampados escaneados.

## 8. Fuera de alcance v1

- Castigar causas automáticamente.
- Responder defensas del deudor.
