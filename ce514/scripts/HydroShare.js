const map = L.map('map').setView([37.85227792200095, -119.52604693651973], 9);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 20,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const layers = {
  roads: L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-f6efb0188ee7472b8dda3a50af6cec56/wms', {
    layers: 'HS-f6efb0188ee7472b8dda3a50af6cec56:Roads',
    format: 'image/png',
    transparent: true,
    attribution: 'Hydroshare GeoServer'
  }).on('load', function() {
    const layer = this.getContainer();
    layer.style.filter = 'invert(1) grayscale(1) brightness(0)';
  }),

  yosemiteBound: L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-f6efb0188ee7472b8dda3a50af6cec56/wms', {
    layers: 'HS-f6efb0188ee7472b8dda3a50af6cec56:YosemiteBound',
    format: 'image/png',
    transparent: true,
    styles: 'line',
    attribution: 'Hydroshare GeoServer'
  }).on('load', function() {
    const layer = this.getContainer();
    layer.style.filter = 'invert(1) grayscale(1) brightness(0)';
  }),

  trails: L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-f6efb0188ee7472b8dda3a50af6cec56/wms', {
    layers: 'HS-f6efb0188ee7472b8dda3a50af6cec56:Trails',
    format: 'image/png',
    transparent: true,
    attribution: 'Hydroshare GeoServer'
  }),

  water: L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-f6efb0188ee7472b8dda3a50af6cec56/wms', {
    layers: 'HS-f6efb0188ee7472b8dda3a50af6cec56:Water',
    format: 'image/png',
    transparent: true,
    attribution: 'Hydroshare GeoServer'
  }).on('load', function() {
    const layer = this.getContainer();
    layer.style.filter = 'invert(1) grayscale(1) brightness(0)';
  })
};

// Add the default layer to the map
layers.roads.addTo(map);

// Handle layer selection
document.getElementById('layerSelect').addEventListener('change', function(e) {
  const selectedLayer = e.target.value;

  // Remove all layers
  Object.values(layers).forEach(layer => map.removeLayer(layer));

  // Add the selected layer
  layers[selectedLayer].addTo(map);
});