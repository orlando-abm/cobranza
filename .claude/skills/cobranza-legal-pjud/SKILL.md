---
name: cobranza-legal-pjud
description: >
  Fuente de verdad del flujo legal de ProdBooster (cobranza judicial automotriz por pagaré, Chile).
  Úsala SIEMPRE que se diseñe o modifique UI/lógica de: demandas, ingesta de lotes, causas, notificación,
  embargo, mandamientos, estampados del receptor, CAV, exhortos, Registro Civil, plazos/relojes,
  pautas por financiera, la máquina de estados del PJUD, la matriz de autonomía, hitos de facturación
  o los escritos/plantillas. Regla dura: NO inventar estados, status, pasos, plazos ni automatizaciones
  que no estén en la especificación. Ante duda, citar el doc y preguntar.
metadata:
  type: reference
---

# Cobranza judicial PJUD — flujo legal (fuente de verdad)

**Doc canónico:** [docs/especificacion-scraper-pjud-v3-2-corregido.md](../../../docs/especificacion-scraper-pjud-v3-2-corregido.md)
(ESPECIFICACIÓN TÉCNICA ProdBooster v1.1 · Cobranza Automotriz por Pagaré · Etapas 1-3).

**Regla de oro de esta skill:** el producto modela EXACTAMENTE lo que dice el doc. No suponer flujos,
estados ni automatizaciones que no estén marcados ahí. Si algo no está, es "pendiente / fuera de alcance",
no se inventa. Confidencial: solo socios e ingenieros ProdBooster.

## Principios rectores (líneas rojas incluidas)

1. **El agente acelera, el humano decide.** El agente automatiza el ‘tiempo hormiga’ (~90%). El criterio
   legal (oposición de excepciones, defensas) es SOLO del abogado. **Línea roja: el agente jamás contesta
   excepciones ni traslados de forma autónoma.**
2. **Leer el documento, no el título.** El título del PJUD viene mal etiquetado ~70%. El gatillante se
   extrae del **contenido del PDF**, validado contra la causa — nunca del título.
3. **Todo plazo tiene un reloj.** Cada plazo perentorio activa un temporizador diario: reposición 5 d,
   excepciones 8 d, traslado 4 d, Registro Civil ~30 d.
4. **Criterios por financiera, pauteados.** El agente no tiene criterio de negocio propio; opera con la
   pauta configurada por institución (ej. Tanner 2 intentos, OLX 5).
5. **Valor sin scraping.** Si el PJUD cae, el sistema sigue dando valor con su base interna: alertas,
   control de plazos y reportes.

## Restricciones críticas de diseño

