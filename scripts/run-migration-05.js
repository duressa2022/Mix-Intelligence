const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function runMigration() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('Connected to DB');

        const sqlPath = path.join(__dirname, '05-system-settings.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        await client.query(sql);
        console.log('Migration 05 (System Settings) applied successfully');

    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        await client.end();
    }
}

runMigration();
