const db = require('./config/db');

async function check() {
    try {
        const result = await db.query('SELECT name, email, role FROM users');
        console.log('--- Users in Database ---');
        console.table(result.rows);
        process.exit(0);
    } catch (err) {
        console.error('Error checking users:', err);
        process.exit(1);
    }
}

check();
