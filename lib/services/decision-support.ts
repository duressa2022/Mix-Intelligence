import { query } from '@/lib/db';

export interface Recommendation {
    id: string;
    type: 'irrigation' | 'water_distribution' | 'crop_advice' | 'livestock' | 'policy';
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    title: string;
    message: string;
    action_item: string;
    region_id: string;
}

export class DecisionSupportService {
    /**
     * Generates a suite of recommendations for a region based on the latest predictions
     */
    static async generateRecommendations(regionId: string): Promise<Recommendation[]> {
        const latestStats = await query(
            `SELECT p.predicted_severity, p.drought_probability_percentage 
             FROM predictions p 
             WHERE p.region_id = $1 
             ORDER BY p.forecast_date DESC LIMIT 1`,
            [regionId]
        );

        if (latestStats.length === 0) return [];

        const { predicted_severity, drought_probability_percentage } = latestStats[0] as any;
        const recommendations: Recommendation[] = [];

        // 1. Irrigation & Water Rationing
        if (predicted_severity === 'Extreme' || predicted_severity === 'Severe') {
            recommendations.push({
                id: `rec_ir_${Date.now()}`,
                type: 'irrigation',
                priority: 'Critical',
                title: 'Emergency Water Rationing',
                message: `${predicted_severity} drought predicted with ${drought_probability_percentage}% confidence.`,
                action_item: 'Immediately suspend non-essential irrigation and initiate water trucking to rural reservoirs.',
                region_id: regionId
            });
        }

        // 2. Crop Advice
        if (predicted_severity !== 'Normal') {
            recommendations.push({
                id: `rec_cr_${Date.now()}`,
                type: 'crop_advice',
                priority: 'High',
                title: 'Planting Advisory',
                message: 'Moisture deficit predicted for the upcoming season.',
                action_item: 'Recommend transition to drought-resistant maize varieties and millet. Suspend luxury crop planting.',
                region_id: regionId
            });
        }

        // 3. Livestock Relocation
        if (drought_probability_percentage > 70 && (predicted_severity === 'Extreme' || predicted_severity === 'Severe')) {
            recommendations.push({
                id: `rec_ls_${Date.now()}`,
                type: 'livestock',
                priority: 'High',
                title: 'Livestock Relocation Alert',
                message: 'Grazing lands expected to deteriorate rapidly.',
                action_item: 'Advise pastoralists to move livestock to northern green belts or secure fodder reserves.',
                region_id: regionId
            });
        }

        return recommendations;
    }
}
