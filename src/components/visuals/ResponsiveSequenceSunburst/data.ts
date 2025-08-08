// Defines the final hierarchical structure.
export interface HierarchyNode {
  name: string;
  value?: number;
  children?: HierarchyNode[];
}

// Takes raw sequence data and builds the hierarchical structure required by D3.
export const buildHierarchy = (sequences: [string[], number][]): HierarchyNode => {
  const root: HierarchyNode = { name: 'root', children: [] };

  for (const [sequence, size] of sequences) {
    let currentNode = root;
    for (let i = 0; i < sequence.length; i++) {
      const part = sequence[i];
      let childNode = currentNode.children?.find(child => child.name === part);

      if (!childNode) {
        childNode = { name: part, children: [] };
        currentNode.children = currentNode.children || [];
        currentNode.children.push(childNode);
      }
      currentNode = childNode;
    }
    currentNode.value = size;
  }
  return root;
};


// Sample data representing user navigation paths and their frequency.
// Format: [[sequence_array, count], ...]
export const visitSequences: [string[], number][] = [
  [['home', 'about', 'contact'], 150],
  [['home', 'about', 'team'], 80],
  [['home', 'services', 'web-dev'], 200],
  [['home', 'services', 'mobile-dev'], 180],
  [['home', 'services', 'seo'], 120],
  [['home', 'blog', 'article-1'], 90],
  [['home', 'blog', 'article-2'], 60],
  [['home', 'contact'], 50],
  [['about'], 30], // A sequence can also start from a different point
];
