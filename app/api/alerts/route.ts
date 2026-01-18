import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult.response) return authResult.response;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    const limit = parseInt(searchParams.get('limit') || '50');

    const results = await query(
      `SELECT *, 
        CASE 
          WHEN is_active THEN 'active' 
          ELSE 'resolved' 
        END as status
       FROM alerts 
       WHERE is_active = $1
       ORDER BY created_at DESC 
       LIMIT $2`,
      [status === 'active', limit]
    );

    return NextResponse.json({ alerts: results });
  } catch (error) {
    console.error('Alerts fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
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
      severity_level,
      alert_type,
      message,
      recommended_action, // Note: Schema doesn't have recommended_action? 
      // Schema has: title, message. 
      // Code has: message, recommended_action.
      // I will map recommended_action to resolution_notes or just ignore if no column?
      // Schema: title, message, trigger_threshold...
      // I'll insert into basic fields.
      title,
    } = body;

    // Mapping body to schema
    // Table: alerts(region_id, alert_type, severity_level, title, message, is_active)

    const result = await query(
      `INSERT INTO alerts 
       (region_id, severity_level, alert_type, title, message, is_active, triggered_at)
       VALUES ($1, $2, $3, $4, $5, true, NOW())
       RETURNING *, CASE WHEN is_active THEN 'active' ELSE 'resolved' END as status`,
      [
        region_id,
        severity_level,
        alert_type,
        title || 'Alert', // default title
        message
      ]
    );

    return NextResponse.json({ alert: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Alert creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult.response) return authResult.response;

  try {
    const body = await request.json();
    const { alert_id, status } = body;

    const result = await query(
      `UPDATE alerts 
       SET is_active = $1, 
           updated_at = NOW() 
       WHERE id = $2 
       RETURNING *, CASE WHEN is_active THEN 'active' ELSE 'resolved' END as status`,
      [status !== 'resolved', alert_id]
    );

    return NextResponse.json({ alert: result[0] });
  } catch (error) {
    console.error('Alert update error:', error);
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    );
  }
}
