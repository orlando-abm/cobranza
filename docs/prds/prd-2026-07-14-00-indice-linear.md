# Índice Linear · PRDs ProdBooster Cobranza Judicial

**Creado:** 2026-07-14
**Destino:** Linear
**Formato:** una carpeta por issue padre, con `issue.md` y carpeta `subissues/`, más este índice general.

---

## Convenciones

- **Issue padre:** agrupa una capacidad legal/funcional completa.
- **Subissue:** ticket implementable o validable dentro del flujo.
- **Prioridad sugerida:** P0 bloqueante/legal-crítico, P1 funcional principal, P2 mejora operativa.
- **Importación:** abrir cada carpeta de issue, copiar `issue.md` como issue padre y los archivos de `subissues/` como subissues en Linear.

## Jerarquía De Issues

### demanda-ingesta-validacion
- **Título:** Demanda: ingesta y validación documental
- **Archivo:** `demanda-ingesta-validacion/issue.md`
- **Fase:** 01 Demanda
- **Prioridad:** P0
- **Dependencia funcional:** ver flujo legal previo y subissues asociados.

| Subissue | Archivo | Prioridad | Autonomía |
|----------|---------|-----------|-----------|
| ingesta-zip-global | `demanda-ingesta-validacion/subissues/prd-2026-07-14-ingesta-zip-global.md` | P0 | AUTOMÁTICO |
| ingesta-zip-por-cliente | `demanda-ingesta-validacion/subissues/prd-2026-07-14-ingesta-zip-por-cliente.md` | P1 | AUTOMÁTICO |
| validacion-cuatro-documentos | `demanda-ingesta-validacion/subissues/prd-2026-07-14-validacion-cuatro-documentos.md` | P0 | AUTOMÁTICO con revisión humana |
| ocr-score-confianza | `demanda-ingesta-validacion/subissues/prd-2026-07-14-ocr-score-confianza.md` | P0 | AUTOMÁTICO con desvío humano |
| filtro-propietario-cav | `demanda-ingesta-validacion/subissues/prd-2026-07-14-filtro-propietario-cav.md` | P0 | AUTOMÁTICO con decisión humana |
| seleccion-plantilla-global | `demanda-ingesta-validacion/subissues/prd-2026-07-14-seleccion-plantilla-global.md` | P1 | AUTOMÁTICO con corrección humana |

### demanda-redaccion-revision
- **Título:** Demanda: redacción y revisión previa
- **Archivo:** `demanda-redaccion-revision/issue.md`
- **Fase:** 02 Redacción previa
- **Prioridad:** P0
- **Dependencia funcional:** ver flujo legal previo y subissues asociados.

| Subissue | Archivo | Prioridad | Autonomía |
|----------|---------|-----------|-----------|
| bandeja-demandas-previas-a-causa | `demanda-redaccion-revision/subissues/prd-2026-07-14-bandeja-demandas-previas-a-causa.md` | P0 | CON APROBACIÓN |
| editor-demanda-editable | `demanda-redaccion-revision/subissues/prd-2026-07-14-editor-demanda-editable.md` | P0 | CON APROBACIÓN |
| revision-humana-lote | `demanda-redaccion-revision/subissues/prd-2026-07-14-revision-humana-lote.md` | P0 | CON APROBACIÓN |
| correccion-demanda-bloqueada | `demanda-redaccion-revision/subissues/prd-2026-07-14-correccion-demanda-bloqueada.md` | P1 | CON APROBACIÓN |
| demanda-detalle-agentico | `demanda-redaccion-revision/subissues/prd-2026-07-14-demanda-detalle-agentico.md` | P1 | CON APROBACIÓN |

### presentacion-pjud-admisibilidad
- **Título:** Presentación PJUD y admisibilidad
- **Archivo:** `presentacion-pjud-admisibilidad/issue.md`
- **Fase:** 03 Presentación y admisibilidad
- **Prioridad:** P0
- **Dependencia funcional:** ver flujo legal previo y subissues asociados.

