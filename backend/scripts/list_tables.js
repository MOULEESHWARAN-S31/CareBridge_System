const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`)
  .then(r => {
    console.log('=== DATABASE TABLES ===');
    r.rows.forEach(x => console.log(' -', x.table_name));
    pool.end();
  })
  .catch(e => { console.log('ERR:', e.message); pool.end(); });

