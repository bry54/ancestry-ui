import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { useContainerSize } from '@/hooks/use-container-size';
import type { TreeNode as HierarchyData } from './data/tree-data';

// --- COMPONENT PROPS ---
interface ResponsiveTreeChartProps {
  data: HierarchyData;
}

const MARGINS = { top: 20, right: 150, bottom: 20, left: 50 };

export const ResponsiveTreeChart: React.FC<ResponsiveTreeChartProps> = ({
  data,
}) => {
  // 1. Measure the container
  const { ref, width, height } = useContainerSize();

  // 2. Memoize D3 calculations
  const { nodes, links } = useMemo(() => {
    // If the container has no dimensions, we can't do anything
    if (width === 0 || height === 0) {
      return { nodes: [], links: [] };
    }

    const boundedWidth = width - MARGINS.left - MARGINS.right;
    const boundedHeight = height - MARGINS.top - MARGINS.bottom;

    // Create a D3 hierarchy from our data
    const root = d3.hierarchy(data);

    // Create the tree layout generator.
    // We tell it to use the bounded dimensions.
    // For a left-to-right tree, the size is [height, width].
    const treeLayout = d3.tree().size([boundedHeight, boundedWidth]);

    // Apply the layout to the hierarchy
    const tree = treeLayout(root);

    // Get the nodes and links from the layout
    const nodes = tree.descendants();
    const links = tree.links();

    return { nodes, links };
  }, [data, width, height]);

  // 3. Render the SVG
  return (
    <div ref={ref} className="w-full h-full">
      <svg width={width} height={height}>
        <g transform={`translate(${MARGINS.left}, ${MARGINS.top})`}>
          {/* Render Links (the branches) */}
          {links.map((link, i) => (
            <path
              key={i}
              // The d3.linkHorizontal generator creates the "d" attribute for the path
              d={
                d3
                  .linkHorizontal()
                  .x((d) => d[0])
                  .y((d) => d[1])([
                  [link.source.y, link.source.x],
                  [link.target.y, link.target.x],
                ]) || ''
              }
              fill="none"
              stroke="gray"
              strokeWidth={1}
            />
          ))}

          {/* Render Nodes (the people) */}
          {nodes.map((node, i) => (
            <g key={i} transform={`translate(${node.y}, ${node.x})`}>
              <circle
                r={4}
                fill={node.children ? 'steelblue' : '#555'}
                strokeWidth={1}
              />
              <text
                dy=".31em"
                x={node.children ? -8 : 8}
                textAnchor={node.children ? 'end' : 'start'}
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
