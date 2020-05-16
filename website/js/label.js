const label_basic = d3.select("#wine_label").attr("viewBox", "0 0 550 450");
const label_basic_explication = d3.select("#wine_label_explication");

image = {x: 143.63, y: 130.71, h: 142.86, w: 277.71};

const logo_line =  label_basic.append('line').attr("class", "label_hoover_line")
            .attr("x1", image.x + (image.w / 2)).attr("y1", image.y + image.h).attr("x2", image.x + (image.w / 2)).attr("y2", 450);

label_basic.append("rect").attr("class", "label_hoover")
            .attr("x", image.x).attr("y", image.y)
            .attr("height", image.h).attr("width", image.w)
            .on("mouseover", () => {
              logo_line.style("stroke-opacity", 1);
              label_explanation_text.text("Graphical representation of the property or logo");
            })
            .on("mouseleave", () => {
              logo_line.style("stroke-opacity", 0);
              label_explanation_text.text("");
            });

const label_explanation_text = label_basic_explication.append("text").attr("x", 0).attr("y", "20%").attr("font-size", "20px")