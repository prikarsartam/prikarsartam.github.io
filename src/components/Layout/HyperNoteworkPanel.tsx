import React from 'react';
import styled from '@emotion/styled';
import { useStore } from '../../store/useStore';
import { Moon, Sun } from 'lucide-react';

const PanelContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--panel-border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 9px 6px;
  border-bottom: 1px solid var(--panel-border-color);
  display: flex;
  align-items: center;
  gap: 5px;

  /* position relative to allow absolute centering of title */
  position: relative;
  justify-content: flex-end;
`;

const Title = styled.h1`
  font-size: 0.9rem;           /* adjust this value */
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100%) /* reserve space for toggle button */
`;

const TitleContainer = styled.div`
  /* center title absolutely */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  
`;

// const Logo = styled.img`
//   width: 24px;
//   height: 24px;
// `;

const ThemeToggle = styled.button`
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: var(--bg-hover);
    color: var(--text-primary);
    border-color: var(--accent-color);
  }
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const LevelGroup = styled.div`
  margin-bottom: 10px;
`;

const LevelHeader = styled.div`
  font-size: 0.5rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 5px;
  padding-left: 4px;
  border-left: 2px solid var(--accent-color);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 2px;
`;

const NoteItem = styled.div<{ active: boolean }>`
  padding: 1px;
  border-radius: 5px;
  cursor: pointer;
  background-color: transparent;
  border: 1px solid ${props => props.active ? 'var(--accent-color)' : 'var(--border-color)'};
  position: relative;
  transition: all 0.2s;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 8px 8px 0 0;
    border-color: ${props => props.active ? 'var(--accent-color)' : 'var(--text-secondary)'} transparent transparent transparent;
    opacity: 0.5;
  }

  &:hover {
    border-color: var(--accent-color);
    transform: translateY(-10px);
    box-shadow: var(--card-shadow);
  }
`;

const NoteTitle = styled.span`
  font-size: 0.75rem;
  color: var(--text-primary);
  font-weight: 500;
  line-height: 1.3;
`;

export const HyperNoteworkPanel: React.FC = () => {
  const { notes, focusedNoteId, setFocusedNoteId, theme, toggleTheme } = useStore();

  // Group notes by level
  const notesByLevel = notes.reduce((acc, note) => {
    const level = note.level;
    if (!acc[level]) acc[level] = [];
    acc[level].push(note);
    return acc;
  }, {} as Record<number, typeof notes>);

  return (
    <PanelContainer>
      <Header>
        <TitleContainer>
          {/* <Logo src="/logo.svg" alt="Logo" /> */}
          <Title>hypernotework</Title>
        </TitleContainer>
        <ThemeToggle onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </ThemeToggle>
      </Header>
      <ScrollArea>
        {[0, 1, 2, 3].map(level => (
          <LevelGroup key={level}>
            <LevelHeader>Level {level}</LevelHeader>
            <Grid>
              {notesByLevel[level]?.map(note => (
                <NoteItem
                  key={note.id}
                  active={focusedNoteId === note.id}
                  onClick={() => setFocusedNoteId(note.id)}
                >
                  <NoteTitle>{note.title}</NoteTitle>
                </NoteItem>
              ))}
            </Grid>
          </LevelGroup>
        ))}
      </ScrollArea>
    </PanelContainer>
  );
};
