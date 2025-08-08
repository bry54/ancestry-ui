// This defines the structure for each node in our graph.
export interface GraphNode {
  id: string; // Unique identifier for the node
}

// This defines the structure for each link.
// The source and target are indices into the nodes array.
export interface GraphLink {
  source: number;
  target: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Sample network data.
export const networkData: GraphData = {
  nodes: [
    { id: 'John' },
    { id: 'Mary' },
    { id: 'Peter' },
    { id: 'Jane' },
    { id: 'Michael' },
    { id: 'Sarah' },
    { id: 'Chris' },
  ],
  links: [
    { source: 0, target: 1 }, // John -> Mary
    { source: 0, target: 2 }, // John -> Peter
    { source: 1, target: 3 }, // Mary -> Jane
    { source: 2, target: 3 }, // Peter -> Jane
    { source: 0, target: 4 }, // John -> Michael
    { source: 4, target: 5 }, // Michael -> Sarah
    { source: 4, target: 6 }, // Michael -> Chris
  ],
};
