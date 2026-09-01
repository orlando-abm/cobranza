# PRD: Manejo conservador de Clave Única Judicial

**Tracker Task ID:** [pendiente de asignar]
**Creado:** 2026-07-14 | **Reunión:** Levantamiento proyecto cobranza judicial PJUD
**Participantes:** Equipo Producto ProdBooster, Equipo Legal/Operaciones, Equipo Desarrollo
**Estado:** Draft
**Fase:** [F6] Seguridad y automatización PJUD posterior
**Tipo Linear:** Subissue
**Parent Linear Issue:** seguridad-consentimiento-operacion
**Autonomía:** CONTROL OPERATIVO

---

## 1. Problema y Contexto

[F6] Seguridad y automatización PJUD posterior. Este ticket cubre definir manejo seguro futuro de Clave Única Judicial para evitar bloqueos. El dolor operativo de Cobranza Judicial es que el seguimiento manual de cientos de causas provoca atrasos, omisiones y pérdida de recuperación. El PRD debe dejar claro qué puede resolver el agente, qué queda bajo aprobación y qué se deriva a revisión humana.

## 2. Objetivos

- [ ] OBJ-01: Implementar el flujo para definir manejo seguro futuro de Clave Única Judicial para evitar bloqueos.
- [ ] OBJ-02: Hacer explícito el gatillante de entrada, el resultado esperado y los bloqueos.
- [ ] OBJ-03: Respetar la autonomía declarada del ticket y derivar a humano cuando corresponda.

## 3. No-Goals

> Lo que explícitamente NO entra en este ticket.

- Automatizar decisiones reservadas al abogado, a la financiera o al receptor cuando la matriz de autonomía exige revisión.
- Cambiar reglas legales del juicio ejecutivo de cobranza automotriz por pagaré.
- Definir arquitectura técnica, proveedor OCR, modelo de datos físico o integración específica fuera del alcance funcional del PRD.

## 4. User Stories

| Como... | Quiero... | Para... |
|---------|-----------|---------|
| Abogado/a o procurador/a | Definir manejo seguro futuro de Clave Única Judicial para evitar bloqueos. | avanzar causas sin perder control sobre decisiones legales |
| Operaciones del estudio | tener bloqueos, motivos y evidencias visibles | priorizar correcciones y evitar causas abandonadas |
| Equipo técnico | implementar sin inventar estados legales ni criterios de negocio fuera de la especificación | construir el flujo correcto desde la primera implementación |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** El sistema debe permitir definir manejo seguro futuro de Clave Única Judicial para evitar bloqueos.
- **RF-02:** No automatizar login en v1 manual.
- **RF-03:** Ante error, detener y alertar.
- **RF-04:** Nunca reintentar en loop.
- **RF-05:** Registrar eventos de sesión.
- **RF-06:** Toda acción debe quedar trazada con causa, documento/fuente, actor y fecha cuando aplique.
- **RF-07:** Si falta información mínima o la confianza es baja, el flujo debe detener el avance automático y explicar el motivo.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: El PRD declara OJV/Clave Única fuera de prioridad actual.
- [ ] AC-02: Futuro login tiene límite conservador de intentos.
- [ ] AC-03: Un fallo bloquea nuevas pruebas automáticas.
- [ ] AC-04: El usuario recibe alerta accionable.
- [ ] AC-05: El caso queda trazado con fuente o evidencia suficiente para auditoría funcional.

## 7. Notas de implementación

- Fuente funcional principal: `docs/especificacion-scraper-pjud-v3-2-corregido.md` y reglas condensadas en `.claude/skills/cobranza-legal-pjud/SKILL.md`.
- Fase asignada: [F6] Seguridad y automatización PJUD posterior. Esta fase ordena implementación y prioridad, pero no cambia el slug ni el parent de Linear.
- El front actual es un prototipo con mock data; los PRDs describen comportamiento funcional esperado para implementación real.
- Validar siempre los casos borde con documentos reales o fixtures que representen pagarés/CAV/estampados escaneados.

## 8. Fuera de alcance v1

- Ejecución real de login, firma o submit OJV en la fase actual.
- Reintentos automáticos de credenciales sin supervisión.
