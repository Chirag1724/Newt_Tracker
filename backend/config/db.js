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

const retry = require('retry');

// Test database connection with retry logic
const testConnection = () => {
    const operation = retry.operation({
        retries: 5,
        factor: 2,
        minTimeout: 1000,
        maxTimeout: 30000,
    });

    operation.attempt(async (currentAttempt) => {
        log(`⏳ Connecting to database... (Attempt ${currentAttempt})`);
        try {
            const client = await pool.connect();
            log('✅ Connected to PostgreSQL database successfully!');
            client.release();
        } catch (err) {
            if (operation.retry(err)) {
                return;
            }
            log(`❌ Database connection error after ${currentAttempt} attempts! Message: ${err.message}`);
            // ... (keep existing helpful logs if desired, or simplify)
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
