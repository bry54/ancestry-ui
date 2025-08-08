# Reusable D3 Visualization Components

This directory contains responsive, reusable D3.js components built with React, TypeScript, and Tailwind CSS.

## Core Concept

All components in this directory follow a unified design pattern:

1.  **Container-Driven Sizing:** The components are designed to fill their parent container. You control their size and responsiveness using standard Tailwind CSS classes on a wrapper `<div>`.
2.  **`useContainerSize` Hook:** A custom hook (`/src/hooks/use-container-size.ts`) is used to measure the dimensions of the wrapper `<div>`.
3.  **D3 for Calculations, React for Rendering:** D3.js is used for its powerful data calculation libraries (layouts, scales, shapes). React is used to declaratively render the final SVG elements. This provides a clean separation of concerns.

---

## How to Use

### 1. Import the Component

Import the desired chart component into your page or another component.

```tsx
import { ResponsiveBarChart } from '@/components/visuals/ResponsiveBarChart';
import { ResponsiveTreeChart } from '@/components/visuals/ResponsiveTreeChart';
import { ResponsiveRadialTreeChart } from '@/components/visuals/ResponsiveRadialTreeChart';
import { ResponsiveForceGraph } from '@/components/visuals/ResponsiveForceGraph';
```

### 2. Provide Data

Each component expects a `data` prop with a specific shape. You can find the data structures and sample data in the `/src/components/visuals/data` directory.

### 3. Create a Responsive Container

Wrap the component in a `div` and use Tailwind CSS classes to define its size. The chart will automatically adapt to fill this container.

---

## Component Examples

### ResponsiveBarChart

A standard bar chart.

**Data File:** `data/tree-data.ts`

```tsx
import { ResponsiveBarChart } from '@/components/visuals/ResponsiveBarChart';

const barData = [
  { name: 'John', value: 12 },
  { name: 'Mary', value: 9 },
];

const MyPage = () => (
  <div className="w-full h-96">
    <ResponsiveBarChart data={barData} />
  </div>
);
```

### ResponsiveTreeChart

A classic left-to-right hierarchical tree.

**Data File:** `data/tree-data.ts`

```tsx
import { ResponsiveTreeChart } from '@/components/visuals/ResponsiveTreeChart';
import { familyTreeData } from '@/components/visuals/data/tree-data';

const MyPage = () => (
  <div className="w-full h-[600px]">
    <ResponsiveTreeChart data={familyTreeData} />
  </div>
);
```

### ResponsiveRadialTreeChart

A circular, compact tree.

**Data File:** `data/tree-data.ts`

```tsx
import { ResponsiveRadialTreeChart } from '@/components/visuals/ResponsiveRadialTreeChart';
import { familyTreeData } from '@/components/visuals/data/tree-data';

const MyPage = () => (
  <div className="w-full h-[600px]">
    <ResponsiveRadialTreeChart data={familyTreeData} />
  </div>
);
```

### ResponsiveForceGraph

A dynamic, physics-based network graph with draggable nodes. Ideal for showing complex relationships.

**Data File:** `data/network-data.ts`

```tsx
import { ResponsiveForceGraph } from '@/components/visuals/ResponsiveForceGraph';
import { networkData } from '@/components/visuals/data/network-data';

const MyPage = () => (
  <div className="w-full h-[600px]">
    <ResponsiveForceGraph data={networkData} />
  </div>
);
```
