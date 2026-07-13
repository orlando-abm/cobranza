import type {
  Causa, UrgentItem, BatchMetric, RecentItem,
  ReviewItem, Receptor, FinancieraPauta, MandamientoReview, HumanTask,
  Demanda, IngestStep, Reminder, CausaNote,
} from '../types';

// FB-06 · "Hoy" fijo del mundo mock (la cartera vive en julio 2026).
export const TODAY = '2026-07-08';

/** Devuelve una fecha 'YYYY-MM-DD' desplazada n días desde TODAY. */
export function daysFromToday(n: number): string {
  const d = new Date(`${TODAY}T00:00:00`);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export const pulse = [
  { b: '47 h', t: 'ahorradas este mes' },
  { b: '23', t: 'causas notificadas' },
  { b: '12', t: 'embargos inscritos' },
  { b: '150', t: 'demandas listas' },
  { b: '3', t: 'plazos vencen hoy', alert: true },
];

export const causas: Causa[] = [
  {
    id: '884-201',
    credito: 'CRÉD·884-201',
    parties: 'Pérez con Tanner',
    detail: 'Persona natural · Santiago · con aval',
    financiera: 'Tanner',
    stage: 'Notificación',
    clock: { label: 'Traslado 2 d', tone: 'red', icon: 'clock' },
    rol: 'E-1234-2026',
    tribunal: '2º Juzgado Civil Stgo',
    receptor: 'M. Contreras',
    monto: '$10.895.269',
    intentos: '1 de 2',
    rut: '12.345.678-9',
    patente: 'LKTR-42',
    milestones: [
      { label: 'Demanda presentada', pct: '5%', state: 'done' },
      { label: 'Notificación efectiva', pct: '10%', state: 'active' },
      { label: 'Embargo inscrito', pct: '15%', state: 'wait' },
    ],
    apremio: {
      badge: 'traslado 2 días',
      timeline: [
        { title: 'Requerimiento de pago', detail: 'Estampado 12/06 · arrancó reloj de 8 días', state: 'done' },
        { title: 'Excepciones opuestas', detail: 'El deudor opuso excepciones. Marqué la causa como “con excepciones” para el informe a la financiera.', state: 'done' },
        { title: 'Traslado — quedan 2 días', detail: 'El tribunal dio traslado. La respuesta la redactas y decides tú (línea roja). El embargo sigue en paralelo, no se bloquea.', state: 'pending' },
      ],
    },
    chat: [
      {
        id: 'm1', role: 'agent', time: 'Hace 12 min',
        text: 'Leí el estampado que subió el receptor. Es una **notificación efectiva**: notificó a Juan Pérez en Los Sables 1111, Maipú. El nombre calza con el deudor de la causa, así que es válida.',
        doc: 'Estampado del receptor.pdf',
      },
      {
        id: 'm2', role: 'agent', time: 'Hace 12 min',
        text: '',
        proposal: {
          tag: 'Listo para avanzar',
          text: 'La notificación es efectiva. Ya verifiqué las pre-validaciones: el tribunal **no exige CAV previo**, la notificación no fue por exhorto y el **propietario del CAV es el deudor** (no está transferido). Puedo escribirle al receptor con el rol, tribunal, partes y la patente a embargar. **¿Lo encargo?**',
          primaryLabel: 'Sí, encarga el embargo',
          secondaryLabel: 'Ver borrador del mail',
          flow: 'encargar-embargo',
        },
      },
    ],
    docs: [
      { name: 'Demanda ejecutiva.pdf', type: 'Demanda', date: '02/05/2026', cuaderno: 'Principal' },
      { name: 'Pagaré protestado.pdf', type: 'Título ejecutivo', date: '02/05/2026', cuaderno: 'Principal' },
      { name: 'Estampado del receptor.pdf', type: 'Notificación', date: '10/06/2026', cuaderno: 'Principal' },
      { name: 'Requerimiento de pago.pdf', type: 'Requerimiento', date: '12/06/2026', cuaderno: 'Apremio' },
    ],
    billing: [
      { label: 'Demanda presentada', pct: 5, date: '02/05/2026', doc: 'Cargo de ingreso OJV', billed: true },
      { label: 'Notificación efectiva', pct: 10, date: '10/06/2026', doc: 'Estampado del receptor', billed: false },
      { label: 'Embargo inscrito', pct: 15, billed: false },
    ],
  },
  {
    id: '773-119',
    credito: 'CRÉD·773-119',
    parties: 'González con Tanner',
    detail: 'Sociedad · Santiago · rep. legal + aval',
    financiera: 'Tanner',
    stage: 'Notificación',
    clock: { label: 'Excepciones 4 d', tone: 'amber', icon: 'clock' },
    rol: 'E-0912-2026',
    tribunal: '5º Juzgado Civil Stgo',
    receptor: 'P. Rivas',
    monto: '$18.230.000',
    intentos: '1 de 2',
    rut: '76.111.222-3',
    patente: 'BXGZ-17',
    milestones: [
      { label: 'Demanda presentada', pct: '5%', state: 'done' },
      { label: 'Notificación efectiva', pct: '10%', state: 'active' },
      { label: 'Embargo inscrito', pct: '15%', state: 'wait' },
    ],
    apremio: {
      badge: '4 días',
      timeline: [
        { title: 'Requerimiento de pago', detail: 'Estampado 09/06 · reloj de 8 días', state: 'done' },
        { title: 'Excepciones — quedan 4 días', detail: 'Vigilando el cuaderno de apremio. Si expira sin oposición, genero el certificado de rebeldía.', state: 'pending' },
      ],
    },
    chat: [
      {
        id: 'm1', role: 'agent', time: 'Hace 1 h',
        text: 'Notificación efectiva validada contra el rep. legal de la sociedad. Estoy **vigilando el plazo de excepciones** en el cuaderno de apremio: quedan 4 días.',
      },
      {
        id: 'm2', role: 'agent', time: 'Hace 1 h',
        text: '',
        proposal: {
          tag: 'Vigilando',
          text: 'Si el plazo expira sin oposición, puedo generar el **certificado de rebeldía** automáticamente y seguir con el embargo. ¿Lo dejo programado?',
          primaryLabel: 'Sí, déjalo programado',
          secondaryLabel: 'Ver cuaderno de apremio',
          flow: 'programar-rebeldia',
        },
      },
    ],
    docs: [
      { name: 'Demanda ejecutiva.pdf', type: 'Demanda', date: '28/04/2026', cuaderno: 'Principal' },
      { name: 'Pagaré protestado.pdf', type: 'Título ejecutivo', date: '28/04/2026', cuaderno: 'Principal' },
      { name: 'Requerimiento de pago.pdf', type: 'Requerimiento', date: '09/06/2026', cuaderno: 'Apremio' },
    ],
    billing: [
      { label: 'Demanda presentada', pct: 5, date: '28/04/2026', doc: 'Cargo de ingreso OJV', billed: true },
      { label: 'Notificación efectiva', pct: 10, date: '09/06/2026', doc: 'Estampado del receptor', billed: false },
      { label: 'Embargo inscrito', pct: 15, billed: false },
    ],
  },
  {
    id: '902-556',
    credito: 'CRÉD·902-556',
    parties: 'Soto con OLX',
    detail: 'Persona natural · Santiago · sin aval',
    financiera: 'OLX',
    stage: 'Embargo',
    clock: { label: 'CAV 18/30 d', tone: 'calm', icon: 'clock' },
    rol: 'E-0778-2026',
    tribunal: '11º Juzgado Civil Stgo',
    receptor: 'M. Contreras',
    monto: '$7.450.000',
    intentos: '2 de 5',
    rut: '15.987.654-3',
    patente: 'JKLM-88',
    milestones: [
      { label: 'Notificación efectiva', pct: '10%', state: 'done' },
      { label: 'Embargo encargado', pct: '12%', state: 'done' },
      { label: 'Inscripción Registro Civil', pct: '15%', state: 'active' },
    ],
    apremio: {
      badge: 'sin plazo activo',
      timeline: [
        { title: 'Embargo trabado', detail: 'Acta de embargo ingresada 18/06', state: 'done' },
        { title: 'Inscripción en Registro Civil', detail: 'Consulto por patente desde el día 25. Día 18 de 30.', state: 'pending' },
      ],
    },
    inscripcion: { day: 18, status: 'tramite' },
    chat: [
      {
        id: 'm1', role: 'agent', time: 'Ayer',
        text: 'Embargo trabado sobre la patente **JKLM-88**. El **comprobante de ingreso** al Registro Civil arrancó el reloj de 30 días — ojo, todavía **no** es inscripción. El gatillante real es la **“inscripción aceptada”**, que consulto por patente desde el día 25 (hoy, día 18/30).',
        doc: 'Acta de embargo.pdf',
      },
      {
        id: 'm2', role: 'agent', time: 'Ayer',
        text: '',
        proposal: {
          tag: 'Vigilando',
          text: 'Cuando el Registro Civil confirme la inscripción, aviso al abogado, mando el mail a la financiera y genero el informe de embargos del período. **¿Dejo la cadena automática activa?**',
          primaryLabel: 'Sí, activá la cadena',
          secondaryLabel: 'Ver política CAV',
          flow: 'cadena-registro',
        },
      },
    ],
    docs: [
      { name: 'Demanda ejecutiva.pdf', type: 'Demanda', date: '10/04/2026', cuaderno: 'Principal' },
      { name: 'Acta de embargo.pdf', type: 'Embargo', date: '18/06/2026', cuaderno: 'Apremio' },
      { name: 'CAV.pdf', type: 'CAV', date: '10/04/2026', cuaderno: 'Principal' },
    ],
    billing: [
      { label: 'Demanda presentada', pct: 5, date: '10/04/2026', doc: 'Cargo de ingreso OJV', billed: true },
      { label: 'Notificación efectiva', pct: 10, date: '20/05/2026', doc: 'Estampado del receptor', billed: true },
      { label: 'Embargo inscrito', pct: 15, billed: false },
    ],
  },
  {
    id: '645-233',
    credito: 'CRÉD·645-233',
    parties: 'Rojas con OLX',
    detail: 'Persona natural · Región · Temuco',
    financiera: 'OLX',
    stage: 'Rechazo',
    clock: { label: 'Reposición 5 d', tone: 'red', icon: 'clock' },
    rol: 'E-0455-2026',
    tribunal: '1º Juzgado Civil Temuco',
    receptor: 'L. Fuentes',
    monto: '$5.120.000',
    intentos: '0 de 5',
    rut: '17.222.333-4',
    milestones: [
      { label: 'Demanda presentada', pct: '5%', state: 'done' },
      { label: 'Resolución del tribunal', pct: '—', state: 'active' },
      { label: 'Notificación efectiva', pct: '10%', state: 'wait' },
    ],
    apremio: {
      badge: 'sin plazo activo',
      timeline: [
        { title: 'Demanda presentada', detail: 'Ingresada 05/06', state: 'done' },
        { title: 'Rechazo del tribunal', detail: 'Corre plazo de reposición: 5 días. Requiere decisión humana.', state: 'pending' },
      ],
    },
    chat: [
      {
        id: 'm1', role: 'agent', time: 'Hace 3 h',
        text: 'El tribunal **rechazó** la demanda por un defecto de forma en el domicilio del deudor. Corre el plazo de **reposición: 5 días**. Esto lo decides tú.',
        doc: 'Resolución de rechazo.pdf',
      },
      {
        id: 'm2', role: 'agent', time: 'Hace 3 h',
        text: '',
        proposal: {
          tag: 'Solo humano',
          text: 'Si me confirmas que vas con la reposición, te preparo el **borrador del recurso** corrigiendo el domicilio con los datos del CAV. **¿Preparo el borrador?**',
          primaryLabel: 'Sí, preparalo',
          secondaryLabel: 'Ver resolución',
          flow: 'borrador-reposicion',
        },
      },
    ],
    docs: [
      { name: 'Demanda ejecutiva.pdf', type: 'Demanda', date: '05/06/2026', cuaderno: 'Principal' },
      { name: 'Resolución de rechazo.pdf', type: 'Resolución', date: '28/06/2026', cuaderno: 'Principal' },
    ],
    billing: [
      { label: 'Demanda presentada', pct: 5, date: '05/06/2026', doc: 'Cargo de ingreso OJV', billed: false },
    ],
  },
  {
    id: '118-907',
    credito: 'CRÉD·118-907',
    parties: 'Muñoz con Tanner',
    detail: 'Persona natural · Santiago · con aval',
    financiera: 'Tanner',
    stage: 'Embargo',
    clock: { label: 'Inscrito', tone: 'green', icon: 'check' },
    rol: 'E-0456-2026',
    tribunal: '3º Juzgado Civil Stgo',
    receptor: 'P. Rivas',
    monto: '$12.000.000',
    intentos: '1 de 2',
    rut: '13.444.555-6',
    patente: 'PRDX-09',
    milestones: [
      { label: 'Notificación efectiva', pct: '10%', state: 'done' },
      { label: 'Embargo trabado', pct: '12%', state: 'done' },
      { label: 'Embargo inscrito', pct: '15%', state: 'done' },
    ],
    apremio: {
      badge: 'completado',
      timeline: [
        { title: 'Embargo trabado', detail: 'Acta ingresada 20/05', state: 'done' },
        { title: 'Inscripción confirmada', detail: 'Registro Civil aceptó la inscripción. Mail a financiera enviado.', state: 'done' },
      ],
    },
    inscripcion: { day: 30, status: 'aceptada' },
    chat: [
      {
        id: 'm1', role: 'agent', time: 'Hace 5 h',
        text: 'El Registro Civil marcó **“inscripción aceptada”** para el embargo sobre la patente PRDX-09 (el gatillante real, no el comprobante de ingreso). Ya avisé al abogado y mandé el mail a la financiera con el certificado.',
        doc: 'Inscripción aceptada · Registro Civil.pdf',
      },
    ],
    docs: [
      { name: 'Acta de embargo.pdf', type: 'Embargo', date: '20/05/2026', cuaderno: 'Apremio' },
      { name: 'Inscripción aceptada · Registro Civil.pdf', type: 'Inscripción aceptada', date: '01/07/2026', cuaderno: 'Apremio' },
    ],
    billing: [
      { label: 'Demanda presentada', pct: 5, date: '01/03/2026', doc: 'Cargo de ingreso OJV', billed: true },
      { label: 'Notificación efectiva', pct: 10, date: '15/04/2026', doc: 'Estampado del receptor', billed: true },
      { label: 'Embargo inscrito', pct: 15, date: '01/07/2026', doc: 'Inscripción aceptada (RC)', billed: true },
    ],
  },
  {
    id: '450-118',
    credito: 'CRÉD·450-118',
    parties: 'Díaz con OLX',
    detail: 'Persona natural · Santiago · sin aval',
    financiera: 'OLX',
    stage: 'Demanda',
    clock: { label: 'En admisibilidad', tone: 'calm', icon: 'spinner' },
    rol: 'En trámite de ingreso',
    tribunal: 'Por distribuir',
    receptor: '—',
    monto: '$3.980.000',
    intentos: '0 de 5',
    rut: '18.333.444-5',
    milestones: [
      { label: 'Demanda redactada', pct: '—', state: 'done' },
      { label: 'Ingreso OJV', pct: '5%', state: 'active' },
      { label: 'Notificación efectiva', pct: '10%', state: 'wait' },
    ],
    apremio: {
      badge: 'sin plazo activo',
      timeline: [
        { title: 'Demanda redactada', detail: 'Plantilla GLOBAL persona natural sin aval', state: 'done' },
        { title: 'En admisibilidad', detail: 'Esperando distribución de causa y rol.', state: 'pending' },
      ],
    },
    chat: [
      {
        id: 'm1', role: 'agent', time: 'Hoy',
        text: 'La demanda está **redactada y firmada**, lista para ingresar a la OJV. Uso la plantilla GLOBAL de persona natural sin aval. El submit a la OJV lo haces tú por ahora (v1).',
        doc: 'Demanda ejecutiva.pdf',
      },
      {
        id: 'm2', role: 'agent', time: 'Hoy',
        text: '',
        proposal: {
          tag: 'Listo para avanzar',
          text: 'Puedo dejar la demanda **lista para presentar por PJUD** y arrancar el reloj de admisibilidad apenas la marques como presentada. **¿La preparo?**',
          primaryLabel: 'Sí, prepará la demanda',
          secondaryLabel: 'Ver borrador de la demanda',
          flow: 'cola-firmas',
        },
      },
    ],
    docs: [
      { name: 'Demanda ejecutiva.pdf', type: 'Demanda', date: '06/07/2026', cuaderno: 'Principal' },
      { name: 'Pagaré protestado.pdf', type: 'Título ejecutivo', date: '06/07/2026', cuaderno: 'Principal' },
    ],
    billing: [
      { label: 'Demanda presentada', pct: 5, billed: false },
    ],
  },
];

export const urgentItems: UrgentItem[] = [
  {
    id: 'u1', days: '2 días', tone: 'red', type: 'Traslado', rol: 'Rol E-1234-2026 · Tanner',
    parties: 'Pérez con Tanner', pill: { label: 'Solo humano', icon: 'alert' },
    text: 'El tribunal dio traslado a las excepciones. Esto lo decides y redactas tú — te dejé el escrito del deudor listo para revisar.',
    causaId: '884-201', secondaryLabel: 'Ver escrito del deudor',
  },
  {
    id: 'u2', days: '4 días', tone: 'amber', type: 'Requerimiento — excepciones', rol: 'Rol E-0912-2026 · Tanner',
    parties: 'González con Tanner', pill: { label: 'Vigilando', icon: 'check' },
    text: 'Corre el plazo de excepciones en el cuaderno de apremio. Si expira sin oposición, genero el certificado de rebeldía yo mismo.',
    causaId: '773-119',
  },
  {
    id: 'u3', days: '5 días', tone: 'amber', type: 'Reposición', rol: 'Rol E-0455-2026 · OLX',
    parties: 'Rojas con OLX', pill: { label: 'Solo humano', icon: 'alert' },
    text: 'Rechazo del tribunal. Evaluá recurso de reposición — te preparo el borrador si me confirmas que vas.',
    causaId: '645-233', secondaryLabel: 'Ver resolución',
  },
];

export const batchMetrics: BatchMetric[] = [
  {
    id: 'b1', num: 8, flow: 'embargos',
    title: 'Notificaciones efectivas sin embargo encargado',
    sub: 'Puedo encargar 5 ahora. 3 requieren revisión previa (CAV del tribunal, retorno de exhorto, vehículo transferido)',
    items: [
      { label: 'CRÉD·884-201 · Pérez con Tanner · M. Contreras · propietario = deudor', causaId: '884-201' },
      { label: 'CRÉD·991-042 · Vega con Tanner · P. Rivas · sin CAV previo exigido' },
      { label: 'CRÉD·773-556 · Lara con OLX · M. Contreras' },
      { label: 'CRÉD·305-771 · Morales con Tanner · P. Rivas' },
      { label: 'CRÉD·812-334 · Castro con Tanner · P. Rivas' },
      { label: 'CRÉD·640-903 · Reyes con OLX · M. Contreras', blocked: 'El tribunal exige CAV del mes antes de embargar — lo pido primero' },
      { label: 'CRÉD·220-118 · Fuentes con OLX · La Araucanía', blocked: 'Notificada por exhorto (región): espero el retorno del exhorto' },
      { label: 'CRÉD·118-500 · Vargas con OLX · L. Fuentes', blocked: 'CAV: vehículo transferido a un tercero — decisión humana' },
    ],
  },
  {
    id: 'b2', num: 10, flow: 'registro',
    title: 'Inscripciones que cumplieron el plazo de consulta',
    sub: 'De 200 embargos con comprobante ingresado, 10 ya cumplieron 25 días. Consulto la “inscripción aceptada” en lote; las que aún no salen las reintento en 5 días',
    items: [
      { label: 'CRÉD·902-556 · Soto con OLX · día 26/30', causaId: '902-556', outcome: 'ok' },
      { label: 'CRÉD·445-921 · Núñez con Tanner · día 27/30', outcome: 'ok' },
      { label: 'CRÉD·771-330 · Bravo con OLX · día 28/30', outcome: 'ok' },
      { label: 'CRÉD·640-903 · Reyes con OLX · día 25/30', outcome: 'ok' },
      { label: 'CRÉD·812-334 · Castro con Tanner · día 29/30', outcome: 'ok' },
      { label: 'CRÉD·220-118 · Fuentes con OLX · día 26/30', outcome: 'ok' },
      { label: 'CRÉD·991-042 · Vega con Tanner · día 30/30', outcome: 'ok' },
      { label: 'CRÉD·305-119 · Herrera con OLX · día 25/30', outcome: 'retry' },
      { label: 'CRÉD·118-500 · Vargas con OLX · día 25/30', outcome: 'retry' },
      { label: 'CRÉD·773-556 · Lara con OLX · día 26/30', outcome: 'retry' },
    ],
  },
];

export const recentItems: RecentItem[] = [
  { id: 'r1', title: 'Lote Tanner · 147 causas promovidas', sub: 'Hace 2 h · 132 validadas, 15 en revisión' },
  { id: 'r2', title: 'Embargo inscrito · Rol E-0456', sub: 'Hace 5 h · Mail a financiera enviado' },
  { id: 'r3', title: 'Notificación efectiva · Rol E-0847', sub: 'Ayer · Embargo encargado a receptor' },
];

export const reviewItems: ReviewItem[] = [
  {
    id: 'rv1', causa: '450-118',
    fields: [
      { key: 'RUT deudor', value: '18.333.444-5', confidence: 78 },
      { key: 'Monto pagaré', value: '$3.980.000', confidence: 94 },
      { key: 'Nombre deudor', value: 'Carla Díaz Soto', confidence: 88 },
    ],
  },
  {
    id: 'rv2', causa: '305-771',
    fields: [
      { key: 'Monto pagaré', value: '$6.210.000', confidence: 71 },
      { key: 'Patente CAV', value: 'FGHJ-21', confidence: 90 },
      { key: 'Nombre aval', value: 'Pedro Morales L.', confidence: 82 },
    ],
  },
  {
    id: 'rv3', causa: '640-903',
    fields: [
      { key: 'Patente CAV', value: 'KLPQ-55', confidence: 66 },
      { key: 'RUT deudor', value: '16.777.888-9', confidence: 91 },
      { key: 'Propietario CAV', value: 'Reyes Ltda.', confidence: 74 },
    ],
  },
  { id: 'rv4', causa: '991-042', fields: [{ key: 'RUT deudor', value: '14.222.333-4', confidence: 68 }, { key: 'Monto pagaré', value: '$5.400.000', confidence: 92 }] },
  { id: 'rv5', causa: '812-334', fields: [{ key: 'Nombre deudor', value: 'María Castro R.', confidence: 79 }, { key: 'Patente CAV', value: 'ABCD-12', confidence: 73 }] },
  { id: 'rv6', causa: '220-118', fields: [{ key: 'Monto pagaré', value: '$9.100.000', confidence: 64 }, { key: 'RUT deudor', value: '17.888.999-0', confidence: 88 }] },
  { id: 'rv7', causa: '771-330', fields: [{ key: 'Propietario CAV', value: 'Bravo SpA', confidence: 72 }, { key: 'Patente CAV', value: 'GHFD-77', confidence: 81 }] },
  { id: 'rv8', causa: '445-921', fields: [{ key: 'RUT deudor', value: '19.111.222-3', confidence: 69 }, { key: 'Nombre aval', value: 'Luis Núñez P.', confidence: 86 }] },
  { id: 'rv9', causa: '118-500', fields: [{ key: 'Monto pagaré', value: '$4.750.000', confidence: 77 }, { key: 'Patente CAV', value: 'VARG-09', confidence: 65 }] },
  { id: 'rv10', causa: '640-221', fields: [{ key: 'Nombre deudor', value: 'Patricia Mora S.', confidence: 70 }, { key: 'RUT deudor', value: '16.555.666-7', confidence: 83 }] },
];

export const mandamientos: MandamientoReview[] = [
  {
    id: 'md1', causa: '884-201', parties: 'Pérez con Tanner', financiera: 'Tanner', status: 'ok',
    fields: [
      { key: 'Nombre demandado', demanda: 'Juan Pérez González', mandamiento: 'Juan Pérez González', match: true },
      { key: 'RUT', demanda: '12.345.678-9', mandamiento: '12.345.678-9', match: true },
      { key: 'Monto', demanda: '$10.895.269', mandamiento: '$10.895.269', match: true },
      { key: 'Financiera', demanda: 'Tanner', mandamiento: 'Tanner', match: true },
      { key: 'Aval', demanda: 'María Pérez S.', mandamiento: 'María Pérez S.', match: true },
    ],
  },
  {
    id: 'md2', causa: '773-119', parties: 'González con Tanner', financiera: 'Tanner', status: 'ok',
    fields: [
      { key: 'Sociedad demandada', demanda: 'Comercial González Ltda.', mandamiento: 'Comercial González Ltda.', match: true },
      { key: 'RUT', demanda: '76.111.222-3', mandamiento: '76.111.222-3', match: true },
      { key: 'Representante legal', demanda: 'Pedro González R.', mandamiento: 'Pedro González R.', match: true },
      { key: 'Aval', demanda: 'Pedro González R.', mandamiento: 'Pedro González R.', match: true },
      { key: 'Monto', demanda: '$18.230.000', mandamiento: '$18.230.000', match: true },
    ],
  },
  {
    id: 'md3', causa: '118-907', parties: 'Muñoz con Tanner', financiera: 'Tanner', status: 'ok',
    fields: [
      { key: 'Nombre demandado', demanda: 'Rodrigo Muñoz Vera', mandamiento: 'Rodrigo Muñoz Vera', match: true },
      { key: 'RUT', demanda: '13.444.555-6', mandamiento: '13.444.555-6', match: true },
      { key: 'Monto', demanda: '$12.000.000', mandamiento: '$12.000.000', match: true },
      { key: 'Financiera', demanda: 'Tanner', mandamiento: 'Tanner', match: true },
    ],
  },
  {
    id: 'md4', causa: '450-118', parties: 'Díaz con OLX', financiera: 'OLX', status: 'diff',
    fields: [
      { key: 'Nombre demandado', demanda: 'Carla Díaz Soto', mandamiento: 'Carla Díaz Soto', match: true },
      { key: 'RUT', demanda: '18.333.444-5', mandamiento: '18.333.444-5', match: true },
      { key: 'Monto', demanda: '$3.980.000', mandamiento: '$398.000', match: false },
      { key: 'Financiera', demanda: 'OLX', mandamiento: 'OLX', match: true },
    ],
  },
  {
    id: 'md5', causa: '902-556', parties: 'Soto con OLX', financiera: 'OLX', status: 'diff',
    fields: [
      { key: 'Nombre demandado', demanda: 'Ana Soto Rivas', mandamiento: 'Ana Soto', match: false },
      { key: 'RUT', demanda: '15.987.654-3', mandamiento: '15.987.654-3', match: true },
      { key: 'Monto', demanda: '$7.450.000', mandamiento: '$7.450.000', match: true },
      { key: 'Financiera', demanda: 'OLX', mandamiento: 'OLX', match: true },
    ],
  },
  {
    id: 'md6', causa: '305-771', parties: 'Morales con Tanner', financiera: 'Tanner', status: 'diff',
    fields: [
      { key: 'Nombre demandado', demanda: 'Pedro Morales L.', mandamiento: 'Pedro Morales', match: false },
      { key: 'RUT', demanda: '14.888.777-6', mandamiento: '14.888.777-6', match: true },
      { key: 'Monto', demanda: '$6.210.000', mandamiento: '$621.000', match: false },
      { key: 'Financiera', demanda: 'Tanner', mandamiento: 'Tanner', match: true },
    ],
  },
  {
    id: 'md7', causa: '640-903', parties: 'Reyes con OLX', financiera: 'OLX', status: 'diff',
    fields: [
      { key: 'Nombre demandado', demanda: 'Carlos Reyes M.', mandamiento: 'Carlos Reyes M.', match: true },
      { key: 'RUT', demanda: '16.777.888-9', mandamiento: '16.777.888-8', match: false },
      { key: 'Monto', demanda: '$8.900.000', mandamiento: '$8.900.000', match: true },
    ],
  },
  {
    id: 'md8', causa: '991-042', parties: 'Vega con Tanner', financiera: 'Tanner', status: 'diff', resolved: true,
    fields: [
      { key: 'Nombre demandado', demanda: 'Laura Vega P.', mandamiento: 'Laura Vega', match: false },
      { key: 'Monto', demanda: '$5.400.000', mandamiento: '$5.400.000', match: true },
    ],
  },
  {
    id: 'md9', causa: '812-334', parties: 'Castro con Tanner', financiera: 'Tanner', status: 'diff',
    fields: [
      { key: 'Aval', demanda: 'María Castro R.', mandamiento: 'María Castro', match: false },
      { key: 'Monto', demanda: '$11.200.000', mandamiento: '$11.200.000', match: true },
    ],
  },
  {
    id: 'md10', causa: '220-118', parties: 'Fuentes con OLX', financiera: 'OLX', status: 'diff',
    fields: [
      { key: 'Nombre demandado', demanda: 'Ana Fuentes G.', mandamiento: 'Ana Fuentes G.', match: true },
      { key: 'Financiera', demanda: 'OLX', mandamiento: 'O.L.X.', match: false },
    ],
  },
  {
    id: 'md11', causa: '771-330', parties: 'Bravo con OLX', financiera: 'OLX', status: 'diff',
    fields: [
      { key: 'Monto', demanda: '$9.800.000', mandamiento: '$980.000', match: false },
      { key: 'RUT', demanda: '18.444.555-6', mandamiento: '18.444.555-6', match: true },
    ],
  },
  {
    id: 'md12', causa: '445-921', parties: 'Núñez con Tanner', financiera: 'Tanner', status: 'diff', resolved: true,
    fields: [
      { key: 'Nombre demandado', demanda: 'Luis Núñez P.', mandamiento: 'Luis Núñez', match: false },
      { key: 'Monto', demanda: '$4.200.000', mandamiento: '$4.200.000', match: true },
    ],
  },
];

export const humanTasks: HumanTask[] = [
  {
    id: 'ht1', causa: '884-201', parties: 'Pérez con Tanner', kind: 'Responder traslado de excepciones',
    stage: 'Apremio · excepciones', deadline: '2 días',
    detail: 'El tribunal dio traslado a las excepciones. La respuesta la decides y redactas tú — dejé el escrito del deudor listo para revisar.',
  },
  {
    id: 'ht2', causa: '645-233', parties: 'Rojas con OLX', kind: 'Recurso de reposición',
    stage: 'Demanda · rechazo', deadline: '5 días',
    detail: 'El tribunal rechazó la demanda por defecto de forma en el domicilio. Evalúa la reposición — te preparo el borrador con los datos del CAV si me confirmas.',
  },
  {
    id: 'ht3', causa: '773-119', parties: 'González con Tanner', kind: 'Evaluar excepción de incompetencia',
    stage: 'Apremio · excepciones', deadline: '4 días',
    detail: 'El deudor opuso excepción de incompetencia. Revisa el escrito y decide si contestas o solicitas traslado especial.',
  },
  {
    id: 'ht4', causa: '305-771', parties: 'Morales con Tanner', kind: 'Responder traslado de excepciones',
    stage: 'Apremio · excepciones', deadline: '3 días',
    detail: 'Traslado de excepciones de pago. Te dejé el borrador de contestación con los antecedentes del pagaré.',
  },
  {
    id: 'ht5', causa: '991-042', parties: 'Vega con Tanner', kind: 'Recurso de reposición',
    stage: 'Demanda · rechazo', deadline: '6 días',
    detail: 'Rechazo por falta de patrocinio. Evalúa si corresponde reposición o nueva presentación.',
  },
  {
    id: 'ht6', causa: '640-903', parties: 'Reyes con OLX', kind: 'Decidir curso progresivo',
    stage: 'Notificación · inubicable', deadline: '8 días',
    detail: 'Segundo intento fallido. La financiera OLX permite 5 intentos — ¿seguimos con nuevo domicilio o marcamos inubicable?',
  },
  {
    id: 'ht7', causa: '812-334', parties: 'Castro con Tanner', kind: 'Responder traslado de excepciones',
    stage: 'Apremio · excepciones', deadline: '1 día',
    detail: 'Plazo vence mañana. El deudor opuso excepción de prescripción parcial — revisa el escrito urgente.',
  },
  {
    id: 'ht8', causa: '220-118', parties: 'Fuentes con OLX', kind: 'Evaluar devolución de exhorto',
    stage: 'Notificación · región', deadline: '7 días',
    detail: 'Exhorto devuelto sin diligenciar. Decides si reiteras exhorto o cambias estrategia de notificación.',
    resolved: true,
  },
  {
    id: 'ht9', causa: '771-330', parties: 'Bravo con OLX', kind: 'Recurso de reposición',
    stage: 'Demanda · rechazo', deadline: '4 días',
    detail: 'Rechazo por error en el monto del pagaré. Te preparo borrador corrigiendo el monto si confirmas.',
  },
  {
    id: 'ht10', causa: '445-921', parties: 'Núñez con Tanner', kind: 'Responder traslado de excepciones',
    stage: 'Apremio · excepciones', deadline: '5 días',
    detail: 'Excepción de nulidad del pagaré. Revisa el escrito del deudor y la copia del título ejecutivo.',
    resolved: true,
  },
];

export const receptores: Receptor[] = [
  { id: 'rc1', name: 'M. Contreras', zone: 'Santiago Centro · Maipú', fee: '$45.000', performance: 92, active: true },
  { id: 'rc2', name: 'P. Rivas', zone: 'Santiago Oriente', fee: '$52.000', performance: 88, active: true },
  { id: 'rc3', name: 'L. Fuentes', zone: 'Región de La Araucanía', fee: '$60.000', performance: 79, active: true },
  { id: 'rc4', name: 'C. Herrera', zone: 'Valparaíso', fee: '$55.000', performance: 84, active: false },
];

export const financieras: FinancieraPauta[] = [
  { id: 'f1', name: 'Tanner', modalidad: 'ZIP global (Modalidad A)', intentos: 2, cavPolicy: 'Embargar solo si propietario = deudor o aval', umbral: 85, active: true },
  { id: 'f2', name: 'OLX', modalidad: 'Carpetas por deudor (Modalidad B)', intentos: 5, cavPolicy: 'Embargar solo si propietario CAV = deudor o aval; si transferido → decisión humana', umbral: 80, active: true },
  { id: 'f3', name: 'PROFIN', modalidad: 'Conector API (Modalidad C)', intentos: 3, cavPolicy: 'Pendiente de definir', umbral: 82, active: false },
];

export const semaforo = [
  { k: 'v', big: '236', lbl: 'Causas activas' },
  { k: 'g', big: '41%', lbl: 'Embargos inscritos' },
  { k: 'a', big: '5%', lbl: 'Con excepciones' },
  { k: 'r', big: '8%', lbl: 'Deudores inubicables' },
];

// Etapa 1 · Demandas: entidad previa a la causa. Solo 'revisar' (quedó mal) o 'redactada' (quedó bien).
// Al ingresar la causa se convierten en Causa y salen de este listado.
export const demandas: Demanda[] = [
  { id: 'd1', credito: 'CRÉD·220-118', parties: 'Fuentes con OLX', financiera: 'OLX', rut: '17.888.999-0', monto: '$9.100.000', status: 'revisar', revisarReason: 'incompleta', template: 'GLOBAL 1 CON EXHORTO' },
  { id: 'd2', credito: 'CRÉD·771-330', parties: 'Bravo con OLX', financiera: 'OLX', rut: '18.444.555-6', monto: '$9.800.000', status: 'revisar', revisarReason: 'transferido', template: 'GLOBAL 2 SOC CON EXHORTO' },
  { id: 'd3', credito: 'CRÉD·305-119', parties: 'Herrera con OLX', financiera: 'OLX', rut: '15.222.888-1', monto: '$7.300.000', status: 'revisar', revisarReason: 'ocr', template: 'GLOBAL 2 CON EXHORTO' },
  { id: 'd4', credito: 'CRÉD·991-042', parties: 'Vega con Tanner', financiera: 'Tanner', rut: '14.222.333-4', monto: '$5.400.000', status: 'redactada', template: 'GLOBAL 1 SIN EXHORTO' },
  { id: 'd5', credito: 'CRÉD·305-771', parties: 'Morales con Tanner', financiera: 'Tanner', rut: '14.888.777-6', monto: '$6.210.000', status: 'redactada', template: 'GLOBAL 2 SIN EXHORTO' },
  { id: 'd6', credito: 'CRÉD·640-903', parties: 'Reyes con OLX', financiera: 'OLX', rut: '16.777.888-9', monto: '$8.900.000', status: 'redactada', template: 'GLOBAL 2 CON EXHORTO' },
  { id: 'd7', credito: 'CRÉD·812-334', parties: 'Castro con Tanner', financiera: 'Tanner', rut: '13.555.111-2', monto: '$11.200.000', status: 'redactada', template: 'GLOBAL 2 SIN EXHORTO' },
  { id: 'd8', credito: 'CRÉD·445-921', parties: 'Núñez con Tanner', financiera: 'Tanner', rut: '19.111.222-3', monto: '$4.200.000', status: 'redactada', template: 'GLOBAL 1 SIN EXHORTO' },
  { id: 'd9', credito: 'CRÉD·118-500', parties: 'Vargas con OLX', financiera: 'OLX', rut: '16.555.666-7', monto: '$4.750.000', status: 'redactada', template: 'GLOBAL 1 SIN EXHORTO' },
  { id: 'd10', credito: 'CRÉD·884-660', parties: 'Tapia con Tanner', financiera: 'Tanner', rut: '12.777.333-9', monto: '$8.100.000', status: 'redactada', template: 'GLOBAL 2 SIN EXHORTO' },
];

// FB-08 · Lote que produce un ZIP recién cargado. El status es el desenlace final;
// la ingesta en vivo muestra "leyendo" hasta revelar cada fila.
export const ingestBatch: IngestStep[] = [
  { id: 'i1', doc: 'CRÉD·907-114 · Salas con Tanner', status: 'validada', detail: 'Pagaré + CAV + tabla OK · propietario = deudor' },
  { id: 'i2', doc: 'CRÉD·907-115 · Peña con Tanner', status: 'validada', detail: 'Set completo · consistencia cruzada OK' },
  { id: 'i3', doc: 'CRÉD·907-116 · Rojas con Tanner', status: 'revision', detail: 'RUT del pagaré con confianza 68% — a revisión manual', reason: 'ocr' },
  { id: 'i4', doc: 'CRÉD·907-117 · Vera con Tanner', status: 'validada', detail: 'Set completo · plantilla GLOBAL 2 con aval' },
  { id: 'i5', doc: 'CRÉD·907-118 · Cortés con Tanner', status: 'validada', detail: 'Sociedad · rep. legal ≠ aval detectado' },
  { id: 'i6', doc: 'CRÉD·907-119 · Ibáñez con Tanner', status: 'error', detail: 'Falta el CAV inicial — documentación incompleta', reason: 'incompleta' },
  { id: 'i7', doc: 'CRÉD·907-120 · Muñoz con Tanner', status: 'validada', detail: 'Set completo · región → GLOBAL con exhorto' },
  { id: 'i8', doc: 'CRÉD·907-121 · Farías con Tanner', status: 'revision', detail: 'Pagaré chueco · monto con confianza 71%', reason: 'ocr' },
  { id: 'i9', doc: 'CRÉD·907-122 · León con Tanner', status: 'validada', detail: 'Set completo · consistencia cruzada OK' },
  { id: 'i10', doc: 'CRÉD·907-123 · Pinto con Tanner', status: 'validada', detail: 'Set completo · propietario = aval' },
  { id: 'i11', doc: 'CRÉD·907-124 · Gaete con Tanner', status: 'revision', detail: 'Propietario CAV ≠ deudor — vehículo transferido', reason: 'transferido' },
  { id: 'i12', doc: 'CRÉD·907-125 · Sáez con Tanner', status: 'validada', detail: 'Set completo · plantilla GLOBAL 1' },
];

/** Formatea 'YYYY-MM-DD' a 'DD/MM/YYYY'. */
function fmt(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/** Detalle legible (persona/sociedad · jurisdicción · aval) derivado de la plantilla GLOBAL. */
function detailFromTemplate(t: string): string {
  const soc = t.includes('SOC');
  const region = t.includes('CON EXHORTO');
  const aval = t.includes('GLOBAL 2');
  return `${soc ? 'Sociedad' : 'Persona natural'} · ${region ? 'Región' : 'Santiago'} · ${aval ? (soc ? 'rep. legal + aval' : 'con aval') : 'sin aval'}`;
}

const intentosPorFinanciera: Record<string, number> = { Tanner: 2, OLX: 5, PROFIN: 3 };

/**
 * Etapa 1 · Crea la Causa al presentar la demanda en el PJUD (spec: "arranca el reloj de la causa").
 * El Rol lo ingresa el abogado al subir; hasta que el tribunal distribuye puede ir "En trámite de ingreso".
 */
export function causaFromDemanda(d: Demanda, rol: string): Causa {
  const id = d.credito.replace(/^CRÉD·/, '');
  const intentos = intentosPorFinanciera[d.financiera] ?? 2;
  const fecha = fmt(TODAY);
  return {
    id,
    credito: d.credito,
    parties: d.parties,
    detail: detailFromTemplate(d.template),
    financiera: d.financiera,
    stage: 'Demanda',
    clock: { label: 'En admisibilidad', tone: 'calm', icon: 'spinner' },
    rol,
    tribunal: 'Por distribuir',
    receptor: '—',
    monto: d.monto,
    intentos: `0 de ${intentos}`,
    rut: d.rut,
    milestones: [
      { label: 'Demanda presentada', pct: '5%', state: 'active' },
      { label: 'Notificación efectiva', pct: '10%', state: 'wait' },
      { label: 'Embargo inscrito', pct: '15%', state: 'wait' },
    ],
    apremio: {
      badge: 'sin plazo activo',
      timeline: [
        { title: 'Demanda presentada', detail: `Ingresada al PJUD el ${fecha} · Rol ${rol}`, state: 'done' },
        { title: 'En admisibilidad', detail: 'Esperando distribución y ‘despáchese’ del tribunal.', state: 'pending' },
      ],
    },
    chat: [
      {
        id: 'm1', role: 'agent', time: 'Ahora',
        text: `Presenté la demanda en el PJUD (Rol **${rol}**) con la plantilla ${d.template}. Arranca el reloj de admisibilidad; apenas el tribunal provea, valido el mandamiento campo a campo.`,
        doc: 'Demanda ejecutiva.pdf',
      },
    ],
    docs: [
      { name: 'Demanda ejecutiva.pdf', type: 'Demanda', date: fecha, cuaderno: 'Principal' },
      { name: 'Pagaré protestado.pdf', type: 'Título ejecutivo', date: fecha, cuaderno: 'Principal' },
    ],
    billing: [
      { label: 'Demanda presentada', pct: 5, date: fecha, doc: 'Cargo de ingreso OJV', billed: false },
    ],
  };
}

// FB-02 · Briefing del agente global: resumen del día del PJUD, agrupado por tipo.
export const agentBriefing = {
  total: 5,
  groups: [
    { label: 'Notificaciones efectivas', count: 2, detail: 'listas para encargar embargo' },
    { label: 'Previo a proveer', count: 1, detail: 'el tribunal pide bajar el monto' },
    { label: 'Mandamiento emitido', count: 1, detail: 'por validar campo a campo' },
    { label: 'Requerimiento estampado', count: 1, detail: 'arrancó el reloj de 8 días' },
  ],
};

// FB-02 · Plan de trabajo priorizado que propone el agente global.
export const agentPlan: { id: string; title: string; detail: string; to: string }[] = [
  { id: 'ap1', title: 'Encargar 2 embargos de notificaciones efectivas', detail: 'Pérez y González — pre-validaciones OK', to: '/causas/884-201' },
  { id: 'ap2', title: 'Pre-redactar “cumple lo ordenado” de Díaz', detail: 'La rebaja está dentro de la pauta de OLX', to: '/causas/450-118' },
  { id: 'ap3', title: 'Validar el mandamiento de Soto', detail: 'Diferencia en el nombre — preparo el “rectifíquese”', to: '/revisiones' },
];

// FB-03 · Estado diario del PJUD: réplica de respaldo, cruzable con el briefing del agente.
export const pjudDaily: {
  id: string; day: string; rol: string; tribunal: string; movimiento: string; tipo: string; causaId?: string;
}[] = [
  { id: 'pj1', day: TODAY, rol: 'E-1234-2026', tribunal: '2º Juzgado Civil Stgo', movimiento: 'Estampado del receptor: notificación efectiva a Juan Pérez', tipo: 'Notificación', causaId: '884-201' },
  { id: 'pj2', day: TODAY, rol: 'E-0912-2026', tribunal: '5º Juzgado Civil Stgo', movimiento: 'Requerimiento de pago estampado — arranca reloj de 8 días', tipo: 'Requerimiento', causaId: '773-119' },
  { id: 'pj3', day: TODAY, rol: 'E-0778-2026', tribunal: '11º Juzgado Civil Stgo', movimiento: 'Certificación de ingreso al Registro Civil', tipo: 'Certificación', causaId: '902-556' },
  { id: 'pj4', day: TODAY, rol: 'E-2201-2026', tribunal: '8º Juzgado Civil Stgo', movimiento: 'Previo a proveer: acompáñese liquidación rebajando el monto', tipo: 'Resolución' },
  { id: 'pj5', day: TODAY, rol: 'E-2244-2026', tribunal: '14º Juzgado Civil Stgo', movimiento: 'Mandamiento de ejecución y embargo emitido', tipo: 'Mandamiento' },
  { id: 'pj6', day: daysFromToday(-1), rol: 'E-0455-2026', tribunal: '1º Juzgado Letras Temuco', movimiento: 'Resolución de rechazo de la demanda — corre reposición', tipo: 'Resolución', causaId: '645-233' },
  { id: 'pj7', day: daysFromToday(-1), rol: 'E-0456-2026', tribunal: '3º Juzgado Civil Stgo', movimiento: 'Inscripción aceptada en Registro Civil (consulta por patente)', tipo: 'Registro Civil', causaId: '118-907' },
  { id: 'pj8', day: daysFromToday(-1), rol: 'E-1890-2026', tribunal: '4º Juzgado Civil Stgo', movimiento: 'Búsqueda negativa del receptor — consume intento', tipo: 'Notificación' },
  { id: 'pj9', day: daysFromToday(-2), rol: 'E-0778-2026', tribunal: '11º Juzgado Civil Stgo', movimiento: 'Acta de embargo ingresada', tipo: 'Apremio', causaId: '902-556' },
  { id: 'pj10', day: daysFromToday(-2), rol: 'E-3012-2026', tribunal: '9º Juzgado Civil Stgo', movimiento: 'Traslado a las excepciones opuestas por el ejecutado', tipo: 'Apremio' },
];

// FB-06 · Recordatorios internos (no son plazos legales). Los vencidos/para hoy salen en el Inicio.
export const reminders: Reminder[] = [
  { id: 'rem1', text: 'Llamar a Tanner por el CAV del lote de junio', due: daysFromToday(-1), causaId: '902-556', causaLabel: 'Soto con OLX' },
  { id: 'rem2', text: 'Revisar el acuerdo de pago de Rojas antes de seguir con la reposición', due: TODAY, causaId: '645-233', causaLabel: 'Rojas con OLX' },
  { id: 'rem3', text: 'Confirmar honorarios del receptor L. Fuentes (región)', due: daysFromToday(4) },
  { id: 'rem4', text: 'Pedir a OLX los certificados del lote ya inscrito', due: daysFromToday(7), causaId: '118-907', causaLabel: 'Muñoz con Tanner' },
];

// FB-06 · Notas internas por causa (historial editable que el agente puede consultar).
export const causaNotes: CausaNote[] = [
  { id: 'nt1', causaId: '884-201', text: 'El deudor llamó ofreciendo pagar en 3 cuotas. Pendiente de confirmar con Tanner antes de avanzar el embargo.', author: 'Cristóbal', time: 'Ayer' },
  { id: 'nt2', causaId: '902-556', text: 'El receptor avisó que la patente estaba en un domicilio distinto; ya se actualizó la dirección de embargo.', author: 'Procurador', time: 'Hace 2 días' },
];

export const mailDraft = `Estimado/a receptor/a M. Contreras:

Por encargo del Estudio Cid & Asociados, en representación de Tanner
Servicios Financieros S.A., se solicita practicar diligencia de EMBARGO
en la siguiente causa:

  Rol            : E-1234-2026
  Tribunal       : 2º Juzgado Civil de Santiago
  Partes         : Pérez con Tanner
  Bien a embargar: Vehículo patente LKTR-42
  Monto          : $10.895.269

Pauta Tanner: hasta 2 intentos. Adjunto mandamiento y copia de la
notificación efectiva. Favor confirmar recepción y agendar diligencia.

Saludos,
Procurador ProdBooster — Estudio Cid & Asociados`;
