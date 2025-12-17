# Advanced Integration Guide

## Quick Start

### 1. Run the Python script
```bash
python3 hierarchy_hyperbolic.py sample_hierarchy.txt -o graph.html
```

### 2. Open in browser
```bash
# macOS
open graph.html

# Linux
firefox graph.html

# Windows
start graph.html
```

---

## Integration with Your React Webapp

### Option A: Iframe Embedding (Simplest)

In your React component:

```jsx
// GraphEmbedded.tsx
import React from 'react';
import styled from '@emotion/styled';

const EmbedContainer = styled.div`
  width: 100%;
  height: 100%;
  border: none;
`;

export const GraphEmbedded: React.FC<{ htmlFile: string }> = ({ htmlFile }) => {
  return (
    <EmbedContainer>
      <iframe 
        src={htmlFile}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: 'var(--radius-lg)'
        }}
        title="Hierarchical Graph"
      />
    </EmbedContainer>
  );
};
```

**Pros:** Simple, works immediately
**Cons:** Limited interaction with parent app, separate DOM context

---

### Option B: D3 Component Integration (Advanced)

Extract the D3 rendering and integrate directly into your React component:

```jsx
// HierarchicalGraph.tsx
import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import * as d3 from 'd3';

const GraphContainer = styled.div`
  width: 100%;
  height: 100%;
  background: var(--bg-primary);
  overflow: hidden;
  position: relative;
`;

interface HierarchicalNode {
  id: string;
  label: string;
  title: string;
  level: number;
  x: number;
  y: number;
  parent?: string;
}

interface HierarchicalEdge {
  source: string;
  target: string;
  type: 'hierarchical' | 'arbitrary';
}

interface HierarchicalGraphProps {
  nodes: HierarchicalNode[];
  edges: HierarchicalEdge[];
}

export const HierarchicalGraph: React.FC<HierarchicalGraphProps> = ({ nodes, edges }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // D3 Rendering
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const { width, height } = dimensions;
    const R_MAX = (Math.min(width, height) / 2 - 50) * 0.9;

    // Clear
    d3.select(svgRef.current).selectAll('*').remove();

    // Setup SVG
    const svg = d3.select(svgRef.current)
      .attr('viewBox', [-width / 2, -height / 2, width, height]);

    const mainGroup = svg.append('g');

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        mainGroup.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Boundary circle
    mainGroup.append('circle')
      .attr('r', R_MAX)
      .attr('fill', 'none')
      .attr('stroke', 'var(--border-color)')
      .attr('stroke-dasharray', '5,5')
      .attr('opacity', 0.3)
      .style('pointer-events', 'none');

    // Links
    const link = mainGroup.append('g')
      .selectAll('line')
      .data(edges)
      .join('line')
      .attr('stroke', 'var(--text-secondary)')
      .attr('stroke-width', 1.5)
      .attr('x1', d => nodes.find(n => n.id === d.source)?.x || 0)
      .attr('y1', d => nodes.find(n => n.id === d.source)?.y || 0)
      .attr('x2', d => nodes.find(n => n.id === d.target)?.x || 0)
      .attr('y2', d => nodes.find(n => n.id === d.target)?.y || 0);

    // Nodes
    const nodeRadii: Record<number, number> = {
      0: 12, 1: 8, 2: 6
    };

    const nodeColors: Record<number, string> = {
      0: '#8b5cf6', 1: '#208081', 2: '#f59e61'
    };

    const node = mainGroup.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', d => nodeRadii[d.level] || 5)
      .attr('fill', d => nodeColors[d.level] || '#a67c52')
      .attr('stroke', 'var(--bg-primary)')
      .attr('stroke-width', 2)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('cursor', 'pointer');

    // Tooltip handling
    let hoveredNode: HierarchicalNode | null = null;

    node.on('mouseover', function(event, d) {
      hoveredNode = d;
      d3.select(this).attr('stroke', 'var(--text-primary)');
      // Emit event or update state for tooltip
    })
    .on('mouseout', function() {
      hoveredNode = null;
      d3.select(this).attr('stroke', 'var(--bg-primary)');
    })
    .on('click', (event, d) => {
      event.stopPropagation();
      highlightPath(d.id);
    });

    function highlightPath(nodeId: string) {
      const path = new Set<string>();
      let current = nodes.find(n => n.id === nodeId);

      while (current) {
        path.add(current.id);
        if (current.parent) {
          current = nodes.find(n => n.id === current.parent);
        } else {
          break;
        }
      }

      link.attr('stroke', d =>
        path.has(d.source) && path.has(d.target)
          ? 'var(--accent-color)'
          : 'var(--text-secondary)'
      );

      node.attr('opacity', d =>
        path.has(d.id) ? 1 : 0.3
      );
    }

  }, [nodes, edges, dimensions]);

  return (
    <GraphContainer ref={containerRef}>
      <svg ref={svgRef} />
    </GraphContainer>
  );
};
```

