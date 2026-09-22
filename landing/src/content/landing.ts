/**
 * Todo el copy de la landing. Ningún texto se escribe en el markup.
 *
 * Reglas duras:
 * - Español chileno, tuteo o impersonal. Nunca voseo. Voz activa, registro legal serio.
 * - Ningún estado, plazo, hito ni automatización que no esté en
 *   .claude/skills/cobranza-legal-pjud/SKILL.md.
 * - Ningún cliente, logo, cifra de negocio ni credencial inventada.
 */

/**
 * Identidad de la empresa. Es lo que un revisor usa para verificar que detrás
 * del sitio hay una operación real, así que ningún campo se rellena con un
 * marcador: lo que falta queda en null y scripts/check-publicacion.mjs impide
 * publicar a producción hasta que esté completo.
 */
export interface Empresa {
  nombre: string;
  descriptor: string;
  razonSocial: string | null;
  /** Opcionales: no se publican en la landing si quedan en null. */
  rut: string | null;
  domicilio: string | null;
  contacto: string | null;
  app: string;
  venture: { nombre: string; url: string };
}

export const empresa: Empresa = {
  nombre: 'Kupera',
  descriptor: 'Agente de cobranza judicial automotriz por pagaré',
  razonSocial: 'Kupera SpA',
  rut: null,
  domicilio: null,
  contacto: 'coyandelp@kupera.cl',
  app: 'https://app.kupera.cl',
  venture: { nombre: 'ProdBooster Studio', url: 'https://www.prodbooster.com' },
};

export const seo = {
  title: 'Kupera · Agente de cobranza judicial automotriz',
  description:
    'Kupera ejecuta el trámite de la cobranza judicial automotriz por pagaré: lee las resoluciones ' +
    'del tribunal, redacta el escrito de respuesta y controla cada plazo. El abogado corrige y firma.',
  ogAlt: 'Kupera — El trámite lo ejecuta el agente. El criterio sigue siendo tuyo.',
} as const;

