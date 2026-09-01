/**
 * Todo el copy de la landing. Ningún texto se escribe en el markup.
 *
 * Reglas duras:
 * - Español chileno, tuteo o impersonal. Nunca voseo. Voz activa, registro legal serio.
 * - Ningún estado, plazo, hito ni automatización que no esté en
 *   .claude/skills/cobranza-legal-pjud/SKILL.md.
 * - Ningún cliente, logo, cifra de negocio ni credencial inventada.
 */

export const marca = {
  nombre: 'Kupera',
  descriptor: 'Agente de cobranza judicial',
  venture: 'Kupera es una empresa de ProdBooster Venture Studio',
  canonical: 'https://kupera.cl/',
  // Sin casilla de contacto todavía: mientras esté vacía, el CTA de demo lleva
  // al formulario en vez de apuntar a un mailto inventado.
  contacto: '',
} as const;

export const nav = {
  links: [
    { href: '#tension', label: 'El problema' },
    { href: '#procurador', label: 'El procurador' },
    { href: '#causa', label: 'Causa de ejemplo' },
    { href: '#flujo', label: 'El flujo' },
    { href: '#autonomia', label: 'Autonomía' },
  ],
  cta: 'Agenda una demo',
  abrirMenu: 'Abrir menú',
  cerrarMenu: 'Cerrar menú',
  saltarAlContenido: 'Saltar al contenido',
} as const;

export const hero = {
  eyebrow: 'Cobranza judicial automotriz por pagaré',
  title: 'El trámite lo ejecuta el agente.',
  titleTail: 'El criterio sigue siendo tuyo.',
  lead:
    'Kupera lee lo que llega —el lote de la financiera y cada resolución del tribunal—, arma el ' +
    'escrito que corresponde y te lo deja listo. Tú corriges, firmas y decides. La oposición de ' +
    'excepciones no la toca nadie más que tú.',
  ctaPrimario: 'Agenda una demo',
  ctaSecundario: 'Pide acceso anticipado',
  nota: 'Sin integración al PJUD sin tu consentimiento firmado. Ley 21.719.',
} as const;

/**
 * El procurador leyendo una resolución del PJUD y dejando armado el escrito de
 * respuesta. Los dos casos salen de la especificación:
 * 'previo a proveer' → cumple lo ordenado, y mandamiento con error → rectifíquese.
 *
 * Los documentos son ilustrativos. La causa, el tribunal y las partes son ficticios.
 */
const barraHumana = {
  estado: 'Borrador listo · requiere firma',
  corregir: 'Corregir en el editor',
  aprobar: 'Aprobar y firmar',
  // Frase textual de la especificación.
  nota: 'Ejecuta siempre un humano.',
} as const;

