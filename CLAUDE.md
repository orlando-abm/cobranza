# ProdBooster · Cobranza Judicial — reglas del proyecto

Front (solo frontend) del agente de cobranza judicial para estudios jurídicos. React 19 + TS + Vite + Zustand.

## Features nuevos — PRD obligatorio

- **Todo feature nuevo** (funcionalidad, no corrección de bugs) **debe llevar un PRD asociado** en `docs/prds/`,
  siguiendo la estructura existente (formato Linear):
  - Ubicación: `docs/prds/<issue-padre>/subissues/prd-YYYY-MM-DD-<slug>.md` (o un `issue.md` si es un issue padre nuevo).
  - Misma **estructura interior** que los PRDs existentes: metadata (Tracker Task ID, Creado/Reunión, Participantes,
    Estado, Tipo Linear, Parent Linear Issue, Autonomía) + secciones 1-8 (Problema y Contexto · Objetivos `OBJ-##` ·
    No-Goals · User Stories · Requerimientos Funcionales `RF-##` · Criterios de Aceptación `AC-##` machine-readable ·
    Notas de implementación · Fuera de alcance v1).
  - **Registrarlo** en el índice `docs/prds/prd-2026-07-14-00-indice-linear.md` bajo su issue padre.
- Las **correcciones de errores** no requieren PRD.
- Ejemplo: [docs/prds/demanda-redaccion-revision/subissues/prd-2026-07-14-demanda-detalle-agentico.md](docs/prds/demanda-redaccion-revision/subissues/prd-2026-07-14-demanda-detalle-agentico.md).

## Copy / idioma — regla dura

- **Nunca usar voseo (rioplatense).** Español chileno neutro con **tuteo ("tú")** o forma impersonal.
- Evitar imperativos voseantes (-á/-é/-í) y "podés/querés/tenés/vos".
  - ❌ "arrastrá", "podés", "pedile", "corregí", "decime", "revisá", "elegí", "buscá", "validá", "dejá"
  - ✅ "arrastra" / "arrastrar", "puedes", "pídele", "corrige", "indícame", "revisa", "elige", "busca", "valida", "deja"
- Registro serio, legal, claro. Verbos en voz activa ("Guardar", no "Se guarda").

## Fuente de verdad legal

- El flujo legal (demandas, causas, notificación, embargo, máquina de estados, plazos, pautas, autonomía)
  se rige por **[docs/especificacion-scraper-pjud-v3-2-corregido.md](docs/especificacion-scraper-pjud-v3-2-corregido.md)**
  y el skill **`.claude/skills/cobranza-legal-pjud/`**. **No inventar** estados/pasos/automatizaciones que no estén ahí.

## Modelo demanda ↔ causa

- La **demanda** es previa a la causa y no tiene Rol. Estados: `revisar` (la validación la marcó mal) y
  `redactada` (quedó bien). No hay estados "lista", "suspendida" ni "presentada" dentro de demandas.
- Al **ingresar la causa** (acción "Ingresar causa") se pide el **Rol** y la demanda **se convierte en causa**
  (sale del listado de demandas). Recién ahí arranca el reloj y el hito de facturación (5%).
- **Todo documento generado por el agente es editable al revisar**: se abre en el **editor tipo Word**
  (`EscritoEditor`), nunca en un visor de solo lectura.

## Diseño

- Identidad "Tribunal": tokens Navy/Latón (`:root` en `src/index.css`), display **Fraunces** + cuerpo **Inter**.
- Verificar siempre: `npm run build` y `npm run lint` limpios.
