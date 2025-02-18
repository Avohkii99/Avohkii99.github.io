const map = L.map('map').setView([37.30342866145395, -121.88656206242344], 10);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 20,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let forecastChartInstance; // Declare a variable to store the forecast chart instance

function getForecast(reachId) {
    const forecastType = document.getElementById('forecastType').value;
    const forecastTypeMap = {
        'short_range': 'shortRange',
        'medium_range': 'mediumRange',
        'long_range': 'longRange'
    };
    const apiUrl = `https://api.water.noaa.gov/nwps/v1/reaches/${reachId}/streamflow?series=${forecastType}`;

    // Show the loading symbol
    document.getElementById('loadingContainer').style.display = 'block';
    document.getElementById('instructionText').textContent = 'Loading...';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Log the response data to see its structure

            const mappedForecastType = forecastTypeMap[forecastType];
            // Check if the series property exists
            if (data[mappedForecastType] && data[mappedForecastType].series) {
                const forecastData = data[mappedForecastType].series.data;
                displayForecastTable(forecastData, forecastType);
                drawForecastGraph(forecastData);
                // Hide the loading symbol and update the instruction text
                document.getElementById('loadingContainer').style.display = 'none';
                document.getElementById('instructionText').textContent = 'The power generation forecast is displayed below.';
            } else {
                throw new Error(`No series data available for ${forecastType}`);
            }
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            // Hide the loading symbol and update the instruction text
            document.getElementById('loadingContainer').style.display = 'none';
            document.getElementById('instructionText').textContent = 'Error fetching forecast data. Please try again.';
        });
}

function displayForecastTable(data, forecastType) {
    const tableBody = document.getElementById('forecastTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing table rows

    let totalPower = 0;
    const currentTime = new Date();
    let forecastDuration;

    if (forecastType === 'short_range') {
        forecastDuration = 12 * 60 * 60 * 1000; // 12 hours
    } else if (forecastType === 'medium_range') {
        forecastDuration = 3 * 24 * 60 * 60 * 1000; // 3 days
    } else if (forecastType === 'long_range') {
        forecastDuration = 10 * 24 * 60 * 60 * 1000; // 10 days
    }

    const forecastEndTime = new Date(currentTime.getTime() + forecastDuration);

    let startTime = null;
    let endTime = null;

    data.forEach(forecast => {
        const row = tableBody.insertRow();
        const dateCell = row.insertCell(0);
        const timeCell = row.insertCell(1);
        const powerCell = row.insertCell(2);

        // Format the date and time
        const date = new Date(forecast.validTime);
        const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
        const formattedDate = date.toLocaleDateString('en-US', dateOptions);
        const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

        // Calculate power (kWh)
        const flow = parseFloat(forecast.flow);
        const power = 10 * flow * 448.8 * 0.18 * 0.5 / 1000;

        // Sum the power for the forecast duration, omitting values before the current time
        if (date > currentTime && date <= forecastEndTime) {
            totalPower += power;

            // Set the start time if it's not set
            if (!startTime) {
                startTime = date;
            }

            // Update the end time
            endTime = date;
        }

        dateCell.textContent = formattedDate;
        timeCell.textContent = formattedTime;
        powerCell.textContent = power.toFixed(2); // Round the power to 2 decimal places
    });

    // Display the total power in the text box
    document.getElementById('totalPower').value = `${totalPower.toFixed(2)} kWh`;

    // Display the start time and end time
    if (startTime && endTime) {
        const startOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        const endOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        const adjustedEndTime = new Date(endTime.getTime() + 60 * 60 * 1000); // Add one hour to the end time
        document.getElementById('startTime').textContent = `Start Time: ${startTime.toLocaleString('en-US', startOptions)}`;
        document.getElementById('endTime').textContent = `End Time: ${adjustedEndTime.toLocaleString('en-US', endOptions)}`;
    } else {
        document.getElementById('startTime').textContent = 'Start Time: N/A';
        document.getElementById('endTime').textContent = 'End Time: N/A';
    }
}

function drawForecastGraph(data) {
    const ctx = document.getElementById('forecastGraph').getContext('2d');
    const labels = data.map(forecast => forecast.validTime);
    const powers = data.map(forecast => {
        const flow = parseFloat(forecast.flow);
        return 10 * flow * 448.8 * 0.18 * 0.5 / 1000; // Calculate power (kWh)
    });

    // Destroy the existing chart instance if it exists
    if (forecastChartInstance) {
        forecastChartInstance.destroy();
    }

    forecastChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Power (kWh)',
                data: powers,
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'hour'
                    },
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Power (kWh)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString(); // Format the y-axis labels
                        }
                    },
                    min: Math.floor((Math.min(...powers) - 2) / 2) * 2, // Set the minimum value rounded to the nearest 5
                    max: Math.ceil((Math.max(...powers) + 2) / 2) * 2  // Set the maximum value rounded to the nearest 5
                }
            }
        }
    });
}

// Define the initial bounds
const initialBounds = map.getBounds();

// Add the NHD layer for the initial view with custom tile loading
const nhdLayer = L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-f6efb0188ee7472b8dda3a50af6cec56/wms', {
    layers: 'HS-f6efb0188ee7472b8dda3a50af6cec56:NHD_Major_Rivers_and_Creeks',
    format: 'image/png',
    transparent: true,
    opacity: 0.25, // Adjust the opacity to make the layer more transparent
    attribution: 'Hydroshare GeoServer'
}).addTo(map);

const watermillsLayer = omnivore.kml('watermills.kml')
    .on('ready', function() {
        this.eachLayer(function(layer) {
            const reachId = layer.feature.properties.name; // Assuming the reach ID is stored in the 'name' property
            layer.on('click', function(e) {
                getForecast(reachId);
            });
        });
    })
    .addTo(map);

document.addEventListener('DOMContentLoaded', function() {
    // No need to call updateTotalNetworkData here since it's already called in the 'ready' event handler
});
