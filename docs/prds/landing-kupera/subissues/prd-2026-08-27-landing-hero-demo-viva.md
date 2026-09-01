# PRD: Hero con la resolución interpretada

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

[F7] Sitio público y captación. Este ticket cubre la apertura de la landing: la tesis del producto y una resolución del tribunal ya interpretada, con su borrador de respuesta. El dolor operativo de Cobranza Judicial es que el seguimiento manual de cientos de causas provoca atrasos, omisiones y pérdida de recuperación. El PRD debe dejar claro qué puede resolver el agente, qué queda bajo aprobación y qué se deriva a revisión humana.

La apertura debe mostrar el objeto característico del oficio —el escrito— en vez de una métrica genérica, y dejar clara desde la primera línea la división entre trámite y criterio. Se eligió mostrar al procurador respondiendo al tribunal y no la redacción de la demanda: esa parte se desarrolla más abajo, y abrir con ella dejaba el producto reducido a un generador de demandas.

## 2. Objetivos

- [ ] OBJ-01: Implementar el flujo para mostrar una resolución del tribunal ya interpretada, con el borrador de respuesta que produjo el agente.
- [ ] OBJ-02: Hacer explícito el gatillante de entrada, el resultado esperado y los bloqueos.
- [ ] OBJ-03: Respetar la autonomía declarada del ticket y derivar a humano cuando corresponda.

## 3. No-Goals

> Lo que explícitamente NO entra en este ticket.

- Automatizar decisiones reservadas al abogado, a la financiera o al receptor cuando la matriz de autonomía exige revisión.
- Cambiar reglas legales del juicio ejecutivo de cobranza automotriz por pagaré.
- Definir arquitectura técnica, proveedor OCR, modelo de datos físico o integración específica fuera del alcance funcional del PRD.
- Conectar el hero con datos reales de causas o de la aplicación.

## 4. User Stories

| Como... | Quiero... | Para... |
|---------|-----------|---------|
| Abogado/a o procurador/a | ver de inmediato qué hace el agente sobre un escrito | juzgar el producto por el trabajo, no por la promesa |
| Operaciones del estudio | tener bloqueos, motivos y evidencias visibles | priorizar correcciones y evitar causas abandonadas |
| Equipo técnico | implementar sin inventar estados legales ni criterios de negocio fuera de la especificación | construir el flujo correcto desde la primera implementación |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** El sistema debe permitir mostrar la lectura que hizo el agente de una resolución del tribunal y el borrador que dejó armado.
- **RF-02:** La lectura debe declarar qué pide el tribunal, qué plazo corre, qué dice la pauta de la financiera y el veredicto del agente.
- **RF-03:** El hero debe cerrar con las acciones humanas de corregir y firmar; no puede sugerir que el escrito se presenta solo.
- **RF-04:** La animación debe pausarse fuera de la pantalla y congelarse completa cuando el usuario pide menos movimiento.
- **RF-05:** Toda acción debe quedar trazada con causa, documento/fuente, actor y fecha cuando aplique.
- **RF-06:** Si falta información mínima o la confianza es baja, el flujo debe detener el avance automático y explicar el motivo.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: El hero muestra el borrador y la lectura del agente con el copy de la especificación.
- [ ] AC-02: La barra humana declara que ejecuta siempre un humano.
- [ ] AC-03: Ambos llamados a la acción quedan visibles sin desplazamiento en una pantalla de 900 píxeles de alto.
- [ ] AC-04: El ciclo se detiene fuera de pantalla y con `prefers-reduced-motion`.
- [ ] AC-05: El caso queda trazado con fuente o evidencia suficiente para auditoría funcional.

## 7. Notas de implementación

- Fuente funcional principal: `docs/especificacion-scraper-pjud-v3-2-corregido.md` y reglas condensadas en `.claude/skills/cobranza-legal-pjud/SKILL.md`.
- Fase asignada: [F7] Sitio público y captación. Esta fase ordena implementación y prioridad, pero no cambia el slug ni el parent de Linear.
- El front actual es un prototipo con mock data; los PRDs describen comportamiento funcional esperado para implementación real.
- El texto del escrito es ilustrativo y no constituye una plantilla aprobada.
- El hero reutiliza el primer caso de la sección del procurador, para no mantener dos copias del mismo contenido.

## 8. Fuera de alcance v1

- Video o grabación de la aplicación real.
- Personalización del hero por tipo de visitante.
