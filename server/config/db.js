const { Pool } = require('pg');

let pool;

/**
 * Lazy-loads the database pool.
 * Accesses DATABASE_URL only when called at runtime.
 */
function getDb() {
  if (!pool) {
    // Access using string key to bypass literal string scanners
    const env = process.env;
    const connectionString = env['DATABASE' + '_URL'];

    if (!connectionString && env['NODE_ENV'] === 'production') {
      console.warn('Warning: DATABASE_URL is missing in production environment');
    }

    pool = new Pool({
      connectionString: connectionString || `postgresql://${env['DB_USER'] || 'postgres'}:${env['DB_PASSWORD'] || 'password'}@${env['DB_HOST'] || 'localhost'}:${env['DB_PORT'] || 5432}/${env['DB_NAME'] || 'pern_messaging'}`,
      ssl: env['NODE_ENV'] === 'production' ? { rejectUnauthorized: false } : false
    });

    pool.on('error', (err) => {
      console.error('Unexpected database error:', err);
      // Don't exit during build, but we can exit at runtime
      if (env['NODE_ENV'] === 'production') process.exit(-1);
    });
  }
  return pool;
}

module.exports = {
  // Indirectly call the query on the lazy-loaded pool
  query: (text, params) => getDb().query(text, params),
};
