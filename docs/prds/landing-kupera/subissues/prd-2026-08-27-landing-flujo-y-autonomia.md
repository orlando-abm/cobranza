# PRD: Etapas, relojes de plazo y matriz de autonomía

**Tracker Task ID:** [pendiente de asignar]
**Creado:** 2026-08-27 | **Reunión:** Definición de sitio público y captación
**Participantes:** Equipo Producto ProdBooster, Equipo Legal/Operaciones, Equipo Desarrollo
**Estado:** Draft
**Fase:** [F7] Sitio público y captación
**Tipo Linear:** Subissue
**Parent Linear Issue:** landing-kupera
**Autonomía:** SOLO HUMANO

---

## 1. Problema y Contexto

[F7] Sitio público y captación. Este ticket cubre presentar las tres etapas del juicio, sus relojes de plazo y la matriz de autonomía del agente. El dolor operativo de Cobranza Judicial es que el seguimiento manual de cientos de causas provoca atrasos, omisiones y pérdida de recuperación. El PRD debe dejar claro qué puede resolver el agente, qué queda bajo aprobación y qué se deriva a revisión humana.

Es la sección de confianza. Un abogado no delega criterio jurídico, y el sitio debe decir sin ambigüedad dónde se detiene el agente. El nivel de autonomía declarado para este ticket es SOLO HUMANO porque describe justamente la frontera que el agente no cruza.

## 2. Objetivos

- [ ] OBJ-01: Implementar la presentación de las tres etapas con el gatillante que abre y cierra cada una.
- [ ] OBJ-02: Mostrar los relojes de cada plazo perentorio con su gatillante correcto.
- [ ] OBJ-03: Declarar la matriz de autonomía en tres niveles y hacer explícita la línea roja.
- [ ] OBJ-04: Respetar la autonomía declarada del ticket y derivar a humano cuando corresponda.

## 3. No-Goals

> Lo que explícitamente NO entra en este ticket.

- Automatizar decisiones reservadas al abogado, a la financiera o al receptor cuando la matriz de autonomía exige revisión.
- Cambiar reglas legales del juicio ejecutivo de cobranza automotriz por pagaré.
- Definir arquitectura técnica, proveedor OCR, modelo de datos físico o integración específica fuera del alcance funcional del PRD.
- Publicar tarifas, contratos o condiciones comerciales.

## 4. User Stories

| Como... | Quiero... | Para... |
|---------|-----------|---------|
| Abogado/a o procurador/a | saber exactamente dónde se detiene el agente | confiar en que la defensa sigue siendo mía |
| Socio/a del estudio | ver qué gatilla la entrada y la salida de cada etapa | entender dónde se atasca hoy mi cartera |
| Operaciones del estudio | tener bloqueos, motivos y evidencias visibles | priorizar correcciones y evitar causas abandonadas |
| Equipo técnico | implementar sin inventar estados legales ni criterios de negocio fuera de la especificación | construir el flujo correcto desde la primera implementación |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** El sistema debe presentar las etapas de demanda, notificación y embargo con el gatillante de cada una.
- **RF-02:** Los relojes deben declarar ocho días para excepciones desde el requerimiento de pago, cuatro para traslado, cinco para reposición y alrededor de treinta para la inscripción en el Registro Civil.
- **RF-03:** Debe quedar explícito que el cuaderno de apremio corre en paralelo y que las excepciones no bloquean el embargo.
- **RF-04:** La matriz debe usar exclusivamente los niveles AUTOMÁTICO, CON APROBACIÓN y SOLO HUMANO.
- **RF-05:** La columna SOLO HUMANO debe incluir oposición de excepciones, respuesta a traslados, vehículo transferido, rechazo de inscripción y reposición o apelación.
- **RF-06:** La línea roja debe declararse de forma destacada: el agente jamás contesta excepciones ni traslados.
- **RF-07:** El nivel de autonomía nunca debe comunicarse solo por color; debe acompañarse de texto e icono.
- **RF-08:** Toda acción debe quedar trazada con causa, documento/fuente, actor y fecha cuando aplique.
- **RF-09:** La landing no debe publicar hitos de facturación ni porcentajes de cobro: son información comercial que corresponde a una reunión.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: Las tres etapas aparecen con su gatillante correcto y sin porcentajes de cobro.
- [ ] AC-02: Los cuatro relojes declaran su plazo y su gatillante conforme a la especificación.
- [ ] AC-03: El reloj de excepciones se cuenta desde el estampado de requerimiento de pago y no desde la notificación.
- [ ] AC-04: La matriz muestra los tres niveles con el vocabulario cerrado del proyecto.
- [ ] AC-05: La línea roja aparece de forma destacada y sin matices.
- [ ] AC-06: El caso queda trazado con fuente o evidencia suficiente para auditoría funcional.

## 7. Notas de implementación

- Fuente funcional principal: `docs/especificacion-scraper-pjud-v3-2-corregido.md` y reglas condensadas en `.claude/skills/cobranza-legal-pjud/SKILL.md`.
- Fase asignada: [F7] Sitio público y captación. Esta fase ordena implementación y prioridad, pero no cambia el slug ni el parent de Linear.
- El front actual es un prototipo con mock data; los PRDs describen comportamiento funcional esperado para implementación real.
- Los porcentajes de facturación quedaron fuera de la landing por decisión de producto: no aportan al visitante y adelantan una conversación comercial.

## 8. Fuera de alcance v1

- Detallar el flujo de reposición y apelación caso a caso.
- Publicar el modelo de cobro y sus hitos de facturación.
- Publicar la matriz de autonomía completa ticket por ticket.
