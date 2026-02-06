const { getDb } = require('./config/db');

async function initDb() {
    const db = getDb();
    try {
        console.log('--- Initializing Database ---');

        // Drop existing tables to ensure a clean slate with the new TEXT schema
        console.log('🗑️ Cleaning old schema...');
        await db.query('DROP TABLE IF EXISTS messages CASCADE');
        await db.query('DROP TABLE IF EXISTS users CASCADE');

        // Recreate Users Table with all TEXT types as requested
        console.log('🏗️ Creating Users table (TEXT schema)...');
        await db.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                name TEXT,
                email TEXT UNIQUE,
                password_hash TEXT,
                role TEXT DEFAULT 'user',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP::TEXT
            );
        `);

        // Recreate Messages Table with all TEXT types as requested
        console.log('🏗️ Creating Messages table (TEXT schema)...');
        await db.query(`
            CREATE TABLE messages (
                id SERIAL PRIMARY KEY,
                sender_id INTEGER REFERENCES users(id),
                content TEXT,
                status TEXT DEFAULT 'pending',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP::TEXT
            );
        `);

        console.log('✅ Database Schema Reset Complete (All TEXT)');

        console.log('--- Database Initialization Complete ---');
        process.exit(0);
    } catch (err) {
        console.error('❌ Database Init Failed:', err.message);
        process.exit(1);
    }
}

initDb();
