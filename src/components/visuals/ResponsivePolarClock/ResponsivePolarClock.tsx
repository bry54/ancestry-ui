import React, { useState, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import { useContainerSize } from '@/hooks/use-container-size';

// --- COMPONENT PROPS ---
// This component is self-contained and doesn't need props.

const fields = [
  { unit: 'seconds', max: 60 },
  { unit: 'minutes', max: 60 },
  { unit: 'hours', max: 24 },
  { unit: 'dayOfWeek', max: 7 },
  { unit: 'dayOfMonth', max: 31 },
  { unit: 'month', max: 12 },
];

export const ResponsivePolarClock: React.FC = () => {
  const { ref, width, height } = useContainerSize();
  const [now, setNow] = useState(new Date());

  // Update the clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { radius, arcGenerator, colorScale } = useMemo(() => {
    const radius = Math.min(width, height) / 2 - 20;
    const arcWidth = radius / fields.length;

    const arcGenerator = d3.arc()
      .innerRadius((d, i) => (i + 1) * arcWidth)
      .outerRadius((d, i) => (i + 2) * arcWidth - 5) // -5 for padding
      .startAngle(0);

    const colorScale = d3.scaleSequential(d3.interpolateRainbow)
      .domain([0, fields.length]);

    return { radius, arcGenerator, colorScale };
  }, [width, height]);

  const timeData = [
    now.getSeconds(),
    now.getMinutes(),
    now.getHours(),
    now.getDay(),
    now.getDate(),
    now.getMonth(),
  ];

  return (
    <div ref={ref} className="w-full h-full">
      <svg width={width} height={height}>
        <g transform={`translate(${width / 2},${height / 2})`}>
          {fields.map((field, i) => {
            const scale = d3.scaleLinear().domain([0, field.max]).range([0, 2 * Math.PI]);
            const angle = scale(timeData[i]);

            return (
              <g key={i}>
                {/* Background Arc */}
                <path
                  d={arcGenerator({ endAngle: 2 * Math.PI } as any, i) || ''}
                  fill={colorScale(i)}
                  fillOpacity={0.1}
                />
                {/* Foreground Arc */}
                <path
                  d={arcGenerator({ endAngle: angle } as any, i) || ''}
                  fill={colorScale(i)}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
