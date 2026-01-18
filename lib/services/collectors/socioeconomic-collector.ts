import { BaseCollector, CollectionResult } from './base-collector';

export interface SocioeconomicDataPoint {
    cropYield?: number;
    livestockHealth?: number;
    marketPrice?: number;
    malnutritionRate?: number;
    region: string;
}

export class SocioeconomicCollector extends BaseCollector<SocioeconomicDataPoint> {
    protected name = 'ManualSocioeconomicCollector';
    protected sourceType: 'socioeconomic' = 'socioeconomic';

    async collect(regionId?: number): Promise<CollectionResult<SocioeconomicDataPoint>> {
        // Since socioeconomic data is often manual or from CSVs, this collector might 
        // parse a file or mock data for now.

        // Mocking an external data source fetch
        const mockData: SocioeconomicDataPoint[] = [
            {
                region: 'Oromia East',
                cropYield: 2.5, // tonnes/ha
                livestockHealth: 0.85, // index
                marketPrice: 450, // ETB for staple
                malnutritionRate: 12.5
            },
            {
                region: 'Somali Region',
                cropYield: 1.2,
                livestockHealth: 0.60,
                marketPrice: 600,
                malnutritionRate: 22.0
            }
        ];

        return Promise.resolve({
            success: true,
            data: mockData,
            source: this.name,
            timestamp: new Date()
        });
    }
}
