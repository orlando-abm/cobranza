import { useEffect, useRef } from 'react';
import Icon from './Icon';
import RichText from './RichText';
import AgentPlan from './AgentPlan';
import ConfidenceBadge from './ConfidenceBadge';
import type { ChatMessage } from '../types';

interface Props {
  title: string;
  sub: string;
  messages: ChatMessage[];
  input: string;
  placeholder: string;
  onInput: (v: string) => void;
  onSend: () => void;
  onRunFlow: (msgId: string, flow: string) => void;
  onDoc: (title: string) => void;
}

/** Chat del procurador reutilizable (Causa y Demanda). */
export default function ProcuradorChat({ title, sub, messages, input, placeholder, onInput, onSend, onRunFlow, onDoc }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages.length]);

  return (
    <div className="proc-card">
      <div className="proc-header">
        <div className="proc-avatar"><Icon name="message" /></div>
        <div>
          <div className="pt">{title}</div>
          <div className="ps"><span className="live" />{sub}</div>
        </div>
      </div>

      <div className="proc-body" ref={bodyRef}>
        {messages.map((m) => (
          <ChatBubble key={m.id} m={m} onRun={onRunFlow} onDoc={onDoc} />
        ))}
      </div>

      <div className="proc-input">
        <input
          placeholder={placeholder}
          value={input}
          onChange={(e) => onInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
        />
        <button className="proc-send" onClick={onSend} aria-label="Enviar"><Icon name="send" /></button>
      </div>
    </div>
  );
}

export function ChatBubble({ m, onRun, onDoc }: {
  m: ChatMessage;
  onRun: (msgId: string, flow: string) => void;
  onDoc: (title: string) => void;
}) {
  return (
    <div className={`msg ${m.role}`}>
      <div className={`msg-avatar ${m.role}`}>
        {m.role === 'agent' ? <Icon name="message" /> : 'CO'}
      </div>
      <div className="msg-content">
        {m.proposal ? (
          <div className={`proposal${m.proposal.done ? ' done' : ''}`}>
            <span className="proposal-tag"><Icon name="bolt" />{m.proposal.tag}</span>
            <div className="proposal-text"><RichText text={m.proposal.text} /></div>
            <div className="proposal-actions">
              <button className="btn btn-primary" onClick={() => onRun(m.id, m.proposal!.flow)}>
                <Icon name="bolt" />{m.proposal.primaryLabel}
              </button>
              {m.proposal.secondaryLabel && (
                <button className="btn btn-ghost" onClick={() => onDoc(m.proposal!.secondaryLabel!)}>
                  {m.proposal.secondaryLabel}
                </button>
              )}
            </div>
          </div>
        ) : m.plan ? (
          <>
            <AgentPlan title={m.plan.title} steps={m.plan.steps} compact />
            {!m.typing && m.text && (
              <div className="msg-bubble" style={{ marginTop: 10 }}>
                <RichText text={m.text} />
                {m.doc && (
                  <button className="msg-doc" onClick={() => onDoc(m.doc!)}>
                    <Icon name="file" />{m.doc}
                  </button>
                )}
                {m.confidence != null && <div className="msg-conf"><ConfidenceBadge pct={m.confidence} label="confianza del borrador" /></div>}
              </div>
            )}
            {m.time && !m.typing && <div className="msg-time">{m.time}</div>}
          </>
        ) : (
          <>
            <div className="msg-bubble">
              {m.typing && !m.text ? (
                <span className="typing"><span /><span /><span /></span>
              ) : m.typing ? (
                <span style={{ color: 'var(--muted)' }}>{m.text}</span>
              ) : (
                <RichText text={m.text} />
              )}
              {m.doc && (
                <button className="msg-doc" onClick={() => onDoc(m.doc!)}>
                  <Icon name="file" />{m.doc}
                </button>
              )}
              {m.confidence != null && <div className="msg-conf"><ConfidenceBadge pct={m.confidence} label="confianza del borrador" /></div>}
            </div>
            {m.time && <div className="msg-time">{m.time}</div>}
          </>
        )}
      </div>
    </div>
  );
}