export const nav = {
  links: [
    { href: '#procurador', label: 'El procurador' },
    { href: '#producto', label: 'El producto' },
    { href: '#autonomia', label: 'Autonomía' },
    { href: '#equipo', label: 'Equipo' },
  ],
  ingresar: 'Ingresar',
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
    'Kupera lee lo que llega —el lote de la financiera y cada resolución del tribunal—, redacta el ' +
    'escrito completo y te lo deja listo para revisar. Tú apruebas, corriges o descartas. Nada se ' +
    'presenta sin tu firma.',
  ctaPrimario: 'Agenda una demo',
  ctaSecundario: 'Ingresar a la plataforma',
  nota:
    'La operación sobre sistemas judiciales está sujeta a los mecanismos de autorización, ' +
    'autenticación y consentimiento que correspondan. Ley 21.719.',
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
    'El agente redacta de principio a fin y explica en qué se basó. Tu trabajo deja de ser escribir ' +
    'desde cero y pasa a ser aprobar, corregir o descartar. Nada se presenta sin tu firma.',
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
          { campo: 'Pauta de la financiera', valor: 'En este caso, rebaja de hasta 10% con tope de CLP 500.000' },
          { campo: 'Veredicto', valor: 'El ajuste cabe en la pauta. Se pre-redacta el escrito.' },
        ],
        alterno:
          'Si el ajuste excediera la pauta, el agente redacta igual y te lo advierte, para que decidas entre cumplir o ir a reposición.',
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
          { campo: 'Frecuencia', valor: 'Un mandamiento puede llegar con diferencias respecto de la demanda' },
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
    'Una cartera de cientos o miles de causas exige revisar permanentemente resoluciones, ' +
    'documentos, diligencias, inscripciones y plazos. El problema no está en la falta de criterio ' +
    'jurídico, sino en la cantidad de trabajo operativo que hay que ejecutar para poder ejercerlo a ' +
    'tiempo.',
  /* Sin cifras de mercado: no son verificables públicamente y la revisión legal las retiró.
     Cada tarjeta describe un tipo de trabajo, no una estadística. */
  datos: [
    {
      rotulo: 'Lectura',
      titulo: 'El título no dice lo que dice el documento',
      detalle:
        'Las actuaciones registradas en los sistemas judiciales no siempre permiten determinar, por ' +
        'su denominación, qué ocurrió en la causa. Hay que abrir el documento y leerlo.',
    },
    {
      rotulo: 'Diligencias',
      titulo: 'La diligencia no termina con el acta',
      detalle:
        'Hay que verificar el resultado, la documentación que lo acredita y las actuaciones ' +
        'posteriores necesarias para avanzar en la ejecución. Ahí se pierden causas.',
    },
    {
      rotulo: 'Plazos',
      titulo: 'Los plazos no deberían depender de una revisión manual',
      detalle:
        'El procedimiento ejecutivo contiene distintos plazos y cargas que deben identificarse y ' +
        'controlarse según la actuación que los origina y las reglas aplicables.',
    },
  ],
  remate: 'El agente ejecuta la carga operativa. El criterio jurídico no se delega.',
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
    { plazo: '8 días', desde: 'Excepciones, desde el requerimiento de pago, más los aumentos que correspondan' },
    { plazo: '4 días', desde: 'Traslado' },
    { plazo: '5 días', desde: 'Reposición' },
    { plazo: '~30 días', desde: 'Inscripción en el Registro Civil' },
  ],
  notaPlazos:
    'Los plazos que muestra la plataforma son mecanismos de control y alerta. El profesional ' +
    'responsable debe verificarlos según la naturaleza de la actuación, la forma de notificación y ' +
    'las circunstancias particulares de cada causa.',
  paralelo: {
    titulo: 'El cuaderno de apremio corre en paralelo',
    detalle:
      'Las excepciones no bloquean el embargo. El reloj de defensa parte del estampado de ' +
      'requerimiento de pago, no de la notificación.',
  },
} as const;

export const autonomia = {
  eyebrow: 'Matriz de autonomía',
  title: 'El agente hace el trabajo.',
  titleTail: 'Tú apruebas.',
  lead:
    'No hay escritos que queden a medias ni trámites que vuelvan a tu escritorio en blanco. El ' +
    'agente redacta todo lo que la causa necesita, incluida la defensa, y lo deja listo para tu ' +
    'revisión. Lo único que nunca hace es presentar sin tu aprobación.',
  columnas: [
    {
      nivel: 'EJECUTA SOLO',
      resumen: 'Lo hace y deja registro de cada paso.',
      items: [
        'Descomprimir el lote y clasificar los documentos',
        'Validar completitud y consistencia cruzada por OCR',
        'Leer el contenido de las actuaciones del PJUD',
        'Comparar el mandamiento campo a campo contra la demanda',
        'Consultar la inscripción en el Registro Civil',
      ],
    },
    {
      nivel: 'REDACTA POR TI',
      resumen: 'Arma el escrito completo y te explica en qué se basó.',
      items: [
        'La demanda ejecutiva con la plantilla de la jurisdicción',
        'Cumple lo ordenado y rectifíquese el mandamiento',
        'Certificado de no haberse opuesto excepciones',
        'Encargos al receptor, nuevo domicilio, exhortos y oficios',
        'La respuesta a excepciones y traslados, con la defensa propuesta',
        'Designación de martillero y retiro',
      ],
    },
    {
      nivel: 'NUNCA SIN TI',
      resumen: 'Se detiene y espera tu decisión.',
      items: [
        'Presentar cualquier escrito en el PJUD',
        'Firmar: la firma es del abogado, siempre',
        'Aceptar o cambiar la defensa que propuso el agente',
        'Resolver un vehículo transferido a un tercero',
        'Decidir ante un rechazo de inscripción en el Registro Civil',
      ],
    },
  ],
  lineaRoja: 'El agente redacta todo. Nunca presenta nada sin tu aprobación.',
  lineaRojaDetalle:
    'Cuando el deudor opone excepciones, el agente lee el escrito, propone la defensa y deja el ' +
    'borrador armado. Tú decides si esa es la respuesta, la corriges o la descartas. El criterio ' +
    'jurídico y la firma siguen siendo tuyos; lo que desaparece es la hoja en blanco.',
} as const;

