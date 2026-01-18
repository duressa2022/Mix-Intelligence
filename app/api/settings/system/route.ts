import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { query } from '@/lib/db';

async function ensureTable() {
    await query(`
    CREATE TABLE IF NOT EXISTS system_settings (
      key VARCHAR(100) PRIMARY KEY,
      value JSONB NOT NULL,
      description TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

    const existing = await query('SELECT COUNT(*) FROM system_settings');
    if (parseInt(existing[0].count) === 0) {
        await query(`
      INSERT INTO system_settings (key, value, description)
      VALUES 
        ('alert_thresholds', '{"low": 0.2, "medium": 0.5, "high": 0.8}', 'Drought anomaly score thresholds for alert levels'),
        ('data_polling', '{"interval_ms": 5000, "enabled": true}', 'Global dashboard data polling configuration'),
        ('regional_sync', '{"auto_ingest": false, "source": "Open-Meteo"}', 'Automatic data ingestion settings')
    `);
    }
}

export async function GET(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult.response) return authResult.response;

    try {
        await ensureTable();
        const settings = await query('SELECT * FROM system_settings');

        // Convert to a more usable object
        const settingsObj = settings.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        return NextResponse.json(settingsObj);
    } catch (error) {
        console.error('Settings fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult.response) return authResult.response;

    try {
        const body = await request.json();

        for (const [key, value] of Object.entries(body)) {
            await query(`
        INSERT INTO system_settings (key, value, updated_at)
        VALUES ($1, $2, CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP
      `, [key, value]);
        }

        return NextResponse.json({ message: 'System settings updated successfully' });
    } catch (error) {
        console.error('Settings update error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
