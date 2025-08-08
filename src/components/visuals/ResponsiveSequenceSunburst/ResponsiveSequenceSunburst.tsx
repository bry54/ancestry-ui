import React, { useState, useMemo } from 'react';
import * as d3 from 'd3';
import { useContainerSize } from '@/hooks/use-container-size';
import type { HierarchyNode } from './data';

// --- COMPONENT PROPS ---
interface ResponsiveSequenceSunburstProps {
  data: HierarchyNode;
}

// --- BREADCRUMB ---
const BREADCRUMB_HEIGHT = 50;
const BREADCRUMB_WIDTH = 100; // Width of each breadcrumb segment

// --- COMPONENT ---
export const ResponsiveSequenceSunburst: React.FC<ResponsiveSequenceSunburstProps> = ({ data }) => {
  const { ref, width, height } = useContainerSize();
  const [hoveredArc, setHoveredArc] = useState<d3.HierarchyRectangularNode<HierarchyNode> | null>(null);

  const { root, colorScale, arcGenerator, radius } = useMemo(() => {
    const root = d3.hierarchy(data).sum(d => d.value || 0);
    const colorScale = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, (root.children?.length || 0) + 1));
    const radius = Math.min(width, height - BREADCRUMB_HEIGHT) / 6;
    
    const partition = d3.partition<HierarchyNode>().size([2 * Math.PI, root.height + 1]);
    const processedRoot = partition(root);

    const arcGenerator = d3.arc<d3.HierarchyRectangularNode<HierarchyNode>>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius * 1.5)
      .innerRadius(d => d.y0 * radius)
      .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

    return { root: processedRoot, colorScale, arcGenerator, radius };
  }, [data, width, height]);

  const totalSize = root.value || 0;
  const sequence = hoveredArc ? hoveredArc.ancestors().reverse().slice(1) : [];
  const percentage = hoveredArc ? ((hoveredArc.value || 0) / totalSize * 100).toPrecision(3) : '100';
  const percentageText = hoveredArc ? `${percentage}% of total` : '';

  return (
    <div ref={ref} className="w-full h-full flex flex-col items-center" onMouseLeave={() => setHoveredArc(null)}>
      {/* 1. Breadcrumb Trail */}
      <svg width={width} height={BREADCRUMB_HEIGHT}>
        {sequence.map((d, i) => (
          <g key={i} transform={`translate(${i * (BREADCRUMB_WIDTH + 5)}, 0)`}>
            <polygon
              points={`0,0 ${BREADCRUMB_WIDTH},0 ${BREADCRUMB_WIDTH + 10},${BREADCRUMB_HEIGHT / 2} ${BREADCRUMB_WIDTH},${BREADCRUMB_HEIGHT} 0,${BREADCRUMB_HEIGHT}`}
              fill={colorScale(d.data.name)}
              stroke="white"
            />
            <text x={BREADCRUMB_WIDTH / 2} y={BREADCRUMB_HEIGHT / 2} dy="0.35em" textAnchor="middle" fill="white">
              {d.data.name}
            </text>
          </g>
        ))}
      </svg>

      {/* 2. Sunburst and Center Text */}
      <div className="relative flex-grow w-full">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height - BREADCRUMB_HEIGHT}`}>
          <g transform={`translate(${width / 2},${(height - BREADCRUMB_HEIGHT) / 2})`}>
            {root.descendants().slice(1).map((p, i) => (
              <path
                key={i}
                fill={colorScale(p.ancestors().length > 1 ? p.ancestors()[p.ancestors().length - 2].data.name : p.data.name)}
                fillOpacity={p.children ? 0.8 : 0.6}
                d={arcGenerator(p) || ''}
                onMouseOver={() => setHoveredArc(p)}
              />
            ))}
          </g>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <p className="text-4xl font-bold">{hoveredArc ? hoveredArc.value : totalSize}</p>
          <p className="text-sm text-gray-600">{percentageText}</p>
        </div>
      </div>
    </div>
  );
};
