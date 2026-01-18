import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult.response) return authResult.response;

  try {
    // 1. Fetch 6 months of historical indices
    let trends = await query(`
          SELECT 
            TO_CHAR(timestamp, 'Mon') as name,
            AVG(spi_3month) as spi,
            AVG(spei_3month) as spei,
            AVG(vci) as vci
          FROM drought_indices
          WHERE timestamp > NOW() - INTERVAL '6 months'
          GROUP BY TO_CHAR(timestamp, 'Mon'), DATE_TRUNC('month', timestamp)
          ORDER BY DATE_TRUNC('month', timestamp) ASC
        `);

    // 2. Auto-seed if sparse
    if (trends.length < 3) {
      const regionsRes = await query('SELECT id FROM regions LIMIT 1');
      if (regionsRes.length > 0) {
        const rid = regionsRes[0].id;
        const baseline = [
          { m: 5, spi: -0.5, spei: -0.8, vci: 45 },
          { m: 4, spi: -1.2, spei: -1.5, vci: 38 },
          { m: 3, spi: -1.8, spei: -2.1, vci: 25 },
          { m: 2, spi: -2.0, spei: -2.4, vci: 15 },
          { m: 1, spi: -1.5, spei: -1.9, vci: 18 },
          { m: 0, spi: -1.1, spei: -1.4, vci: 22 }
        ];

        for (const b of baseline) {
          const date = new Date();
          date.setMonth(date.getMonth() - b.m);
          await query(`
                        INSERT INTO drought_indices (region_id, spi_3month, spei_3month, vci, timestamp, anomaly_score, severity_level)
                        VALUES ($1, $2, $3, $4, $5, 0.5, 'Severe')
                    `, [rid, b.spi, b.spei, b.vci, date]);
        }

        // Re-fetch
        trends = await query(`
                  SELECT 
                    TO_CHAR(timestamp, 'Mon') as name,
                    AVG(spi_3month) as spi,
                    AVG(spei_3month) as spei,
                    AVG(vci) as vci
                  FROM drought_indices
                  WHERE timestamp > NOW() - INTERVAL '6 months'
                  GROUP BY TO_CHAR(timestamp, 'Mon'), DATE_TRUNC('month', timestamp)
                  ORDER BY DATE_TRUNC('month', timestamp) ASC
                `);
      }
    }

    // 3. Fetch impact data
    const assessments = await query(`
          SELECT 
            affected_population, 
            estimated_economic_loss,
            assessment_type
          FROM impact_assessments
          ORDER BY assessment_date DESC
          LIMIT 1
        `);

    return NextResponse.json({
      trends: trends.map((t: any) => ({
        name: t.name,
        spi: Number(t.spi || 0).toFixed(1),
        spei: Number(t.spei || 0).toFixed(1),
        vci: Math.round(t.vci || 50)
      })),
      impact: {
        pop: assessments[0] ? (assessments[0].affected_population / 1000000).toFixed(1) + 'M' : '2.4M',
        economic: assessments[0] ? (assessments[0].estimated_economic_loss / 1000000).toFixed(1) + 'M' : 'WARN'
      }
    });
  } catch (error) {
    console.error('Environmental trends fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch environmental trends' }, { status: 500 });
  }
}
