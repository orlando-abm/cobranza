import { useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import Icon from './Icon';
import type { AgentPlanStep, PlanStepStatus } from '../types';

export type { AgentPlanStep, PlanStepStatus };

export interface AgentPlanProps {
  title?: string;
  steps: AgentPlanStep[];
  /** Compacto para el chat del procurador. */
  compact?: boolean;
  className?: string;
}

const statusIcon = (status: PlanStepStatus) => {
  switch (status) {
    case 'completed':
      return <Icon name="check" size={15} className="ap-ic done" />;
    case 'in-progress':
      return <Icon name="spinner" size={15} className="ap-ic run spin" />;
    case 'need-help':
      return <Icon name="alert" size={15} className="ap-ic help" />;
    case 'failed':
      return <Icon name="xCircle" size={15} className="ap-ic fail" />;
    default:
      return <span className="ap-ic pending" />;
  }
};

export default function AgentPlan({ title = 'Plan del procurador', steps, compact, className }: AgentPlanProps) {
  const [expanded, setExpanded] = useState(true);
  const [openDetail, setOpenDetail] = useState<Record<string, boolean>>({});
  const done = steps.filter((s) => s.status === 'completed').length;
  const active = steps.find((s) => s.status === 'in-progress');

  return (
    <div className={`agent-plan${compact ? ' compact' : ''}${className ? ` ${className}` : ''}`}>
      <button type="button" className="ap-head" onClick={() => setExpanded((v) => !v)}>
        <span className="ap-head-ic"><Icon name="bolt" size={14} /></span>
        <span className="ap-head-title">{title}</span>
        <span className="ap-head-count">{done}/{steps.length}</span>
        <span className={`ap-chev${expanded ? ' open' : ''}`}><Icon name="chevronRight" size={14} /></span>
      </button>

      {active && (
        <div className="ap-now">
          <Icon name="spinner" size={13} className="spin" />
          <span>Pensando · {active.title}</span>
        </div>
      )}

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.2, 0.65, 0.3, 0.9] }}
            style={{ overflow: 'hidden' }}
          >
            <LayoutGroup>
              <ul className="ap-list">
                {steps.map((step, i) => {
                  const detailOpen = !!openDetail[step.id];
                  return (
                    <motion.li
                      key={step.id}
                      className={`ap-step ${step.status}`}
                      layout
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                    >
                      <button
                        type="button"
                        className="ap-step-row"
                        onClick={() => setOpenDetail((p) => ({ ...p, [step.id]: !p[step.id] }))}
                      >
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={step.status}
                            className="ap-status"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                          >
                            {statusIcon(step.status)}
                          </motion.span>
                        </AnimatePresence>
                        <span className={`ap-step-title${step.status === 'completed' ? ' done' : ''}`}>
                          {step.title}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {detailOpen && (step.description || step.tools?.length) && (
                          <motion.div
                            className="ap-detail"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                          >
                            {step.description && <p>{step.description}</p>}
                            {!!step.tools?.length && (
                              <div className="ap-tools">
                                {step.tools.map((t) => (
                                  <span key={t} className="ap-tool">{t}</span>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  );
                })}
              </ul>
            </LayoutGroup>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Avanza un plan paso a paso: marca el índice `active` como in-progress y los anteriores completed. */
export function advancePlan(steps: AgentPlanStep[], activeIndex: number): AgentPlanStep[] {
  return steps.map((s, i) => {
    if (i < activeIndex) return { ...s, status: 'completed' as const };
    if (i === activeIndex) return { ...s, status: 'in-progress' as const };
    return { ...s, status: 'pending' as const };
  });
}

export function completePlan(steps: AgentPlanStep[]): AgentPlanStep[] {
  return steps.map((s) => ({ ...s, status: 'completed' as const }));
}
