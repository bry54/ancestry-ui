
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

export interface WordData {
  text: string;
  size: number;
}

interface WordCloudProps {
  width?: number;
  height?: number;
  words: WordData[];
}

const WordCloud: React.FC<WordCloudProps> = ({ words ,width = 900, height = 600 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove(); // Clear previous renders

      const layout = cloud()
        .size([width, height])
        .words(words.map(d => ({ ...d, size: d.size * 10 })))
        .padding(5)
        .rotate(() => ~~(Math.random() * 2) * 90)
        .font("Impact")
        .fontSize(d => d.size)
        .on("end", draw);

      layout.start();

      function draw(words) {
        svg.append("g")
            .attr("transform", `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", d => `${d.size}px`)
            .style("font-family", "Impact")
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
            .text(d => d.text);
      }
    }
  }, [words, width, height]);

  return (
    <svg ref={svgRef} width={width} height={height}></svg>
  );
};

export default WordCloud;
