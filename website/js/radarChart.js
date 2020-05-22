// radar chart design adapted from code by Nadieh Bremer (VisualCinnamon.com)

class RadarChart {
  constructor(id, data, options) {
    var cfg = {
      margin: { top: 20, right: 20, bottom: 20, left: 20 }, //The margins of the SVG
      levels: 5, //How many levels or inner circles should there be drawn
      maxValue: 5, //What is the value that the biggest circle will represent
      labelFactor: 1.25, //How much farther than the radius of the outer circle should the labels be placed
      opacityArea: 0.5, //The opacity of the area of the blob
      dotRadius: 4, //The size of the colored circles of each blog
      opacityCircles: 0.1, //The opacity of the circles of each blob
      strokeWidth: 2, //The width of the stroke around each blob
      roundStrokes: true, //If true the area and stroke will follow a round path (cardinal-closed)
      editable: false, //If true, the user can edit it
      showLabels: true,
      showName: true
    };

    //Put all of the options into a variable called cfg
    if ("undefined" !== typeof options)
      for (var i in options)
        if ("undefined" !== typeof options[i])
          cfg[i] = options[i]

    const maxValue = cfg.maxValue

    this.id = id
    this.data = data

    const allAxis = data.profile.map(d => d.axis), //Names of each axis
      total = allAxis.length, //The number of different axes
      radius = Math.min(cfg.w / 2, cfg.h / 2), //Radius of the outermost circle
      angleSlice = (Math.PI * 2) / total; //The width in radians of each "slice"

    const formatTooltip = function (d) {
      const gne = {
        Acidity: [
          "Low Acidity",
          "Medium-low Acidity",
          "Medium Acidity",
          "Medium-high Acidity",
          "Basically a lemon",
        ],
        Tannins: [
          "No Tannins",
          "Low Tannins",
          "Medium Tannins",
          "Medium-high Tannins",
          "High Tannins",
        ],
        Sweetness: ["Bone-dry", "Dry", "Off-Dry", "Sweet", "Basically candy"],
        Body: [
          "Light body",
          "Medium-light body",
          "Medium body",
          "Medium-full body",
          "Full body",
        ],
        Alcohol: [
          "Under 10% ABV",
          "10–11.5% ABV",
          "11.5–13.5% ABV",
          "13.5–15% ABV",
          "Over 15% ABV",
        ],
      };
      return gne[d.axis][d.value - 1];
    };

    //Scale for the radius
    const rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);

    //////////// Create the container SVG and g /////////////

    //Remove whatever chart with the same id/class was present before
    d3.select(id).select("svg").remove();

