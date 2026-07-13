**ESPECIFICACIÓN TÉCNICA · PRODBOOSTER v1.1**

Agente de Cobranza Judicial

Lógica de Estados, Scraping del PJUD y Automatización Operativa (Etapas 1-3)

**Fecha:** Julio 2026 \| **Foco:** Cobranza Automotriz por Pagaré \| **Origen:** Sesiones de Levantamiento de Información (Mayo-Junio 2026)

**Confidencialidad:** Altamente Restringido — Solo para Socios e Ingenieros ProdBooster

## Introducción y Principios de Diseño

La duración de un juicio ejecutivo de cobranza automotriz suele estar más vinculada a desafíos de gestión y coordinación operativa que a los plazos establecidos por la normativa aplicable, así como a la sobrecarga humana de los estudios jurídicos. Con carteras que promedian entre 300 y 600 causas activas por abogado, el seguimiento manual es materialmente inviable. El Agente de Cobranza Judicial de ProdBooster se inserta directamente en este flujo de trabajo para reducir el ciclo del juicio de su duración actual (18-36 meses) a un ideal óptimo de aproximadamente 6 meses. Al acelerar este proceso, el agente evita pérdidas sustanciales (un abogado con 500 causas pierde aprox. el 5% por descuidos, lo que equivale a unos CLP 175M/año) y permite a las financieras judicializar causas de menor cuantía (bajando el umbral de viabilidad de 50 UF a solo ~25 UF).

Cinco Principios Rectores del Agente

- **El agente acelera, el humano decide:** El 90% del esfuerzo actual es ‘tiempo hormiga’ (transcribir datos, revisar expedientes y firmar). El agente automatiza este volumen. El 10% restante de criterio legal (oposición de excepciones, defensas complejas) se delega exclusivamente al abogado. Es una línea roja: el agente jamás contesta excepciones de forma autónoma.

- **Leer el documento, no el título:** El PJUD solo alerta que ‘hubo un movimiento’ genérico. Los títulos con que terceros etiquetan las actuaciones registran un ~70% de error de clasificación. El agente de ProdBooster abre y procesa el PDF real de cada documento con motores de análisis de texto.

- **Todo plazo tiene un reloj:** Cada providencia o resolución dictada por el tribunal, que aperture un plazo perentorio (5 días para reposición, 8 días para excepciones, 4 días para traslados o 30 días de espera en Registro Civil) activa un temporizador diario en la bandeja del abogado, reduciendo a cero el olvido o abandono de causas.

- **Criterios por financiera, pauteados:** Cada institución tiene políticas diferenciadas de cobro, castigo o montos de negociación. El agente no posee criterio de negocio propio, sino que opera con una pauta estricta y configurada (por ejemplo, Tanner ejecuta 2 intentos de notificación antes de castigar, mientras que OLX procesa hasta 5 intentos).

- **Valor sin scraping:** Si la plataforma del PJUD se bloquea o cae, el sistema continúa entregando valor sobre su base de datos interna mediante su sistema de alertas, control de plazos vigentes y generación de reportes.

Restricciones Críticas de Diseño

| **Restricción**                                 | **Implicancia para el Agente**                                                                                                                                                                                                             |
|-------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **PJUD solo acepta PDF**                        | Todo documento generado o recibido se convierte/valida a PDF antes de subir. Si la financiera manda Excel, conversión automática. Límites de la OJV: máximo 10 MB por archivo PDF y máximo 30 MB en el total de archivos por presentación. |
| **Documentos de entrada son escaneos**          | Pagarés, CAV y prepagos NO son PDFs nativos: ~70% legibles, ~20% chuecos y ~10% muy deteriorados. Se requiere OCR robusto + score de confianza por campo. Riesgo técnico \#1.                                                              |
| **Clave PJUD se bloquea con intentos fallidos** | El acceso con credenciales del abogado debe tener manejo conservador de reintentos: ante error de login, detener y alertar, jamás reintentar en loop. Un bloqueo deja al estudio semanas sin acceso.                                       |
| **Ley 21.719 (protección de datos)**            | Firma de autorización del abogado para uso de su clave y acceso a datos de deudores. Mismo mecanismo que ya firman con CaseTracking. Diseñar consentimiento y trazabilidad desde el día 1.                                                 |
| **Subida multi-firma**                          | La demanda no la sube una persona: queda en bandeja -\> se deriva a los apoderados -\> cada uno acepta en su oficina judicial -\> el patrocinante envía. El agente orquesta un flujo multi-usuario, no un submit único.                    |
| **Documento original en papel**                 | Pagarés/cheques físicos: al subir el digital se marca el botón ‘documento original en papel’ y el físico se custodia aparte. El agente registra qué causas tienen original pendiente de entrega.                                           |

