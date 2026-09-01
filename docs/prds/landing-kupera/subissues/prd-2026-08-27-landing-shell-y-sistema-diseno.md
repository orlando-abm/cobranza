# PRD: Proyecto de la landing y sistema de diseño Tribunal oscuro

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

[F7] Sitio público y captación. Este ticket cubre montar el proyecto aislado de la landing y su sistema de diseño, incluida la navegación flotante. El dolor operativo de Cobranza Judicial es que el seguimiento manual de cientos de causas provoca atrasos, omisiones y pérdida de recuperación. El PRD debe dejar claro qué puede resolver el agente, qué queda bajo aprobación y qué se deriva a revisión humana.

La landing no puede poner en riesgo la aplicación del producto: comparten repositorio pero no build, ni estilos, ni dependencias. La identidad hereda la paleta Tribunal de la aplicación, invertida a modo oscuro.

## 2. Objetivos

- [ ] OBJ-01: Implementar el proyecto de la landing con build, dependencias y linter propios, sin tocar la aplicación.
- [ ] OBJ-02: Definir los tokens de color, tipografía, espaciado y movimiento en un único lugar verificable.
- [ ] OBJ-03: Hacer explícito el gatillante de entrada, el resultado esperado y los bloqueos.
- [ ] OBJ-04: Respetar la autonomía declarada del ticket y derivar a humano cuando corresponda.

## 3. No-Goals

> Lo que explícitamente NO entra en este ticket.

- Automatizar decisiones reservadas al abogado, a la financiera o al receptor cuando la matriz de autonomía exige revisión.
- Cambiar reglas legales del juicio ejecutivo de cobranza automotriz por pagaré.
- Definir arquitectura técnica, proveedor OCR, modelo de datos físico o integración específica fuera del alcance funcional del PRD.
- Modificar los tokens, las rutas o el CSS de la aplicación interna.

## 4. User Stories

| Como... | Quiero... | Para... |
|---------|-----------|---------|
| Equipo técnico | montar la landing sin riesgo de regresión en la aplicación | publicar el sitio sin frenar el desarrollo del producto |
| Operaciones del estudio | tener bloqueos, motivos y evidencias visibles | priorizar correcciones y evitar causas abandonadas |
| Equipo de diseño | tener un sistema de tokens verificado contra accesibilidad | evitar que la paleta se degrade con cada sección nueva |

## 5. Requerimientos Funcionales

### 5.1 Comportamiento esperado

- **RF-01:** El sistema debe permitir construir y servir la landing de forma independiente de la aplicación.
- **RF-02:** Los tokens de color, tipografía y movimiento deben declararse en un único bloque de tema.
- **RF-03:** La verificación de contraste debe correr dentro del build y detenerlo si un par baja de WCAG AA.
- **RF-04:** La navegación debe indicar la sección activa y no debe tapar el contenido al saltar a un anclaje.
- **RF-05:** Toda acción debe quedar trazada con causa, documento/fuente, actor y fecha cuando aplique.
- **RF-06:** Si falta información mínima o la confianza es baja, el flujo debe detener el avance automático y explicar el motivo.

## 6. Criterios de Aceptación

> IMPORTANTE: machine-readable. El validador automático de GitHub PRs los usa.

- [ ] AC-01: El build y el lint de la aplicación pasan sin modificaciones en su código.
- [ ] AC-02: El build y el lint de la landing pasan limpios desde su propio proyecto.
- [ ] AC-03: La verificación de contraste corre en el build y falla si un par baja de norma.
- [ ] AC-04: La navegación marca la sección activa y es operable por teclado con foco visible.
- [ ] AC-05: El caso queda trazado con fuente o evidencia suficiente para auditoría funcional.

## 7. Notas de implementación

- Fuente funcional principal: `docs/especificacion-scraper-pjud-v3-2-corregido.md` y reglas condensadas en `.claude/skills/cobranza-legal-pjud/SKILL.md`.
- Sistema de diseño en `design-system/kupera-landing/pages/landing.md`, que anula el `MASTER.md` generado donde el brief manda.
- Fase asignada: [F7] Sitio público y captación. Esta fase ordena implementación y prioridad, pero no cambia el slug ni el parent de Linear.
- El front actual es un prototipo con mock data; los PRDs describen comportamiento funcional esperado para implementación real.

## 8. Fuera de alcance v1

- Compartir componentes con la aplicación interna.
- Modo claro de la landing.
