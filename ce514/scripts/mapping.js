	const map = L.map('map').setView([43.473956788279345, -111.93393322063366], 15);

	const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	const marker1 = L.marker([43.473956788279345, -111.93393322063366]).addTo(map)
		.bindPopup('Home').openPopup();

	const marker2 = L.marker([43.477566552676755, -111.93380722595688]).addTo(map)
		.bindPopup('Church');

	const marker3 = L.marker([43.476952580795405, -111.9357408873423]).addTo(map)
		.bindPopup('Elementary School');

	const marker4 = L.marker([43.470144518588384, -111.97770611971362]).addTo(map)
		.bindPopup('High School');

	const marker5 = L.marker([43.527870847236656, -111.9295179493799]).addTo(map)
		.bindPopup('Iona Library');

	var polygonPoints = [
    		L.latLng(43.47383436482361, -111.93360831829914), // Point 1
    		L.latLng(43.47369032745533, -111.93391409013509), // Point 2
    		L.latLng(43.47412633140878, -111.93448540067064), // Point 3
    		L.latLng(43.47426647486864, -111.93412062023478)  // Point 4
		];

	var polygon = L.polygon(polygonPoints, { color: 'red', fillColor: 'red', fillOpacity: 0.5 })
    		.addTo(map); 

	// Define the center point of the circle (latitude and longitude)
	var center = L.latLng(43.473956788279345, -111.93393322063366); // Example: San Francisco
	
	// Calculate the radius in meters (0.5 miles = 804.672 meters)
	var radiusInMeters = 0.5 * 1609.344; // 1 mile = 1609.344 meters
	
	// Create a circle layer
	var circle = L.circle(center, radiusInMeters, {
		    color: 'blue',
		    fillColor: '#f03',
		    fillOpacity: 0.5,
		    radius: radiusInMeters
		}).addTo(map);
	
	function onMapClick(e) {
		popup
			.setLatLng(e.latlng)
			.setContent(`Are you sure you want to click there?`)
			.openOn(map);
	}

	const earthRadius = 6371; // Earth's radius in kilometers

	function degToRad(degrees) {
	  return degrees * Math.PI / 180;
	}
	
	function radToDeg(radians) {
	  return radians * 180 / Math.PI;
	}
	
	function calculateDistance() {
	  const location1Input = document.getElementById('location1').value;
	  const location2Input = document.getElementById('location2').value;
	
	  // Use a geocoding library (e.g., Leaflet Nominatim) to convert location strings to coordinates
	  // For demonstration purposes, we'll assume coordinates are directly entered
	  const location1 = { lat: 40.7128, lng: -74.0059 }; // Example coordinates for New York City
	  const location2 = { lat: 34.0522, lng: -118.2437 }; // Example coordinates for Los Angeles
	
	  const lat1 = degToRad(location1.lat);
	  const lon1 = degToRad(location1.lng);
	  const lat2 = degToRad(location2.lat);
	  const lon2 = degToRad(location2.lng);
	
	  const dlon = lon2 - lon1;
	
	  const a = Math.sin(Math.pow((lat2 - lat1) / 2, 2)) +
	            Math.

	map.on('click', onMapClick);
