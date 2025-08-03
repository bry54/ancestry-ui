
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface HierarchicalEdgeBundlingProps {
  width?: number;
  height?: number;
}

const HierarchicalEdgeBundling: React.FC<HierarchicalEdgeBundlingProps> = ({ width = 954, height = 954 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const data = {
    "name": "flare",
    "children": [
      {
        "name": "analytics",
        "children": [
          {
            "name": "cluster",
            "children": [
              { "name": "AgglomerativeCluster", "size": 3938, "imports": ["flare.analytics.cluster.AgglomerativeCluster"] },
              { "name": "CommunityStructure", "size": 3812, "imports": ["flare.analytics.cluster.CommunityStructure"] },
              { "name": "HierarchicalCluster", "size": 6714, "imports": ["flare.analytics.cluster.HierarchicalCluster"] },
              { "name": "MergeEdge", "size": 743, "imports": ["flare.analytics.cluster.MergeEdge"] }
            ]
          },
          {
            "name": "graph",
            "children": [
              { "name": "BetweennessCentrality", "size": 3534, "imports": ["flare.analytics.graph.BetweennessCentrality"] },
              { "name": "LinkDistance", "size": 5731, "imports": ["flare.analytics.graph.LinkDistance"] },
              { "name": "MaxFlowMinCut", "size": 7840, "imports": ["flare.analytics.graph.MaxFlowMinCut"] },
              { "name": "ShortestPath", "size": 5914, "imports": ["flare.analytics.graph.ShortestPath"] },
              { "name": "SpanningTree", "size": 3416, "imports": ["flare.analytics.graph.SpanningTree"] }
            ]
          },
          {
            "name": "optimization",
            "children": [
              { "name": "AspectRatioBanker", "size": 7074, "imports": ["flare.analytics.optimization.AspectRatioBanker"] }
            ]
          }
        ]
      }
    ]
  };

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();

      const radius = width / 2;
      const tree = d3.cluster().size([2 * Math.PI, radius - 100]);

      const root = tree(bilink(d3.hierarchy(data).sort((a, b) => d3.ascending(a.data.name, b.data.name))));

      const colorin = "#00f";
      const colorout = "#f00";
      const colornone = "#ccc";

      const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);

      const node = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .selectAll("g")
        .data(root.leaves())
        .join("g")
        .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
        .append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d.x < Math.PI ? 6 : -6)
        .attr("text-anchor", d => d.x < Math.PI ? "start" : "end")
        .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
        .text(d => d.data.name)
        .each(function (d) { (d as any).text = this; })
        .on("mouseover", overed)
        .on("mouseout", outed)
        .call(text => text.append("title").text(d => `${id(d)}
${(d as any).outgoing.length} outgoing
${(d as any).incoming.length} incoming`));

      const line = d3.lineRadial()
        .curve(d3.curveBundle.beta(0.85))
        .radius((d: any) => d.y)
        .angle((d: any) => d.x);

      const link = g.append("g")
        .attr("stroke", colornone)
        .attr("fill", "none")
        .selectAll("path")
        .data(root.leaves().flatMap(leaf => (leaf as any).outgoing))
        .join("path")
        .style("mix-blend-mode", "multiply")
        .attr("d", ([i, o]: any) => line(i.path(o)))
        .each(function (d) { (d as any).path = this; });

      function overed(event: any, d: any) {
        link.style("mix-blend-mode", null);
        d3.select(this).attr("font-weight", "bold");
        d3.selectAll(d.incoming.map((d: any) => d.path)).attr("stroke", colorin).raise();
        d3.selectAll(d.incoming.map(([d]: any) => d.text)).attr("fill", colorin).attr("font-weight", "bold");
        d3.selectAll(d.outgoing.map((d: any) => d.path)).attr("stroke", colorout).raise();
        d3.selectAll(d.outgoing.map(([, d]: any) => d.text)).attr("fill", colorout).attr("font-weight", "bold");
      }

      function outed(event: any, d: any) {
        link.style("mix-blend-mode", "multiply");
        d3.select(this).attr("font-weight", null);
        d3.selectAll(d.incoming.map((d: any) => d.path)).attr("stroke", null);
        d3.selectAll(d.incoming.map(([d]: any) => d.text)).attr("fill", null).attr("font-weight", null);
        d3.selectAll(d.outgoing.map((d: any) => d.path)).attr("stroke", null);
        d3.selectAll(d.outgoing.map(([, d]: any) => d.text)).attr("fill", null).attr("font-weight", null);
      }

      function id(node: any) {
        return `${node.parent ? id(node.parent) + "." : ""}${node.data.name}`;
      }

      function bilink(root: any) {
        const map = new Map(root.leaves().map((d: any) => [id(d), d]));
        for (const d of root.leaves()) {
          d.incoming = [];
          d.outgoing = d.data.imports.map((i: any) => [d, map.get(i)]);
        }
        for (const d of root.leaves()) {
          for (const o of d.outgoing) {
            o[1].incoming.push(o);
          }
        }
        return root;
      }
    }
  }, [data, width, height]);

  return (
    <svg ref={svgRef} width={width} height={height}></svg>
  );
};

export default HierarchicalEdgeBundling;
