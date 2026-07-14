import type { AgentPlanStep, ChatMessage } from '../types';
import { advancePlan, completePlan } from '../components/AgentPlan';
import { toPendingPlan } from './flows';

type AddMessage = (id: string, msg: Omit<ChatMessage, 'id'>) => string;
type UpdateMessage = (id: string, msgId: string, patch: Partial<ChatMessage>) => void;

export interface PlanDef {
  title: string;
  steps: Omit<AgentPlanStep, 'status'>[];
}

/**
 * Anima el "plan del procurador" paso a paso en el chat (Causa o Demanda).
 * Recibe las acciones de mensaje de la entidad para no acoplarse al store.
 */
export function runAgentPlan(
  addMessage: AddMessage,
  updateMessage: UpdateMessage,
  id: string,
  planDef: PlanDef,
  workingText: string,
  onDone: () => void,
) {
  const base = toPendingPlan(planDef.steps);
  const planId = addMessage(id, {
    role: 'agent',
    text: workingText,
    time: '',
    typing: true,
    plan: { title: planDef.title, steps: advancePlan(base, 0) },
  });
  const stepMs = Math.max(420, Math.min(700, 2200 / Math.max(base.length, 1)));
  base.forEach((_, i) => {
    if (i === 0) return;
    window.setTimeout(() => {
      updateMessage(id, planId, { plan: { title: planDef.title, steps: advancePlan(base, i) } });
    }, i * stepMs);
  });
  window.setTimeout(() => {
    updateMessage(id, planId, { typing: false, plan: { title: planDef.title, steps: completePlan(base) } });
    onDone();
  }, base.length * stepMs + 280);
}
