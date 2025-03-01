const map = L.map('map').setView([43.473956788279345, -111.93393322063366], 15);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 20,
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

  const sledIcon = L.icon({
    iconUrl: '/ce514/Sled.png', // Replace with the path to your custom sled image
    iconSize: [32, 32], // Adjust the size as needed
    iconAnchor: [16, 16], // Anchor the icon (center bottom)
    popupAnchor: [0, -32] // Position the popup above the icon
  });

  const carIcon = L.icon({
    iconUrl: '/ce514/car.png', // Replace with the path to your custom sled image
    iconSize: [32, 32], // Adjust the size as needed
    iconAnchor: [16, 16], // Anchor the icon (center bottom)
    popupAnchor: [0, -32] // Position the popup above the icon
  });

  const marker6 = L.marker([43.496811111479424, -111.85024998695548], { icon: sledIcon }).addTo(map)
    .bindPopup('Sledding Hill');

  // Define the paths for the markers to move along
  const paths = [
    {
      marker: marker6,
      path: [],
      startPoint: [43.496811111479424, -111.85024998695548],
      endPoint: [43.49552103260087, -111.85838155053446]
    }
  ];

  const numPoints = 10; // Number of intermediate points

  paths.forEach(item => {
    const latStep = (item.endPoint[0] - item.startPoint[0]) / (numPoints + 1);
    const lngStep = (item.endPoint[1] - item.startPoint[1]) / (numPoints + 1);

    for (let i = 0; i <= numPoints + 1; i++) {
      const lat = item.startPoint[0] + latStep * i;
      const lng = item.startPoint[1] + lngStep * i;
      item.path.push([lat, lng]);
    }
  });

  // Function to move the marker along the path
  function moveMarker(marker, path, index = 0, forward = true) {
    const duration = 200; // Duration of the animation in milliseconds
    const nextIndex = forward ? index + 1 : index - 1;

    if (nextIndex >= path.length || nextIndex < 0) {
      forward = !forward;
      moveMarker(marker, path, index, forward);
      return;
    }

    marker.setLatLng(path[index]).slideTo(path[nextIndex], {
      duration: duration,
      keepAtCenter: false
    });

    setTimeout(() => moveMarker(marker, path, nextIndex, forward), duration);
  }

  // Add the slideTo method to the marker
  L.Marker.prototype.slideTo = function (latlng, options) {
    const start = this.getLatLng();
    const end = L.latLng(latlng);
    const duration = options.duration || 200;
    const startTime = performance.now();

    const animate = (time) => {
      const elapsed = time - startTime;
      const t = Math.min(elapsed / duration, 1);
      const lat = start.lat + (end.lat - start.lat) * t;
      const lng = start.lng + (end.lng - start.lng) * t;
      this.setLatLng([lat, lng]);

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    return this;
  };

  // Start moving the markers
  paths.forEach(item => moveMarker(item.marker, item.path));
  
  // Function to extract coordinates from KML and create a path
  function extractPathFromKml(url, callback) {
    omnivore.kml(url).on('ready', function() {
      const kmlLayer = this;
      const path = [];

      kmlLayer.eachLayer(function(layer) {
        if (layer instanceof L.Polyline) {
          layer.getLatLngs().forEach(latlng => path.push([latlng.lat, latlng.lng]));
        }
      });

      callback(path);
    }).on('error', function(err) {
      console.error("Error loading KML:", err);
    });
  }

  // Extract path from KML and start moving the marker
  extractPathFromKml('/ce514/Path.kml', function(path) {
    if (path.length > 0) {
      const movingMarker = L.marker(path[0], { icon: carIcon }).addTo(map).bindPopup('Driving to the library...');
      moveMarker(movingMarker, path);
    } else {
      console.error("No path found in KML.");
    }
  });

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

const earthRadius = 6371; // Earth's radius in kilometers

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

function radToDeg(radians) {
  return radians * 180 / Math.PI;
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const dLat = degToRad(lat2 - lat1);
  const dLon = degToRad(lon1 - lon2);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

function calculateDistance() {
  try {
    const location1Input = document.getElementById('location1').value;
    const location2Input = document.getElementById('location2').value;

    const location1Parts = location1Input.split(',');
    const location2Parts = location2Input.split(',');

    if (location1Parts.length !== 2 || location2Parts.length !== 2) {
      throw new Error('Invalid input format. Please enter latitude and longitude separated by a comma (,).');
    }

    const lat1 = parseFloat(location1Parts[0]);
    const lon1 = parseFloat(location1Parts[1]);
    const lat2 = parseFloat(location2Parts[0]);
    const lon2 = parseFloat(location2Parts[1]);

    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
      throw new Error('Invalid input. Please enter valid numbers for latitude and longitude.');
    }

    const lat1Rad = degToRad(lat1);
    const lon1Rad = degToRad(lon1);
    const lat2Rad = degToRad(lat2);
    const lon2Rad = degToRad(lon2);

    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    // Calculate intermediate points for the great-circle path (example with 10 points)
    const numIntermediatePoints = 10;
    const intermediatePoints = [];

    intermediatePoints.push({ lat: lat1, lng: lon1 });
	  
    for (let i = 1; i <= numIntermediatePoints; i++) {
      const f = i / (numIntermediatePoints + 1);
      const A = Math.sin((1 - f) * c) / Math.sin(c);
      const B = Math.sin(f * c) / Math.sin(c);
      const x = A * Math.cos(lat1Rad) * Math.cos(lon1Rad) + B * Math.cos(lat2Rad) * Math.cos(lon2Rad);
      const y = A * Math.cos(lat1Rad) * Math.sin(lon1Rad) + B * Math.cos(lat2Rad) * Math.sin(lon2Rad);
      const z = A * Math.sin(lat1Rad) + B * Math.sin(lat2Rad);
      const phi = Math.atan2(z, Math.sqrt(x * x + y * y));
      const lambda = Math.atan2(y, x);
      intermediatePoints.push({ lat: radToDeg(phi), lng: radToDeg(lambda) });
    }

    intermediatePoints.push({ lat: lat2, lng: lon2 });
	  
    // Create a polyline for the great-circle path
    const polyline = L.polyline(intermediatePoints, { color: 'blue' }).addTo(map);

    // Add markers for the start and end locations
    const startMarker = L.marker([lat1, lon1]).addTo(map);
    const endMarker = L.marker([lat2, lon2]).addTo(map);

    // Update the page with the calculated distance
    document.getElementById('distanceResult').innerText = `Distance between locations: ${distance.toFixed(2)} km`;
	  
    // Zoom to fit the path and markers
    map.fitBounds(polyline.getBounds().extend(startMarker.getLatLng()).extend(endMarker.getLatLng()));

  } catch (error) {
    alert(error.message);
  }
};

// Get a reference to the button element
const calculateDistanceButton = document.getElementById('calculateDistance');

// Add event listener to the button
calculateDistanceButton.addEventListener('click', calculateDistance); 

const kmlUrls = [
  { url: '/ce514/Path.kml', style: null }, // Adjusted relative path for the first KML
  { url: '/ce514/Sled.kml', style: null }, // Adjusted relative path for the second KML
  { 
    url: '/ce514/Hill.kml', // Adjusted relative path for the third KML
    style: {
      color: "blue",    // Outline color
      weight: 2,       // Outline thickness (adjust as needed)
      fill: true,      // Fill the polygon
      fillColor: 'blue', // Fill color
      fillOpacity: 0.4  // Fill opacity
    }
  }
];

const allBounds = L.latLngBounds(); // Initialize an empty LatLngBounds object

// Function to load and style KML
function loadKml(url, customStyle = null) {
  omnivore.kml(url).on('ready', function() {
    const kmlLayer = this; // Store 'this' (the layer) in a variable

    kmlLayer.addTo(map); // Add to the map *before* setting style

    if (customStyle) {
      kmlLayer.setStyle(customStyle); // Apply custom style if provided
    } else {
      kmlLayer.setStyle({ // Default style
        color: "blue",    // Outline color
        weight: 2,       // Outline thickness (adjust as needed)
        fill: false     // Do not fill the polygon.
      });
    }

    allBounds.extend(kmlLayer.getBounds()); // Extend the combined bounds

  }).on('error', function(err) {
    console.error("Error loading KML:", err); // Very important for debugging
  });
}

// Load all KML files
kmlUrls.forEach(item => loadKml(item.url, item.style));

// Fit map to the combined bounds after a short delay to ensure all layers are loaded
setTimeout(() => {
  map.fitBounds(allBounds);
}, 1000); // Adjust the delay as needed