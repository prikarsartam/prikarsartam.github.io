# Project Details: HyperNotework

This document details the architecture, configuration locations, and customization guides for the HyperNotework application.

---

## 1. Major Functions & Role Implementation

### Core Application
- **Role**: `src/App.tsx`, `src/main.tsx`
- **Function**: Entry point of the React application. Sets up the main layout and global providers.

### Layout & Navigation
- **Role**: `src/components/Layout/`
  - `HyperNoteworkPanel.tsx`: The main sidebar/orchestrator layout.
  - `HierarchySidebar.tsx`: Left sidebar showing file system/notes tree.
  - `SplitPane.tsx`: Handles draggable resizing between panels (Graph vs Sidebar, Graph vs Note).
  - `Layout.tsx`: General wrapper.
- **Function**: Provides the structural skeleton, separating the Sidebar, Graph, and Note viewing areas.

### Graph Visualization
- **Role**: `src/components/Graph/`
  - `GraphVisualization.tsx`: The visual engine using D3.js.
  - `GraphControls.tsx`: UI for zooming, resetting view.
  - `GraphPanel.tsx`: Container component.
  - `GraphTooltip.tsx`: Interactive tooltip on hover.
- **Function**: Visualizes the connections between notes as a force-directed graph.

### Note Viewing & Editing (FocusView)
- **Role**: `src/components/Notes/`
  - `FocusView.tsx`: The primary "Reader" view. Renders Markdown content.
  - `FocusView.styles.tsx`: Styled components (CSS-in-JS) for the reader.
  - `NoteGrid.tsx` / `NoteCard.tsx`: Gallery view of notes within the sidebar.
- **Utils**: `src/utils/markdownUtils.ts`
  - Contains plugin logic (`remarkCallouts`) and helpers (`getCalloutColor`, `getAlignment`).
- **Function**: Displays formatted content including math (KaTeX), tables (GFM), HTML, and custom callouts.

### State Management & Storage
- **Store**: `src/store/useStore.ts` (Zustand: Active note, search query, graph data).
- **Service**: `src/services/storage.ts` (IndexedDB: Persistent local storage).

---

## 2. Configuration & Customization Guide

### A. Graph Configurations & Interactions
**Location**: `src/config.ts` (Primary) & `src/components/Graph/GraphVisualization.tsx` (Logic)

1.  **Physics & Forces**:
    -   File: `src/config.ts` -> `CONFIG.GRAPH`
    -   `RADIUS_SCALE`: Controls the spread of the graph.
    -   `ANIMATION.VELOCITY_DECAY`: Controls how fast nodes settle (higher = slower).
    -   `ANIMATION.STRENGTH_CHARGE`: Repulsion force between nodes (negative value).

2.  **Node Appearance**:
    -   File: `src/config.ts` -> `CONFIG.GRAPH.NODES`
    -   `RADIUS_L0`, `RADIUS_L1`: Size of nodes at different hierarchy levels.
    -   `DIMMED_OPACITY`: Opacity of non-highlighted nodes.

3.  **Interactions (Hover/Click)**:
    -   File: `src/components/Graph/GraphVisualization.tsx`
    -   **Mobile Hover**: Disabled in the `mouseover` event handler (search for `window.matchMedia('(hover: none)')`).
    -   **Click**: `on("click")` handler manages selection and focus.

### B. HyperNotework Panel configurations
**Location**: `src/components/Layout/HyperNoteworkPanel.tsx`

1.  **Title Font Size**:
    -   Find `const Title = styled.h1`. Change `font-size: 0.9rem`.
2.  **Note Item Cards**:
    -   Find `const NoteItem = styled.div`.
    -   Modify `min-height`, `border`, or padding to change density.
3.  **Level Headers**:
    -   Find `const LevelHeader = styled.div`. Change `text-transform`, `border-left` color, etc.

### C. NoteCard, NoteGrid & FocusView
**Location**: `src/components/Notes/`

1.  **NoteGrid Layout**:
    -   File: `src/components/Layout/HyperNoteworkPanel.tsx` (Grid definition is here for the sidebar).
    -   Look for `const Grid = styled.div`. Change `minmax(100px, 1fr)` to adjust column width.
2.  **FocusView Styles**:
    -   File: `src/components/Notes/FocusView.styles.tsx`
    -   **Container Width/Padding**: Edit `Container` or `ScrollArea`.
    -   **Font Sizes**: Edit `MarkdownContent`.
3.  **Link Behavior**:
    -   File: `src/components/Notes/FocusView.tsx` inside `components={{ a: ... }}`.
    -   Currently set to `target="_blank"`. Remove to open in same tab.

### D. Panel Percentages (Desktop & Mobile)
**Location**: `src/components/Layout/SplitPane.tsx` & `src/components/Layout/Layout.tsx`

1.  **Default Split Ratio**:
    -   File: `src/components/Layout/Layout.tsx` (Usage of SplitPane).
    -   Look for `<SplitPane initialSplit={30} ... />`.
    -   **Desktop**: The `30` means 30% left panel, 70% right panel.
2.  **Mobile Behavior**:
    -   File: `src/components/Layout/SplitPane.tsx`.
    -   Logic in `checkOrientation` determines if it switches to Vertical mode (column) on logic `window.innerWidth < 768`.

### E. Theme Coloring
**Location**: `src/config.ts` & `src/index.css`

1.  **Color Palette**:
    -   File: `src/config.ts` -> `CONFIG.THEME.{LIGHT|DARK}`.
    -   Change `bgPrimary`, `textPrimary`, `accentColor` here.
2.  **CSS Variables**:
    -   File: `src/index.css`.
    -   Top-level variables (e.g., `--bg-primary`) are mapped to the usage in components.

### F. CallOuts (Block-quotes) & Icons
**Location**: `src/utils/markdownUtils.ts` (Logic) & `src/components/Notes/FocusView.styles.tsx` (Style)

1.  **Changing Colors**:
    -   File: `src/utils/markdownUtils.ts`.
    -   Edit `export const calloutColors`. Key = Callout Type (e.g., 'note'), Value = Hex Color.
2.  **Changing Icons**:
    -   File: `src/utils/markdownUtils.ts`.
    -   Edit `getCalloutIcon` switch statement. Import new icons from `lucide-react`.
3.  **Styling (Border/Background)**:
    -   File: `src/components/Notes/FocusView.styles.tsx`.
    -   Edit `AlertContainer` styled component.
    -   `background-color` uses a hex-opacity logic (`${props.color}1a` = ~10% opacity). Remove `1a` for solid color.

---

## 3. Git Repository Guidelines

### Files/Directories to Commit
- `src/` (All source code)
- `public/` (Static assets)
- `index.html` (Entry HTML)
- `package.json`
- `tsconfig.json`, `vite.config.ts`
- `README.md`, `project_details.md`

### Files/Directories to Git-Ignore
```gitignore
node_modules/
dist/
.DS_Store
.env
*.log
coverage/
```
