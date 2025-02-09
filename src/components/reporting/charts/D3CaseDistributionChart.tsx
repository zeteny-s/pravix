import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface CaseDistributionChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  height?: number;
}

export function D3CaseDistributionChart({ data, height = 300 }: CaseDistributionChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3.pie<any>()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(radius * 0.6) // Create a donut chart
      .outerRadius(radius);

    const arcs = svg.selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    // Add the paths (slices)
    arcs.append("path")
      .attr("d", arc as any)
      .attr("fill", d => d.data.color)
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.8)
      .transition()
      .duration(750)
      .attrTween("d", function(d: any) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(interpolate(t)) as string;
        };
      });

    // Add labels
    arcs.append("text")
      .attr("transform", function(d: any) {
        const pos = arc.centroid(d);
        return `translate(${pos[0]},${pos[1]})`;
      })
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("class", "text-sm font-medium")
      .text(d => `${d.data.name}: ${d.data.value}`);

    // Add total in center
    const total = data.reduce((sum, d) => sum + d.value, 0);
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.5em")
      .attr("class", "text-lg font-semibold")
      .text("Total");
    
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1em")
      .attr("class", "text-2xl font-bold")
      .text(total);

  }, [data, height]);

  return <svg ref={svgRef} className="w-full h-full" />;
}
