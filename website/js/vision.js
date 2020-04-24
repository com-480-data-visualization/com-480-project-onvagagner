let copiedHex = ko.observable();
fetch("./data/vision.json")
  .then((resp) => resp.json())
  .then((data) => {
    console.log(data);
    ko.applyBindings(data);
  });

var selectedColor = ko.observable("red");
var selectedTint = ko.observable("");
