export type Stage =
  | 'Demanda'
  | 'Notificación'
  | 'Embargo'
  | 'Rechazo'
  | 'Excepciones';

export type ClockTone = 'red' | 'amber' | 'calm' | 'green';

export interface CausaClock {
  label: string;
  tone: ClockTone;
  icon: 'clock' | 'check' | 'spinner';
}

export interface Milestone {
  label: string;
  pct: string;
  state: 'done' | 'active' | 'wait';
}

export interface TimelineItem {
  title: string;
  detail: string;
  state: 'done' | 'pending';
}

export type MsgRole = 'agent' | 'user';

export type PlanStepStatus = 'pending' | 'in-progress' | 'completed' | 'need-help' | 'failed';

export interface AgentPlanStep {
  id: string;
  title: string;
  description?: string;
  status: PlanStepStatus;
  tools?: string[];
}

export interface ChatMessage {
  id: string;
  role: MsgRole;
  text: string;
  time: string;
  doc?: string;
  typing?: boolean;
  /** Confianza (0-100) del agente en el documento generado/sugerido en este mensaje. */
  confidence?: number;
  /** Plan animado del procurador mientras trabaja (Agent Plan). */
  plan?: {
    title: string;
    steps: AgentPlanStep[];
  };
  proposal?: {
    tag: string;
    text: string;
    primaryLabel: string;
    secondaryLabel?: string;
    flow: string;
    done?: boolean;
  };
}

export interface CausaDoc {
  name: string;
  type: string;
  date: string;
  cuaderno: 'Principal' | 'Apremio';
}

export interface BillingMilestone {
  label: string;
  pct: number;
  date?: string;
  doc?: string;
  billed: boolean;
}

export interface Causa {
  id: string;
  credito: string;
  parties: string;
  detail: string;
  financiera: string;
  stage: Stage;
  clock: CausaClock;
  rol: string;
  tribunal: string;
  receptor: string;
  monto: string;
  intentos: string;
  rut: string;
  patente?: string;
  milestones: Milestone[];
  apremio: {
    badge: string;
    timeline: TimelineItem[];
  };
  /** Reloj de inscripción del embargo en el Registro Civil (solo etapa Embargo con patente). */
  inscripcion?: {
    day: number;
    status: 'tramite' | 'consultar' | 'aceptada' | 'rechazada';
  };
  chat: ChatMessage[];
  docs: CausaDoc[];
  billing: BillingMilestone[];
  /** Estado de gestión de la causa (independiente de la etapa procesal). Ausente = activa. */
  managementStatus?: 'active' | 'suspended' | 'deleted';
  /** Motivo registrado al suspender o eliminar la causa. */
  managementReason?: string;
}

export interface UrgentItem {
  id: string;
  days: string;
  tone: 'red' | 'amber';
  type: string;
  rol: string;
  parties: string;
  pill: { label: string; icon: 'alert' | 'check' };
  text: string;
  causaId: string;
  secondaryLabel?: string;
}

export interface BatchItem {
  label: string;
  /** Si viene definido, el ítem está bloqueado por una pre-validación y no entra al lote automático. */
  blocked?: string;
  /** Id de causa real, para poder abrirla y revisar en contexto. */
  causaId?: string;
  /** Desenlace simulado del lote (flujo registro): ok = inscrita, retry = aún no salió, se reintenta en 5 días. */
  outcome?: 'ok' | 'retry';
}

export interface MandamientoField {
  key: string;
  demanda: string;
  mandamiento: string;
  match: boolean;
}

export interface MandamientoReview {
  id: string;
  causa: string;
  parties: string;
  financiera: string;
  status: 'ok' | 'diff';
  fields: MandamientoField[];
  resolved?: boolean;
}

export interface HumanTask {
  id: string;
  causa: string;
  parties: string;
  /** Tipo de escrito/decisión que requiere un humano. */
  kind: string;
  stage: string;
  /** Plazo restante, ej "2 días". */
  deadline: string;
  detail: string;
  resolved?: boolean;
}

export interface BatchMetric {
  id: string;
  num: number;
  title: string;
  sub: string;
  flow: 'embargos' | 'registro';
  items: BatchItem[];
}

export interface RecentItem {
  id: string;
  title: string;
  sub: string;
}

export interface ReviewItem {
  id: string;
  causa: string;
  fields: {
    key: string;
    value: string;
    confidence: number;
  }[];
}

export interface Receptor {
  id: string;
  name: string;
  zone: string;
  fee: string;
  performance: number;
  active: boolean;
}

export interface FinancieraPauta {
  id: string;
  name: string;
  modalidad: string;
  intentos: number;
  cavPolicy: string;
  umbral: number;
  active: boolean;
}

export interface Toast {
  id: string;
  kind: 'ok' | 'info';
  text: string;
}

/**
 * Etapa 1 · La demanda es una entidad previa a la causa (la causa nace al presentar en el PJUD).
 * Solo dos estados: 'revisar' (la validación la marcó mal) y 'redactada' (quedó bien, lista para ingresar la causa).
 * Al ingresar la causa la demanda se convierte en Causa y sale del listado de demandas.
 */
export type DemandaStatus = 'revisar' | 'redactada';

/** Motivo por el que la validación documental marcó la demanda para corrección humana (spec §Validación Documental). */
export type RevisarReason = 'incompleta' | 'transferido' | 'ocr';

export interface Demanda {
  id: string;
  credito: string;
  parties: string;
  financiera: string;
  rut: string;
  monto: string;
  status: DemandaStatus;
  /** Plantilla GLOBAL seleccionada según deudor/jurisdicción. */
  template: string;
  /** Si status = 'revisar': por qué quedó mal (incompleta / vehículo transferido / OCR bajo umbral). */
  revisarReason?: RevisarReason;
  /** Confianza (0-100) del agente al generar/seleccionar el borrador de la demanda. */
  confidence?: number;
  /** Chat del procurador sobre la demanda (fase agéntica previa a la causa). */
  chat?: ChatMessage[];
}

/** Etapa 1 · Paso de ingesta que se muestra en vivo mientras se crean las demandas del lote. */
export interface IngestStep {
  id: string;
  doc: string;
  status: 'leyendo' | 'validada' | 'revision' | 'error';
  detail?: string;
  /** Si no quedó validada, motivo de corrección con el que nace la demanda en estado 'revisar'. */
  reason?: RevisarReason;
}

/** FB-06 · Recordatorio interno (NO es un plazo legal). Aparece en el Inicio cuando vence. */
export interface Reminder {
  id: string;
  text: string;
  /** Fecha de vencimiento 'YYYY-MM-DD'. */
  due: string;
  causaId?: string;
  causaLabel?: string;
  done?: boolean;
}

/** FB-06 · Nota interna por causa, editable, que el agente puede consultar. */
export interface CausaNote {
  id: string;
  causaId: string;
  text: string;
  author: string;
  time: string;
}
