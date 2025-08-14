import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useContainerSize } from '@/hooks/use-container-size';

// --- COMPONENT PROPS ---
interface ResponsiveVoronoiStipplingProps {
  imageUrl: string;
  n: number; // Number of stipple points
}

export const ResponsiveVoronoiStippling: React.FC<ResponsiveVoronoiStipplingProps> = ({ imageUrl, n = 5000 }) => {
  const { ref: containerRef, width, height } = useContainerSize();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!imageUrl || width === 0 || height === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const image = new Image();
    image.crossOrigin = "anonymous"; // Handle CORS if image is from another domain
    image.src = imageUrl;

    image.onload = () => {
      // Scale image to fit container while maintaining aspect ratio
      const imgRatio = image.width / image.height;
      const canvasRatio = width / height;
      let drawWidth = width;
      let drawHeight = height;
      if (canvasRatio > imgRatio) {
        drawWidth = height * imgRatio;
      } else {
        drawHeight = width / imgRatio;
      }
      const xOffset = (width - drawWidth) / 2;
      const yOffset = (height - drawHeight) / 2;

      // Draw the image on a hidden canvas to get pixel data
      const hiddenCanvas = document.createElement('canvas');
      hiddenCanvas.width = width;
      hiddenCanvas.height = height;
      const hiddenContext = hiddenCanvas.getContext('2d', { willReadFrequently: true });
      if (!hiddenContext) return;
      hiddenContext.drawImage(image, xOffset, yOffset, drawWidth, drawHeight);
      const imageData = hiddenContext.getImageData(0, 0, width, height);
      const data = new Float64Array(width * height);

      // Create a density map from image brightness
      for (let i = 0, len = imageData.data.length; i < len; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        // Use luminance formula to get brightness
        data[i / 4] = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      }

      // Generate initial random points based on density
      const points = new Float64Array(n * 2);
      for (let i = 0; i < n; ++i) {
        while (true) {
          const x = Math.floor(Math.random() * width);
          const y = Math.floor(Math.random() * height);
          if (Math.random() < data[y * width + x]) {
            points[i * 2] = x;
            points[i * 2 + 1] = y;
            break;
          }
        }
      }

      // Iteratively improve point positions
      const delaunay = new d3.Delaunay(points);
      const voronoi = delaunay.voronoi([0, 0, width, height]);

      for (let k = 0; k < 80; ++k) { // 80 iterations for refinement
        for (let i = 0; i < n; ++i) {
          const cell = voronoi.cellPolygon(i);
          if (!cell) continue;
          
          const [cx, cy] = d3.polygonCentroid(cell);
          const angle = Math.atan2(cy - points[i * 2 + 1], cx - points[i * 2]);
          const dist = Math.hypot(cx - points[i * 2], cy - points[i * 2 + 1]);
          
          // Move point towards centroid
          points[i * 2] += Math.cos(angle) * dist * 0.1;
          points[i * 2 + 1] += Math.sin(angle) * dist * 0.1;
        }
        voronoi.update();
      }

      // Draw the final points
      context.clearRect(0, 0, width, height);
      context.fillStyle = 'black';
      for (let i = 0; i < n; ++i) {
        context.beginPath();
        context.arc(points[i * 2], points[i * 2 + 1], 0.5, 0, 2 * Math.PI);
        context.fill();
      }
    };

    image.onerror = () => {
      console.error("Failed to load image for stippling.");
    };

  }, [imageUrl, n, width, height]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};
