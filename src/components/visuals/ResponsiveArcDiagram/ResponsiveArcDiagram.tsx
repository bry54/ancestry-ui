import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { capitalizeFirstLetter } from '@/lib/helpers';

interface Node {
  id: string;
  name: string;
  group: string;
}

interface Link {
  source: string;
  target: string;
  value: number;
  type: string; // Added for the label
}

export interface IArcDiagramData {
  nodes: Node[];
  links: Link[];
}

interface ArcDiagramProps {
  data: IArcDiagramData;
}

const ResponsiveArcDiagram: React.FC<ArcDiagramProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 🔹 Listen to parent size changes
  useEffect(() => {
    if (!wrapperRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !data?.nodes?.length || dimensions.width === 0)
      return;

    const { width, height } = dimensions;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // clear previous

    const margin = { top: 30, right: 30, bottom: 0, left: 30 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${0 - margin.top * 5})`);

    // Same D3 logic as before...
    const nodes = [...data.nodes].sort((a, b) => a.id.localeCompare(b.id));
    const nodeById = new Map(nodes.map((d, i) => [d.id, { ...d, index: i }]));

    const links = data.links.map((d) => ({
      source: nodeById.get(d.source) as Node,
      target: nodeById.get(d.target) as Node,
      value: d.value,
      type: d.type, // Ensure type is carried over
    }));

    const x = d3
      .scalePoint()
      .domain(nodes.map((d) => d.id))
      .range([0, innerWidth])
      .padding(0.5);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const adj = new Set();
    links.forEach((link) => {
      adj.add(`${link.source.id}-${link.target.id}`);
      adj.add(`${link.target.id}-${link.source.id}`);
    });

    const isConnected = (a: Node, b: Node) => adj.has(`${a.id}-${b.id}`);

    const linkPaths = g
      .append('g')
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.6)
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('id', (d, i) => `link-path-${i}`) // 🔹 Assign an ID to each path
      .attr('stroke', (d: any) => color(d.source.group.toString()))
      .attr('d', (d: any) => {
        const startX = x(d.source.id);
        const endX = x(d.target.id);
        const midY = innerHeight / 2;
        const r = Math.abs(startX - endX) / 2;
        const sweepFlag = startX < endX ? 0 : 1;
        return `M${startX},${midY} A${r},${r} 0 0,${sweepFlag} ${endX},${midY}`;
      });

    // 🔹 Add labels to the links
    const linkLabels = g
      .append('g')
      .attr('fill', 'currentColor')
      .attr('font-size', 8)
      .attr('font-family', 'sans-serif')
      .selectAll('text')
      .data(links)
      .join('text')
      .attr('dy', -4); // Move text up from the arc path

    linkLabels
      .append('textPath')
      .attr('href', (d, i) => `#link-path-${i}`) // Link text to a path
      .attr('startOffset', '50%') // Center the text on the path
      .style('text-anchor', 'middle')
      .text((d: any) =>
        capitalizeFirstLetter(
          d.type ? d.type.toLowerCase().replace(/_/g, ' ') : '',
        ),
      );

    const nodeCircles = g
      .append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 5)
      .attr('cx', (d) => x(d.id) as number)
      .attr('cy', innerHeight / 2)
      .attr('fill', (d) => color(d.group.toString()));

    const nodeLabels = g
      .append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr(
        'transform',
        (d) => `translate(${x(d.id)},${innerHeight / 2 - 10})rotate(-45)`,
      )
      .attr('dy', '0.31em')
      .attr('text-anchor', 'start')
      .attr('font-size', 10)
      .text((d) => d.name);

    const highlight = (
      selectedNodeId: string | null,
      selectedLink: Link | null,
    ) => {
      const isDimmed = (d: any) => {
        if (!selectedNodeId && !selectedLink) return false;
        if (
          selectedNodeId &&
          (d.id === selectedNodeId ||
            isConnected(d, nodeById.get(selectedNodeId) as Node))
        )
          return false;
        if (
          selectedLink &&
          (d.id === selectedLink.source.id || d.id === selectedLink.target.id)
        )
          return false;
        return true;
      };

      const isLinkDimmed = (l: any) => {
        if (!selectedNodeId && !selectedLink) return false;
        if (
          selectedNodeId &&
          (l.source.id === selectedNodeId || l.target.id === selectedNodeId)
        )
          return false;
        if (
          selectedLink &&
          l.source.id === selectedLink.source.id &&
          l.target.id === selectedLink.target.id
        )
          return false;
        return true;
      };

      nodeCircles.attr('opacity', (d) => (isDimmed(d) ? 0.1 : 1));
      nodeLabels.attr('opacity', (d) => (isDimmed(d) ? 0.1 : 1));
      linkPaths.attr('opacity', (l) => (isLinkDimmed(l) ? 0.1 : 1));
      // 🔹 Highlight link labels as well
      linkLabels.attr('opacity', (l) => (isLinkDimmed(l) ? 0.1 : 1));
    };

    nodeCircles.on('mouseover', (event, d) => highlight(d.id, null));
    nodeCircles.on('mouseout', () => highlight(null, null));

    linkPaths.on('mouseover', (event, d) => highlight(null, d as any));
    linkPaths.on('mouseout', () => highlight(null, null));
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
    </div>
  );
};

export default ResponsiveArcDiagram;
