/////////////////////////////////////////////////////////
/////////////// The Radar Chart Function ////////////////
/////////////// Written by Nadieh Bremer ////////////////
////////////////// VisualCinnamon.com ///////////////////
/////////// Inspired by the code of alangrafu ///////////

/////////////////////////////////////////////////////////
init();

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

class RadarChart {
  constructor(id, data, options) {
    var cfg = {
      margin: { top: 20, right: 20, bottom: 20, left: 20 }, //The margins of the SVG
      levels: 3, //How many levels or inner circles should there be drawn
      maxValue: 0, //What is the value that the biggest circle will represent
      labelFactor: 1.25, //How much farther than the radius of the outer circle should the labels be placed
      wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
      opacityArea: 0.7, //The opacity of the area of the blob
      dotRadius: 4, //The size of the colored circles of each blog
      opacityCircles: 0.1, //The opacity of the circles of each blob
      strokeWidth: 2, //The width of the stroke around each blob
      roundStrokes: false, //If true the area and stroke will follow a round path (cardinal-closed)
      editable: false //If true, the user can edit it
    };

    //Put all of the options into a variable called cfg
    if ("undefined" !== typeof options) {
      for (var i in options) {
        if ("undefined" !== typeof options[i]) {
          cfg[i] = options[i];
        }
      } //for i
    } //if

    const maxValue = cfg.maxValue

    this.data = data

    const name = data.name
    const color = data.color

    var allAxis = data.profile.map(d => d.axis), //Names of each axis
      total = allAxis.length, //The number of different axes
      radius = Math.min(cfg.w / 2, cfg.h / 2), //Radius of the outermost circle
      angleSlice = (Math.PI * 2) / total; //The width in radians of each "slice"

    var Format2 = function (d) {
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
    var rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);

    /////////////////////////////////////////////////////////
    //////////// Create the container SVG and g /////////////
    /////////////////////////////////////////////////////////

    //Remove whatever chart with the same id/class was present before
    d3.select(id).select("svg").remove();

    //Initiate the radar chart SVG
    var svg = d3
      .select(id)
      .append("svg")
      .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
      .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
      .attr("class", "radar" + id);
    //Append a g element
    var g = svg
      .append("g")
      .attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")");

    /////// GLOW ///////

    var filter = g.append("defs").append("filter").attr("id", "glow"),
      feGaussianBlur = filter
        .append("feGaussianBlur")
        .attr("stdDeviation", "2.5")
        .attr("result", "coloredBlur"),
      feMerge = filter.append("feMerge"),
      feMergeNode_1 = feMerge.append("feMergeNode").attr("in", "coloredBlur"),
      feMergeNode_2 = feMerge.append("feMergeNode").attr("in", "SourceGraphic");


    if(!cfg.editable) {
      g.append("text").text(name).attr("y", -radius-10).attr("text-anchor", "middle")
    }

    /////////////////////////////////////////////////////////
    /////////////// Draw the Circular grid //////////////////
    /////////////////////////////////////////////////////////

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
    //.style("filter", "url(#glow)")

    /////////////////////////////////////////////////////////
    //////////////////// Draw the axes //////////////////////
    /////////////////////////////////////////////////////////

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

    if (cfg.editable) {
      //Append the labels at each axis
      axis.append("text")
        .attr("class", "legend")
        .style("font-size", "1rem")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", (d, i) => rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y", (d, i) => rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
        .text(d => d)
        .call(wrap, cfg.wrapWidth)
    }

    /////////////////////////////////////////////////////////
    ///////////// Draw the radar chart blobs ////////////////
    /////////////////////////////////////////////////////////

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
      .style("fill", color)
      .style("fill-opacity", cfg.opacityArea)
      .on("mouseover", function () { d3.select(this).transition().duration(200).style("fill-opacity", cfg.opacityArea + 0.1) })
      .on("mouseout", function () { d3.select(this).transition().duration(200).style("fill-opacity", cfg.opacityArea) })

    //Create the outlines
    blobWrapper
      .append("path")
      .attr("class", "radarStroke")
      .attr("d", function (d, i) {
        return radarLine(d);
      })
      .style("stroke-width", cfg.strokeWidth + "px")
      .style("stroke", color)
      .style("fill", "none")
      .style("filter", "url(#glow)");

