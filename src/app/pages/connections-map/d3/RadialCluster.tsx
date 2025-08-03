
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface RadialClusterProps {
  width?: number;
  height?: number;
}

const RadialCluster: React.FC<RadialClusterProps> = ({ width = 1152, height = 1152 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const cx = width * 0.5;
    const cy = height * 0.54;
    const radius = Math.min(width, height) / 2 - 80;

    const tree = d3.cluster()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

    d3.json('https://gist.githubusercontent.com/mbostock/4063550/raw/2da3459436a455236b132d935f8bf329382b49da/flare.json').then((data: any) => {
      const root = tree(d3.hierarchy(data)
        .sort((a, b) => d3.ascending(a.data.name, b.data.name)));

      const g = svg.append("g").attr("transform", `translate(${cx},${cy})`);

      g.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(root.links())
        .join("path")
        .attr("d", d3.linkRadial<any, any, any>()
          .angle((d: any) => d.x)
          .radius((d: any) => d.y) as any);

      g.append("g")
        .selectAll("circle")
        .data(root.descendants())
        .join("circle")
        .attr("transform", (d: any) => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
        .attr("fill", (d: any) => d.children ? "#555" : "#999")
        .attr("r", 2.5);

      g.append("g")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .selectAll("text")
        .data(root.descendants())
        .join("text")
        .attr("transform", (d: any) => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0) rotate(${d.x >= Math.PI ? 180 : 0})`)
        .attr("dy", "0.31em")
        .attr("x", (d: any) => d.x < Math.PI === !d.children ? 6 : -6)
        .attr("text-anchor", (d: any) => d.x < Math.PI === !d.children ? "start" : "end")
        .attr("paint-order", "stroke")
        .attr("stroke", "white")
        .attr("fill", "currentColor")
        .text((d: any) => d.data.name);
    });

  }, [width, height]);

  return (
    <svg ref={svgRef} width={width} height={height}></svg>
  );
};

export default RadialCluster;
