const label_basic = d3.select("#wine_label")//.attr("viewBox", "0 0 500 650");
const label_basic_explication_title = d3.select("#wine_label_explication_title");
const label_basic_explication_body = d3.select("#wine_label_explication_body");
const label_explanation_text_title = label_basic_explication_title.append("text").attr("x", "20%").attr("y", "20%").attr("class", "label_title").attr("font-size", "30px")
const label_explanation_text_body = label_basic_explication_body.append("text").attr("x", "10%").attr("y", "10%").attr("class", "label_body").attr("font-size", "20px")


chateau = {x: 115, y: 7, h: 45, w: 355};
picture = {x: 172, y: 66, h: 180, w: 258};
milesime = {x: 265, y: 265, h: 33, w: 70};
origin = {x: 240, y: 332, h: 23.5, w: 120};
sepage = {x: 250, y: 375, h: 20, w: 100};
bottled = {x: 145, y: 412, h: 48, w: 310};
alcool = {x: 45, y: 475, h: 25, w: 115};
size_liquid = {x: 500, y: 475, h: 25, w: 60};


function add_element(el, title, body) {
  const midLine = 830 - (el.x + el.w);
  const line = label_basic.append('line').attr("class", "label_hoover_line")
            .attr("x1", el.x + el.w).attr("y1", el.y + (el.h / 2)).attr("x2", el.x + el.w + midLine/4).attr("y2", el.y + (el.h / 2));
  const line2 = label_basic.append('line').attr("class", "label_hoover_line")
            .attr("x1", el.x + el.w + midLine/4).attr("y1", el.y + (el.h / 2)).attr("x2", el.x + el.w + midLine/4).attr("y2", 20);
  const line3 = label_basic.append('line').attr("class", "label_hoover_line")
            .attr("x1", el.x + el.w + midLine/4).attr("y1", 20).attr("x2", 700).attr("y2", 20);

  label_basic.append("rect").attr("class", "label_hoover")
            .attr("x", el.x).attr("y", el.y)
            .attr("height", el.h).attr("width", el.w)
            .on("mouseover", () => {
              line.style("stroke-opacity", 1);
              line2.style("stroke-opacity", 1);
              line3.style("stroke-opacity", 1);
              label_explanation_text_title.text(title);
              label_explanation_text_body.text(body).call(wrap, 400);
            })
            .on("mouseleave", () => {
              line.style("stroke-opacity", 0);
              line2.style("stroke-opacity", 0);
              line3.style("stroke-opacity", 0);
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