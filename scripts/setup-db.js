const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local only if DATABASE_URL is not already set
if (!process.env.DATABASE_URL) {
    try {
        const envPath = path.join(__dirname, '../.env.local');
        // Try utf-8 first, if it looks like garbage (lots of nulls), try utf16le? 
        // Simplified: Just try to read.
        let envContent = fs.readFileSync(envPath, 'utf8');

        // Check for null bytes which indicate UTF-16LE read as UTF-8
        if (envContent.includes('\0')) {
            envContent = fs.readFileSync(envPath, 'utf16le');
        }

        envContent.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^['"]|['"]$/g, ''); // Remove quotes
                process.env[key] = value;
            }
        });
    } catch (e) {
        console.log('Could not read or parse .env.local, relying on process.env', e.message);
    }
}

if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is not set.');
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function runScript(filename) {
    console.log(`Running ${filename}...`);
    const content = fs.readFileSync(path.join(__dirname, filename), 'utf8');

    // Basic split by semicolon to handle multiple statements if neon doesn't support big blocks
    // Note: This is a naiive splitter, usually neon supports full scripts.
    // We will try running it as one block first.

    // Helper to execute query safely
    const execute = async (queryText) => {
        // Check for .query method (as suggested by error message)
        if (typeof sql.query === 'function') {
            return await sql.query(queryText);
        }

        // Fallback: Simulate tagged template
        const strings = [queryText];
        strings.raw = [queryText];
        return await sql(strings);
    };

    try {
        await execute(content);
        // console.log(`Successfully ran ${filename}`); // Semicolon logic below is better
    } catch (e) {
        console.log(`Full execution as single block failed (${e.message}), trying statement by statement for ${filename}`);
        const statements = content
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            try {
                // Skip comments-only
                if (statement.startsWith('--') && !statement.includes('\n')) continue;
                await execute(statement);
            } catch (err) {
                console.error(`Error executing statement: ${statement.substring(0, 50)}...`);
                console.error(err.message);
                // Continue or throw based on desired strictness. We'll continue.
            }
        }
    }
}

async function main() {
    try {
        // 1. Create tables
        await runScript('01-create-drought-system.sql');

        // 2. Seed data
        await runScript('seed-serial.sql');

        console.log('Database initialization completed!');
    } catch (error) {
        console.error('Init failed:', error);
        process.exit(1);
    }
}

main();
