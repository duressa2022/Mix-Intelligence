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

async function main() {
    try {
        console.log('Running fix-organizations...');
        const content = fs.readFileSync(path.join(__dirname, '03-fix-organizations.sql'), 'utf8');

        // Simple execution
        const validStatements = content.split(';').filter(s => s.trim().length > 0);
        for (const stmt of validStatements) {
            const queryStr = stmt.trim();
            // Simulate tagged template for neon driver
            const strings = [queryStr];
            strings.raw = [queryStr];
            await sql(strings);
        }
        console.log('Success: Organizations table created.');
    } catch (e) {
        console.error('Error:', e);
    }
}

main();
