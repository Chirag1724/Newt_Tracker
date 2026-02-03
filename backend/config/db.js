const { Pool } = require('pg');
require('dotenv').config();

// Create PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000, // Reduced to 10s for faster feedback
    idleTimeoutMillis: 30000,
    max: 20,
});

const fs = require('fs');
const path = require('path');
const logPath = path.join(__dirname, '../db-connection.log');

const log = (msg) => {
    const time = new Date().toISOString();
    fs.appendFileSync(logPath, `[${time}] ${msg}\n`);
    console.log(msg);
};

// Test database connection immediately
const testConnection = async () => {
    log('⏳ Connecting to database...');
    try {
        const client = await pool.connect();
        log('✅ Connected to PostgreSQL database successfully!');
        client.release();
    } catch (err) {
        log(`❌ Database connection error! Message: ${err.message}`);
        log('--------------------------------------------------');
        log('Common fixes:');
        log('1. Check if DATABASE_URL in .env is correct.');
        log('2. Ensure your IP is whitelisted in Supabase (if needed).');
        log('3. Verify that the "users" table exists in your database.');
        log('4. If using Supabase pooler, check the port (6543 for Transaction, 5432 for Session).');
        log('--------------------------------------------------');
    }
};

testConnection();

pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle database client', err);
    process.exit(-1);
});

// Helper function to query database
const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        return res;
    } catch (error) {
        console.error('Database query error:', error.message);
        throw error;
    }
};

module.exports = {
    query,
    pool
};
