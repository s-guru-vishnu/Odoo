const { Pool } = require('pg');

let pool;

/**
 * Strictly lazy-loads the database pool at runtime.
 * This prevents Railpack from erroring during build.
 */
function getDb() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set. Please link your Postgres service in Railway.');
    }

    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' || connectionString.includes('railway.app')
        ? { rejectUnauthorized: false }
        : false,
    });

    pool.on('error', (err) => {
      console.error('Unexpected database error:', err);
    });
  }
  return pool;
}

module.exports = { getDb };
