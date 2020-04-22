d3.json("./data/winefolly_aroma.json", function (d) {
    return d
}).then(function (data) {
   
    height = 1000
    width = 900

    format = d3.format(",d")

    color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))

    partition = data => {
        const root = d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.height - a.height || b.value - a.value);  
        return d3.partition()
            .size([height, (root.height + 1) * width / 3])
          (root);
      }

    const root = partition(data);
    let focus = root;

    desc = root.descendants()
    ro = desc.shift()

    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, height])
  
    const cell = svg
      .selectAll("g")
      //.data(root.descendants())
      .data(desc)
      .join("g")
      //.attr("transform", d => `translate(${d.y0},${d.x0})`);
      .attr("transform", d => "translate(" + (d.y0 - ro.y1) + "," + d.x0 + ")");

    const rect = cell.append("rect")
        .attr("width", d => d.y1 - d.y0 - 1)
        .attr("height", d => rectHeight(d))
        .attr("fill-opacity", 0.6)
        .attr("fill", d => {
          if (!d.depth) return "#ccc";
          while (d.depth > 1) d = d.parent;
          return color(d.data.name);
        })
        .style("cursor", "pointer")
        .on("click", clicked);
  
    const text = cell.append("text")
        .style("user-select", "none")
        .attr("pointer-events", "none")
        .attr("x", 4)
        .attr("y", 13)
        .attr("fill-opacity", d => +labelVisible(d));
  
    text.append("tspan")
        .text(d => d.data.name);
  
    const tspan = text.append("tspan")
        .attr("fill-opacity", d => labelVisible(d) * 0.7)

    cell.append("title")
        .text(d => /*`${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`*/ `${d.ancestors().map(d => d.data.name)}`);
  
    function clicked(p) {
      focus = focus === p ? p = p.parent : p;
  
      root.each(d => d.target = {
        x0: (d.x0 - p.x0) / (p.x1 - p.x0) * height,
        x1: (d.x1 - p.x0) / (p.x1 - p.x0) * height,
        y0: d.y0 - p.y0,
        y1: d.y1 - p.y0
      });
  
      const t = cell.transition().duration(750)
          .attr("transform", d => "translate(" + (d.target.y0 - ro.y1) + "," + d.target.x0 + ")" /*`translate(${d.target.y0},${d.target.x0})`*/);
  
      rect.transition(t).attr("height", d => rectHeight(d.target));
      text.transition(t).attr("fill-opacity", d => +labelVisible(d.target));
      tspan.transition(t).attr("fill-opacity", d => labelVisible(d.target) * 0.7);
    }
    
    function rectHeight(d) {
      return d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);
    }
  
    function labelVisible(d) {
      return d.y1 <= width && d.y0 >= 0 && d.x1 - d.x0 > 16;
    }

    document.getElementById('vis-smell')
    .append(svg.node())
})

function generateJSONfromCSV(data) {
  
}