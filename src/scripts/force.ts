import * as d3 from "d3";
import {
  forceCenter,
  forceLink,
  forceManyBody,
  SimulationLinkDatum,
  SimulationNodeDatum,
} from "d3";

const width = 800;
const height = 800;
const nodes = [
  { index: 0 },
  { index: 1 },
  { index: 2 },
  { index: 3 },
  { index: 4 },
  { index: 5 },
] satisfies SimulationNodeDatum[];
const links = [
  { source: 0, target: 1 },
  { source: 0, target: 2 },
  { source: 1, target: 3 },
  { source: 1, target: 3 },
  { source: 2, target: 1 },
  { source: 2, target: 3 },
  { source: 3, target: 4 },
  { source: 4, target: 5 },
  { source: 5, target: 3 },
] satisfies SimulationLinkDatum<SimulationNodeDatum>[];

const force = d3
  .forceSimulation(nodes) // NOTE: 実行時、nodesは加工されてデータ型が変わる
  .force("charge", forceManyBody().strength(-1000).distanceMax(300))
  .force("link", forceLink(links)) // NOTE: 実行時、linksは加工されてデータ型が変わる
  .force("center", forceCenter(width / 2, height / 2));
type NodeDatum = {
  index: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};
type LinkDatum = { index: number; source: NodeDatum; target: NodeDatum };

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);
const link = svg
  .append("g")
  .attr("stroke", "green")
  .selectAll("line")
  .data(links as unknown as LinkDatum[])
  .join("line");
const node = svg
  .append("g")
  .selectAll("circle")
  .data(nodes as unknown as NodeDatum[])
  .join("circle")
  .attr("r", 10);

force.on("tick", () => {
  link
    .attr("x1", (data) => data.source.x)
    .attr("y1", (data) => data.source.y)
    .attr("x2", (data) => data.target.x)
    .attr("y2", (data) => data.target.y);
  node.attr("cx", (data) => data.x).attr("cy", (data) => data.y);
});

// nodeのラベル周りの設定
// const label = svg.selectAll('text')
//     .data(nodes)
//     .enter()
//     .append('text')
//     .attr({
//         "text-anchor":"middle",
//         "fill":"white",
//         "font-size": "9px"
//     })
//     .text(function(data) { return data.label; });

// // labelも追随するように
// label.attr({
//     x: function(data) { return data.x;},
//     y: function(data) { return data.y;}
// });
