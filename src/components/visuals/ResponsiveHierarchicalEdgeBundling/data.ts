// Defines the structure for the hierarchy.
export interface HierarchyNode {
  name: string;
  children?: HierarchyNode[];
  // Other properties can be added if needed
}

// Defines the structure for a single link.
// The source and target refer to the `name` of a node in the hierarchy.
export interface EdgeLink {
  source: string;
  target: string;
}

export interface EdgeBundlingData {
  hierarchy: HierarchyNode;
  links: EdgeLink[];
}

// Sample data representing a software project's dependencies.
export const dependencyData: EdgeBundlingData = {
  hierarchy: {
    name: 'root',
    children: [
      {
        name: 'analytics',
        children: [
          { name: 'analytics.cluster' },
          { name: 'analytics.graph' },
        ],
      },
      {
        name: 'vis',
        children: [
          { name: 'vis.tooltip' },
          { name: 'vis.legend' },
          { name: 'vis.axis' },
        ],
      },
      {
        name: 'core',
        children: [
          { name: 'core.string' },
          { name: 'core.array' },
        ],
      },
    ],
  },
  links: [
    { source: 'analytics.graph', target: 'core.array' },
    { source: 'analytics.graph', target: 'vis.axis' },
    { source: 'analytics.cluster', target: 'core.array' },
    { source: 'vis.tooltip', target: 'core.string' },
    { source: 'vis.legend', target: 'core.string' },
    { source: 'core.array', target: 'core.string' },
    { source: 'vis.axis', target: 'core.string' },
  ],
};
