const WMO = {
    0: ["Clear sky", "☀️"],
    1: ["Mostly sunny", "🌤️"],
    2: ["Partly cloudy", "⛅"],
    3: ["Overcast", "☁️"],
    45: ["Fog", "🌫️"],
    48: ["Rime fog", "🌫️"],
    51: ["Light drizzle", "🌦️"],
    53: ["Moderate drizzle", "🌦️"],
    55: ["Dense drizzle", "🌧️"],
    61: ["Slight rain", "🌦️"],
    63: ["Moderate rain", "🌧️"],
    65: ["Heavy rain", "🌧️"],
    71: ["Slight snow", "🌨️"],
    73: ["Moderate snow", "🌨️"],
    75: ["Heavy snow", "❄️"],
    80: ["Slight rain showers", "🌦️"],
    81: ["Moderate rain showers", "🌧️"],
    82: ["Violent rain showers", "⛈️"],
    95: ["Thunderstorm", "⛈️"],
    96: ["Thunderstorm with hail", "⛈️"],
    99: ["Thunderstorm with heavy hail", "⛈️"]
};

const el = (id) => document.getElementById(id);

// Event listeners sirf ek baar lagao
el("search-btn").addEventListener("click", handleSearch);
el("city-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
});

function handleSearch() {
    const city = el("city-input").value.trim();
    if (city) getWeather(city);
}

async function getWeather(cityName) {
    const resultBox = el("weather-result");
    if (resultBox) resultBox.textContent = "";

    try {
        const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`
        );
        if (!geoRes.ok) throw new Error(`Geocoding failed: ${geoRes.status}`);
        const geo = await geoRes.json();

        if (!geo.results || geo.results.length === 0) {
            if (resultBox) resultBox.textContent = `City nahi mili: ${cityName}`;
            return;
        }

        const { latitude, longitude, name, country } = geo.results[0];

        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
            `&current=temperature_2m,precipitation,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        );
        if (!weatherRes.ok) throw new Error(`Weather failed: ${weatherRes.status}`);
        const weather = await weatherRes.json();

        // Fetch poora hone ke baad hi UI update karo
        renderWeather(weather.current, name, country);
    } catch (err) {
        if (resultBox) resultBox.textContent = "Kuch galat hua. Dobara try karein.";
        console.error(err);
    }
}

function renderWeather(c, name, country) {
    const [label, icon] = WMO[c.weather_code] ?? ["Unknown", "❔"];

    // c.time city ke local time mein hota hai (timezone=auto ki wajah se)
    const date = new Date(c.time);
    const dayName = date.toLocaleDateString("en-IN", { weekday: "long" });
    const timeText = date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });

    el("location").textContent = `${name}, ${country}`;
    el("temp").textContent = c.temperature_2m;
    el("day").textContent = `${dayName}, ${timeText}`;
    el("hum").textContent = `Humidity: ${c.relative_humidity_2m}%`;
    el("pre").textContent = `Precipitation: ${c.precipitation} mm`;
    el("win").textContent = `Wind: ${c.wind_speed_10m} km/h`;
    el("nature").textContent = icon;
    el("mood").textContent = label;
}