export const procurador = {
  eyebrow: 'El procurador',
  title: 'Llega una resolución.',
  titleTail: 'Sale un borrador.',
  lead:
    'El tribunal escribe y el agente responde: abre el PDF completo, entiende qué le están ' +
    'pidiendo, cruza el criterio con la pauta de la financiera y deja el escrito redactado. Lo ' +
    'único que queda es corregirlo o firmarlo.',
  tiempos: ['Llega', 'El agente lee', 'Sale'],
  barra: barraHumana,
  remate:
    'El agente nunca presenta solo. Prepara, explica en qué se basó y espera. Si el criterio se ' +
    'sale de la pauta, no redacta: alerta.',
  casos: [
    {
      id: 'previo',
      label: 'Previo a proveer',
      etapa: 'Etapa 1 · Admisibilidad',
      autonomia: 'CON APROBACIÓN',
      entrada: {
        label: 'Resolución del tribunal · cuaderno principal',
        folio: '12',
        titulo: 'Resolución',
        lineas: [
          'Previo a proveer, subsane la parte demandante el monto cobrado, por cuanto la liquidación acompañada considera intereses devengados entre cuotas.',
          'Cúmplase dentro de quinto día, bajo apercibimiento legal.',
        ],
      },
      lectura: {
        titulo: 'Lo que dice el título',
        tituloValor: '«Resolución»',
        // El título del PJUD no sirve: se descarta y se lee el documento.
        tachaPrimero: true,
        contenido: 'Lo que dice el documento',
        contenidoValor: 'Previo a proveer: piden subsanar el monto',
        filas: [
          { campo: 'Qué piden', valor: 'Bajar el monto demandado: el tribunal no considera los intereses entre cuotas' },
          { campo: 'Plazo', valor: 'Dentro de quinto día · reloj corriendo desde el día 0' },
          { campo: 'Pauta de la financiera', valor: 'Rebaja de hasta 10% con tope de CLP 500.000' },
          { campo: 'Veredicto', valor: 'El ajuste cabe en la pauta. Se pre-redacta el escrito.' },
        ],
        alterno:
          'Si el ajuste excediera la pauta, el agente no redacta: alerta para evaluar reposición, con su plazo de cinco días.',
      },
      salida: {
        label: 'Cumple lo ordenado · borrador',
        folio: '13',
        encabezado: 'EN LO PRINCIPAL: cumple lo ordenado. OTROSÍ: acompaña liquidación.',
        lineas: [
          'Vengo en cumplir lo ordenado y rectificar el monto demandado, acompañando liquidación aritmética de las cuotas 1 a 12 efectivamente pagadas.',
          'La constitución en mora se produce a partir de la cuota 13, quedando fijado el saldo insoluto de capital en $10.895.269.',
        ],
        pie: 'Redactado por el agente sobre la plantilla del estudio. Pendiente de firma.',
      },
    },
    {
      id: 'mandamiento',
      label: 'Mandamiento con error',
      etapa: 'Etapa 1 · Apremio',
      autonomia: 'CON APROBACIÓN',
      entrada: {
        label: 'Mandamiento de ejecución y embargo · cuaderno de apremio',
        folio: '21',
        titulo: 'Mandamiento',
        lineas: [
          'Requiérase de pago al demandado por la suma de $1.089.526 en favor de la entidad financiera ejecutante.',
          'No practicándose el pago, trábese embargo sobre bienes suficientes.',
        ],
      },
      lectura: {
        titulo: 'Monto en la demanda',
        tituloValor: '$10.895.269',
        // Aquí el monto de la demanda es el correcto: no se tacha. El hallazgo
        // es el del mandamiento, que viene con un cero de menos.
        tachaPrimero: false,
        contenido: 'Monto en el mandamiento',
        contenidoValor: '$1.089.526',
        filas: [
          { campo: 'Comparación', valor: 'Campo a campo contra la demanda: nombre completo, financiera, monto, representante legal y avales' },
          { campo: 'Diferencia', valor: 'Falta un cero en el monto. El resto de los campos calza.' },
          { campo: 'Frecuencia', valor: 'Cerca del 20% de los mandamientos llega con error' },
          { campo: 'Veredicto', valor: 'No calza. Se bloquea el avance a la Etapa 2 y se pre-redacta la rectificación.' },
        ],
        alterno:
          'Si el mandamiento calzara campo a campo, el agente daría vía libre a la notificación sin pedirte nada.',
      },
      salida: {
        label: 'Rectifíquese el mandamiento · borrador',
        folio: '22',
        encabezado: 'EN LO PRINCIPAL: solicita rectificación del mandamiento de ejecución y embargo.',
        lineas: [
          'Vengo en solicitar se rectifique el mandamiento, por cuanto el monto consignado no corresponde al demandado y cobrado en autos.',
          'Se solicita consignar la suma de $10.895.269, conforme al pagaré y a la liquidación acompañada.',
        ],
        pie: 'La causa queda bloqueada para notificación hasta que el mandamiento se corrija.',
      },
    },
  ],
} as const;

export const tension = {
  eyebrow: 'El problema',
  title: 'El juicio no se atrasa por criterio.',
  titleTail: 'Se atrasa por trámite.',
  lead:
    'Seguir cientos de causas a mano produce atrasos, omisiones y pérdida de recuperación. ' +
    'No porque falte abogado, sino porque el trabajo hormiga no escala.',
  datos: [
    {
      cifra: 70,
      sufijo: '%',
      titulo: 'de las actuaciones del PJUD viene mal etiquetada',
      detalle:
        'El título no dice lo que dice el documento. Hay que abrir el PDF y leerlo completo ' +
        'para saber qué pasó en la causa.',
    },
    {
      cifra: 30,
      sufijo: '%',
      titulo: 'de los embargos se atasca en el Registro Civil',
      detalle:
        'Por no revisar el CAV a tiempo. Otro 10% no se revisa nunca y el embargo queda ' +
        'sin inscribir.',
    },
    {
      cifra: 8,
      sufijo: ' días',
      titulo: 'para oponer excepciones desde el requerimiento',
      detalle:
        'Y cuatro para el traslado, cinco para la reposición. Un plazo perentorio que se pasa ' +
        'no se recupera.',
    },
  ],
  remate: 'El agente automatiza el tiempo hormiga. El criterio legal no se delega.',
} as const;

