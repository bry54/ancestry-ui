import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { useContainerSize } from '@/hooks/use-container-size';
import type { ArcData, ArcLink } from './data';

// --- COMPONENT PROPS ---
interface ResponsiveArcDiagramProps {
  data: ArcData;
}

const MARGINS = { top: 20, right: 20, bottom: 50, left: 20 };

export const ResponsiveArcDiagram: React.FC<ResponsiveArcDiagramProps> = ({ data }) => {
  const { ref, width, height } = useContainerSize();

  const { nodes, links, xScale } = useMemo(() => {
    if (width === 0 || height === 0) {
      return { nodes: [], links: [], xScale: null };
    }

    const boundedWidth = width - MARGINS.left - MARGINS.right;
    const nodeIds = data.nodes.map(n => n.id);
    
    const xScale = d3.scalePoint()
      .domain(nodeIds)
      .range([0, boundedWidth])
      .padding(0.5);

    return { nodes: data.nodes, links: data.links, xScale };
  }, [data, width, height]);

  if (!xScale) {
    return <div ref={ref} className="w-full h-full" />;
  }

  return (
    <div ref={ref} className="w-full h-full">
      <svg width={width} height={height}>
        <g transform={`translate(${MARGINS.left}, ${MARGINS.top})`}>
          {/* Render Links (Arcs) */}
          {links.map((link, i) => {
            const x1 = xScale(link.source);
            const x2 = xScale(link.target);

            if (x1 === undefined || x2 === undefined) return null;

            const r = Math.abs(x2 - x1) / 2;
            const path = `M ${x1},${height - MARGINS.bottom} A ${r},${r} 0 0,1 ${x2},${height - MARGINS.bottom}`;

            return (
              <path
                key={i}
                d={path}
                fill="none"
                stroke="steelblue"
                strokeOpacity={0.6}
                strokeWidth={1 + link.value}
              />
            );
          })}

          {/* Render Nodes */}
          {nodes.map((node, i) => {
            const x = xScale(node.id);
            if (x === undefined) return null;

            return (
              <g key={i} transform={`translate(${x}, ${height - MARGINS.bottom})`}>
                <circle r={5} fill="steelblue" />
                <text
                  y={15}
                  textAnchor="middle"
                  fontSize={12}
                  fill="#333"
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
