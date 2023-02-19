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
  {}, // group1
  {}, // group2
  {}, // item1
  {},
  {},
  {},

  {},
  {},
  
  {}, // 8

  {},

  {},

  {},
  {},
  {},
  {},
  {},
  {},
] satisfies SimulationNodeDatum[];
const links = [
  // わっか
  { source: 0, target: 1 },
  { source: 1, target: 2 },
  { source: 2, target: 3 },
  { source: 3, target: 4 },
  { source: 4, target: 5 },
  { source: 5, target: 0 },
// 所属
  { source: 8, target: 6 , distance: 0.8},
  { source: 8, target: 7 , distance: 0.8},
  { source: 16, target: 7 , distance: 0.8},
  { source: 16, target: 9 , distance: 0.8},
  // 壁とくっつける
  { source: 0, target: 8 },
  { source: 1, target: 8 },
  { source: 2, target: 8 },
  { source: 3, target: 8 },
  { source: 4, target: 8 },
  { source: 5, target: 8 },
  // kabe 2
  { source: 10, target: 11 },
  { source: 11, target: 12 },
  { source: 12, target: 13 },
  { source: 13, target: 14 },
  { source: 14, target: 15 },
  { source: 15, target: 10 },
  { source: 10, target: 16 },
  { source: 11, target: 16 },
  { source: 12, target: 16 },
  { source: 13, target: 16 },
  { source: 14, target: 16 },
  { source: 15, target: 16 },
  // TODO: 他の壁とは影響を与えないようにしなくてはいけない
] satisfies (SimulationLinkDatum<SimulationNodeDatum> & {distance?: number})[];

const force = d3
  .forceSimulation(nodes) // NOTE: 実行時、nodesは加工されてデータ型が変わる
  .force("charge", forceManyBody().strength(-2000).distanceMax(300))
  .force("link", forceLink(links).strength(data=> data.distance || 0.2)) // NOTE: 実行時、linksは加工されてデータ型が変わる
  .force("center", forceCenter(width / 2, height / 2));
  console.log(links)
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
  .selectAll("line")
  .data(links as unknown as LinkDatum[])
  .join("line")
  .attr("stroke", "green")
  // .attr("stroke", (data)=>data.index < 6 ? "green" : "")
const node = svg
  .append("g")
  .selectAll("circle")
  .data(nodes as unknown as NodeDatum[])
  .join("circle")
  .attr("r", 10);
const label = svg.selectAll('text')
    .data(nodes  as unknown as NodeDatum[])
    .join('text')
    .attr("fill", "red")
    .attr("text-anchor","middle")
    .text((data) => data.index);
force.on("tick", () => {
  link
    .attr("x1", (data) => data.source.x)
    .attr("y1", (data) => data.source.y)
    .attr("x2", (data) => data.target.x)
    .attr("y2", (data) => data.target.y);
  node.attr("cx", (data) => data.x).attr("cy", (data) => data.y);
  label.attr("x", (data) => data.x).attr("y", (data) => data.y);
});
