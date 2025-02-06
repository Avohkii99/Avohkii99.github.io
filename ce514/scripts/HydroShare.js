const map = L.map('map').setView([37.72901730242477, -119.64314080436989], 10);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 20,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-f6efb0188ee7472b8dda3a50af6cec56/wms', {
  layers: 'HS-f6efb0188ee7472b8dda3a50af6cec56:YosemiteBound',
  format: 'image/png',
  transparent: true,
  styles: 'line_black_heavy', // This style should be defined in the GeoServer to render the layer as a black, heavier line
  attribution: 'Hydroshare GeoServer'
}).addTo(map);

L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-f6efb0188ee7472b8dda3a50af6cec56/wms', {
  layers: 'HS-f6efb0188ee7472b8dda3a50af6cec56:Trails',
  format: 'image/png',
  transparent: true,
  attribution: 'Hydroshare GeoServer'
}).addTo(map);


L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-f6efb0188ee7472b8dda3a50af6cec56/wms', {
  layers: 'HS-f6efb0188ee7472b8dda3a50af6cec56:POI',
  format: 'image/png',
  transparent: true,
  attribution: 'Hydroshare GeoServer'
}).addTo(map);