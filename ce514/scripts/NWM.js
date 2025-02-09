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

    new Chart(ctx, {
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
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'hour'
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}