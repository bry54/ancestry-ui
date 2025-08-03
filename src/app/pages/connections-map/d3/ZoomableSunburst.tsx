
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ZoomableSunburstProps {
  width?: number;
  height?: number;
}

const ZoomableSunburst: React.FC<ZoomableSunburstProps> = ({ width = 928, height = 928 }) => {
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
      svg.selectAll("*”).remove();

      const radius = width / 6;

      const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));

      const hierarchy = d3.hierarchy(data)
        .sum((d: any) => d.value)
        .sort((a, b) => b.value! - a.value!);

      const root = d3.partition()
        .size([2 * Math.PI, hierarchy.height + 1])
        (hierarchy);

      root.each((d: any) => d.current = d);

      const arc = d3.arc<any>()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0 * radius)
        .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

      const g = svg.append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      const path = g.append("g")
        .selectAll("path")
        .data(root.descendants().slice(1))
        .join("path")
        .attr("fill", (d: any) => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
        .attr("fill-opacity", (d: any) => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
        .attr("pointer-events", (d: any) => arcVisible(d.current) ? "auto" : "none")
        .attr("d", (d: any) => arc(d.current));

      path.filter((d: any) => d.children)
        .style("cursor", "pointer")
        .on("click", clicked);

      const format = d3.format(",d");
      path.append("title")
        .text((d: any) => `${d.ancestors().map((d: any) => d.data.name).reverse().join("/")}\n${format(d.value)}`);

      const label = g.append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .selectAll("text")
        .data(root.descendants().slice(1))
        .join("text")
        .attr("dy", "0.35em")
        .attr("fill-opacity", (d: any) => +labelVisible(d.current))
        .attr("transform", (d: any) => labelTransform(d.current))
        .text((d: any) => d.data.name);

      const parent = g.append("circle")
        .datum(root)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("click", clicked);

      function clicked(event: any, p: any) {
        parent.datum(p.parent || root);

        root.each((d: any) => d.target = {
          x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
          x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
          y0: Math.max(0, d.y0 - p.depth),
          y1: Math.max(0, d.y1 - p.depth)
        });

        const t = g.transition().duration(750);

        path.transition(t)
          .tween("data", (d: any) => {
            const i = d3.interpolate(d.current, d.target);
            return (t: any) => d.current = i(t);
          })
          .filter(function (d: any) {
            return +this.getAttribute("fill-opacity")! || arcVisible(d.target);
          })
          .attr("fill-opacity", (d: any) => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
          .attr("pointer-events", (d: any) => arcVisible(d.target) ? "auto" : "none")
          .attrTween("d", (d: any) => () => arc(d.current));

        label.filter(function (d: any) {
          return +this.getAttribute("fill-opacity")! || labelVisible(d.target);
        }).transition(t)
          .attr("fill-opacity", (d: any) => +labelVisible(d.target))
          .attrTween("transform", (d: any) => () => labelTransform(d.current));
      }

      function arcVisible(d: any) {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
      }

      function labelVisible(d: any) {
        return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
      }

      function labelTransform(d: any) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2 * radius;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      }
    }
  }, [data, width, height]);

  return (
    <svg ref={svgRef} width={width} height={height}></svg>
  );
};

export default ZoomableSunburst;
