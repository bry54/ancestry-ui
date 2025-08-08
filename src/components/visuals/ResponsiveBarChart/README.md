# Responsive Bar Chart

This component renders a responsive, SVG-based bar chart using D3.js for calculations and React for rendering.

## How to Use

1.  **Import the component:**
    ```tsx
    import { ResponsiveBarChart } from '@/components/visuals/ResponsiveBarChart/ResponsiveBarChart';
    ```

2.  **Provide data:** The component requires a `data` prop, which is an array of objects. Each object must have a `name` (string) and a `value` (number).

    ```ts
    const myData = [
      { name: 'Category A', value: 95 },
      { name: 'Category B', value: 40 },
      { name: 'Category C', value: 72 },
    ];
    ```

3.  **Place in a container:** Wrap the component in a container `<div>`. The chart will automatically resize to fill this container. Use Tailwind CSS to control the container's size.

    ```tsx
    <div className="w-full h-96">
      <ResponsiveBarChart data={myData} />
    </div>
    ```

## Props

-   **`data`**: `DataPoint[]` (required)
    -   An array of data objects to render.
    -   `DataPoint` interface: `{ name: string; value: number; }`
