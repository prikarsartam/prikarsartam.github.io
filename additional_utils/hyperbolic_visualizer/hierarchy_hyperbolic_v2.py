#!/usr/bin/env python3
"""
Hierarchical Text Parser to Hyperbolic Graph Visualizer (Enhanced)

Parses hierarchical outline text (e.g., 1. 1.1. 1.1.1.) and generates
an interactive HTML visualization with hyperbolic embedding in a Poincaré disk.

IMPROVEMENTS:
- Robust error handling and input validation
- Persistent node labels (always visible, not just on hover)
- Font sizing by node level
- Text shadows for contrast
- Better edge case handling
"""

import re
import json
import math
import argparse
import sys
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from pathlib import Path


@dataclass
class TreeNode:
    """Represents a node in the hierarchical tree"""
    id: str
    label: str
    title: str
    level: int
    parent: Optional[str] = None
    children: List[str] = field(default_factory=list)
    
    def to_dict(self):
        return {
            'id': self.id,
            'label': self.label,
            'title': self.title,
            'level': self.level,
            'parent': self.parent,
            'children': self.children
        }


class HierarchyParser:
    """Parses hierarchical outline text into a tree structure"""
    
    # Pattern: matches lines like "1.", "1.1.", "1.1.1.", etc.
    PATTERN = re.compile(r'^(\d+(?:\.\d+)*)\.\s+(.+)$')
    
    def __init__(self):
        self.nodes: Dict[str, TreeNode] = {}
        self.root: Optional[TreeNode] = None
        self.node_id_counter = 0
    
    def parse(self, text: str) -> Dict[str, TreeNode]:
        """
        Parse hierarchical text and return tree structure
        
        Args:
            text: Hierarchical text with numbered outline format
            
        Returns:
            Dictionary of TreeNode objects
            
        Raises:
            ValueError: If text is empty or invalid
        """
        if not text or not text.strip():
            raise ValueError("Input text is empty")
        
        lines = text.strip().split('\n')
        current_path: Dict[int, str] = {}  # Maps level to node_id
        
        for line_num, line in enumerate(lines, 1):
            line = line.strip()
            if not line:
                continue
            
            match = self.PATTERN.match(line)
            if not match:
                # Skip lines that don't match pattern
                continue
            
            try:
                numbering = match.group(1)
                label = match.group(2).strip()
                
                if not label:
                    continue
                
                # Calculate depth from numbering
                level = numbering.count('.') + 1
                node_id = f"node_{self.node_id_counter}"
                self.node_id_counter += 1
                
                # Determine parent
                parent_id = None
                if level > 1:
                    parent_id = current_path.get(level - 1)
                
                # Create node
                node = TreeNode(
                    id=node_id,
                    label=numbering,
                    title=label,
                    level=level,
                    parent=parent_id
                )
                
                # Add to parent's children if it exists
                if parent_id and parent_id in self.nodes:
                    self.nodes[parent_id].children.append(node_id)
                
                # Update current path
                current_path[level] = node_id
                # Clear deeper levels
                to_remove = [k for k in current_path if k > level]
                for k in to_remove:
                    del current_path[k]
                
                self.nodes[node_id] = node
                
                # First node with level 1 is root (or create synthetic root)
                if level == 1 and self.root is None:
                    self.root = node
            
            except Exception as e:
                print(f"Warning: Error parsing line {line_num}: {line}")
                print(f"  Error: {e}")
                continue
        
        # Validation
        if not self.nodes:
            raise ValueError("No valid nodes found in input text. Check format.")
        
        # If no root found, create synthetic root
        if not self.root:
            self.root = TreeNode(
                id="node_root",
                label="0",
                title="root",
                level=0,
                parent=None
            )
            self.nodes["node_root"] = self.root
            # Attach all level-1 nodes to synthetic root
            for node in list(self.nodes.values()):
                if node.level == 1:
                    node.parent = self.root.id
                    self.root.children.append(node.id)
        
        return self.nodes


