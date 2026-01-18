const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function seedVci() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('Connected to DB');

        // Get region 1
        const res = await client.query('SELECT name FROM regions WHERE id = 1');
        if (res.rows.length === 0) {
            console.log('Region 1 not found');
            return;
        }

        const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];

        for (let i = 0; i < 6; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - (5 - i));

            // Simulate a trend: getting drier/stressed then recovered
            const vci = [45, 38, 25, 15, 18, 22][i] + (Math.random() * 5);
            const spi = [-0.5, -1.2, -1.8, -2.0, -1.5, -1.1][i];

            await client.query(`
            INSERT INTO drought_indices (region_id, vci, spi_3month, spi_6month, spei_3month, timestamp, anomaly_score, severity_level)
            VALUES (1, $1, $2, $2 * 1.2, $2 * 1.3, $3, 0.4 + (Math.random() * 0.4), 'Severe')
        `, [vci, spi, date]);
        }

        console.log('Historical VCI seed completed');
    } catch (err) {
        console.error('Seed error:', err);
    } finally {
        await client.end();
    }
}

seedVci();