| Subissue | Archivo | Prioridad | Autonomía |
|----------|---------|-----------|-----------|
| flujo-multifirma-ojv | `presentacion-pjud-admisibilidad/subissues/prd-2026-07-14-flujo-multifirma-ojv.md` | P1 | CON APROBACIÓN |
| marcar-demanda-presentada | `presentacion-pjud-admisibilidad/subissues/prd-2026-07-14-marcar-demanda-presentada.md` | P0 | CON APROBACIÓN |
| previo-a-proveer | `presentacion-pjud-admisibilidad/subissues/prd-2026-07-14-previo-a-proveer.md` | P0 | CON APROBACIÓN |
| rechazo-reposicion-humana | `presentacion-pjud-admisibilidad/subissues/prd-2026-07-14-rechazo-reposicion-humana.md` | P0 | SOLO HUMANO |
| validacion-mandamiento | `presentacion-pjud-admisibilidad/subissues/prd-2026-07-14-validacion-mandamiento.md` | P0 | CON APROBACIÓN |

### monitor-pjud-clasificacion
- **Título:** Monitor PJUD y clasificación de actuaciones
- **Archivo:** `monitor-pjud-clasificacion/issue.md`
- **Fase:** 04 Monitor PJUD
- **Prioridad:** P0
- **Dependencia funcional:** ver flujo legal previo y subissues asociados.

| Subissue | Archivo | Prioridad | Autonomía |
|----------|---------|-----------|-----------|
| sincronizacion-pjud | `monitor-pjud-clasificacion/subissues/prd-2026-07-14-sincronizacion-pjud.md` | P0 | AUTOMÁTICO |
| clasificacion-por-contenido-pdf | `monitor-pjud-clasificacion/subissues/prd-2026-07-14-clasificacion-por-contenido-pdf.md` | P0 | AUTOMÁTICO con revisión humana |
| estado-diario-pjud | `monitor-pjud-clasificacion/subissues/prd-2026-07-14-estado-diario-pjud.md` | P1 | AUTOMÁTICO |
| baja-confianza-revision-humana | `monitor-pjud-clasificacion/subissues/prd-2026-07-14-baja-confianza-revision-humana.md` | P0 | SOLO HUMANO cuando no hay certeza |

### notificacion-receptores-domicilios
- **Título:** Notificación, receptores y domicilios
- **Archivo:** `notificacion-receptores-domicilios/issue.md`
- **Fase:** 05 Notificación
- **Prioridad:** P0
- **Dependencia funcional:** ver flujo legal previo y subissues asociados.

| Subissue | Archivo | Prioridad | Autonomía |
|----------|---------|-----------|-----------|
| encargo-receptor-notificacion | `notificacion-receptores-domicilios/subissues/prd-2026-07-14-encargo-receptor-notificacion.md` | P1 | AUTOMÁTICO configurable |
| lectura-estampados | `notificacion-receptores-domicilios/subissues/prd-2026-07-14-lectura-estampados.md` | P0 | AUTOMÁTICO con revisión humana |
| intentos-segun-pauta-financiera | `notificacion-receptores-domicilios/subissues/prd-2026-07-14-intentos-segun-pauta-financiera.md` | P0 | AUTOMÁTICO con decisión humana al límite |
| gestion-domicilios-exhortos-oficios | `notificacion-receptores-domicilios/subissues/prd-2026-07-14-gestion-domicilios-exhortos-oficios.md` | P1 | CON APROBACIÓN |
| notificacion-efectiva-gatilla-embargo | `notificacion-receptores-domicilios/subissues/prd-2026-07-14-notificacion-efectiva-gatilla-embargo.md` | P0 | AUTOMÁTICO con prevalidaciones |

