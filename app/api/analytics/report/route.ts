import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult.response) return authResult.response;

  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const regionId = searchParams.get('region_id');

    let whereClause = 'WHERE timestamp > NOW() - INTERVAL \'1 day\' * $1';
    const params: any[] = [days];

    if (regionId) {
      whereClause += ' AND region_id = $2';
      params.push(regionId);
    }

    // 1. Get drought statistics (fixed confidence column name)
    const droughtStats = await query(
      `SELECT 
        COUNT(*) as total_records,
        AVG(anomaly_score) as avg_anomaly,
        MIN(anomaly_score) as min_anomaly,
        MAX(anomaly_score) as max_anomaly,
        AVG(confidence_score) as avg_confidence
       FROM drought_indices
       ${whereClause}`,
      params
    );

    // 2. Get severity distribution
    const severityDist = await query(
      `SELECT severity_level as severity_level, COUNT(*) as count
       FROM drought_indices
       ${whereClause}
       GROUP BY severity_level`,
      params
    );

    // 3. Get alert statistics (fixed table name)
    const alertStats = await query(
      `SELECT status as status, COUNT(*) as count
       FROM alerts
       ${whereClause}
       GROUP BY status`,
      params
    );

    // 4. Get trending regions
    const trendingRegions = await query(
      `SELECT r.name, d.severity_level, d.anomaly_score, COUNT(*) as readings
       FROM drought_indices d
       JOIN regions r ON d.region_id = r.id
       ${whereClause}
       GROUP BY r.name, d.severity_level, d.anomaly_score
       ORDER BY d.anomaly_score DESC
       LIMIT 10`,
      params
    );

    return NextResponse.json({
      period: `Last ${days} days`,
      droughtStatistics: droughtStats[0],
      severityDistribution: severityDist,
      alertStatistics: alertStats,
      topAffectedRegions: trendingRegions,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
