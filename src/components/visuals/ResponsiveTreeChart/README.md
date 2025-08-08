# Responsive Tree Chart

This component renders a responsive, SVG-based hierarchical tree chart using D3.js. It displays data in a classic left-to-right layout.

## How to Use

1.  **Import the component and data types:**
    ```tsx
    import { ResponsiveTreeChart } from '@/components/visuals/ResponsiveTreeChart/ResponsiveTreeChart';
    import { familyTreeData } from '@/components/visuals/data/tree-data';
    ```

2.  **Provide data:** The component requires a `data` prop, which is a nested object representing the hierarchy.

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

3.  **Place in a container:** Wrap the component in a container `<div>`. The chart will automatically resize to fill this container. A taller container is recommended for trees.

    ```tsx
    <div className="w-full h-[600px]">
      <ResponsiveTreeChart data={myTreeData} />
    </div>
    ```

## Props

-   **`data`**: `HierarchyPointNode` (required)
    -   A nested object representing the root node of the tree.
    -   `HierarchyPointNode` interface: `{ name: string; children?: HierarchyPointNode[]; }`
