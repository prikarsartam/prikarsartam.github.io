import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import * as d3 from 'd3';
import { useStore } from '../../store/useStore';
import type { GraphNode, GraphLink } from '../../services/storage';
import { CONFIG } from '../../config';
import { GraphTooltip } from './GraphTooltip';

const GraphContainer = styled.div`
  width: 100%;
  height: 100%;
  background: var(--bg-primary);
  overflow: hidden;
  position: relative;
`;

export const GraphVisualization: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const hoveredNodeRef = useRef<GraphNode | null>(null);

    const { notes, hierarchy, arbitraryConnections, toggleArbitraryConnection, focusedNoteId, setFocusedNoteId, searchQuery } = useStore();
    const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
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

    // D3 Logic
    useEffect(() => {
        if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;

        const width = dimensions.width;
        const height = dimensions.height;

        // Poincaré Layout Parameters
        const maxLevels = CONFIG.UI.MAX_LEVELS || 8;
        const R_max = (Math.min(width, height) / 2 - CONFIG.GRAPH.RADIUS_BUFFER) * CONFIG.GRAPH.RADIUS_SCALE;
        const k = 0.99; // Decay factor

        // to calculate target radius for a given level
        // Formula: r_m = R_max * (1 - k^m) / (1 - k^maxLevels)
        const getTargetRadius = (level: number) => {
            if (level === 0) return 0;
            const numerator = 1 - Math.pow(k, level);
            const denominator = 1 - Math.pow(k, maxLevels);
            return R_max * (numerator / denominator);
        };

        // Clear previous
        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("viewBox", [-width / 2, -height / 2, width, height]);

        // Main Group for Zoom/Pan
        const mainGroup = svg.append("g");

        // Helper to update tooltip position
        const updateTooltip = () => {
            if (hoveredNodeRef.current && tooltipRef.current && svgRef.current) {
                const node = hoveredNodeRef.current;
                const transform = d3.zoomTransform(svgRef.current);
                const k = transform.k;
                const tx = transform.x;
                const ty = transform.y;

                const screenX = (node.x! * k + tx) + width / 2;
                const screenY = (node.y! * k + ty) + height / 2;

                tooltipRef.current.style.transform = `translate(${screenX}px, ${screenY}px) translate(-50%, -100%) translateY(-10px)`;
            }
        };

        // Zoom Behavior
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 4])
            .on("zoom", (event) => {
                mainGroup.attr("transform", event.transform);
                updateTooltip();
            });

        svg.call(zoom);

        // Background Rect for Resetting
        mainGroup.append("rect")
            .attr("x", -width * 2)
            .attr("y", -height * 2)
            .attr("width", width * 4)
            .attr("height", height * 4)
            .attr("fill", "transparent")
            .on("click", () => {
                setFocusedNoteId(null);
                setHighlightedNode(null);
                if (tooltipRef.current) {
                    hoveredNodeRef.current = null;
                    tooltipRef.current.style.display = 'none';
                }
            });

        // Prepare data
        const nodes: GraphNode[] = notes.map(n => ({
            ...n,
            // radius: n.level === 0 ? CONFIG.GRAPH.NODES.RADIUS_L0 : (n.level === 1 ? CONFIG.GRAPH.NODES.RADIUS_L1 : CONFIG.GRAPH.NODES.RADIUS_L2)

            // Dynamically look up radius based on level, fall back to default if undefined
            radius: CONFIG.GRAPH.NODES.RADIUS_BY_LEVEL[n.level] ?? CONFIG.GRAPH.NODES.DEFAULT_RADIUS

        }));

        const links: GraphLink[] = [];

        // Hierarchical links
        nodes.forEach(node => {
            if (node.parent) {
                links.push({
                    source: node.id,
                    target: node.parent,
                    value: 1,
                    type: 'hierarchical'
                });
            }
        });

        // Arbitrary links
        arbitraryConnections.forEach(conn => {
            const [source, target] = conn.split('::');
            if (nodes.find(n => n.id === source) && nodes.find(n => n.id === target)) {
                links.push({
                    source,
                    target,
                    value: 1,
                    type: 'arbitrary'
                });
            }
        });

        // Force 1
        const simulation = d3.forceSimulation<GraphNode>(nodes)
            .force("link", d3.forceLink<GraphNode, GraphLink>(links)
                .id(d => d.id)
                // .distance(d => {
                //     const sourceLevel = (d.source as GraphNode).level || 0;
                //     const targetLevel = (d.target as GraphNode).level || 0;
                //     const r_source = getTargetRadius(sourceLevel);
                //     const r_target = getTargetRadius(targetLevel);
                //     return Math.abs(r_target - r_source);
                // })
                .id(d => d.id)
                .distance(0)    // Set this to ZERO
                .strength(1.0)
            )
            .force("charge", d3.forceManyBody().strength(-500))
            // .force("collide", d3.forceCollide().radius(d => ((d as GraphNode).radius || 0) + 20))
            .force("collide", d3.forceCollide()
            .radius(d => ((d as GraphNode).radius || 0) + 10) // Tighter buffer
            .strength(1.0)  // Hard collision
            .iterations(2)  // Run collision logic twice per tick for accuracy
        )
            .force("r", d3.forceRadial(
                d => getTargetRadius((d as GraphNode).level || 0),
                0,
                0
            ).strength(1.0))
            .force("x", d3.forceX(0).strength(0.0)) // Gentle pull to horizontal center
            .force("y", d3.forceY(0).strength(0.0)) // Gentle pull to vertical center;

        // Draw boundary circle
        mainGroup.append("circle")
            .attr("r", R_max)
            .attr("fill", "none")
            .attr("stroke", "var(--border-color)")
            .attr("stroke-dasharray", "5,5")
            .attr("opacity", 0.3)
            .style("pointer-events", "none");

        // Drag functions
        const dragstarted = (event: any, d: GraphNode) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        };

        const dragged = (event: any, d: GraphNode) => {
            d.fx = event.x;
            d.fy = event.y;
            updateTooltip();
        };

        const dragended = (event: any, d: GraphNode) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        };

        // Highlight path logic
        const getPathToRoot = (nodeId: string): Set<string> => {
            const path = new Set<string>();
            let currentNote = nodes.find(n => n.id === nodeId);
            while (currentNote) {
                path.add(currentNote.id);
                if (currentNote.parent) {
                    currentNote = nodes.find(n => n.id === currentNote!.parent);
                } else {
                    break;
                }
            }
            return path;
        };

        const highlightedNodes = new Set<string>();
        let isRootFocused = false;

        if (focusedNoteId) {
            getPathToRoot(focusedNoteId).forEach(id => highlightedNodes.add(id));
            const focusedNode = nodes.find(n => n.id === focusedNoteId);
            if (focusedNode && focusedNode.level === 0) {
                isRootFocused = true;
            }
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchingNodes = nodes.filter(n =>
                n.title.toLowerCase().includes(query) ||
                n.content.toLowerCase().includes(query)
            );

            matchingNodes.forEach(node => {
                highlightedNodes.add(node.id);
                getPathToRoot(node.id).forEach(id => highlightedNodes.add(id));
            });
        }

        // Draw links
        const link = mainGroup.append("g")
            .selectAll<SVGLineElement, GraphLink>(".link")
            .data(links)
            .join("line")
            .attr("class", "link")
            .attr("stroke", d => {
                const sourceId = (d.source as GraphNode).id;
                const targetId = (d.target as GraphNode).id;

                if (highlightedNodes.has(sourceId) && highlightedNodes.has(targetId)) {
                    return "var(--accent-color)";
                }
                if (d.type === 'hierarchical') return "var(--text-secondary)";
                return "var(--border-color)";
            })
            .attr("stroke-opacity", d => {
                if (isRootFocused && !searchQuery) {
                    if (d.type === 'hierarchical') return CONFIG.GRAPH.EDGES.HIERARCHICAL_OPACITY;
                    return 0.3;
                }

                const sourceId = (d.source as GraphNode).id;
                const targetId = (d.target as GraphNode).id;

                if (highlightedNodes.has(sourceId) && highlightedNodes.has(targetId)) {
                    return CONFIG.GRAPH.EDGES.HIGHLIGHT_OPACITY;
                }
                if ((focusedNoteId || searchQuery) && (!highlightedNodes.has(sourceId) || !highlightedNodes.has(targetId))) {
                    return CONFIG.GRAPH.EDGES.DIMMED_OPACITY;
                }

                if (d.type === 'hierarchical') return CONFIG.GRAPH.EDGES.HIERARCHICAL_OPACITY;
                return 0.3;
            })
            .attr("stroke-width", d => {
                const sourceId = (d.source as GraphNode).id;
                const targetId = (d.target as GraphNode).id;

                if (highlightedNodes.has(sourceId) && highlightedNodes.has(targetId)) {
                    return 2;
                }
                return 1;
            })
            .attr("stroke-dasharray", d => d.type === 'arbitrary' ? "4,4" : "none");

        // Draw nodes
        const node = mainGroup.append("g")
            .selectAll<SVGCircleElement, GraphNode>(".node")
            .data(nodes)
            .join("circle")
            .attr("class", "node")
            .attr("r", d => d.radius!)
            .attr("fill", "#6A5ACD")
            .attr("stroke", "var(--bg-primary)")
            .attr("stroke-width", 2)
            .attr("opacity", d => {
                if (isRootFocused && !searchQuery) return 1;
                if ((focusedNoteId || searchQuery) && !highlightedNodes.has(d.id)) {
                    return CONFIG.GRAPH.NODES.DIMMED_OPACITY;
                }
                return 1;
            })
            .attr("cursor", "pointer")
            .call(d3.drag<any, any>()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
            .on("click", (event, d) => {
                event.stopPropagation();
                if (event.ctrlKey || event.metaKey) {
                    if (highlightedNode && highlightedNode !== d.id) {
                        toggleArbitraryConnection(highlightedNode, d.id);
                        setHighlightedNode(null);
                    } else {
                        setHighlightedNode(d.id);
                    }
                } else {
                    setFocusedNoteId(d.id);
                }
            })
            .on("mouseover", function (_, d) {
                // Disable hover on mobile / touch devices
                if (window.matchMedia('(hover: none)').matches || window.innerWidth <= 768) return;

                d3.select(this).attr("stroke", "var(--text-primary)");
                if (tooltipRef.current) {
                    hoveredNodeRef.current = d;
                    tooltipRef.current.textContent = d.title;
                    tooltipRef.current.style.display = 'block';
                    updateTooltip();
                }
            })
            .on("mouseout", function () {
                d3.select(this).attr("stroke", "var(--bg-primary)");
                if (tooltipRef.current) {
                    hoveredNodeRef.current = null;
                    tooltipRef.current.style.display = 'none';
                }
            });

        // Path Labels
        const pathLabels = mainGroup.append("g")
            .selectAll("text")
            .data(nodes.filter(n => highlightedNodes.has(n.id) && !isRootFocused))
            .join("text")
            .text(d => d.title)
            .attr("font-size", "10px")
            .attr("fill", "var(--text-primary)")
            .attr("font-weight", "bold")
            .attr("dx", 12)
            .attr("dy", 4)
            .style("pointer-events", "none")
            .style("text-shadow", "0 0 3px var(--bg-primary)");

        // Simulation tick
        simulation.on("tick", () => {
            link
                .attr("x1", d => (d.source as GraphNode).x!)
                .attr("y1", d => (d.source as GraphNode).y!)
                .attr("x2", d => (d.target as GraphNode).x!)
                .attr("y2", d => (d.target as GraphNode).y!);

            node
                .attr("cx", d => d.x!)
                .attr("cy", d => d.y!);

            pathLabels
                .attr("x", d => d.x!)
                .attr("y", d => d.y!);

            updateTooltip();
        });

        return () => {
            simulation.stop();
        };
    }, [notes, hierarchy, dimensions, arbitraryConnections, focusedNoteId, setFocusedNoteId, highlightedNode, toggleArbitraryConnection, searchQuery]);

    return (
        <GraphContainer ref={containerRef}>
            <svg ref={svgRef} width="100%" height="100%" style={{ cursor: 'move' }} />
            <GraphTooltip ref={tooltipRef} />
        </GraphContainer>
    );
};
