import { BaseCollector, CollectionResult } from './base-collector';

export interface WeatherDataPoint {
    temperature: number;
    humidity: number;
    windSpeed: number;
    precipitation: number;
    soilMoisture: number;
    description?: string;
}

export class WeatherCollector extends BaseCollector<WeatherDataPoint> {
    protected name = 'OpenWeatherCollector';
    protected sourceType: 'weather' = 'weather';
    private apiKey: string;

    constructor() {
        super();
        this.apiKey = process.env.OPENWEATHER_API_KEY || '';
    }

    async collect(regionId?: number): Promise<CollectionResult<WeatherDataPoint>> {
        const results: WeatherDataPoint[] = [];
        const errors: string[] = [];

        // In a real implementation, we would fetch the region's coordinates from the DB
        // For this POC, we'll mock or use a hardcoded coordinate if no region is provided
        const lat = 9.145; // Example: Ethiopia
        const lon = 40.489;

        try {
            // Reusing logic from the original weather.ts but wrapped in this structure
            // Open-Meteo is free and doesn't require key, creating a fallback or primary here
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&hourly=soil_moisture_0_to_1cm&timezone=auto&forecast_days=1`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.statusText}`);
            }

            const data = await response.json();
            const current = data.current;
            const soilMoisture = data.hourly?.soil_moisture_0_to_1cm?.[0] || 0;

            const dataPoint: WeatherDataPoint = {
                temperature: current.temperature_2m,
                humidity: current.relative_humidity_2m,
                windSpeed: current.wind_speed_10m,
                precipitation: current.precipitation,
                soilMoisture: soilMoisture,
                description: 'Real-time data from Open-Meteo'
            };

            results.push(dataPoint);

            // Here we would ideally save to the 'weather_data' table
            // But for the 'collect' method, we just return the data

            return {
                success: true,
                data: results,
                source: this.name,
                timestamp: new Date()
            };

        } catch (error) {
            return {
                success: false,
                errors: [this.handleError(error)],
                source: this.name,
                timestamp: new Date()
            };
        }
    }
}
