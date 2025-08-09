import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { useContainerSize } from '@/hooks/use-container-size';
import type { TreeNode as HierarchyData } from '../data/tree-data';

// --- COMPONENT PROPS ---
interface ResponsiveZoomableSunburstProps {
  data: HierarchyData;
}

export const ResponsiveZoomableSunburst: React.FC<
  ResponsiveZoomableSunburstProps
> = ({ data }) => {
  // 1. Measure the container
  const { ref, width, height } = useContainerSize();

  // 2. Set up state to track the currently focused arc (for zooming)
  const [focusedArc, setFocusedArc] =
    useState<d3.HierarchyRectangularNode<HierarchyData> | null>(null);

  // 3. Memoize D3 calculations
  const { root, colorScale, arcGenerator } = useMemo(() => {
    // Create a D3 hierarchy and add values to each node.
    // The value is used to determine the size of the arc.
    const root = d3
      .hierarchy(data)
      .sum((d) => (d.children ? 0 : 1)) // Size arcs by number of leaf nodes
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // Set the initial focused arc to be the root
    if (!focusedArc) {
      setFocusedArc(
        d3.partition<HierarchyData>().size([2 * Math.PI, root.height + 1])(
          root,
        ),
      );
    }

    const colorScale = d3.scaleOrdinal(
      d3.quantize(d3.interpolateRainbow, (root.children?.length || 0) + 1),
    );
    const arcGenerator = d3
      .arc<d3.HierarchyRectangularNode<HierarchyData>>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(Math.min(width, height) / 2)
      .innerRadius(
        (d) => d.y0 * (Math.min(width, height) / 2 / (root.height + 1)),
      )
      .outerRadius((d) =>
        Math.max(
          d.y0 * (Math.min(width, height) / 2 / (root.height + 1)),
          d.y1 * (Math.min(width, height) / 2 / (root.height + 1)) - 1,
        ),
      );

    return { root, colorScale, arcGenerator };
  }, [data, width, height]); // focusedArc is intentionally omitted to prevent re-calculation on zoom

  const handleArcClick = (p: d3.HierarchyRectangularNode<HierarchyData>) => {
    setFocusedArc(p);
  };

  // If we don't have the data or dimensions yet, don't render
  if (!focusedArc) {
    return <div ref={ref} className="w-full h-full" />;
  }

  return (
    <div ref={ref} className="w-full h-full">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ cursor: 'pointer' }}
      >
        <g transform={`translate(${width / 2},${height / 2})`}>
          {d3
            .partition<HierarchyData>()
            .size([2 * Math.PI, root.height + 1])(root)
            .descendants()
            .map((p, i) => (
              <path
                key={`${p.data.name}-${i}`}
                fill={colorScale((p.children ? p : p.parent || p).data.name)}
                fillOpacity={p.children ? 0.6 : 0.4}
                d={arcGenerator(p) || ''}
                onClick={() => handleArcClick(p)}
              >
                <title>
                  {p
                    .ancestors()
                    .map((d) => d.data.name)
                    .reverse()
                    .join(' / ')}
                </title>
              </path>
            ))}
          <circle
            r={Math.min(width, height) / 2 / (root.height + 1)}
            fill="none"
            pointerEvents="all"
            onClick={() =>
              handleArcClick(
                d3
                  .partition<HierarchyData>()
                  .size([2 * Math.PI, root.height + 1])(root),
              )
            }
          />
        </g>
      </svg>
    </div>
  );
};