### apremio-excepciones-traslados
- **Título:** Apremio, excepciones y traslados
- **Archivo:** `apremio-excepciones-traslados/issue.md`
- **Fase:** 06 Apremio paralelo
- **Prioridad:** P0
- **Dependencia funcional:** ver flujo legal previo y subissues asociados.

| Subissue | Archivo | Prioridad | Autonomía |
|----------|---------|-----------|-----------|
| requerimiento-pago-reloj-ocho-dias | `apremio-excepciones-traslados/subissues/prd-2026-07-14-requerimiento-pago-reloj-ocho-dias.md` | P0 | AUTOMÁTICO |
| excepciones-opuestas-solo-humano | `apremio-excepciones-traslados/subissues/prd-2026-07-14-excepciones-opuestas-solo-humano.md` | P0 | SOLO HUMANO |
| traslado-reloj-cuatro-dias | `apremio-excepciones-traslados/subissues/prd-2026-07-14-traslado-reloj-cuatro-dias.md` | P0 | SOLO HUMANO |
| certificado-no-oposicion | `apremio-excepciones-traslados/subissues/prd-2026-07-14-certificado-no-oposicion.md` | P1 | AUTOMÁTICO con firma humana |

### embargo-registro-civil
- **Título:** Embargo y Registro Civil
- **Archivo:** `embargo-registro-civil/issue.md`
- **Fase:** 07 Embargo y RC
- **Prioridad:** P0
- **Dependencia funcional:** ver flujo legal previo y subissues asociados.

| Subissue | Archivo | Prioridad | Autonomía |
|----------|---------|-----------|-----------|
| prevalidaciones-embargo | `embargo-registro-civil/subissues/prd-2026-07-14-prevalidaciones-embargo.md` | P0 | AUTOMÁTICO con bloqueo humano |
| encargo-embargo-receptor | `embargo-registro-civil/subissues/prd-2026-07-14-encargo-embargo-receptor.md` | P0 | AUTOMÁTICO configurable |
| comprobante-ingreso-registro-civil | `embargo-registro-civil/subissues/prd-2026-07-14-comprobante-ingreso-registro-civil.md` | P0 | AUTOMÁTICO |
| consulta-inscripcion-registro-civil | `embargo-registro-civil/subissues/prd-2026-07-14-consulta-inscripcion-registro-civil.md` | P0 | AUTOMÁTICO |
| inscripcion-aceptada-cadena | `embargo-registro-civil/subissues/prd-2026-07-14-inscripcion-aceptada-cadena.md` | P0 | AUTOMÁTICO con firma humana donde aplique |
| inscripcion-rechazada-humana | `embargo-registro-civil/subissues/prd-2026-07-14-inscripcion-rechazada-humana.md` | P0 | SOLO HUMANO |
| escrito-martillero-retiro | `embargo-registro-civil/subissues/prd-2026-07-14-escrito-martillero-retiro.md` | P1 | AUTOMÁTICO con firma humana |

### procurador-bandejas-acciones-lote
- **Título:** Procurador, bandejas y acciones en lote
- **Archivo:** `procurador-bandejas-acciones-lote/issue.md`
- **Fase:** 08 Operación diaria
- **Prioridad:** P1
- **Dependencia funcional:** ver flujo legal previo y subissues asociados.

| Subissue | Archivo | Prioridad | Autonomía |
|----------|---------|-----------|-----------|
| home-briefing-plan-dia | `procurador-bandejas-acciones-lote/subissues/prd-2026-07-14-home-briefing-plan-dia.md` | P1 | AUTOMÁTICO |
| chat-procurador-propuestas | `procurador-bandejas-acciones-lote/subissues/prd-2026-07-14-chat-procurador-propuestas.md` | P1 | CON APROBACIÓN |
| acciones-lote-embargos-registro | `procurador-bandejas-acciones-lote/subissues/prd-2026-07-14-acciones-lote-embargos-registro.md` | P1 | AUTOMÁTICO con bloqueos |
| recordatorios-notas-internas | `procurador-bandejas-acciones-lote/subissues/prd-2026-07-14-recordatorios-notas-internas.md` | P2 | CON APROBACIÓN |
| gestion-causa-suspender-reactivar-eliminar | `procurador-bandejas-acciones-lote/subissues/prd-2026-07-14-gestion-causa-suspender-reactivar-eliminar.md` | P1 | CON APROBACIÓN |

