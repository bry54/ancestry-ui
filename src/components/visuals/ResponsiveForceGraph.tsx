import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useContainerSize } from '@/hooks/use-container-size';
import type { GraphData } from './data/network-data';

// --- COMPONENT PROPS ---
interface ResponsiveForceGraphProps {
  data: GraphData;
}

export const ResponsiveForceGraph: React.FC<ResponsiveForceGraphProps> = ({ data }) => {
  // 1. Measure the container and get a ref to the SVG element
  const { ref: containerRef, width, height } = useContainerSize();
  const svgRef = useRef<SVGSVGElement>(null);

  // 2. Manage the D3 simulation in a useEffect hook
  useEffect(() => {
    if (width === 0 || height === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Clear previous SVG content
    svg.selectAll('*').remove();

    // Create the main group element
    const g = svg.append('g');

    // Create links
    const link = g
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke-width', 1.5);

    // Create nodes
    const node = g
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(data.nodes)
      .join('circle')
      .attr('r', 8)
      .attr('fill', 'steelblue');

    // Add labels to nodes
    const labels = g
      .append('g')
      .selectAll('text')
      .data(data.nodes)
      .join('text')
      .text(d => d.id)
      .attr('x', 12)
      .attr('y', '0.31em')
      .attr('font-size', 12)
      .attr('fill', '#333');

    // Create the simulation
    const simulation = d3.forceSimulation(data.nodes as any)
      .force('link', d3.forceLink(data.links).id((d: any) => d.index).distance(50))
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Define the simulation "tick" function
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      labels
        .attr('x', (d: any) => d.x + 12)
        .attr('y', (d: any) => d.y);
    });

    // Add drag functionality
    const dragHandler = d3.drag()
      .on('start', (event, d: any) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d: any) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d: any) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
    
    dragHandler(node as any);

    // Cleanup simulation on component unmount
    return () => simulation.stop();

  }, [data, width, height]);

  // 3. Render the container and the SVG element
  return (
    <div ref={containerRef} className="w-full h-full">
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
};
