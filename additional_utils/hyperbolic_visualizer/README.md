# Hierarchical Text Parser to Hyperbolic Graph Visualizer

A Python tool that parses hierarchical numbered outlines and generates interactive HTML visualizations with **hyperbolic embedding** in a Poincaré disk, styled to match your D3.js/React graph components.

## Features

✨ **Parsing**
- Automatically parses hierarchical numbered outlines (1., 1.1., 1.1.1., etc.)
- Builds a complete tree structure with parent-child relationships
- Handles arbitrary nesting depth

🎨 **Visualization**
- **Hyperbolic embedding** using Poincaré disk projection
- Nodes positioned at radial distances based on their depth level
- Angular distribution for maximum separation and clarity
- Boundary circle showing the hyperbolic space boundary

🖱️ **Interactivity**
- D3.js zoom and pan with smooth transitions
- Hover tooltips showing node title and numbering
- Click to highlight path from any node to root
- Reset view button
- Theme support (light/dark mode CSS variables)

🎯 **Styling**
- Matches your existing design system (color variables, font family)
- Responsive to `prefers-color-scheme` media queries
- CSS variable-based theming for seamless integration
- Node colors by depth level (root, layer 1, layer 2, etc.)

## Installation

```bash
# Clone or download the script
python3 hierarchy_hyperbolic.py --help
```

No external dependencies beyond Python 3.6+! (D3.js is loaded via CDN in HTML output)

## Usage

### Basic Usage

```bash
python3 hierarchy_hyperbolic.py input.txt -o output.html
```

### Arguments

- **`input_file`**: Path to hierarchical text file (required)
- **`-o, --output`**: Output HTML filename (default: `output.html`)
- **`--radius`**: Poincaré disk radius in pixels (default: 200)
- **`--title`**: HTML page title (default: "Hierarchical Graph Visualization")

### Example

```bash
python3 hierarchy_hyperbolic.py sample_hierarchy.txt -o my_graph.html --radius 250
```

Then open `my_graph.html` in a web browser.

## Input Format

The input text file should follow a numbered outline format:

```
0. root

1. layer_1_type_1
1.1. layer_2_type_2
1.1.1. layer_3_type_1
1.1.2. layer_3_type_2
1.1.3. layer_3_type_3

1.2. layer_2_type_3
1.2.1. layer_3_type_4
1.2.2. layer_3_type_5
1.2.3. layer_3_type_6

1.3. layer_2_type_4
1.3.1. layer_3_type_7
1.3.2. layer_3_type_8
1.3.3. layer_3_type_9

1.4. layer_2_type_5
1.4.1. layer_3_type_10
1.4.2. layer_3_type_11
1.4.3. layer_3_type_12


2. layer_1_type_2
2.1. layer_2_type_6
2.1.1. layer_3_type_13
2.1.2. layer_3_type_14
2.1.3. layer_3_type_15

2.2. layer_2_type_7
2.2.1. layer_3_type_16
2.2.2. layer_3_type_17

2.3. layer_2_type_8
2.3.1. layer_3_type_18
2.3.2. layer_3_type_19
2.3.3. layer_3_type_20


3. layer_1_type_3
3.1. layer_2_type_9
3.2. layer_2_type_10


4. layer_1_type_4
4.1. layer_2_type_11
4.2. layer_2_type_12
4.3. layer_2_type_13
4.4. layer_2_type_14
4.5. layer_2_type_15
```

**Rules:**
- Each line starts with a number sequence (1., 1.1., 1.1.1., 2., 2.1., etc.)
- A period follows the number sequence
- Text after the period is the node label
- Blank lines are ignored
- Indentation is optional and ignored (hierarchy determined by numbering)

## Output

The script generates a **single HTML file** containing:

1. **Complete D3.js visualization** with:
   - SVG-based graph rendering
   - Hyperbolic Poincaré disk embedding
   - Zoom/pan controls
   - Interactive tooltips
   - Path highlighting on click

2. **Embedded CSS** with:
   - CSS variable support for theming
   - Light/dark mode responsive design
   - Hover and interaction states
   - Responsive layout

