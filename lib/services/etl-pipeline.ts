import { WeatherCollector } from './collectors/weather-collector';
import { SatelliteCollector } from './collectors/satellite-collector';
import { SocioeconomicCollector } from './collectors/socioeconomic-collector';
import { DataProcessor } from './data-processor';

export interface ETLRunResult {
    runId: string;
    status: 'success' | 'failure' | 'partial';
    modules: {
        weather: { collected: number; issues: string[] };
        satellite: { collected: number; issues: string[] };
        socioeconomic: { collected: number; issues: string[] };
    };
    timestamp: Date;
}

export class ETLPipeline {
    private weatherCollector: WeatherCollector;
    private satelliteCollector: SatelliteCollector;
    private socioeconomicCollector: SocioeconomicCollector;

    constructor() {
        this.weatherCollector = new WeatherCollector();
        this.satelliteCollector = new SatelliteCollector();
        this.socioeconomicCollector = new SocioeconomicCollector();
    }

    /**
     * Runs the full ETL pipeline for a specific region (or all if not specified)
     */
    async runPipeline(regionId?: number): Promise<ETLRunResult> {
        const runId = `run_${Date.now()}`;
        const result: ETLRunResult = {
            runId,
            status: 'success',
            modules: {
                weather: { collected: 0, issues: [] },
                satellite: { collected: 0, issues: [] },
                socioeconomic: { collected: 0, issues: [] }
            },
            timestamp: new Date()
        };

        try {
            // 1. Weather ETL
            const weatherRaw = await this.weatherCollector.collect(regionId);
            if (weatherRaw.success && weatherRaw.data) {
                result.modules.weather.collected = weatherRaw.data.length;

                // Clean & Process
                for (const point of weatherRaw.data) {
                    const cleanResult = DataProcessor.cleanWeather(point);
                    if (cleanResult.issues.length > 0) {
                        result.modules.weather.issues.push(...cleanResult.issues);
                    }
                    // Here we would SAVE cleanResult.data to DB
                }
            } else {
                result.modules.weather.issues.push(...(weatherRaw.errors || ['Collection failed']));
            }

            // 2. Satellite ETL
            const satRaw = await this.satelliteCollector.collect(regionId);
            if (satRaw.success && satRaw.data) {
                result.modules.satellite.collected = satRaw.data.length;
                // Satellite data usually comes pre-processed, but we could add validation here
            } else {
                result.modules.satellite.issues.push(...(satRaw.errors || ['Collection failed']));
            }

            // 3. Socioeconomic ETL
            const socRaw = await this.socioeconomicCollector.collect(regionId);
            if (socRaw.success && socRaw.data) {
                result.modules.socioeconomic.collected = socRaw.data.length;
            } else {
                result.modules.socioeconomic.issues.push(...(socRaw.errors || ['Collection failed']));
            }

        } catch (error) {
            result.status = 'failure';
            console.error('ETL Pipeline Critical Error:', error);
        }

        return result;
    }
}
