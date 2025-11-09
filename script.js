const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const weatherInfoSection = document.querySelector('.weather-info');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');

const apiKey = '95f5a0a8aaed9a20a701757871e4bc58';

// Select elements to update dynamically
const countryTxt = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityTxt = document.querySelectorAll('.regular-value-txt')[0];
const windTxt = document.querySelectorAll('.regular-value-txt')[1];
const weatherImg = document.querySelector('.weather-summary-img');

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && cityInput.value.trim() !== '') {
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
    }
});

async function getFechData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    return response.json();
}

/**
 * Updates the weather information display based on the provided city data
 * @async
 * @param {string} city - The name of the city to get weather information for
 * @returns {Promise<void>} A promise that resolves when weather info is updated
 * @throws {Error} If there is an error fetching weather data
 * @description
 * This function:
 * - Fetches weather data for the specified city
 * - Updates DOM elements with weather information including:
 *   - Country and city name
 *   - Temperature in Celsius
 *   - Weather condition
 *   - Humidity percentage
 *   - Wind speed in m/s
 * - Updates weather icon based on conditions (cloud, rain, clear, snow, or thunderstorm)
 * - Shows "not found" section if city data cannot be retrieved
 */
async function updateWeatherInfo(city) {
    const weatherData = await getFechData('weather', city);

    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSection);
        return;
    }

    console.log(weatherData);
    showDisplaySection(weatherInfoSection);

    // ✅ Update the live data on screen
    countryTxt.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
    tempTxt.textContent = `${Math.round(weatherData.main.temp)} °C`;
    conditionTxt.textContent = weatherData.weather[0].main;
    humidityTxt.textContent = `${weatherData.main.humidity}%`;
    windTxt.textContent = `${weatherData.wind.speed} m/s`;

    // ✅ Change icon dynamically based on condition
    const condition = weatherData.weather[0].main.toLowerCase();
    if (condition.includes('cloud')) {
        weatherImg.src = 'assets/assets/weather/clouds.svg';
    } else if (condition.includes('rain')) {
        weatherImg.src = 'assets/assets/weather/rain.svg';
    } else if (condition.includes('clear')) {
        weatherImg.src = 'assets/assets/weather/clear.svg';
    } else if (condition.includes('snow')) {
        weatherImg.src = 'assets/assets/weather/snow.svg';
    } else {
        weatherImg.src = 'assets/assets/weather/thunderstorm.svg';
    }
}

function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(sec => sec.style.display = 'none');

    section.style.display = 'flex';
}
