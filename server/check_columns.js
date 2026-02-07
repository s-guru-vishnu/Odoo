const { getDb } = require('./config/db');
require('dotenv').config();

async function checkColumns() {
    try {
        const db = getDb();
        const res = await db.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'users';
        `);
        console.table(res.rows);
    } catch (e) {
        console.error(e);
    }
}
checkColumns();
