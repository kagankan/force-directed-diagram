<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import * as d3 from "d3";
import {
  forceCenter,
  forceLink,
  forceManyBody,
  SimulationLinkDatum,
  SimulationNodeDatum,
} from "d3";

const graphData = ref([]); // グラフデータを ref で保持
const width = ref<number>(0); // svg の幅
const height = ref<number>(0); // svg の高さ
const svgRef = ref<HTMLElement>(); // ref="svg" への参照

// プロジェクト名を props で保持
const props = defineProps<{
  project?: string;
}>();

const nodes = [
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},

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
  { source: 0, target: 1 },
  { source: 1, target: 2 },
  { source: 2, target: 3 },
  { source: 3, target: 4 },
  { source: 4, target: 5 },
  { source: 5, target: 0 },
  { source: 8, target: 6, distance: 0.8 },
  // { source: 8, target: 7, distance: 0.8 },
  // { source: 16, target: 7, distance: 0.8 },
  { source: 16, target: 9, distance: 0.8 },
  { source: 0, target: 8 },
  { source: 1, target: 8 },
  { source: 2, target: 8 },
  { source: 3, target: 8 },
  { source: 4, target: 8 },
  { source: 5, target: 8 },
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
] satisfies (SimulationLinkDatum<SimulationNodeDatum> & {
  distance?: number;
})[];

console.log(links);
type NodeDatum = {
  index: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};
type LinkDatum = { index: number; source: NodeDatum; target: NodeDatum };

const render = () => {
  const force = d3
    .forceSimulation(nodes) // NOTE: 実行時、nodesは加工されてデータ型が変わる
    .force("charge", forceManyBody().strength(-2000).distanceMax(300))
    .force(
      "link",
      forceLink(links).strength((data) => data.distance || 0.2)
    ) // NOTE: 実行時、linksは加工されてデータ型が変わる
    .force("center", forceCenter(width.value / 2, height.value / 2));
  const svgSelection = d3
    .select("svg")
    .attr("width", width.value)
    .attr("height", height.value);
  const link = svgSelection
    .append("g")
    .selectAll("line")
    .data(links as unknown as LinkDatum[])
    .join("line")
    .attr("stroke", "green");
  // .attr("stroke", (data)=>data.index < 6 ? "green" : "")
  const node = svgSelection
    .append("g")
    .selectAll("circle")
    .data(nodes as unknown as NodeDatum[])
    .join("circle")
    .attr("r", 10);
  const label = svgSelection
    .selectAll("text")
    .data(nodes as unknown as NodeDatum[])
    .join("text")
    .attr("fill", "red")
    .attr("text-anchor", "middle")
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
};

// ページと著者のノードを computed で作成
// const nodes = computed(() => {
//   let nodes = graphData.value.pages.map((page) => ({
//     id: page.id,
//     title: page.title,
//     x: width.value * Math.random(),
//     y: height.value * Math.random(),
//     rx: byteLength(page.title) * 2,
//     ry: 10,
//     user: false,
//   }));
//   return nodes;
// });

// エッジ(リンク)を computed で作成
// const edges = computed(() => {
//   const ids = new Set(nodes.value.map((node) => node.id));
//   const idm = new Map();
//   nodes.value.forEach((node, index) => (idm[node.id] = index));
//   let edges = graphData.value.links
//     .filter((edge) => ids.has(edge.from) && ids.has(edge.to))
//     .map((edge) => ({
//       source: idm[edge.from],
//       target: idm[edge.to],
//       l: Math.random() * 150,
//     }));
//   return edges;
// });

// onMounted で svg サイズを取得、データフェッチ、レンダリング
onMounted(() => {
  if (svgRef.value) {
    width.value = svgRef.value.clientWidth;
    height.value = svgRef.value.clientHeight;
  }
  // await fetchData();
  render();
});

// プロジェクトの変更を検知して、データフェッチ、レンダリング
// watch(
//   () => props.project,
//   async () => {
//     await fetchData();
//     await render();
//   }
// );

// const fetchData = async () => {
//   const res = await fetch(/* data url */);
//   graphData.value = await res.json();
// };

// const render = async () => {
//   // Zoom 関連の設定
//   const zoom = d3
//     .zoom()
//     .scaleExtent([1 / 3, 40])
//     .on("zoom", (e, d) => {
//       link.attr("transform", e.transform);
//       nodeGroup.attr("transform", e.transform);
//     });

//   d3.select("svg")
//     .attr("viewBox", "0 0 1200 1400")
//     .attr("preserveAspectRatio", "xMidYMid meet")
//     .call(zoom);

//   // 最初にリンクをレンダリング
//   const link = d3
//     .select("svg")
//     .selectAll("line")
//     .data(edges.value)
//     .enter()
//     .append("line")
//     .attr("stroke-width", 1)
//     .attr("stroke", "LightGray");

//   // ノードの楕円(Ellipse)とテキストをグループとして扱うためのノードグループ
//   const nodeGroup = d3
//     .select("svg")
//     .selectAll("g")
//     .data(nodes.value)
//     .enter()
//     .append("g")
//     // ドラッグ＆ドロップの実装
//     .call(
//       d3
//         .drag()
//         .on("start", (e, d) => {
//           if (!e.active) simulation.alphaTarget(0.3).restart();
//           d.fx = d.x;
//           d.fy = d.y;
//         })
//         .on("drag", (e, d) => {
//           d.fx = e.x;
//           d.fy = e.y;
//         })
//         .on("end", (e, d) => {
//           if (!e.active) simulation.alphaTarget(0);
//           d.fx = null;
//           d.fy = null;
//         })
//     )
//     // ノードクリック時にページを開く
//     .on("click", (e, d) => {
//       if (d.user) return;
//       const page = encodeURIComponent(d.title);
//       const url = `/* ページの URL を組み立て*/`;
//       window.open(url);
//     });

//   // ノードグループに楕円を追加(リンクよりZ軸が手前に)
//   nodeGroup
//     .append("ellipse")
//     .attr("cx", (d) => d.x)
//     .attr("cy", (d) => d.y)
//     .attr("rx", (d) => d.rx)
//     .attr("ry", (d) => d.ry)
//     .attr("fill", (d) => (d.user ? "Cyan" : "Gold"));

//   // ノードグループにテキストを追加(楕円よりZ軸が手前に)
//   nodeGroup
//     .append("text")
//     .attr("x", (d) => d.x)
//     .attr("y", (d) => d.y)
//     .attr("text-anchor", "middle")
//     .attr("dominant-baseline", "middle")
//     .style("fill", "steelbule")
//     .style("font-size", "11px")
//     .text((d) => d.title);

// 以下 force simulation の設定が続く
// };
</script>

<template>
  <p>{{ width }}</p>
  <p>{{ height }}</p>
  <svg ref="svgRef"></svg>
</template>

<style scoped>
svg {
  position: fixed;
  top: 50px;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>
