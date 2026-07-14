import { create } from 'zustand';
import type { Causa, ChatMessage, Toast, ReviewItem, MandamientoReview, HumanTask, Demanda, Reminder, CausaNote } from '../types';
import {
  causas as seedCausas, reviewItems as seedReview,
  mandamientos as seedMandamientos, humanTasks as seedHumanTasks,
  demandas as seedDemandas, reminders as seedReminders, causaNotes as seedNotes,
  TODAY, causaFromDemanda,
} from '../data/mock';

let toastSeq = 0;

interface AppState {
  causas: Causa[];
  demandas: Demanda[];
  review: ReviewItem[];
  mandamientos: MandamientoReview[];
  humanTasks: HumanTask[];
  reminders: Reminder[];
  notes: CausaNote[];
  toasts: Toast[];
  loteLoaded: boolean;
  /** FB-04: contenido editado de cada escrito, persistido en el cliente (id → HTML). */
  escritosDrafts: Record<string, string>;

  getCausa: (id: string) => Causa | undefined;
  addMessage: (causaId: string, msg: Omit<ChatMessage, 'id'>) => string;
  updateMessage: (causaId: string, msgId: string, patch: Partial<ChatMessage>) => void;
  removeMessage: (causaId: string, msgId: string) => void;
  markProposalDone: (causaId: string, msgId: string) => void;
  advanceMilestone: (causaId: string, label: string) => void;

  pushToast: (kind: Toast['kind'], text: string) => void;
  dismissToast: (id: string) => void;

  resolveReview: (id: string) => void;
  approveRectificacion: (id: string) => void;
  resolveHumanTask: (id: string) => void;
  markLoteLoaded: () => void;

  suspendCausa: (id: string, reason: string) => void;
  reactivateCausa: (id: string) => void;
  deleteCausa: (id: string, reason: string) => void;

  /** Etapa 1 · Marca una demanda 'revisar' como corregida → 'redactada'. */
  markDemandaCorrected: (id: string) => void;
  /** Etapa 1 · Ingresar causa: crea la Causa con el Rol ingresado y saca la demanda del listado. Devuelve el id de la causa. */
  submitDemandaToPjud: (id: string, rol: string) => string | undefined;
  /** Ingesta: agrega las demandas recién creadas al listado. */
  addDemandas: (list: Demanda[]) => void;

  /** Fase agéntica de la demanda: chat del procurador y reasignación de plantilla. */
  getDemanda: (id: string) => Demanda | undefined;
  addDemandaMessage: (id: string, msg: Omit<ChatMessage, 'id'>) => string;
  updateDemandaMessage: (id: string, msgId: string, patch: Partial<ChatMessage>) => void;
  removeDemandaMessage: (id: string, msgId: string) => void;
  markDemandaProposalDone: (id: string, msgId: string) => void;
  setDemandaTemplate: (id: string, template: string) => void;
  setDemandaConfidence: (id: string, pct: number) => void;

  /** FB-04: guarda el contenido editado de un escrito. */
  saveEscritoDraft: (id: string, html: string) => void;

  /** FB-06: recordatorios internos y notas por causa. */
  addReminder: (r: Omit<Reminder, 'id'>) => void;
  addNote: (causaId: string, text: string) => void;
  dueReminders: () => Reminder[];
  notesFor: (causaId: string) => CausaNote[];

  pendingReview: () => number;
  pendingMandamientos: () => number;
  pendingHumanTasks: () => number;
  pendingRevisiones: () => number;
  /** Causas que no están suspendidas ni eliminadas (ausencia de estado = activa). */
  activeCausas: () => Causa[];
  /** Ids de causas fuera de gestión (suspendidas o eliminadas), para excluir en Home, Revisiones, pulse. */
  inactiveCausaIds: () => Set<string>;
}

const uid = () => Math.random().toString(36).slice(2, 9);

