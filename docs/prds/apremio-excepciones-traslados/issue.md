# PRD: Apremio, excepciones y traslados

**Tracker Task ID:** [pendiente de asignar]
**Creado:** 2026-07-14 | **Reunión:** Levantamiento proyecto cobranza judicial PJUD
**Participantes:** Equipo Producto ProdBooster, Equipo Legal/Operaciones, Equipo Desarrollo
**Estado:** Draft
**Fase:** [F3] Notificación y apremio paralelo
**Tipo Linear:** Issue padre

---

## 1. Problema y Contexto

[F3] Notificación y apremio paralelo. Este ticket cubre vigilar el cuaderno de apremio en paralelo al avance principal, sin bloquear embargo por excepciones. El dolor operativo de Cobranza Judicial es que el seguimiento manual de cientos de causas provoca atrasos, omisiones y pérdida de recuperación. El PRD debe dejar claro qué puede resolver el agente, qué queda bajo aprobación y qué se deriva a revisión humana.

## 2. Objetivos

- [ ] OBJ-01: Entregar la capacidad completa para vigilar el cuaderno de apremio en paralelo al avance principal, sin bloquear embargo por excepciones.
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

- **RF-01:** El módulo debe cubrir de punta a punta el alcance definido: vigilar el cuaderno de apremio en paralelo al avance principal, sin bloquear embargo por excepciones.
- **RF-02:** El plazo de excepciones parte del requerimiento de pago, no de la notificación.
- **RF-03:** Excepciones y traslados son línea roja: el agente detecta, enciende reloj y alerta; no responde.
- **RF-04:** Si vencen 8 días sin excepciones, se puede pre-generar certificado de no oposición para firma humana.
- **RF-05:** Los plazos de 8 días y 4 días deben mostrarse como relojes críticos diarios.
- **RF-06:** El módulo debe exponer bloqueos y motivos cuando una causa o demanda no pueda avanzar.
- **RF-07:** El módulo debe producir evidencia suficiente para auditar por qué avanzó, quedó detenido o pasó a revisión humana.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: El flujo principal de `apremio-excepciones-traslados` queda representado con estados, entradas y salidas verificables.
- [ ] AC-02: Los casos automáticos avanzan solo cuando cumplen todas las validaciones funcionales.
- [ ] AC-03: Los casos con baja confianza, bloqueo legal o decisión de negocio quedan en revisión humana.
- [ ] AC-04: Cada transición relevante conserva documento o fuente que la respalda.
- [ ] AC-05: El módulo no ejecuta acciones marcadas como fuera de alcance v1.

## 7. Notas de implementación

- Fuente funcional principal: `docs/especificacion-scraper-pjud-v3-2-corregido.md` y reglas condensadas en `.claude/skills/cobranza-legal-pjud/SKILL.md`.
- Fase asignada: [F3] Notificación y apremio paralelo. Esta fase ordena implementación y prioridad, pero no cambia el slug ni el parent de Linear.
- El front actual es un prototipo con mock data; los PRDs describen comportamiento funcional esperado para implementación real.
- Validar siempre los casos borde con documentos reales o fixtures que representen pagarés/CAV/estampados escaneados.

## 8. Fuera de alcance v1

- Redactar respuesta de fondo a excepciones.
- Detener el embargo por existir plazo paralelo de defensa.
