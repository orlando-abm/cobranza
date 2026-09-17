# PRD: Landing en Astro y cumplimiento de criterios de Google for Startups

**Tracker Task ID:** [pendiente de asignar]
**Creado:** 2026-09-17 | **Reunión:** Rechazo de postulación a Google for Startups
**Participantes:** Equipo Producto ProdBooster, Equipo Desarrollo
**Estado:** Draft
**Fase:** [F7] Sitio público y captación
**Tipo Linear:** Subissue
**Parent Linear Issue:** landing-kupera
**Autonomía:** CONFIGURACIÓN OPERATIVA

---

## 1. Problema y Contexto

[F7] Sitio público y captación. Este ticket cubre migrar la landing a Astro y dejarla en condiciones de pasar los tres criterios de rechazo de Google for Startups. El dolor operativo de Cobranza Judicial es que el seguimiento manual de cientos de causas provoca atrasos, omisiones y pérdida de recuperación. El PRD debe dejar claro qué puede resolver el agente, qué queda bajo aprobación y qué se deriva a revisión humana.

La postulación con kupera.cl choca con los tres criterios de rechazo de Google for Startups:

1. **Dominio inaccesible o de ensayo.** El sitio publicado declaraba `noindex` y su canonical apuntaba a un dominio `*.vercel.app`.
2. **Producto incompleto.** Los únicos llamados a la acción eran «Agenda una demo» y «Pide acceso anticipado», el formulario declaraba no estar habilitado y no había ninguna muestra de la interfaz del producto. Además, la landing en React entregaba un HTML vacío: cero palabras visibles sin JavaScript.
3. **Falta de transparencia operativa.** No había fundadores, perfiles públicos verificables, correo de contacto ni datos societarios.

El producto opera en app.kupera.cl con estudios jurídicos, pero ese dominio solo muestra una pantalla de acceso, así que el revisor no puede ver la interfaz desde ahí.

## 2. Objetivos

- [ ] OBJ-01: Servir la landing como HTML estático completo, legible sin JavaScript.
- [ ] OBJ-02: Mostrar la interfaz real del producto y enlazar al panel en app.kupera.cl.
- [ ] OBJ-03: Publicar fundadores con perfiles verificables y la identidad legal de la empresa.
- [ ] OBJ-04: Impedir de forma automática que un sitio que no cumple los criterios llegue a producción.
- [ ] OBJ-05: Respetar la autonomía declarada del ticket y derivar a humano cuando corresponda.

## 3. No-Goals

> Lo que explícitamente NO entra en este ticket.

- Automatizar decisiones reservadas al abogado, a la financiera o al receptor cuando la matriz de autonomía exige revisión.
- Cambiar reglas legales del juicio ejecutivo de cobranza automotriz por pagaré.
- Definir arquitectura técnica, proveedor OCR, modelo de datos físico o integración específica fuera del alcance funcional del PRD.
- Modificar la aplicación de app.kupera.cl, que vive en otro repositorio.
- Presentar como lanzado algo que no lo está, o mostrar clientes, cifras o credenciales que no existan.

## 4. User Stories

| Como... | Quiero... | Para... |
|---------|-----------|---------|
| Revisor de un programa de startups | ver en el dominio el producto real y quién está detrás | verificar que la empresa opera |
| Abogado/a o procurador/a | ver cómo se ve el panel antes de agendar una demo | decidir si vale la pena conversar |
| Cliente de Kupera | llegar al panel desde la landing | ingresar sin buscar la dirección |
| Equipo técnico | que el build rechace un sitio incompleto | no publicar por error una versión que Google rechaza |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** La landing debe construirse con Astro como sitio estático, sin framework de interfaz en el navegador.
- **RF-02:** El dominio canónico en producción debe ser kupera.cl; un deploy de ensayo debe salir con `noindex`, `robots.txt` en `Disallow` y sin sitemap.
- **RF-03:** La landing debe enlazar a app.kupera.cl desde el nav, el hero, la sección de producto y el cierre.
- **RF-04:** La sección de producto debe mostrar capturas reales del panel con datos de ejemplo, nunca datos de deudores.
- **RF-05:** La landing no debe contener formularios que no envían ni lenguaje de lista de espera, acceso anticipado o beta.
- **RF-06:** La sección de equipo debe mostrar a cada fundador con cargo y enlace a su perfil público de LinkedIn.
- **RF-07:** El pie debe mostrar razón social, RUT, domicilio y correo de contacto, y los mismos datos deben ir en los datos estructurados de la organización.
- **RF-08:** Ningún dato faltante debe reemplazarse por un marcador visible; la sección o el campo simplemente no se muestra.
- **RF-09:** El build de producción debe fallar si el sitio construido no cumple algún criterio verificable.
- **RF-10:** Toda acción debe quedar trazada con causa, documento/fuente, actor y fecha cuando aplique.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: `npm run build` en `landing/` corre contraste, `astro check`, el build de Astro y `scripts/check-publicacion.mjs`.
- [ ] AC-02: Con el dominio de producción, el chequeo de publicación falla si falta cualquiera de los 19 criterios.
- [ ] AC-03: En un deploy de ensayo el chequeo advierte pero no detiene el build.
- [ ] AC-04: El HTML servido contiene al menos 600 palabras visibles sin JavaScript y un solo `h1`.
- [ ] AC-05: No hay scroll horizontal a 375, 768, 1024 y 1440 píxeles.
- [ ] AC-06: La landing no contiene `<form>` ni marcadores como «[pendiente]».
- [ ] AC-07: El caso queda trazado con fuente o evidencia suficiente para auditoría funcional.

## 7. Notas de implementación

- Fuente funcional principal: `docs/especificacion-scraper-pjud-v3-2-corregido.md` y reglas condensadas en `.claude/skills/cobranza-legal-pjud/SKILL.md`.
- Fase asignada: [F7] Sitio público y captación. Esta fase ordena implementación y prioridad, pero no cambia el slug ni el parent de Linear.
- Se sigue la receta de la landing de ProdBooster Studio: Astro, Tailwind 4, scripts en línea por mejora progresiva e iconos renderizados en build con `@lucide/astro`.
- Las fuentes se cargan solo con el subset latino.
- Las clases que sobrescriben utilidades de Tailwind pasan por `cn()`: `class:list` no resuelve conflictos y dejaba visibles en móvil los botones del nav de escritorio.
- La aplicación de app.kupera.cl está rotulada como «PJUD» y usa un correo de ejemplo `@pjud.cl`. PJUD es la sigla del Poder Judicial; conviene renombrarla a Kupera antes de postular, en su propio repositorio.

## 8. Fuera de alcance v1

- Credenciales de demostración para revisores; se entregan en el formulario de postulación, no en el sitio.
- Política de privacidad y términos de uso, que requieren redacción legal.
- Envío de formularios con backend.