    //Initiate the radar chart SVG
    const svg = d3
      .select(id)
      .append("svg")
      .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
      .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
      .attr("class", "radar" + id);
    //Append a g element
    const g = svg
      .append("g")
      .attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")");

    /////// GLOW ///////

    const filter = g.append("defs").append("filter").attr("id", "glow"),
      feGaussianBlur = filter
        .append("feGaussianBlur")
        .attr("stdDeviation", "2.5")
        .attr("result", "coloredBlur"),
      feMerge = filter.append("feMerge"),
      feMergeNode_1 = feMerge.append("feMergeNode").attr("in", "coloredBlur"),
      feMergeNode_2 = feMerge.append("feMergeNode").attr("in", "SourceGraphic");


    //if (cfg.showName) g.append("text").text(this.data.name).attr("y", -radius - 20).attr("text-anchor", "middle")

    /////////////// Draw the Circular grid //////////////////

    //Wrapper for the grid & axes
    var axisGrid = g.append("g").attr("class", "axisWrapper");

    axisGrid.append("circle").attr("r", radius).style("fill", "black")

    //Draw the background circles
    axisGrid
      .selectAll(".levels")
      .data(d3.range(1, cfg.levels + 1).reverse())
      .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", d => (radius / cfg.levels) * d)
      .style("fill", "white")
      .style("fill-opacity", cfg.opacityCircles)

    //////////////////// Draw the axes //////////////////////

    //Create the straight lines radiating outward from the center
    var axis = axisGrid
      .selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis");
    //Append the lines
    axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d, i) => rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (d, i) => rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("class", "line")
      .style("stroke", "white")
      .style("stroke-opacity", 0.1)
      .style("stroke-width", "2px");

    if (cfg.showLabels) {
      //Append the labels at each axis
      axis.append("text")
        .attr("class", "legend")
        .style("font-size", "1rem")
        .attr("text-anchor", "middle")
        .attr("x", (d, i) => rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y", (d, i) => rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
        .text(d => d)
    }

    ///////////// Draw the radar chart blob ////////////////

    //The radial line function
    var radarLine = d3
      .lineRadial()
      .curve(d3.curveLinearClosed)
      .radius((d) => rScale(d.value))
      .angle((d, i) => i * angleSlice)

    if (cfg.roundStrokes) radarLine.curve(d3.curveCardinalClosed)

    //Create a wrapper for the blobs
    var blobWrapper = g
      .selectAll(".radarWrapper")
      .data([data.profile])
      .enter()
      .append("g")
      .attr("class", "radarWrapper");

    //Append the backgrounds
    blobWrapper
      .append("path")
      .attr("class", "radarArea")
      .attr("d", d => radarLine(d))
      .style("fill", this.data.color)
      .style("fill-opacity", cfg.opacityArea)
      //.on("mouseover", function () { d3.select(this).transition().duration(200).style("fill-opacity", cfg.opacityArea - 0.2) })
      //.on("mouseout", function () { d3.select(this).transition().duration(200).style("fill-opacity", cfg.opacityArea) })

    //Create the outlines
    blobWrapper
      .append("path")
      .attr("class", "radarStroke")
      .attr("d", function (d, i) {
        return radarLine(d);
      })
      .style("stroke-width", cfg.strokeWidth + "px")
      .style("stroke", this.data.color)
      .style("fill", "none")
      .style("filter", "url(#glow)");

    //////// Append invisible circles for dragging + tooltip ///////////

    //Wrapper for the invisible circles on top
    var blobCircleWrapper = g
      .selectAll(".radarCircleWrapper")
      .data([data.profile])
      .enter()
      .append("g")
      .attr("class", "radarCircleWrapper");

    //Set up the small tooltip for when you hover/drag
    var tooltip = g.append("text")
      .attr("class", "tooltip").attr("opacity", cfg.showName ? 1 : 0).attr("text-anchor", "middle")
      .attr("fill", "white").text(this.data.name)
      .style("pointer-events", "none").style("font-weight", "bold")

    //Append a set of invisible circles for drag
    blobCircleWrapper
      .selectAll(".radarInvisibleCircle")
      .data(d => d)
      .enter()
      .append("circle")
      .attr("class", "radarInvisibleCircle")
      .attr("r", cfg.dotRadius * 2)
      .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .style("fill", "none")
      .style("pointer-events", "all")
      .style("cursor", "pointer")
      .on("mouseover", function (d) {
        tooltip.text(formatTooltip(d)).transition().duration(200).attr("opacity", 1)
        blobWrapper
          .selectAll(".radarArea").transition().duration(200).style("fill-opacity", cfg.opacityArea - 0.2)
        blobWrapper
          .selectAll(".radarStroke").transition().duration(200).style("stroke-opacity", 0.5)
      })
      .on("mouseout", function () {
        blobWrapper
          .selectAll(".radarArea").transition().duration(200).style("fill-opacity", cfg.opacityArea)
        blobWrapper
          .selectAll(".radarStroke").transition().duration(200).style("stroke-opacity", 1)

        if (cfg.showName) tooltip.text(data.name)
        else tooltip.transition().duration(200).attr("opacity", 0)
      })

    // drag the invisible dots
    var drag = d3
      .drag()
      .on("drag", function (d, i) {
        let y = d3.mouse(this)[1] //d3.event.y
        let x = d3.mouse(this)[0] //d3.event.x
        if (firefox) y -= parseFloat(document.getElementById("fullpage").style.transform.split(",")[1].slice(0, -1))
        let distFromCenter = Math.sqrt(y * y + x * x)
        d.value = Math.min(Math.max(1, rScale.invert(distFromCenter)), maxValue) // clamp value to not go outside of graphic
        d3.select(this)
          .attr("cx", rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
          .attr("cy", rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))

        const rounded = Math.round(d.value) // round because tooltip values are categorical/discrete
        tooltip
          .text(formatTooltip({ axis: d.axis, value: rounded }))
          .attr("opacity", 1)

        //Move the blob
        blobWrapper
          .selectAll(".radarArea, .radarStroke")
          .attr("d", (d) => radarLine(d))

        blobWrapper
          .selectAll(".radarArea").style("fill-opacity", cfg.opacityArea - 0.2)
      })
      .on("end", function (d, i) {
        d.value = Math.round(d.value)
        d3.select(this)
          .transition()
          .attr("cx", rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
          .attr("cy", rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))

        tooltip.transition().attr("opacity", 0)

        //Move the blob
        blobWrapper
          .selectAll(".radarArea, .radarStroke")
          .attr("d", (d) => radarLine(d));

        blobWrapper
          .selectAll(".radarArea").transition().duration(200).style("fill-opacity", cfg.opacityArea)

        // show closest
        const closest = getClosestWine(data, tasteData, 3)
        new RadarChart("#radarChart1", closest[0], radarChartOptionsSmall);
        new RadarChart("#radarChart2", closest[1], radarChartOptionsSmall);
        new RadarChart("#radarChart3", closest[2], radarChartOptionsSmall);

      });

    if (cfg.editable) blobCircleWrapper.selectAll(".radarInvisibleCircle").call(drag);
  }

  updateColor(switchcolor) {
    let color = switchcolor === "red" ? "rgb(253,12,64)" : "rgb(255,255,200)"
    this.data.color = color
    d3.selectAll(`${this.id} .radarArea`).style("fill", color)
    d3.selectAll(`${this.id} .radarStroke`).style("stroke", color)
  }
}

