import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { useContainerSize } from '@/hooks/use-container-size';
// We can reuse the same data structure from the other component
import type { EdgeBundlingData } from '../ResponsiveHierarchicalEdgeBundling/data';

// --- COMPONENT PROPS ---
interface ResponsiveHierarchicalEdgeBundling2Props {
  data: EdgeBundlingData;
}

export const ResponsiveHierarchicalEdgeBundling2: React.FC<ResponsiveHierarchicalEdgeBundling2Props> = ({ data }) => {
  const { ref, width, height } = useContainerSize();

  const { nodes, links } = useMemo(() => {
    if (width === 0 || height === 0) {
      return { nodes: [], links: [] };
    }

    const radius = Math.min(width, height) / 2 - 50;
    const cluster = d3.cluster().size([2 * Math.PI, radius]);
    
    const root = d3.hierarchy(data.hierarchy);
    cluster(root);

    const nodeMap = new Map(root.descendants().map(d => [d.data.name, d]));

    const generatedLinks = data.links.map(link => {
      const sourceNode = nodeMap.get(link.source);
      const targetNode = nodeMap.get(link.target);
      if (!sourceNode || !targetNode) return null;
      return sourceNode.path(targetNode);
    }).filter(Boolean);

    return { nodes: root.descendants(), links: generatedLinks };
  }, [data, width, height]);

  const lineGenerator = d3.lineRadial()
    .curve(d3.curveBundle.beta(0.85))
    .radius((d: any) => d.y)
    .angle((d: any) => d.x);

  return (
    <div ref={ref} className="w-full h-full">
      <svg width={width} height={height}>
        <g transform={`translate(${width / 2},${height / 2})`}>
          {/* Render Links */}
          <g stroke="steelblue" strokeOpacity={0.4} fill="none">
            {links.map((link, i) => (
              <path key={i} d={lineGenerator(link as any) || ''} />
            ))}
          </g>

          {/* Render Nodes */}
          <g>
            {nodes.filter(d => !d.children).map((node, i) => (
              <g key={i} transform={`rotate(${node.x * 180 / Math.PI - 90}) translate(${node.y},0)`}>
                <text
                  dy="0.31em"
                  x={node.x < Math.PI ? 6 : -6}
                  textAnchor={node.x < Math.PI ? 'start' : 'end'}
                  transform={node.x >= Math.PI ? 'rotate(180)' : ''}
                  fontSize={12}
                  fill="#333"
                >
                  {node.data.name.split('.').pop()}
                </text>
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
};
