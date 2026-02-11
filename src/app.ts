// ===== FETCH TÍPUS DEKLARÁLÁS =====
declare function fetch(
    input: RequestInfo,
    init?: RequestInit
): Promise<Response>;

// ===== INTERFACE =====
interface WeatherDescription {
    description: string;
    icon: string;
}

interface MainWeather {
    temp: number;
    humidity: number;
}

interface WeatherResponse {
    name: string;
    weather: WeatherDescription[];
    main: MainWeather;
}

// ===== IDŐJÁRÁS LEKÉRÉS =====
async function fetchWeather(city: string): Promise<void> {
    const apiKey = '6533f1027154a42ba4e38e655f640fb0';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=hu`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP hiba! Státusz: ${response.status}`);
        }

        const data: WeatherResponse = await response.json();

        const description =
            data.weather.length > 0
                ? data.weather[0]
                : 'Nincs adat';

        console.log(`Város: ${data.name}`);
        console.log(`Hőmérséklet: ${data.main.temp} °C`);
        console.log(`Időjárás: ${description}`);
        console.log(`Páratartalom: ${data.main.humidity}%`);

    } catch (error) {
        console.error('Hiba történt az API hívása közben:', error);
    }
}

function btnHandler(){
    const btn = document.querySelector(".button-search") as HTMLButtonElement;
    btn.addEventListener("click", () => {
        const city = getCityName();
        fetchWeather(city);
    });
}

function getCityName(){
    const cityName = document.getElementById('cityInput') as HTMLInputElement;
    const value = cityName.value;
    return value;
}

// ===== MEGHÍVÁS =====
fetchWeather('Gyöngyös');
console.log(getCityName());
