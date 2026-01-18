import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { query } from '@/lib/db';
import { calculateDroughtIndex } from '@/lib/drought-analysis';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult.response) return authResult.response;

  try {
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get('region_id');
    const days = parseInt(searchParams.get('days') || '30');

    if (!regionId) {
      return NextResponse.json(
        { error: 'region_id is required' },
        { status: 400 }
      );
    }

    const results = await query(
      `SELECT * FROM weather_data 
       WHERE region_id = $1 
       ORDER BY recorded_date DESC 
       LIMIT $2`,
      [regionId, days]
    );

    return NextResponse.json({ data: results });
  } catch (error) {
    console.error('Weather data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult.response) return authResult.response;

  try {
    const body = await request.json();
    const {
      region_id,
      temperature,
      precipitation,
      humidity,
      wind_speed,
      evapotranspiration,
      source,
    } = body;

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
       (region_id, temperature, precipitation, humidity, wind_speed, evapotranspiration, source, recorded_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING *`,
      [region_id, temperature, precipitation, humidity, wind_speed, evapotranspiration, source]
    );

    // Insert or update drought index
    await query(
      `INSERT INTO drought_indices 
       (region_id, spi_3month, spi_6month, ndvi, soil_moisture, anomaly_score, severity_level, confidence)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (region_id) DO UPDATE SET
       anomaly_score = $6, severity_level = $7, confidence = $8, updated_at = NOW()`,
      [
        region_id,
        precipitation * 0.3,
        precipitation * 0.5,
        0.5,
        humidity,
        droughtCalc.anomaly_score,
        droughtCalc.severity_level,
        droughtCalc.confidence,
      ]
    );

    return NextResponse.json(
      { data: weatherResult[0], droughtIndex: droughtCalc },
      { status: 201 }
    );
  } catch (error) {
    console.error('Weather data insertion error:', error);
    return NextResponse.json(
      { error: 'Failed to insert weather data' },
      { status: 500 }
    );
  }
}
