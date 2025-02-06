const map = L.map('map').setView([37.85227792200095, -119.52604693651973], 9);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 20,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const layers = {
  roads: L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-f6efb0188ee7472b8dda3a50af6cec56/wms', {
    layers: 'HS-f6efb0188ee7472b8dda3a50af6cec56:Yosemite_National_Park_-_Road_Areas_-_Open_Data',
    format: 'image/png',
    transparent: true,
    attribution: 'Hydroshare GeoServer'
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
    layers: 'HS-f6efb0188ee7472b8dda3a50af6cec56:Yosemite_National_Park_-_Features_Waterbodies_LiDAR_2019_-_Open_Data',
    format: 'image/png',
    transparent: true,
    attribution: 'Hydroshare GeoServer'
  }),

  POI: L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-f6efb0188ee7472b8dda3a50af6cec56/wms', {
    layers: 'HS-f6efb0188ee7472b8dda3a50af6cec56:Yosemite_Project',
    format: 'image/png',
    transparent: true,
    attribution: 'Hydroshare GeoServer'
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