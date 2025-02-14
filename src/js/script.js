let map;

function initMap(lat, lon) {
    const location = [lat, lon];
    if (!map) {
        // Initialize the map only once with a higher zoom level
        map = L.map('map').setView(location, 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);
    } else {
        // Update the map view and marker for subsequent requests
        map.setView(location, 12);
    }

    // Remove existing markers before adding a new one
    if (map.marker) {
        map.removeLayer(map.marker);
    }

    // Add a new marker
    map.marker = L.marker(location).addTo(map);
}

document.getElementById('getWeather').addEventListener('click', async () => {
    fetchWeatherData();
});

const searchInput = document.getElementById("city"); // Assurez-vous que l'ID correspond à votre champ de recherche

searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Empêche le comportement par défaut
        fetchWeatherData();
    }
});

async function fetchWeatherData() {
    const city = searchInput.value;
    try {
        const response = await fetch('/api/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ city }),
        });

        const data = await response.json();
        const weatherResult = document.getElementById('weatherResult');
        if (response.ok) {
            weatherResult.innerHTML = `<h2>${data.name}</h2>
                                        <p>${data.weather[0].description}</p>
                                        <p>Température: ${data.main.temp} °C</p>`;
            console.log('Coordinates:', data.coord.lat, data.coord.lon);
            initMap(data.coord.lat, data.coord.lon);
        } else {
            weatherResult.innerHTML = `<p>${data.error}</p>`;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weatherResult').innerHTML = `<p>Une erreur s'est produite lors de la récupération des données.</p>`;
    }
}