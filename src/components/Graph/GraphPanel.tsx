import React from 'react';
import styled from '@emotion/styled';
import { GraphVisualization } from './GraphVisualization';


const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-secondary);
`;

export const GraphPanel: React.FC = () => {
  return (
    <Container>
      <GraphVisualization />
    </Container>
  );
};
