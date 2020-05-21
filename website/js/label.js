const label_basic = d3.select("#wine_label")//.attr("viewBox", "0 0 500 650");
const label_basic_explication_title = d3.select("#wine_label_explication_title");
const label_basic_explication_body = d3.select("#wine_label_explication_body");
const label_explanation_text_title = label_basic_explication_title.append("text").attr("x", "45%").attr("y", "20%").attr("class", "label_title").attr("font-size", "30px")
const label_explanation_text_body = label_basic_explication_body.append("text").attr("x", 0).attr("y", "20%").attr("class", "label_body").attr("font-size", "20px")

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
            .attr("x1", el.x + el.w + midLine/4).attr("y1", 20).attr("x2", 850).attr("y2", 20);

  label_basic.append("rect").attr("class", "label_hoover")
            .attr("x", el.x).attr("y", el.y)
            .attr("height", el.h).attr("width", el.w)
            .on("mouseover", () => {
              line.style("stroke-opacity", 1);
              line2.style("stroke-opacity", 1);
              line3.style("stroke-opacity", 1);
              label_explanation_text_title.text(title);
              label_explanation_text_body.text(body);
            })
            .on("mouseleave", () => {
              line.style("stroke-opacity", 0);
              line2.style("stroke-opacity", 0);
              line3.style("stroke-opacity", 0);
              label_explanation_text_title.text("");
              label_explanation_text_body.text("");
            });
}

add_element(milesime, "Milesime", "Milesime or age of the wine");
add_element(picture, "Logo", "Graphical representation of the property or logo");
add_element(chateau, "Chateau", "11");
add_element(origin, "Region of production", "qwd")
add_element(sepage, "Sepage", "wdq")
add_element(bottled, "...", "cw")
add_element(alcool, "alcool", "tize")
add_element(size_liquid, "liquid", "")