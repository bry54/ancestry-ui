
import React, {useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

export interface WordData {
  text: string;
  size: number;
}

interface WordCloudProps {
  width?: number;
  height?: number;
  data: WordData[];
}

const WordCloud: React.FC<WordCloudProps> = ({ data, width = 640, height = 480 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  //const [words, setWords] = useState(data);

  const words: WordData[] = data? data : [
    { text: 'Jesus', size: 10 },
    { text: 'John', size: 9 },
    { text: 'Mary', size: 8 },
    { text: 'Joseph', size: 7 },
    { text: 'Peter', size: 6 },
    { text: 'Paul', size: 5 },
    { text: 'Lazarus', size: 4 },
    { text: 'Martha', size: 3 },
    { text: 'Magdalene', size: 2 },
    { text: 'Abraham', size: 10 },
    { text: 'Isaac', size: 9 },
    { text: 'Jacob', size: 8 },
    { text: 'Moses', size: 7 },
    { text: 'David', size: 6 },
    { text: 'Solomon', size: 5 },
    { text: 'Isaiah', size: 4 },
    { text: 'Jeremiah', size: 3 },
    { text: 'Ezekiel', size: 2 },
    { text: 'Daniel', size: 10 },
    { text: 'Hosea', size: 9 },
    { text: 'Joel', size: 8 },
    { text: 'Amos', size: 7 },
    { text: 'Obadiah', size: 6 },
    { text: 'Jonah', size: 5 },
    { text: 'Micah', size: 4 },
    { text: 'Nahum', size: 3 },
    { text: 'Habakkuk', size: 2 },
    { text: 'Zephaniah', size: 10 },
    { text: 'Haggai', size: 9 },
    { text: 'Zechariah', size: 8 },
    { text: 'Malachi', size: 7 },
  ];

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

      // eslint-disable-next-line no-inner-declarations
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
