require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

pool.query("ALTER TABLE meetings ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'")
    .then(r => {
        console.log('✅ Migration successful: documents column added to meetings table');
        pool.end();
        process.exit(0);
    })
    .catch(e => {
        console.error('❌ Migration error:', e.message);
        pool.end();
        process.exit(1);
    });
