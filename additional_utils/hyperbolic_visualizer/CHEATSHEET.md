# Quick Reference Cheat Sheet

## Python Script Usage

### Basic Commands

```bash
# Parse and visualize with defaults
python3 hierarchy_hyperbolic.py input.txt

# Custom output filename
python3 hierarchy_hyperbolic.py input.txt -o my_graph.html

# Larger disk radius (more spacing)
python3 hierarchy_hyperbolic.py input.txt --radius 300

# Custom page title
python3 hierarchy_hyperbolic.py input.txt --title "My Knowledge Base"

# All options
python3 hierarchy_hyperbolic.py input.txt \
  -o output.html \
  --radius 250 \
  --title "Product Taxonomy"
```

---

## Input Format Syntax

### Valid Hierarchies

```
0. Root node                          # Optional synthetic root

1. First branch
1.1. Sub-branch
1.1.1. Deep item
1.1.2. Another deep item
1.1.3. Yet another item

1.2. Second sub-branch
1.2.1. Item under 1.2

2. Second branch
2.1. Sub-branch of 2
2.2. Another sub-branch

3. Third branch
```

### Rules
- ✓ Each line starts with digits separated by dots (1., 1.1., 1.1.1., etc.)
- ✓ A period follows the number sequence
- ✓ Text after period is the node label
- ✓ Blank lines are ignored
- ✓ Max nesting depth: unlimited (but 4-6 levels recommended for visualization)

### Invalid Examples (Won't Parse)
```
❌ 1 First item          (missing period after number)
❌ 1.1 Sub item         (no period)
❌ - Bullet point       (not numbered)
❌ 1.a Mixed numbering  (use all digits)
```

---

## Generated HTML Features

### Interactive Controls
- **Scroll/Pinch** - Zoom in/out
- **Drag** - Pan around the graph
- **Click Node** - Highlight path to root
- **Hover Node** - Show tooltip with title and number
- **Reset View Button** - Return to initial position

### Visual Elements
- **Circle Boundary** - Hyperbolic space boundary (dashed circle)
- **Root Node** - Large purple circle at center
- **Layer 1 Nodes** - Teal circles at first radius
- **Layer 2 Nodes** - Orange circles at second radius
- **Edges** - Gray lines connecting parent-child nodes
- **Highlighted Path** - Accent color edges when node clicked

### Dark/Light Mode
Automatically adapts to system preference via `prefers-color-scheme`
Or override with CSS variables in HTML `<style>` section

---

## Color Codes

### Default Node Colors
```
Level 0 (Root):    #8b5cf6 (Purple)
Level 1:           #208081 (Teal)
Level 2:           #f59e61 (Orange)
Level 3+:          #a67c52 (Brown)
```

### Interactive States
```
Default:           var(--text-secondary)
Hover:             var(--text-primary) [stroke darkens]
Highlighted Path:  var(--accent-color) [bright teal]
Dimmed:            opacity: 0.3
```

---

## CSS Variables (Customization)

All colors use CSS custom properties. Modify in generated HTML `<style>`:

```css
:root {
  --bg-primary:      #fcfcf9;  /* Main background */
  --bg-secondary:    #ffffff;  /* Card background */
  --text-primary:    #134252;  /* Main text */
  --text-secondary:  #626c71;  /* Secondary text */
  --border-color:    rgba(94, 82, 64, 0.2);
  --accent-color:    #208081;  /* Interactive elements */
  --accent-hover:    #1d7480;  /* Hover state */
  --accent-active:   #1a6873;  /* Active state */
}

/* For dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary:      #1f2121;
    --text-primary:    #f5f5f5;
    --accent-color:    #32b8c6;
    /* ... */
  }
}
```

---

## Data Structure

### Parsed Nodes (JSON)
```json
{
  "id": "node_5",
  "label": "1.2.1",
  "title": "Deep node title",
  "level": 3,
  "x": 145.23,
  "y": -78.45,
  "parent": "node_4",
  "children": ["node_6", "node_7"]
}
```

### Edges (JSON)
```json
{
  "source": "node_4",
  "target": "node_5",
  "type": "hierarchical"
}
```

---

## Layout Algorithm

### Poincaré Disk Model

**Radius Calculation** (exponential decay):
```
r_level = R_max * (1 - k^level) / (1 - k^max_level)
where:
  R_max = maximum disk radius (default: 200px)
  k = decay factor (default: 0.7)
  level = node depth (0 = center, higher = toward boundary)
```

**Angular Distribution:**
- Root at center (r=0)
- Level 1 nodes evenly distributed around first circle
- Level 2+ nodes distributed within parent's angular sector
- Result: Maximum separation with branching visualization

**Visual Effect:**
- Zoomed-out focus (center) with context (boundary)
- Far nodes appear at disk boundary
- Interactive zoom/pan for detail exploration

---

## Performance Benchmarks

