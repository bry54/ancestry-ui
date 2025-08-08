import React, { useState, useMemo, useEffect } from 'react';
import * as d3 from 'd3';
import { useContainerSize } from '@/hooks/use-container-size';
import type { HierarchyPointNode as HierarchyData } from '../data/tree-data';

// --- COMPONENT PROPS ---
interface ResponsiveCollapsibleTreeProps {
  data: HierarchyData;
}

const MARGINS = { top: 20, right: 150, bottom: 20, left: 50 };

export const ResponsiveCollapsibleTree: React.FC<ResponsiveCollapsibleTreeProps> = ({ data }) => {
  // 1. Measure the container
  const { ref, width, height } = useContainerSize();
  
  // 2. Manage the tree data state
  // We use a state variable to hold the hierarchy, so we can update it on user interaction.
  const [rootNode, setRootNode] = useState<d3.HierarchyPointNode<HierarchyData> | null>(null);

  // Initialize the hierarchy when the component mounts or data changes
  useEffect(() => {
    const root = d3.hierarchy(data);
    // Start with the first level of children collapsed
    root.children?.forEach(collapse);
    setRootNode(root);
  }, [data]);

  // Function to toggle collapse/expand
  const handleNodeClick = (node: d3.HierarchyPointNode<HierarchyData>) => {
    if (node.children) {
      collapse(node);
    } else {
      expand(node);
    }
    // Trigger a re-render by creating a new hierarchy object
    setRootNode(rootNode ? rootNode.copy() : null);
  };

  // D3 convention: store collapsed children in `_children`
  const collapse = (node: d3.HierarchyPointNode<HierarchyData>) => {
    if (node.children) {
      node._children = node.children;
      node.children = undefined;
    }
  };

  const expand = (node: d3.HierarchyPointNode<HierarchyData>) => {
    if (node._children) {
      node.children = node._children;
      node._children = undefined;
    }
  };

  // 3. Memoize D3 layout calculations
  const { nodes, links } = useMemo(() => {
    if (!rootNode || width === 0 || height === 0) {
      return { nodes: [], links: [] };
    }

    const boundedWidth = width - MARGINS.left - MARGINS.right;
    const boundedHeight = height - MARGINS.top - MARGINS.bottom;

    const treeLayout = d3.tree().size([boundedHeight, boundedWidth]);
    const tree = treeLayout(rootNode);

    return { nodes: tree.descendants(), links: tree.links() };
  }, [rootNode, width, height]);

  return (
    <div ref={ref} className="w-full h-full">
      <svg width={width} height={height}>
        <g transform={`translate(${MARGINS.left}, ${MARGINS.top})`}>
          {/* Render Links */}
          {links.map((link, i) => (
            <path
              key={i}
              d={d3.linkHorizontal().x(d => d[0]).y(d => d[1])([[link.source.y, link.source.x], [link.target.y, link.target.x]]) || ''}
              fill="none"
              stroke="gray"
              strokeWidth={1}
            />
          ))}

          {/* Render Nodes */}
          {nodes.map((node, i) => (
            <g
              key={i}
              transform={`translate(${node.y}, ${node.x})`}
              style={{ cursor: 'pointer' }}
              onClick={() => handleNodeClick(node)}
            >
              <circle
                r={5}
                // Fill is white if collapsed, steelblue if expanded
                fill={node._children ? '#fff' : 'steelblue'}
                stroke="steelblue"
                strokeWidth={2}
              />
              <text
                dy=".31em"
                x={node.children || node._children ? -10 : 10}
                textAnchor={node.children || node._children ? 'end' : 'start'}
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
