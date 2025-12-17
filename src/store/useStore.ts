import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loadNotes, buildHierarchy, toggleConnection, type Note } from '../services/storage';

interface AppState {
    // Notes
    notes: Note[];
    hierarchy: Map<number, Note[]>;
    loadNotes: () => Promise<void>;

    // UI State
    currentNoteId: string | null;
    selectNote: (id: string | null) => void;

    focusedNoteId: string | null;
    setFocusedNoteId: (id: string | null) => void;

    // Panels
    leftPanelWidth: number;
    setLeftPanelWidth: (width: number) => void;

    hierarchySidebarOpen: boolean;
    toggleHierarchySidebar: () => void;

    // Theme
    theme: 'dark' | 'light';
    toggleTheme: () => void;

    // Graph Connections
    arbitraryConnections: string[];
    toggleArbitraryConnection: (nodeA: string, nodeB: string) => void;

    // Search
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            // Notes
            notes: [],
            hierarchy: new Map(),
            loadNotes: async () => {
                const notes = await loadNotes();
                const hierarchy = buildHierarchy(notes);
                set({ notes, hierarchy });
            },

            // UI State
            currentNoteId: null,
            selectNote: (id) => set({ currentNoteId: id }),

            focusedNoteId: null,
            setFocusedNoteId: (id) => set({ focusedNoteId: id }),

            // Panels
            leftPanelWidth: 300,
            setLeftPanelWidth: (width) => set({ leftPanelWidth: width }),

            hierarchySidebarOpen: false,
            toggleHierarchySidebar: () => set((state) => ({ hierarchySidebarOpen: !state.hierarchySidebarOpen })),

            // Theme
            theme: 'dark',
            toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

            // Search
            searchQuery: '',
            setSearchQuery: (query) => set({ searchQuery: query }),

            // Graph Connections
            arbitraryConnections: [],
            toggleArbitraryConnection: (nodeA, nodeB) => {
                toggleConnection(nodeA, nodeB);
                // Update local state to trigger re-render
                set((state) => {
                    const conn = `${nodeA}::${nodeB}`;
                    const reverse = `${nodeB}::${nodeA}`;
                    const exists = state.arbitraryConnections.includes(conn) || state.arbitraryConnections.includes(reverse);
                    if (exists) {
                        return { arbitraryConnections: state.arbitraryConnections.filter(c => c !== conn && c !== reverse) };
                    } else {
                        return { arbitraryConnections: [...state.arbitraryConnections, conn] };
                    }
                });
            },
        }),
        {
            name: 'notework-storage',
            partialize: (state) => ({
                leftPanelWidth: state.leftPanelWidth,
                theme: state.theme,
                hierarchySidebarOpen: state.hierarchySidebarOpen,
            }),
        }
    )
);
