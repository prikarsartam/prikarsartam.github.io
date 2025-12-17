import React from 'react';
import styled from '@emotion/styled';
import { useStore } from '../../store/useStore';
import { Circle, Moon, Sun } from 'lucide-react';

const SidebarContainer = styled.div`
  width: 250px;
  height: 100%;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const SidebarHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: var(--bg-hover);
    color: var(--text-primary);
  }
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
`;

const LevelGroup = styled.div`
  margin-bottom: 16px;
`;

const LevelHeader = styled.div`
  padding: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const NoteItem = styled.div<{ active: boolean }>`
  padding: 6px 8px;
  margin: 2px 0;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: ${props => props.active ? 'var(--text-primary)' : 'var(--text-secondary)'};
  background-color: ${props => props.active ? 'var(--bg-hover)' : 'transparent'};
  transition: all 0.2s;

  &:hover {
    background-color: var(--bg-hover);
    color: var(--text-primary);
  }
`;

export const HierarchySidebar: React.FC = () => {
  const { notes, focusedNoteId, setFocusedNoteId, theme, toggleTheme } = useStore();

  // Group notes by level
  const notesByLevel = notes.reduce((acc, note) => {
    const level = note.level;
    if (!acc[level]) acc[level] = [];
    acc[level].push(note);
    return acc;
  }, {} as Record<number, typeof notes>);

  return (
    <SidebarContainer>
      <SidebarHeader>
        <span>notework</span>
        <ThemeToggle onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </ThemeToggle>
      </SidebarHeader>
      <ScrollArea>
        {[0, 1, 2, 3].map(level => (
          <LevelGroup key={level}>
            <LevelHeader>Level {level}</LevelHeader>
            {notesByLevel[level]?.map(note => (
              <NoteItem
                key={note.id}
                active={focusedNoteId === note.id}
                onClick={() => setFocusedNoteId(note.id)}
              >
                <Circle size={8} fill="currentColor" stroke="none" />
                {note.title}
              </NoteItem>
            ))}
          </LevelGroup>
        ))}
      </ScrollArea>
    </SidebarContainer>
  );
};
