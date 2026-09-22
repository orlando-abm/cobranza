# PRD: El procurador en acción, de la resolución al borrador

**Tracker Task ID:** [pendiente de asignar]
**Creado:** 2026-08-27 | **Reunión:** Definición de sitio público y captación
**Participantes:** Equipo Producto ProdBooster, Equipo Legal/Operaciones, Equipo Desarrollo
**Estado:** Draft
**Fase:** [F7] Sitio público y captación
**Tipo Linear:** Subissue
**Parent Linear Issue:** landing-kupera
**Autonomía:** CON APROBACIÓN

---

## 1. Problema y Contexto

[F7] Sitio público y captación. Este ticket cubre mostrar el ciclo del procurador: llega una resolución del tribunal, el agente la interpreta y deja el escrito de respuesta redactado para que el abogado lo corrija o lo firme. El dolor operativo de Cobranza Judicial es que el seguimiento manual de cientos de causas provoca atrasos, omisiones y pérdida de recuperación. El PRD debe dejar claro qué puede resolver el agente, qué queda bajo aprobación y qué se deriva a revisión humana.

La primera versión de la landing explicaba bien la creación de la demanda, pero dejaba fuera el concepto que sostiene el producto: el agente no solo redacta al inicio, sino que responde al tribunal durante todo el juicio. Sin esa pieza, el visitante entiende una herramienta de generación de demandas y no un procurador.

## 2. Objetivos

- [ ] OBJ-01: Implementar el ciclo completo de interpretación: resolución que llega, lectura del agente y borrador que sale.
- [ ] OBJ-02: Mostrar al menos dos casos distintos para que se lea como capacidad general y no como un caso aislado.
- [ ] OBJ-03: Dejar explícito que el agente prepara y explica, pero nunca presenta solo.
- [ ] OBJ-04: Hacer explícito el gatillante de entrada, el resultado esperado y los bloqueos.
- [ ] OBJ-05: Respetar la autonomía declarada del ticket y derivar a humano cuando corresponda.

## 3. No-Goals

> Lo que explícitamente NO entra en este ticket.

- Automatizar decisiones reservadas al abogado, a la financiera o al receptor cuando la matriz de autonomía exige revisión.
- Cambiar reglas legales del juicio ejecutivo de cobranza automotriz por pagaré.
- Definir arquitectura técnica, proveedor OCR, modelo de datos físico o integración específica fuera del alcance funcional del PRD.
- Desarrollar el caso de excepciones y traslados en esta sección; se aborda en la matriz de autonomía y en las preguntas frecuentes.
- Usar resoluciones reales, roles reales o datos personales de deudores.

## 4. User Stories

| Como... | Quiero... | Para... |
|---------|-----------|---------|
| Abogado/a o procurador/a | ver cómo el agente interpreta una resolución y qué borrador produce | evaluar si su lectura del expediente coincide con la mía |
| Abogado/a o procurador/a | ver en qué se basó para redactar | poder corregirlo con criterio en vez de revisarlo a ciegas |
| Operaciones del estudio | tener bloqueos, motivos y evidencias visibles | priorizar correcciones y evitar causas abandonadas |
| Equipo técnico | implementar sin inventar estados legales ni criterios de negocio fuera de la especificación | construir el flujo correcto desde la primera implementación |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** El sistema debe presentar tres tiempos: la resolución que llega, la lectura del agente y el borrador que sale.
- **RF-02:** La lectura debe contraponer el título de la actuación con el contenido real del documento, porque el título del PJUD viene mal etiquetado con frecuencia.
- **RF-03:** La lectura debe declarar qué pide el tribunal, qué plazo corre, qué dice la pauta de la financiera y el veredicto del agente.
- **RF-04:** El caso «previo a proveer» debe respetar la pauta de rebaja de hasta 10% con tope de CLP 500.000, y declarar que fuera de pauta el agente redacta igual y advierte, para que el abogado decida entre cumplir o ir a reposición. (Enmienda de producto 2026-09-22.)
- **RF-05:** El caso «mandamiento con error» debe declarar la comparación campo a campo contra la demanda y que un mandamiento que no calza bloquea el avance a la Etapa 2.
- **RF-06:** El borrador debe acompañarse de las acciones humanas de corregir y firmar, y de la frase de la especificación: ejecuta siempre un humano.
- **RF-07:** El tachado solo debe aplicarse al valor que el agente descarta; nunca a un dato correcto.
- **RF-08:** Los documentos deben rotularse como ilustrativos y no contener datos personales reales.
- **RF-09:** Toda acción debe quedar trazada con causa, documento/fuente, actor y fecha cuando aplique.
- **RF-10:** Si falta información mínima o la confianza es baja, el flujo debe detener el avance automático y explicar el motivo.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: Los tres tiempos se muestran completos y legibles aunque no se ejecute JavaScript.
- [ ] AC-02: El selector de casos es operable por teclado y anuncia el caso seleccionado.
- [ ] AC-03: Ambos casos declaran su etapa y su nivel de autonomía con el vocabulario cerrado del proyecto.
- [ ] AC-04: El caso «previo a proveer» declara el plazo de quinto día y la pauta de rebaja vigente.
- [ ] AC-05: El caso «mandamiento con error» declara que la causa queda bloqueada hasta la rectificación.
- [ ] AC-06: Las acciones humanas de corregir y firmar aparecen junto al borrador.
- [ ] AC-07: Ningún dato correcto aparece tachado.
- [ ] AC-08: Con `prefers-reduced-motion` el escenario queda estático y completo.
- [ ] AC-09: El caso queda trazado con fuente o evidencia suficiente para auditoría funcional.

## 7. Notas de implementación

- Fuente funcional principal: `docs/especificacion-scraper-pjud-v3-2-corregido.md` y reglas condensadas en `.claude/skills/cobranza-legal-pjud/SKILL.md`.
- Fase asignada: [F7] Sitio público y captación. Esta fase ordena implementación y prioridad, pero no cambia el slug ni el parent de Linear.
- El front actual es un prototipo con mock data; los PRDs describen comportamiento funcional esperado para implementación real.
- Las hojas de papel nunca se atenúan para marcar un tiempo inactivo: el realce va en el rótulo y en el anillo, porque el papel apagado sobre fondo oscuro se lee como un error de render.
- La cifra del saldo insoluto y la liquidación de cuotas provienen de la plantilla descrita en la especificación y se usan de forma ilustrativa.

## 8. Fuera de alcance v1

- Casos de búsqueda negativa, exhorto y nuevo domicilio.
- Edición real del borrador desde la landing.
- Conexión con el editor de escritos del producto.