### informes-configuracion-cobro
- **Título:** Informes, configuración y cobro
- **Archivo:** `informes-configuracion-cobro/issue.md`
- **Fase:** 09 Gestión financiera
- **Prioridad:** P1
- **Dependencia funcional:** ver flujo legal previo y subissues asociados.

| Subissue | Archivo | Prioridad | Autonomía |
|----------|---------|-----------|-----------|
| pautas-por-financiera | `informes-configuracion-cobro/subissues/prd-2026-07-14-pautas-por-financiera.md` | P0 | CONFIGURACIÓN OPERATIVA |
| base-receptores | `informes-configuracion-cobro/subissues/prd-2026-07-14-base-receptores.md` | P1 | CONFIGURACIÓN OPERATIVA |
| informe-semaforo | `informes-configuracion-cobro/subissues/prd-2026-07-14-informe-semaforo.md` | P1 | AUTOMÁTICO con revisión |
| causas-detenidas | `informes-configuracion-cobro/subissues/prd-2026-07-14-causas-detenidas.md` | P1 | AUTOMÁTICO |
| hitos-cobro-facturacion | `informes-configuracion-cobro/subissues/prd-2026-07-14-hitos-cobro-facturacion.md` | P0 | AUTOMÁTICO con respaldo documental |

### seguridad-consentimiento-operacion
- **Título:** Seguridad, consentimiento y operación judicial
- **Archivo:** `seguridad-consentimiento-operacion/issue.md`
- **Fase:** 10 Seguridad y cumplimiento
- **Prioridad:** P0
- **Dependencia funcional:** ver flujo legal previo y subissues asociados.

| Subissue | Archivo | Prioridad | Autonomía |
|----------|---------|-----------|-----------|
| roles-autenticacion | `seguridad-consentimiento-operacion/subissues/prd-2026-07-14-roles-autenticacion.md` | P0 | CONTROL DE ACCESO |
| consentimiento-ley-21719 | `seguridad-consentimiento-operacion/subissues/prd-2026-07-14-consentimiento-ley-21719.md` | P0 | CON APROBACIÓN |
| manejo-conservador-clave-unica | `seguridad-consentimiento-operacion/subissues/prd-2026-07-14-manejo-conservador-clave-unica.md` | P0 | CONTROL OPERATIVO |
| documento-original-papel | `seguridad-consentimiento-operacion/subissues/prd-2026-07-14-documento-original-papel.md` | P1 | CON APROBACIÓN |

## Orden Funcional Sugerido

1. Demanda: ingesta, validación, redacción y revisión.
2. Presentación PJUD, admisibilidad y mandamiento.
3. Monitor PJUD y clasificación de actuaciones.
4. Notificación, apremio paralelo y embargo.
5. Registro Civil, informes, cobro y configuración.
6. Seguridad, consentimiento y operación judicial transversal.

## Cobertura Legal/Funcional

- Demanda previa a causa, sin Rol ni reloj judicial hasta presentación.
- Validación documental: pagaré, CAV, tabla/prepago y mandato.
- OCR con score, CAV propietario, plantillas GLOBAL y revisión humana.
- PJUD: admisibilidad, previo a proveer, rechazo, mandamiento y estado diario.
- Notificación efectiva como gatillante directo de embargo.
- Apremio en paralelo: requerimiento, excepciones y traslado como líneas rojas.
- Registro Civil: comprobante inicia reloj; inscripción aceptada cierra hito.
- Informes, causas detenidas, hitos de cobro y pautas por financiera.
- Consentimiento, roles, Clave Única y documentos originales en papel.
