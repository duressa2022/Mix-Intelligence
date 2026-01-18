export interface WeatherData {
    temperature: number;
    humidity: number; // extrapolated or from separate endpoint
    windSpeed: number;
    precipitation: number;
    soilMoisture: number; // 0-1 cm
    time: string;
}

export async function fetchRealTimeWeather(lat: number, lon: number): Promise<WeatherData | null> {
    try {
        // Open-Meteo API (Free for non-commercial use, no key required)
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&hourly=soil_moisture_0_to_1cm&timezone=auto&forecast_days=1`;

        const response = await fetch(url);
        if (!response.ok) {
            console.error('Weather API error:', response.statusText);
            return null;
        }

        const data = await response.json();
        const current = data.current;

        // Get latest soil moisture (first hour?)
        const soilMoisture = data.hourly?.soil_moisture_0_to_1cm?.[0] || 0;

        return {
            temperature: current.temperature_2m,
            humidity: current.relative_humidity_2m,
            windSpeed: current.wind_speed_10m,
            precipitation: current.precipitation,
            soilMoisture: soilMoisture,
            time: current.time,
        };
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        return null;
    }
}
