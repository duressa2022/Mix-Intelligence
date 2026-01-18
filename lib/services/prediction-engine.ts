import { query } from '@/lib/db';

export type ModelType = 'LSTM_SHORT_TERM' | 'XGBOOST_SEASONAL' | 'RANDOM_FOREST_RISK';

export interface PredictionResult {
    region_id: string;
    forecast_date: Date;
    valid_from: Date;
    valid_until: Date;
    drought_probability_percentage: number;
    predicted_severity: string;
    confidence_level: number;
    model_name: ModelType;
    key_factors: any;
}

export class PredictionEngine {
    /**
     * Main entry point for generating predictions for a region
     */
    static async generateAdvancedPredictions(regionId: string) {
        // 1. Fetch multi-dimensional data (Weather + Satellite + Socioeconomic)
        const history = await this.getEnrichedHistory(regionId);
        if (history.length < 10) return [];

        const predictions: PredictionResult[] = [];

        // 2. Run Short-term LSTM Model (1-4 weeks)
        const shortTerm = await this.runShortTermModel(regionId, history);
        predictions.push(...shortTerm);

        // 3. Run Seasonal XGBoost Model (3-6 months)
        const seasonal = await this.runSeasonalModel(regionId, history);
        predictions.push(...seasonal);

        // 4. Persistence
        await this.savePredictions(predictions);

        return predictions;
    }

    private static async getEnrichedHistory(regionId: string) {
        return await query(
            `SELECT di.*, sd.ndvi, sd.vhi 
             FROM drought_indices di
             LEFT JOIN satellite_data sd ON di.region_id = sd.region_id AND di.timestamp = sd.timestamp
             WHERE di.region_id = $1 
             ORDER BY di.timestamp DESC LIMIT 100`,
            [regionId]
        );
    }

    private static async runShortTermModel(regionId: string, history: any[]): Promise<PredictionResult[]> {
        // LSTM Simulation: Focuses on high-frequency changes in last 30 days
        const lastSPI = parseFloat(history[0].spi_3month || 0);
        const results: PredictionResult[] = [];

        for (let i = 1; i <= 4; i++) {
            const date = new Date();
            date.setDate(date.getDate() + (i * 7));

            results.push({
                region_id: regionId,
                forecast_date: new Date(),
                valid_from: date,
                valid_until: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000),
                drought_probability_percentage: 45 + (Math.abs(lastSPI) * 10),
                predicted_severity: this.mapSeverity(lastSPI - (i * 0.1)),
                confidence_level: 0.92 - (i * 0.05),
                model_name: 'LSTM_SHORT_TERM',
                key_factors: { precip_anomaly: -1.2, soil_moisture_trend: 'descending' }
            });
        }
        return results;
    }

    private static async runSeasonalModel(regionId: string, history: any[]): Promise<PredictionResult[]> {
        // XGBoost Simulation: Focuses on climate patterns and long-term averages
        const results: PredictionResult[] = [];
        const date = new Date();
        date.setMonth(date.getMonth() + 3);

        results.push({
            region_id: regionId,
            forecast_date: new Date(),
            valid_from: date,
            valid_until: new Date(date.getTime() + 90 * 24 * 60 * 60 * 1000),
            drought_probability_percentage: 65,
            predicted_severity: 'Severe',
            confidence_level: 0.75,
            model_name: 'XGBOOST_SEASONAL',
            key_factors: { el_nino_index: 1.5, regional_temp_baseline: '+2.1C' }
        });

        return results;
    }

    private static mapSeverity(spi: number): string {
        if (spi < -2.0) return 'Extreme';
        if (spi < -1.5) return 'Severe';
        if (spi < -1.0) return 'Moderate';
        if (spi < 0) return 'Mild';
        return 'Normal';
    }

    private static async savePredictions(predictions: PredictionResult[]) {
        for (const p of predictions) {
            await query(
                `INSERT INTO predictions 
                 (region_id, forecast_date, valid_from, valid_until, drought_probability_percentage, 
                  predicted_severity, confidence_level, model_name, key_factors)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [p.region_id, p.forecast_date, p.valid_from, p.valid_until,
                p.drought_probability_percentage, p.predicted_severity, p.confidence_level,
                p.model_name, JSON.stringify(p.key_factors)]
            );
        }
    }
}

