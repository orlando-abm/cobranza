# PRD: Llamados a la acción de demo y acceso anticipado

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

[F7] Sitio público y captación. Este ticket cubre el cierre de la landing: agendar una demo y solicitar acceso anticipado. El dolor operativo de Cobranza Judicial es que el seguimiento manual de cientos de causas provoca atrasos, omisiones y pérdida de recuperación. El PRD debe dejar claro qué puede resolver el agente, qué queda bajo aprobación y qué se deriva a revisión humana.

Todavía no existe backend ni casilla de contacto, y el dominio kupera.cl no está registrado. El cierre debe capturar interés sin fingir capacidades que no existen.

## 2. Objetivos

- [ ] OBJ-01: Implementar el cierre con dos vías de conversión: demo y acceso anticipado.
- [ ] OBJ-02: Calificar al interesado por volumen de cartera sin pedir datos innecesarios.
- [ ] OBJ-03: Hacer explícito el gatillante de entrada, el resultado esperado y los bloqueos.
- [ ] OBJ-04: Respetar la autonomía declarada del ticket y derivar a humano cuando corresponda.

## 3. No-Goals

> Lo que explícitamente NO entra en este ticket.

- Automatizar decisiones reservadas al abogado, a la financiera o al receptor cuando la matriz de autonomía exige revisión.
- Cambiar reglas legales del juicio ejecutivo de cobranza automotriz por pagaré.
- Definir arquitectura técnica, proveedor OCR, modelo de datos físico o integración específica fuera del alcance funcional del PRD.
- Construir backend, base de datos o integración con calendario y CRM.

## 4. User Stories

| Como... | Quiero... | Para... |
|---------|-----------|---------|
| Abogado/a o procurador/a | pedir una demo con mis propios documentos | evaluar el sistema con casos que conozco |
| Socio/a del estudio | dejar mis datos para acceso anticipado | ser contactado cuando abran cupos |
| Operaciones del estudio | tener bloqueos, motivos y evidencias visibles | priorizar correcciones y evitar causas abandonadas |
| Equipo técnico | implementar sin inventar estados legales ni criterios de negocio fuera de la especificación | construir el flujo correcto desde la primera implementación |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** El sistema debe ofrecer dos vías diferenciadas: agendar una demo y solicitar acceso anticipado.
- **RF-02:** El formulario debe pedir nombre, estudio, correo y volumen de cartera, y nada más.
- **RF-03:** Cada campo debe tener etiqueta visible y el error debe mostrarse junto al campo que lo origina.
- **RF-04:** Mientras no exista backend, el formulario debe declarar con franqueza que aún no envía, en vez de simular un envío exitoso.
- **RF-05:** Mientras no exista casilla de contacto, el botón de demo debe llevar al formulario y no a una dirección inventada.
- **RF-06:** El resultado del envío debe anunciarse a lectores de pantalla mediante una región activa.
- **RF-07:** Toda acción debe quedar trazada con causa, documento/fuente, actor y fecha cuando aplique.
- **RF-08:** Si falta información mínima o la confianza es baja, el flujo debe detener el avance automático y explicar el motivo.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: Las dos vías de conversión aparecen diferenciadas y accesibles desde la navegación.
- [ ] AC-02: El formulario valida los campos obligatorios y muestra el error junto al campo.
- [ ] AC-03: Sin backend configurado, el mensaje declara que el envío todavía no está habilitado.
- [ ] AC-04: Sin casilla de contacto configurada, ningún enlace apunta a una dirección inexistente.
- [ ] AC-05: El estado del formulario se anuncia mediante una región activa y educada.
- [ ] AC-06: El caso queda trazado con fuente o evidencia suficiente para auditoría funcional.

## 7. Notas de implementación

- Fuente funcional principal: `docs/especificacion-scraper-pjud-v3-2-corregido.md` y reglas condensadas en `.claude/skills/cobranza-legal-pjud/SKILL.md`.
- Fase asignada: [F7] Sitio público y captación. Esta fase ordena implementación y prioridad, pero no cambia el slug ni el parent de Linear.
- El front actual es un prototipo con mock data; los PRDs describen comportamiento funcional esperado para implementación real.
- Al habilitar el envío habrá que revisar el tratamiento de datos personales conforme a la Ley 21.719.

## 8. Fuera de alcance v1

- Integración con calendario, CRM o correo transaccional.
- Verificación de correo y protección contra envíos automatizados.
