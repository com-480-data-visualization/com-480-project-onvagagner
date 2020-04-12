let showHandle = false
const handleHeight = 2

const fillToPercent = d3.scaleLinear()
    .domain([0, 100])
    .range([130, 110])

const customEaseElastic = d3.easeElastic.period(0.5)

const svg = d3.select("svg")
const glass = d3.select("#filling-wine-glass").style("cursor", "pointer")
const wine = d3.select("#wine").attr("y", fillToPercent(0))
const handle = glass.append("rect")
    .attr("x", wine.attr("x")).attr("y", fillToPercent(0))
    .attr("height", handleHeight).attr("width", wine.attr("width"))
    .attr("rx", 1).attr("ry", 1)
    .attr("fill-opacity", 0).attr("opacity", showHandle ? 1 : 0)
    .attr("stroke", "black").attr("stroke-width", 0.2).attr("stroke-dasharray", "0.5,0.5")
    .style("cursor", "grab")

const text = svg.append("text")
    .attr("x", "35").attr("y", "50%").attr("font-size", 2).attr("fill", "#000")

glass.on("mouseenter", function () {
    if(showHandle) handle.attr("opacity", 1)
})

glass.on("mouseleave", function () {
    if(showHandle) handle.attr("opacity", 0)
})

const toggleHandle = function() {
    showHandle = !showHandle
    if(showHandle) handle.attr("opacity", 1)
}

glass.on("click", function () {
    y = d3.mouse(glass.node())[1]
    y = Math.max(110, Math.min(y, 130))
    wine.transition().ease(customEaseElastic).duration(1000)
        .attr("y", y).attr("height", 130 - y + 10) // extra height to compensate for "bounce" during transition
    handle.transition().duration(1000).attr("y", y - handleHeight / 2)
    updateText(fillToPercent.invert(y))
})

const dragToFill = d3.drag()
    .on("start", function () {
        glass.style("cursor", "grabbing")
        handle.style("cursor", "grabbing")
    })
    .on("drag", function () {
        y = d3.mouse(glass.node())[1]
        y = Math.max(110, Math.min(y, 130))
        handle.attr("y", y - handleHeight / 2)
        wine.attr("height", 130 - y).attr("y", y)
        updateText(fillToPercent.invert(y))
    })
    .on("end", function () {
        glass.style("cursor", "pointer")
        handle.style("cursor", "grab")
        
    })

const updateText = function (y) {
    verdict = "A little more..."
    if (y > 35) verdict = "Perfect !"
    if (y > 50) verdict = "Whoa ! Calm down !"
    text.text(verdict)
}

handle.call(dragToFill)

const  whiteColor = "rgb(245, 245, 200)",
    redColor = "rgb(132, 38, 36)"

let currentColor = redColor

const colorSelector = svg.append("circle")
    .attr("cx", 5).attr("cy", 5)
    .attr("r", 1.5).attr("fill", whiteColor)

const colorTextSwitch = d3.select("#colorSwitch").style("color", currentColor)

const updateColor = function() {
    isWhite = currentColor == whiteColor
    colorSelector.attr("fill", currentColor)
    currentColor = isWhite ? redColor : whiteColor
    colorTextSwitch.style("color", currentColor).text(isWhite ? "red" : "white")
    wine.transition().duration(500).attr("fill", currentColor)
}

colorTextSwitch.on("click", updateColor)
colorSelector.on("click", updateColor)