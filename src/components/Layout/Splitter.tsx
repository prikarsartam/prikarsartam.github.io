import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const SplitterContainer = styled.div<{ isDragging: boolean }>`
  width: 4px;
  background-color: ${props => props.isDragging ? 'var(--accent-primary)' : 'var(--bg-primary)'};
  cursor: col-resize;
  transition: background-color 0.2s;
  z-index: 10;
  height: 100%;
  flex-shrink: 0;

  &:hover {
    background-color: var(--accent-primary);
  }
`;

interface SplitterProps {
    onResize: (delta: number) => void;
    onResizeEnd: () => void;
}

export const Splitter: React.FC<SplitterProps> = ({ onResize, onResizeEnd }) => {
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                onResize(e.movementX);
            }
        };

        const handleMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                onResizeEnd();
            }
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        } else {
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDragging, onResize, onResizeEnd]);

    return (
        <SplitterContainer
            isDragging={isDragging}
            onMouseDown={() => setIsDragging(true)}
        />
    );
};