/**
 * Causa de ejemplo: recorrido por los nueve hitos de la especificación,
 * desde el lote de la financiera hasta la inscripción del embargo.
 */
export const causa = {
  eyebrow: 'Causa de ejemplo',
  title: 'Un expediente completo,',
  titleTail: 'del ZIP a la inscripción.',
  lead:
    'Un caso ilustrativo del juicio ejecutivo, hito por hito, con los documentos que el agente ' +
    'lee y los que genera. Los estados y plazos son los de la especificación, no una simplificación.',
  hitos: [
    {
      folio: '01',
      etapa: 'Etapa 1 · Demanda',
      titulo: 'Llega el lote de la financiera',
      detalle:
        'El agente descomprime el ZIP, separa pagarés, CAV y tablas de desarrollo, y los asocia ' +
        'por RUT, nombre y patente. También acepta carpetas por deudor o el conector con el CRM.',
      autonomia: 'AUTOMÁTICO',
    },
    {
      folio: '02',
      etapa: 'Etapa 1 · Demanda',
      titulo: 'Validación documental antes de redactar',
      detalle:
        'Verifica que existan los cuatro documentos mandatorios: pagaré, CAV inicial, tabla de ' +
        'desarrollo o prepago y mandato de la financiera. Si falta uno, marca ' +
        '«documentación incompleta» y no avanza.',
      autonomia: 'AUTOMÁTICO con bloqueos',
    },
    {
      folio: '03',
      etapa: 'Etapa 1 · Demanda',
      titulo: 'Filtro de propietario y confianza del OCR',
      detalle:
        'Contrasta al propietario de la última página del CAV con el deudor. Si el vehículo fue ' +
        'transferido a un tercero, marca «vehículo transferido» y deriva a decisión humana. ' +
        'Cada campo lleva su score: bajo el umbral, va a cola de revisión manual.',
      autonomia: 'AUTOMÁTICO con desvío humano',
    },
    {
      folio: '04',
      etapa: 'Etapa 1 · Demanda',
      titulo: 'Redacción y revisión humana en lote',
      detalle:
        'Redacta con la plantilla global que corresponde al deudor y la jurisdicción, y valida el ' +
        'número de partes contra el pagaré. Tú revisas RUT, nombres, montos y datos de la ' +
        'financiera en una pantalla consolidada, con el PDF de origen a un clic.',
      autonomia: 'CON APROBACIÓN',
    },
    {
      folio: '05',
      etapa: 'Etapa 1 · Demanda',
      titulo: 'Subida multifirma y nacimiento de la causa',
      detalle:
        'Ingresa con la clave de la patrocinante, sube la demanda y marca el pagaré como documento ' +
        'original en papel. Queda en bandeja, los apoderados aceptan en su OJV y la patrocinante ' +
        'envía. Recién ahí nace el rol y arranca el reloj de la causa.',
      autonomia: 'CON APROBACIÓN',
    },
    {
      folio: '06',
      etapa: 'Etapa 1 · Admisibilidad',
      titulo: 'Despáchese y control del mandamiento',
      detalle:
        'El tribunal abre los cuadernos principal y de apremio, y emite el mandamiento de ejecución ' +
        'y embargo. El agente lo compara campo a campo contra la demanda: si no calza, pre-redacta ' +
        '«rectifíquese el mandamiento» y bloquea el avance.',
      autonomia: 'AUTOMÁTICO con bloqueo humano',
    },
    {
      folio: '07',
      etapa: 'Etapa 2 · Notificación',
      titulo: 'Encargo al receptor',
      detalle:
        'Arma el correo con identificación de la financiera, rol, tribunal, partes y domicilio. ' +
        'Tú eliges y confirmas al receptor. Si no sube resultado dentro del plazo de la zona, ' +
        'el agente hace el seguimiento.',
      autonomia: 'AUTOMÁTICO con decisión humana',
    },
    {
      folio: '08',
      etapa: 'Etapa 2 · Notificación',
      titulo: 'Lectura del estampado',
      detalle:
        'Abre el PDF completo, no el título. Clasifica entre notificación efectiva, búsqueda ' +
        'positiva y búsqueda negativa, y valida que el nombre calce con el deudor. La notificación ' +
        'efectiva gatilla el encargo de embargo de forma directa.',
      autonomia: 'AUTOMÁTICO con revisión humana',
    },
    {
      folio: '09',
      etapa: 'Etapa 3 · Embargo',
      titulo: 'Embargo e inscripción en el Registro Civil',
      detalle:
        'El comprobante que el receptor sube al PJUD solo arranca el reloj de aproximadamente un ' +
        'mes: el embargo todavía no está listo. El gatillante real es «inscripción aceptada» en el ' +
        'Registro Civil, que el agente consulta desde el día 25, cada cinco a siete días.',
      autonomia: 'AUTOMÁTICO con respaldo documental',
    },
  ],
  resumen: {
    titulo: 'Al cierre del ejemplo',
    items: [
      'Causa ingresada con rol y reloj corriendo',
      'Notificación efectiva validada contra el estampado',
      'Embargo inscrito y confirmado en el Registro Civil',
    ],
    nota: 'Cada paso quedó respaldado por su documento y ningún plazo venció sin aviso.',
  },
  artefactos: {
    titulo: 'Los documentos del hito',
    tabs: [
      {
        id: 'mail',
        label: 'Encargo al receptor',
        sheetLabel: 'Correo al receptor',
        folio: '18',
        lineas: [
          'Asunto: Encargo de notificación — Rol C-1842-2026, 3.º Juzgado Civil.',
          'Estimado receptor: se solicita practicar la notificación y el requerimiento de pago al deudor individualizado, en el domicilio consignado.',
          'Se adjuntan demanda, mandamiento y copia del pagaré. Se agradece subir el estampado al portal una vez practicada la diligencia.',
        ],
      },
      {
        id: 'estampado',
        label: 'Estampado del receptor',
        sheetLabel: 'Estampado · acta de notificación',
        folio: '31',
        lineas: [
          'En el domicilio señalado, me constituí y notifiqué personalmente al demandado, quien recibió copia íntegra de la demanda y del mandamiento.',
          'Practicado el requerimiento de pago, el demandado no consignó suma alguna.',
          'Lectura del agente: notificación efectiva. Nombre calzado con el deudor. Se gatilla el encargo de embargo y parte el plazo de ocho días para excepciones.',
        ],
      },
      {
        id: 'escrito',
        label: 'Escrito generado',
        sheetLabel: 'Certificado de no haberse opuesto excepciones',
        folio: '44',
        lineas: [
          'Vencido el plazo legal de ocho días contado desde el requerimiento de pago, sin que el ejecutado haya opuesto excepciones,',
          'vengo en solicitar se certifique dicha circunstancia por el ministro de fe del tribunal.',
          'Pre-redactado por el agente. Requiere revisión y firma del abogado antes de presentarse.',
        ],
      },
    ],
  },
} as const;