---

## Data Flow Integration

### With Your Existing Store (Zustand/Redux/Context)

```typescript
// In your store
interface GraphState {
  hierarchyText: string;
  nodes: HierarchicalNode[];
  edges: HierarchicalEdge[];
  parseHierarchy: (text: string) => void;
  generateVisualization: () => string; // Returns HTML
}

export const useGraphStore = create<GraphState>((set) => ({
  hierarchyText: '',
  nodes: [],
  edges: [],
  
  parseHierarchy: (text: string) => {
    // Call Python backend or use JS parser
    // Update nodes and edges
  },
  
  generateVisualization: () => {
    // Call Python endpoint to generate HTML
    return '<!-- HTML -->';
  }
}));
```

### Backend Integration (Node.js/Python)

**Python (FastAPI):**
```python
from fastapi import FastAPI
from hierarchy_hyperbolic import HierarchyParser, PoincareDiskLayout, HTMLGenerator

app = FastAPI()

@app.post("/generate-graph")
async def generate_graph(text: str, radius: float = 200):
    parser = HierarchyParser()
    nodes = parser.parse(text)
    
    layout = PoincareDiskLayout(radius=radius)
    positions = layout.compute_layout(nodes, parser.root.id)
    
    gen = HTMLGenerator(nodes, positions)
    html = gen.generate()
    
    return {"html": html, "node_count": len(nodes)}
```

**Node.js Wrapper:**
```javascript
const { spawn } = require('child_process');

async function generateGraph(text, radius = 200) {
  return new Promise((resolve, reject) => {
    const python = spawn('python3', ['hierarchy_hyperbolic.py', '-']);
    
    let output = '';
    
    python.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    
    python.on('close', (code) => {
      if (code === 0) resolve(output);
      else reject(new Error(`Process exited with code ${code}`));
    });
    
    python.stdin.write(text);
    python.stdin.end();
  });
}
```

---

## Styling Customization

### Matching Your Design System

In your global CSS or theme file:

```css
:root {
  /* Customize these to match your theme */
  --bg-primary: #fcfcf9;
  --bg-secondary: #ffffff;
  --text-primary: #134252;
  --text-secondary: #626c71;
  --border-color: rgba(94, 82, 64, 0.2);
  --accent-color: #208081;
  --accent-hover: #1d7480;
  --accent-active: #1a6873;
  
  /* Node colors by level */
  --node-color-0: #8b5cf6;  /* Root - Purple */
  --node-color-1: #208081;  /* L1 - Teal */
  --node-color-2: #f59e61;  /* L2 - Orange */
  --node-color-3: #a67c52;  /* L3 - Brown */
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1f2121;
    --bg-secondary: #262828;
    --text-primary: #f5f5f5;
    --text-secondary: rgba(167, 169, 169, 0.7);
    --border-color: rgba(119, 124, 124, 0.3);
    --accent-color: #32b8c6;
    --accent-hover: #2da6b2;
  }
}
```

