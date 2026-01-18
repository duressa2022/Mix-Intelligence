import { BaseCollector, CollectionResult } from './base-collector';

export interface SatelliteDataPoint {
    ndvi: number;
    vhi: number;
    vci: number;
    cloudCover: number;
    region_id: number;
    timestamp: Date;
}

export class SatelliteCollector extends BaseCollector<SatelliteDataPoint> {
    protected name = 'NASAMODISCollector';
    protected sourceType: 'satellite' = 'satellite';

    async collect(regionId?: number): Promise<CollectionResult<SatelliteDataPoint>> {
        // In a production system, this would fetch from NASA/Sentinel APIs
        // Here we simulate the extraction of NDVI and calculation of VCI

        const targetRegionId = regionId || 1;

        // Simulate NDVI (0.0 to 1.0)
        const ndvi = 0.1 + (Math.random() * 0.7);

        // VCI Calculation: (NDVI_current - NDVI_min) / (NDVI_max - NDVI_min) * 100
        // We simulate a max/min context for the region
        const ndviMin = 0.1;
        const ndviMax = 0.85;
        const vci = Math.min(100, Math.max(0, ((ndvi - ndviMin) / (ndviMax - ndviMin)) * 100));

        // VHI is often an average of VCI and TCI (Thermal Condition Index)
        const vhi = (vci + (30 + Math.random() * 40)) / 2;

        const dataPoint: SatelliteDataPoint = {
            region_id: targetRegionId,
            ndvi: parseFloat(ndvi.toFixed(3)),
            vci: Math.round(vci),
            vhi: Math.round(vhi),
            cloudCover: Math.round(Math.random() * 20),
            timestamp: new Date()
        };

        return {
            success: true,
            data: [dataPoint],
            source: this.name,
            timestamp: new Date()
        };
    }
}
