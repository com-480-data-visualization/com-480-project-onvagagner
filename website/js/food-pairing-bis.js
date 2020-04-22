const margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

const svg = d3.select("#my-viz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

const panel = document.getElementById("info-panel")

d3.json("./data/food_pairing.json").then(data => {

    const opacity = 0.1;
    const strokeWidth = 7;
    const strokeWidthLink = 4;

    const wineY = d3.scaleLinear().domain([0, data.wines.length - 1]).range([0, height])
    const foodY = d3.scaleLinear().domain([0, data.foods.length - 1]).range([0, height])

    const color = function (d) {
        const colors = ["#e5ecb8", "#fecf03", "#fdda7c", "#dedede", "#d20331", "#87032b", "#511322", "#c94f04"]
        return colors[d]
    }

    d3.selection.prototype.moveToFront = function () {
        return this.each(function () {
            this.parentNode.appendChild(this);
        });
    };

    // INTERACTION FUNCTIONS
    function onWineSelected(s) {

        d3.event.stopPropagation();

        const relevantLinks = data.links.filter(l => l.wine == s.id)
        const relevantFoods = relevantLinks.map(l => l.food)

        // highlight wine
        d3.selectAll(".wineNode text")
            .transition()
            .attr("opacity", w => w.id == s.id ? 1 : opacity)

        d3.selectAll(".wineNode circle")
            .transition()
            .duration(500)
            .ease(d3.easeBounceOut)
            .attr("stroke-width", w => w.id == s.id ? 1 : strokeWidth)

        d3.selectAll(".foodNode circle")
            .transition()
            .duration(500)
            .delay(300)
            .ease(d3.easeBounceOut)
            .attr("stroke-width", f => relevantFoods.includes(f.id) ? 1 : strokeWidth)

        // highlight foods
        d3.selectAll(".foodNode text")
            .transition()
            .attr("opacity", f => relevantFoods.includes(f.id) ? 1 : opacity)

        // highlight links
        const links = d3.selectAll("line")
        links.filter(d => relevantLinks.includes(d))
            .moveToFront()
            .transition()
            .delay((d, i) => i * 50 + 200)
            .attr("opacity", 1)
            .attr("stroke-width", strokeWidth)
        links.filter(d => !relevantLinks.includes(d))
            .transition()
            .attr("opacity", opacity)
            .attr("stroke-width", strokeWidthLink)

        // put info into panel
        panel.style.display = "block"
        panel.innerHTML = formatWineInfo(s, relevantFoods)
    }

    function formatWineInfo(w, foodIds) {
        let title = `<h2 style="border-bottom: 3px solid ${w.color}">${w.name}</h2>`

        let varieties = `<h3>Typical Varieties</h3><ul>`
        w.varieties.forEach(v => varieties += `<li>${v}</li>`)
        varieties += `</ul>`

        let description = `<h3>Description</h3><p>Some short description ?</p>`

        let foods = `<h3>Goes well with</h3>`
        data.foods.forEach(f => {
            if (foodIds.includes(f.id)) foods += `<div class="food-icon"><img height="30" src="${f.img}" /><p>${f.name}</p></div>`
        })
        return title + description + varieties + foods
    }

    function onFoodSelected(s) {

        d3.event.stopPropagation();

        const relevantLinks = data.links.filter(l => l.food == s.id)
        const relevantWines = relevantLinks.map(l => l.wine)

        // highlight food
        d3.selectAll(".foodNode text")
            .transition()
            .attr("opacity", f => f.id == s.id ? 1 : opacity)

        d3.selectAll(".foodNode circle")
            .transition()
            .duration(500)
            .ease(d3.easeBounceOut)
            .attr("stroke-width", f => f.id == s.id ? 1 : strokeWidth)

        d3.selectAll(".wineNode circle")
            .transition()
            .duration(500)
            .delay(300)
            .ease(d3.easeBounceOut)
            .attr("stroke-width", w => relevantWines.includes(w.id) ? 1 : strokeWidth)

        // highlight wines
        d3.selectAll(".wineNode text")
            .transition()
            .attr("opacity", w => relevantWines.includes(w.id) ? 1 : opacity)

        // highlight links
        const links = d3.selectAll("line")
        links.filter(d => relevantLinks.includes(d))
            .moveToFront()
            .transition()
            .delay((d, i) => i * 50 + 200)
            .attr("opacity", 1)
            .attr("stroke-width", strokeWidth)
        links.filter(d => !relevantLinks.includes(d))
            .transition()
            .attr("opacity", opacity)
            .attr("stroke-width", strokeWidthLink)

        panel.style.display = "block"
        panel.innerHTML = formatFoodInfo(s, relevantWines)
    }

    function formatFoodInfo(f, wineIds) {
        let title = `<h2 style="border-bottom: 3px solid black">${f.name}</h2>`

        let dishes = `<h3>Dish examples</h3><ul>`
        //f.dishes.forEach(v => dishes += `<li>${v}</li>`)
        dishes += `</ul>`

        let description = `<h3>Description</h3><p>Some short description ?</p>`

        let wines = `<h3>Goes well with</h3>`
        data.wines.forEach(w => {
            if (wineIds.includes(w.id)) wines += `<div class="food-icon">
                                                        <svg height="20" width="20">
                                                            <circle r="10" transform="translate(10,10)" fill="${color(w.id)}"></circle>
                                                        </svg>
                                                        <p>${w.name}</p>
                                                    </div>`
        })
        return title + description + dishes + wines
    }

    function onRemoveSelection() {
        // highlight all
        d3.selectAll(".foodNode text, .wineNode text")
            .transition()
            .attr("opacity", 1)

        d3.selectAll(".foodNode circle, .wineNode circle")
            .transition()
            .duration(500)
            .ease(d3.easeBounceOut)
            .attr("stroke-width", strokeWidth)

        d3.selectAll("line")
            .transition()
            .delay((d, i) => i * 10)
            .attr("opacity", 0.5)
            .attr("stroke-width", strokeWidthLink)

        panel.innerHTML = ""
        panel.style.display = "none"
    }

    const innerMargin = 150;

    // Initialize the links
    const lineContainer = svg.append("g")
    const links = lineContainer
        .selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
        .attr("x1", innerMargin).attr("y1", d => wineY(d.wine))
        .attr("x2", width - innerMargin).attr("y2", d => foodY(d.food))
        .attr("stroke", d => color(d.wine))
        .attr("stroke-width", strokeWidthLink)
        .attr("opacity", 0.5)

    // Initialize the nodes
    const wineNodes = svg
        .selectAll(".wineNode")
        .data(data.wines)
        .enter()
        .append("g")
        .attr("transform", d => "translate(" + innerMargin + "," + wineY(d.id) + ")")
        .attr("class", "wineNode")
        .style("cursor", "pointer")
        .attr("opacity", 1)
        .on("click", onWineSelected)

    // Initialize the nodes
    const foodNodes = svg
        .selectAll(".foodNode")
        .data(data.foods)
        .enter()
        .append("g")
        .attr("transform", d => "translate(" + (width - innerMargin) + "," + foodY(d.id) + ")")
        .attr("class", "foodNode")
        .style("cursor", "pointer")
        .attr("opacity", 1)
        .on("click", onFoodSelected)

    wineNodes.append("circle")
        .attr("r", 10)
        .style("fill", d => color(d.id))
        .attr("stroke", "#fff")
        .attr("stroke-width", strokeWidth)

    wineNodes.append("text")
        .text(d => d.name)
        .attr("x", -20)
        .attr("y", 6)
        .attr("text-anchor", "end")
        .attr("opacity", 1)

    foodNodes.append("circle")
        .attr("r", 10)
        .style("fill", "#000")
        .attr("stroke", "#fff")
        .attr("stroke-width", strokeWidth)

    foodNodes.append("text")
        .text(d => d.name)
        .attr("x", 20)
        .attr("y", 6)
        .attr("text-anchor", "start")
        .attr("opacity", 1)

    d3.select("#my-viz svg").on("click", onRemoveSelection)
})