import React from 'react';
import styled from '@emotion/styled';

const ControlsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 10;
`;

const ControlLabel = styled.label`
  font-size: 12px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface GraphControlsProps {
  physics: {
    enabled: boolean;
    zoom: number;
  };
  onChange: (key: string, value: any) => void;
}

export const GraphControls: React.FC<GraphControlsProps> = ({ physics, onChange }) => {
  return (
    <ControlsContainer>
      <ControlLabel>
        <input
          type="checkbox"
          checked={physics.enabled}
          onChange={(e) => onChange('enabled', e.target.checked)}
        />
        Enable Zoom
      </ControlLabel>
    </ControlsContainer>
  );
};
