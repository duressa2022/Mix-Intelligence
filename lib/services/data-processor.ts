/**
 * DataProcessor Service
 * Handles data cleaning, validation, and transformation.
 */

export interface CleanedDataResult<T> {
    valid: boolean;
    data: T;
    issues: string[];
}

export class DataProcessor {
    /**
     * Cleans weather data by removing outliers and checking bounds.
     */
    static cleanWeather(data: any): CleanedDataResult<any> {
        const issues: string[] = [];
        let valid = true;

        // Deep copy to avoid mutating original
        const cleaned = { ...data };

        // 1. Outlier Detection (Simple Z-Score like thresholds)
        // Temperature: -50C to 60C
        if (cleaned.temperature && (cleaned.temperature > 60 || cleaned.temperature < -50)) {
            issues.push(`Outlier Detected: Temperature ${cleaned.temperature}C is out of bounds (-50 to 60). Marking as null.`);
            cleaned.temperature = null; // Set to null or clamp? Null is safer for scientific data.
        }

        // Humidity: 0% to 100%
        if (cleaned.humidity && (cleaned.humidity < 0 || cleaned.humidity > 100)) {
            issues.push(`Invalid Humidity: ${cleaned.humidity}%. Clamping to range.`);
            cleaned.humidity = Math.max(0, Math.min(100, cleaned.humidity));
        }

        // Wind Speed: > 0
        if (cleaned.windSpeed && cleaned.windSpeed < 0) {
            issues.push(`Invalid Wind Speed: ${cleaned.windSpeed}. Setting to 0.`);
            cleaned.windSpeed = 0;
        }

        // 2. Missing Data Handling (Simple Imputation)
        // If precipitation is missing, assume 0 for now (risky, but standard placeholder)
        if (cleaned.precipitation === undefined || cleaned.precipitation === null) {
            issues.push('Missing Precipitation: Defaulting to 0.');
            cleaned.precipitation = 0;
        }

        return {
            valid,
            data: cleaned,
            issues
        };
    }

    /**
     * Aggregates hourly data into daily summaries.
     * (Mock implementation for now)
     */
    static aggregateDaily(hourlyData: any[]): any {
        if (!hourlyData || hourlyData.length === 0) return null;

        // Calculate simple averages
        const sumTemp = hourlyData.reduce((acc, curr) => acc + (curr.temperature || 0), 0);
        const avgTemp = sumTemp / hourlyData.length;

        return {
            avgTemperature: avgTemp,
            sampleCount: hourlyData.length
        };
    }
}
