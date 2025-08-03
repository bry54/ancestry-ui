
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface BubbleChartProps {
  width?: number;
  height?: number;
}

const BubbleChart: React.FC<BubbleChartProps> = ({ width = 640, height = 480 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const data = {
    name: "flare",
    children: [
      {
        name: "analytics",
        children: [
          {
            name: "cluster",
            children: [
              { name: "AgglomerativeCluster", value: 3938 },
              { name: "CommunityStructure", value: 3812 },
              { name: "HierarchicalCluster", value: 6714 },
              { name: "MergeEdge", value: 743 }
            ]
          },
          {
            name: "graph",
            children: [
              { name: "BetweennessCentrality", value: 3534 },
              { name: "LinkDistance", value: 5731 },
              { name: "MaxFlowMinCut", value: 7840 },
              { name: "ShortestPath", value: 5914 },
              { name: "SpanningTree", value: 3416 }
            ]
          },
          {
            name: "optimization",
            children: [
              { name: "AspectRatioBanker", value: 7074 }
            ]
          }
        ]
      }
    ]
  };

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
          .text(d => d.data.name);
    }
  }, [data, width, height]);

  return (
    <svg ref={svgRef} width={width} height={height}></svg>
  );
};

export default BubbleChart;
