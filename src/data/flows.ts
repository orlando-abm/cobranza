import type { AgentPlanStep } from '../types';

export interface FlowScript {
  userText: string;
  working: string;
  reply: string;
  doc?: string;
  toast: string;
  milestone?: string;
  /** Subtareas del Agent Plan que el procurador avanza mientras trabaja. */
  plan?: {
    title: string;
    steps: Omit<AgentPlanStep, 'status'>[];
  };
}

function steps(items: Omit<AgentPlanStep, 'status'>[]): Omit<AgentPlanStep, 'status'>[] {
  return items;
}

export const flows: Record<string, FlowScript> = {
  'encargar-embargo': {
    userText: 'Sí, encarga el embargo.',
    working: 'Escribiéndole al receptor M. Contreras…',
    reply:
      'Listo. Le encargué el embargo a **M. Contreras** con el rol, tribunal, partes y la patente. Le puse la pauta de Tanner (2 intentos). Te aviso apenas suba el comprobante de ingreso al Registro Civil y arranco el reloj del CAV.',
    doc: 'Mail de encargo enviado · 14:32',
    toast: 'Embargo encargado a M. Contreras',
    milestone: 'Notificación efectiva',
    plan: {
      title: 'Encargar embargo',
      steps: steps([
        { id: 'e1', title: 'Verificar pre-validaciones', description: 'CAV previo del tribunal, retorno de exhorto y propietario = deudor.', tools: ['CAV', 'Expediente'] },
        { id: 'e2', title: 'Armar mail de encargo', description: 'Rol, tribunal, partes y patente a embargar.', tools: ['Plantilla mail'] },
        { id: 'e3', title: 'Aplicar pauta de la financiera', description: 'Intentos máximos y zona del receptor.', tools: ['Pauta Tanner'] },
        { id: 'e4', title: 'Enviar al receptor', description: 'Despacho al receptor asignado y registro en el expediente.', tools: ['Receptor'] },
      ]),
    },
  },
  'programar-rebeldia': {
    userText: 'Sí, déjalo programado.',
    working: 'Configurando la vigilancia del plazo de excepciones…',
    reply:
      'Programado. Vigilo el cuaderno de apremio en paralelo. Si el plazo de excepciones expira sin oposición, **pre-genero el certificado de no oposición** y te lo dejo listo. La firma y presentación las haces **por PJUD** por ahora — no presento nada sin tu aprobación.',
    doc: 'Regla de vigilancia activa · apremio',
    toast: 'Vigilancia de rebeldía programada',
    plan: {
      title: 'Programar vigilancia de rebeldía',
      steps: steps([
        { id: 'r1', title: 'Leer plazo de excepciones', description: 'Cuaderno de apremio · reloj de 8 días.', tools: ['PJUD'] },
        { id: 'r2', title: 'Configurar regla de vigilancia', description: 'Alerta al vencer sin oposición.', tools: ['Reloj'] },
        { id: 'r3', title: 'Pre-armar certificado de no oposición', description: 'Borrador listo; no se presenta sin tu OK.', tools: ['Plantilla'] },
      ]),
    },
  },
  'cadena-registro': {
    userText: 'Sí, activá la cadena.',
    working: 'Activando la cadena de Registro Civil…',
    reply:
      'Cadena activa. Cuando el Registro Civil confirme la inscripción: **aviso al abogado**, **mail a la financiera** con el comprobante y **genero el informe de embargos** del período. Consulto cada 5–7 días desde el día 25.',
    doc: 'Cadena automática · Registro Civil',
    toast: 'Cadena de Registro Civil activada',
    plan: {
      title: 'Cadena Registro Civil',
      steps: steps([
        { id: 'c1', title: 'Confirmar reloj de 30 días', description: 'Comprobante de ingreso ya arrancó el reloj.', tools: ['Registro Civil'] },
        { id: 'c2', title: 'Agendar consultas desde día 25', description: 'Cada 5–7 días por patente hasta “inscripción aceptada”.', tools: ['Cron'] },
        { id: 'c3', title: 'Preparar cadena al aceptar', description: 'Aviso abogado + mail financiera + informe de embargos.', tools: ['Mail', 'Informe'] },
      ]),
    },
  },
  'borrador-reposicion': {
    userText: 'Sí, preparalo.',
    working: 'Redactando el recurso de reposición…',
    reply:
      'Borrador listo. Corregí el **domicilio del deudor** con los datos del CAV y armé el recurso de reposición dentro de plazo. Te lo dejo listo para revisar; la firma y presentación van **por PJUD** por ahora.',
    doc: 'Recurso de reposición (borrador).pdf',
    toast: 'Borrador de reposición listo para revisar',
    plan: {
      title: 'Redactar recurso de reposición',
      steps: steps([
        { id: 'b1', title: 'Leer resolución de rechazo', description: 'Identificar el defecto de forma señalado por el tribunal.', tools: ['OCR', 'PJUD'] },
        { id: 'b2', title: 'Cruzar domicilio con CAV', description: 'Corregir con los datos del certificado de anotaciones vigentes.', tools: ['CAV'] },
        { id: 'b3', title: 'Redactar recurso', description: 'Plantilla de reposición dentro de plazo.', tools: ['Plantilla'] },
        { id: 'b4', title: 'Dejar borrador para revisar', description: 'Editable en el editor de escritos · firma por PJUD.', tools: ['Editor'] },
      ]),
    },
  },
  'cola-firmas': {
    userText: 'Sí, prepará la demanda.',
    working: 'Dejando la demanda lista para presentar…',
    reply:
      'Hecho. La demanda quedó **lista para presentar por PJUD**. Apenas la marques como presentada, arranco el reloj de admisibilidad y disparo el hito de facturación del 5%.',
    doc: 'Demanda ejecutiva.pdf · lista',
    toast: 'Demanda lista para presentar por PJUD',
    plan: {
      title: 'Preparar demanda',
      steps: steps([
        { id: 'd1', title: 'Elegir plantilla GLOBAL', description: 'Según deudor, avales y jurisdicción.', tools: ['Plantillas'] },
        { id: 'd2', title: 'Completar campos del crédito', description: 'Partes, RUT, monto y domicilio.', tools: ['OCR'] },
        { id: 'd3', title: 'Generar PDF de la demanda', description: 'Documento listo para presentar por PJUD.', tools: ['Editor'] },
        { id: 'd4', title: 'Marcar como lista', description: 'Queda en Redacción de demandas · estado Lista.', tools: ['Demandas'] },
      ]),
    },
  },
  generic: {
    userText: 'Dale, avanzá.',
    working: 'Trabajando en la causa…',
    reply: 'Listo, avancé el paso y dejé registro en el expediente.',
    toast: 'Acción completada',
    plan: {
      title: 'Avanzar causa',
      steps: steps([
        { id: 'g1', title: 'Revisar expediente', description: 'Estado actual de ambos cuadernos.', tools: ['PJUD'] },
        { id: 'g2', title: 'Ejecutar siguiente paso', description: 'Según la máquina de estados de la causa.', tools: ['Estados'] },
        { id: 'g3', title: 'Registrar en bitácora', description: 'Dejar traza del avance.', tools: ['Expediente'] },
      ]),
    },
  },
};