- **PJUD solo acepta PDF.** Convertir/validar a PDF. Límites OJV: ≤10 MB por archivo, ≤30 MB por presentación.
- **Documentos de entrada son escaneos.** Pagarés/CAV/prepagos: ~70% legibles, ~20% chuecos, ~10% deteriorados
  → OCR robusto + **score de confianza por campo** (Riesgo técnico #1).
- **Clave PJUD se bloquea con intentos fallidos.** Manejo conservador de sesión: ante error de login,
  detener y alertar, **jamás reintentar en loop**.
- **Ley 21.719 (protección de datos).** Consentimiento firmado del abogado para uso de su clave + trazabilidad desde el día 1.
- **Subida multi-firma.** La demanda no la sube una persona: bandeja → apoderados aceptan en su OJV →
  patrocinante envía. Es un flujo multiusuario, no un submit único.
- **Documento original en papel.** Al subir el digital se marca ‘documento original en papel’ (pagaré físico
  custodiado aparte). El agente registra qué causas tienen original pendiente.

## Etapa 1 — Demanda (ORDEN CORRECTO, no confundir)

> El N° de causa / Rol **NO existe durante la redacción**. La causa nace **recién al presentar en el PJUD**.
> Antes de eso solo hay una **demanda** (borrador) trabajándose sobre los documentos del lote.

Orden exacto según el doc:

1. **Ingesta multi-modal** (identifica la financiera y elige conector):
   - Modalidad A · **ZIP Global**: descomprime, separa/clasifica pagarés, CAV y tablas; asocia por RUT/nombre/patente.
   - Modalidad B · **ZIP por Cliente**: carpetas por deudor + valida integridad del set.
   - Modalidad C · **CRM PROFIN**: conector RPA/API que descarga uno a uno.
2. **Validación documental automatizada** (antes de redactar) — produce el veredicto "quedó bien / mal":
   - **Completitud**: existen los **4 documentos mandatorios** (Pagaré, CAV inicial, Tabla de Desarrollo/Prepago,
     Mandato de la Financiera). Si falta uno → alerta **‘Documentación Incompleta’**.
   - **Consistencia cruzada**: por OCR, nombre/RUT/montos de la planilla coinciden con el cuerpo del pagaré
     (detecta documentos cruzados).
   - **Filtro de Propietario (CAV)**: propietario del vehículo (última página del CAV) = deudor (y aval según caso).
     Si fue transferido a un tercero → marca **‘Vehículo Transferido’** y desvía a **decisión humana**.
   - **Confianza del OCR**: score por campo; si un escaneo es ilegible/chueco (umbral bajo) → **cola de revisión
     manual** (~10% de los casos).
3. **Redacción automatizada** con la **plantilla GLOBAL exacta** según deudor/jurisdicción (ver Plantillas).
   Valida el **número de partes** contra el pagaré (dos avales; o rep. legal ≠ aval en sociedades).
4. **Revisión humana en lote** (control humano, ANTES de subir): pantalla consolidada con **RUT, Nombres, Monto
   y Datos de la Financiera**, con acceso de un clic al **PDF origen**. Acá el abogado **valida y corrige** lo que
   quedó mal (incompleto / transferido / OCR bajo) y **autoriza la subida masiva**.
5. **Subida al PJUD — flujo multi-firma** (CON APROBACIÓN):
   a) ingresar con clave de la **patrocinante** (sesión conservadora);
   b) subir demanda + documentos (PDF); marcar ‘documento original en papel’ para el pagaré físico;
   c) queda en **bandeja** → el agente **deriva a los apoderados**;
   d) seguimiento automático hasta que **todos aceptan** en su OJV;
   e) **envío final** por la patrocinante;
   f) **se registra fecha/hora de presentación → RECIÉN AQUÍ nace la causa/Rol, arranca el reloj de la causa
      y el hito de facturación (presentada = 5%).**
   - **Curso Progresivo**: inmediatamente después de subir y registrar la custodia del pagaré físico, el agente
     pre-redacta el escrito de curso progresivo (`curso_se_provea_dda_por_acompanar_pagare_20260702210936.pdf`)
     para obligar al tribunal a proveer sin demoras de archivo.

**Admisibilidad y ‘previo a proveer’ (~20%)** — el tribunal revisa 1-2 semanas. Tres salidas:
- **‘Despáchese’**: admitida → abre el juicio (2 cuadernos) y habilita notificar → Etapa 2. Validar el mandamiento.
- **‘Previo a proveer’**: pide subsanar (típico: bajar el monto). El agente lee el PDF, detecta plazo y razón,
  cruza con la pauta; si está dentro de pauta (rebaja 10% / máx CLP 500K) pre-redacta **‘cumple lo ordenado’**
  (`cumple_largo_20260702211210.pdf`). Si excede → alerta reposición (5 d). **Siempre lo ejecuta un humano.**
- **Rechazo / no admisible**: reposición o apelación (reposición 5 d). Caso a caso, **sin automatización en v1**.

**Dos cuadernos + mandamiento**: el ‘despáchese’ abre **principal** y **apremio**. El tribunal emite el
**mandamiento de ejecución y embargo**; ~20% vienen con error (falta un cero, nombre incompleto, falta rep.
legal/avales). El agente compara **campo a campo** contra la demanda; si no calza → pre-redacta
**‘rectifíquese el mandamiento’** y **bloquea**; si calza → luz verde a Etapa 2.

## Etapa 2 — Notificación

