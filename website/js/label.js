const label_basic = d3.select("#wine_label")//.attr("viewBox", "0 0 500 650");
const label_basic_explication_title = d3.select("#wine_label_explication_title");
const label_basic_explication_body = d3.select("#wine_label_explication_body");
const label_explanation_text_title = label_basic_explication_title.append("text").attr("class", "label_title").attr("font-size", "1.5rem")
const label_explanation_text_body = label_basic_explication_body.append("text").attr("x", 0).attr("y", 0).attr("class", "label_body").attr("font-size", "1rem")


chateau = { x: 115, y: 7, h: 45, w: 355 };
picture = { x: 172, y: 66, h: 180, w: 258 };
milesime = { x: 265, y: 265, h: 33, w: 70 };
origin = { x: 240, y: 332, h: 23.5, w: 120 };
sepage = { x: 250, y: 375, h: 20, w: 100 };
bottled = { x: 145, y: 412, h: 48, w: 310 };
alcool = { x: 45, y: 475, h: 25, w: 115 };
size_liquid = { x: 500, y: 475, h: 25, w: 60 };

function computeLinePath(el) {
  const start = { x: el.x + el.w + 10, y: el.y + (el.h / 2)},
    end = { x: 680, y: 140 },
    mid1 = { x: 600, y: start.y },
    mid2 = { x: mid1.x, y: end.y }

  let rx = 10
  rx = (start.y - end.y < rx) ? rx / 2 : rx

  let higher = (start.y < end.y)
  let i = higher ? -1 : 1

  return 'M ' + start.x + ' ' + (start.y+1)
    + ' A ' + 5 + ' ' + 5 + ' 0 1 1 ' + start.x + ' ' + start.y // circle at beginning
    + ' L ' + (mid1.x - rx) + ' ' + mid1.y
    + ' A ' + rx + ' ' + rx + ' 0 0 ' + (1 - (i+1)/2) + ' ' + mid1.x + ' ' + (mid1.y - i*rx)
    + ' L ' + mid2.x + ' ' + (mid2.y + i*rx)
    + ' A ' + rx + ' ' + rx + ' 0 0 ' + ((i+1)/2) + ' ' + (mid2.x + rx) + ' ' + mid2.y
    + ' L ' + end.x + ' ' + end.y
    + ' A ' + 5 + ' ' + 5 + ' 0 1 1 ' + end.x + ' ' + (end.y+1) // circle at end
};

function initializeLinePath(path) {
  var lineLength = path.node().getTotalLength();
  path.style("stroke-dasharray", lineLength);
  path.style("stroke-dashoffset", lineLength);
}

function add_element(el, title, body) {

  const line = label_basic.append("path").attr("class", "label_hoover_line")
    .attr("d", computeLinePath(el))
  initializeLinePath(line);

  label_basic.append("rect").attr("class", "label_hoover")
    .attr("x", el.x).attr("y", el.y).attr("rx", 10)
    .attr("height", el.h).attr("width", el.w)
    .on("mouseenter", () => {
      if (firefox) line.style("stroke-dashoffset", 0).style("stroke-opacity", 1)
      else line.style("stroke-opacity", 1).transition().duration(1000).style("stroke-dashoffset", 0)
      label_explanation_text_title.text(title);
      label_explanation_text_body.text(body).call(wrap, 400);
    })
    .on("mouseleave", () => {
      if (firefox) line.style("stroke-dashoffset", line.node().getTotalLength()).style("stroke-opacity", 0);
      else line.transition().style("stroke-dashoffset", line.node().getTotalLength()).style("stroke-opacity", 0);
      label_explanation_text_title.text("");
      label_explanation_text_body.text("");
    });
}

add_element(milesime, "Millesime", "Millesime or age of the wine. Contrary to popular belief, the millesime mention is not compulsary on a label. For a producer to add this mention, he need to proove that the wine is composed of at least 85% of wine grapes that have been harvest this year (this is known as the 85/15 rule).");
add_element(picture, "Logo", "Graphical representation of the property or logo. This mention is not compulsary but is added to make the label more appealing!");
add_element(chateau, "Producer or Name", "Most of the times, this indicates who produced and made the wine. In french wine, the producer can add some naming to its name (such as Chateau or Domaine) that involve a certain standard. Sometimes, it can correspond to a brand (common for US wine) and is associated with a vintage instead of a producer. Note that the producer is also very often found at the bottom of the label.");
add_element(origin, "Region of production", "The region indicates from where the grapes were harvest to produce the wine. The mention can be as precise as a specific vineyard but also as large as a region. As a rule of thumb, the more narrow is the origin of the grapes, the higher the quality and the price will be.")
add_element(sepage, "Variety", "Indicates which wine variety as been used to produce the wine. Like the millesime, this mention is not compulsary and need to respect the 85/15 rule in order add a single wine variety on the label (ie. at least 85% of the grapes needs to come from the mentionned variety). Variation of the 85/15 rule exists to allow the mention of multiple variety.")
add_element(bottled, "Bottler", "Name and/or the contact details of the bottler. This mention is almost always at the bottom of the label and is compulsary. There exists a special mention if the wine producer is also the bottler then the mention will be Bottled in property, or something similar. This special mention implies that the wine has not been moved from the production site to the bottling site. This mention is important to control the production chain of the bottle.")
add_element(alcool, "ABV", "This indicates the Alcohol by Volume (ABV) of the wine. The alcohol level indicates how rich the wine may taste. In general, a wine is between 8.5% and 15%, and there is a tolerance of +/- 0.5% on the number.")
add_element(size_liquid, "Bottle capacity with the unit")


function wrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      x = text.attr("x"),
      y = text.attr("y"),
      dy = 0, //parseFloat(text.attr("dy")),
      tspan = text.text(null)
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}