/** Plan genérico para respuestas libres del chat (cuando no hay flow tipado). */
export const thinkingPlan = {
  title: 'Pensando…',
  steps: steps([
    { id: 't1', title: 'Leer tu pedido', description: 'Interpretar la instrucción en lenguaje natural.', tools: ['Procurador'] },
    { id: 't2', title: 'Cruzar con el expediente', description: 'Buscar contexto en ambos cuadernos.', tools: ['PJUD'] },
    { id: 't3', title: 'Proponer el siguiente paso', description: 'Respuesta accionable o aclaración.', tools: ['Procurador'] },
  ]),
};

/** Plan de ingesta de lote (Redacción de demandas). */
export const ingestPlan = {
  title: 'Procesar lote de demandas',
  steps: steps([
    { id: 'i1', title: 'Descomprimir ZIP', description: 'Extraer carpetas y archivos del lote.', tools: ['Ingesta'] },
    { id: 'i2', title: 'Clasificar documentos', description: 'Pagaré, CAV, tabla y anexos por crédito.', tools: ['Clasificador'] },
    { id: 'i3', title: 'OCR con score de confianza', description: 'Campos bajo umbral van a revisión manual.', tools: ['OCR'] },
    { id: 'i4', title: 'Validar consistencia', description: 'Nombre / RUT / monto vs pagaré.', tools: ['Validación'] },
    { id: 'i5', title: 'Redactar demandas', description: 'Plantilla GLOBAL según tipo de deudor.', tools: ['Plantillas'] },
  ]),
};

/** Plan de consulta de inscripción en lote. */
export const registroPlan = {
  title: 'Consultar inscripción en lote',
  steps: steps([
    { id: 'rc1', title: 'Armar lista en plazo', description: 'Patentes con día ≥ 25.', tools: ['Reloj'] },
    { id: 'rc2', title: 'Consultar Registro Civil', description: 'Estado “inscripción aceptada” por patente.', tools: ['Registro Civil'] },
    { id: 'rc3', title: 'Separar resultados', description: 'Inscritas vs reintento en 5 días.', tools: ['Cron'] },
    { id: 'rc4', title: 'Disparar cadena', description: 'Aviso + mail + informe en las aceptadas.', tools: ['Mail', 'Informe'] },
  ]),
};

/** Plan de encargo de embargos en lote. */
export const embargosPlan = {
  title: 'Encargar embargos en lote',
  steps: steps([
    { id: 'eb1', title: 'Filtrar listos', description: 'Sin bloqueos de CAV / exhorto / transferencia.', tools: ['Pre-validación'] },
    { id: 'eb2', title: 'Armar mails de encargo', description: 'Uno por receptor con rol y patente.', tools: ['Plantilla mail'] },
    { id: 'eb3', title: 'Despachar a receptores', description: 'Envío y registro en cada causa.', tools: ['Receptor'] },
  ]),
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

/** Convierte steps sin status a AgentPlanStep[] todos pending. */
export function toPendingPlan(items: Omit<AgentPlanStep, 'status'>[]): AgentPlanStep[] {
  return items.map((s) => ({ ...s, status: 'pending' as const }));
}