| Nodes | Levels | Parse Time | Layout Time | Render |
|-------|--------|-----------|------------|--------|
| 100   | 4      | <50ms     | <100ms     | <500ms |
| 500   | 6      | <100ms    | <200ms     | 1-2s   |
| 1000  | 8      | <150ms    | <300ms     | 3-5s   |
| 5000  | 10     | <500ms    | <1s        | 10-15s |

*Times are approximate; actual performance depends on system*

---

## Troubleshooting Checklist

### Graph doesn't generate
- [ ] Input file exists and is readable
- [ ] Python 3.6+ installed: `python3 --version`
- [ ] Output file has .html extension
- [ ] No special characters in file path

### Nodes too close together
- [ ] Increase `--radius` parameter: try 300-400
- [ ] Check if hierarchy is very wide (many siblings)

### Tooltips cut off or misaligned
- [ ] Edit `.tooltip` width in CSS: `max-width: 300px`
- [ ] Adjust padding/margin for different text length

### Zoom/pan not working
- [ ] Try different browsers (Chrome, Firefox, Safari)
- [ ] Clear browser cache and reload
- [ ] Check console for JavaScript errors (F12)

### Colors wrong in dark mode
- [ ] Verify `@media (prefers-color-scheme: dark)` CSS section exists
- [ ] Check system dark mode is enabled
- [ ] Manually add `[data-color-scheme="dark"]` to `<html>` tag

### Browser hangs with large hierarchy
- [ ] Reduce hierarchy size and test with subset
- [ ] Try different browser (Chrome is typically fastest)
- [ ] Increase browser memory (close other tabs)

---

## File Organization

```
project/
├── hierarchy_hyperbolic.py      # Main script
├── sample_hierarchy.txt         # Example input
├── output.html                  # Generated graph
├── README.md                    # Full documentation
├── INTEGRATION_GUIDE.md         # Integration examples
└── CHEATSHEET.md                # This file
```

---

## Common Customizations

### Change Node Size
In generated HTML, find node radius assignment:
```javascript
const nodeRadii = {
  0: 15,    // Root larger
  1: 10,    // L1 bigger
  2: 7,
  default: 5
};
```

### Add Custom Styling
After boundary circle in HTML, add:
```javascript
mainGroup.append('text')
  .attr('id', 'title')
  .attr('x', 0)
  .attr('y', -220)
  .attr('text-anchor', 'middle')
  .style('font-size', '20px')
  .style('font-weight', 'bold')
  .style('fill', 'var(--text-primary)')
  .text('My Hierarchy');
```

### Filter Nodes on Load
After data initialization:
```javascript
const maxLevel = 2; // Only show first 2 levels
const filteredNodes = nodesData.filter(n => n.level <= maxLevel);
```

### Export as SVG
In browser console:
```javascript
// Right-click SVG > Save As > output.svg
const svgData = new XMLSerializer().serializeToString(document.querySelector('svg'));
const blob = new Blob([svgData], { type: 'image/svg+xml' });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'graph.svg';
link.click();
```

---

## Command-Line Tips

### Batch Process Multiple Files
```bash
for file in *.txt; do
  python3 hierarchy_hyperbolic.py "$file" -o "${file%.txt}.html"
done
```

### Set Default Radius
```bash
RADIUS=300
python3 hierarchy_hyperbolic.py input.txt --radius $RADIUS
```

### Use with Pipe (stdin)
```bash
cat data.txt | python3 hierarchy_hyperbolic.py /dev/stdin -o output.html
```

### Generate with Timestamp
```bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
python3 hierarchy_hyperbolic.py input.txt -o "graph_${TIMESTAMP}.html"
```

---

## Browser Compatibility

| Browser | Zoom | Pan | Tooltip | Tooltip | Notes |
|---------|------|-----|---------|---------|-------|
| Chrome  | ✓    | ✓   | ✓       | ✓       | Best performance |
| Firefox | ✓    | ✓   | ✓       | ✓       | Good performance |
| Safari  | ✓    | ✓   | ✓       | ✓       | Good performance |
| Edge    | ✓    | ✓   | ✓       | ✓       | Chromium-based |
| IE 11   | ✗    | ✗   | ✗       | ✗       | Not supported |

---

## Next Steps

1. **Try it out:** Run on sample_hierarchy.txt
2. **Customize colors:** Edit CSS variables
3. **Integrate:** Embed in React using INTEGRATION_GUIDE.md
4. **Scale up:** Test with your real data
5. **Enhance:** Add search, filtering, export features

---

## Support Resources

- **Documentation:** README.md
- **Integration:** INTEGRATION_GUIDE.md
- **D3.js Docs:** https://d3js.org
- **Poincaré Disk:** https://en.wikipedia.org/wiki/Poincar%C3%A9_disk_model
- **Issue Troubleshooting:** Check Troubleshooting Checklist above