3. **Embedded JavaScript** with:
   - D3.js v7 (loaded via CDN)
   - Full zoom and pan implementation
   - Interactive node selection
   - Tooltip positioning
   - Boundary circle visualization

## Architecture

### Classes

**HierarchyParser**
- Regex-based parsing of numbered outlines
- Builds tree structure with parent-child relationships
- Handles arbitrary nesting depth
- Synthetic root creation if none found

**PoincareDiskLayout**
- Computes hyperbolic coordinates using Poincaré disk model
- Assigns radial distances based on node depth
- Distributes nodes angularly around circles
- Formula: `r_m = R_max * (1 - k^m) / (1 - k^maxLevels)` where k=0.7

**HTMLGenerator**
- Converts tree structure to graph data
- Generates interactive HTML with embedded D3.js
- Applies design system colors and styling
- Handles responsive tooltip positioning

## Styling Integration

The generated HTML uses CSS custom properties that match your design system:

```css
--bg-primary:      Background color
--bg-secondary:    Card/surface background
--bg-tertiary:     Tertiary surface
--text-primary:    Main text color
--text-secondary:  Secondary text color
--border-color:    Border and divider colors
--accent-color:    Primary interactive color
--accent-hover:    Hover state
--accent-active:   Active/pressed state
```

Override these in your application CSS to match your theme:

```css
:root {
  --bg-primary: #fcfcf9;
  --accent-color: #208081;
  /* ... */
}
```

## Performance

- **Parsing**: O(n) where n = number of lines
- **Layout**: O(n + m) where n = nodes, m = edges
- **Rendering**: D3.js handles smooth animation/transitions
- Tested with 1000+ nodes

## Limitations & Future Enhancements

**Current:**
- Static Poincaré disk layout (nodes don't move)
- Unidirectional hyperbolic projection
- No force simulation (yet)

**Potential Enhancements:**
1. Force-directed layout within hyperbolic space
2. Collapsible/expandable node groups
3. Search and filter functionality
4. Export to different formats (SVG, PDF, JSON)
5. Multiple layout algorithms (force, hierarchical, radial)
6. Node drag-to-move with hyperbolic constraints

## Integration with Your React App

To use generated HTML in your React webapp:

1. **Iframe approach** (simplest):
   ```jsx
   <iframe src="graph.html" style={{ width: '100%', height: '100%' }} />
   ```

2. **Direct embedding** (advanced):
   - Extract the D3 rendering code
   - Import into React component with `useEffect`
   - Manage SVG ref like your existing `GraphVisualization.tsx`

3. **Shared styling**:
   - Use same CSS variables
   - Import global theme file
   - Maintain consistent color palette

## Command-Line Examples

### Create graph with default settings
```bash
python3 hierarchy_hyperbolic.py my_data.txt
# Creates: output.html
```

### Create with custom output name and radius
```bash
python3 hierarchy_hyperbolic.py data.txt -o my_graph.html --radius 300
```

### Create with custom title
```bash
python3 hierarchy_hyperbolic.py outline.txt --title "My Knowledge Graph"
```

## Troubleshooting

**Q: Nodes are too close together?**
A: Increase `--radius` parameter (e.g., `--radius 300`)

**Q: Text is cut off in tooltips?**
A: This is CSS-based, edit the `.tooltip` max-width in the generated HTML

**Q: Graph looks too zoomed in/out?**
A: Use the "Reset View" button or scroll to zoom

**Q: Want to change colors?**
A: Edit the CSS variables in the `<style>` section of the generated HTML

## License

MIT - Free to use and modify

## Author Notes

This tool bridges hierarchical text data (like outlines or organizational charts) with hyperbolic geometry visualization. The Poincaré disk provides natural "focus+context" where distant nodes appear at the boundary, allowing large hierarchies to be explored intuitively with minimal visual clutter.

Perfect for:
- Knowledge base visualization
- Organizational hierarchies
- Topic/concept maps
- Taxonomy browsers
- Research paper citation networks
- Product category trees
