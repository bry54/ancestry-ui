// Defines the structure of the parsed hierarchy.
export interface NewickNode {
  name: string;
  length?: number;
  children?: NewickNode[];
}

// A sample dataset in Newick format.
export const newickSample = `
(
  (
    (
      (
        (cat:4.0,dog:4.0):1.0,
        (monkey:4.5,human:4.5):0.5
      ):1.5,
      (tuna:5.0,shark:5.0):1.0
    ):1.0,
    (fly:6.0,mosquito:6.0):0.0
  ):1.0,
  (oak:7.0,pine:7.0):0.0
);
`;

// A function to parse a Newick string into a hierarchical object.
export function parseNewick(newickString: string): NewickNode {
  const ancestors: NewickNode[] = [];
  let currentNode: NewickNode = {};
  const tokens = newickString.split(/\s*(;|\(|\)|,|:)\s*/).filter(Boolean);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    switch (token) {
      case '(': {
        const newNode: NewickNode = { name: '' };
        if (!currentNode.children) {
          currentNode.children = [];
        }
        currentNode.children.push(newNode);
        ancestors.push(currentNode);
        currentNode = newNode;
        break;
      }
      case ',': {
        const parent = ancestors[ancestors.length - 1];
        const newNode: NewickNode = { name: '' };
        parent.children!.push(newNode);
        currentNode = newNode;
        break;
      }
      case ')': {
        currentNode = ancestors.pop()!;
        break;
      }
      case ':':
        // The next token is the length.
        break;
      default: {
        const prevToken = tokens[i - 1];
        if (prevToken === ')' || prevToken === '(' || prevToken === ',') {
          currentNode.name = token;
        } else if (prevToken === ':') {
          currentNode.length = parseFloat(token);
        }
        break;
      }
    }
  }
  return currentNode;
}
