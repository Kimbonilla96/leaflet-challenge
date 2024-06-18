// Stores the API endpoint in a variable
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";



// Get request to the query URL
d3.json(queryUrl).then(function(data) {
    createFeatures(data.features);
});

// Return color for depth of earthquake
function depthColor(depth) {
  
    return  depth > 500 ? '#DE9438' :
            depth > 400 ? '#DA9C34' :
            depth > 300 ? '#D5A431' :
            depth > 200 ? '#CFAC30' :
            depth > 160 ? '#C8B432' :
            depth > 140 ? '#C0BC36' :
            depth > 120 ? '#B7C33D' :
            depth > 100 ? '#ADCB46' :
            depth > 80 ? '#A2D250' :
            depth > 60 ? '#96D95D' :
            depth > 40 ? '#88DF6A' :
            depth > 20 ? '#79E679' :
                        '#68EC89'
}

// Function to create features for the earthquake data
function createFeatures(earthquakeData) {
    // Function to define what happens for each feature (each earthquake data point)
    function onEachFeature_func(feature, layer) {
        // Bind a popup to each layer (each earthquake feature) with information about the earthquake
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>
        <p>Earthquake Magnitude: ${feature.properties.mag}</p>
        <p>Earthquake Depth: ${feature.geometry.coordinates[2]} Km</p>
        <p>${new Date(feature.properties.time)}</p>`);
    }

// A GeoJSON layer that pulls the information from the earthquakeData object to style the markers
    let earthquakes = L.geoJSON(earthquakeData, {
        // This option specifies a function to run for each feature in the GeoJSON layer.
        // Here, the function binds popups to each feature.
        onEachFeature: onEachFeature_func,
        // This option converts each point feature in the GeoJSON to a circle marker on the map.
       // The function defines how each marker should be styled.
        pointToLayer: function (feature, latlng){
        // Creates a circle marker with specific styling options for each earthquake feature.
        // The marker's radius is proportional to the earthquake's magnitude.
        // The fill color and stroke color of the marker depend on the earthquake's depth.
        return L.circleMarker(latlng, {
            radius: feature.properties.mag * 2,
            fillColor: depthColor(feature.geometry.coordinates[2]),
            color: depthColor(feature.geometry.coordinates[2]),
            opacity: 0.9,
            fillOpacity: 0.9
            });
        }
    });

// Call the createMap function, passing in the earthquakes layer to add it to the map
createMap(earthquakes);
}

// Function to create a map and add the earthquake layer to it
function createMap(earthquakes){
    // Create the street map base layer using OpenStreetMap tiles
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })


    // Create the map object with a specified HTML element ID and options
    let myMap = L.map("map", {
        center: [
            27.2630903, 55.5808497
        ],
        zoom: 2,
        layers: [street, earthquakes]
    });

// legend code was derived from the leafletjs documentation found linked in the classwork 
// sets legend placement
    let legend = L.control({position: 'bottomright'});
    
    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend'),
            depthRanges = [0, 20, 40, 60, 80, 100, 120, 140, 160, 200, 300, 400, 500],
            labels = [];

        // Loop through our depth intervals and generate a label with a colored square for each interval
        for (let i = 0; i < depthRanges.length; i++) {
            div.innerHTML +=
                '<i style="background:' + depthColor(depthRanges[i] + 1) + '"></i> ' +
                depthRanges[i] + (depthRanges[i + 1] ? '&ndash;' + depthRanges[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(myMap);

}