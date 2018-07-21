// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4
});

// Create a tileLayer and add it to the map
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiamVzc2ljYXBoaWxsaXBzIiwiYSI6ImNqaHZieHo3cDB3dngzcW41NTRsYjI4bGoifQ.5j5Wk3ZiUhOMmUJgLDTGfA").addTo(myMap);

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {

  // This function calculates the marker color based on the earthquake size
  function calculateColor(Size) {
    if (Size >= 5) {
      return "#f44242";
    } else if (Size >=4) {
      return "#f46242";
    } else if (Size >=3) {
      return "#f48342";
    } else if (Size >=2) {
      return "#f4cb42";
    } else if (Size >=1) {
      return "#f4f142";
    } else {
      return "#b6f442";
    }
  }

  // This function calculates the marker size based on the earthquake size
  function calculateRadius(Size) {
    if (Size === 0) {
      return 1;
    } else {
      return Size * 2;
    }
  }

  // This function is for the circle marker options
  function circleOptions(feature) {
    return{
      color: calculateColor(feature.properties.mag),
      fillColor: calculateColor(feature.properties.mag),
      fillOpacity: 1,
      radius: calculateRadius(feature.properties.mag)
    };
  } 

  //L.geoJson is used to get the lat and long which is needed for the cirlceMarker
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: circleOptions,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
  }).addTo(myMap);

  //Add legend
  //This code came from https://leafletjs.com/examples/choropleth/ with some modifications
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        colors = ["#b6f442", "#f4f142", "#f4cb42", "#f48342", "#f46242", "#f44242"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);

});