class PoincareDiskLayout:
    """
    Computes hyperbolic coordinates using Poincaré disk model.
    Places nodes at radial distances corresponding to their depth,
    with angular distribution among siblings.
    """
    
    def __init__(self, radius: float = 200, max_depth: int = 10):
        self.radius = radius  # Maximum radius of disk
        self.max_depth = max_depth
        self.k = 0.7  # Decay factor for exponential radius scaling
        self.positions: Dict[str, Tuple[float, float]] = {}
    
    def compute_layout(self, nodes: Dict[str, TreeNode], root_id: str):
        """
        Compute Poincaré disk positions for all nodes
        
        Args:
            nodes: Dictionary of all TreeNode objects
            root_id: ID of the root node
            
        Returns:
            Dictionary mapping node IDs to (x, y) positions
        """
        if not nodes:
            raise ValueError("No nodes to layout")
        
        self.positions = {}
        
        # DFS traversal to assign angles
        angles: Dict[str, float] = {}
        
        def assign_angles(node_id: str, parent_id: Optional[str], 
                         start_angle: float, end_angle: float):
            """Assign angles to node and its children"""
            if node_id not in nodes:
                return
            
            node = nodes[node_id]
            
            # Assign angle to this node
            angles[node_id] = (start_angle + end_angle) / 2
            
            # Distribute angles among children
            if node.children:
                num_children = len(node.children)
                angle_span = end_angle - start_angle
                child_angle_span = angle_span / num_children
                
                for i, child_id in enumerate(node.children):
                    child_start = start_angle + i * child_angle_span
                    child_end = child_start + child_angle_span
                    assign_angles(child_id, node_id, child_start, child_end)
        
        # Assign angles starting from root
        assign_angles(root_id, None, 0, 2 * math.pi)
        
        # Compute Cartesian positions using radii based on depth
        for node_id, node in nodes.items():
            if node_id not in angles:
                # Fallback for orphaned nodes
                angle = 0
            else:
                angle = angles[node_id]
            
            # Compute radius based on depth (exponential decay)
            if node.level == 0:
                r = 0
            else:
                numerator = 1 - math.pow(self.k, node.level)
                denominator = 1 - math.pow(self.k, self.max_depth)
                r = self.radius * (numerator / denominator)
            
            # Convert polar to Cartesian
            x = r * math.cos(angle)
            y = r * math.sin(angle)
            
            self.positions[node_id] = (x, y)
        
        return self.positions


