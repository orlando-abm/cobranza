# PRD: Causa de ejemplo con los artefactos del expediente

**Tracker Task ID:** [pendiente de asignar]
**Creado:** 2026-08-27 | **Reunión:** Definición de sitio público y captación
**Participantes:** Equipo Producto ProdBooster, Equipo Legal/Operaciones, Equipo Desarrollo
**Estado:** Draft
**Fase:** [F7] Sitio público y captación
**Tipo Linear:** Subissue
**Parent Linear Issue:** landing-kupera
**Autonomía:** CONFIGURACIÓN OPERATIVA

---

## 1. Problema y Contexto

[F7] Sitio público y captación. Este ticket cubre recorrer una causa completa, hito por hito, con los documentos que el agente lee y los que genera. El dolor operativo de Cobranza Judicial es que el seguimiento manual de cientos de causas provoca atrasos, omisiones y pérdida de recuperación. El PRD debe dejar claro qué puede resolver el agente, qué queda bajo aprobación y qué se deriva a revisión humana.

Es la sección de prueba del producto. Un abogado juzga la seriedad del sistema por si los hitos, los plazos y los documentos calzan con su práctica real, no por adjetivos.

## 2. Objetivos

- [ ] OBJ-01: Implementar el recorrido de los nueve hitos del juicio ejecutivo, del lote de la financiera a la inscripción del embargo.
- [ ] OBJ-02: Mostrar los artefactos reales del expediente: encargo al receptor, estampado y escrito generado.
- [ ] OBJ-03: Hacer explícito el gatillante de entrada, el resultado esperado y los bloqueos.
- [ ] OBJ-04: Respetar la autonomía declarada del ticket y derivar a humano cuando corresponda.

## 3. No-Goals

> Lo que explícitamente NO entra en este ticket.

- Automatizar decisiones reservadas al abogado, a la financiera o al receptor cuando la matriz de autonomía exige revisión.
- Cambiar reglas legales del juicio ejecutivo de cobranza automotriz por pagaré.
- Definir arquitectura técnica, proveedor OCR, modelo de datos físico o integración específica fuera del alcance funcional del PRD.
- Usar documentos de causas reales o datos personales de deudores.

## 4. User Stories

| Como... | Quiero... | Para... |
|---------|-----------|---------|
| Abogado/a o procurador/a | ver el recorrido completo con sus documentos | verificar que el sistema entiende el juicio como lo trabajo |
| Socio/a del estudio | ver dónde se cumplen los hitos de cobro | dimensionar el impacto en recuperación |
| Operaciones del estudio | tener bloqueos, motivos y evidencias visibles | priorizar correcciones y evitar causas abandonadas |
| Equipo técnico | implementar sin inventar estados legales ni criterios de negocio fuera de la especificación | construir el flujo correcto desde la primera implementación |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** El sistema debe permitir recorrer los hitos en el orden legal de la especificación, sin saltarse ninguno ni agregar pasos.
- **RF-02:** El hito de subida debe dejar claro que la causa y el rol nacen recién cuando la patrocinante envía, y que ahí arranca el reloj.
- **RF-03:** El hito de notificación debe indicar que se lee el contenido del estampado y no su título, y que la notificación efectiva gatilla el embargo de forma directa.
- **RF-04:** El hito de embargo debe distinguir el comprobante de ingreso, que solo arranca el reloj, de la inscripción aceptada en el Registro Civil, que es el gatillante real.
- **RF-05:** Cada hito debe declarar su nivel de autonomía usando el vocabulario ya empleado en los PRDs del proyecto.
- **RF-06:** Los artefactos deben ser ilustrativos y estar rotulados como tales, sin datos personales reales.
- **RF-07:** Toda acción debe quedar trazada con causa, documento/fuente, actor y fecha cuando aplique.
- **RF-08:** Si falta información mínima o la confianza es baja, el flujo debe detener el avance automático y explicar el motivo.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: Los nueve hitos aparecen en el orden legal y cada uno declara su etapa y su autonomía.
- [ ] AC-02: El nacimiento del rol se ubica en el envío de la patrocinante y no antes.
- [ ] AC-03: La inscripción en el Registro Civil se presenta como gatillante, y el comprobante de ingreso solo como inicio del reloj.
- [ ] AC-04: Las pestañas de artefactos son operables por teclado y anuncian su estado seleccionado.
- [ ] AC-05: El primer artefacto queda legible aunque no se ejecute JavaScript.
- [ ] AC-06: El caso queda trazado con fuente o evidencia suficiente para auditoría funcional.

## 7. Notas de implementación

- Fuente funcional principal: `docs/especificacion-scraper-pjud-v3-2-corregido.md` y reglas condensadas en `.claude/skills/cobranza-legal-pjud/SKILL.md`.
- Fase asignada: [F7] Sitio público y captación. Esta fase ordena implementación y prioridad, pero no cambia el slug ni el parent de Linear.
- El front actual es un prototipo con mock data; los PRDs describen comportamiento funcional esperado para implementación real.
- Validar siempre los casos borde con documentos reales o fixtures que representen pagarés/CAV/estampados escaneados.

## 8. Fuera de alcance v1

- Recorridos alternativos por búsqueda negativa, exhorto o excepciones opuestas.
- Descarga de los documentos de ejemplo.
