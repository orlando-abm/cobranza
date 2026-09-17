# PRD: Cierre con demo e ingreso al producto

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

[F7] Sitio público y captación. Este ticket cubre el cierre de la landing: agendar una demo por correo, o ingresar al panel si el estudio ya es cliente. El dolor operativo de Cobranza Judicial es que el seguimiento manual de cientos de causas provoca atrasos, omisiones y pérdida de recuperación. El PRD debe dejar claro qué puede resolver el agente, qué queda bajo aprobación y qué se deriva a revisión humana.

La primera versión cerraba con «Agenda una demo» y un formulario de acceso anticipado sin backend que declaraba no estar habilitado. Kupera ya opera con estudios en app.kupera.cl, y un formulario que no envía es la señal de sitio en construcción que Google for Startups rechaza. El slug de este archivo se conserva como referencia de Linear.

## 2. Objetivos

- [ ] OBJ-01: Implementar el cierre con dos vías: agendar una demo e ingresar al producto.
- [ ] OBJ-02: Publicar un correo de contacto real, sin formularios que no envían.
- [ ] OBJ-03: Hacer explícito el gatillante de entrada, el resultado esperado y los bloqueos.
- [ ] OBJ-04: Respetar la autonomía declarada del ticket y derivar a humano cuando corresponda.

## 3. No-Goals

> Lo que explícitamente NO entra en este ticket.

- Automatizar decisiones reservadas al abogado, a la financiera o al receptor cuando la matriz de autonomía exige revisión.
- Cambiar reglas legales del juicio ejecutivo de cobranza automotriz por pagaré.
- Definir arquitectura técnica, proveedor OCR, modelo de datos físico o integración específica fuera del alcance funcional del PRD.
- Construir backend, base de datos o integración con calendario y CRM.
- Ofrecer listas de espera o acceso anticipado.

## 4. User Stories

| Como... | Quiero... | Para... |
|---------|-----------|---------|
| Abogado/a o procurador/a | pedir una demo con mis propios documentos | evaluar el sistema con casos que conozco |
| Cliente de Kupera | llegar al panel desde la landing | ingresar sin buscar la dirección |
| Operaciones del estudio | tener bloqueos, motivos y evidencias visibles | priorizar correcciones y evitar causas abandonadas |
| Equipo técnico | implementar sin inventar estados legales ni criterios de negocio fuera de la especificación | construir el flujo correcto desde la primera implementación |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** El sistema debe ofrecer dos vías diferenciadas: agendar una demo e ingresar a la plataforma.
- **RF-02:** La demo debe abrir un correo a la casilla de contacto con el asunto prellenado, y mostrar la dirección en texto.
- **RF-03:** El ingreso debe llevar a app.kupera.cl y mostrar el dominio en texto.
- **RF-04:** La landing no debe contener formularios mientras no exista un backend que los procese.
- **RF-05:** Sin casilla de contacto configurada, el botón de demo no se muestra; ningún enlace apunta a una dirección inventada.
- **RF-06:** Toda acción debe quedar trazada con causa, documento/fuente, actor y fecha cuando aplique.
- **RF-07:** Si falta información mínima o la confianza es baja, el flujo debe detener el avance automático y explicar el motivo.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: Las dos vías aparecen diferenciadas y accesibles desde la navegación.
- [ ] AC-02: El botón de demo abre un correo con asunto prellenado a la casilla publicada.
- [ ] AC-03: El botón de ingreso lleva a app.kupera.cl.
- [ ] AC-04: La landing no contiene `<form>` ni lenguaje de acceso anticipado.
- [ ] AC-05: Sin casilla de contacto configurada, ningún enlace apunta a una dirección inexistente.
- [ ] AC-06: El caso queda trazado con fuente o evidencia suficiente para auditoría funcional.

## 7. Notas de implementación

- Fuente funcional principal: `docs/especificacion-scraper-pjud-v3-2-corregido.md` y reglas condensadas en `.claude/skills/cobranza-legal-pjud/SKILL.md`.
- Fase asignada: [F7] Sitio público y captación. Esta fase ordena implementación y prioridad, pero no cambia el slug ni el parent de Linear.
- El chequeo `landing/scripts/check-publicacion.mjs` bloquea el build de producción si hay un `<form>` o falta el correo de contacto.
- Si se habilita un formulario, habrá que revisar el tratamiento de datos personales conforme a la Ley 21.719.

## 8. Fuera de alcance v1

- Integración con calendario, CRM o correo transaccional.
- Formularios con envío real.
