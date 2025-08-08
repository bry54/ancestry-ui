// This defines the structure for each node in our tree.
export interface HierarchyPointNode {
  name: string;
  children?: HierarchyPointNode[];
}

// Sample family tree data.
export const familyTreeData: HierarchyPointNode = {
  name: 'John Smith Sr.',
  children: [
    {
      name: 'Jane Smith',
      children: [
        { name: 'Peter Jones' },
        { name: 'Mary Jones' },
      ],
    },
    {
      name: 'John Smith Jr.',
      children: [
        {
          name: 'Michael Smith',
          children: [
            { name: 'Emily Smith' },
            { name: 'David Smith' },
          ],
        },
        { name: 'Sarah Smith' },
      ],
    },
    {
      name: 'Robert Smith',
      children: [
        { name: 'Chris Smith' },
      ],
    },
  ],
};
