
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface PolarClockProps {
  width?: number;
  height?: number;
}

const PolarClock: React.FC<PolarClockProps> = ({ width = 960, height = 500 }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear SVG on re-render

    const radius = Math.min(width, height) / 2 - 50;
    const x = width / 2;
    const y = height / 2;

    const fields = [
      { radius: 0.20, interval: d3.timeYear, subinterval: d3.timeMonth, format: d3.timeFormat("%b") },
      { radius: 0.30, interval: d3.timeMonth, subinterval: d3.timeDay, format: d3.timeFormat("%d") },
      { radius: 0.40, interval: d3.timeDay, subinterval: d3.timeHour, format: d3.timeFormat("%H") },
      { radius: 0.50, interval: d3.timeHour, subinterval: d3.timeMinute, format: d3.timeFormat("%M") },
      { radius: 0.60, interval: d3.timeMinute, subinterval: d3.timeSecond, format: d3.timeFormat("%S") },
      { radius: 0.70, interval: d3.timeSecond, subinterval: d3.timeMillisecond, format: d3.timeFormat(".%L") }
    ];

    const arc = d3.arc()
      .startAngle(0)
      .endAngle((d: any) => d.angle)
      .innerRadius((d: any) => d.radius)
      .outerRadius((d: any) => d.radius + 0.05 * radius); // Slightly thicker arcs for visibility

    const g = svg.append("g").attr("transform", `translate(${x},${y})`);

    const field = g.selectAll(".field")
      .data(fields)
      .enter().append("g")
      .attr("class", "field");

    field.append("circle")
      .attr("r", (d: any) => d.radius * radius)
      .attr("fill", "none")
      .attr("stroke", "#ccc");

    const fieldFocus = g.append("circle")
      .attr("r", 5)
      .attr("fill", "red");

    const update = () => {
      const now = new Date();
      setCurrentTime(now); // Update React state to trigger re-render if needed, though D3 handles most here

      field.each(function(d: any) {
        const field = d3.select(this);
        const arcRadius = d.radius * radius;

        const start = d.interval(now);
        const end = d.interval.offset(start, 1);
        const extent = [start, end];

        const scale = d3.scaleTime().domain(extent).range([0, 2 * Math.PI]);

        const ticks = d.subinterval.every(1) ? d.subinterval.range(start, end) : [];

        const fieldTick = field.selectAll(".field-tick")
          .data(ticks, (t: any) => t.getTime())
          .join(
            enter => enter.append("g")
              .attr("class", "field-tick")
              .attr("transform", (t: any) => `rotate(${scale(t) * 180 / Math.PI - 90})translate(${arcRadius},0)`)
              .call(enter => enter.append("circle")
                .attr("r", 2)
                .attr("fill", "#ccc")
                .attr("class", "field-circle")),
            update => update
              .attr("transform", (t: any) => `rotate(${scale(t) * 180 / Math.PI - 90})translate(${arcRadius},0)`)
          );

        fieldTick.select(".field-circle")
          .attr("fill", (t: any) => {
            const currentInterval = d.interval(now);
            const tickInterval = d.interval(t);
            return d.subinterval.offset(tickInterval, 1) > now && t <= now ? "red" : "#ccc";
          });

        fieldFocus
          .attr("transform", `rotate(${scale(now) * 180 / Math.PI - 90})translate(${arcRadius},0)`);
      });
    };

    const timer = setInterval(update, 1000); // Update every second

    // Initial update
    update();

    return () => clearInterval(timer); // Cleanup on unmount
  }, [width, height]);

  return (
    <svg ref={svgRef} width={width} height={height} style={{ overflow: 'visible' }}></svg>
  );
};

export default PolarClock;
