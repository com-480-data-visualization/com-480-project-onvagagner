const handleHeight = 2;

const fillToPercent = d3.scaleLinear()
    .domain([0, 100])
    .range([130, 110]);

const glass = d3.select("#filling-wine-glass");
const wine = d3.select("#wine").attr("y", fillToPercent(0));
const handle = glass.append("rect")
    .attr("x", wine.attr("x")).attr("y", fillToPercent(0))
    .attr("height", handleHeight).attr("width", wine.attr("width"))
    .attr("rx", 1).attr("ry", 1)
    .attr("fill-opacity", 0).attr("opacity", 0)
    .attr("stroke", "black").attr("stroke-width", 0.2).attr("stroke-dasharray", "0.5,0.5")
    .style("cursor", "grab");

glass.on("mouseenter", function () {
    handle.attr("opacity", 1);
})

glass.on("mouseleave", function () {
    handle.attr("opacity", 0);
})

var dragToFill = d3.drag()
    .on("start", function () {
        handle.style("cursor", "grabbing")
    })
    .on("drag", function () {
        y = d3.mouse(d3.select("#filling-wine-glass").node())[1];
        y = Math.max(110, Math.min(y, 130));
        wine.attr("y", y).attr("height", 130 - y);
        handle.attr("y", y - handleHeight / 2);
    })
    .on("end", function () {
        handle.style("cursor", "grab")
        y = fillToPercent.invert(wine.attr("y"));
        verdict = "Keep going, don't be scared!"
        if (y > 35) verdict = "Perfect!"
        if (y > 50) verdict = "Whoa! Calm down!"
        document.getElementById("text").innerText = verdict;
    });

handle.call(dragToFill);

