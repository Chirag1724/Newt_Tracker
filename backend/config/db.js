const { Pool } = require('pg');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
    console.error('❌ CRITICAL: DATABASE_URL environment variable is missing!');
}

// Create PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 20,
});

const log = (msg) => {
    const time = new Date().toISOString();
    console.log(`[${time}] ${msg}`);
};

const retry = require('retry');

// Test database connection with retry logic
const testConnection = () => {
    const operation = retry.operation({
        retries: 5,
        factor: 2,
        minTimeout: 1000,
        maxTimeout: 10000,
    });

    operation.attempt(async (currentAttempt) => {
        log(`⏳ Connecting to database... (Attempt ${currentAttempt})`);
        try {
            const client = await pool.connect();
            log('✅ Connected to PostgreSQL database successfully!');
            client.release();
        } catch (err) {
            log(`⚠️ Connection attempt ${currentAttempt} failed: ${err.message}`);
            if (operation.retry(err)) {
                return;
            }
            log(`❌ Database connection error after ${currentAttempt} attempts!`);
            console.error('Full connection error:', err);
        }
    });
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
