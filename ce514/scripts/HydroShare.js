const map = L.map('map').setView([43.473956788279345, -111.93393322063366], 15);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 20,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-f6efb0188ee7472b8dda3a50af6cec56/wms', {
  layers: 'HS-f6efb0188ee7472b8dda3a50af6cec56:ViewQuality',
  format: 'image/png',
  transparent: true,
  attribution: 'Hydroshare GeoServer'
}).addTo(map);
