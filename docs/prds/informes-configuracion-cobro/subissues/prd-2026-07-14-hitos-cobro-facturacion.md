# PRD: Hitos de cobro y facturación

**Tracker Task ID:** [pendiente de asignar]
**Creado:** 2026-07-14 | **Reunión:** Levantamiento proyecto cobranza judicial PJUD
**Participantes:** Equipo Producto ProdBooster, Equipo Legal/Operaciones, Equipo Desarrollo
**Estado:** Draft
**Fase:** [F5] Configuración, informes y cobro
**Tipo Linear:** Subissue
**Parent Linear Issue:** informes-configuracion-cobro
**Autonomía:** AUTOMÁTICO con respaldo documental

---

## 1. Problema y Contexto

[F5] Configuración, informes y cobro. Este ticket cubre registrar hitos de cobro con fecha y documento fundante. El dolor operativo de Cobranza Judicial es que el seguimiento manual de cientos de causas provoca atrasos, omisiones y pérdida de recuperación. El PRD debe dejar claro qué puede resolver el agente, qué queda bajo aprobación y qué se deriva a revisión humana.

## 2. Objetivos

- [ ] OBJ-01: Implementar el flujo para registrar hitos de cobro con fecha y documento fundante.
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
| Abogado/a o procurador/a | Registrar hitos de cobro con fecha y documento fundante. | avanzar causas sin perder control sobre decisiones legales |
| Operaciones del estudio | tener bloqueos, motivos y evidencias visibles | priorizar correcciones y evitar causas abandonadas |
| Equipo técnico | implementar sin inventar estados legales ni criterios de negocio fuera de la especificación | construir el flujo correcto desde la primera implementación |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** El sistema debe permitir registrar hitos de cobro con fecha y documento fundante.
- **RF-02:** Demanda presentada = 5%.
- **RF-03:** Notificación efectiva = 10%.
- **RF-04:** Embargo inscrito = ~15%.
- **RF-05:** Cada hito exige evidencia.
- **RF-06:** Toda acción debe quedar trazada con causa, documento/fuente, actor y fecha cuando aplique.
- **RF-07:** Si falta información mínima o la confianza es baja, el flujo debe detener el avance automático y explicar el motivo.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: Cada causa muestra hitos cobrables.
- [ ] AC-02: Un hito tiene fecha y documento cuando está alcanzado.
- [ ] AC-03: No se marca embargo inscrito por comprobante RC.
- [ ] AC-04: El informe puede usar estos hitos para facturación.
- [ ] AC-05: El caso queda trazado con fuente o evidencia suficiente para auditoría funcional.

## 7. Notas de implementación

- Fuente funcional principal: `docs/especificacion-scraper-pjud-v3-2-corregido.md` y reglas condensadas en `.claude/skills/cobranza-legal-pjud/SKILL.md`.
- Fase asignada: [F5] Configuración, informes y cobro. Esta fase ordena implementación y prioridad, pero no cambia el slug ni el parent de Linear.
- El front actual es un prototipo con mock data; los PRDs describen comportamiento funcional esperado para implementación real.
- Validar siempre los casos borde con documentos reales o fixtures que representen pagarés/CAV/estampados escaneados.

## 8. Fuera de alcance v1

- Inventar reglas de negocio no configuradas.
- Facturar hitos sin documento fundante.
