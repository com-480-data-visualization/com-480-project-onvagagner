const label_basic = d3.select("#wine_label").attr("viewBox", "0 0 550 450");
const label_basic_explication = d3.select("#wine_label_explication");

milesime = {x: 215, y: 236.5, h: 33, w: 70};
picture = {x: 120, y: 57.85, h: 168, w: 255};


const milesime_line =  label_basic.append('line').attr("class", "label_hoover_line")
            .attr("x1", milesime.x + (milesime.w / 2)).attr("y1", milesime.y + milesime.h).attr("x2", milesime.x + (milesime.w / 2)).attr("y2", 450);

label_basic.append("rect").attr("class", "label_hoover")
            .attr("x", milesime.x).attr("y", milesime.y)
            .attr("height", milesime.h).attr("width", milesime.w)
            .on("mouseover", () => {
              milesime_line.style("stroke-opacity", 1);
              label_explanation_text.text("Milesime or age of the wine");
            })
            .on("mouseleave", () => {
              milesime_line.style("stroke-opacity", 0);
              label_explanation_text.text("");
            });

const logo_line =  label_basic.append('line').attr("class", "label_hoover_line")
                    .attr("x1", picture.x + (picture.w / 2)).attr("y1", picture.y + picture.h).attr("x2", picture.x + (picture.w / 2)).attr("y2", 450);
            
label_basic.append("rect").attr("class", "label_hoover")
            .attr("x", picture.x).attr("y", picture.y)
            .attr("height", picture.h).attr("width", picture.w)
            .on("mouseover", () => {
                logo_line.style("stroke-opacity", 1);
                label_explanation_text.text("Graphical representation of the property or logo");
            })
            .on("mouseleave", () => {
                logo_line.style("stroke-opacity", 0);
                label_explanation_text.text("");
            });

const label_explanation_text = label_basic_explication.append("text").attr("x", 0).attr("y", "20%").attr("font-size", "20px")