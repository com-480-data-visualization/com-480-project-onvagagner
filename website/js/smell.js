d3.csv("./data/winefolly_aroma.csv", function (d) {
    return [d.Type,d.Group,d.Flavor]
}).then(function (data) {
    console.log(data)
   
    d3.select("g")
})