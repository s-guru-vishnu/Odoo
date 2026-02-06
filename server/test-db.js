const db = require('./config/db');

async function testConnection() {
    try {
        console.log('Attempting to connect to database...');
        const res = await db.query('SELECT NOW()');
        console.log('SUCCESS! Connection established at:', res.rows[0].now);
        process.exit(0);
    } catch (err) {
        console.error('CONNECTION FAILED:', err.message);
        process.exit(1);
    }
}

testConnection();
