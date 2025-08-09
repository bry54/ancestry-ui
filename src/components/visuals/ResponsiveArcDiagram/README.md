# Responsive Arc Diagram

This component renders a responsive, SVG-based arc diagram. It is used to visualize connections between nodes that are arranged in a linear layout. It is a good alternative to a full network graph when the primary focus is on the connections themselves.

## How to Use

### 1. Prepare Your Data

The component requires a `data` prop containing `nodes` and `links`.

-   `nodes`: An array of objects, each with a unique `id`.
-   `links`: An array of objects, where `source` and `target` refer to node `id`s. The `value` property is used to determine the thickness of the arc.

```tsx
import {ResponsiveArcDiagram1} from '@/components/visuals/ResponsiveArcDiagram1/ResponsiveArcDiagram1';
import {characterConnections} from '@/components/visuals/ResponsiveArcDiagram1/data';

const MyPage = () => (
    <div className="w-full h-[400px]">
        <ResponsiveArcDiagram1 data={characterConnections}/>
    </div>
);
```

### 2. Place in a Container

Wrap the component in a container `<div>`. The chart will automatically resize to fill this container. The height of the container determines the maximum height of the arcs.

## Props

-   **`data`**: `ArcData` (required)
    -   An object containing the nodes and links for the graph.
    -   `ArcData` interface: `{ nodes: ArcNode[]; links: ArcLink[]; }`
    -   `ArcNode` interface: `{ id: string; }`
    -   `ArcLink` interface: `{ source: string; target: string; value: number; }`