/**
 * El producto en operación. Las capturas son del panel real de app.kupera.cl,
 * con datos de ejemplo: nunca datos de deudores (Ley 21.719).
 * Mientras la lista esté vacía, la sección no se renderiza.
 */
export interface Captura {
  /** Nombre del archivo dentro de src/assets/producto/, por ejemplo causas.png */
  archivo: string;
  alt: string;
  titulo: string;
  detalle: string;
}

export const producto: {
  eyebrow: string;
  title: string;
  titleTail: string;
  lead: string;
  capturas: Captura[];
  ingresar: string;
  nota: string;
} = {
  eyebrow: 'El producto',
  title: 'Así se ve',
  titleTail: 'por dentro.',
  lead:
    'Kupera opera en app.kupera.cl. Cada estudio entra con sus credenciales y trabaja sus causas, ' +
    'sus documentos y los borradores del agente desde un mismo panel.',
  capturas: [],
  ingresar: 'Ingresar a la plataforma',
  nota: 'Capturas del panel con datos de ejemplo.',
};

export interface Miembro {
  nombre: string;
  cargo: string;
  linea: string;
  iniciales: string;
  linkedin: string | null;
  /** Nombre del archivo dentro de src/assets/equipo/, o null para mostrar las iniciales. */
  foto: string | null;
}

export const equipo: {
  eyebrow: string;
  title: string;
  titleTail: string;
  lead: string;
  miembros: Miembro[];
  perfil: string;
} = {
  eyebrow: 'Equipo',
  title: 'Quién está',
  titleTail: 'detrás de Kupera.',
  lead: 'Las personas que responden por Kupera, con sus perfiles públicos.',
  miembros: [
    {
      nombre: 'Cristóbal Oyanedel',
      cargo: 'Fundador y CEO',
      linea: 'Lidera la estrategia de producto y la dirección de la compañía.',
      iniciales: 'CO',
      linkedin: 'https://www.linkedin.com/in/crist%C3%B3bal-oyanedel-1464121b3/',
      foto: null,
    },
  ],
  perfil: 'Perfil en LinkedIn',
};

/**
 * Preguntas frecuentes. Formato pregunta-respuesta porque es el que mejor
 * extraen los buscadores y los asistentes de IA, y porque son las dudas reales
 * de un abogado antes de delegar trámite. Cada respuesta parte con la respuesta
 * directa y recién después explica. Todo sale de la especificación legal.
 */
