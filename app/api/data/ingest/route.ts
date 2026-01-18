import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { query } from '@/lib/db';
import { calculateDroughtIndex } from '@/lib/drought-analysis';

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult.response) return authResult.response;

  try {
    const body = await request.json();
    const { datasource, regions } = body;

    if (!datasource || !regions || !Array.isArray(regions)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const results = [];

    for (const regionData of regions) {
      const {
        region_id,
        temperature,
        precipitation,
        humidity,
        wind_speed,
        evapotranspiration,
        ndvi,
        vci,
        soil_moisture,
      } = regionData;

      // Calculate drought index
      const droughtCalc = calculateDroughtIndex({
        precipitation,
        temperature,
        humidity,
        evapotranspiration,
      });

      // Insert weather data
      const weatherResult = await query(
        `INSERT INTO weather_data 
         (region_id, temperature_celsius, precipitation_mm, humidity_percentage, wind_speed_kmh, evapotranspiration_mm, data_source, timestamp)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
         RETURNING *`,
        [region_id, temperature, precipitation, humidity, wind_speed, evapotranspiration, datasource]
      );

      // Insert satellite data
      if (ndvi !== undefined) {
        await query(
          `INSERT INTO satellite_data (region_id, ndvi, satellite_name, timestamp)
           VALUES ($1, $2, $3, NOW())`,
          [region_id, ndvi, datasource]
        );
      }

      // Insert soil data
      if (soil_moisture !== undefined) {
        await query(
          `INSERT INTO soil_data (region_id, soil_moisture_percentage, data_source, timestamp)
           VALUES ($1, $2, $3, NOW())`,
          [region_id, soil_moisture, datasource]
        );
      }

      // Update drought index
      await query(
        `INSERT INTO drought_indices 
         (region_id, spi_3month, spi_6month, ndvi, vci, soil_moisture, anomaly_score, severity_level, confidence_score, timestamp)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
         ON CONFLICT (region_id) DO UPDATE SET
         ndvi = $4, vci = $5, soil_moisture = $6, anomaly_score = $7, severity_level = $8, confidence_score = $9, timestamp = NOW()`,
        [
          region_id,
          precipitation * 0.3,
          precipitation * 0.5,
          ndvi || 0.5,
          vci || 50,
          soil_moisture || (humidity !== undefined ? humidity : 40),
          droughtCalc.anomaly_score,
          droughtCalc.severity_level,
          droughtCalc.confidence,
        ]
      );

      results.push({
        region_id,
        weatherInserted: weatherResult.length > 0,
        droughtIndexUpdated: true,
      });
    }

    return NextResponse.json(
      {
        message: 'Data ingested successfully',
        results,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Data ingest error:', error);
    return NextResponse.json(
      { error: 'Failed to ingest data' },
      { status: 500 }
    );
  }
}
