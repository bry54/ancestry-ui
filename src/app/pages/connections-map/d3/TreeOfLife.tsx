
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// Helper function from the Observable notebook to parse Newick format
function parseNewick(a){for(var e=[],r={},s=a.split(/\s*(;|,|\(|\)|:)\s*/),t=0;t<s.length;t++){var n=s[t];switch(n){case"(":var c={};r.children=[c],e.push(r),r=c;break;case",":var c={};e[e.length-1].children.push(c),r=c;break;case")":r=e.pop();break;case":":break;default:var h=s[t-1];")"==h||"("==h||","==h?r.name=n:":"==h&&(r.length=parseFloat(n))}}return r}

const TreeOfLife: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Data in Newick format from the Observable example
  const newickData = `(
    no-name:0.1,
    (
      (
        (Homo:0.0001,Pan:0.0001):0.0001,
        Gorilla:0.0002
      ):0.0003,
      Pongo:0.0005
    ):0.0008,
    (
      (
        (
          (
            (Mus:0.001,Rattus:0.001):0.001,
            Cricetulus:0.002
          ):0.003,
          Meriones:0.005
        ):0.008,
        Mesocricetus:0.013
      ):0.021,
      (
        (
          (
            (Bos:0.005,Bison:0.005):0.005,
            (Capra:0.005,Ovis:0.005):0.005
          ):0.005,
          (Sus:0.005,Pecari:0.005):0.005
        ):0.005
      ):0.005
    ):0.005
  );`;

  useEffect(() => {
    if (svgRef.current) {
      const data = parseNewick(newickData);
      const width = 954;
      const outerRadius = width / 2;
      const innerRadius = outerRadius - 170;

      const root = d3.hierarchy(data, d => d.children)
        .sum(d => d.children ? 0 : 1)
        .sort((a, b) => (a.value - b.value) || d3.ascending(a.data.name, b.data.name));

      const cluster = d3.cluster()
        .size([360, innerRadius])
        .separation(() => 1);

      cluster(root);

      const svg = d3.select(svgRef.current)
        .attr("viewBox", [-outerRadius, -outerRadius, width, width])
        .attr("font-family", "sans-serif")
        .attr("font-size", 10);

      svg.selectAll("*").remove(); // Clear previous renders

      // Links
      svg.append("g")
          .attr("fill", "none")
          .attr("stroke", "#000")
        .selectAll("path")
        .data(root.links())
        .join("path")
          .attr("d", d => `
            M${d3.pointRadial(d.source.x, d.source.y)}
            L${d3.pointRadial(d.target.x, d.source.y)}
            L${d3.pointRadial(d.target.x, d.target.y)}
          `);

      // Nodes
      svg.append("g")
        .selectAll("text")
        .data(root.leaves())
        .join("text")
          .attr("dy", ".31em")
          .attr("transform", d => `rotate(${d.x - 90}) translate(${innerRadius + 4},0)${d.x < 180 ? "" : " rotate(180)"}`)
          .attr("text-anchor", d => d.x < 180 ? "start" : "end")
          .text(d => d.data.name.replace(/_/g, " "));
    }
  }, [newickData]);

  return <svg ref={svgRef} width={954} height={954}></svg>;
};

export default TreeOfLife;
