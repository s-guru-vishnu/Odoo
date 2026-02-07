require('dotenv').config();
const { getDb } = require('./config/db');

async function initDb() {
    const db = getDb();
    try {
        console.log('--- Initializing Advanced LearnSphere Database ---');

        // Optional: Ensure UUID extension exists
        try {
            await db.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        } catch (e) {
            console.log('ℹ️ Note: Could not ensure uuid-ossp extension. (Might require superuser)');
        }

        // Force reset only if explicitly requested
        if (process.env.RESET_DB === 'true') {
            console.log('🗑️ Force Reset: Cleaning old schema...');
            await db.query('DROP TABLE IF EXISTS user_roles CASCADE');
            await db.query('DROP TABLE IF EXISTS roles CASCADE');
            await db.query('DROP TABLE IF EXISTS messages CASCADE');
            await db.query('DROP TABLE IF EXISTS users CASCADE');
        }

        // 1. Roles Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id SERIAL PRIMARY KEY,
                name TEXT UNIQUE NOT NULL,
                description TEXT
            );
        `);

        // Seed default roles if they don't exist
        const defaultRoles = ['admin', 'instructor', 'learner'];
        for (const role of defaultRoles) {
            await db.query('INSERT INTO roles (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [role]);
        }

        // 2. Users Table (UUID Based)
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                email TEXT UNIQUE NOT NULL,
                hashed_password TEXT NOT NULL,
                display_name TEXT,
                bio TEXT,
                avatar_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 3. User Roles (Junction Table)
        await db.query(`
            CREATE TABLE IF NOT EXISTS user_roles (
                id SERIAL PRIMARY KEY,
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
                assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                revoked_at TIMESTAMP,
                UNIQUE(user_id, role_id)
            );
        `);

        // 4. Messages/Feedback integration
        await db.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                sender_id UUID REFERENCES users(id),
                content TEXT,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Safety check for existing users table column names (Migration helper)
        const ensureColumn = async (table, column, type) => {
            try {
                await db.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${column} ${type}`);
            } catch (e) { /* Passive */ }
        };

        await ensureColumn('users', 'display_name', 'TEXT');
        await ensureColumn('users', 'hashed_password', 'TEXT');

        console.log('✅ Advanced Database Schema Verified (UUID & RBAC)');
        console.log('--- Database Initialization Complete ---');
        process.exit(0);
    } catch (err) {
        console.error('❌ Database Init Failed:', err.message);
        process.exit(1);
    }
}

initDb();
