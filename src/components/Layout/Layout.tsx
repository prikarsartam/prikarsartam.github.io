import React, { useRef } from 'react';
import styled from '@emotion/styled';
import { useStore } from '../../store/useStore';
import { Splitter } from './Splitter';

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  background-color: var(--bg-primary);
  overflow: hidden;
`;

const Panel = styled.div`
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const LeftPanel = styled(Panel)`
  background-color: var(--bg-secondary);
`;

const RightPanel = styled(Panel)`
  background-color: var(--bg-primary);
  flex: 1;
`;

interface LayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ left, right }) => {
  const { leftPanelWidth, setLeftPanelWidth } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleResize = (delta: number) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const deltaPercentage = (delta / containerWidth) * 100;
      const newWidth = Math.min(Math.max(leftPanelWidth + deltaPercentage, 25), 75);
      setLeftPanelWidth(newWidth);
    }
  };

  return (
    <Container ref={containerRef}>
      <LeftPanel style={{ width: `${leftPanelWidth}%` }}>
        {left}
      </LeftPanel>
      <Splitter onResize={handleResize} onResizeEnd={() => { }} />
      <RightPanel>
        {right}
      </RightPanel>
    </Container>
  );
};
