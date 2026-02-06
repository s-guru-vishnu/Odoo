const db = require('./config/db');

async function checkNotNull() {
    try {
        const res = await db.query("SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = 'users'");
        const notNull = res.rows.filter(c => c.is_nullable === 'NO' && c.column_name !== 'id' && c.column_name !== 'created_at');
        console.log('Columns that MUST be filled:', notNull.map(c => c.column_name));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

checkNotNull();
