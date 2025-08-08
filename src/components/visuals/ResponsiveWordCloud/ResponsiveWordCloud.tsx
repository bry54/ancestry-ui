import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { useContainerSize } from '@/hooks/use-container-size';
import type { WordData } from './data';

// --- COMPONENT PROPS ---
interface ResponsiveWordCloudProps {
  data: WordData[];
}

export const ResponsiveWordCloud: React.FC<ResponsiveWordCloudProps> = ({
  data,
}) => {
  const { ref, width, height } = useContainerSize();
  const [words, setWords] = useState<cloud.Word[]>([]);

  useEffect(() => {
    if (!data || width === 0 || height === 0) return;

    const maxVal = d3.max(data, (d) => d.value) || 1;
    const fontSizeScale = d3.scaleSqrt().domain([0, maxVal]).range([10, 60]);

    const layout = cloud()
      .size([width, height])
      .words(data.map((d) => ({ text: d.text, size: fontSizeScale(d.value) })))
      .padding(5)
      .rotate(() => (~~(Math.random() * 6) - 3) * 30) // Random rotation
      .font('Impact') // A classic word cloud font
      .fontSize((d) => d.size || 10)
      .on('end', (calculatedWords) => {
        setWords(calculatedWords);
      });

    layout.start();
  }, [data, width, height]);

  return (
    <div ref={ref} className="w-full h-full">
      <svg width={width} height={height}>
        <g transform={`translate(${width / 2},${height / 2})`}>
          {words.map((word, i) => (
            <text
              key={i}
              textAnchor="middle"
              transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
              style={{ fontSize: word.size, fontFamily: 'Impact' }}
              //fill="steelblue"
            >
              {word.text}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
};
