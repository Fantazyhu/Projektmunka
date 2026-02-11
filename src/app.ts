// 1. TÍPUS DEFINÍCIÓK (INTERFACES)

interface WeatherCondition {
    description: string;
    icon: string;
}

interface MainData {
    temp: number;
    humidity: number;
    feels_like: number;
}

// Egy 3 órás időblokk adata
interface ForecastItem {
    dt: number;
    dt_txt: string; // Pl: "2023-10-25 15:00:00"
    main: MainData;
    weather: WeatherCondition[];
}

// A teljes API válasz szerkezete
interface ForecastResponse {
    cod: string;
    city: {
        name: string;
        country: string;
    };
    list: ForecastItem[]; // Ez a lista tartalmazza a jövőbeli adatokat
}


// 2. ADATLEKÉRÉS (FORECAST)

async function fetchWeatherForecast(city: string): Promise<void> {
    const apiKey = '6533f1027154a42ba4e38e655f640fb0';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}&lang=hu`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Hiba! Státusz: ${response.status} - Város nem található?`);
        }

        const data: ForecastResponse = await response.json();
        console.log(`Időjárás előrejelzés: ${data.city.name} (${data.city.country})`);

        // Végigmegyünk a listán (az API 5 napot ad vissza, 3 órás bontásban)
        // A data.list egy tömb 40 elemmel.
        data.list.forEach((item) => {
            const dateObj = new Date(item.dt_txt);
            
            // Dátum és idő formázása magyarul (Pl: Hétfő, 14:00)
            const dayName = dateObj.toLocaleDateString('hu-HU', { weekday: 'long' });
            const time = dateObj.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });
            const fullDate = item.dt_txt.split(" ")[0]; // Csak a dátum (YYYY-MM-DD)

            const temp = item.main.temp.toFixed(1); // 1 tizedesjegy
            const desc = item.weather[0]!.description;

            // Kiíratás a konzolra szép formátumban
            console.log(` ${fullDate} (${dayName})  ${time} ->  ${temp}°C, ${desc}`);
        });

        console.log("==================================================");

    } catch (error) {
        console.error('Hiba történt az API hívása közben:', error);
    }
}


// 3. DOM KEZELÉS ÉS ESEMÉNYEK


function getCityName(): string {
    const cityNameInput = document.getElementById('cityInput') as HTMLInputElement;
    return cityNameInput ? cityNameInput.value : "";
}

function initApp(): void {
    const btn = document.querySelector(".button-search") as HTMLButtonElement;
    
    // Csak akkor adjuk hozzá az eseményt, ha létezik a gomb (biztonság)
    if (btn) {
        btn.addEventListener("click", () => {
            const city = getCityName();
            if (city.trim().length > 0) {
                fetchWeatherForecast(city);
            } else {
                console.warn("Kérlek adj meg egy városnevet!");
            }
        });
    }

}

// 4. PROGRAM INDÍTÁSA
initApp();