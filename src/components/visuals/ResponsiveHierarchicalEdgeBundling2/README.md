# Responsive Hierarchical Edge Bundling (Static Version)

This component renders a **static**, responsive, SVG-based hierarchical edge bundling diagram. It is a non-interactive version of the chart, suitable for presentation where user interaction is not required.

For an interactive version with path highlighting, see the `ResponsiveHierarchicalEdgeBundling` component.

## How to Use

### 1. Prepare Your Data

This component requires a `data` prop with a specific structure: an object containing both a `hierarchy` and a `links` array.

-   `hierarchy`: A nested object representing the hierarchical structure of your nodes.
-   `links`: An array of link objects, where `source` and `target` refer to the `name` of a node in the hierarchy.

```tsx
import { ResponsiveHierarchicalEdgeBundling2 } from '@/components/visuals/ResponsiveHierarchicalEdgeBundling2/ResponsiveHierarchicalEdgeBundling2';
// Note: We can reuse the data structure from the other component
import { dependencyData } from '@/components/visuals/ResponsiveHierarchicalEdgeBundling/data';

const MyPage = () => (
  <div className="w-full h-[700px]">
    <ResponsiveHierarchicalEdgeBundling2 data={dependencyData} />
  </div>
);
```

### 2. Place in a Container

Wrap the component in a container `<div>`. The chart will automatically resize. For best results, use a container that is roughly square (`aspect-square`).

## Props

-   **`data`**: `EdgeBundlingData` (required)
    -   An object containing the hierarchy and links.
    -   `EdgeBundlingData` interface: `{ hierarchy: HierarchyNode; links: EdgeLink[]; }`
    -   `HierarchyNode` interface: `{ name: string; children?: HierarchyNode[]; }`
    -   `EdgeLink` interface: `{ source: string; target: string; }`
