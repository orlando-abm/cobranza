export interface FlowScript {
  userText: string;
  working: string;
  reply: string;
  doc?: string;
  toast: string;
  milestone?: string;
}

export const flows: Record<string, FlowScript> = {
  'encargar-embargo': {
    userText: 'Sí, encargá el embargo.',
    working: 'Escribiéndole al receptor M. Contreras…',
    reply:
      'Listo. Le encargué el embargo a **M. Contreras** con el rol, tribunal, partes y la patente. Le puse la pauta de Tanner (2 intentos). Te aviso apenas suba el comprobante de ingreso al Registro Civil y arranco el reloj del CAV.',
    doc: 'Mail de encargo enviado · 14:32',
    toast: 'Embargo encargado a M. Contreras',
    milestone: 'Notificación efectiva',
  },
  'programar-rebeldia': {
    userText: 'Sí, dejalo programado.',
    working: 'Configurando la vigilancia del plazo de excepciones…',
    reply:
      'Programado. Vigilo el cuaderno de apremio en paralelo. Si el plazo de excepciones expira sin oposición, **pre-genero el certificado de no oposición** y te lo dejo listo. La firma y presentación las haces **por PJUD** por ahora — no presento nada sin tu aprobación.',
    doc: 'Regla de vigilancia activa · apremio',
    toast: 'Vigilancia de rebeldía programada',
  },
  'cadena-registro': {
    userText: 'Sí, activá la cadena.',
    working: 'Activando la cadena de Registro Civil…',
    reply:
      'Cadena activa. Cuando el Registro Civil confirme la inscripción: **aviso al abogado**, **mail a la financiera** con el comprobante y **genero el informe de embargos** del período. Consulto cada 5–7 días desde el día 25.',
    doc: 'Cadena automática · Registro Civil',
    toast: 'Cadena de Registro Civil activada',
  },
  'borrador-reposicion': {
    userText: 'Sí, preparalo.',
    working: 'Redactando el recurso de reposición…',
    reply:
      'Borrador listo. Corregí el **domicilio del deudor** con los datos del CAV y armé el recurso de reposición dentro de plazo. Te lo dejo listo para revisar; la firma y presentación van **por PJUD** por ahora.',
    doc: 'Recurso de reposición (borrador).pdf',
    toast: 'Borrador de reposición listo para revisar',
  },
  'cola-firmas': {
    userText: 'Sí, prepará la demanda.',
    working: 'Dejando la demanda lista para presentar…',
    reply:
      'Hecho. La demanda quedó **lista para presentar por PJUD**. Apenas la marques como presentada, arranco el reloj de admisibilidad y disparo el hito de facturación del 5%.',
    doc: 'Demanda ejecutiva.pdf · lista',
    toast: 'Demanda lista para presentar por PJUD',
  },
  generic: {
    userText: 'Dale, avanzá.',
    working: 'Trabajando en la causa…',
    reply: 'Listo, avancé el paso y dejé registro en el expediente.',
    toast: 'Acción completada',
  },
};

export function agentReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('cav')) return 'Le pido el **CAV actualizado** a la financiera y lo cruzo con el pagaré. Te aviso apenas responda.';
  if (t.includes('embargo')) return 'Reviso el estado del embargo. Si la notificación es efectiva, verifico las pre-validaciones (CAV previo del tribunal, retorno de exhorto en regiones y propietario del CAV) antes de encargarlo al receptor.';
  if (t.includes('plazo') || t.includes('excep')) return 'Estoy vigilando los plazos en ambos cuadernos. El de excepciones corre en paralelo y **no bloquea** el embargo.';
  if (t.includes('demanda') || t.includes('escrito')) return 'Puedo redactar el escrito con la plantilla GLOBAL que corresponde y dejártelo listo para presentar por PJUD. ¿Lo preparo?';
  if (t.includes('receptor')) return 'Te muestro la base de receptores por zona y performance. ¿Querés que reasigne la diligencia?';
  return 'Anotado. Lo reviso contra el expediente y te propongo el siguiente paso en un momento.';
}