    //Append the circles
    blobWrapper
      .selectAll(".radarCircle")
      .data((d) => d)
      .enter()
      .append("circle")
      .attr("class", "radarCircle")
      .attr("r", cfg.dotRadius)
      .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .style("fill", color)
      .style("fill-opacity", 0);

    /////////////////////////////////////////////////////////
    //////// Append invisible circles for tooltip ///////////
    /////////////////////////////////////////////////////////

    //Wrapper for the invisible circles on top
    var blobCircleWrapper = g
      .selectAll(".radarCircleWrapper")
      .data([data.profile])
      .enter()
      .append("g")
      .attr("class", "radarCircleWrapper");

    //Set up the small tooltip for when you hover over a circle
    var tooltip = g.append("text").attr("class", "tooltip").attr("opacity", 0).attr("text-anchor", "middle").style("pointer-events", "none")

    //Append a set of invisible circles on top for the mouseover pop-up
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
      .on("mouseover", function (d, i) {
        let newX = parseFloat(d3.select(this).attr("cx")),
          newY = parseFloat(d3.select(this).attr("cy")) - 10

        tooltip
          //.attr("x", newX)
          //.attr("y", newY)
          .text(Format2(d))
          .transition()
          .duration(200)
          .attr("opacity", 1)
      })
      .on("mouseout", function () {
        tooltip.transition().duration(200).attr("opacity", 0);
      });

    // drag the invisible dots
    var drag = d3
      .drag()
      .on("drag", function (d, i) {
        let y = d3.event.y;
        let x = d3.event.x;
        let distFromCenter = Math.sqrt(y * y + x * x);
        d.value = rScale.invert(distFromCenter);
        d3.select(this)
          .attr("cx", rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
          .attr("cy", rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))

        const rounded = Math.min(Math.max(1, Math.round(d.value)), maxValue)
        tooltip
          //.attr("x", rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
          //.attr("y", rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2) - 10)
          .text(Format2({ axis: d.axis, value: rounded }))
          .attr("opacity", 1);

        //Move the circles
        blobWrapper
          .selectAll(".radarCircle")
          .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
          .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))

        //Move the rest
        blobWrapper
          .selectAll(".radarArea, .radarStroke")
          .attr("d", (d) => radarLine(d));
      })
      .on("end", function (d, i) {
        d.value = Math.min(Math.max(1, Math.round(d.value)), maxValue)
        d3.select(this)
          .transition()
          .attr("cx", rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
          .attr("cy", rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))

        tooltip
          .attr("opacity", 0);

        //Move the circles
        blobWrapper
          .selectAll(".radarCircle")
          .transition()
          .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
          .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))

        //Move the rest
        blobWrapper
          .selectAll(".radarArea, .radarStroke")
          .attr("d", (d) => radarLine(d));

        // show closest
        const closest = getClosestWine(data, tasteData, 3)
        new RadarChart("#radarChart1", closest[0], radarCharOptionsSmall);
        new RadarChart("#radarChart2", closest[1], radarCharOptionsSmall);
        new RadarChart("#radarChart3", closest[2], radarCharOptionsSmall);

      });

    if (cfg.editable) blobCircleWrapper.selectAll(".radarInvisibleCircle").call(drag);
  }
}
/////////////////////////////////////////////////////////
/////////////////// Helper Function /////////////////////
/////////////////////////////////////////////////////////

//Taken from http://bl.ocks.org/mbostock/7555321
//Wraps SVG text
function wrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.4, // ems
      y = text.attr("y"),
      x = text.attr("x"),
      dy = parseFloat(text.attr("dy")),
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", dy + "em");

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
} //wrap


let tasteData, radarCharOptionsSmall
function init() {

  d3.json("data/taste.json").then(function (data) {

    const margin = { top: 100, right: 100, bottom: 100, left: 100 },
      width = Math.min(500, window.innerWidth - 10) - margin.left - margin.right,
      height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20)

    tasteData = data

    const radarChartOptions = {
      w: width,
      h: height,
      margin: margin,
      maxValue: 5,
      levels: 5,
      roundStrokes: true,
      editable: true
    }
    radarCharOptionsSmall = {
      w: width / 2,
      h: height / 2,
      margin: { top: 40, right: 50, bottom: 10, left: 50 },
      maxValue: 5,
      levels: 5,
      roundStrokes: true,
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

    //Call function to draw the Radar chart
    const editableRadar = new RadarChart("#radarChartMain", defaultWine, radarChartOptions);
  })
}
