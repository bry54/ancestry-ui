
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface AnimatedTreemapProps {
  width?: number;
  height?: number;
}

const AnimatedTreemap: React.FC<AnimatedTreemapProps> = ({ width = 928, height = 928 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    Promise.all([
      d3.csv('https://gist.githubusercontent.com/mbostock/9535021/raw/3b727268425af3977a35e43da394c1395a833afd/census-regions.csv'),
      d3.tsv('https://gist.githubusercontent.com/mbostock/9535021/raw/3b727268425af3977a35e43da394c1395a833afd/population.tsv')
    ]).then(([regions, states]) => {
      const keys = states.columns.slice(1);
      const regionByState = new Map(regions.map(d => [d.State, d.Region]));
      const divisionByState = new Map(regions.map(d => [d.State, d.Division]));
      const processedData = {
        keys,
        group: d3.group(states, (d: any) => regionByState.get(d.name), (d: any) => divisionByState.get(d.name))
      };
      setData(processedData);
    });
  }, []);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const treemap = d3.treemap()
      .tile(d3.treemapResquarify)
      .size([width, height])
      .padding(d => d.height === 1 ? 1 : 0)
      .round(true);

    const root = treemap(d3.hierarchy(data.group)
      .sum(d => Array.isArray((d as any).values) ? d3.sum((d as any).values.map((v: any) => v.values[currentIndex])) : 0)
      .sort((a, b) => b.value! - a.value!));

    const color = d3.scaleOrdinal(d3.schemeCategory10.map(c => d3.interpolateRgb(c, "#fff")(0.5)));

    const leaf = svg.append("g")
      .selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

    leaf.append("rect")
      .attr("fill", d => {
        let parent = d.parent;
        while (parent && parent.depth > 1) {
          parent = parent.parent;
        }
        return color(parent ? (parent.data as any)[0] : "");
      })
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0);

    leaf.append("text")
      .selectAll("tspan")
      .data(d => [(d.data as any).name, d.value?.toLocaleString()])
      .join("tspan")
      .attr("x", 3)
      .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
      .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
      .text(d => d as string);

  }, [data, width, height, currentIndex]);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentIndex(parseInt(event.target.value, 10));
  };

  return (
    <div>
      {data && (
        <input
          type="range"
          min="0"
          max={data.keys.length - 1}
          value={currentIndex}
          onChange={handleSliderChange}
        />
      )}
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};

export default AnimatedTreemap;
