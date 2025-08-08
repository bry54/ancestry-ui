# Responsive Voronoi Stippling

This component renders a responsive "stippling" effect of an image using a Voronoi diagram. It redraws an input image using a specified number of dots, where the density of dots corresponds to the darkness of the image area.

This is a computationally intensive component. The stippling process is iterative and may cause a brief moment of high CPU usage when the component renders.

## How to Use

### 1. Prepare Your Image

The component requires a URL to an image. **Important:** The image must be served from the same domain as your application, or from a server with permissive CORS (Cross-Origin Resource Sharing) policies, as it needs to be read onto a `<canvas>` element. Local images in your `/public` directory are a perfect choice.

### 2. Use the Component

Import the component and provide the `imageUrl` and the number of points (`n`) as props.

```tsx
import { ResponsiveVoronoiStippling } from '@/components/visuals/ResponsiveVoronoiStippling/ResponsiveVoronoiStippling';

// An image from the public directory
const imageUrl = '/media/avatars/300-1.png';

const MyPage = () => (
  <div className="w-full h-[500px]">
    <ResponsiveVoronoiStippling imageUrl={imageUrl} n={8000} />
  </div>
);
```

### 3. Place in a Container

Wrap the component in a container `<div>`. The stippled image will be generated to fit inside this container while maintaining its original aspect ratio.

## Props

-   **`imageUrl`**: `string` (required)
    -   The URL of the image to process.
-   **`n`**: `number` (optional, default: `5000`)
    -   The number of points (stipples) to use for the drawing. More points create a more detailed image but increase the computation time.

## Performance Note

This component performs all calculations on the main UI thread. For very large images or a very high number of points (`n > 15000`), this could temporarily freeze the browser. For production use with demanding requirements, consider offloading the calculation to a Web Worker.
