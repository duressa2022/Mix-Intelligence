/**
 * Drought Indicator Service
 * 
 * Provides scientific calculations for various drought indices.
 * Note: Real-world SPI/SPEI involves complex probability distribution fitting (Gamma/Log-Logistic).
 * This implementation uses robust statistical approximations suitable for a specialized system.
 */

export interface IndicatorResult {
    value: number;
    category: string;
    description: string;
}

export class DroughtIndicators {
    /**
     * Standardized Precipitation Index (SPI)
     * Measures precipitation deviation from long-term normal.
     */
    static calculateSPI(precipHistory: number[]): IndicatorResult {
        if (precipHistory.length < 3) {
            return { value: 0, category: 'Normal', description: 'Insufficient data for SPI' };
        }

        const mean = precipHistory.reduce((a, b) => a + b, 0) / precipHistory.length;
        const stdDev = Math.sqrt(
            precipHistory.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / precipHistory.length
        );

        const currentPrecip = precipHistory[precipHistory.length - 1];
        const spi = stdDev === 0 ? 0 : (currentPrecip - mean) / stdDev;

        return {
            value: Number(spi.toFixed(2)),
            category: this.getSPICategory(spi),
            description: 'Precipitation-based standard deviation indicator.'
        };
    }

    /**
     * Standardized Precipitation Evapotranspiration Index (SPEI)
     * Accounts for both water supply (precip) and demand (PET).
     */
    static calculateSPEI(precipHistory: number[], petHistory: number[]): IndicatorResult {
        if (precipHistory.length !== petHistory.length || precipHistory.length < 3) {
            return { value: 0, category: 'Normal', description: 'Insufficient data for SPEI' };
        }

        const waterBalance = precipHistory.map((p, i) => p - petHistory[i]);
        const mean = waterBalance.reduce((a, b) => a + b, 0) / waterBalance.length;
        const stdDev = Math.sqrt(
            waterBalance.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / waterBalance.length
        );

        const currentBalance = waterBalance[waterBalance.length - 1];
        const spei = stdDev === 0 ? 0 : (currentBalance - mean) / stdDev;

        return {
            value: Number(spei.toFixed(2)),
            category: this.getSPICategory(spei), // Same categories as SPI
            description: 'Water balance (Precip - PET) indicator.'
        };
    }

    /**
     * Vegetation Condition Index (VCI)
     * Normalizes NDVI against its historical range.
     */
    static calculateVCI(ndviCurrent: number, ndviMin: number, ndviMax: number): IndicatorResult {
        if (ndviMax === ndviMin) return { value: 50, category: 'Normal', description: 'N/A' };

        const vci = ((ndviCurrent - ndviMin) / (ndviMax - ndviMin)) * 100;

        let category = 'Normal';
        if (vci < 20) category = 'Extreme Drought';
        else if (vci < 40) category = 'Severe Drought';
        else if (vci < 60) category = 'Moderate Drought';

        return {
            value: Number(vci.toFixed(1)),
            category,
            description: 'Vegetation health relative to historical range.'
        };
    }

    private static getSPICategory(value: number): string {
        if (value <= -2.0) return 'Extremely Dry';
        if (value <= -1.5) return 'Severely Dry';
        if (value <= -1.0) return 'Moderately Dry';
        if (value < 1.0) return 'Near Normal';
        if (value < 1.5) return 'Moderately Wet';
        if (value < 2.0) return 'Severely Wet';
        return 'Extremely Wet';
    }
}