---

## Performance Optimization

### For Large Hierarchies (1000+ nodes)

1. **Throttle zoom/pan updates:**
```javascript
const throttledZoom = d3.zoom()
  .on('zoom', throttle((event) => {
    mainGroup.attr('transform', event.transform);
  }, 30)); // 30ms throttle
```

2. **Use WebGL rendering for massive graphs:**
```javascript
// Use regl or Babylon.js for WebGL rendering
// Hyperbolic embedding still applies to layout
```

3. **Lazy load nodes:**
```javascript
// Only render nodes within viewport
const culledNodes = nodes.filter(n => {
  const dist = Math.sqrt(n.x ** 2 + n.y ** 2);
  return dist < maxRadius * 1.2; // 20% margin
});
```

---

## Advanced Features to Add

### 1. Search & Filter
```typescript
interface GraphState {
  searchQuery: string;
  filteredNodes: Set<string>;
  
  setSearchQuery: (query: string) => void;
}
```

### 2. Node Drag-to-Move
```javascript
const drag = d3.drag()
  .on('start', (event, d) => {
    // Start dragging
  })
  .on('drag', (event, d) => {
    // Apply hyperbolic constraints to movement
    applyHyperbolicConstraint(d, event.x, event.y);
  });
```

### 3. Export Functionality
```python
# In Python script, add:
def export_svg(self) -> str:
    """Export as standalone SVG"""
    return self.svg_content

def export_json(self, nodes, edges) -> Dict:
    """Export as JSON graph format"""
    return {"nodes": nodes, "edges": edges}
```

### 4. Multiple Layout Algorithms
```python
class LayoutFactory:
    @staticmethod
    def create(layout_type: str, **kwargs):
        if layout_type == 'hyperbolic':
            return PoincareDiskLayout(**kwargs)
        elif layout_type == 'force-directed':
            return ForceDirectedLayout(**kwargs)
        # ...
```

---

## Troubleshooting Integration

**Issue: Graph doesn't update when text changes**
- Solution: Add dependency array to useEffect
```jsx
useEffect(() => { /* ... */ }, [nodeData, edgeData])
```

**Issue: Tooltips appear in wrong position**
- Solution: Recalculate position after zoom transform
```javascript
const transform = d3.zoomTransform(svgElement);
const screenX = (node.x * transform.k + transform.x) + width / 2;
```

**Issue: Dark mode colors not applying**
- Solution: Ensure CSS variables are defined and referenced
```css
/* In generated HTML, use variables not hardcoded colors */
fill: var(--node-color-1, #208081);
```

---

## Tips for Best Results

1. **Keep hierarchy balanced** - Avoid deeply nested single-child chains
2. **Use descriptive labels** - Short (2-5 words) for clarity in visualization
3. **Test with sample data first** - Use sample_hierarchy.txt as baseline
4. **Adjust radius for content** - Larger radius = more spacing between nodes
5. **Monitor performance** - Use browser DevTools for graphs >500 nodes
6. **Version control the HTML** - Generated HTML is standalone and portable

---

## Support & Debugging

### Enable Debug Logging
Modify Python script to add print statements:
```python
print(f"Parsed {len(nodes)} nodes")
print(f"Max depth: {max(n.level for n in nodes.values())}")
print(f"Layout computed: {len(positions)} positions")
```

### Browser Console Inspection
```javascript
// In browser console, inspect D3 data
console.log(d3.select('#graph').data());
console.log(d3.selectAll('.node').data());
```

### Common Regex Patterns
If your outline format differs, adjust `PATTERN` in `HierarchyParser`:
```python
# For markdown headers
PATTERN = re.compile(r'^(#+)\s+(.+)$')

# For indentation-based
PATTERN = re.compile(r'^(\s*)(.+)$')

# For custom prefixes
PATTERN = re.compile(r'^\[(\d+)\]\s+(.+)$')
```
