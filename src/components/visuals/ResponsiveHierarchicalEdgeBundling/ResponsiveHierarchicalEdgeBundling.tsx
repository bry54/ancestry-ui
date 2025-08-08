import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { useContainerSize } from '@/hooks/use-container-size';
import type { EdgeBundlingData } from './data';

// --- COMPONENT PROPS ---
interface ResponsiveHierarchicalEdgeBundlingProps {
  data: EdgeBundlingData;
}

export const ResponsiveHierarchicalEdgeBundling: React.FC<ResponsiveHierarchicalEdgeBundlingProps> = ({ data }) => {
  const { ref, width, height } = useContainerSize();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const { nodes, links, nodeMap } = useMemo(() => {
    if (width === 0 || height === 0) {
      return { nodes: [], links: [], nodeMap: new Map() };
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
      return {
        path: sourceNode.path(targetNode),
        source: link.source,
        target: link.target,
      };
    }).filter(Boolean);

    return { nodes: root.descendants(), links: generatedLinks, nodeMap };
  }, [data, width, height]);

  const lineGenerator = d3.lineRadial()
    .curve(d3.curveBundle.beta(0.85))
    .radius((d: any) => d.y)
    .angle((d: any) => d.x);

  const getLinkStyle = (link: any) => {
    if (!hoveredNode) return { stroke: 'steelblue', strokeOpacity: 0.4 };
    if (link.source === hoveredNode || link.target === hoveredNode) {
      return { stroke: 'red', strokeOpacity: 1 };
    }
    return { stroke: 'steelblue', strokeOpacity: 0.1 };
  };

  return (
    <div ref={ref} className="w-full h-full">
      <svg width={width} height={height} onMouseLeave={() => setHoveredNode(null)}>
        <g transform={`translate(${width / 2},${height / 2})`}>
          {/* Render Links */}
          <g fill="none">
            {links.map((link, i) => (
              <path
                key={i}
                d={lineGenerator(link.path as any) || ''}
                style={getLinkStyle(link)}
              />
            ))}
          </g>

          {/* Render Nodes */}
          <g>
            {nodes.filter(d => !d.children).map((node, i) => (
              <g
                key={i}
                transform={`rotate(${node.x * 180 / Math.PI - 90}) translate(${node.y},0)`}
                onMouseOver={() => setHoveredNode(node.data.name)}
              >
                <text
                  dy="0.31em"
                  x={node.x < Math.PI ? 6 : -6}
                  textAnchor={node.x < Math.PI ? 'start' : 'end'}
                  transform={node.x >= Math.PI ? 'rotate(180)' : ''}
                  fontSize={12}
                  fill="#333"
                  style={{ cursor: 'default' }}
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
