const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    // Use connection string from env (Supabase provides this)
    connectionString: process.env.DATABASE_URL,
    // SSL is required for most cloud DBs like Supabase
    ssl: {
        rejectUnauthorized: false
    }
});

// Test connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
        release();
        if (err) {
            return console.error('Error executing query', err.stack);
        }
        console.log('Connected to Database:', result.rows[0]);
    });
});

module.exports = pool;
