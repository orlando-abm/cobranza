# Landing de Kupera — reglas de página

> Este archivo **anula** `../MASTER.md` donde haya conflicto (regla de `ui-ux-pro-max`).
> Generado tras la pasada de crítica de `frontend-design`. Es la fuente de verdad del diseño de la landing.

**Sujeto:** Kupera, agente de cobranza judicial automotriz por pagaré (Chile).
**Audiencia:** abogados y procuradores de estudios jurídicos que hoy siguen cientos de causas a mano.
**Trabajo único de la página:** convencer de que el agente ejecuta el trámite sin tocar el criterio jurídico, y conseguir una demo o una inscripción a early access.

---

## 1. Qué se toma del MASTER y qué se anula

| Eje | MASTER dice | Decisión | Por qué |
|---|---|---|---|
| Estilo | Trust & Authority | **Se acepta** | Su "Best For" incluye *legal services*. Valida la dirección de forma independiente |
| Anti-patrones | Sin diseño lúdico, sin gradientes morado/rosa de IA | **Se acepta tal cual** | |
| Color | Navy `#1E3A8A` + oro `#B45309`, fondo claro `#F8FAFC` | **Anulado en modo, conservado en concepto** | El skill llegó solo a "authority navy + trust gold", que es exactamente navy + latón. Pero el brief fija **modo oscuro** y los hex de la identidad Tribunal ya existente |
| Tipografía | EB Garamond / Lato | **Anulado** | El brief fija Fraunces + Inter, heredados de la app. Mismo rol (serif display de autoridad), marca ya establecida |
| Patrón de página | Bento Grid Showcase | **Anulado como estructura global; se usa solo en el folio 04** | La página es narrativa —movimientos encadenados—, no una grilla de features. Un bento como esqueleto convertiría un argumento en un catálogo |
| Efectos clave | Carrusel de certificados, grilla de badges | **Descartado** | Kupera no tiene clientes ni certificaciones todavía y no se inventan. La prueba de autoridad aquí es el expediente mismo, no un logo de SOC2 |
| Motion | Stagger con `back.out(1.4)`, GSAP | **Anulado** | El propio MASTER advierte: *"Don't use back.out on dense data tables; the overshoot reads as sloppy on informational UI"*. Toda esta landing es informacional. Además no hay GSAP en el stack |
| Sombras | Negras (`rgba(0,0,0,…)`) | **Anulado** | Tintadas de navy, y una sombra específica de "papel levantado" para las hojas |
| Espaciado (density 3) | 4/8/24/32/48/64/96 | **Se acepta** | |
| Checklist de pre-entrega | — | **Se acepta completo** | Ver §6 |

## 2. Pasada 1 — plan de tokens

### Color

| Token | Hex | Rol |
|---|---|---|
| `--color-ink` | `#0A1826` | Fondo base. Navy con azul medible, **no negro** |
| `--color-ink-2` | `#0E2540` | Superficie elevada. Es el `--indigo` de la app: continuidad de marca |
| `--color-surface` | `#16344F` | Tarjetas y paneles sobre ink-2 |
| `--color-paper` | `#F6F3EC` | **Papel.** Superficie de los documentos, no solo color de texto |
| `--color-paper-edge` | `#E5E0D5` | Borde cálido del papel (el `--line` de la app) |
| `--color-ink-on-paper` | `#12212E` | Texto dentro de las hojas |
| `--color-cream` | `#F6F3EC` | Texto principal sobre navy |
| `--color-muted` | `#9FB0C4` | Texto secundario sobre navy |
| `--color-brass` | `#B0843F` | Sellos, folios, remates |
| `--color-brass-hi` | `#D4AC6A` | Latón claro, para texto sobre navy |
| `--color-line` | `rgba(246,243,236,.10)` | Hairlines |
| `--color-line-hi` | `rgba(246,243,236,.18)` | Hairlines de énfasis |

Un solo acento (latón). Nada de rojo/verde semántico decorativo: los estados del agente se distinguen por icono y texto, nunca solo por color (`color-not-only`).

### Tipografía — cuatro roles, cada uno justificado

- **Fraunces** — display. Pesos 400 y 600, nada más. Con moderación: solo títulos de movimiento y los tres remates de la página.
- **Inter** — cuerpo. 400 y 600.
- **JetBrains Mono** — folios, roles, RUT, patentes, montos, plazos y timestamps. En un expediente los datos van en cifras tabulares (`number-tabular`), no es decoración.
- **Georgia / Times** — **solo dentro de las hojas de papel.** Es el tipo real de los escritos del producto (ver `.escrito-sheet` en [src/components/EscritoEditor.tsx](src/components/EscritoEditor.tsx)). Citar el artefacto, no estilizarlo.

Escala fluida con `clamp()`, sin breakpoints, empaquetando tracking y leading en el token (sintaxis `--text-X--line-height` de Tailwind 4).

### Layout