- **Gatillante:** ‘despáchese’ validado (mandamiento correcto). **Hito: notificada = 10%.**
- **Encargo al receptor** (agentizable con plantilla de mail): ID financiera, rol, tribunal, partes, domicilio.
  El abogado elige/confirma receptor. **Follow-up automático** si no sube resultado en el plazo de la zona.
- **Lectura de estampados (el corazón):** abrir y leer el PDF completo, no el título. Clasificar en:
  - **Notificación efectiva** (validada: contenido + calce nombre = deudor) → **gatilla DIRECTO el encargo de
    embargo, sin pasos intermedios**. Las excepciones NO bloquean.
  - **Búsqueda positiva** ("por dichos de un vecino…") → habilita notificación posterior (Art. 44). Registra intento.
  - **Búsqueda negativa** ("no es persona conocida") → NO avanza, **consume intento**; cruzar con pauta; al límite → alerta castigo/nuevo domicilio.
  - Si el estampado no calza con la causa → alerta **‘estampado en causa incorrecta’**.
- **Domicilios en búsqueda negativa** (pre-redacción proactiva): Nuevo Domicilio sin Exhorto
  (`nuevo_domicilio_s_exhorto_20260702213840.pdf`), con Exhorto (`nuevo_dom_y_exhorto_20260702213903.pdf`),
  Solicitud de Oficios (`oficios_dom_20260702213931.pdf`), devolución de exhorto (`remita exh.pdf`).
- **Cuaderno de apremio (corre en paralelo, no bloquea):** el reloj de defensa parte del **estampado de
  requerimiento de pago** (no de la notificación):
  - **Requerimiento estampado → 8 d** para excepciones. Si expira sin oposición → pre-genera **Certificado de No
    Haberse Opuesto Excepciones** (`cne_20260702220615.pdf`).
  - **Excepciones opuestas (~20%)** → alerta máxima, **solo humano**, clasifica ‘con excepciones’. Jamás responde.
  - **Traslado → 4 d** → alerta crítica; respuesta la decide/redacta el abogado (línea roja).
  - **Reposición → 5 d** → reloj + alerta; pre-redacción solo si hay plantilla aprobada.

## Etapa 3 — Embargo

- **Gatillante:** notificación efectiva validada (sin pasos intermedios). **Hito: embargo/inscrito = ~15%.**
  Dolor: 30% se atasca por no revisar el CAV a tiempo; 10% nunca se revisa.
- **Encargo del embargo** (mismo mail): ID, rol, tribunal, partes + patentes a embargar.
  - **Pre-validación:** algunos tribunales exigen **CAV del mes** antes de embargar → pedirlo y presentarlo primero.
    Leer también las respuestas del receptor al mail (alertar si rechaza el encargo).
  - **Regiones:** si la notificación fue por exhorto, **esperar el retorno del exhorto** antes de encargar.
- **Registro Civil — dos fuentes, un gatillante** (¡crítico!):
  - El **comprobante de ingreso** que el receptor sube al PJUD **solo arranca el reloj de ~1 mes** — estado
    ‘embargo en trámite de inscripción’. **Error grave: tratarlo como embargo listo.**
  - El **gatillante real** es **‘inscripción aceptada’** en la página externa del **Registro Civil** (consulta por
    patente / Autofact).
- **Reloj del CAV (mayor ROI):** registrar fecha de ingreso; default **30 d**, **sin consultar antes del día 25**;
  luego consultar cada **5-7 d** hasta ‘inscripción aceptada’.
  - **Inscripción confirmada → cadena:** (a) alerta ‘embargo inscrito’; (b) mail a financiera pidiendo certificados;
    (c) informe de embargos del período.
  - **Inscripción rechazada** (ej. auto transferido) → alerta con razón, **decisión humana**.
- **Cierre:** un solo escrito de **designación de martillero + retiro con auxilio de la fuerza pública**
  (la incautación queda fuera del MVP). El agente pre-genera el escrito.

## Máquina de estados — tabla maestra (el núcleo)

Se rige por **contenido del PDF**, no por títulos. Todo gatillante de avance requiere validación previa.

