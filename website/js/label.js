const label_basic = d3.select("#wine_label")//.attr("viewBox", "0 0 500 650");
const label_basic_explication = d3.select("#wine_label_explication");
const label_explanation_text = label_basic_explication.append("text").attr("x", 0).attr("y", "20%").attr("font-size", "20px").attr("text-align", "center")

milesime = {x: 215, y: 236.5, h: 33, w: 70};
picture = {x: 120, y: 57.85, h: 168, w: 255};
chateau = {x: 82.5, y: 6.42, h: 45, w: 320};
origin = {x: 195, y: 300, h: 25.5, w: 110};
sepage = {x: 205, y: 335, h: 20, w: 90};
bottled = {x: 109, y: 365, h: 48, w: 285};
alcool = {x: 10, y: 425, h: 25, w: 110};
size_liquid = {x: 430, y: 425, h: 25, w: 60};


function add_element(el, text_to_add) {
  const line = label_basic.append('line').attr("class", "label_hoover_line")
            .attr("x1", el.x + (el.w / 2)).attr("y1", el.y + el.h).attr("x2", el.x + (el.w / 2)).attr("y2", 470);

  label_basic.append("rect").attr("class", "label_hoover")
            .attr("x", el.x).attr("y", el.y)
            .attr("height", el.h).attr("width", el.w)
            .on("mouseover", () => {
              line.style("stroke-opacity", 1);
              label_explanation_text.text(text_to_add);
            })
            .on("mouseleave", () => {
              line.style("stroke-opacity", 0);
              label_explanation_text.text("");
            });
}

add_element(milesime, "Milesime or age of the wine");
add_element(picture, "Graphical representation of the property or logo");
add_element(chateau, "Chateau");
add_element(origin, "Region of production")
add_element(sepage, "Sepage")
add_element(bottled, "...")
add_element(alcool, "alcool")
add_element(size_liquid, "liquid")