## Etapa 1 — Demanda (Ingesta, Validación y Presentación)

El ciclo comienza los primeros 5 días de cada mes con la recepción del lote de asignación de la financiera (habitualmente de 100 a 200 causas). El objetivo técnico es comprimir este esfuerzo manual de 4-7 días a solo 1 jornada laboral, garantizando la exactitud absoluta de los datos para evitar incidentes de nulidad por firmas o errores de digitación.

### Ingesta Multi-Modal

El agente identifica automáticamente la financiera de origen y ejecuta uno de tres conectores de ingesta:

- **Modalidad A (ZIP Global):** Descomprime un único archivo comprimido, separa y clasifica pagarés, CAV y tablas de desarrollo, y los asocia a las causas por RUT/nombre/patente.

- **Modalidad B (ZIP por Cliente):** Descomprime carpetas individuales para cada deudor y valida la integridad de su set documental.

- **Modalidad C (CRM PROFIN):** Conector RPA automatizado (o API si está disponible) para simular la navegación y descargar los archivos uno a uno desde la plataforma interna automotriz PROFIN.

### Validación Documental Automatizada

Antes de redactar la demanda, el agente ejecuta una lógica estricta de validación para garantizar la viabilidad jurídica:

- **Completitud:** Comprueba la existencia de los 4 documentos mandatorios (Pagaré, CAV inicial, Tabla de Desarrollo/Prepago y Mandato de la Financiera). Si falta alguno, emite la alerta ‘Documentación Incompleta’.

- **Consistencia cruzada:** Verifica por OCR que el nombre, RUT y montos de la planilla coincidan exactamente con el cuerpo del pagaré (ej. detecta casos de documentos cruzados de forma preventiva).

- **Filtro de Propietario (CAV):** Analiza la última página del Certificado de Anotaciones Vigentes (campo Propietario). El agente verifica que el nombre del propietario del vehículo coincida con el deudor principal y, según el caso, con el aval. Si el vehículo fue transferido a un tercero antes de demandar, marca la causa como ‘Vehículo Transferido’ y la desvía para decisión humana, evitando señalar para embargo un bien ajeno.

- **Confianza del OCR:** Todo campo extraído posee un puntaje de confianza. Si un escaneo es ilegible o está chueco (umbral bajo), el caso pasa a una cola de revisión manual (~10% de los casos).

### Redacción Automatizada con Control Humano

El agente carga la plantilla estandarizada de escrito del estudio y completa dinámicamente las variables. El sistema selecciona y autocompleta la plantilla exacta del escrito de demanda según las características del deudor y la jurisdicción. Es crítico que el agente valide el número de partes que compone cada demandado contrastándolo con lo indicado en el pagaré, ya que una causa puede contar con dos avales, o —en el caso de las empresas— el representante legal de la sociedad puede no ser quien actúa como aval:

- **Deudor Persona Natural (Santiago):** Utiliza la plantilla de demanda `PLANILLA DEMANDAS GLOBAL 1 SIN EXHORTO.docx`.

- **Deudor Persona Natural (Regiones):** Utiliza la plantilla `PLANILLA DEMANDAS GLOBAL 1 CON EXHORTO.docx` (solicitando exhorto en el cuarto otrosí).

- **Deudor + Aval Persona Natural (Santiago):** Utiliza la plantilla de demanda `PLANILLA DEMANDAS GLOBAL 2 SIN EXHORTO.docx`.

- **Deudor + Aval Persona Natural (Regiones):** Utiliza la plantilla `PLANILLA DEMANDAS GLOBAL 2 CON EXHORTO.docx`.

- **Sociedad Deudora + Aval (Santiago):** Utiliza la plantilla de demanda `PLANILLA DEMANDAS GLOBAL 2 SOC SIN EXHORTO.docx`.

- **Sociedad Deudora + Aval (Regiones):** Utiliza la plantilla de demanda `PLANILLA DEMANDAS GLOBAL 2 SOC CON EXHORTO.docx`.

**Freno de Nulidad y Trampa de Admisibilidad:** Ciertos tribunales rechazan el cálculo de intereses devengados entre cuotas vencidas. El agente calcula el monto demandado aplicando la pauta configurada para esa jurisdicción o financiera. Inmediatamente después de la subida digital de la demanda y habiéndose registrado la entrega y custodia del pagaré físico en el tribunal, el agente pre-redacta y propone al abogado presentar de forma inmediata el escrito de **Curso Progresivo** utilizando la plantilla de la causa

`curso_se_provea_dda_por_acompanar_pagare_20260702210936.pdf`, lo que obliga administrativamente al tribunal a proveer la demanda sin esperar retrasos de archivo.