| Estado / Resolución | Cuaderno / Fuente | Validación | ¿Gatilla? → dispara |
|---|---|---|---|
| **Demanda ingresada** | Principal | Firmas de todos los apoderados aprobadas | SÍ → envío final del patrocinante; inicia admisibilidad (1-2 sem); hito 5% |
| **‘Previo a proveer’** | Principal | Leer contenido: qué piden + plazo | SÍ → reloj desde d0 + pre-redacta ‘cumple lo ordenado’ según pauta |
| **Respuesta a ‘cumple lo ordenado’** | Principal | Leer ‘a lugar’ / ‘no a lugar’ | A lugar → esperar despáchese. No a lugar → reposición (5 d) o retiro. Solo humano |
| **‘Despáchese’** | Principal | NO gatilla solo; comparar campo a campo vs demanda | SÍ condicionado → si calza, habilita notificar; si no, ‘rectifíquese’ + alerta |
| **Mandamiento ejec. y embargo** | Apremio (paralelo) | Comparar campo a campo (nombre, monto, rep. legal, avales) | SÍ condicionado → si calza, vía libre Etapa 2; si no, ‘rectifíquese el mandamiento’ y **bloquea** |
| **Estampado: notificación efectiva** | Principal | Leer PDF completo; nombre = deudor | SÍ → gatilla directo encargo de embargo; excepciones no bloquean; hito 10% |
| **Estampado: búsqueda positiva** | Principal | Contenido + calce | PARCIAL → habilita notificación posterior (Art. 44); registra intento |
| **Estampado: búsqueda negativa** | Principal | Contenido + calce | NO avanza → consume intento; cruzar pauta; al límite alerta |
| **Requerimiento de pago** | Apremio | Distinguir de notificación | SÍ → reloj 8 d excepciones (desde el requerimiento) |
| **Excepciones opuestas** | Apremio | Detección de escrito del deudor | SÍ → alerta máxima, **solo humano**; clasifica ‘con excepciones’ |
| **‘Traslado’** | Apremio | Detección de traslado | SÍ → reloj 4 d; respuesta la decide el abogado (línea roja) |
| **Tribunal exige CAV previo** | Principal y/o mail receptor | Leer resolución/mail | **BLOQUEA embargo** → pedir CAV del mes, presentar, re-encargar |
| **Comprobante ingreso Registro Civil** | Principal | Leer contenido | NO gatilla → solo arranca reloj ~1 mes (‘en trámite de inscripción’) |
| **‘Inscripción aceptada’** | Registro Civil (patente) | Consulta desde d25 cada 5-7 d | SÍ → cierre Etapa 3: alerta + mail financiera + escrito martillero. Hito ~15% |
| **Inscripción rechazada** | Registro Civil | Detecta rechazo | NO avanza → alerta con razón, decisión humana |

**Reglas de oro del clasificador:** (1) Aviso ≠ Estado ≠ Gatillante — el gatillante sale del contenido validado.
(2) Dos cuadernos, dos vigilancias en paralelo, no se bloquean. (3) Etapa 3: cruzar siempre PJUD (comprobante=reloj)
con Registro Civil (inscripción=gatillante). (4) Baja confianza → cola humana, no gatillar.

## Matriz de autonomía

| Acción | Nivel | Regla |
|---|---|---|
| Ingesta, OCR y validación cruzada | **AUTOMÁTICO** | Score bajo umbral → revisión humana (~10%) |
| Redacción de escritos estándar | **AUTOMÁTICO** | Pre-completa; **jamás presenta sin aprobación** |
| Firma y subida PJUD (OJV) | **CON APROBACIÓN** | Abogado valida nombres/RUT/monto/financiera; agente orquesta firmas; envío final patrocinante |
| Clasificación de actuaciones | **AUTOMÁTICO** | Por contenido del PDF; baja confianza → bandeja humana |
| Validación de mandamientos | **CON APROBACIÓN** | Compara; si difiere, pre-redacta rectificación para firma |
| Cumplimiento ‘previo a proveer’ | **CON APROBACIÓN** | Si la rebaja está dentro de pauta, pre-redacta |
| Mails a receptores y seguimiento | **AUTOMÁTICO** | Configurable a borrador/aprobación |
| Seguimiento CAV y Registro Civil | **AUTOMÁTICO** | Consulta patentes desde d25; alerta confirmación/rechazo |
| **Excepciones y Traslados** | **SOLO HUMANO** | Línea roja: detecta, enciende reloj, alerta; **nunca responde** |
| Castigos y reasignaciones | **SOLO HUMANO** | El agente alerta fin de intentos; decide financiera/abogado |
| Documentos ilegibles (OCR fallido) | **SOLO HUMANO** | Si un humano no lo lee, la IA tampoco → alerta y bypass |

