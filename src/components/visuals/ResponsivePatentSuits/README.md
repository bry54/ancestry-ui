# Responsive Patent Suits Graph

This component renders a responsive, force-directed graph inspired by the "Mobile Patent Suits" visualization. It displays nodes as company logos and the links between them as lines of varying thickness.

## How to Use

### 1. Prepare Your Data

The component requires a `data` prop containing `nodes` and `links`.

-   `nodes`: An array of objects, each with a unique `id`, a `group` number, and a `logo` path. The logo path should point to an image in your `/public` directory.
-   `links`: An array of objects, where `source` and `target` refer to node `id`s. The `value` property is used to determine the thickness of the link.

```tsx
import { ResponsivePatentSuits } from '@/components/visuals/ResponsivePatentSuits/ResponsivePatentSuits';
import { patentSuitsData } from '@/components/visuals/ResponsivePatentSuits/data';

const MyPage = () => (
  <div className="w-full h-[600px]">
    <ResponsivePatentSuits data={patentSuitsData} />
  </div>
);
```

### 2. Place in a Container

Wrap the component in a container `<div>`. The graph will be laid out to fit within the dimensions of this container.

## Props

-   **`data`**: `PatentData` (required)
    -   An object containing the nodes and links for the graph.
    -   `PatentData` interface: `{ nodes: PatentNode[]; links: PatentLink[]; }`
    -   `PatentNode` interface: `{ id: string; group: number; logo: string; }`
    -   `PatentLink` interface: `{ source: string; target: string; value: number; }`
