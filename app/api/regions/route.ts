import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult.response) return authResult.response;

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const results = await query(
      `SELECT * FROM regions ORDER BY name LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await query('SELECT COUNT(*) as count FROM regions');
    const total = (countResult[0] as any).count;

    return NextResponse.json({
      regions: results,
      pagination: { limit, offset, total },
    });
  } catch (error) {
    console.error('Regions fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch regions' },
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
      name,
      country,
      latitude,
      longitude,
      area_km2,
      population,
      primary_crop,
    } = body;

    const result = await query(
      `INSERT INTO regions (name, country, latitude, longitude, area_km2, population, primary_crop)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, country, latitude, longitude, area_km2, population, primary_crop]
    );

    return NextResponse.json({ region: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Region creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create region' },
      { status: 500 }
    );
  }
}
