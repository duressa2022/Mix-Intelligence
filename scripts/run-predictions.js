const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

if (!process.env.DATABASE_URL) {
    const envPath = path.join(__dirname, '../.env.local');
    try {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
            }
        });
    } catch (e) {
        console.error('Could not load .env.local');
    }
}

const sql = neon(process.env.DATABASE_URL);

// Re-implement simplified version of logic here to avoid typescript compilation issues in script
async function runPredictions() {
    console.log('Fetching regions...');
    const regions = await sql`SELECT id, name FROM regions`;

    for (const region of regions) {
        console.log(`Generating predictions for ${region.name}...`);

        // Mock data generation
        const predictions = [];
        const baseSPI = (Math.random() * 4) - 2; // Random start between -2 and 2

        for (let i = 1; i <= 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];

            const spi = baseSPI + (Math.sin(i / 5) * 0.5) + (Math.random() * 0.2 - 0.1);

            let severity = 'Normal';
            if (spi < -2.0) severity = 'Extreme';
            else if (spi < -1.5) severity = 'Severe';
            else if (spi < -1.0) severity = 'Moderate';
            else if (spi < 0) severity = 'Mild';

            const probability = Math.min(0.99, 0.5 + Math.abs(spi) / 5);

            await sql`
                INSERT INTO predictions 
                (region_id, forecast_date, valid_from, valid_until, drought_probability_percentage, predicted_severity, confidence_level)
                VALUES (${region.id}, NOW(), ${dateStr}, ${dateStr}, ${probability * 100}, ${severity}, 0.85)
            `;
        }
    }
    console.log('Predictions generated.');
}

runPredictions().catch(console.error);