**Revisión humana en lote:** Antes de subir al PJUD, el agente presenta al abogado una pantalla consolidada con 4 datos clave: RUT, Nombres, Monto y Datos de la Financiera, con acceso de un clic al PDF origen. El abogado valida y autoriza la subida masiva.

### Subida al PJUD — flujo multi-firma

El proceso de presentación judicial en la Oficina Judicial Virtual (OJV) no es un simple botón de envío; requiere orquestación multiusuario:

- Ingresar con la clave de la abogada patrocinante (manejo conservador de sesión, ver restricciones).

- Subir la demanda + documentos (todo PDF). Marcar ‘documento original en papel’ para el pagaré físico cuando corresponda.

- La demanda queda en bandeja -\> el agente la deriva a las firmas de los apoderados.

- Notificar a cada apoderado que tiene causas pendientes de aceptar en su oficina judicial (hoy esto se hace ‘a gritos y llamadas’). Seguimiento automático hasta que todos aceptaron.

- Cuando todas las firmas están, alertar al patrocinante para ejecutar el **envío final**.

- Registrar fecha/hora de presentación -\> arranca el reloj de la causa y el hito de facturación (5%).

- **Admisibilidad y ‘previo a proveer’ (~20% de los casos)**

Tras la presentación, el tribunal revisa requisitos (1-2 semanas). Tres salidas posibles:

- **‘Despáchese’:** Demanda admitida. Se abre el juicio (dos cuadernos) y se habilita notificar. Avanza a Etapa 2. Validar el mandamiento (ver 2.6).

- **‘Previo a proveer’:** El tribunal pide subsanar — típicamente bajar el monto (no consideran intereses entre cuotas). Suele dar plazo (ej. ‘dentro de quinto día’). El agente abre el PDF de la resolución, detecta el plazo y la razón, y cruza el ajuste con la pauta de la financiera. Si está dentro de pauta (rebaja 10% o máx CLP 500K), pre-redacta el escrito **‘cumple lo ordenado’** utilizando como base la plantilla

`cumple_largo_20260702211210.pdf` o `cumple_largo_20260702211210 (1).pdf`, que detalla la liquidación aritmética de las cuotas pagadas (de la 1 a la 12), la constitución en mora a partir de la cuota 13 y el desglose del saldo insoluto de capital de \$10.895.269, para que el abogado lo firme y presente con un clic. Si excede la pauta, alerta para evaluar recurso de reposición (plazo 5 days). Ejecuta siempre un humano. Reloj de plazo visible desde el día 0.

- **Rechazo / no admisible:** Camino de recurso de reposición o apelación. Alerta inmediata con el plazo (reposición: 5 days). Flujo caso a caso, sin automatización en v1. Ocurre poco y está concentrado en tribunales identificables.

### Los dos cuadernos y el mandamiento de ejecución y embargo

El ‘despáchese’ abre el juicio en dos cuadernos: **principal** y de **apremio**. En paralelo, el tribunal emite el mandamiento de ejecución y embargo (‘requiérase de pago a \[demandado\] por \[monto\] en favor de \[financiera\]’). El tribunal se equivoca en ~20% de los mandamientos (más en verano, con funcionarios nuevos): falta un cero en el monto, nombre incompleto, falta el representante legal o los avales. El agente compara campo por campo el mandamiento contra la demanda presentada (nombre completo exacto, financiera, monto). Si no calza -\> pre-redactar escrito ‘rectifíquese el mandamiento’ y alertar. Si calza -\> luz verde a Etapa 2.

## Etapa 2 — Notificación

**Gatillante:** ’despáchese’ validado (mandamiento correcto). Hito de pago del estudio: causa notificada = 10%.

**Dolor principal:** causas notificadas que nadie acciona — ‘montones’, con demoras de hasta 300 days.

### Encargo al receptor

- La relación abogado-receptor **no es recelosa** (a diferencia del incautador): es agentizable con plantilla de correo.

- El agente mantiene una **base de receptores** con: nombre, mail, zonas que cubre, tarifas (Santiago ~USD 50/visita; comunas lejanas cobran adicional; negociable) y performance histórica.

- Genera y envía el mail de encargo con: **ID de la financiera, rol, tribunal, partes y domicilio a notificar**. El abogado elige/confirma el receptor (en Santiago hay muchos; en regiones suele ser uno solo).

- **Follow-up automático:** si el receptor no sube resultado en el plazo esperado para esa zona (ej. Talagante = 1 visita/mes), el agente manda recordatorio y alerta al abogado. Hoy ese seguimiento es 100% memoria del abogado.

### Lectura de estampados del receptor — el corazón de la etapa

El receptor sube al PJUD un PDF con su estampado. El incumbente lee solo el **título** (que cargan secretarias y viene mal etiquetado ~70% de las veces). El agente:

- **Abre y lee el PDF completo**, no el título.

- Clasifica el contenido en: **notificación efectiva / búsqueda positiva** (‘no la encontré, pero por dichos de un vecino me consta que es su domicilio’ -\> habilita notificación posterior) / **búsqueda negativa** (‘no es persona conocida en el domicilio’).

- **Valida que el estampado corresponda a la causa:** los receptores a veces suben la búsqueda en el juicio equivocado (hacen rutas con causas de varios abogados). El nombre buscado en el texto debe calzar con el deudor de la causa. Si no calza -\> alerta ‘estampado en causa incorrecta’.

- Registra el **número de intento** y lo cruza con la pauta de la financiera: Tanner = 2 intentos (montos altos; al segundo fallido castigan la causa), OLX = hasta 5 (montos bajos). Al acercarse al límite -\> alerta ‘último intento disponible; evaluar nuevo domicilio o castigo’.

- Si notificación efectiva (validada: contenido + calce con la causa) -\> **gatillante directo del encargo de embargo, sin pasos intermedios** (las excepciones corren en paralelo y no bloquean — ver sección 5). Hoy el lag entre notificación y acción es de days a semanas; la meta es horas.

- **Gestión Inteligente de Domicilios en Búsquedas Negativas:** Para evitar que la causa se estanque ante búsquedas fallidas, el agente pre-redacta los escritos correspondientes de forma proactiva:

- Si se detecta un nuevo domicilio en Santiago: pre-redacta el escrito de **Nuevo Domicilio sin Exhorto**

basándose en la plantilla `nuevo_domicilio_s_exhorto_20260702213840.pdf` (ej. Los Sables 1111, Maipú).

- Si el nuevo domicilio es regional (fuera de Santiago): pre-redacta el escrito de **Nuevo Domicilio con Exhorto** utilizando `nuevo_dom_y_exhorto_20260702213903.pdf` (ej. Los Aromos 31, Temuco) para solicitar despacho de exhorto.

- Si se agotan las direcciones conocidas: pre-redacta el escrito de **Solicitud de Oficios** basándose en

`oficios_dom_20260702213931.pdf` para requerir oficios vía interconexión judicial a Registro Civil, Servel, PDI, Tesorería y SII.

- Al notificarse exitosamente en región por exhorto: pre-redacta el escrito de devolución de exhorto `remita exh.pdf` (ej. 1° Juzgado de Letras de La Serena para la causa Rol E-648-2026) para que se remitan de inmediato los antecedentes al tribunal de origen y proceder al embargo sin rezagos.

### Requerimiento, excepciones y plazos legales (cuaderno de apremio — corre en paralelo)

**Aclaración estructural (confirmada por la operadora):** entre la notificación efectiva y el encargo del embargo no hay ningún paso intermedio obligatorio — ‘para poder ejecutar el embargo, no \[tiene que pasar nada\]’. El plazo de excepciones NO bloquea el embargo: corre en paralelo, en el cuaderno de apremio, como flujo de alerta independiente. El agente encarga el embargo apenas hay notificación efectiva validada, y simultáneamente vigila el cuaderno de apremio.

El reloj de defensa NO parte de la notificación: parte del estampado de **requerimiento de pago**, una actuación distinta que se sube en el **cuaderno de apremio** (el receptor estampa ‘se requirió el día lunes’). El agente debe distinguir ambos estampados — notificación (cuaderno principal) vs requerimiento (cuaderno de apremio)

— porque arrancan relojes distintos:

- **Requerimiento de pago estampado (8 days):** Iniciar reloj desde la fecha del requerimiento (no de la notificación). Si expira el plazo de 8 days sin excepciones, el agente registra ‘sin oposición’ en la ficha de la causa y pre-genera automáticamente el escrito de **Certificado de No Haberse Opuesto Excepciones** usando la plantilla `cne_20260702220615.pdf` para certificar la rebeldía del ejecutado y avanzar en el cuaderno principal.

- **Demandado opone excepciones (~20%):** Alerta inmediata, máxima prioridad. Clasificar como ‘causa con excepciones’ para el informe a la financiera. Jamás resolver en automático (regla explícita de la operadora).

- **Tribunal da ‘traslado’ (4 days):** Alerta crítica con cuenta regresiva diaria. La respuesta la redacta y decide el abogado; el agente solo garantiza que el plazo no se pase.

- **Recurso de reposición (5 days):** Reloj y alerta. Pre-redacción solo si hay plantilla aprobada.

**Línea roja declarada:** ’Jamás dependería 100% de la IA en un traslado/excepciones.’ Todo lo que sea defensa del deudor se alerta y se entrega al abogado. El agente nunca contesta excepciones por su cuenta.

## Etapa 3 — Embargo

