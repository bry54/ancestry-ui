import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { useContainerSize } from '@/hooks/use-container-size';
import type { TreeNode as HierarchyData } from '../data/tree-data';

// --- COMPONENT PROPS ---
interface ResponsiveRadialTreeChartProps {
  data: HierarchyData;
}

export const ResponsiveRadialTreeChart: React.FC<
  ResponsiveRadialTreeChartProps
> = ({ data }) => {
  // 1. Measure the container
  const { ref, width, height } = useContainerSize();

  // 2. Memoize D3 calculations
  const { nodes, links } = useMemo(() => {
    if (width === 0 || height === 0) {
      return { nodes: [], links: [] };
    }

    // The radius of the tree is half of the smallest dimension of the container.
    const radius = Math.min(width, height) / 2;

    // Create a D3 hierarchy from our data
    const root = d3.hierarchy(data);

    // Create the tree layout generator for a radial layout.
    // The size is [2 * PI, radius], which means it will span a full circle.
    const treeLayout = d3.tree().size([2 * Math.PI, radius]);

    // Apply the layout to the hierarchy
    const tree = treeLayout(root);

    // Get the nodes and links from the layout
    const nodes = tree.descendants();
    const links = tree.links();

    return { nodes, links };
  }, [data, width, height]);

  return (
    <div ref={ref} className="w-full h-full">
      <svg width={width} height={height}>
        {/* Center the entire tree in the middle of the SVG */}
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {/* Render Links (the branches) */}
          {links.map((link, i) => (
            <path
              key={i}
              // The d3.linkRadial generator creates the "d" attribute for the path
              d={
                d3
                  .linkRadial()
                  .angle((d: any) => d.x)
                  .radius((d: any) => d.y)({
                  source: link.source,
                  target: link.target,
                }) || ''
              }
              fill="none"
              stroke="gray"
              strokeWidth={1}
            />
          ))}

          {/* Render Nodes (the people) */}
          {nodes.map((node: any, i) => (
            <g
              key={i}
              // Position each node group using polar coordinates converted to Cartesian
              transform={`
                rotate(${(node.x * 180) / Math.PI - 90})
                translate(${node.y}, 0)
              `}
            >
              <circle
                r={4}
                fill={node.children ? 'steelblue' : '#555'}
                strokeWidth={1}
              />
              <text
                dy="0.31em"
                x={node.children ? -6 : 6}
                textAnchor={node.children ? 'end' : 'start'}
                // Rotate text to be upright
                transform={node.x > Math.PI ? 'rotate(180)' : 'rotate(0)'}
                fontSize={12}
                fill="#333"
              >
                {node.data.name}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};
