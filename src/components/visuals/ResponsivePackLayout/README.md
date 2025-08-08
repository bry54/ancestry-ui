# Responsive Pack Layout

This component renders a responsive, hierarchical circle-packing layout using D3.js. It is used to visualize hierarchical data where child nodes are enclosed within their parent nodes. This layout is effective at showing the relative size and containment of different branches in a hierarchy.

## How to Use

### 1. Prepare Your Data

The component requires a `data` prop, which is a nested object representing the hierarchy. It uses the same data structure as the Tree and Sunburst components.

```tsx
import { ResponsivePackLayout } from '@/components/visuals/ResponsivePackLayout/ResponsivePackLayout';
// We can reuse the data from the tree components
import { familyTreeData } from '@/components/visuals/data/tree-data';

const MyPage = () => (
  <div className="w-full h-[600px]">
    <ResponsivePackLayout data={familyTreeData} />
  </div>
);
```

### 2. Place in a Container

Wrap the component in a container `<div>`. The layout will automatically resize to fit the container. For best results, use a container that is roughly square (`aspect-square`).

## Props

-   **`data`**: `HierarchyData` (required)
    -   A nested object representing the root node of the hierarchy.
    -   `HierarchyData` interface: `{ name: string; children?: HierarchyPointNode[]; }`
