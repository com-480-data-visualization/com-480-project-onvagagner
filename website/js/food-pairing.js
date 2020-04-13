d3.csv("./data/food_pairing.csv", function (d) {
    return [d.WineType, d.Food, +1]
}).then(function (data) {
    const colors = {
        "Dry White": "#e5ecb8",
        "Sweet White": "#fecf03",
        "Rich White": "#fdda7c",
        "Sparkling": "#dedede",
        "Light Red": "#d20331",
        "Medium Red": "#87032b",
        "Bold Red": "#511322",
        "Dessert": "#c94f04"
    }

    function sortPrimary() {
        const wineTypes = [
            "Dry White",
            "Sweet White",
            "Rich White",
            "Sparkling",
            "Light Red",
            "Medium Red",
            "Bold Red",
            "Dessert"
        ]
        return (a, b) => d3.ascending(wineTypes.indexOf(a), wineTypes.indexOf(b))
    }

    function sortSecondary() {
        const foodOrder = [
            "Vegetables",
            "Roasted Vegetables",
            "Soft Cheese",
            "Hard Cheese",
            "Starches",
            "Fish",
            "Rich Fish",
            "White Meat",
            "Red Meat",
            "Cured Meat",
            "Sweets"
        ]
        return (a, b) => d3.ascending(foodOrder.indexOf(a), foodOrder.indexOf(b))
    }

    var bP = viz.biPartite()
        .width(300)
        .height(400)
        .barSize(10)
        .pad(5)
        .duration(1000)
        .fill(d => colors[d.primary])
        .sortPrimary(sortPrimary())
        .sortSecondary(sortSecondary())
        .data(data)

    d3.select("g").call(bP)
})