**Gatillante:** notificación efectiva validada — sin pasos intermedios; las excepciones corren en paralelo y no bloquean. Hito de pago del estudio: embargo = ~15%. **Dolor principal:** 30% de las causas se atascan por no revisar el CAV a tiempo; un 10% no se revisa nunca.

### Encargo del embargo al receptor

Mismo mecanismo de mail que en notificación: ID, rol, tribunal, partes + listado de patentes a embargar. En Santiago se usa el mismo receptor de la notificación; en regiones el embargo lo hace igual el receptor de Santiago (la inscripción es en el Registro, da lo mismo dónde).

- **Trampa frecuente (pre-validación):** algunos tribunales exigen acompañar un CAV del mes en que se quiere embargar antes de dar lugar. El agente: (a) verifica si el tribunal exige CAV previo y lo pide antes de encargar;

2)  lee las respuestas del receptor al correo de encargo y alerta si el encargo fue rechazado.

- **Caso especial regiones:** si la notificación fue por exhorto, esperar el retorno del exhorto (validando con el escrito de devolución de exhorto del paso anterior) antes de encargar — hoy se les olvida y es una causa típica de los 300 days de demora.

### Registro Civil e inscripción — dos fuentes, un gatillante

**Distinción crítica para el agente:** en esta etapa hay dos documentos en dos fuentes distintas y solo uno gatilla el paso siguiente.

- **El comprobante de ingreso que el receptor sube al PJUD** solo arranca el reloj de ~1 mes — no significa que el embargo esté inscrito. El agente detecta y lee ese comprobante (documento, no título). Desde la fecha del comprobante arranca el reloj del CAV. La causa entra en estado ‘embargo en trámite de inscripción’. Error grave: tratar este comprobante como embargo listo.

- **El gatillante real es la confirmación ‘inscripción aceptada’ en la página externa del Registro Civil** (consulta por patente externa en la `url registro civil estado embargo` / Autofact). Confundir el comprobante con la inscripción es dar por embargado un vehículo que aún no lo está.

### El reloj del CAV — seguimiento automático

Este reloj es el módulo de mayor retorno inmediato de la Etapa 3: hoy se lleva con listas manuales por fecha y memoria. El 30% de atascos y el 10% de causas nunca revisadas se eliminan con un cron + lectura de estado. Sin scraping del PJUD siquiera.

- Registrar la fecha de ingreso al Registro Civil por causa. La inscripción demora 1 mes fijo. Reloj configurable, default 30 days, sin consultas antes del día 25.

- Al cumplirse el plazo, consultar la página externa del Registro Civil por patente hasta ver ‘inscripción aceptada’. Complementario: pedir el CAV (~CLP 1.500; Autofact).

- Si no está inscrito aún -\> reintento programado (cada 5-7 days) hasta confirmar.

- **Inscripción confirmada -\> tres acciones en cadena:** (a) alerta al abogado ‘embargo inscrito, causa lista para continuar’; (b) mail a la financiera pidiendo los certificados del lote listo (‘mándame todos estos certificados, ya pasó el mes’); (c) generar el informe de embargos inscritos del período.

- Si la inscripción fue rechazada (ej. deudor transfirió el auto antes del embargo en una ventana de fraude) -\> alerta con la razón para decisión humana (verificar transferencia, actualizar el proceso, informar de inmediato a la financiera).

### Cierre de etapa: escrito de martillero y retiro

Con el embargo inscrito, el abogado presenta un solo escrito al tribunal pidiendo: **designación de martillero + retiro del bien con auxilio de la fuerza pública** (la posterior incautación queda fuera del MVP, pero este escrito es el último paso de la Etapa 3). Es un escrito tipo: cambian patente, rol, tribunal, partes, martillero. El agente pre-genera el escrito con todos los campos desde la base de la causa y lo deja para firma/subida del abogado.

## Diagrama del Flujo de Trabajo del Scraper

El siguiente diagrama ilustra la arquitectura lógica del scraper. Se destaca la bifurcación del proceso en dos cuadernos paralelos (Principal y de Apremio), lo que permite que el avance del embargo no sea bloqueado por la tramitación de las excepciones o defensas presentadas por el deudor.

**Figura 1:** Máquina de estados y procesamiento paralelo de Cuadernos Principal y Apremio en el Scraper ProdBooster (Etapas 1-3).

## Máquina de Estados — Tabla Maestra de Transiciones

Esta tabla constituye el núcleo del motor agéntico. El scraper se rige estrictamente por la lectura de contenido, no por etiquetas de títulos del PJUD. Toda resolución clasificada como gatillante de avance requiere la superación previa de una validación lógica rigurosa.

