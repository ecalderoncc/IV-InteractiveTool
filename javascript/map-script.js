mapboxgl.accessToken = 'pk.eyJ1IjoiZWNhbGRlcm9uY2FwIiwiYSI6ImNrZXZnOTdyeDAwNGQydW1mZTJwaDd6Y3MifQ.QEdcAlKuk8k-frHsdH5XYw';
var defaultMapCenter = [144.944, -37.813];
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/ecalderoncap/ckgg2cdaj3cob19r51idm58qa',
  center: defaultMapCenter,
  zoom: 12
});

var locations = {
  'poi': {
    bearing: 27,
    center: [144.952781, -37.809443],
    zoom: 15.5,
    pitch: 20
  },
  'metro-train-station': {
    duration: 6000,
    center: [144.999436, -37.780991],
    bearing: 150,
    zoom: 15,
    pitch: 0
  }
};

window.onscroll = function() {
  var locationNames = Object.keys(locations);
  for (var i = 0; i < locationNames.length; i++) {
    var locationName = locationNames[i];
    if (isElementOnScreen(locationName)) {
      setActiveLocation(locationName);
      break;
    }
  }
};

var activeLocationName = 'poi';

function setActiveLocation(locationName) {

  if (locationName === activeLocationName) return;

  map.setLayoutProperty(locationName, 'visibility', 'visible');

  map.setLayoutProperty(activeLocationName, 'visibility', 'none');

  map.flyTo(locations[locationName]);

  document.getElementById(locationName).setAttribute('class', 'active');
  document.getElementById(activeLocationName).setAttribute('class', '');

  activeLocationName = locationName;

}

function isElementOnScreen(id) {
  var element = document.getElementById(id);
  var bounds = element.getBoundingClientRect();
  return bounds.top < window.innerHeight && bounds.bottom > 0;
}

map.on('load', function() {

  map.loadImage(
    'https://raw.githubusercontent.com/ruofzhang/GEOM90007-2020-SM2-Assignment-3/main/map-marker.png',
    function(error, image) {
      if (error) throw error;
      map.addImage('custom-marker', image);

      var poiDataUrl = 'https://raw.githubusercontent.com/ruofzhang/GEOM90007-2020-SM2-Assignment-3/main/Landmarks_and_places_of_interest.geojson';
      map.addSource('src-poi', {
        type: 'geojson',
        data: poiDataUrl
      });

      // Add a symbol layer
      map.addLayer({
        'id': 'poi',
        'type': 'symbol',
        'source': 'src-poi',
        'layout': {
          'icon-image': 'custom-marker',
          'visibility': 'visible'
        }
      });
    }
  );

  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  map.on('mouseenter', 'poi', function(e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties["Sub Theme"] + ': ' + e.features[0].properties["Feature Name"];

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML(description).addTo(map);
  });

  map.on('mouseleave', 'poi', function() {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });


  map.addSource('src-melbourne-municipal-boundary', {
    type: 'vector',
    url: 'mapbox://ruofzhang.3amxkibp'
  });
  map.addLayer({
    'id': 'melbourne-municipal-boundary',
    'type': 'line',
    'source': 'src-melbourne-municipal-boundary',
    'source-layer': 'Municipal_boundary-466kos',
    'paint': {
      'line-color': '#ff69b4',
      'line-width': 2
    }
  });

  map.addSource('src-metro-train-station', {
    type: 'vector',
    url: 'mapbox://ruofzhang.ckgadkhf106bw2fmtyf7df4f8-56k84'
  });
  map.addLayer({
    'id': 'metro-train-station',
    'type': 'circle',
    'source': 'src-metro-train-station',
    'source-layer': 'Metro_Train_Stations_with_Access',
    'layout': {
      // make layer visible by default
      'visibility': 'none'
    },
    'paint': {
      'circle-radius': 8,
      'circle-color': 'rgba(55,148,179,1)'
    }
  });

});


map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
  })
);
map.addControl(new mapboxgl.NavigationControl());

// map.on('mousemove', function (e) {
//     document.getElementById('info').innerHTML =
//         // e.point is the x, y coordinates of the mousemove event relative
//         // e.lngLat is the longitude, latitude geographical position of the event
//         JSON.stringify(e.lngLat.wrap());
// });
