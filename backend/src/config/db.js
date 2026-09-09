const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/carebridge_db';

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

let isConnected = false;

// Test connection on boot
pool.query('SELECT NOW()')
  .then(res => {
    isConnected = true;
    console.log('[DB] PostgreSQL connected successfully at:', res.rows[0].now);
  })
  .catch(err => {
    isConnected = false;
    console.warn('\n================================================================');
    console.warn('[DB WARNING] Could not connect to PostgreSQL database.');
    console.warn('Reason:', err.message);
    console.warn('Connection String:', connectionString.replace(/:[^:@]+@/, ':****@'));
    console.warn('To configure, check your .env file and run: npm run db:setup');
    console.warn('================================================================\n');
  });

module.exports = {
  pool,
  isDbConnected: () => isConnected,
  query: (text, params) => pool.query(text, params),
  withTransaction: async (callback) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
};
