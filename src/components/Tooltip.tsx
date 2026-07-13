import type { ReactNode } from 'react';
import * as RTooltip from '@radix-ui/react-tooltip';

export const TooltipProvider = RTooltip.Provider;

interface Props {
  label: string;
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

/** Tooltip accesible sobre controles solo-icono (Radix). */
export default function Tooltip({ label, children, side = 'top' }: Props) {
  return (
    <RTooltip.Root>
      <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
      <RTooltip.Portal>
        <RTooltip.Content className="tooltip" side={side} sideOffset={6}>
          {label}
          <RTooltip.Arrow className="tooltip-arrow" width={10} height={5} />
        </RTooltip.Content>
      </RTooltip.Portal>
    </RTooltip.Root>
  );
}
