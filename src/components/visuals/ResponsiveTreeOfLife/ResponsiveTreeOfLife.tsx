import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { useContainerSize } from '@/hooks/use-container-size';
import type { NewickNode } from './data';

// --- COMPONENT PROPS ---
interface ResponsiveTreeOfLifeProps {
  data: NewickNode;
}

export const ResponsiveTreeOfLife: React.FC<ResponsiveTreeOfLifeProps> = ({ data }) => {
  const { ref, width, height } = useContainerSize();
  const [hoveredNode, setHoveredNode] = useState<d3.HierarchyPointNode<NewickNode> | null>(null);

  const { root, radius } = useMemo(() => {
    if (width === 0 || height === 0) {
      return { root: null, radius: 0 };
    }
    const radius = Math.min(width, height) / 2 - 80;
    const tree = d3.cluster<NewickNode>().size([2 * Math.PI, radius]);
    const rootNode = d3.hierarchy(data, d => d.children);
    return { root: tree(rootNode), radius };
  }, [data, width, height]);

  if (!root) {
    return <div ref={ref} className="w-full h-full" />;
  }

  const hoveredPath = hoveredNode ? hoveredNode.ancestors() : [];

  return (
    <div ref={ref} className="w-full h-full">
      <svg width={width} height={height} onMouseLeave={() => setHoveredNode(null)}>
        <g transform={`translate(${width / 2},${height / 2})`}>
          {/* Render Links */}
          <g fill="none" stroke="#555" strokeOpacity={0.4} strokeWidth={1.5}>
            {root.links().map((link, i) => (
              <path
                key={i}
                stroke={hoveredPath.includes(link.target) ? 'red' : '#555'}
                strokeOpacity={hoveredPath.includes(link.target) ? 1 : 0.2}
                d={
                  d3.linkRadial()
                    .angle((d: any) => d.x)
                    .radius((d: any) => d.y)
                    ({ source: link.source, target: link.target }) || ''
                }
              />
            ))}
          </g>

          {/* Render Nodes */}
          <g>
            {root.descendants().map((node, i) => (
              <g
                key={i}
                transform={`rotate(${node.x * 180 / Math.PI - 90}) translate(${node.y},0)`}
                onMouseOver={() => setHoveredNode(node)}
              >
                <circle
                  r={2.5}
                  fill={hoveredPath.includes(node) ? 'red' : '#555'}
                />
                <text
                  dy="0.31em"
                  x={node.x < Math.PI === !node.children ? 6 : -6}
                  textAnchor={node.x < Math.PI === !node.children ? 'start' : 'end'}
                  transform={node.x >= Math.PI ? 'rotate(180)' : ''}
                  fontSize={10}
                  fill="#333"
                  style={{ cursor: 'default' }}
                >
                  {node.data.name}
                </text>
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
};
