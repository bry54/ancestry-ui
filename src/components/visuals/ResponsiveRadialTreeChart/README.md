# Responsive Radial Tree Chart

This component renders a responsive, SVG-based hierarchical tree chart in a compact, circular layout using D3.js.

## How to Use

1.  **Import the component and data types:**
    ```tsx
    import { ResponsiveRadialTreeChart } from '@/components/visuals/ResponsiveRadialTreeChart/ResponsiveRadialTreeChart';
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

3.  **Place in a container:** Wrap the component in a container `<div>`. The chart will automatically resize. For best results, use a container that is roughly square.

    ```tsx
    <div className="w-full h-[600px]">
      <ResponsiveRadialTreeChart data={myTreeData} />
    </div>
    ```

## Props

-   **`data`**: `HierarchyPointNode` (required)
    -   A nested object representing the root node of the tree.
    -   `HierarchyPointNode` interface: `{ name: string; children?: HierarchyPointNode[]; }`
