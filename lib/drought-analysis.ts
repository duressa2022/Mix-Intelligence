import { query } from './db';

export interface DroughtIndex {
  region_id: string;
  spi_3month: number; // Standardized Precipitation Index
  spi_6month: number;
  ndvi: number; // Normalized Difference Vegetation Index
  soil_moisture: number; // Percentage
  anomaly_score: number; // -1 to 1, where -1 is severe drought
  severity_level: 'none' | 'mild' | 'moderate' | 'severe' | 'extreme';
  confidence: number; // 0-100
}

export function calculateDroughtIndex(weatherData: {
  precipitation: number;
  temperature: number;
  humidity: number;
  evapotranspiration: number;
}): Partial<DroughtIndex> {
  // Simplified drought calculations (production would use more sophisticated models)
  const moistureDeficit = weatherData.evapotranspiration - weatherData.precipitation;
  const normalizedPrecip = Math.max(0, (weatherData.precipitation - 50) / 100);
  const tempAnomaly = (weatherData.temperature - 20) / 10;

  const anomalyScore = (normalizedPrecip - 0.3) - (tempAnomaly * 0.1);
  const severity = getSeverityLevel(anomalyScore);

  return {
    anomaly_score: anomalyScore,
    severity_level: severity,
    confidence: Math.min(100, Math.abs(anomalyScore) * 100),
  };
}

export function getSeverityLevel(
  anomalyScore: number
): 'none' | 'mild' | 'moderate' | 'severe' | 'extreme' {
  if (anomalyScore > 0.5) return 'none';
  if (anomalyScore > 0.2) return 'mild';
  if (anomalyScore > -0.2) return 'moderate';
  if (anomalyScore > -0.5) return 'severe';
  return 'extreme';
}

export async function getRegionalDroughtIndex(
  regionId: string,
  days: number = 30
): Promise<DroughtIndex | null> {
  const results = await query(
    `SELECT * FROM drought_indices 
     WHERE region_id = $1 AND created_at > NOW() - INTERVAL '1 day'
     ORDER BY created_at DESC LIMIT 1`,
    [regionId]
  );

  return results.length > 0 ? (results[0] as DroughtIndex) : null;
}

export async function predictDrought(
  regionId: string,
  days: number = 30
): Promise<{ date: string; predictedSeverity: string; probability: number }[]> {
  // Get historical data
  const historicalData = await query(
    `SELECT * FROM drought_indices 
     WHERE region_id = $1 AND created_at > NOW() - INTERVAL '90 days'
     ORDER BY created_at DESC`,
    [regionId]
  );

  if (historicalData.length === 0) {
    return [];
  }

  // Simplified time-series prediction
  const predictions = [];
  const latestData = historicalData[0] as any;
  const baselineScore = latestData.anomaly_score || 0;

  // Use a minimal baseline trend if we don't have enough data for a real calculation
  const trend = historicalData.length >= 10 ? calculateTrend(historicalData as any[]) : -0.01;

  for (let i = 1; i <= days; i++) {
    const predictedScore = baselineScore + trend * (i / 30);
    const severity = getSeverityLevel(predictedScore);
    const probability = Math.min(100, 60 + Math.abs(predictedScore) * 20);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + i);

    predictions.push({
      date: futureDate.toISOString().split('T')[0],
      predictedSeverity: severity,
      probability: Math.round(probability),
    });
  }

  return predictions;
}

function calculateTrend(data: any[]): number {
  if (data.length < 2) return 0;

  let sumXY = 0;
  let sumX = 0;
  let sumY = 0;
  let sumX2 = 0;

  for (let i = 0; i < Math.min(data.length, 30); i++) {
    const x = i;
    const y = data[i].anomaly_score || 0;
    sumXY += x * y;
    sumX += x;
    sumY += y;
    sumX2 += x * x;
  }

  const n = Math.min(data.length, 30);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  return isNaN(slope) ? 0 : slope;
}

export async function getAffectedAreas(
  severityLevel: string = 'severe'
): Promise<any[]> {
  const results = await query(
    `SELECT r.id, r.name, r.latitude, r.longitude, d.severity_level, d.anomaly_score
     FROM drought_indices d
     JOIN regions r ON d.region_id = r.id
     WHERE d.severity_level = ANY($1::text[])
     AND d.created_at > NOW() - INTERVAL '1 day'
     ORDER BY d.anomaly_score DESC`,
    [[severityLevel, 'extreme']]
  );

  return results;
}

export async function calculateWaterAvailability(regionId: string): Promise<{
  available: number;
  deficit: number;
  usage: number;
  reservePercentage: number;
}> {
  const results = await query(
    `SELECT 
      wr.available_water,
      wr.water_deficit,
      wr.total_usage,
      (wr.available_water / NULLIF(wr.available_water + wr.water_deficit, 0) * 100) as reserve_percentage
     FROM water_resources wr
     WHERE wr.region_id = $1
     ORDER BY wr.created_at DESC LIMIT 1`,
    [regionId]
  );

  if (results.length === 0) {
    return { available: 0, deficit: 0, usage: 0, reservePercentage: 0 };
  }

  const data = results[0] as any;
  return {
    available: data.available_water || 0,
    deficit: data.water_deficit || 0,
    usage: data.total_usage || 0,
    reservePercentage: data.reserve_percentage || 0,
  };
}
