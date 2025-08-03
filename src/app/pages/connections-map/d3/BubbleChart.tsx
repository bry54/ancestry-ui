
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface BubbleNode {
  name: string;
  value?: number;
  children?: BubbleNode[];
}

interface BubbleChartProps {
  width?: number;
  height?: number;
  data?: BubbleNode;
}

const BubbleChart: React.FC<BubbleChartProps> = ({ data, width = 640, height = 480 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove(); // Clear previous renders

      const pack = d3.pack()
        .size([width, height])
        .padding(3);

      const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

      pack(root);

      const node = svg.selectAll("g")
        .data(root.descendants())
        .join("g")
          .attr("transform", d => `translate(${d.x},${d.y})`);

      node.append("circle")
          .attr("r", d => d.r)
          .attr("fill", d => d.children ? "#a9def9" : "#f9c74f")
          .attr("stroke", "#277da1");

      node.filter(d => !d.children)
        .append("text")
          .attr("text-anchor", "middle")
          .attr("dy", "0.3em")
          .style("font-size", "10px")
          .style("font-family", "Overpass")
          .text(d => d.data.name);
    }
  }, [data, width, height]);

  return (
    <svg ref={svgRef} width={width} height={height}></svg>
  );
};

export default BubbleChart;
