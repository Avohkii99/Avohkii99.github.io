let chartInstance; // Declare a variable to store the chart instance

document.getElementById('getForecastButton').addEventListener('click', function() {
    const reachId = document.getElementById('reachIdInput').value;
    if (reachId) {
        getForecast(reachId);
    } else {
        alert('Please enter a Reach ID.');
    }
});

function getForecast(reachId) {
    const apiUrl = `https://api.water.noaa.gov/nwps/v1/reaches/${reachId}/streamflow?series=short_range`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Log the response data to see its structure
            const forecastData = data.shortRange.series.data;
            displayForecastTable(forecastData);
            drawForecastGraph(forecastData);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

function displayForecastTable(data) {
    const tableBody = document.getElementById('forecastTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing table rows

    data.forEach(forecast => {
        const row = tableBody.insertRow();
        const timeCell = row.insertCell(0);
        const flowCell = row.insertCell(1);

        timeCell.textContent = forecast.validTime;
        flowCell.textContent = forecast.flow;
    });
}

function drawForecastGraph(data) {
    const ctx = document.getElementById('forecastGraph').getContext('2d');
    const labels = data.map(forecast => forecast.validTime);
    const flows = data.map(forecast => forecast.flow);

    // Destroy the existing chart instance if it exists
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Flow (cfs)',
                data: flows,
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
                        text: 'Streamflow'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString(); // Format the y-axis labels
                        }
                    },
                    min: Math.floor((Math.min(...flows) - 5) / 5) * 5, // Set the minimum value rounded to the nearest 5
                    max: Math.ceil((Math.max(...flows) + 5) / 5) * 5  // Set the maximum value rounded to the nearest 5
                }
            }
        }
    });
}