import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useContainerSize } from '@/hooks/use-container-size';
import type { PatentData, PatentNode, PatentLink } from './data';

// --- COMPONENT PROPS ---
interface ResponsivePatentSuitsProps {
  data: PatentData;
}

export const ResponsivePatentSuits: React.FC<ResponsivePatentSuitsProps> = ({ data }) => {
  const { ref, width, height } = useContainerSize();
  const [layoutData, setLayoutData] = useState<{ nodes: any[], links: any[] } | null>(null);

  useEffect(() => {
    if (!data || width === 0 || height === 0) return;

    const simulation = d3.forceSimulation(data.nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(data.links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .stop(); // Stop the simulation immediately

    // Run the simulation manually for a fixed number of ticks to get a stable layout
    simulation.tick(300);

    setLayoutData({
      nodes: simulation.nodes(),
      links: simulation.force('link').links(),
    });

  }, [data, width, height]);

  if (!layoutData) {
    return <div ref={ref} className="w-full h-full" />;
  }

  return (
    <div ref={ref} className="w-full h-full">
      <svg width={width} height={height}>
        {/* Render Links (Arcs) */}
        <g stroke="#999" strokeOpacity={0.6}>
          {layoutData.links.map((link, i) => (
            <path
              key={i}
              fill="none"
              strokeWidth={Math.sqrt(link.value)}
              d={`M${link.source.x},${link.source.y} L${link.target.x},${link.target.y}`}
            />
          ))}
        </g>

        {/* Render Nodes (Logos) */}
        <g>
          {layoutData.nodes.map((node, i) => (
            <image
              key={i}
              href={node.logo}
              x={node.x - 16} // Center the image
              y={node.y - 16} // Center the image
              width={32}
              height={32}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
