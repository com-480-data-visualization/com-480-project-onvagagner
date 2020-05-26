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

  var data_initial = data.filter((d) => d.level == 2);

  var elem = svg
    .selectAll("g")
    .data(data_initial)
    .enter()
    .append("g")
    .attr("class", "circleContainer");

  var circle = elem
    .append("circle")
    .attr("class", "circle")
    .attr("stroke", "black")
    .attr("r", function (d) {
      return node_size;
    })
    .attr("fill", function (d) {
      return getColor(d);
    })
    .on("click", function (d) {
      if (d.level < 3) {
        changeFocusBubbleGroups(d.className, 3, d);
      }
    });

  var text = elem
    .append("text")
    .attr("class", "text")
    .attr("text-anchor", "middle")
    .text(function (d) {
      return d.className;
    });

  var simulation = d3
    .forceSimulation()
    .force("x", d3.forceX(width / 2))
    .force("y", d3.forceY(height / 2))
    .force("collision", d3.forceCollide().radius(node_size))
    .on("tick", function (d) {
      elem.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    });

  simulation.nodes(data_initial);

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
    new_data = data.filter((d) => d.level == level);
    if (focus != "all") {
      new_data = data.filter((d) => d.packageName == focus);
    }

    svg.selectAll(".circleContainer").remove();
    svg.selectAll(".circle").remove();
    svg.selectAll(".text").remove();

    var elem_updated = svg
      .selectAll("g")
      .data(new_data)
      .enter()
      .append("g")
      .attr("class", "circleContainer");

    elem_updated
      .append("circle")
      .attr("class", "circle")
      .attr("stroke", "black")
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
        }
      });

    elem_updated
      .append("text")
      .attr("class", "text")
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
});