export const flujo = {
  eyebrow: 'El flujo',
  title: 'Tres etapas,',
  titleTail: 'un solo reloj por plazo.',
  lead:
    'Cada plazo perentorio abre un temporizador diario. El agente no decide el fondo: vigila que ' +
    'nada venza sin que alguien lo sepa.',
  etapas: [
    {
      nombre: 'Demanda',
      resumen:
        'Ingesta, validación documental, redacción con plantilla y revisión humana en lote antes ' +
        'de subir. La causa no existe hasta que la patrocinante envía.',
      gatillante: 'Cierre: la patrocinante envía. Ahí nace el rol.',
    },
    {
      nombre: 'Notificación',
      resumen:
        'Encargo al receptor, seguimiento del plazo de la zona y lectura del estampado. La ' +
        'notificación efectiva gatilla el embargo sin pasos intermedios.',
      gatillante: 'Gatillante: despáchese validado con el mandamiento correcto.',
    },
    {
      nombre: 'Embargo',
      resumen:
        'Encargo con las patentes, prevalidación del CAV del mes cuando el tribunal lo exige y ' +
        'consulta al Registro Civil hasta la inscripción aceptada.',
      gatillante: 'Gatillante: notificación efectiva validada.',
    },
  ],
  relojes: [
    { plazo: '8 días', desde: 'Excepciones, desde el requerimiento de pago' },
    { plazo: '4 días', desde: 'Traslado' },
    { plazo: '5 días', desde: 'Reposición' },
    { plazo: '~30 días', desde: 'Inscripción en el Registro Civil' },
  ],
  paralelo: {
    titulo: 'El cuaderno de apremio corre en paralelo',
    detalle:
      'Las excepciones no bloquean el embargo. El reloj de defensa parte del estampado de ' +
      'requerimiento de pago, no de la notificación.',
  },
} as const;

