
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ForceDirectedGraph2Props {
  width?: number;
  height?: number;
}

const ForceDirectedGraph2: React.FC<ForceDirectedGraph2Props> = ({ width = 928, height = 600 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const dpi = window.devicePixelRatio || 1;
    canvas.width = width * dpi;
    canvas.height = height * dpi;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.scale(dpi, dpi);

    d3.json('https://gist.githubusercontent.com/abkunal/98d35b9b235312e90f3e43c9f7b6932b/raw/d5589ddd53731ae8eec7abd091320df91cdcf5cd/miserables.json').then((data: any) => {
      const links = data.links.map((d: any) => ({ ...d }));
      const nodes = data.nodes.map((d: any) => ({ ...d }));

      const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id((d: any) => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

      function ticked() {
        if (!context) return;
        context.clearRect(0, 0, width, height);

        context.save();
        context.globalAlpha = 0.6;
        context.strokeStyle = "#999";
        context.beginPath();
        links.forEach(drawLink);
        context.stroke();
        context.restore();

        context.save();
        context.strokeStyle = "#fff";
        nodes.forEach(drawNode);
        context.restore();
      }

      function drawLink(d: any) {
        context.moveTo(d.source.x, d.source.y);
        context.lineTo(d.target.x, d.target.y);
      }

      function drawNode(d: any) {
        const color = d3.scaleOrdinal(d3.schemeCategory10);
        context.beginPath();
        context.moveTo(d.x + 5, d.y);
        context.arc(d.x, d.y, 5, 0, 2 * Math.PI);
        context.fillStyle = color(d.group);
        context.fill();
        context.stroke();
      }

      d3.select(canvas)
        .call(d3.drag<any, any>()
          .subject((event) => {
            const [px, py] = d3.pointer(event, canvas);
            let subject = d3.least(nodes, ({ x, y }) => {
              const dist2 = (x - px) ** 2 + (y - py) ** 2;
              if (dist2 < 400) return dist2;
            });
            return subject;
          })
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return () => {
        simulation.stop();
      };
    });

  }, [width, height]);

  return (
    <canvas ref={canvasRef}></canvas>
  );
};

export default ForceDirectedGraph2;
