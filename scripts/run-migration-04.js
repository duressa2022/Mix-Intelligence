const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Manually load .env.local since dotenv is not installed
// Copied from previous steps and enhanced
if (!process.env.DATABASE_URL) {
    const envPath = path.join(__dirname, '../.env.local');
    try {
        if (fs.existsSync(envPath)) {
            console.log('Loading .env.local from:', envPath);
            const envContent = fs.readFileSync(envPath, 'utf8');
            envContent.split(/\r?\n/).forEach(line => {
                const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim().replace(/^['"]|['"]$/g, '');
                    process.env[key] = value;
                    console.log('Loaded key:', key);
                }
            });
        } else {
            console.log('.env.local file not found at:', envPath);
        }
    } catch (e) {
        console.error('Could not load .env.local', e);
    }
}

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function runMigration() {
    try {
        console.log('Running migration: 04-socioeconomic-schema.sql');
        const sqlPath = path.join(__dirname, '04-socioeconomic-schema.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        // Split by semicolon to run statements individually
        // This is a naive split which might break if semicolons are in strings/comments
        // But for our schema file it should be fine.
        const statements = sqlContent
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            // Neon driver requires simulated tagged template or just string
            const strings = [statement];
            strings.raw = [statement];
            await sql(strings);
        }

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

runMigration();
