import RadialTree from '../../d3/RadialTree';
import BubbleChart from "../../d3/BubbleChart.tsx";
import PolarClock from "../../d3/PolarClock.tsx";
import {Content} from "../../../../../_metronic/layout/components/content";
import VoronoiStippling from "../../d3/VoronoiStippling.tsx";
import AnimatedTreemap from "../../d3/AnimatedTreemap.tsx";
import ForceDirectedGraph from "../../d3/ForceDirectedGraph.tsx";
import ForceDirectedGraph2 from "../../d3/ForceDirectedGraph2.tsx";
import PieChart from "../../d3/PieChart.tsx";
import TreeOfLife from "../../d3/TreeOfLife.tsx";
import ArcDiagram from "../../d3/ArcDiagram.tsx";
import ZoomableSunburst from "../../d3/ZoomableSunburst.tsx";

export function OverviewPage() {
    const data = {
        nodes: [
            { id: 'A', group: 1 },
            { id: 'B', group: 1 },
            { id: 'C', group: 1 },
            { id: 'D', group: 2 },
            { id: 'E', group: 2 },
            { id: 'F', group: 2 },
        ],
        links: [
            { source: 'A', target: 'B', value: 1 },
            { source: 'B', target: 'C', value: 1 },
            { source: 'C', target: 'A', value: 1 },
            { source: 'D', target: 'E', value: 2 },
            { source: 'E', target: 'F', value: 2 },
            { source: 'F', target: 'D', value: 2 },
            { source: 'A', target: 'D', value: 5 },
        ],
    };

  return (
    <Content>
        <PolarClock width={900} height={600} />
    </Content>
  );
}
