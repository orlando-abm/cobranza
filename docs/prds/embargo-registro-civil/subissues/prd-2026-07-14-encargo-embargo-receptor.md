# PRD: Encargo de embargo al receptor

**Tracker Task ID:** [pendiente de asignar]
**Creado:** 2026-07-14 | **Reunión:** Levantamiento proyecto cobranza judicial PJUD
**Participantes:** Equipo Producto ProdBooster, Equipo Legal/Operaciones, Equipo Desarrollo
**Estado:** Draft
**Fase:** [F4] Embargo y Registro Civil
**Tipo Linear:** Subissue
**Parent Linear Issue:** embargo-registro-civil
**Autonomía:** AUTOMÁTICO configurable

---

## 1. Problema y Contexto

[F4] Embargo y Registro Civil. Este ticket cubre encargar embargo al receptor con rol, tribunal, partes y patentes. El dolor operativo de Cobranza Judicial es que el seguimiento manual de cientos de causas provoca atrasos, omisiones y pérdida de recuperación. El PRD debe dejar claro qué puede resolver el agente, qué queda bajo aprobación y qué se deriva a revisión humana.

## 2. Objetivos

- [ ] OBJ-01: Implementar el flujo para encargar embargo al receptor con rol, tribunal, partes y patentes.
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
| Abogado/a o procurador/a | Encargar embargo al receptor con rol, tribunal, partes y patentes. | avanzar causas sin perder control sobre decisiones legales |
| Operaciones del estudio | tener bloqueos, motivos y evidencias visibles | priorizar correcciones y evitar causas abandonadas |
| Equipo técnico | implementar sin inventar estados legales ni criterios de negocio fuera de la especificación | construir el flujo correcto desde la primera implementación |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** El sistema debe permitir encargar embargo al receptor con rol, tribunal, partes y patentes.
- **RF-02:** En Santiago puede usarse mismo receptor de notificación.
- **RF-03:** En regiones el embargo se inscribe en Registro, pero debe respetar retorno de exhorto.
- **RF-04:** El mail debe incluir mandamiento y datos de bien.
- **RF-05:** Toda acción debe quedar trazada con causa, documento/fuente, actor y fecha cuando aplique.
- **RF-06:** Si falta información mínima o la confianza es baja, el flujo debe detener el avance automático y explicar el motivo.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: El encargo se arma con patente y causa correctas.
- [ ] AC-02: Se registra receptor y fecha de encargo.
- [ ] AC-03: Respuestas de rechazo del receptor generan alerta.
- [ ] AC-04: El seguimiento espera comprobante de ingreso RC.
- [ ] AC-05: El caso queda trazado con fuente o evidencia suficiente para auditoría funcional.

## 7. Notas de implementación

- Fuente funcional principal: `docs/especificacion-scraper-pjud-v3-2-corregido.md` y reglas condensadas en `.claude/skills/cobranza-legal-pjud/SKILL.md`.
- Fase asignada: [F4] Embargo y Registro Civil. Esta fase ordena implementación y prioridad, pero no cambia el slug ni el parent de Linear.
- El front actual es un prototipo con mock data; los PRDs describen comportamiento funcional esperado para implementación real.
- Validar siempre los casos borde con documentos reales o fixtures que representen pagarés/CAV/estampados escaneados.

## 8. Fuera de alcance v1

- Dar por embargado un vehículo por solo tener comprobante.
- Incautación posterior al retiro.
