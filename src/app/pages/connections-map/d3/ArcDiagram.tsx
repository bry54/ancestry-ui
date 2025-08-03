import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
  group: number;
  index?: number;
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

const ArcDiagram: React.FC<ArcDiagramProps> = ({ data, width = 600, height = 600 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const y = d3.scalePoint(data.nodes.map(d => d.id), [0, innerHeight]);

    const link = g
      .append('g')
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .selectAll('path')
      .data(data.links)
      .join('path')
      .attr('stroke', '#999')
      .attr('d', (d: any) => {
        const start = y(d.source);
        const end = y(d.target);
        const r = Math.abs(start - end) / 2;
        return `M${margin.left},${start} A${r},${r} 0 0,1 ${margin.left},${end}`;
      });

    const node = g
      .append('g')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .attr('transform', (d: any) => `translate(${margin.left},${y(d.id)})`);

    node.append('circle').attr('r', 4).attr('fill', 'currentColor');

    node.append('text')
      .attr('x', 10)
      .attr('dy', '0.31em')
      .text(d => d.id)
      .clone(true)
      .lower()
      .attr('stroke', 'white');

  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default ArcDiagram;