export const autonomia = {
  eyebrow: 'Matriz de autonomía',
  title: 'Qué hace solo,',
  titleTail: 'qué te pregunta, qué no toca.',
  lead:
    'La autonomía está declarada ticket por ticket. Nada se ejecuta en un nivel que no le ' +
    'corresponde.',
  columnas: [
    {
      nivel: 'AUTOMÁTICO',
      resumen: 'El agente lo ejecuta y deja trazado.',
      items: [
        'Descomprimir el lote y clasificar los documentos',
        'Validar completitud y consistencia cruzada por OCR',
        'Leer el contenido de las actuaciones del PJUD',
        'Controlar los relojes de cada plazo',
        'Consultar la inscripción en el Registro Civil',
      ],
    },
    {
      nivel: 'CON APROBACIÓN',
      resumen: 'El agente prepara, tú autorizas.',
      items: [
        'Redacción de la demanda y revisión en lote',
        'Subida al PJUD y flujo multifirma',
        'Elección y confirmación del receptor',
        'Escritos pre-redactados: cumple lo ordenado, rectifíquese, certificado',
        'Designación de martillero y retiro',
      ],
    },
    {
      nivel: 'SOLO HUMANO',
      resumen: 'El agente alerta y se detiene.',
      items: [
        'Oposición de excepciones',
        'Respuesta a traslados',
        'Vehículo transferido a un tercero',
        'Rechazo de inscripción en el Registro Civil',
        'Reposición y apelación',
      ],
    },
  ],
  lineaRoja: 'El agente jamás contesta excepciones ni traslados.',
  lineaRojaDetalle:
    'Cuando aparece una oposición, el agente sube la alerta al máximo, clasifica la causa y para. ' +
    'La defensa la escribe el abogado.',
} as const;

export const cta = {
  eyebrow: 'Conversemos',
  title: 'Trae una causa real',
  titleTail: 'y la recorremos juntos.',
  lead:
    'Kupera está en acceso anticipado con estudios de cobranza. Si trabajas cartera automotriz ' +
    'por pagaré, queremos ver tu flujo antes de escribir una línea más.',
  demo: {
    titulo: 'Agenda una demo',
    detalle:
      'Media hora. Recorremos el flujo con tus documentos y te decimos con franqueza qué parte ' +
      'del trámite podría ejecutar el agente hoy.',
    boton: 'Agenda una demo',
  },
  early: {
    titulo: 'Acceso anticipado',
    detalle: 'Cuéntanos cómo trabajas la cartera y te contactamos cuando abramos cupos.',
    campos: {
      nombre: 'Nombre y apellido',
      estudio: 'Estudio o empresa',
      email: 'Correo',
      cartera: 'Causas de cobranza automotriz al mes',
      carteraOpciones: ['Menos de 50', 'Entre 50 y 300', 'Más de 300'],
    },
    boton: 'Pedir acceso',
    // Honesto: no hay backend todavía.
    pendiente:
      'El formulario todavía no está habilitado. Escríbenos y coordinamos la demo por correo.',
    requerido: 'Completa este campo para continuar.',
  },
} as const;

export const footer = {
  descriptor: 'Agente de cobranza judicial automotriz por pagaré.',
  columnas: [
    { titulo: 'Producto', links: nav.links },
    {
      titulo: 'Legal',
      links: [
        { href: '#autonomia', label: 'Matriz de autonomía' },
        { href: '#flujo', label: 'Plazos y relojes' },
      ],
    },
  ],
  nota: 'Tratamiento de datos conforme a la Ley 21.719. Consentimiento firmado antes de operar con claves del estudio.',
  copyright: `© ${new Date().getFullYear()} ${marca.nombre}`,
} as const;