| **Estado / Resolución**                           | **Cuaderno / Fuente**                              | **Documento que lo acompaña**                                     | **Validación Scraper**                                                                               | **¿Gatilla? -\> Qué Dispara el Agente**                                                                                                                         |
|---------------------------------------------------|----------------------------------------------------|-------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Demanda ingresada**                             | Principal (PJUD)                                   | Demanda + documentos (PDF) en bandeja                             | Firmas de todos los apoderados en sus OJV aprobadas                                                  | **SÍ -\>** envío final por el patrocinante. Inicia espera de admisibilidad (1-2 semanas) y hito de facturación (presentada = 5%).                               |
| **‘Previo a proveer’**                            | Principal (PJUD)                                   | Resolución del tribunal (texto dentro de la causa)                | Leer el contenido: qué piden (típico: bajar monto) y qué plazo (‘dentro de quinto día’)              | **SÍ -\>** reloj del plazo desde día 0 + pre-redacción del escrito ‘cumple lo ordenado’ según pauta de la financiera (rebaja 10% / CLP 500K).                  |
| **Respuesta al ‘cumple lo ordenado’**             | Principal (PJUD)                                   | Resolución (‘a lugar’ / ‘no a lugar’)                             | Leer el contenido. Pendiente de mapear en pantalla en sesión presencial                              | A lugar -\> esperar ‘despáchese’. No a lugar -\> alerta para recurso de reposición (5 days) o retiro de la demanda. Solo humano.                                |
| **‘Despáchese’**                                  | Principal (PJUD)                                   | Resolución de admisión (‘admítese la demanda, despáchese…’)       | NO gatilla solo. Comparar campo a campo contra demanda: nombre, RUT, monto, financiera, exhortos     | **SÍ, condicionado -\>** si todo calza: habilitado para notificar (contiene la palabra ‘notifíquese’). Si no -\> pre-redactar ‘rectifíquese’ y alertar.         |
| **Mandamiento de ejecución y embargo**            | Apremio (PJUD) — se abre en paralelo al despáchese | Mandamiento (‘requiérase de pago a \[demandado\] por \[monto\]…’) | Comparar campo a campo: nombre completo, monto exacto (falta de ceros), representante legal y avales | **SÍ, condicionado -\>** si calza: vía libre a Etapa 2. Si no -\> escrito ‘rectifíquese el mandamiento’ (pre-redactado, firma de abogado) y bloquea.            |
| **Estampado del receptor: notificación efectiva** | Principal (PJUD)                                   | PDF del receptor (‘me constituí en \[domicilio\] y notifiqué a…’) | Leer el PDF completo, jamás el título. Nombre buscado en el texto = deudor de la causa               | **SÍ -\>** gatillante directo del encargo de embargo, sin pasos intermedios. Las excepciones NO bloquean. Hito de facturación (notificada = 10%).               |
| **Estampado del receptor: búsqueda positiva**     | Principal (PJUD)                                   | PDF (‘no la encontré, pero por dichos de un vecino me consta…’)   | Contenido + calce con la causa                                                                       | **PARCIAL -\>** habilita la notificación posterior en ese domicilio (Art. 44). Registrar intento, seguimiento al receptor.                                      |
| **Estampado del receptor: búsqueda negativa**     | Principal (PJUD)                                   | PDF (‘no es persona conocida en el domicilio’)                    | Contenido + calce con la causa                                                                       | **NO gatilla avance -\>** consume intento. Cruzar con pauta (Tanner: 2 -\> castigo; OLX: 5). Al llegar a límite -\> alerta ‘evaluar nuevo domicilio o castigo’. |
| **Requerimiento de pago**                         | Apremio (PJUD)                                     | Estampado del receptor (‘se requirió de pago el día…’)            | Distingue requerimiento de la notificación: cuaderno de apremio                                      | **SÍ -\>** reloj de 8 days para excepciones, contado desde la fecha del requerimiento (no de la notificación). Vigilancia paralela.                             |

