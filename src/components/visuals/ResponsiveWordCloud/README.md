# Responsive Word Cloud

This component renders a responsive, SVG-based word cloud using the `d3-cloud` library. The size of each word is determined by its frequency or value in the dataset.

## How to Use

### 1. Installation

This component requires the `d3-cloud` library, which is not part of the core D3 bundle. If you haven't already, install it:

```bash
npm install d3-cloud @types/d3-cloud
```

### 2. Prepare Your Data

The component requires a `data` prop, which is an array of objects. Each object must have a `text` (string) and a `value` (number).

```tsx
import { ResponsiveWordCloud } from '@/components/visuals/ResponsiveWordCloud/ResponsiveWordCloud';
import { wordCloudData } from '@/components/visuals/ResponsiveWordCloud/data';

const MyPage = () => (
  <div className="w-full h-[500px]">
    <ResponsiveWordCloud data={wordCloudData} />
  </div>
);
```

### 3. Place in a Container

Wrap the component in a container `<div>`. The word cloud will be generated to fit within the dimensions of this container.

## Props

-   **`data`**: `WordData[]` (required)
    -   An array of data objects to render as words.
    -   `WordData` interface: `{ text: string; value: number; }`
