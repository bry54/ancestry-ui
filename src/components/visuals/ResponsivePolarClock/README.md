# Responsive Polar Clock

This component renders a responsive, live-updating polar clock using D3.js. It visualizes the current time as a series of concentric arcs.

## How to Use

This component is self-contained and does not require any props. It gets the current time internally and updates every second.

1.  **Import the component:**
    ```tsx
    import { ResponsivePolarClock } from '@/components/visuals/ResponsivePolarClock/ResponsivePolarClock';
    ```

2.  **Place in a container:** Wrap the component in a container `<div>`. The clock will automatically resize to fit the container. For best results, use a container that is roughly square (`aspect-square`).

    ```tsx
    <div className="w-full h-[500px] aspect-square">
      <ResponsivePolarClock />
    </div>
    ```

## Visualization Details

The clock displays time in 6 concentric rings, from innermost to outermost:

1.  **Seconds** (out of 60)
2.  **Minutes** (out of 60)
3.  **Hours** (out of 24)
4.  **Day of the Week** (out of 7, where Sunday is 0)
5.  **Day of the Month** (out of 31)
6.  **Month of the Year** (out of 12)

Each ring fills up clockwise as the corresponding time unit progresses.
