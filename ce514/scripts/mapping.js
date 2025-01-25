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
	
	function haversineDistance(lat1, lon1, lat2, lon2) {
	  const dLat = degToRad(lat2 - lat1);
	  const dLon = degToRad(lon2 - lon1);
	  const a =
	    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	    Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
	    Math.sin(dLon / 2) * Math.sin(dLon / 2);
	  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	  return earthRadius * c;
	}
	
	function calculateDistance() {
	  const location1Input = document.getElementById('location1').value;
	  const location2Input = document.getElementById('location2').value;
	}
	  // Split the user-entered values into latitude and longitude (assuming comma separation)
	  const location1Parts = location1Input.split(',');
	  const location2Parts = location2Input.split(',');
	
	  // Check if valid latitude and longitude values are provided
	  if (location1Parts.length !== 2 || location2Parts.length !== 2) {
	    alert('Invalid input format. Please enter latitude and longitude separated by a comma (,).');
	    return;
	  }
	
	  const lat1 = parseFloat(location1Parts[0]);
	  const lon1 = parseFloat(location1Parts[1]);
	  const lat2 = parseFloat(location2Parts[0]);
	  const lon2 = parseFloat(location2Parts[1]);
	
	  // Ensure valid numeric values for latitude and longitude
	  if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
	    alert('Invalid input. Please enter valid numbers for latitude and longitude.');
	    return;
	  }
	
	  // Proceed with distance calculation using the parsed values
	  const distance = haversineDistance(lat1, lon1, lat2, lon2);

	map.on('click', onMapClick);