class HTMLGenerator:
    """Generates interactive HTML visualization with D3.js-style styling"""
    
    def __init__(self, nodes: Dict[str, TreeNode], positions: Dict[str, Tuple[float, float]], 
                 title: str = "Hierarchical Graph"):
        self.nodes = nodes
        self.positions = positions
        self.title = title
        self.edges: List[Dict] = []
        self._build_edges()
    
    def _build_edges(self):
        """Build edge data from parent-child relationships"""
        for node_id, node in self.nodes.items():
            if node.parent:
                self.edges.append({
                    'source': node.parent,
                    'target': node_id,
                    'type': 'hierarchical'
                })
    
    def generate(self) -> str:
        """Generate complete HTML with embedded D3.js visualization"""
        
        # Prepare node and edge data for JavaScript
        nodes_data = [
            {
                'id': node.id,
                'label': node.label,
                'title': node.title,
                'level': node.level,
                'x': self.positions[node.id][0],
                'y': self.positions[node.id][1],
            }
            for node in self.nodes.values()
        ]
        
        nodes_json = json.dumps(nodes_data)
        edges_json = json.dumps(self.edges)
        
        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{self.title}</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <style>
        :root {{
            --bg-primary: #fcfcf9;
            --bg-secondary: #ffffff;
            --bg-tertiary: #f5f5f5;
            --text-primary: #134252;
            --text-secondary: #626c71;
            --border-color: rgba(94, 82, 64, 0.2);
            --accent-color: #208081;
            --accent-hover: #1d7480;
            --accent-active: #1a6873;
        }}
        
        @media (prefers-color-scheme: dark) {{
            :root {{
                --bg-primary: #1f2121;
                --bg-secondary: #262828;
                --bg-tertiary: #f5f5f5;
                --text-primary: #f5f5f5;
                --text-secondary: rgba(167, 169, 169, 0.7);
                --border-color: rgba(119, 124, 124, 0.3);
                --accent-color: #32b8c6;
                --accent-hover: #2da6b2;
                --accent-active: #1a6873;
            }}
        }}
        
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        html, body {{
            width: 100%;
            height: 100%;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
        }}
        
        #container {{
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
        }}
        
        svg {{
            width: 100%;
            height: 100%;
            background: var(--bg-primary);
        }}
        
        .node {{
            cursor: pointer;
            stroke: var(--bg-primary);
            stroke-width: 2;
            transition: all 0.2s ease;
        }}
        
        .node:hover {{
            stroke: var(--text-primary);
            filter: brightness(1.1);
        }}
        
        .link {{
            stroke: var(--text-secondary);
            stroke-opacity: 0.6;
            fill: none;
        }}
        
        .link.hierarchical {{
            stroke: var(--text-secondary);
            stroke-width: 1.5;
        }}
        
        .link.highlighted {{
            stroke: var(--accent-color);
            stroke-opacity: 1;
            stroke-width: 2;
        }}
        
        .node-label {{
            pointer-events: none;
            font-weight: 500;
            text-anchor: middle;
            dominant-baseline: middle;
            paint-order: stroke;
            stroke: var(--bg-primary);
            stroke-width: 3px;
            stroke-linejoin: round;
        }}
        
        .boundary-circle {{
            fill: none;
            stroke: var(--border-color);
            stroke-dasharray: 5,5;
            opacity: 0.3;
            pointer-events: none;
        }}
        
        .tooltip {{
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 1000;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            color: var(--text-primary);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            display: none;
            white-space: nowrap;
            transform: translate(-50%, -100%);
            margin-top: -8px;
        }}
        
        .tooltip.visible {{
            display: block;
        }}
        
        .controls {{
            position: absolute;
            top: 20px;
            right: 20px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 12px;
            font-size: 12px;
            z-index: 100;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }}
        
        .controls button {{
            background: var(--accent-color);
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            transition: all 0.2s ease;
            margin-top: 8px;
            width: 100%;
        }}
        
        .controls button:hover {{
            background: var(--accent-hover);
        }}
        
        .controls button:active {{
            background: var(--accent-active);
        }}
        
        .info {{
            position: absolute;
            bottom: 20px;
            left: 20px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 12px;
            font-size: 11px;
            max-width: 250px;
            z-index: 100;
        }}
        
        .info-label {{
            color: var(--text-secondary);
            margin-bottom: 4px;
        }}
        
        .info-value {{
            color: var(--accent-color);
            font-weight: bold;
        }}
    </style>
