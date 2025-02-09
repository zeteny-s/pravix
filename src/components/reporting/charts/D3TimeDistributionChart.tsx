import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TimeDistributionChartProps {
  data: {
    name: string;
    hours: number;
    color: string;
  }[];
  height?: number;
}

export function D3TimeDistributionChart({ data, height = 300 }: TimeDistributionChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.3)
      .domain(data.map(d => d.name));

    const y = d3.scaleLinear()
      .range([chartHeight, 0])
      .domain([0, d3.max(data, d => d.hours) || 0]);

    // Add X axis
    svg.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("class", "text-sm")
      .style("text-anchor", "middle");

    // Add Y axis
    svg.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .attr("class", "text-sm");

    // Add Y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "text-sm font-medium")
      .style("text-anchor", "middle")
      .text("Hours");

    // Add bars
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.name) || 0)
      .attr("y", chartHeight)
      .attr("width", x.bandwidth())
      .attr("fill", d => d.color)
      .attr("rx", 4)
      .transition()
      .duration(750)
      .attr("y", d => y(d.hours))
      .attr("height", d => chartHeight - y(d.hours));

    // Add value labels on top of bars
    svg.selectAll(".value-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "value-label text-sm font-medium")
      .attr("x", d => (x(d.name) || 0) + x.bandwidth() / 2)
      .attr("y", d => y(d.hours) - 5)
      .attr("text-anchor", "middle")
      .text(d => d.hours.toFixed(1));

  }, [data, height]);

  return <svg ref={svgRef} className="w-full h-full" />;
}
