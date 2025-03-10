let map;

function initMap(lat, lon) {
    console.log(`Initializing map at coordinates: ${lat}, ${lon}`);
    const location = [lat, lon];
    if (!map) {
        map = L.map('map').setView(location, 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);
    } else {
        map.setView(location, 12);
    }

    if (map.marker) {
        map.removeLayer(map.marker);
    }

    map.marker = L.marker(location).addTo(map);
}

document.getElementById('getWeather').addEventListener('click', async () => {
    fetchWeatherData();
});

const searchInput = document.getElementById("city");

searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        fetchWeatherData();
    }
});

async function fetchWeatherData() {
    const city = searchInput.value;
    document.getElementById('loading').style.display = 'block'; 
    try {
        const response = await fetch('/api/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ city }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        initMap(data.coord.lat, data.coord.lon);
        document.getElementById('map').classList.add('visible');

        document.getElementById('weatherInfo').classList.remove('hidden');

        document.getElementById('weatherIcon').innerHTML = getWeatherIcon(data.weather[0].main);
        document.getElementById('temperature').innerText = `${Math.round(data.main.temp)}°C`;
        document.getElementById('weatherDescription').innerText = data.weather[0].description;
        document.getElementById('feelsLike').innerText = `Ressenti: ${Math.round(data.main.feels_like)}°C`;
        document.getElementById('humidity').innerText = `Humidité: ${data.main.humidity}%`;
        document.getElementById('windSpeed').innerText = `Vent: ${data.wind.speed} m/s`;
        document.getElementById('windDirection').innerText = `Direction: ${data.wind.deg}°`;
        document.getElementById('clouds').innerText = `Nuages: ${data.clouds.all}%`;
        document.getElementById('precipitation').innerText = `Précipitation: ${data.rain ? data.rain['1h'] : 0} mm`;

        document.getElementById('forecast').classList.remove('hidden');

        await fetchForecast(city);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weatherResult').innerHTML = `<p>Une erreur s'est produite lors de la récupération des données.</p>`;
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

async function fetchForecast(city) {
    const apiKey = ''; // entrer votre clé d'api openweather 
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();

    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '<h2>5-Day Forecast</h2>';


    const dailyForecasts = {};


    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        if (!dailyForecasts[day]) {
            dailyForecasts[day] = {
                temp: item.main.temp,
                weather: item.weather[0].main,
                icon: item.weather[0].icon
            };
        }
    });

    const forecastGrid = document.createElement('div');
    forecastGrid.className = 'forecast-grid';

    Object.entries(dailyForecasts).slice(0, 5).forEach(([day, forecast]) => {
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        
        const weatherIcon = getWeatherIcon(forecast.weather);
        
        forecastItem.innerHTML = `
            <div class="forecast-day">${day}</div>
            <div class="forecast-icon">${weatherIcon}</div>
            <div class="forecast-temp">${Math.round(forecast.temp)}°C</div>
            <div class="forecast-desc">${forecast.weather}</div>
        `;
        
        forecastGrid.appendChild(forecastItem);
    });

    forecastContainer.appendChild(forecastGrid);
}

function getWeatherIcon(weather) {
    const iconMap = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Snow': '❄️',
        'Thunderstorm': '⛈️',
        'Drizzle': '🌦️',
        'Mist': '🌫️'
    };
    return iconMap[weather] || '☀️';
}

document.getElementById('getWeather').addEventListener('click', () => {
    fetchWeatherData();
});