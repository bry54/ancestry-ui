import React, { useEffect, useRef, useState } from 'react';
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
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Same D3 logic as before...
    const nodes = [...data.nodes].sort((a, b) => a.id.localeCompare(b.id));
    const nodeById = new Map(nodes.map((d, i) => [d.id, { ...d, index: i }]));

    const links = data.links.map((d) => ({
      source: nodeById.get(d.source) as Node,
      target: nodeById.get(d.target) as Node,
      value: d.value,
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
      .attr('stroke', (d) => color(d.source.group.toString()))
      .attr('d', (d: any) => {
        const startX = x(d.source.id);
        const endX = x(d.target.id);
        const midY = innerHeight / 2;
        const r = Math.abs(startX - endX) / 2;
        const sweepFlag = startX < endX ? 0 : 1;
        return `M${startX},${midY} A${r},${r} 0 0,${sweepFlag} ${endX},${midY}`;
      });

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
        (d) => `translate(${x(d.id)},${innerHeight / 2})rotate(-45)`,
      )
      .attr('dy', '0.31em')
      .attr('text-anchor', 'start')
      .attr('font-size', 10)
      .text((d) => d.id);

    const highlight = (
      selectedNodeId: string | null,
      selectedLink: Link | null,
    ) => {
      nodeCircles.attr('opacity', (d: any) => {
        if (!selectedNodeId && !selectedLink) return 1;
        if (
          selectedNodeId &&
          (d.id === selectedNodeId ||
            isConnected(d, nodeById.get(selectedNodeId) as Node))
        )
          return 1;
        if (
          selectedLink &&
          (d.id === selectedLink.source.id || d.id === selectedLink.target.id)
        )
          return 1;
        return 0.1;
      });

      nodeLabels.attr('opacity', (d: any) => {
        if (!selectedNodeId && !selectedLink) return 1;
        if (
          selectedNodeId &&
          (d.id === selectedNodeId ||
            isConnected(d, nodeById.get(selectedNodeId) as Node))
        )
          return 1;
        if (
          selectedLink &&
          (d.id === selectedLink.source.id || d.id === selectedLink.target.id)
        )
          return 1;
        return 0.1;
      });

      linkPaths.attr('opacity', (l: any) => {
        if (!selectedNodeId && !selectedLink) return 1;
        if (
          selectedNodeId &&
          (l.source.id === selectedNodeId || l.target.id === selectedNodeId)
        )
          return 1;
        if (
          selectedLink &&
          l.source.id === selectedLink.source.id &&
          l.target.id === selectedLink.target.id
        )
          return 1;
        return 0.1;
      });
    };

    nodeCircles.on('mouseover', (event, d) => highlight(d.id, null));
    nodeCircles.on('mouseout', () => highlight(null, null));

    linkPaths.on('mouseover', (event, d) => highlight(null, d));
    linkPaths.on('mouseout', () => highlight(null, null));
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
    </div>
  );
};

export default ResponsiveArcDiagram;
