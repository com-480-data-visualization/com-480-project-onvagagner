
d3.json("./data/winefolly_aroma.json", function (d) { 
    return d
}).then(function (data) {
    var width = 700,height = 500;

    var simulation = d3.forceSimulation()
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05))
        .force("collide", d3.forceCollide(function(d) {
            return 20
        }))
    
    var svg = d3.select("#smell-viz")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        //.append("g")
        //.attr("transform", "translate(0,0)");

    function getColor(d) {
        if (d.packageName == "Primary Aroma") {
            return "#722f37"
        } else if (d.packageName == "Secondary Aroma") {
            return "lightred"
        } else if (d.packageName == "Tertiary Aroma") {
            return "lightgreen"
        }else if (d.packageName == "Faults & Other") {
            return "lightyellow"
        }
        return "orange"
    }

    function classes(root) {
        var classes = [];
    
        function recurse(name, node, level) {
            if (node.children) {
                classes.push({
                    level : level,
                    packageName: name,
                    className: node.name,
                    value: 10});
                node.children.forEach(function (child) {
                recurse(node.name, child, level + 1);
                });
            } else classes.push({
                level : level,
                packageName: name,
                className: node.name,
                value: 20
            });
        }
    
        recurse(null, root, 0);
        return {
            children: classes
        };
    }

    data = classes(data).children;

    function changeFocusBubble(focus) {
        console.log("WESH : " + focus)

        new_data = data.filter(d => d.level == 2);
        if (focus != "all") {
            new_data = data.filter(d => d.packageName == focus)
        }

        console.log(new_data)


        var circles = svg.select("g").selectAll("circle").data(new_data) ;

        circles.exit().remove();

    
        console.log(circles)

        circles.enter()
            .append("circle")
            .attr("cx", width/2)
            .attr("r", function(d) {
                return 20 //radiusScale(quelquechose)
            })
            .attr("fill", function(d) {
                return getColor(d)
            })
            .on("click", function(d) {
                console.log(d)
            })
        


        //update all circles to new positions
        var simulation = d3.forceSimulation(new_data)
            //.force('charge', d3.forceManyBody().strength(5))
            //.force('center', d3.forceCenter(width / 2, height / 2))
            .force('x', d3.forceX(width/2))
            .force('y', d3.forceY(height/2))
            .force('collision', d3.forceCollide().radius(20))
            .on('tick', function(d) {
                circles.attr("cx", function(d) {return d.x})
                .attr("cy", function(d) {return d.y})
            })

        /*
        // capture the enter selection
        var nodeEnter = node.enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
            });

        // re-use enter selection for circles
        nodeEnter
            .append("circle")
            .attr("r", function(d) {
            return d.r;
            })
            .style("fill", "#722f37" function(d, i) {
            return color(i);
            })

        // re-use enter selection for titles
        nodeEnter
            .append("title")
            .text(function(d) {
            return d.className;
            });

        node.select("circle")
            .transition().duration(1000)
            .attr("r", function(d) {
            return d.r;
            })
            .style("fill", function(d, i) {
            return color(i);
            });

        node.transition().attr("class", "node")
            .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
            });*/

    }
            

    d3.select("#allSwitch").on("click",function() {
        changeFocusBubble("all")
    });
    d3.select("#primarySwitch").on("click",function() {
        changeFocusBubble("Primary Aroma")
    });
    d3.select("#secondarySwitch").on("click",function() {
        changeFocusBubble("Secondary Aroma")
    });
    d3.select("#tertiarySwitch").on("click",function() {
        changeFocusBubble("Tertiary Aroma")
    });
    d3.select("#otherSwitch").on("click",function() {
        changeFocusBubble("Fault and Other")
    });



    //Input domain 1-10 -> rayon des cercles 10-80
    var radiusScale = d3.scaleSqrt().domain([1,10]).range([10,80])

    data_initial = data.filter(d => d.level == 2);

    console.log(data)

    /*var circles = svg.append("g").selectAll("circle")
        .data(data_initial)
        .enter()
        .append("circle")
        .attr("r", function(d) {
            return 20 //radiusScale(quelquechose)
        })
        .attr("fill", function(d) {
            return getColor(d)
        })
        .on("click", function(d) {
            console.log(d)
        })*/

    var elem = svg.selectAll("g")
        .data(data_initial)

    var elemEnter = elem.enter()
	    .append("g")
	    //.attr("transform", function(d){return "translate("+d.x+",80)"})

    /*Create the circle for each block */
    var circle = elemEnter.append("circle")
        .attr("stroke","black")
        .attr("r", function(d) {
            return 40 //radiusScale(quelquechose)
        })
        .attr("fill", function(d) {
            return getColor(d)
        })
        .on("click", function(d) {
            console.log(d)
        })
 
    /* Create the text for each block */
    var text = elemEnter.append("text")
	    .attr("dx", function(d){return -20})
	    .text(function(d){return d.className})
    
    //simulation.nodes(data_initial).on('tick', ticked)
    var simulation = d3.forceSimulation()
        .force('x', d3.forceX(width/2))
        .force('y', d3.forceY(height/2))
        .force('collision', d3.forceCollide().radius(40))
        .on('tick', function(d) {
            circle.attr("cx", function(d) {return d.x})
                .attr("cy", function(d) {return d.y})
                text.attr("cx", function(d) {return d.x})
                .attr("cy", function(d) {return d.y})
        })

    simulation.nodes(data_initial)

})