| **Estado / Resolución**                      | **Cuaderno / Fuente**                  | **Documento que lo acompaña**                                          | **Validación Scraper**                                                             | **¿Gatilla? -\> Qué Dispara el Agente**                                                                                                                            |
|----------------------------------------------|----------------------------------------|------------------------------------------------------------------------|------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Excepciones opuestas**                     | Apremio (PJUD)                         | Escrito del deudor                                                     | Detección de escrito de excepciones en apremio                                     | **SÍ -\>** alerta máxima prioridad, solo humano. Clasificar causa como ‘con excepciones’ para reporte a financiera. Jamás responde.                                |
| **‘Traslado’**                               | Apremio (PJUD)                         | Resolución de traslado                                                 | Detección de traslado en cuaderno de apremio                                       | **SÍ -\>** reloj de 4 days con cuenta regresiva diaria. Respuesta la decide y redacta el abogado (línea roja de autonomía).                                        |
| **Tribunal exige CAV previo al embargo**     | Principal (PJUD) y/o mail del receptor | Resolución (‘previo a embargar, acompáñese CAV’) o correo del receptor | Leer también respuestas de mail de receptor al encargo de embargo                  | **BLOQUEA el embargo -\>** pedir CAV del mes, presentarlo al tribunal, y re-encargar. Evita atascos de 300 days.                                                   |
| **Comprobante de ingreso al Registro Civil** | Principal (PJUD)                       | PDF del receptor (‘me constituí en el Registro Civil e inscribí…’)     | Leer contenido (etiquetado a veces ‘inscripción embargo’, a veces ‘certificación’) | **NO gatilla el avance -\>** solo arranca el reloj de ~1 mes. Estado: ‘embargo en trámite de inscripción’.                                                         |
| **‘Inscripción aceptada’**                   | Registro Civil — consulta patente      | Estado en Registro Civil / CAV con embargo inscrito                    | Consulta sistemática del Registro Civil (desde d25) cada 5-7 days                  | **SÍ -\>** gatillante de cierre de Etapa 3: (a) alerta ‘embargo inscrito’; (b) mail a financiera para certificados; (c) escrito de martillero+retiro. Hito (~15%). |
| **Inscripción rechazada**                    | Registro Civil                         | Estado de rechazo en Registro                                          | Detecta rechazo (ej. deudor vendió el vehículo en el intertanto)                   | **NO avanza -\>** alerta con la razón para decisión humana (verificar transferencia, informar a financiera).                                                       |

Reglas de Oro del Clasificador:

- **Aviso**  **Estado**  **Gatillante:** El aviso del PJUD solo dice ‘movimiento’. El estado/título es texto de terceros, no confiable. El gatillante se extrae del contenido del documento, validado contra la causa.

- **Dos Cuadernos, Dos Vigilancias:** El flujo de avance (notificación -\> embargo) vive en el principal; el flujo de defensa (requerimiento -\> excepciones -\> traslado) vive en el apremio. Se monitorean en paralelo y no se bloquean entre sí.

- **Dos Fuentes en Etapa 3:** PJUD da el comprobante (reloj); Registro Civil da la inscripción (gatillante). Cruzarlas siempre.

- **Baja Confianza -\> Cola Humana:** Si el clasificador no puede determinar el tipo de actuación con confianza alta, marca la causa para revisión en vez de gatillar.

## Capacidades Transversales

### Monitor PJUD (Sincronización Inteligente)

Sincronización recurrente de causas activas por RUT del abogado (frecuencia predeterminada cada ~4 horas) con un manejo conservador de sesión para evitar bloqueos de Clave Única Judicial. Cada movimiento se lee y clasifica (resolución, estampado, certificación, proveído) en ambos cuadernos, filtrando el ruido procesal o avisos genéricos de mero trámite.

### Configuración de Pauta por Financiera

El agente adapta su comportamiento de forma automatizada según las políticas operativas definidas por cada institución financiera:

| **Parámetro**                                    | **Ejemplos Reales**                                                               |
|--------------------------------------------------|-----------------------------------------------------------------------------------|
| **Modalidad de asignación**                      | ZIP global / ZIP por cliente / Descarga directa desde PROFIN                      |
| **Intentos de notificación**                     | Tanner: 2 (luego castigo) · OLX: hasta 5                                          |
| **Criterio de baja de monto (previo a proveer)** | Hasta 10% de lo demandado / tope CLP 500K / ‘No bajar nada, consultar siempre’    |
| **CAV: quién lo saca y paga**                    | Convenio Autofact de la financiera / Estudio paga y rinde a fin de mes            |
| **Umbral de judicialización**                    | 50 UF estándar (Oportunidad futura: bajar a ~25 UF con costos optimizados)        |
| **CRM de la financiera a alimentar**             | Campo ‘fecha de última actuación’ — el agente registra automáticamente la gestión |

### Alertas e Informes (Valor sin Scraping)

- **Bandeja diaria priorizada:** Ordena de forma automática los plazos perentorios próximos a vencer (traslados, previos), causas notificadas sin embargo encargado, y mandamientos por validar.

- **Detección de causas detenidas:** Identifica causas sin movimiento por más de N days (15/30 days) indicando la causa probable (ej. ‘exhorto regional sin retorno’ o ‘falta de consulta del CAV’).

- **Informe Semáforo:** Semilla de la capa financiera que reporta a las instituciones financieras el % de causas con excepciones, % inubicables (candidatos a cobranza extrajudicial) y % de embargos inscritos.

