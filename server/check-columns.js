const db = require('./config/db');

async function checkColumns() {
    try {
        const res = await db.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'");
        console.log('Columns in users table:', res.rows);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

checkColumns();
