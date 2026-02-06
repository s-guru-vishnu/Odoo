const db = require('./config/db');

async function checkTables() {
    try {
        const res = await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
        console.log('Existing tables:', res.rows.map(r => r.table_name));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

checkTables();
