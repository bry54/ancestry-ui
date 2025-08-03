import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export interface TreeNode {
    name: string;
    children?: TreeNode[];
}

interface CollapsibleTreeProps {
    data: TreeNode;
}

const CollapsibleTree: React.FC<CollapsibleTreeProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!data || !svgRef.current) return;

        const width = 1200;
        const marginTop = 10;
        const marginRight = 10;
        const marginBottom = 10;
        const marginLeft = 100;

        const root = d3.hierarchy(data);
        const dx = 20;
        const dy = (width - marginRight - marginLeft) / (1 + root.height);

        const tree = d3.tree().nodeSize([dx, dy]);
        const diagonal = d3
            .linkHorizontal()
            .x((d: never) => d.y)
            .y((d: never) => d.x);

        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", dx)
            .attr("viewBox", [-marginLeft, -marginTop, width, dx])
            .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

        const gLink = svg
            .append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5);

        const gNode = svg
            .append("g")
            .attr("cursor", "pointer")
            .attr("pointer-events", "all");

        function update(source) {
            const duration = 250;
            const nodes = root.descendants().reverse();
            const links = root.links();

            // Compute the new tree layout.
            tree(root);

            let left = root;
            let right = root;
            root.eachBefore((node) => {
                if (node.x < left.x) left = node;
                if (node.x > right.x) right = node;
            });

            const height = right.x - left.x + marginTop + marginBottom;

            const transition = svg
                .transition()
                .duration(duration)
                .attr("height", height)
                .attr("viewBox", [-marginLeft, left.x - marginTop, width, height])
                .tween(
                    "resize",
                    window.ResizeObserver ? null : () => () => svg.dispatch("toggle"),
                );

            // Update the nodes…
            const node = gNode.selectAll("g").data(nodes, (d: never) => d.id);

            // Enter any new nodes at the parent's previous position.
            const nodeEnter = node
                .enter()
                .append("g")
                .attr("transform", `translate(${source.y0},${source.x0})`)
                .attr("fill-opacity", 0)
                .attr("stroke-opacity", 0)
                .on("click", (event, d) => {
                    d.children = d.children ? null : d._children;
                    update(d);
                });

            nodeEnter
                .append("circle")
                .attr("r", 2.5)
                .attr("fill", (d: never) => (d._children ? "#555" : "#999"))
                .attr("stroke-width", 10);

            nodeEnter
                .append("text")
                .attr("dy", "0.31em")
                .attr("x", (d: never) => (d._children ? -6 : 6))
                .attr("text-anchor", (d: never) => (d._children ? "end" : "start"))
                .text((d: never) => d.data.name)
                .clone(true)
                .lower()
                .attr("stroke-linejoin", "round")
                .attr("stroke-width", 3)
                .attr("stroke", "white");

            // Transition nodes to their new position.
            node
                .merge(nodeEnter)
                .transition(transition)
                .attr("transform", (d: never) => `translate(${d.y},${d.x})`)
                .attr("fill-opacity", 1)
                .attr("stroke-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            node
                .exit()
                .transition(transition)
                .remove()
                .attr("transform", `translate(${source.y},${source.x})`)
                .attr("fill-opacity", 0)
                .attr("stroke-opacity", 0);

            // Update the links…
            const link = gLink.selectAll("path").data(links, (d: never) => d.target.id);

            // Enter any new links at the parent's previous position.
            const linkEnter = link
                .enter()
                .append("path")
                .attr("d", () => {
                    const o = { x: source.x0, y: source.y0 };
                    return diagonal({ source: o, target: o });
                });

            // Transition links to their new position.
            link.merge(linkEnter).transition(transition).attr("d", diagonal);

            // Transition exiting nodes to the parent's new position.
            link
                .exit()
                .transition(transition)
                .remove()
                .attr("d", () => {
                    const o = { x: source.x, y: source.y };
                    return diagonal({ source: o, target: o });
                });

            // Stash the old positions for transition.
            root.eachBefore((d: never) => {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

        root.x0 = dx / 2;
        root.y0 = 0;
        root.descendants().forEach((d: any, i) => {
            d.id = i;
            d._children = d.children;
            if (d.depth && d.data.name.length !== 7) d.children = null;
        });

        update(root);
    }, [data]);

    return <svg ref={svgRef}></svg>;
};

export default CollapsibleTree;
