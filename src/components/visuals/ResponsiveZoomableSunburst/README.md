# Responsive Zoomable Sunburst

This component renders a responsive, interactive, SVG-based sunburst chart. A sunburst chart is used to visualize hierarchical data, showing proportions within a whole. Users can click on arcs to zoom in and focus on a specific part of the hierarchy.

## How to Use

1.  **Import the component and data types:**
    ```tsx
    import { ResponsiveZoomableSunburst } from '@/components/visuals/ResponsiveZoomableSunburst/ResponsiveZoomableSunburst';
    import { familyTreeData } from '@/components/visuals/data/tree-data';
    ```

2.  **Provide data:** The component requires a `data` prop, which is a nested object representing the hierarchy. It uses the same data structure as the other tree-based charts.

    ```ts
    // See src/components/visuals/data/tree-data.ts for the full structure
    const myTreeData = {
      name: 'Root',
      children: [
        { 
          name: 'Category A',
          children: [{ name: 'Sub A1' }, { name: 'Sub A2' }]
        },
        { 
          name: 'Category B',
          children: [{ name: 'Sub B1' }]
        },
      ],
    };
    ```

3.  **Place in a container:** Wrap the component in a container `<div>`. The chart will automatically resize. For best results, use a container that is roughly square (`aspect-square`).

    ```tsx
    <div className="w-full h-[600px] aspect-square">
      <ResponsiveZoomableSunburst data={myTreeData} />
    </div>
    ```

## Interactivity

-   **Click an arc** to zoom in on that section of the hierarchy.
-   **Click the center circle** to zoom back out to the parent level.

## Props

-   **`data`**: `HierarchyPointNode` (required)
    -   A nested object representing the root node of the hierarchy.
    -   `HierarchyPointNode` interface: `{ name: string; children?: HierarchyPointNode[]; }`
