Pritam Sarkar - hypernotework

---


# [objects are simple](http://prikarsartam.github.io/) 

### - 💬 *MOTTO :*   “ . . .  and anything that man knows, which is not merely rumbling and roaring of mankind, can be said in three words.” - F. Kürnberger [The introductory premise of [*Tractatus Logico Philosophicus*](https://writing.upenn.edu/library/Wittgenstein-Tractatus.pdf) by [*Ludwig Wittgenstein*](https://en.wikipedia.org/wiki/Ludwig_Wittgenstein) ].


---

Scale-free structures are naturally ubiquitous and give rise to hierarchies of objects and concepts at different scales of complexity. Whether a collection of diverse articles is concerned or semantic knowledge graphs of complex text, a scale-free representation of the bird's-eye-view captures the long-range interdependence within, due to the universally critical nature of every major language. However hierarchical graphs are known to be impossible to isometrically (preserving the distances) embed in any Euclidean manifold; but possible, within hyperbolic geometry. The graph in this webapp is made to resemble the discretized geogesics of Poincaré disk model of 2D hyperbolic geometry.


People interested in ( writing + organising + publishing + visualising ) articles/essays/blogs with diverse interdependent topics might enjoy it. Give a try and play around! Any suggestion or improvement is welcome. 

---

**hypernotework** is created to maintain and visualize scalefree embedding of a hierarchical graph of articles inspired from the Poincaré disk model of hyperbolic geometry and criticality of language. 

Creator email: prikarsartam@gmail.com.

---

The following metadata structure is maintained at the beginning of each of the markdown files, to encapsulate the hierarchy in a scalable manner.
```python
---
id:             "str"
title:          "str"
level:           int
color:           hex
parent:          id_of_the_parent        < --- for hierarchical connections
connections :    id_of_other_notes       < --- for arbitrary connections
last_updated:    "YYYY-MM-DD"
---
```


---

## Core Features

### Knowledge Graph
- **Interactive Visualization**: Force-directed graph rendered via D3.js representing notes as nodes and links as edges in hierarchical manner.
- **Controls**: Zoom, pan, and node filtering capabilities along with interactive simulation.

### Note Management
- **Organization**: Hierarchical file system view in the sidebar.
- **Format**: Pure Markdown storage.

### Markdown Rendering Engine
The `FocusView` component provides a rich reading experience with the following support:
- **Common Markdown**: Bold, italic, lists, headers, etc. via `react-markdown`.
- **GitHub Flavored Markdown (GFM)**: Tables, strikethrough, autolinks.
- **Mathematical Notation**: LaTeX rendering via `rehype-katex` / `remark-math`.
- **HTML Support**: Direct rendering of raw HTML tags via `rehype-raw`.
- **Callouts (Admonitions)**: Obsidian-compatible syntax (`> [!NOTE]`) with custom styling and AST-based parsing.
- **Styled Tables**: Fully responsive tables with alternating row colors.
- **Text Alignment**: Custom syntax (`->`, `-><-`) for right and center alignment.



---

Both `dark` and `light` themes are seamlessly supported, along with user-end `customization of panel proportions` in both desktop and handheld mode.

---




## Technical Architecture

### Tech Stack
- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **State**: Zustand
- **Styling**: Emotion (CSS-in-JS) + Framer Motion
- **Icons**: Lucide React

### Project Structure
- `src/components/Graph`: D3 visualization logic.
- `src/components/Notes`: Markdown rendering and note display customization.
- `src/components/Layout`: Application shell and split-pane resizing logic.
- `src/services`: IndexedDB abstraction layer.
- `src/store`: Global state management.
- `src/utils`: Helper functions and Remark plugins.

## Configuration including Colors & Styles
- **Markdown & Callouts**: `src/utils/markdownUtils.ts` defines callout mappings.
- **Visual Styles**: `src/components/Notes/FocusView.styles.tsx` contains specific component styles.
- **Theme**: `src/index.css` defines global CSS variables.

## Running the Project

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```
