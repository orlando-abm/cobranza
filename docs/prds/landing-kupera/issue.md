# PRD: Landing pública de Kupera

**Tracker Task ID:** [pendiente de asignar]
**Creado:** 2026-08-27 | **Reunión:** Definición de sitio público y captación
**Participantes:** Equipo Producto ProdBooster, Equipo Legal/Operaciones, Equipo Desarrollo
**Estado:** Draft
**Fase:** [F7] Sitio público y captación
**Tipo Linear:** Issue padre

---

## 1. Problema y Contexto

[F7] Sitio público y captación. Este ticket cubre construir la landing pública de Kupera, la marca comercial del agente de cobranza judicial automotriz por pagaré. Hasta ahora el repositorio solo contiene la aplicación interna: no existe página pública, ni presencia de marca fuera del prototipo, ni forma de que un estudio jurídico entienda el producto sin recorrer la app. El dolor operativo de Cobranza Judicial es que el seguimiento manual de cientos de causas provoca atrasos, omisiones y pérdida de recuperación, y la landing debe explicar exactamente qué parte de ese trámite ejecuta el agente, qué queda bajo aprobación y qué nunca toca.

Kupera es la empresa; ProdBooster es el venture studio del que nace. El sitio vive en kupera.cl y el producto opera en app.kupera.cl. La landing debe cumplir además los criterios de rechazo de Google for Startups (ver `prd-2026-09-17-landing-astro-y-criterios-google.md`).

## 2. Objetivos

- [ ] OBJ-01: Publicar una landing que explique el flujo del juicio ejecutivo de cobranza automotriz sin simplificarlo ni inventarlo.
- [ ] OBJ-02: Hacer explícita la matriz de autonomía, incluida la línea roja de que el agente redacta todo pero nunca presenta ni firma sin aprobación del abogado.
- [ ] OBJ-03: Mostrar al agente interpretando resoluciones del tribunal y dejando el escrito de respuesta redactado para revisión humana.
- [ ] OBJ-04: Ofrecer dos vías: agendar una demo e ingresar al producto en app.kupera.cl.
- [ ] OBJ-05: Construir la landing aislada de la aplicación, sin modificar su build, sus rutas ni sus estilos.
- [ ] OBJ-06: Cumplir accesibilidad AA verificada y mantener el contenido legible sin depender de animaciones.

## 3. No-Goals

> Lo que explícitamente NO entra en este ticket.

- Automatizar decisiones reservadas al abogado, a la financiera o al receptor cuando la matriz de autonomía exige revisión.
- Cambiar reglas legales del juicio ejecutivo de cobranza automotriz por pagaré.
- Definir arquitectura técnica, proveedor OCR, modelo de datos físico o integración específica fuera del alcance funcional del PRD.
- Renombrar la aplicación interna, que sigue rotulada como ProdBooster.
- Construir backend, autenticación o persistencia de los formularios de la landing.
- Publicar el modelo de cobro, sus hitos de facturación o cualquier condición comercial.

## 4. User Stories

| Como... | Quiero... | Para... |
|---------|-----------|---------|
| Abogado/a o procurador/a de un estudio de cobranza | entender qué parte del trámite ejecuta el agente y cuál sigue siendo mía | evaluar el producto sin temer que automatice criterio jurídico |
| Socio/a del estudio | ver el flujo completo con sus plazos y sus gatillantes | dimensionar el impacto en recuperación antes de agendar una reunión |
| Operaciones del estudio | ver bloqueos, motivos y evidencias visibles | entender cómo el agente evita causas abandonadas |
| Equipo técnico | implementar sin inventar estados legales ni criterios de negocio fuera de la especificación | construir el sitio correcto desde la primera implementación |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** La landing debe vivir en un proyecto propio, con build y dependencias separadas, sin modificar el código de la aplicación.
- **RF-02:** El contenido legal debe provenir de `docs/especificacion-scraper-pjud-v3-2-corregido.md` y del skill `cobranza-legal-pjud`; no se inventan estados, plazos, hitos ni automatizaciones.
- **RF-03:** La landing no debe mostrar clientes, logotipos, credenciales ni cifras de negocio que no existan.
- **RF-04:** Todo el copy debe estar centralizado en un único módulo de contenido, sin texto escrito en el marcado.
- **RF-05:** El copy debe usar español chileno con tuteo o forma impersonal, en voz activa, sin voseo.
- **RF-06:** El contenido debe ser legible sin JavaScript y no debe depender de animaciones para hacerse visible.
- **RF-07:** Los pares de color texto/fondo deben verificarse contra WCAG AA de forma automática y detener el build si alguno baja de norma.
- **RF-08:** La landing debe respetar `prefers-reduced-motion` deteniendo ciclos, apariciones y pulsos.
- **RF-09:** La landing no debe contener formularios sin backend ni lenguaje de lista de espera o acceso anticipado.
- **RF-10:** La landing debe mostrar fundadores con perfiles públicos verificables, la identidad legal de la empresa y capturas reales del producto.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: El build y el lint de la aplicación pasan sin cambios tras incorporar la landing.
- [ ] AC-02: El build y el lint de la landing pasan limpios.
- [ ] AC-03: La verificación automática de contraste pasa y forma parte del build.
- [ ] AC-04: La landing no presenta scroll horizontal a 375, 768, 1024 y 1440 píxeles.
- [ ] AC-05: Existe contenido alternativo legible cuando el navegador no ejecuta JavaScript.
- [ ] AC-06: Ningún estado, plazo ni nivel de autonomía contradice la especificación legal.
- [ ] AC-07: La navegación completa por teclado muestra foco visible y la página tiene un solo `h1`.
- [ ] AC-08: La landing no publica hitos de facturación ni porcentajes de cobro.
- [ ] AC-09: El build de producción pasa el chequeo de publicación de `landing/scripts/check-publicacion.mjs`.

## 7. Notas de implementación

- Fuente funcional principal: `docs/especificacion-scraper-pjud-v3-2-corregido.md` y reglas condensadas en `.claude/skills/cobranza-legal-pjud/SKILL.md`.
- Sistema de diseño resuelto y versionado en `design-system/kupera-landing/`, con `pages/landing.md` anulando `MASTER.md` donde el brief manda.
- Fase asignada: [F7] Sitio público y captación. Esta fase ordena implementación y prioridad, pero no cambia el slug ni el parent de Linear.
- El front actual es un prototipo con mock data; la landing describe comportamiento funcional esperado, no promete funcionalidad construida.
- La identidad visual hereda la paleta Tribunal de la aplicación en clave oscura: navy profundo, latón, Fraunces e Inter.
- La landing se construye con Astro como sitio estático, siguiendo la receta de la landing de ProdBooster Studio.

## 8. Fuera de alcance v1

- Backend, envío real de formularios y agenda de reuniones.
- Versiones en otros idiomas.
- Blog, casos de éxito y precios.
