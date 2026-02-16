const apiKey = '6533f1027154a42ba4e38e655f640fb0';

// 1. Típusok
interface WeatherData {
    city: { name: string };
    list: {
        dt_txt: string;
        main: { temp: number; humidity: number; pressure: number };
        weather: { icon: string; description: string }[];
        wind: { speed: number };
    }[];
}

// 2. Lekérés
async function getWeather(city: string): Promise<WeatherData | null> {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}&lang=hu`);
        if (!res.ok) throw new Error();
        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }
}

// 3. Megjelenítés
const showData = (data: WeatherData): void => {
    const current = data.list[0];
    
    // Ha véletlenül nincs adat, ne fusson tovább (ez az első védelem)
    if (!current) return;

    // Ikon kiválasztása biztonságosan (weather[0] után kérdőjel!)
    const iconCode = current.weather[0]?.icon || '01d'; 
    const iconClass = iconCode.startsWith('01') ? 'sun-icon' : (iconCode.startsWith('50') ? 'mist-icon' : 'cloud-icon');

    // Felső panel
    const topPanel = document.querySelector('.top-panel') as HTMLElement;
    
    // Páratartalom dobozok (Ma, Holnap, Holnapután)
    const humidityHtml = [0, 8, 16].map((idx, i) => {
        const item = data.list[idx];
        
        // Ha nincs item (pl. a lista rövidebb), üres stringet adunk vissza
        if (!item) return ''; 

        const dayName = i === 0 ? "Ma" : new Date(item.dt_txt).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' });
        
        return `
            <div class="humidity-box">
                <div class="${iconClass}"></div>
                <h3>${dayName}</h3>
                <div>Páratartalom ${item.main.humidity}%</div>
            </div>`;
    }).join("");

    topPanel.innerHTML = `
        <div class="temp-box">
            <div class="temp">${Math.round(current.main.temp)}°C</div>
            <div class="location-info">
                <h1>${data.city.name}</h1>
                <p>${new Date().toLocaleTimeString('hu-HU', {hour:'2-digit', minute:'2-digit'})} - <br />
                   ${new Date(current.dt_txt).toLocaleDateString('hu-HU', {weekday:'long', month:'long', day:'numeric'})}</p>
            </div>
            <div class="weather-icon ${iconClass}" title="${current.weather[0]?.description}"></div>
        </div>

        <div class="humidity-container">
            ${humidityHtml}
        </div>

        <footer>
            <span class="pressure-icon"></span> Légnyomás ${current.main.pressure} mb &nbsp;&nbsp; 
            <span class="wind-icon"></span> Szél ${current.wind.speed} km/h
        </footer>
    `;

    // Lenti panel
    const chart = document.querySelector('.chart') as HTMLElement;
    const labels = document.querySelector('.time-labels') as HTMLElement;
    
    chart.style.cssText = "display: flex; align-items: flex-end; height: 150px;";

    chart.innerHTML = data.list.slice(0, 8).map(item => `
        <div class="bar" style="height: ${Math.max(10, Math.round(item.main.temp) * 4)}px; width: 100%; margin: 0 2px; opacity: 0.6; position: relative;">
            <span class="temps" style="position:absolute; top:-20px; left:50%; transform:translate(-50%)">${Math.round(item.main.temp)}°</span>
        </div>
    `).join("");

    labels.innerHTML = data.list.slice(0, 8).map(item => `
        <span>${new Date(item.dt_txt).toLocaleTimeString('hu-HU', {hour:'2-digit', minute:'2-digit'})}</span>
    `).join("");
}

// 4. Indítás
const init = async () => {
    // Alapértelmezett
    const startData = await getWeather('Gyöngyös');
    if (startData) showData(startData);

    // Keresés
    const button = document.querySelector('.button-search')
    button!.addEventListener('click', async (e) => {
        e.preventDefault();
        let city = (document.getElementById('city-input') as HTMLInputElement).value;
        if (city) {
            const data = await getWeather(city);
            if (data) showData(data);
            (document.getElementById('city-input') as HTMLInputElement).value = "";
        }
    });
};

init();