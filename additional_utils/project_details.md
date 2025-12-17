# Project Details: HyperNotework

## 1. Major Functions & Role Implementation

### Core Application
- **Role**: `src/App.tsx`, `src/main.tsx`
- **Function**: Entry point of the React application. Sets up the main layout and global providers (if any).

### Layout & Navigation
- **Role**: `src/components/Layout/`
  - `HyperNoteworkPanel.tsx`: The main orchestrator layout.
  - `HierarchySidebar.tsx`: Left sidebar showing file system/notes tree.
  - `SplitPane.tsx` / `Splitter.tsx`: Handles the draggable resizing of panels.
  - `Layout.tsx`: General wrapper.
- **Function**: Provides the structural skeleton, separating the Sidebar, Graph, and Note viewing areas.

### Graph Visualization
- **Role**: `src/components/Graph/`
  - `GraphVisualization.tsx`: The visual engine using D3.js to render nodes and links.
  - `GraphControls.tsx`: UI for zooming, filtering.
  - `GraphPanel.tsx`: Container for the visualization.
  - `GraphTooltip.tsx`: Hover state information.
- **Function**: Visualizes the connections between notes (knowledge graph).

### Note Viewing & Editing
- **Role**: `src/components/Notes/`
  - `FocusView.tsx`: The primary "Reader" view. Renders Markdown content.
  - `FocusView.styles.tsx`: Styled components for the reader.
  - `NoteGrid.tsx` / `NoteCard.tsx`: Gallery view of notes.
- **Utils**: `src/utils/markdownUtils.ts`
  - Contains plugin logic (`remarkCallouts`) and helpers for Markdown rendering.
- **Function**: Displays formatted content including math, tables, HTML, and callouts.

### State Management
- **Role**: `src/store/useStore.ts`
- **Function**: Global state using Zustand (active note, graph data, settings).

### Storage Service
- **Role**: `src/services/storage.ts`
- **Function**: Interfaces with `IndexedDB` to save/retrieve notes persistently.

---

## 2. UI Customization

### Markdown & Callouts
- **Location**: `src/utils/markdownUtils.ts` (Colors & Logic)
- **Location**: `src/components/Notes/FocusView.styles.tsx` (CSS/Styled Components)
- **Customization**:
    - **Colors**: Edit `calloutColors` object in `markdownUtils.ts`.
    - **Styles**: Edit `AlertContainer` or `MarkdownContent` in `FocusView.styles.tsx`.

### Graph Appearance
- **Location**: `src/components/Graph/GraphVisualization.tsx`
- **Customization**:
    - Node colors, link thickness, and forces are defined within the D3 configuration in the `useEffect` hooks.

### Theme Colors
- **Location**: `src/index.css`
- **Customization**: CSS variables (`--bg-primary`, `--text-primary`, etc.) control the global dark/light theme palette.

---

## 3. Git Repository Guidelines

### Files/Directories to Commit
These files are absolutely necessary for the project to build and run.

- `src/` (All source code)
- `public/` (Static assets)
- `index.html` (Entry HTML)
- `package.json` (Dependencies)
- `tsconfig.json` & `tsconfig.*.json` (TypeScript config)
- `vite.config.ts` (Build config)
- `README.md` (Documentation)
- `project_details.md` (Project info)

### Files/Directories to Git-Ignore
These files are generated or local-only and should **not** be uploaded.

```gitignore
node_modules/
dist/
.DS_Store
.env
.env.local
*.log
coverage/
```
