// Defines the structure for each node.
export interface ArcNode {
  id: string;
}

// Defines the structure for each link.
// The source and target refer to the `id` of a node.
export interface ArcLink {
  source: string;
  target: string;
  value: number; // Used to potentially style the arc, e.g., stroke-width
}

export interface ArcData {
  nodes: ArcNode[];
  links: ArcLink[];
}

// Sample data representing connections in a network.
export const characterConnections: ArcData = {
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
    { source: 'John', target: 'Mary', value: 2 },
    { source: 'John', target: 'Peter', value: 3 },
    { source: 'Mary', target: 'Jane', value: 1 },
    { source: 'Peter', target: 'Jane', value: 1 },
    { source: 'John', target: 'Michael', value: 5 },
    { source: 'Michael', target: 'Sarah', value: 2 },
    { source: 'Michael', target: 'Chris', value: 1 },
    { source: 'Sarah', target: 'Chris', value: 4 },
    { source: 'Peter', target: 'Sarah', value: 1 },
  ],
};
