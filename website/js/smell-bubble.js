d3.json("./data/winefolly_aroma.json", function (d) {
  return d;
}).then(function (data) {
  var width = 800,
    height = 500;

  var node_size = 50;

  data = classes(data).children;

  var svg = d3
    .select("#smell-viz")
    .append("svg")
    .attr("height", height)
    .attr("width", width);

 changeFocusBubbleGroups("all", 2);

  function getColor(d) {
    if (d.packageName == "Primary Aroma") {
      return "rgb(141, 15, 63)";
    } else if (d.packageName == "Secondary Aroma") {
      return "rgb(197, 183, 141)";
    } else if (d.packageName == "Tertiary Aroma") {
      return "rgb(150, 160, 43)";
    } else{
      return "rgb(235, 177, 188)";
    }
  }

  function getButton(d) {
    if (d == "Primary Aroma") {
      return d3.select("#primarySwitch");
    } else if (d == "Secondary Aroma") {
      return d3.select("#secondarySwitch");
    } else if (d == "Tertiary Aroma") {
      return d3.select("#tertiarySwitch");
    } else if (d == "Fault and Other"){
      return d3.select("#otherSwitch");
    } else {
      return d3.select("#allSwitch");
    }
  }

  function classes(root) {
    var classes = [];

    function recurse(name, node, level) {
      if (node.children) {
        classes.push({
          level: level,
          packageName: name,
          className: node.name,
          value: 10,
        });
        node.children.forEach(function (child) {
          recurse(node.name, child, level + 1);
        });
      } else
        classes.push({
          level: level,
          packageName: name,
          className: node.name,
          value: 20,
        });
    }

    recurse(null, root, 0);
    return {
      children: classes,
    };
  }

  function changeFocusBubbleGroups(focus, level, from=null) {

    if(d3.event) d3.event.stopPropagation();

    if(from) updateActive(getButton(from.packageName), from.className);
    else {
      updateActive(getButton(focus), focus);
      resetButtons();
    }
    
    new_data = data.filter((d) => d.level == level);
    if (focus != "all") {
      new_data = data.filter((d) => d.packageName == focus);
    }

    svg.selectAll(".circleContainer").remove();
    svg.selectAll("circle").remove();
    svg.selectAll("text").remove();

    var elem_updated = svg
      .selectAll("g")
      .data(new_data)
      .enter()
      .append("g")
      .attr("class", "circleContainer");

    elem_updated
      .append("circle")
      .style("cursor", d => d.level < 3 ? "pointer" : "auto")
      //.attr("stroke", "black")
      .attr("r", function () {
        return node_size;
      })
      .attr("fill", function (d) {
        if (d.level == 3) {
          return getColor(from);
        } else {
          return getColor(d);
        }
      })
      .on("click", function (d) {
        if (d.level < 3) {
          changeFocusBubbleGroups(d.className, 3, d);
        } else {
          d3.event.stopPropagation();
        }
      });

    elem_updated
      .append("text")
      .attr("text-anchor", "middle")
      .text(function (d) {
        return d.className;
      });

    //simulation.nodes(new_data)
    var simulation = d3
      .forceSimulation()
      .force("x", d3.forceX(width / 2))
      .force("y", d3.forceY(height / 2))
      .force("collision", d3.forceCollide().radius(node_size))
      .on("tick", function (d) {
        elem_updated.attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        });
      });

    simulation.nodes(new_data);
  }

  function updateActive(e, text) {
    //console.log(e)
    d3.selectAll("#toolbar span").classed("active", false)
    e.classed("active", true)
    e.node().innerText = text
  }

  function resetButtons() {
    d3.select("#primarySwitch").node().innerText = "Primary Aromas"
    d3.select("#secondarySwitch").node().innerText = "Secondary aromas"
    d3.select("#tertiarySwitch").node().innerText = "Tertiary aromas"
    d3.select("#otherSwitch").node().innerText = "Fault & Others"
    d3.select("#allSwitch").node().innerText = "All aromas"
  }

  d3.select("#allSwitch").on("click", function () {
    changeFocusBubbleGroups("all", 2);
  });
  d3.select("#primarySwitch").on("click", function () {
    changeFocusBubbleGroups("Primary Aroma", 2);
  });
  d3.select("#secondarySwitch").on("click", function () {
    changeFocusBubbleGroups("Secondary Aroma", 2);
  });
  d3.select("#tertiarySwitch").on("click", function () {
    changeFocusBubbleGroups("Tertiary Aroma", 2);
  });
  d3.select("#otherSwitch").on("click", function () {
    changeFocusBubbleGroups("Fault and Other", 2);
  });

  svg.on("click", () => changeFocusBubbleGroups("all", 2));
});
