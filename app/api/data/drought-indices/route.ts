import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { query } from '@/lib/db';
import { predictDrought, getAffectedAreas } from '@/lib/drought-analysis';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult.response) return authResult.response;

  try {
    const { searchParams } = new URL(request.url);
    const regionId = searchParams.get('region_id');
    const type = searchParams.get('type') || 'current';

    if (!regionId) {
      return NextResponse.json(
        { error: 'region_id is required' },
        { status: 400 }
      );
    }

    if (type === 'prediction') {
      const predictions = await predictDrought(regionId, 30);
      return NextResponse.json({ predictions });
    }

    if (type === 'affected') {
      const severity = searchParams.get('severity') || 'severe';
      const affected = await getAffectedAreas(severity);
      return NextResponse.json({ affectedAreas: affected });
    }

    // Current drought indices
    const results = await query(
      `SELECT * FROM drought_indices 
       WHERE region_id = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [regionId]
    );

    return NextResponse.json({
      current: results.length > 0 ? results[0] : null,
    });
  } catch (error) {
    console.error('Drought indices fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drought indices' },
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
      spi_3month,
      spi_6month,
      ndvi,
      soil_moisture,
      anomaly_score,
      severity_level,
      confidence,
      source,
    } = body;

    const result = await query(
      `INSERT INTO drought_indices 
       (region_id, spi_3month, spi_6month, ndvi, soil_moisture, anomaly_score, severity_level, confidence, data_source)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        region_id,
        spi_3month,
        spi_6month,
        ndvi,
        soil_moisture,
        anomaly_score,
        severity_level,
        confidence,
        source,
      ]
    );

    return NextResponse.json({ data: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Drought indices insertion error:', error);
    return NextResponse.json(
      { error: 'Failed to insert drought indices' },
      { status: 500 }
    );
  }
}
