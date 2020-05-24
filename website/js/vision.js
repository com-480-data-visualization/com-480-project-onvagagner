fetch("./data/vision.json")
  .then((resp) => resp.json())
  .then((data) => {
    ko.applyBindings(data);
  });

const hueGenerator = (color) => {
  //console.log(color);
  const r = parseInt(color.substr(1, 2), 16); // Grab the hex representation of red (chars 1-2) and convert to decimal (base 10).
  const g = parseInt(color.substr(3, 2), 16);
  const b = parseInt(color.substr(5, 2), 16);
  // console.log("r " + r + " g " + g + " b " + b);
  const hsl = rgbToHsl(r, g, b);
  //console.log("hsl " + hsl);
  const [hue, saturation, lightness] = hsl;
  const hueVariations = [
    saturation - 0.5,
    saturation - 0.3,
    saturation + 0.3,
    saturation + 0.5,
  ];
  const shades = [
    lightness - 0.2,
    lightness - 0.1,
    lightness + 0.1,
    lightness + 0.2,
  ];
  const colorVariations = hueVariations.map((h) => hslToRgb(hue, h, lightness));
  const shadesVariations = shades.map((sh) => hslToRgb(hue, saturation, sh));
  const variationDiv = document.getElementById("color-variations");
  const shadesDiv = document.getElementById("color-shades");
  variationDiv.innerHTML = "";
  shadesDiv.innerHTML = "";
  colorVariations.map((c) => {
    // console.log(c);
    var li = document.createElement("li");
    li.style.backgroundColor = "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
    variationDiv.append(li);
  });
  shadesVariations.map((sh) => {
    // console.log(sh);
    var li = document.createElement("li");
    li.style.backgroundColor = "rgb(" + sh[0] + "," + sh[1] + "," + sh[2] + ")";
    shadesDiv.append(li);
  });
};

let selectedColor = ko.observable("red");
let selectedTint = ko.observable("");
selectedTint.subscribe(function (newTint) {
  hueGenerator(newTint.hex);
});

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r, g, b) {
  (r /= 255), (g /= 255), (b /= 255);

  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h, s, l];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r * 255, g * 255, b * 255];
}
