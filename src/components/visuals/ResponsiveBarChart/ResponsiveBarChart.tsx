import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { useContainerSize } from '@/hooks/use-container-size';

// Define the shape of our data points
interface DataPoint {
  name: string;
  value: number;
}

// Define the props for our component
interface ResponsiveBarChartProps {
  data: DataPoint[];
}

const MARGINS = { top: 20, right: 20, bottom: 30, left: 40 };

export const ResponsiveBarChart: React.FC<ResponsiveBarChartProps> = ({ data }) => {
  // 1. Measure the container using our custom hook
  const { ref, width, height } = useContainerSize();

  // 2. D3 calculations are memoized. They will only re-run when width, height, or data change.
  const { xScale, yScale, boundedWidth, boundedHeight } = useMemo(() => {
    const boundedWidth = width - MARGINS.left - MARGINS.right;
    const boundedHeight = height - MARGINS.top - MARGINS.bottom;

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, boundedWidth])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .range([boundedHeight, 0]);

    return { xScale, yScale, boundedWidth, boundedHeight };
  }, [data, width, height]);

  // 3. Render the SVG. React handles the DOM, D3 provides the calculations.
  return (
    <div ref={ref} className="w-full h-full">
      <svg width={width} height={height}>
        <g transform={`translate(${MARGINS.left}, ${MARGINS.top})`}>
          {/* Y-axis */}
          <g
            ref={(node) => {
              if (node) d3.select(node).call(d3.axisLeft(yScale));
            }}
          />
          {/* X-axis */}
          <g
            transform={`translate(0, ${boundedHeight})`}
            ref={(node) => {
              if (node) d3.select(node).call(d3.axisBottom(xScale));
            }}
          />
          {/* Bars */}
          {data.map((d) => (
            <rect
              key={d.name}
              x={xScale(d.name)}
              y={yScale(d.value)}
              width={xScale.bandwidth()}
              height={boundedHeight - yScale(d.value)}
              fill="steelblue"
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
