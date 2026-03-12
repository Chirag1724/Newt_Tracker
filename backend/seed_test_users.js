const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function seed() {
    console.log('--- Seeding Test Users ---');
    try {
        const salt = await bcrypt.genSalt(10);
        const adminHash = await bcrypt.hash('admin123', salt);
        const distHash = await bcrypt.hash('dist123', salt);

        await pool.query(
            `INSERT INTO users (name, email, password, role) 
             VALUES ($1, $2, $3, $4) 
             ON CONFLICT (email) DO UPDATE SET password = $3`,
            ['Admin User', 'admin@newt.com', adminHash, 'admin']
        );
        console.log('✅ Admin user ready: admin@newt.com');

        await pool.query(
            `INSERT INTO users (name, email, password, role) 
             VALUES ($1, $2, $3, $4) 
             ON CONFLICT (email) DO UPDATE SET password = $3`,
            ['Field Officer', 'officer@newt.com', distHash, 'distributor']
        );
        console.log('✅ Distributor user ready: officer@newt.com');

        await pool.end();
        console.log('--- Done ---');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error Seeding:', err.message);
        await pool.end();
        process.exit(1);
    }
}

seed();
