const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function seed() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('Connected to DB');

        // 1. Get region IDs
        const regionsRes = await client.query('SELECT id, name FROM regions LIMIT 5');
        if (regionsRes.rows.length === 0) {
            console.log('No regions found. Please run core seeds first.');
            return;
        }
        const regionIds = regionsRes.rows.map(r => r.id);

        // 2. Seed Mitigation Strategies
        const strategies = [
            ['Advanced Drip Irrigation', 'Implementation of solar-powered drip systems for small-holder farmers.', 'irrigation', 'ongoing', 0.88],
            ['Emergency Water Rationing', 'Restrict non-essential water usage to 50L/day per household.', 'policy', 'planned', 0.95],
            ['Cloud Seeding Operation', 'Neural-guided atmospheric aerosol injection for precipitation enhancement.', 'other', 'completed', 0.65],
            ['Defensive Reforestation', 'Strategic planting of drought-resistant Acacia belts to prevent soil erosion.', 'other', 'ongoing', 0.78],
            ['Groundwater Recharge Wells', 'Drilling 50 deep-bore wells to tap into dormant aquifers.', 'irrigation', 'planned', 0.82]
        ];

        for (let i = 0; i < strategies.length; i++) {
            const regionId = regionIds[i % regionIds.length];
            await client.query(`
        INSERT INTO mitigation_strategies (region_id, title, description, strategy_type, implementation_status, effectiveness_score)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT DO NOTHING
      `, [regionId, ...strategies[i]]);
        }

        // 3. Seed Water Resources & Soil Data for Matrix
        for (const rid of regionIds) {
            // Water resources
            await client.query(`
        INSERT INTO water_resources (region_id, timestamp, reservoir_level_meters, reservoir_capacity_cubic_meters)
        VALUES ($1, NOW(), $2, $3)
      `, [rid, 40 + Math.random() * 40, 100]);

            // Soil data
            await client.query(`
        INSERT INTO soil_data (region_id, timestamp, soil_moisture_percentage)
        VALUES ($1, NOW(), $2)
      `, [rid, 15 + Math.random() * 50]);
        }

        console.log('Seed completed successfully');
    } catch (err) {
        console.error('Seed error:', err);
    } finally {
        await client.end();
    }
}

seed();
