# Responsive Interactive Hierarchical Edge Bundling

This component renders a responsive, SVG-based hierarchical edge bundling diagram. This type of visualization is excellent for showing connections in a large hierarchy without the visual clutter of straight lines. Edges are "bundled" together as they share a common path up the hierarchy.

This version is **interactive**: mousing over a node will highlight all of its incoming and outgoing connections.

## How to Use

### 1. Prepare Your Data

This component requires a `data` prop with a specific structure: an object containing both a `hierarchy` and a `links` array.

-   `hierarchy`: A nested object representing the hierarchical structure of your nodes.
-   `links`: An array of link objects, where `source` and `target` refer to the `name` of a node in the hierarchy.

```tsx
import { ResponsiveHierarchicalEdgeBundling } from '@/components/visuals/ResponsiveHierarchicalEdgeBundling/ResponsiveHierarchicalEdgeBundling';
import { dependencyData } from '@/components/visuals/ResponsiveHierarchicalEdgeBundling/data';

const MyPage = () => (
  <div className="w-full h-[700px]">
    <ResponsiveHierarchicalEdgeBundling data={dependencyData} />
  </div>
);
```

### 2. Place in a Container

Wrap the component in a container `<div>`. The chart will automatically resize. For best results, use a container that is roughly square (`aspect-square`).

## Interactivity

-   **Mouse Over a Node Label:** Highlights all incoming and outgoing paths for that node in red. All other paths will fade into the background.
-   **Mouse Leave the SVG:** Resets the view, showing all paths with their default styling.

## Props

-   **`data`**: `EdgeBundlingData` (required)
    -   An object containing the hierarchy and links.
    -   `EdgeBundlingData` interface: `{ hierarchy: HierarchyNode; links: EdgeLink[]; }`
    -   `HierarchyNode` interface: `{ name: string; children?: HierarchyNode[]; }`
    -   `EdgeLink` interface: `{ source: string; target: string; }`