function getClosestWine(wine, data, nb = 3) {
  let _wine = wine.profile.map(p => p.value)

  function dist(a, b) {
    return a.map((x, i) => (x - b[i]) ** 2).reduce((sum, now) => sum + now)
  }

  function compare(a, b) {
    let _a = a.profile.map(p => p.value)
    let _b = b.profile.map(p => p.value)
    return dist(_a, _wine) - dist(_b, _wine)
  }

  return data.sort(compare).slice(0, nb)
}

let tasteData, radarChartOptionsSmall, radarChartOptions
let editableRadar

d3.json("data/taste.json").then(function (data) {

  const margin = { top: 80, right: 100, bottom: 50, left: 100 },
    width = Math.min(500, window.innerWidth - 10) - margin.left - margin.right,
    height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20)

  tasteData = data

  radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    editable: true,
    showName: false
  }
  radarChartOptionsSmall = {
    w: width / 2,
    h: height / 2,
    margin: { top: 10, right: 0, bottom: 10, left: 0 },
    showLabels: false
  }

  const defaultWine = {
    name: "Default",
    color: "rgb(253,12,64)",
    profile: [
      { axis: "Sweetness", value: 3 },
      { axis: "Body", value: 3 },
      { axis: "Tannins", value: 3 },
      { axis: "Acidity", value: 3 },
      { axis: "Alcohol", value: 3 }
    ]
  }
  editableRadar = new RadarChart("#radarChartMain", defaultWine, radarChartOptions)
  document.getElementById("colorSwitch").addEventListener("click", function () {
    editableRadar.updateColor(this.innerText)
  })

  // add search bar
  const varieties = tasteData.map(v => v.name)
  autocomplete(document.getElementById("tasteSearch"), varieties)
})

function getWineData() {
  let search = document.getElementById("tasteSearch")
  let grape = tasteData.find(v => v.name === search.value)
  if (grape) {
    const copy = JSON.parse(JSON.stringify(grape));
    let chartOptions = radarChartOptions
    chartOptions.editable = false
    chartOptions.showName = true
    new RadarChart("#radarChartSearch", copy, chartOptions)
  }
  search.value = ""
}