export const useAppStore = create<AppState>((set, get) => ({
  causas: seedCausas,
  demandas: seedDemandas,
  review: seedReview,
  mandamientos: seedMandamientos,
  humanTasks: seedHumanTasks,
  reminders: seedReminders,
  notes: seedNotes,
  toasts: [],
  loteLoaded: false,
  escritosDrafts: {},

  getCausa: (id) => get().causas.find((c) => c.id === id),

  addMessage: (causaId, msg) => {
    const id = uid();
    set((state) => ({
      causas: state.causas.map((c) =>
        c.id === causaId ? { ...c, chat: [...c.chat, { ...msg, id }] } : c,
      ),
    }));
    return id;
  },

  updateMessage: (causaId, msgId, patch) =>
    set((state) => ({
      causas: state.causas.map((c) =>
        c.id === causaId
          ? { ...c, chat: c.chat.map((m) => (m.id === msgId ? { ...m, ...patch } : m)) }
          : c,
      ),
    })),

  removeMessage: (causaId, msgId) =>
    set((state) => ({
      causas: state.causas.map((c) =>
        c.id === causaId ? { ...c, chat: c.chat.filter((m) => m.id !== msgId) } : c,
      ),
    })),

  markProposalDone: (causaId, msgId) =>
    set((state) => ({
      causas: state.causas.map((c) =>
        c.id === causaId
          ? {
              ...c,
              chat: c.chat.map((m) =>
                m.id === msgId && m.proposal
                  ? { ...m, proposal: { ...m.proposal, done: true } }
                  : m,
              ),
            }
          : c,
      ),
    })),

  advanceMilestone: (causaId, label) =>
    set((state) => ({
      causas: state.causas.map((c) => {
        if (c.id !== causaId) return c;
        const idx = c.milestones.findIndex((m) => m.label === label);
        if (idx === -1) return c;
        const milestones = c.milestones.map((m, i) => {
          if (i < idx) return { ...m, state: 'done' as const };
          if (i === idx) return { ...m, state: 'done' as const };
          if (i === idx + 1) return { ...m, state: 'active' as const };
          return m;
        });
        return { ...c, milestones };
      }),
    })),

  pushToast: (kind, text) => {
    const id = `t${++toastSeq}`;
    set((state) => ({ toasts: [...state.toasts, { id, kind, text }] }));
    setTimeout(() => get().dismissToast(id), 4200);
  },

  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  resolveReview: (id) =>
    set((state) => ({ review: state.review.filter((r) => r.id !== id) })),

  approveRectificacion: (id) =>
    set((state) => ({
      mandamientos: state.mandamientos.map((x) => (x.id === id ? { ...x, resolved: true } : x)),
    })),

  resolveHumanTask: (id) =>
    set((state) => ({
      humanTasks: state.humanTasks.map((t) => (t.id === id ? { ...t, resolved: true } : t)),
    })),

  markLoteLoaded: () => set({ loteLoaded: true }),

  suspendCausa: (id, reason) =>
    set((state) => ({
      causas: state.causas.map((c) =>
        c.id === id ? { ...c, managementStatus: 'suspended', managementReason: reason } : c,
      ),
    })),

  reactivateCausa: (id) =>
    set((state) => ({
      causas: state.causas.map((c) =>
        c.id === id ? { ...c, managementStatus: 'active', managementReason: undefined } : c,
      ),
    })),

  deleteCausa: (id, reason) =>
    set((state) => ({
      causas: state.causas.map((c) =>
        c.id === id ? { ...c, managementStatus: 'deleted', managementReason: reason } : c,
      ),
    })),

  markDemandaCorrected: (id) =>
    set((state) => ({
      demandas: state.demandas.map((d) =>
        d.id === id ? { ...d, status: 'redactada', revisarReason: undefined } : d,
      ),
    })),

  submitDemandaToPjud: (id, rol) => {
    const demanda = get().demandas.find((d) => d.id === id);
    if (!demanda) return undefined;
    const causa = causaFromDemanda(demanda, rol);
    set((state) => ({
      // La demanda se convierte en causa: se agrega a causas y sale del listado de demandas.
      causas: state.causas.some((c) => c.id === causa.id) ? state.causas : [causa, ...state.causas],
      demandas: state.demandas.filter((d) => d.id !== id),
    }));
    return causa.id;
  },

  addDemandas: (list) => set((state) => {
    const existing = new Set(state.demandas.map((d) => d.id));
    const fresh = list.filter((d) => !existing.has(d.id));
    return { demandas: [...fresh, ...state.demandas] };
  }),

  getDemanda: (id) => get().demandas.find((d) => d.id === id),

  addDemandaMessage: (id, msg) => {
    const msgId = uid();
    set((state) => ({
      demandas: state.demandas.map((d) =>
        d.id === id ? { ...d, chat: [...(d.chat ?? []), { ...msg, id: msgId }] } : d,
      ),
    }));
    return msgId;
  },

  updateDemandaMessage: (id, msgId, patch) =>
    set((state) => ({
      demandas: state.demandas.map((d) =>
        d.id === id ? { ...d, chat: (d.chat ?? []).map((m) => (m.id === msgId ? { ...m, ...patch } : m)) } : d,
      ),
    })),

  removeDemandaMessage: (id, msgId) =>
    set((state) => ({
      demandas: state.demandas.map((d) =>
        d.id === id ? { ...d, chat: (d.chat ?? []).filter((m) => m.id !== msgId) } : d,
      ),
    })),

  markDemandaProposalDone: (id, msgId) =>
    set((state) => ({
      demandas: state.demandas.map((d) =>
        d.id === id
          ? { ...d, chat: (d.chat ?? []).map((m) => (m.id === msgId && m.proposal ? { ...m, proposal: { ...m.proposal, done: true } } : m)) }
          : d,
      ),
    })),

  setDemandaTemplate: (id, template) =>
    set((state) => ({
      demandas: state.demandas.map((d) => (d.id === id ? { ...d, template } : d)),
    })),

  setDemandaConfidence: (id, pct) =>
    set((state) => ({
      demandas: state.demandas.map((d) => (d.id === id ? { ...d, confidence: pct } : d)),
    })),

  saveEscritoDraft: (id, html) =>
    set((state) => ({ escritosDrafts: { ...state.escritosDrafts, [id]: html } })),

  addReminder: (r) =>
    set((state) => ({ reminders: [...state.reminders, { ...r, id: `rem-${uid()}` }] })),

  addNote: (causaId, text) =>
    set((state) => ({
      notes: [...state.notes, { id: `nt-${uid()}`, causaId, text, author: 'Cristóbal', time: 'Ahora' }],
    })),

  dueReminders: () => get().reminders.filter((r) => !r.done && r.due <= TODAY),
  notesFor: (causaId) => get().notes.filter((n) => n.causaId === causaId),

  pendingReview: () => get().review.length,
  pendingMandamientos: () => get().mandamientos.filter((m) => m.status === 'diff' && !m.resolved).length,
  pendingHumanTasks: () => get().humanTasks.filter((t) => !t.resolved).length,
  pendingRevisiones: () => get().pendingReview() + get().pendingMandamientos() + get().pendingHumanTasks(),

  activeCausas: () => get().causas.filter((c) => c.managementStatus !== 'suspended' && c.managementStatus !== 'deleted'),
  inactiveCausaIds: () =>
    new Set(
      get().causas
        .filter((c) => c.managementStatus === 'suspended' || c.managementStatus === 'deleted')
        .map((c) => c.id),
    ),
}));
