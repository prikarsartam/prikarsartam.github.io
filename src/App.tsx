import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { NoteGrid } from './components/Notes/NoteGrid';
import { GraphPanel } from './components/Graph/GraphPanel';
import { HyperNoteworkPanel } from './components/Layout/HyperNoteworkPanel';
import { SplitPane } from './components/Layout/SplitPane';
import { useStore } from './store/useStore';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  overflow: hidden;
`;

export const App: React.FC = () => {
  const { loadNotes, notes, setFocusedNoteId, focusedNoteId } = useStore();

  // Load notes on mount
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const hasInitialCheckRun = React.useRef(false);

  // Handle Hash Routing
  useEffect(() => {
    // Only run if notes are loaded and we haven't checked yet
    if (notes.length > 0 && !hasInitialCheckRun.current) {
      const hash = window.location.hash.slice(1); // Remove #

      if (hash) {
        // Find note by ID (exact match) or slugified title
        const note = notes.find(n =>
          n.id === hash ||
          n.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === hash
        );

        if (note) {
          setFocusedNoteId(note.id);
        }
      } else {
        // Default to Root Node (Level 0) if no hash
        // this determines the initial note or the landing page
        const rootNote = notes.find(n => n.id === 'root');
        if (rootNote) {
          setFocusedNoteId(rootNote.id);
        }
      }

      hasInitialCheckRun.current = true;
    }
  }, [notes, setFocusedNoteId]);

  // Update Hash when focused note changes
  useEffect(() => {
    // Only sync hash AFTER initial check has run
    if (!hasInitialCheckRun.current) return;

    if (focusedNoteId) {
      const note = notes.find(n => n.id === focusedNoteId);
      if (note) {
        const slug = note.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        // Update hash without scrolling
        window.history.replaceState(null, '', `#${slug}`);
      }
    } else {
      // Clear hash
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  }, [focusedNoteId, notes]);

  // Responsive Layout
  const [isPortrait, setIsPortrait] = React.useState(window.matchMedia("(orientation: portrait)").matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(orientation: portrait)");
    const handleOrientationChange = (e: MediaQueryListEvent) => setIsPortrait(e.matches);

    mediaQuery.addEventListener('change', handleOrientationChange);
    return () => mediaQuery.removeEventListener('change', handleOrientationChange);
  }, []);

  return (
    <AppContainer>
      <MainContent>
        {isPortrait ? (
          // Portrait: Top Row (Graph | Sidebar) / Bottom Row (Notes)
          <SplitPane
            initialSplit={22} // Top 25%
            isVertical={true} // Top/Bottom split
            left={
              <SplitPane
                initialSplit={46} // Left 45%
                isVertical={false} // Left/Right split for Graph/Sidebar
                left={<GraphPanel />}
                right={<HyperNoteworkPanel />}
              />
            }
            right={<NoteGrid />}
          />
        ) : (
          // Landscape: Left Column (Graph / Sidebar) | Right Column (Notes)
          <SplitPane
            initialSplit={35}
            left={
              <SplitPane
                initialSplit={60}
                isVertical={true} // Top/Bottom split for Graph/Sidebar
                left={<GraphPanel />}
                right={<HyperNoteworkPanel />}
              />
            }
            right={<NoteGrid />}
          />
        )}
      </MainContent>
    </AppContainer>
  );
};
