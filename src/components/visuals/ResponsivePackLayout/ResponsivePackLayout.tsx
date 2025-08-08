import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { useContainerSize } from '@/hooks/use-container-size';
// We can reuse the same data structure from the tree components
import type { HierarchyPointNode as HierarchyData } from '../ResponsiveTreeChart/data';

// --- COMPONENT PROPS ---
interface ResponsivePackLayoutProps {
  data: HierarchyData;
}

export const ResponsivePackLayout: React.FC<ResponsivePackLayoutProps> = ({ data }) => {
  const { ref, width, height } = useContainerSize();

  const { root, colorScale } = useMemo(() => {
    if (width === 0 || height === 0) {
      return { root: null, colorScale: null };
    }

    const size = Math.min(width, height);
    const pack = d3.pack<HierarchyData>()
      .size([size, size])
      .padding(3);

    const rootNode = d3.hierarchy(data)
      .sum(d => d.children ? 0 : 1) // Size leaf nodes equally
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const color = d3.scaleSequential(d3.interpolateMagma)
      .domain([0, 5]);

    return { root: pack(rootNode), colorScale: color };
  }, [data, width, height]);

  if (!root || !colorScale) {
    return <div ref={ref} className="w-full h-full" />;
  }

  return (
    <div ref={ref} className="w-full h-full">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <g>
          {root.descendants().map((node, i) => (
            <g key={i} transform={`translate(${node.x},${node.y})`}>
              <circle
                r={node.r}
                fill={colorScale(node.depth)}
                stroke={node.children ? '#555' : '#999'}
                strokeWidth={1}
                fillOpacity={node.children ? 0.5 : 0.8}
              />
              {!node.children && (
                <text
                  textAnchor="middle"
                  dy="0.3em"
                  fontSize={Math.max(8, node.r / 4)}
                  fill="white"
                >
                  {node.data.name}
                </text>
              )}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};