export const faq = {
  eyebrow: 'Preguntas frecuentes',
  title: 'Lo que pregunta',
  titleTail: 'todo estudio antes de partir.',
  items: [
    {
      pregunta: '¿Qué es Kupera?',
      respuesta:
        'Kupera es un agente de cobranza judicial automotriz por pagaré para estudios jurídicos en Chile. Lee el lote que asigna la financiera, valida los documentos, interpreta cada resolución del tribunal y redacta de principio a fin el escrito que corresponde. El abogado aprueba, corrige o descarta, y firma.',
    },
    {
      pregunta: '¿Qué pasa si el deudor opone excepciones?',
      respuesta:
        'El agente lee el escrito de excepciones, propone la defensa y deja el borrador de respuesta armado, con el plazo en cuenta regresiva. Tú decides si esa es la defensa, la corriges o la descartas. Nunca se presenta sin tu aprobación: el criterio jurídico y la firma siguen siendo del abogado.',
    },
    {
      pregunta: '¿Qué hace solo y qué necesita aprobación?',
      respuesta:
        'Ejecuta solo lo que no tiene criterio jurídico: descomprimir el lote, validar los cuatro documentos mandatorios, leer el contenido de las actuaciones del PJUD y consultar la inscripción en el Registro Civil. Redacta por ti todos los escritos, incluida la respuesta a la defensa del deudor. Y nunca presenta nada en el PJUD sin tu aprobación.',
    },
    {
      pregunta: '¿Qué documentos necesita para preparar una demanda?',
      respuesta:
        'Los cuatro documentos mandatorios: el pagaré, el CAV inicial, la tabla de desarrollo o el prepago, y el mandato de la financiera. Si falta uno, la demanda queda marcada como documentación incompleta y no avanza.',
    },
    {
      pregunta: '¿Cuándo queda realmente inscrito un embargo de vehículo?',
      respuesta:
        'Cuando el Registro Civil marca la inscripción como aceptada. El comprobante de ingreso que el receptor sube al PJUD solo arranca el reloj de aproximadamente un mes: tratarlo como embargo terminado es el error que deja causas sin inscribir.',
    },
    {
      pregunta: '¿Cómo se maneja la clave del PJUD del estudio?',
      respuesta:
        'Con consentimiento firmado del abogado antes de operar, y trazabilidad de cada acción, conforme a la Ley 21.719. El manejo de sesión es conservador: ante un error de acceso el agente se detiene y alerta, nunca reintenta en bucle.',
    },
    {
      pregunta: '¿Kupera reemplaza al estudio jurídico?',
      respuesta:
        'No. Kupera redacta el trámite para que el estudio lleve más causas sin perder control, pero no decide por él. El criterio legal, la firma y la relación con la financiera siguen siendo del estudio.',
    },
  ],
} as const;

export const cta = {
  eyebrow: 'Conversemos',
  title: 'Trae una causa real',
  titleTail: 'y la recorremos juntos.',
  lead:
    'Kupera opera hoy con estudios de cobranza automotriz por pagaré. Si trabajas esa cartera, ' +
    'agenda una demo y recorremos tu flujo con tus propios documentos.',
  demo: {
    titulo: 'Agenda una demo',
    detalle:
      'Media hora. Recorremos el flujo con tus documentos y te decimos con franqueza qué parte ' +
      'del trámite puede ejecutar el agente en tu estudio.',
    boton: 'Escríbenos para agendar',
    asunto: 'Demo de Kupera',
  },
  clientes: {
    titulo: '¿Tu estudio ya trabaja con Kupera?',
    detalle: 'Ingresa a tu panel para revisar tus causas, los borradores del agente y los plazos en curso.',
    boton: 'Ingresar a la plataforma',
  },
} as const;

export const footer = {
  columnas: [
    {
      titulo: 'Producto',
      links: [
        { href: '#procurador', label: 'El procurador' },
        { href: '#causa', label: 'Causa de ejemplo' },
        { href: '#flujo', label: 'Plazos y relojes' },
        { href: '#autonomia', label: 'Matriz de autonomía' },
      ],
    },
    {
      titulo: 'Empresa',
      links: [
        { href: '#preguntas', label: 'Preguntas frecuentes' },
        { href: '#equipo', label: 'Equipo' },
        { href: '#contacto', label: 'Contacto' },
        { href: empresa.app, label: 'Ingresar a la plataforma' },
      ],
    },
  ],
  razonSocial: 'Razón social',
  rut: 'RUT',
  domicilio: 'Domicilio',
  contacto: 'Contacto',
  ventureAntes: 'Kupera es una empresa de',
  nota: 'Tratamiento de datos conforme a la Ley 21.719. Consentimiento firmado antes de operar con claves del estudio.',
  copyright: `© ${new Date().getFullYear()} ${empresa.nombre}`,
} as const;
