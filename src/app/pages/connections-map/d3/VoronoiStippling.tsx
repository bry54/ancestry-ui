
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface VoronoiStipplingProps {
  width?: number;
  height?: number;
}

const VoronoiStippling: React.FC<VoronoiStipplingProps> = ({ width = 640, height = 480 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/176331/mona-lisa.jpg';

    image.onload = () => {
      const imageWidth = image.width;
      const imageHeight = image.height;
      const aspectRatio = imageWidth / imageHeight;
      const newHeight = width / aspectRatio;

      canvas.width = width;
      canvas.height = newHeight;

      context.drawImage(image, 0, 0, width, newHeight);
      const imageData = context.getImageData(0, 0, width, newHeight);
      const { data: rgba } = imageData;
      const data = new Float64Array(width * newHeight);
      for (let i = 0, n = rgba.length / 4; i < n; ++i) {
        data[i] = Math.max(0, 1 - rgba[i * 4] / 254);
      }

      const workerScript = `
        importScripts('https://cdn.jsdelivr.net/npm/d3-delaunay@6');

        self.onmessage = event => {
          const { data, width, height, n } = event.data;
          const points = new Float64Array(n * 2);
          const c = new Float64Array(n * 2);
          const s = new Float64Array(n);

          for (let i = 0; i < n; ++i) {
            points[i * 2] = Math.random() * width;
            points[i * 2 + 1] = Math.random() * height;
          }

          const delaunay = new d3.Delaunay(points);
          const voronoi = delaunay.voronoi([0, 0, width, height]);

          for (let k = 0; k < 80; ++k) {
            c.fill(0);
            s.fill(0);

            for (let y = 0, i = 0; y < height; ++y) {
              for (let x = 0; x < width; ++x, ++i) {
                const w = data[i];
                if (w > 0) {
                  const j = delaunay.find(x, y);
                  s[j] += w;
                  c[j * 2] += w * x;
                  c[j * 2 + 1] += w * y;
                }
              }
            }

            for (let j = 0; j < n; ++j) {
              const sj = s[j];
              if (sj > 0) {
                points[j * 2] = c[j * 2] / sj;
                points[j * 2 + 1] = c[j * 2 + 1] / sj;
              }
            }

            voronoi.update();
            postMessage(points);
          }
          self.close();
        };
      `;

      const blob = new Blob([workerScript], { type: 'application/javascript' });
      const worker = new Worker(URL.createObjectURL(blob));

      worker.onmessage = ({ data: points }) => {
        context.fillStyle = "#fff";
        context.fillRect(0, 0, width, newHeight);
        context.beginPath();
        for (let i = 0, n = points.length; i < n; i += 2) {
          const x = points[i], y = points[i + 1];
          context.moveTo(x + 1.5, y);
          context.arc(x, y, 1.5, 0, 2 * Math.PI);
        }
        context.fillStyle = "#000";
        context.fill();
      };

      worker.postMessage({ data, width, height: newHeight, n: Math.round(width * newHeight / 40) });

      return () => {
        worker.terminate();
      };
    };

  }, [width, height]);

  return (
    <canvas ref={canvasRef}></canvas>
  );
};

export default VoronoiStippling;