</head>
<body>
    <div id="container">
        <svg id="graph"></svg>
        <div class="tooltip" id="tooltip"></div>
        <div class="controls">
            <div>
                <button onclick="resetZoom()">Reset View</button>
                <button onclick="toggleLabels()">Toggle Labels</button>
            </div>
        </div>
        <div class="info">
            <div class="info-label">Nodes: <span class="info-value" id="nodeCount">0</span></div>
            <div class="info-label">Levels: <span class="info-value" id="levelCount">0</span></div>
            <div class="info-label" style="margin-top: 8px; font-size: 10px; color: var(--text-secondary);">
                Drag to move • Scroll to zoom • Click node for path highlight
            </div>
        </div>
    </div>

    <script>
        // Data
        const nodesData = {nodes_json};
        const edgesData = {edges_json};
        
        // State
        let currentLayout = 'hyperbolic';
        let simulation = null;
        let hoveredNode = null;
        let labelsVisible = true;
        
        // D3 selections
        const svg = d3.select('#graph');
        const tooltip = d3.select('#tooltip');
        let mainGroup = null;
        let link = null;
        let node = null;
        let nodeLabels = null;
        
        const WIDTH = window.innerWidth;
        const HEIGHT = window.innerHeight;
        const R_MAX = (Math.min(WIDTH, HEIGHT) / 2 - 50) * 0.9;
        
        // Font size mapping by node level
        const labelFontSizes = {{
            0: '16px',  // Root
            1: '13px',  // Level 1
            2: '11px',  // Level 2
            3: '10px',  // Level 3+
        }};
        
        function getLabelFontSize(level) {{
            return labelFontSizes[level] || labelFontSizes[3];
        }}
        
        function initVisualization() {{
            // Clear previous
            svg.selectAll('*').remove();
            
            // Setup SVG
            svg.attr('viewBox', [-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT]);
            
            // Create main group for zoom/pan
            mainGroup = svg.append('g');
            
            // Zoom behavior
            const zoom = d3.zoom()
                .scaleExtent([0.1, 4])
                .on('zoom', (event) => {{
                    mainGroup.attr('transform', event.transform);
                    updateTooltip();
                }});
            svg.call(zoom);
            
            // Background rect for reset
            mainGroup.append('rect')
                .attr('x', -WIDTH)
                .attr('y', -HEIGHT)
                .attr('width', WIDTH * 2)
                .attr('height', HEIGHT * 2)
                .attr('fill', 'transparent')
                .on('click', () => {{
                    tooltip.classed('visible', false);
                }});
            
            // Draw boundary circle
            mainGroup.append('circle')
                .attr('r', R_MAX)
                .attr('class', 'boundary-circle');
            
            // Create links
            link = mainGroup.append('g')
                .selectAll('line')
                .data(edgesData)
                .join('line')
                .attr('class', 'link hierarchical')
                .attr('x1', d => {{
                    const source = nodesData.find(n => n.id === d.source);
                    return source ? source.x : 0;
                }})
                .attr('y1', d => {{
                    const source = nodesData.find(n => n.id === d.source);
                    return source ? source.y : 0;
                }})
                .attr('x2', d => {{
                    const target = nodesData.find(n => n.id === d.target);
                    return target ? target.x : 0;
                }})
                .attr('y2', d => {{
                    const target = nodesData.find(n => n.id === d.target);
                    return target ? target.y : 0;
                }});
            
            // Node radius based on level
            const nodeRadii = {{
                0: 12,
                1: 8,
                2: 6,
                default: 5
            }};
            
            // Create nodes
            node = mainGroup.append('g')
                .selectAll('circle')
                .data(nodesData)
                .join('circle')
                .attr('class', 'node')
                .attr('r', d => nodeRadii[d.level] || nodeRadii.default)
                .attr('fill', d => {{
                    const colorMap = {{
                        0: '#8b5cf6',  // Purple
                        1: '#208081',  // Teal
                        2: '#f59e61',  // Orange
                        default: '#a67c52'  // Brown
                    }};
                    return colorMap[d.level] || colorMap.default;
                }})
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .attr('cursor', 'pointer')
                .on('mouseover', function(event, d) {{
                    hoveredNode = d;
                    d3.select(this).attr('stroke', 'var(--text-primary)');
                    tooltip.classed('visible', true)
                        .text(d.title + ' [' + d.label + ']')
                        .style('left', (event.pageX) + 'px')
                        .style('top', (event.pageY) + 'px');
                }})
                .on('mouseout', function() {{
                    hoveredNode = null;
                    d3.select(this).attr('stroke', 'var(--bg-primary)');
                    tooltip.classed('visible', false);
                }})
                .on('click', (event, d) => {{
                    event.stopPropagation();
                    highlightPath(d.id);
                }});
            
            // Create node labels (PERSISTENT - ALWAYS VISIBLE)
            nodeLabels = mainGroup.append('g')
                .selectAll('text')
                .data(nodesData)
                .join('text')
                .attr('class', 'node-label')
                .attr('x', d => d.x)
                .attr('y', d => d.y)
                .attr('dy', '0.35em')
                .attr('font-size', d => getLabelFontSize(d.level))
                .attr('fill', 'var(--text-primary)')
                .text(d => d.title)
                .style('opacity', labelsVisible ? 1 : 0);
            
            // Update UI
            document.getElementById('nodeCount').textContent = nodesData.length;
            const maxLevel = Math.max(...nodesData.map(n => n.level), 0);
            document.getElementById('levelCount').textContent = maxLevel;
        }}
        
        function updateTooltip() {{
            if (hoveredNode) {{
                tooltip.style('left', event.pageX + 'px')
                    .style('top', event.pageY + 'px');
            }}
        }}
        
        function highlightPath(nodeId) {{
            const path = new Set();
            let current = nodesData.find(n => n.id === nodeId);
            
            while (current) {{
                path.add(current.id);
                current = nodesData.find(n => n.id === current.parent);
            }}
            
            // Highlight links in path
            link.classed('highlighted', d => {{
                return path.has(d.source) && path.has(d.target);
            }});
            
            // Highlight nodes in path
            node.attr('opacity', d => {{
                return path.has(d.id) ? 1 : 0.3;
            }});
            
            // Highlight labels in path
            nodeLabels.attr('opacity', d => {{
                return path.has(d.id) ? 1 : 0.3;
            }});
        }}
        
        function resetZoom() {{
            const duration = 750;
            svg.transition()
                .duration(duration)
                .call(d3.zoom().transform, d3.zoomIdentity.translate(WIDTH / 2, HEIGHT / 2));
            tooltip.classed('visible', false);
            
            // Reset highlighting
            link.classed('highlighted', false);
            node.attr('opacity', 1);
            nodeLabels.attr('opacity', labelsVisible ? 1 : 0);
        }}
        
        function toggleLabels() {{
            labelsVisible = !labelsVisible;
            nodeLabels.transition()
                .duration(300)
                .style('opacity', labelsVisible ? 1 : 0);
        }}
        
        // Handle window resize
        window.addEventListener('resize', () => {{
            // Update visualization on resize if needed
        }});
        
        // Initialize on load
        initVisualization();
        resetZoom();
    </script>
