const apiKey = '8e6e7e20718e54fb762c473e92fb356e';

const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const weatherType = document.querySelector('#weather-type');
const weatherInfoContainer = document.querySelector('#weather-info-container');

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const cityName = cityInput.value.trim();
    const type = weatherType.value;

    if (!cityName) {
        alert('กรุณาป้อนชื่อเมือง');
        return;
    }

    if (type === 'current') {
        getCurrentWeather(cityName);
    } else {
        getForecast(cityName);
    }
});

async function getCurrentWeather(city) {
    weatherInfoContainer.innerHTML = `<p>กำลังโหลดข้อมูล...</p>`;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=th`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('ไม่พบข้อมูลเมืองนี้');

        const data = await response.json();
        displayCurrentWeather(data);
    } catch (error) {
        weatherInfoContainer.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

function displayCurrentWeather(data) {
    const { name, main, weather } = data;
    const { temp, humidity } = main;
    const { description, icon } = weather[0];

    const weatherHtml = `
        <h2>${name}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <p>${temp.toFixed(1)}°C</p>
        <p>${description}</p>
        <p>ความชื้น: ${humidity}%</p>
    `;
    weatherInfoContainer.innerHTML = weatherHtml;
}

async function getForecast(city) {
    weatherInfoContainer.innerHTML = `<p>กำลังโหลดข้อมูลพยากรณ์...</p>`;
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=th`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('ไม่พบข้อมูลพยากรณ์');

        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        weatherInfoContainer.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

function displayForecast(data) {
    const cityName = data.city.name;
    const forecastList = data.list;

    // เลือกเฉพาะช่วงเวลา 12:00 ของแต่ละวัน
    const dailyForecasts = forecastList.filter(item => item.dt_txt.includes('12:00:00'));

    let html = `<h2>พยากรณ์อากาศ 5 วัน - ${cityName}</h2>`;

    dailyForecasts.forEach(item => {
        const date = new Date(item.dt_txt);
        const temp = item.main.temp.toFixed(1);
        const desc = item.weather[0].description;
        const icon = item.weather[0].icon;

        html += `
            <div class="forecast-day">
                <h3>${date.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'short' })}</h3>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
                <p>${temp}°C</p>
                <p>${desc}</p>
            </div>
        `;
    });

    weatherInfoContainer.innerHTML = html;
}
