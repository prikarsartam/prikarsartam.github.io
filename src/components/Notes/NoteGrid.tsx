import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useStore } from '../../store/useStore';
import { NoteCard } from './NoteCard';
import { FocusView } from './FocusView';
import { CONFIG } from '../../config';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${CONFIG.UI.GRID_COLUMN_MIN_WIDTH}, 1fr));
  gap: 16px;
  padding: 20px;
  overflow-y: auto;
  height: 100%;
  background-color: var(--bg-primary);
`;

const FullPanelContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 0;
  overflow: hidden;
  background-color: var(--bg-primary);
`;

const SearchQuoteBox = styled.div`
  background: transparent;
  /* No border as requested */
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
  height: 200px; /* Same as NoteCard height */
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 20px;
  border-radius: 24px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px rgba(129, 140, 248, 0.2);
  }

  &::placeholder {
    color: var(--text-secondary);
  }
`;

const QuoteText = styled.p`
  font-family: 'Georgia', serif;
  font-style: italic;
  color: var(--text-secondary);
  font-size: 1.0rem; /* 10% smaller */
  margin: 0 0 4px 0;
  line-height: 1.4;
`;

const QuoteAuthor = styled.p`
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 600;
  margin: 0;
  text-align: right;
`;

export const NoteGrid: React.FC = () => {
  const { notes, theme, focusedNoteId, setFocusedNoteId, searchQuery, setSearchQuery } = useStore();

  // Sort notes by updatedAt descending
  const sortedNotes = [...notes].sort((a, b) =>
    new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
  );

  // Filter notes based on search query
  const filteredNotes = sortedNotes.filter(note => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
  }, [theme]);

  // Handle Esc to close focus
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFocusedNoteId(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setFocusedNoteId]);

  if (focusedNoteId) {
    const focusedNote = notes.find(n => n.id === focusedNoteId);
    if (focusedNote) {
      return (
        <FullPanelContainer>
          <FocusView note={focusedNote} onClose={() => setFocusedNoteId(null)} />
        </FullPanelContainer>
      );
    }
  }

  return (
    <GridContainer>
      <SearchQuoteBox>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <SearchInput
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <QuoteText>
            Logic takes care of itself;<br />
            all we have to do<br />
            is to look and see how it does it.
          </QuoteText>
          <QuoteAuthor>- L. Wittgenstein</QuoteAuthor>
        </div>
      </SearchQuoteBox>
      {filteredNotes.map(note => (
        <NoteCard
          key={note.id}
          note={note}
          onClick={() => setFocusedNoteId(note.id)}
        />
      ))}
    </GridContainer>
  );
};