</body>
</html>
"""
        return html


def main():
    parser = argparse.ArgumentParser(
        description='Parse hierarchical outline text and generate hyperbolic graph visualization',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 hierarchy_hyperbolic.py input.txt
  python3 hierarchy_hyperbolic.py data.txt -o graph.html --radius 300 --title "My Graph"
        """
    )
    parser.add_argument('input_file', type=str, help='Path to hierarchical text file (or "-" for stdin)')
    parser.add_argument('-o', '--output', type=str, default='output.html', 
                       help='Output HTML file (default: output.html)')
    parser.add_argument('--radius', type=float, default=200, 
                       help='Poincaré disk radius in pixels (default: 200)')
    parser.add_argument('--title', type=str, default='Hierarchical Graph Visualization',
                       help='HTML page title (default: "Hierarchical Graph Visualization")')
    
    args = parser.parse_args()
    
    try:
        # Read input file
        if args.input_file == '-':
            text = sys.stdin.read()
            print("Reading from stdin...")
        else:
            input_path = Path(args.input_file)
            if not input_path.exists():
                print(f"❌ Error: Input file '{args.input_file}' not found")
                sys.exit(1)
            
            text = input_path.read_text()
            print(f"✓ Parsing hierarchical text from '{args.input_file}'...")
        
        # Parse hierarchy
        hp = HierarchyParser()
        nodes = hp.parse(text)
        
        print(f"✓ Found {len(nodes)} nodes")
        if hp.root:
            print(f"✓ Root: '{hp.root.title}'")
        
        # Compute layout
        print("✓ Computing Poincaré disk layout...")
        layout = PoincareDiskLayout(radius=args.radius)
        positions = layout.compute_layout(nodes, hp.root.id if hp.root else list(nodes.keys())[0])
        
        # Generate HTML
        print("✓ Generating HTML visualization...")
        gen = HTMLGenerator(nodes, positions, title=args.title)
        html = gen.generate()
        
        # Write output
        output_path = Path(args.output)
        output_path.write_text(html)
        print(f"✅ SUCCESS! Visualization saved to '{args.output}'")
        print(f"   Open in browser: file://{output_path.absolute()}")
        
    except ValueError as e:
        print(f"❌ Parse Error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