## Plantillas (nombres exactos del estudio)

**Demanda (6 GLOBAL, por deudor/jurisdicción):**
- PN Santiago → `PLANILLA DEMANDAS GLOBAL 1 SIN EXHORTO.docx`
- PN Regiones → `PLANILLA DEMANDAS GLOBAL 1 CON EXHORTO.docx` (exhorto en el 4º otrosí)
- PN + Aval Santiago → `PLANILLA DEMANDAS GLOBAL 2 SIN EXHORTO.docx`
- PN + Aval Regiones → `PLANILLA DEMANDAS GLOBAL 2 CON EXHORTO.docx`
- Sociedad + Aval Santiago → `PLANILLA DEMANDAS GLOBAL 2 SOC SIN EXHORTO.docx`
- Sociedad + Aval Regiones → `PLANILLA DEMANDAS GLOBAL 2 SOC CON EXHORTO.docx`

**Escritos de trámite:** curso progresivo (`curso_se_provea_dda_por_acompanar_pagare_…pdf`),
cumple lo ordenado (`cumple_largo_…pdf`), rectifíquese el mandamiento, certificado de no oposición
(`cne_…pdf`), nuevo domicilio sin/con exhorto (`nuevo_domicilio_s_exhorto_…pdf` / `nuevo_dom_y_exhorto_…pdf`),
solicitud de oficios (`oficios_dom_…pdf`), devolución de exhorto (`remita exh.pdf`), martillero + retiro.

## Pautas por financiera (configurable)

| Parámetro | Ejemplos reales |
|---|---|
| Modalidad de asignación | ZIP global / ZIP por cliente / PROFIN |
| Intentos de notificación | **Tanner: 2** (luego castigo) · **OLX: hasta 5** |
| Baja de monto (previo a proveer) | Hasta 10% / tope CLP 500K / ‘No bajar nada, consultar’ |
| CAV: quién saca y paga | Convenio Autofact de la financiera / estudio paga y rinde |
| Umbral de judicialización | 50 UF estándar (futuro: ~25 UF) |
| CRM a alimentar | Campo ‘fecha de última actuación’ |

## Relojes / plazos y hitos

- **Plazos:** reposición **5 d**, excepciones **8 d** (desde el requerimiento), traslado **4 d**, Registro Civil **~30 d** (consultar desde d25, cada 5-7 d).
- **Hitos de facturación (fecha + documento fundante):** demanda **presentada = 5%**, causa **notificada = 10%**, embargo **inscrito = ~15%**.

## Modelo de datos — demanda vs causa (para no confundir la UI)

- **Demanda** = artefacto de Etapa 1 previo a la causa. Se trabaja sobre los documentos del lote. **No tiene Rol.**
  Ciclo: se está creando (ingesta+validación+redacción) → veredicto bien/mal → corrección humana → lista/autorizada → subida.
- **Causa** = nace **al presentar en el PJUD** (envío final multi-firma). Recién ahí se asocia el **Rol** (hasta que
  el tribunal distribuye, el rol puede estar ‘En trámite de ingreso’), arranca el **reloj de la causa** y el **hito 5%**.
- Nunca mostrar un Rol/causa para una demanda que no se subió. Nunca tratar el comprobante de RC como inscripción.

## Fuera de alcance del MVP (no implementar como si existiera)

Subida efectiva a la OJV con submit real (los escritos quedan firmados/listos; el submit lo hace el abogado),
incautación posterior al retiro, flujo hipotecario/consumo (validar con Normaliza antes de generalizar),
conector PROFIN por RPA si no hay API.
