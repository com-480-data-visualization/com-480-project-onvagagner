const dark = true;

d3.selection.prototype.moveToFront = function () {
  return this.each(function () {
    this.parentNode.appendChild(this);
  });
};

class FoodPairingViz {
  constructor(data, parentDiv, panelDiv) {
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    this.data = data;
    this.panel = document.getElementById(panelDiv);
    this.panel.style.display = "none"

    this.svg = d3.select("#" + parentDiv + " svg");
    const svgViewbox = this.svg.node().getBoundingClientRect();
    console.log(svgViewbox);

    const g = this.svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    this.width = svgViewbox.width - margin.left - margin.right;
    this.height = svgViewbox.height - margin.top - margin.bottom;

    this.opacity = 0.3;
    this.strokeWidth = 7;
    this.strokeWidthLink = 2;

    const wineY = d3
      .scaleLinear()
      .domain([0, data.wines.length - 1])
      .range([0, this.height]);
    const foodY = d3
      .scaleLinear()
      .domain([0, data.foods.length - 1])
      .range([0, this.height]);

    const color = function (d) {
      const colors = [
        "#e5ecb8",
        "#fecf03",
        "#fdda7c",
        "#dedede",
        "#EC1D4B",
        "#A11D45",
        "#854756",
        "#c94f04",
      ];
      return colors[d];
    };

    this.computePath = (d, factor) => {
      const start = { x: innerMargin, y: wineY(d.wine) },
        end = { x: this.width - innerMargin, y: foodY(d.food) },
        mid = {
          x: (start.x + end.x) / 2,
          y: factor * start.y + (1 - factor) * end.y,
        };

      return `M ${start.x} ${start.y} Q ${mid.x} ${mid.y} ${end.x} ${end.y}`;
    };

    // INTERACTION FUNCTIONS
    this.onWineSelected = (s) => {
      d3.event.stopPropagation();

      const relevantLinks = this.data.links.filter((l) => l.wine == s.id);
      const relevantFoods = relevantLinks.map((l) => l.food);

      // highlight wine
      this.svg
        .selectAll(".wineNode text")
        .transition()
        .attr("opacity", (w) => (w.id == s.id ? 1 : this.opacity));

      this.svg
        .selectAll(".wineNode circle")
        .transition()
        .duration(500)
        .ease(d3.easeBounceOut)
        .attr("r", 5)
        .attr("stroke-width", (w) => (w.id == s.id ? 1 : this.strokeWidth));

      this.svg
        .selectAll(".foodNode circle")
        .transition()
        .duration(500)
        .delay(300)
        .ease(d3.easeBounceOut)
        .attr("r", 5)
        .attr("stroke-width", (f) =>
          relevantFoods.includes(f.id) ? 1 : this.strokeWidth
        );

      // highlight foods
      this.svg
        .selectAll(".foodNode text")
        .transition()
        .attr("opacity", (f) =>
          relevantFoods.includes(f.id) ? 1 : this.opacity
        );

      // highlight links
      const links = this.svg.selectAll("path");
      //.attr("x2", innerMargin).attr("y2", d => wineY(d.wine))

      links
        .filter((d) => relevantLinks.includes(d))
        .moveToFront()
        .transition()
        .delay((d, i) => i * 50 + 200)
        .attr("d", (d) => this.computePath(d, 0.1))
        .attr("opacity", 1)
        .attr("stroke-width", this.strokeWidth);
      //.attr("x2", this.width - innerMargin).attr("y2", d => foodY(d.food))
      links
        .filter((d) => !relevantLinks.includes(d))
        .transition()
        .attr("opacity", this.opacity)
        .attr("stroke-width", this.strokeWidthLink)
        .attr("d", (d) => this.computePath(d, 0.9));

      // put info into panel
      this.panel.style.display = "block";
      this.panel.innerHTML = this.formatWineInfo(s, relevantFoods);
    };

    this.formatWineInfo = (w, foodIds) => {
      let title = `<h2 style="color: ${w.color}">${w.name}</h2>`;

      /*let varieties = `<h3>Typical Varieties</h3>` + `<ul>`;
      w.varieties.forEach((v) => (varieties += `<li>${v}</li>`));
      varieties += `</ul>`;*/
      let varieties = `<h3>Typical Varieties</h3><div class="grid-container">`
      w.varieties.forEach((v) => (varieties += `<div>${v}</div>`))
      varieties += `</div>`

      let description = `<h3>Description</h3><p>Some short description ?</p>`;

      let foods = `<h3>Goes well with</h3><div class="grid-container">`;
      this.data.foods.forEach((f) => {
        if (foodIds.includes(f.id))
          foods += `<div class="food-icon"><img src="${f.img}" /><p>${f.name}</p></div>`;
      });
      foods += `</div>`
      return title + description + varieties + foods;
    };

    this.onFoodSelected = (s) => {
      d3.event.stopPropagation();

      const relevantLinks = this.data.links.filter((l) => l.food == s.id);
      const relevantWines = relevantLinks.map((l) => l.wine);

      // highlight food
      this.svg
        .selectAll(".foodNode text")
        .transition()
        .attr("opacity", (f) => (f.id == s.id ? 1 : this.opacity));

      this.svg
        .selectAll(".foodNode circle")
        .transition()
        .duration(500)
        .ease(d3.easeBounceOut)
        .attr("r", 5)
        .attr("stroke-width", (f) => (f.id == s.id ? 1 : this.strokeWidth));

      this.svg
        .selectAll(".wineNode circle")
        .transition()
        .duration(500)
        .delay(300)
        .ease(d3.easeBounceOut)
        .attr("r", 5)
        .attr("stroke-width", (w) =>
          relevantWines.includes(w.id) ? 1 : this.strokeWidth
        );

      // highlight wines
      this.svg
        .selectAll(".wineNode text")
        .transition()
        .attr("opacity", (w) =>
          relevantWines.includes(w.id) ? 1 : this.opacity
        );

      // highlight links
      const links = this.svg.selectAll("path");
      links
        .filter((d) => relevantLinks.includes(d))
        .moveToFront()
        .transition()
        .delay((d, i) => i * 50 + 200)
        .attr("opacity", 1)
        .attr("stroke-width", this.strokeWidth)
        .attr("d", (d) => this.computePath(d, 0.9));
      links
        .filter((d) => !relevantLinks.includes(d))
        .transition()
        .attr("opacity", this.opacity)
        .attr("stroke-width", this.strokeWidthLink)
        .attr("d", (d) => this.computePath(d, 0.9));

      this.panel.style.display = "block"
      this.panel.innerHTML = this.formatFoodInfo(s, relevantWines);
    };

    this.formatFoodInfo = (f, wineIds) => {
      let title = `<h2 style="border-bottom: 3px solid black">${f.name}</h2>`;

      let dishes = `<h3>Dish examples</h3><ul>`;
      //f.dishes.forEach(v => dishes += `<li>${v}</li>`)
      dishes += `</ul>`;

      let description = `<h3>Description</h3><p>Some short description ?</p>`;

      let wines = `<h3>Goes well with</h3><div class="grid-container">`;
      this.data.wines.forEach((w) => {
        if (wineIds.includes(w.id))
          wines += `<div class="food-icon">
                        <svg height="20" width="20">
                            <circle r="10" transform="translate(10,10)" fill="${color(
                              w.id
                            )}"></circle>
                        </svg>
                        <p>${w.name}</p>
                    </div>`;
      });
      wines += `</div>`
      return title + description + dishes + wines;
    };

    this.onRemoveSelection = () => {
      // highlight all
      this.svg
        .selectAll(".foodNode text, .wineNode text")
        .transition()
        .attr("opacity", 1);

      this.svg
        .selectAll(".foodNode circle, .wineNode circle")
        .transition()
        .duration(500)
        .ease(d3.easeBounceOut)
        .attr("r", 10)
        .attr("stroke-width", this.strokeWidth);

      /*
            const factor = d3.scaleLinear()
                .domain([innerMargin, this.width - innerMargin])
                .range([0, 1])
                .clamp(true)
           
            const f = factor(d3.mouse(this.svg.select("g").node())[0])
            */
      this.svg
        .selectAll("path")
        .transition()
        .duration(500)
        .attr("opacity", 0.5)
        .attr("stroke-width", this.strokeWidth)
        .attr("d", (d) => this.computePath(d, 0.9));

      this.panel.innerHTML = "";
      this.panel.style.display = "none";
    };

    const innerMargin = 150;

    // Initialize the links
    const lineContainer = g.append("g");

    const paths = lineContainer
      .selectAll("path")
      .data(this.data.links)
      .enter()
      .append("path")
      .attr("d", (d) => this.computePath(d, 0.9))
      .attr("stroke", (d) => color(d.wine))
      .attr("stroke-width", this.strokeWidth)
      .attr("fill", "transparent")
      .attr("opacity", 0.5)
      .style("mix-blend-mode", "screen");

    // Initialize the nodes
    const wineNodes = g
      .selectAll(".wineNode")
      .data(this.data.wines)
      .enter()
      .append("g")
      .attr(
        "transform",
        (d) => "translate(" + innerMargin + "," + wineY(d.id) + ")"
      )
      .attr("class", "wineNode")
      .style("cursor", "pointer")
      .attr("opacity", 1)
      .on("click", this.onWineSelected);

    // Initialize the nodes
    const foodNodes = g
      .selectAll(".foodNode")
      .data(data.foods)
      .enter()
      .append("g")
      .attr(
        "transform",
        (d) =>
          "translate(" + (this.width - innerMargin) + "," + foodY(d.id) + ")"
      )
      .attr("class", "foodNode")
      .style("cursor", "pointer")
      .attr("opacity", 1)
      .on("click", this.onFoodSelected);

    wineNodes
      .append("circle")
      .attr("r", 10)
      .style("fill", (d) => color(d.id))
      .attr("stroke", dark ? "#000" : "#fff")
      .attr("stroke-width", this.strokeWidth);

    wineNodes
      .append("text")
      .text((d) => d.name)
      .attr("x", -20)
      .attr("fill", dark ? "#fff" : "#000")
      .attr("text-anchor", "end")
      //.style("font-size", function(d) { return Math.min(10, (innerMargin) / this.getComputedTextLength() * 10) + "px"; })
      .attr("opacity", 1);

    foodNodes
      .append("circle")
      .attr("r", 10)
      .style("fill", dark ? "#fff" : "#000")
      .attr("stroke", dark ? "#000" : "#fff")
      .attr("stroke-width", this.strokeWidth);

    foodNodes
      .append("text")
      .text((d) => d.name)
      .attr("x", 20)
      .attr("fill", dark ? "#fff" : "#000")
      .attr("text-anchor", "start")
      //.style("font-size", function(d) { return Math.min(10, (innerMargin) / this.getComputedTextLength() * 10) + "px"; })
      .attr("opacity", 1);

    this.svg.on("click", this.onRemoveSelection);
  }
}

d3.json("./data/food_pairing.json").then((data) => {
  const foodPairingViz = new FoodPairingViz(
    data,
    "food-pairing-viz",
    "food-pairing-info-panel"
  );
});
