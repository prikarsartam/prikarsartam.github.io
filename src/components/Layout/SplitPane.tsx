import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';

interface SplitPaneProps {
    left: React.ReactNode;
    right: React.ReactNode;
    initialSplit?: number;
    isVertical?: boolean; // Force vertical split
}

const Container = styled.div<{ isVertical: boolean }>`
  display: flex;
  flex-direction: ${props => (props.isVertical ? 'column' : 'row')};
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Pane = styled.div<{ size: number; isVertical: boolean }>`
  flex: 0 0 auto;
  width: ${props => (props.isVertical ? '100%' : `${props.size}%`)};
  height: ${props => (props.isVertical ? `${props.size}%` : '100%')};
  overflow: hidden;
  position: relative;
`;

const Resizer = styled.div<{ isVertical: boolean }>`
  flex: 0 0 auto;
  width: ${props => (props.isVertical ? '100%' : '4px')};
  height: ${props => (props.isVertical ? '4px' : '100%')};
  background: var(--border-color);
  cursor: ${props => (props.isVertical ? 'row-resize' : 'col-resize')};
  z-index: 10;
  transition: background 0.2s;

  &:hover, &:active {
    background: var(--accent-color);
  }
`;

export const SplitPane: React.FC<SplitPaneProps> = ({ left, right, initialSplit = 40, isVertical: forceVertical }) => {
    const [split, setSplit] = useState(initialSplit);
    const [isVerticalState, setIsVerticalState] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    // Use forced vertical if provided, otherwise detect based on width
    const isVertical = forceVertical !== undefined ? forceVertical : isVerticalState;

    useEffect(() => {
        if (forceVertical !== undefined) return; // Skip auto-detection if forced

        const checkOrientation = () => {
            if (window.innerWidth < 768) {
                setIsVerticalState(true);
            } else {
                setIsVerticalState(false);
            }
        };

        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        return () => window.removeEventListener('resize', checkOrientation);
    }, [forceVertical]);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        isDragging.current = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = isVertical ? 'row-resize' : 'col-resize';
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        let newSplit;

        if (isVertical) {
            const offsetY = e.clientY - rect.top;
            newSplit = (offsetY / rect.height) * 100;
        } else {
            const offsetX = e.clientX - rect.left;
            newSplit = (offsetX / rect.width) * 100;
        }

        if (newSplit < 5) newSplit = 5;
        if (newSplit > 95) newSplit = 95;

        setSplit(newSplit);
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';
    };

    const handleTouchStart = (_: React.TouchEvent) => {
        isDragging.current = true;
        document.body.style.cursor = isVertical ? 'row-resize' : 'col-resize';
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging.current || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        let newSplit;

        if (isVertical) {
            const offsetY = touch.clientY - rect.top;
            newSplit = (offsetY / rect.height) * 100;
        } else {
            const offsetX = touch.clientX - rect.left;
            newSplit = (offsetX / rect.width) * 100;
        }

        if (newSplit < 10) newSplit = 10;
        if (newSplit > 90) newSplit = 90;

        setSplit(newSplit);
    };

    const handleTouchEnd = () => {
        isDragging.current = false;
        document.body.style.cursor = 'default';
    };

    return (
        <Container ref={containerRef} isVertical={isVertical}>
            <Pane size={split} isVertical={isVertical}>
                {left}
            </Pane>
            <Resizer
                isVertical={isVertical}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            />
            <Pane size={100 - split} isVertical={isVertical}>
                {right}
            </Pane>
        </Container>
    );
};