- Un contenedor: `max-w-[76rem]` + `px-6 sm:px-8 lg:px-10`.
- **Margen de foliación**: en `lg+`, una columna izquierda de 4rem con el número de folio sticky acompañando el scroll. En móvil el folio va inline sobre el eyebrow.
- Dos ritmos verticales: `statement` = `py-24 md:py-36`, `evidence` = `py-16 md:py-24`.
- `min-h-dvh`, nunca `100vh`.

### Firma

**La hoja.** Cada vez que aparece un documento real —la demanda redactándose, el estampado del receptor, el mail de encargo, el escrito generado— se renderiza como una **hoja marfil con márgenes de escrito, tipografía de documento y número de folio en el borde**, apoyada sobre el navy. El contraste papel-sobre-tribunal *es* la identidad: la página oscura es la sala, los rectángulos claros son el expediente.

La foliación es el tejido conectivo entre movimientos. El motivo recurrente es el **reloj de plazo** (8 días para excepciones, 4 para traslado, 5 para reposición, ~30 del Registro Civil), en mono y latón, que reaparece en la tensión, en la causa de ejemplo y en el flujo.

## 3. Pasada 2 — crítica contra el brief

`frontend-design` nombra tres clichés de diseño generado por IA. El segundo —fondo casi negro con un único acento brillante— describía mi primera propuesta con incomodidad. Qué cambió:

1. **El fondo no es negro y el acento no es neón.** `#0A1826` tiene azul medible, y el latón `#B0843F` es desaturado. Más importante: el segundo color dominante de la página **no es el acento sino el papel marfil en superficie grande**. Una landing con rectángulos crema ocupando media pantalla no se lee como el patrón "dark + acento".

2. **El hero no abre con una métrica grande sobre un gradiente** — el skill llama a eso "the template answer". Abre con **la hoja escribiéndose**: la demanda redactándose en tiempo real junto a los pasos del agente. Es el objeto más característico del oficio y es, literalmente, lo que vende el producto.

3. **La numeración se conserva porque hay secuencia real.** El skill advierte que los marcadores 01/02/03 solo se justifican si el contenido *es* una secuencia. El juicio ejecutivo lo es, con orden legal obligatorio. Pero se rotula **folio**, que es la palabra del oficio, no un número decorativo.

4. **Se descarta la prueba social genérica.** El estilo Trust & Authority pide badges de certificación y carrusel de credenciales. Kupera no tiene clientes ni certificaciones, y la convención del repo es no inventar datos. La prueba es el expediente de ejemplo con artefactos verificables.

5. **Se quita un accesorio.** Fuera el marquee de logos de financieras: no hay logos reales que mostrar, y un marquee vacío o inventado es exactamente el relleno que hace que un diseño se sienta automático.

6. **El motion se subordina al contenido.** Sin overshoot (el propio MASTER lo desaconseja para UI informacional), solo `opacity`/`transform`, 150-300 ms de entrada con `cubic-bezier(0.16,1,0.3,1)` y salidas al ~65%. Ninguna animación decide si el contenido es visible.

## 4. Motion

```css
--ease-brand: cubic-bezier(0.16, 1, 0.3, 1);
```

- Entradas 150-300 ms; salidas ~65% de la entrada (`exit-faster-than-enter`).
- Stagger de 60 ms por ítem (`stagger-sequence`: 30-50 ms; 60 es el borde superior y encaja con el ritmo del expediente).
- Solo `opacity` y `transform`.
- Reveals por **mejora progresiva**: sin JS el contenido está visible. Nunca `whileInView`.
- `prefers-reduced-motion`: sin ciclo del expediente (se congela completo), sin reveals, sin pulsos.

## 5. Estructura de la página

| Folio | Sección | Ritmo |
|---|---|---|
| — | Nav flotante | — |
| 01 | Hero + la hoja escribiéndose | statement |
| 02 | Tensión | statement |
| 03 | Causa de ejemplo (timeline + artefactos) | evidence |
| 04 | Flujo completo — **aquí sí bento/hairline grid** | evidence |
| 05 | Matriz de autonomía | statement |
| 06 | CTA doble: demo + early access | statement |
| — | Footer | — |

## 6. Checklist de pre-entrega

Del MASTER, aceptado completo, más lo específico de esta página:

- [ ] Sin emojis como iconos; un solo set (Lucide)
- [ ] `cursor-pointer` en todo lo clickeable
- [ ] Transiciones 150-300 ms en hover; sin cambios instantáneos
- [ ] Contraste ≥4.5:1 verificado por `check-contrast.mjs` en el build
- [ ] Foco visible en navegación por teclado; skip-link
- [ ] `prefers-reduced-motion` respetado
- [ ] Responsive 375 / 768 / 1024 / 1440, sin scroll horizontal
- [ ] Nada del contenido tapado por el nav fijo (`scroll-padding-top`)
- [ ] **Sin JavaScript el contenido sigue siendo legible**
- [ ] Ningún dato legal, plazo o estado que no esté en `cobranza-legal-pjud`
- [ ] Ningún cliente, logo, cifra de negocio o credencial inventada
- [ ] Sin voseo; tuteo o impersonal, voz activa
