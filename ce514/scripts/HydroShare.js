const map = L.map('map').setView([43.473956788279345, -111.93393322063366], 15);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 20,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-0b3452c0c2d34f099e6da847a6ce828d/wms', {
  layers: 'HS-0b3452c0c2d34f099e6da847a6ce828d:counties',
  format: 'image/png',
  transparent: true,
  attribution: 'Hydroshare GeoServer'
}).addTo(map);
