import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult.response) return authResult.response;

  try {
    // 1. Check if mitigation strategies exist
    let strategies = await query(`
      SELECT 
        ms.id,
        ms.title, 
        ms.description, 
        ms.strategy_type, 
        ms.implementation_status, 
        ms.effectiveness_score, 
        r.name as region_name
      FROM mitigation_strategies ms
      JOIN regions r ON ms.region_id = r.id
      ORDER BY ms.created_at DESC
      LIMIT 10
    `);

    // 2. Auto-seed if empty
    if (strategies.length === 0) {
      const regionsRes = await query('SELECT id, name FROM regions LIMIT 5');
      if (regionsRes.length > 0) {
        const regionIds = regionsRes.map((r: any) => r.id);
        const seedValues = [
          ['Advanced Drip Irrigation', 'Implementation of solar-powered drip systems for small-holder farmers.', 'irrigation', 'ongoing', 0.88],
          ['Emergency Water Rationing', 'Restrict non-essential water usage to 50L/day per household.', 'policy', 'planned', 0.95],
          ['Cloud Seeding Operation', 'Neural-guided atmospheric aerosol injection for precipitation enhancement.', 'other', 'completed', 0.65],
          ['Defensive Reforestation', 'Strategic planting of drought-resistant Acacia belts.', 'other', 'ongoing', 0.78],
          ['Aquifer Recharge', 'Drilling deep-bore wells to tap dormant aquifers.', 'irrigation', 'planned', 0.82]
        ];

        for (let i = 0; i < seedValues.length; i++) {
          const rid = regionIds[i % regionIds.length];
          await query(`
            INSERT INTO mitigation_strategies (region_id, title, description, strategy_type, implementation_status, effectiveness_score)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [rid, ...seedValues[i]]);
        }

        // Also seed some water stress data
        for (const rid of regionIds) {
          await query(`
            INSERT INTO water_resources (region_id, timestamp, reservoir_level_meters, reservoir_capacity_cubic_meters)
            VALUES ($1, NOW(), $2, 100)
            ON CONFLICT DO NOTHING
          `, [rid, 40 + Math.random() * 40]);

          await query(`
            INSERT INTO soil_data (region_id, timestamp, soil_moisture_percentage)
            VALUES ($1, NOW(), $2)
          `, [rid, 15 + Math.random() * 50]);
        }

        strategies = await query(`
          SELECT 
            ms.id,
            ms.title, 
            ms.description, 
            ms.strategy_type, 
            ms.implementation_status, 
            ms.effectiveness_score, 
            r.name as region_name
          FROM mitigation_strategies ms
          JOIN regions r ON ms.region_id = r.id
          ORDER BY ms.created_at DESC
          LIMIT 10
        `);
      }
    }

    // 3. Fetch Water Stress Indicators from View
    const waterStress = await query(`
      SELECT * FROM water_stress_indicators
      ORDER BY soil_stress_index DESC
      LIMIT 5
    `);

    // 4. Summarize stats
    const stats = {
      plannedCount: strategies.filter((s: any) => s.implementation_status === 'planned').length,
      ongoingCount: strategies.filter((s: any) => s.implementation_status === 'ongoing').length,
      completedCount: strategies.filter((s: any) => s.implementation_status === 'completed').length,
    };

    return NextResponse.json({
      strategies,
      waterStress,
      stats
    });
  } catch (error) {
    console.error('Decision advisory fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch decision advisory' }, { status: 500 });
  }
}
