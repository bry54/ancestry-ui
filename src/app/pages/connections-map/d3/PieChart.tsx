
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface PieChartProps {
  width?: number;
  height?: number;
}

const PieChart: React.FC<PieChartProps> = ({ width = 640, height = 480 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<'apples' | 'oranges'>('apples');

  const chartData = [
    { apples: 53245, oranges: 20000 },
    { apples: 28479, oranges: 15000 },
    { apples: 19697, oranges: 30000 },
    { apples: 24037, oranges: 10000 },
    { apples: 40245, oranges: 25000 },
  ];

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const outerRadius = Math.min(width, height) / 2 - 10;
      const innerRadius = outerRadius * 0.75;
      const color = d3.scaleOrdinal(d3.schemeObservable10);

      const pie = d3.pie().sort(null).value((d: any) => d[data]);
      const arc: any = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

      const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);

      const path = g.selectAll("path")
        .data(pie(chartData as any))
        .join("path")
        .attr("fill", (d, i) => color(i.toString()))
        .attr("d", arc)
        .each(function (d) { (this as any)._current = d; });

      const arcTween = (a: any) => {
        const i = d3.interpolate((path as any)._current, a);
        (path as any)._current = i(0);
        return (t: any) => arc(i(t));
      };

      const change = (value: 'apples' | 'oranges') => {
        pie.value((d: any) => d[value]);
        path.data(pie(chartData as any) as any);
        path.transition().duration(750).attrTween("d", arcTween as any);
      };

      change(data);
    }
  }, [data, width, height, chartData]);

  return (
    <div>
      <div>
        <label>
          <input
            type="radio"
            name="dataset"
            value="apples"
            checked={data === 'apples'}
            onChange={() => setData('apples')}
          />
          Apples
        </label>
        <label>
          <input
            type="radio"
            name="dataset"
            value="oranges"
            checked={data === 'oranges'}
            onChange={() => setData('oranges')}
          />
          Oranges
        </label>
      </div>
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};

export default PieChart;
