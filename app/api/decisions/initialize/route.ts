import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult.response) return authResult.response;

    try {
        const { strategyId } = await request.json();

        if (!strategyId) {
            return NextResponse.json({ error: 'Strategy ID is required' }, { status: 400 });
        }

        // 1. Update the strategy status to 'ongoing'
        // Also update the start_date to now
        await query(`
      UPDATE mitigation_strategies
      SET implementation_status = 'ongoing', 
          start_date = CURRENT_DATE,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [strategyId]);

        // 2. Fetch the updated strategy for feedback
        const updated = await query(`
      SELECT title FROM mitigation_strategies WHERE id = $1
    `, [strategyId]);

        // 3. Log the action in audit_logs if possible (skipped for simplicity here)

        return NextResponse.json({
            message: `Protocol '${updated[0]?.title}' initialized successfully`,
            status: 'ongoing'
        });
    } catch (error) {
        console.error('Protocol initialization error:', error);
        return NextResponse.json({ error: 'Failed to initialize protocol' }, { status: 500 });
    }
}
