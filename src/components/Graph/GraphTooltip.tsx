import { forwardRef } from 'react';
import styled from '@emotion/styled';

const TooltipContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1000;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: var(--text-primary);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: none; /* Hidden by default */
  white-space: nowrap;
  transform: translate(-50%, -100%); /* Center above node */
  margin-top: -8px; /* Offset */
`;

export const GraphTooltip = forwardRef<HTMLDivElement>((_, ref) => {
    return <TooltipContainer ref={ref} />;
});

GraphTooltip.displayName = 'GraphTooltip';
