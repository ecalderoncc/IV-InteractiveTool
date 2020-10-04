mapboxgl.accessToken = 'pk.eyJ1IjoiZWNhbGRlcm9uY2FwIiwiYSI6ImNrZXZnOTdyeDAwNGQydW1mZTJwaDd6Y3MifQ.QEdcAlKuk8k-frHsdH5XYw'; 
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/ecalderoncap/ckf0lsp9q3am019llbqmpzqij'
});

map.on('load', function() {
    var layers = ['Completed', 'Under Construction', 'Approved', 'Applied'];
    var colors = ['#6A51A4', '#9E9AC8', '#CCCAE2', '#F1EEF6'];
});

for (i = 0; i < layers.length; i++) {
    var layer = layers[i];
    var color = colors[i];
    var item = document.createElement('div');
    var key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;
    var value = document.createElement('span');
    value.innerHTML = layer;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
   }

map.addControl(new mapboxgl.NavigationControl());