- **Mapeo a facturación:** Cada hito completado y validado (Demanda presentada = 5%, Causa notificada = 10%, Embargo inscrito = ~15%) se registra con fecha exacta y documento fundante, permitiendo al estudio facturar con respaldo legal de forma inmediata.

## Matriz de Autonomía — Qué decide el agente y qué no

La matriz define rigurosamente el nivel de autonomía delegada al agente, separando los procesos puramente automatizados de aquellos que exigen consentimiento o son de exclusiva decisión del abogado.

| **Acción Procesal**                    | **Nivel de Autonomía** | **Regla de Negocio y Lógica Operativa**                                                                                            |
|----------------------------------------|------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| **Ingesta, OCR y validación cruzada**  | AUTOMÁTICO             | Descomprime, asocia y valida por OCR. Score bajo umbral pasa a deudor/revisión humana (~10% de 150).                               |
| **Redacción de escritos estándar**     | AUTOMÁTICO             | Pre-completa los modelos de demandas y escritos del estudio. Jamás los presenta sin aprobación.                                    |
| **Firma y subida PJUD (OJV)**          | CON APROBACIÓN         | Abogado valida nombres, RUT, monto y financiera. El agente orquesta firmas en las OJV de apoderados. Envío final por patrocinante. |
| **Clasificación de actuaciones**       | AUTOMÁTICO             | Clasifica mediante el contenido del PDF. Ante baja confianza, lo desvía a la bandeja de revisión humana.                           |
| **Validación de mandamientos**         | CON APROBACIÓN         | Compara mandamiento contra demanda. Si hay inconsistencia, pre-redacta rectificación para firma.                                   |
| **Cumplimiento previo a proveer**      | CON APROBACIÓN         | Si la rebaja sugerida por el tribunal está dentro de la pauta de la financiera (baja 10%), pre-redacta escrito.                   |
| **Mails a receptores y seguimiento**   | AUTOMÁTICO             | Gatilla encargo y follow-up al receptor según base interna. Configurable a modo borrador/aprobación.                               |
| **Seguimiento CAV y Registro Civil**   | AUTOMÁTICO             | Consulta sistemática de patentes a partir del day 25 en Registro Civil. Alerta confirmación o rechazo.                             |
| **Excepciones de deudor y Traslados**  | SOLO HUMANO            | **Línea roja.** El agente detecta la defensa, enciende reloj de traslado (4 days) y alerta. Nunca responde autónomo.               |
| **Castigos y reasignaciones**          | SOLO HUMANO            | El agente alerta el fin del número de intentos autorizados. La financiera o abogado decide reasignar o castigar.                   |
| **Documentos ilegibles (OCR fallido)** | SOLO HUMANO            | Si un deudor/humano no puede leerlo, la IA tampoco. Alerta y bypass.                                                               |

## Riesgos Técnicos y Validaciones Pendientes

**Riesgo \#1 — Calidad de OCR en Pagarés:** El 70% de legibilidad de escaneos exige un spike técnico inmediato con deudores reales de la primera asignación. Se implementará un sistema de deudores/doble motor de OCR con comparación y score de confianza ponderado.

**Pruebas de Conexión PJUD:** Validación de tokens de login con la clave única de un abogado del equipo para estructurar un túnel seguro de scraping, integrando proxy rotativo y detección preventiva de bloqueo.

**API de CRM PROFIN:** Pendiente evaluar si la financiera permite consumo de API o si requiere automatización RPA de descarga web para la modalidad de ingesta C.

**Data de Tiempos Reales:** La operadora del estudio se comprometió a reconstruir 10 causas cerradas (fechas desde la asignación hasta la inscripción del embargo) para contrastar los tiempos reales contra la aceleración proyectada por el agente.

**Plantillas y macros del estudio:** Se solicitará la entrega de todas las plantillas del estudio al iniciar el desarrollo del redactor.

**Hipotecario / Consumo:** El flujo es sustancialmente homólogo, pero con mayores formalidades y escritos específicos en hipotecario. Se validará con Normaliza antes de generalizar las plantillas de demanda.

Criterio de Éxito del MVP

El éxito de la primera fase del MVP se medirá bajo tres criterios declarados por la operadora:

- **Redactar y subir 150 demandas en 1 day** en lugar de los 4-7 days habituales, con certeza total de datos.

- **Cero causas notificadas sin accionar** por falta de aviso oportuno de la resolución judicial.

- **Cero causas atascadas** por retrasos en el seguimiento del Certificado de Anotaciones Vigentes (CAV) ante el Registro Civil.

La métrica de negocio definitiva es el aumento en la tasa de recuperación. En la cobranza automotriz, el recupero es una función directa del tiempo: un ciclo de 6 meses encuentra y asegura el vehículo; un retraso de 2 años resulta en un bien inubicable o desmantelado.
