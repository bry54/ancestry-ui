# Responsive Collapsible Tree

This component renders a responsive, interactive, SVG-based hierarchical tree chart. Users can click on nodes to expand or collapse their children, making it ideal for exploring large datasets.

## How to Use

1.  **Import the component and data types:**
    ```tsx
    import { ResponsiveCollapsibleTree } from '@/components/visuals/ResponsiveCollapsibleTree/ResponsiveCollapsibleTree';
    import { familyTreeData } from '@/components/visuals/data/tree-data';
    ```

2.  **Provide data:** The component requires a `data` prop, which is a nested object representing the hierarchy. The component manages the collapsed/expanded state internally.

    ```ts
    // See src/components/visuals/data/tree-data.ts for the full structure
    const myTreeData = {
      name: 'Root Node',
      children: [
        { name: 'Child A' },
        { 
          name: 'Child B',
          children: [{ name: 'Grandchild' }]
        },
      ],
    };
    ```

3.  **Place in a container:** Wrap the component in a container `<div>`. The chart will automatically resize. A taller container is recommended to provide space for expansion.

    ```tsx
    <div className="w-full h-[600px]">
      <ResponsiveCollapsibleTree data={myTreeData} />
    </div>
    ```

## Interactivity

-   **Click a node** to expand or collapse its children.
-   **Blue nodes** have children that are currently visible.
-   **White nodes** with a blue border have children that are collapsed.
-   **Solid blue nodes** with no border are leaf nodes (they have no children).

## Props

-   **`data`**: `HierarchyPointNode` (required)
    -   A nested object representing the root node of the tree.
    -   `HierarchyPointNode` interface: `{ name: string; children?: HierarchyPointNode[]; }`
