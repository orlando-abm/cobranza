# PRD: Seguridad, consentimiento y operación judicial

**Tracker Task ID:** [pendiente de asignar]
**Creado:** 2026-07-14 | **Reunión:** Levantamiento proyecto cobranza judicial PJUD
**Participantes:** Equipo Producto ProdBooster, Equipo Legal/Operaciones, Equipo Desarrollo
**Estado:** Draft
**Fase:** [F6] Seguridad y automatización PJUD posterior
**Tipo Linear:** Issue padre

---

## 1. Problema y Contexto

[F6] Seguridad y automatización PJUD posterior. Este ticket cubre definir controles de acceso, consentimiento y operación segura para etapas que impliquen credenciales o trazabilidad judicial. El dolor operativo de Cobranza Judicial es que el seguimiento manual de cientos de causas provoca atrasos, omisiones y pérdida de recuperación. El PRD debe dejar claro qué puede resolver el agente, qué queda bajo aprobación y qué se deriva a revisión humana.

## 2. Objetivos

- [ ] OBJ-01: Entregar la capacidad completa para definir controles de acceso, consentimiento y operación segura para etapas que impliquen credenciales o trazabilidad judicial.
- [ ] OBJ-02: Mantener trazabilidad por causa, documento, actor y fecha en cada cambio relevante.
- [ ] OBJ-03: Respetar la matriz de autonomía: automático, con aprobación o solo humano según el riesgo legal.
- [ ] OBJ-04: Dejar criterios verificables para implementación y validación funcional.

## 3. No-Goals

> Lo que explícitamente NO entra en este ticket.

- Automatizar decisiones reservadas al abogado, a la financiera o al receptor cuando la matriz de autonomía exige revisión.
- Cambiar reglas legales del juicio ejecutivo de cobranza automotriz por pagaré.
- Definir arquitectura técnica, proveedor OCR, modelo de datos físico o integración específica fuera del alcance funcional del PRD.
- Automatizar la presentación real en OJV/PJUD en esta iteración; el ingreso efectivo se mantiene manual salvo que un ticket futuro lo habilite.

## 4. User Stories

| Como... | Quiero... | Para... |
|---------|-----------|---------|
| Abogado/a o procurador/a | coordinar y validar esta parte del flujo judicial | avanzar causas sin perder control sobre decisiones legales |
| Operaciones del estudio | tener bloqueos, motivos y evidencias visibles | priorizar correcciones y evitar causas abandonadas |
| Equipo técnico | implementar sin inventar estados legales ni criterios de negocio fuera de la especificación | construir el flujo correcto desde la primera implementación |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** El módulo debe cubrir de punta a punta el alcance definido: definir controles de acceso, consentimiento y operación segura para etapas que impliquen credenciales o trazabilidad judicial.
- **RF-02:** Clave Única y OJV no son prioridad de v1 si la presentación es manual, pero deben quedar delimitadas.
- **RF-03:** Ante error de login futuro, el sistema debe detener y alertar; nunca reintentar en loop.
- **RF-04:** Las acciones judiciales deben quedar trazables por actor, fecha y origen.
- **RF-05:** El documento original en papel debe registrarse cuando el flujo manual lo requiera.
- **RF-06:** El módulo debe exponer bloqueos y motivos cuando una causa o demanda no pueda avanzar.
- **RF-07:** El módulo debe producir evidencia suficiente para auditar por qué avanzó, quedó detenido o pasó a revisión humana.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: El flujo principal de `seguridad-consentimiento-operacion` queda representado con estados, entradas y salidas verificables.
- [ ] AC-02: Los casos automáticos avanzan solo cuando cumplen todas las validaciones funcionales.
- [ ] AC-03: Los casos con baja confianza, bloqueo legal o decisión de negocio quedan en revisión humana.
- [ ] AC-04: Cada transición relevante conserva documento o fuente que la respalda.
- [ ] AC-05: El módulo no ejecuta acciones marcadas como fuera de alcance v1.

## 7. Notas de implementación

- Fuente funcional principal: `docs/especificacion-scraper-pjud-v3-2-corregido.md` y reglas condensadas en `.claude/skills/cobranza-legal-pjud/SKILL.md`.
- Fase asignada: [F6] Seguridad y automatización PJUD posterior. Esta fase ordena implementación y prioridad, pero no cambia el slug ni el parent de Linear.
- El front actual es un prototipo con mock data; los PRDs describen comportamiento funcional esperado para implementación real.
- Validar siempre los casos borde con documentos reales o fixtures que representen pagarés/CAV/estampados escaneados.

## 8. Fuera de alcance v1

- Automatizar login o firma PJUD en la fase actual.
- Saltarse consentimiento o trazabilidad por conveniencia operativa.
