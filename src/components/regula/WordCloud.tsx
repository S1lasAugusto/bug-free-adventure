import React, { useEffect, useRef } from "react";
// Corrigir importação do d3-cloud
import cloud from "d3-cloud";
import * as d3 from "d3";
import { Cloud } from "lucide-react";

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

export function WordCloud({
  words = [],
}: {
  words?: { text: string; value: number }[];
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();
    if (!words || words.length === 0) return;
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
  }, [words]);

  if (!words || words.length === 0) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center">
        <Cloud className="mb-2 h-8 w-8 text-gray-400" />
        <h3 className="mb-1 text-sm font-medium text-gray-900">No data yet</h3>
        <p className="text-sm text-gray-500">
          Create reflections to generate your word cloud
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[200px] w-full items-center justify-center">
      <svg ref={svgRef} style={{ display: "block", margin: "0 auto" }} />
    </div>
  );
}

export default WordCloud;
