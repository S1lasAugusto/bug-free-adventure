import React, { useEffect, useRef } from "react";
// Corrigir importação do d3-cloud
// @ts-ignore
import cloud = require("d3-cloud");
import * as d3 from "d3";

const words = [
  { text: "Java", value: 50 },
  { text: "OOP", value: 30 },
  { text: "Inheritance", value: 20 },
  { text: "Collections", value: 25 },
  { text: "Polymorphism", value: 15 },
  { text: "Abstraction", value: 10 },
  { text: "Encapsulation", value: 10 },
  { text: "Interfaces", value: 12 },
  { text: "Exceptions", value: 8 },
];

const width = 500;
const height = 300;

type WordDatum = {
  text: string;
  value: number;
  size: number;
  x: number;
  y: number;
  rotate: number;
};

export function WordCloud() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Limpa o SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Cria o layout da nuvem
    cloud()
      .size([width, height])
      .words(words.map((d) => ({ ...d, size: 10 + d.value })))
      .padding(5)
      .rotate(() => (Math.random() > 0.5 ? 0 : -30))
      .font("sans-serif")
      .fontSize((d: any) => (typeof d.size === "number" ? d.size : 10))
      .on("end", (cloudWords: WordDatum[]) => {
        const svg = d3
          .select(svgRef.current)
          .attr("width", "100%")
          .attr("height", height)
          .attr("viewBox", `0 0 ${width} ${height}`)
          .attr("preserveAspectRatio", "xMidYMid meet")
          .append("g")
          .attr("transform", `translate(${width / 2},${height / 2})`);

        svg
          .selectAll("text")
          .data(cloudWords)
          .enter()
          .append("text")
          .style("font-size", (d: WordDatum) => `${d.size}px`)
          .style("font-family", "sans-serif")
          .attr(
            "fill",
            (_: WordDatum, i: number) => d3.schemeCategory10[i % 10] || "#000"
          )
          .attr("text-anchor", "middle")
          .attr(
            "transform",
            (d: WordDatum) => `translate(${d.x},${d.y})rotate(${d.rotate})`
          )
          .text((d: WordDatum) => d.text);
      })
      .start();
  }, []);

  return (
    <div
      className="flex w-full items-center justify-center rounded-lg bg-gray-50"
      style={{ height }}
    >
      <svg
        ref={svgRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      ></svg>
    </div>
  );
}

export default WordCloud;
