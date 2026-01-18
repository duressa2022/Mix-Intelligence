import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult.response) return authResult.response;

    try {
        // 1. Get all regions to broadcast to
        const regions = await query('SELECT id, name FROM regions');

        if (regions.length === 0) {
            return NextResponse.json({ error: 'No regions found for broadcast' }, { status: 404 });
        }

        // 2. Create high-priority alerts for each region
        // In a real system, this would also trigger SMS/Gateway integrations
        const broadcastTitle = "CRITICAL: SYSTEM OVERRIDE - Emergency Drought Deployment Initialized";

        for (const region of regions) {
            await query(`
            INSERT INTO alerts (region_id, alert_type, title, message, severity, is_active, triggered_at)
            VALUES ($1, 'Critical', $2, 'Global system-wide emergency protocol activated by authorized override.', 'Critical', true, NOW())
        `, [region.id, broadcastTitle]);
        }

        // 3. Optional: Sync with external gateways would happen here

        return NextResponse.json({
            message: `Emergency broadcast transmitted to ${regions.length} regions successfully`,
            regionsCovered: regions.length,
            protocol: 'NEURAL-LINK-7'
        });
    } catch (error) {
        console.error('Emergency broadcast error:', error);
        return NextResponse.json({ error: 'Failed to transmit emergency broadcast' }, { status: 500 });
    }
}
