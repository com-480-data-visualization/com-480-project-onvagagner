class FillCupViz {
    constructor(svgClass, fillSvgId, grabSvgId) {
        const svg = d3.selectAll("." + svgClass)
        const glass = svg.append("g").attr("transform", "translate(-31.879 -105.47)").style("cursor", "pointer").attr("class", "basicsGlass")

        const whitePalette = { "wine": "rgb(222, 215, 130)", "text": "white", "textColor": "rgb(222, 215, 130)" },
            redPalette = { "wine": "rgb(132, 38, 36)", "text": "red", "textColor": "rgb(255,100,100)" },
            bgColor = "white"

        let currentPalette = redPalette

        const fillToPercent = d3.scaleLinear()
            .domain([0, 100])
            .range([130, 110])

        glass.append("path").attr("d", "m46.713 108.1-3.638 12.634c-0.2182 0.75777 0.15168 1.5488 0.6151 2.2542 0.57978 0.8824 1.2936 1.6018 2.2098 2.1084 1.5498 0.85692 3.1342 1.7152 4.614 2.6786 0.32835 0.23772 0.98746 0.80744 1.0504 1.4932 0.20259 2.2081 0.10791 4.4561 0.18222 6.6807 0.0244 2.0105 0.24687 4.0362 0.10086 6.0354-0.07063 0.96709-0.5616 1.8503-1.1717 2.5929-0.40356 0.49125-0.91915 0.8206-1.7137 0.96145-0.93382 0.16555-1.7529 0.17531-2.6538 0.3605-0.47616 0.0979-0.48577 0.48148-0.14227 0.61496 2.3617 0.91776 4.5347 0.82628 6.8916 0.78896 1.4619-0.0232 2.9639 0.0988 4.3861-0.20936 0.48318-0.10471 1.6431-0.33629 1.3247-0.74533-0.21307-0.2737-0.67761-0.38614-0.98232-0.47097-0.92795-0.25832-2.0041-0.19134-2.8867-0.5636-0.57712-0.24345-1.01-0.66304-1.3463-1.223-0.40393-0.67263-0.75454-1.4364-0.75454-2.2088v-12.549c0-1.1437 1.4016-1.8062 2.4299-2.3685 1.6518-0.90333 3.3482-1.7809 4.8378-2.9225 0.57956-0.44418 0.99677-1.0547 1.183-1.8048 0.18125-0.73007 0.229-1.5186 0.07974-2.2426-0.4556-2.21-1.2957-4.3269-1.9185-6.4967l-1.651-5.3976s-1.3724-0.42027-2.0814-0.50266c-2.3497-0.27305-4.7491-0.25347-7.0964 0.0396-0.63676 0.0795-1.8686 0.46299-1.8686 0.46299z")
            .attr("fill", "#dcdcdc")

        glass.append("path").attr("d", "m47.685 108.36c3.02 0.41199 6.1314 0.4137 9.1513 0.0331l0.0744 0.14883c-3.0787 0.45217-6.2016 0.41301-9.3596-0.0165z")
            .attr("fill", "#b1b1b1").attr("fill-opacity", 0.39216)

        const wine = glass.append("rect").attr("x", 42.871).attr("y", fillToPercent(0)).attr("width", 18.672).attr("height", 0)
            .attr("fill", currentPalette.wine).style("paint-order", "normal").attr("class", "basicsWine")

        glass.append("path").attr("d", "m47.634 108.57s-2.6807 8.4008-2.6128 12.733c-0.01956 2.0105 1.1833 2.9494 2.9104 3.8695-1.2517-1.2815-1.6201-2.4471-1.5214-4.068 0.2348-4.1626 1.6206-12.402 1.6206-12.402")
            .attr("fill", "#fff").attr("fill-opacity", 0.39216)

        const background = glass.append("path").attr("d", "m41.893 105.42v43.259h20.902v-43.259zm4.7465 2.6608s3.4961-0.65621 5.2652-0.66692c1.9562-0.0119 5.8308 0.66692 5.8308 0.66692l1.6676 5.4307c0.62272 2.1698 1.4626 4.2868 1.9182 6.4968 0.14925 0.72402 0.10166 1.5127-0.0796 2.2428-0.18623 0.75012-0.59071 1.3773-1.1829 1.8045-2.0786 1.4997-3.3467 2.2141-4.8379 2.9228-2.3187 1.102-2.4298 2.3683-2.4298 2.3683-0.0163-0.49384-1.4016-0.70883-1.234-0.0646 0.0359 0.13819-0.21865-0.98074-1.0857-1.4697-1.4797-0.96342-3.0293-1.8452-4.5791-2.7022-0.91617-0.50657-1.6299-1.226-2.2097-2.1084-0.46342-0.70532-0.82896-1.4952-0.61495-2.2541z")
            .attr("fill", bgColor).style("paint-order", "normal")

        glass.append("path").attr("d", "m51.548 129.4c0.20259 2.2081 0.10791 4.4561 0.18222 6.6807 0.0244 2.0105 0.24687 4.0362 0.10086 6.0354-0.07063 0.96708-0.5616 1.8503-1.1717 2.5929-0.40356 0.49125-0.91915 0.8206-1.7137 0.96144-0.93382 0.16555-1.7529 0.17531-2.6538 0.3605-0.47616 0.0979-0.48577 0.48149-0.14227 0.61496 2.3617 0.91777 4.5347 0.82629 6.8916 0.78897 1.4619-0.0232 2.9639 0.0988 4.3861-0.20937 0.48318-0.1047 1.6431-0.33628 1.3247-0.74532-0.21307-0.27371-0.67761-0.38615-0.98232-0.47097-0.92795-0.25832-2.0041-0.19135-2.8867-0.56361-0.57712-0.24344-1.01-0.66303-1.3463-1.223-0.40393-0.67263-0.75454-1.4364-0.75454-2.2088v-12.549c0.23219-0.81607-1.3952-1.008-1.2342-0.0647z")
            .attr("fill", "#dcdcdc")

        glass.append("path").attr("d", "m57.759 125.6c-4.4244 2.3977-4.8714 2.5323-4.9777 4.136-0.35991-0.25006-0.84518-0.31-1.203 0.0122-0.2008-1.638-0.68048-1.7222-4.4553-3.9419 4.0545 1.9005 6.1772 1.9771 10.636-0.20626z")
            .attr("fill", "#050505").attr("fill-opacity", 0.19608)

        glass.append("path").attr("d", "m51.36 144.91c-0.0688 0.0769-0.14173 0.11755-0.14173 0.11755 0.87785 0.44968 1.714 0.4621 2.5054 5e-3l-0.14549-0.0866c-0.6567 0.27683-1.3576 0.31018-2.2182-0.0359z")
            .attr("fill", "#b1b1b1").attr("fill-opacity", 0.39216)

        ///////////////////////
        /////// FILLING ///////
        ///////////////////////
        const fillingGlass = d3.select("#" + fillSvgId).select(".basicsGlass")

        const handleHeight = 2
        const handle = fillingGlass.append("rect")
            .attr("x", wine.attr("x")).attr("y", fillToPercent(0))
            .attr("height", handleHeight).attr("width", wine.attr("width"))
            .attr("fill-opacity", 0).attr("opacity", 0)
            .style("cursor", "grab")

        const customEaseElastic = d3.easeElastic.period(0.5)

        const text = d3.select("#" + fillSvgId).append("text")
            .attr("x", "35").attr("y", "50%").attr("font-size", 2).attr("fill", "#000")

        const updateText = function (y) {
            let verdict = "A little more..."
            if (y > 35) verdict = "Perfect !"
            if (y > 50) verdict = "Whoa ! Calm down !"
            text.text(verdict)
        }

        fillingGlass.on("click", function () {
            let y = d3.mouse(fillingGlass.node())[1]
            y = Math.max(110, Math.min(y, 130))
            wine.transition().ease(customEaseElastic).duration(1000)
                .attr("y", y).attr("height", 130 - y + 10) // extra height to compensate for "bounce" during transition
            handle.transition().duration(1000).attr("y", y - handleHeight / 2)
            updateText(fillToPercent.invert(y))
        })

        const dragToFill = d3.drag()
            .on("start", function () {
                fillingGlass.style("cursor", "grabbing")
                handle.style("cursor", "grabbing")
            })
            .on("drag", function () {
                let y = d3.mouse(fillingGlass.node())[1]
                y = Math.max(110, Math.min(y, 130))
                handle.attr("y", y - handleHeight / 2)
                wine.attr("height", 130 - y).attr("y", y)
                updateText(fillToPercent.invert(y))
            })
            .on("end", function () {
                fillingGlass.style("cursor", "pointer")
                handle.style("cursor", "grab")

            })

        handle.call(dragToFill)

        const colorTextSwitch = d3.select("#colorSwitch").style("color", currentPalette.text)

        const updateColor = function () {
            currentPalette = currentPalette == whitePalette ? redPalette : whitePalette
            colorTextSwitch
                .style("color", currentPalette.textColor)
                .text(currentPalette.text)
            wine.transition().duration(500).attr("fill", currentPalette.wine)
        }

        colorTextSwitch.on("click", updateColor)

        ///////////////////////
        /////// GRABBING //////
        ///////////////////////
        const grabGlass = d3.select("#" + grabSvgId).select(".basicsGlass")
        const grabHandle1 = grabGlass.append("rect").attr("class", "handle")
            .attr("x", wine.attr("x")).attr("y", fillToPercent(110))
            .attr("height", 20).attr("width", wine.attr("width")).on("mouseover", () => grabText.text("Don't warm the wine"))
        const grabHandle2 = grabGlass.append("rect").attr("class", "handle")
            .attr("x", wine.attr("x")).attr("y", fillToPercent(0))
            .attr("height", 12).attr("width", wine.attr("width")).on("mouseover", () => grabText.text("Good job !"))
        const grabHandle3 = grabGlass.append("rect").attr("class", "handle")
            .attr("x", wine.attr("x")).attr("y", fillToPercent(-70))
            .attr("height", 4).attr("width", wine.attr("width")).on("mouseover", () => grabText.text("It's gonna fall..."))
            
        grabGlass.selectAll(".handle").on("mouseleave", () => grabText.text(""))
        const grabText = d3.select("#" + grabSvgId).append("text").attr("x", 35).attr("y", "50%")
    }
}

const fillingviz = new FillCupViz("basicsviz", "basicsviz1", "basicsviz2")