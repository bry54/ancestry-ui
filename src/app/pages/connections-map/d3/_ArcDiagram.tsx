import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
  group: number;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

interface ArcDiagramProps {
  data: {
    nodes: Node[];
    links: Link[];
  };
  width?: number;
  height?: number;
}

const ArcDiagram: React.FC<ArcDiagramProps> = ({ data, width = 600, height = 480 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data || !data.nodes || !data.links) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous renders

    const margin = { top: 30, right: 30, bottom: 30, left: 30 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Sort nodes alphabetically by id for consistent layout
    const nodes = [...data.nodes].sort((a, b) => a.id.localeCompare(b.id));

    // Create a map from node id to its index in the sorted array
    const nodeById = new Map(nodes.map((d, i) => [d.id, { ...d, index: i }]));

    // Re-map links to use the sorted node objects
    const links = data.links.map(d => ({
      source: nodeById.get(d.source) as Node,
      target: nodeById.get(d.target) as Node,
      value: d.value,
    }));

    // X scale for node positioning
    const x = d3.scalePoint()
        .domain(nodes.map(d => d.id))
        .range([0, innerWidth])
        .padding(1.0);

    // Color scale for node groups
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Adjacency list for quick lookup of connected nodes/links
    const adj = new Set();
    links.forEach(link => {
      adj.add(`${link.source.id}-${link.target.id}`);
      adj.add(`${link.target.id}-${link.source.id}`);
    });

    const isConnected = (a: Node, b: Node) => adj.has(`${a.id}-${b.id}`);

    // Draw links
    const linkPaths = g.append('g')
        .attr('fill', 'none')
        .attr('stroke-opacity', 0.6)
        .selectAll('path')
        .data(links)
        .join('path')
        .attr('stroke', d => color(d.source.group.toString()))
        .attr('d', (d: any) => {
          const startX = x(d.source.id);
          const endX = x(d.target.id);
          const midY = innerHeight / 2;
          const r = Math.abs(startX - endX) / 2;
          const sweepFlag = startX < endX ? 0 : 1; // Determines arc direction
          return `M${startX},${midY} A${r},${r} 0 0,${sweepFlag} ${endX},${midY}`;
        });

    // Draw nodes
    const nodeCircles = g.append('g')
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', 5)
        .attr('cx', d => x(d.id) as number)
        .attr('cy', innerHeight / 2)
        .attr('fill', d => color(d.group.toString()));

    // Draw node labels
    // Draw node labels
    const nodeLabels = g.append('g')
        .selectAll('text')
        .data(nodes)
        .join('text')
        .attr('transform', d => `translate(${x(d.id)},${innerHeight / 2})rotate(-45)`)
        .attr('dy', '0.31em')
        .attr('text-anchor', 'start') // Anchor to the end for vertical text
        .attr('font-size', 10)
        .text(d => d.id);

    // Interactivity
    const highlight = (selectedNodeId: string | null, selectedLink: Link | null) => {
      nodeCircles.attr('opacity', (d: any) => {
        if (!selectedNodeId && !selectedLink) return 1; // No selection, full opacity
        if (selectedNodeId && (d.id === selectedNodeId || isConnected(d, nodeById.get(selectedNodeId) as Node))) return 1;
        if (selectedLink && (d.id === selectedLink.source.id || d.id === selectedLink.target.id)) return 1;
        return 0.1; // Fade out non-connected
      });

      nodeLabels.attr('opacity', (d: any) => {
        if (!selectedNodeId && !selectedLink) return 1;
        if (selectedNodeId && (d.id === selectedNodeId || isConnected(d, nodeById.get(selectedNodeId) as Node))) return 1;
        if (selectedLink && (d.id === selectedLink.source.id || d.id === selectedLink.target.id)) return 1;
        return 0.1;
      });

      linkPaths.attr('opacity', (l: any) => {
        if (!selectedNodeId && !selectedLink) return 1;
        if (selectedNodeId && (l.source.id === selectedNodeId || l.target.id === selectedNodeId)) return 1;
        if (selectedLink && (l.source.id === selectedLink.source.id && l.target.id === selectedLink.target.id)) return 1;
        return 0.1;
      });
    };

    nodeCircles.on('mouseover', (event, d) => highlight(d.id, null));
    nodeCircles.on('mouseout', () => highlight(null, null));

    linkPaths.on('mouseover', (event, d) => highlight(null, d));
    linkPaths.on('mouseout', () => highlight(null, null));

  }, [data, width, height]);

  return <svg ref={svgRef} width={'100%'} height={height}></svg>;
};

export default ArcDiagram;