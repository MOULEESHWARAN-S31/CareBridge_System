const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
  await client.connect();
  console.log('[DB] Connected to PostgreSQL for cross-dashboard migration.');
  const sql = fs.readFileSync(path.join(__dirname, 'cross_dashboard_migration.sql'), 'utf8');
  try {
    await client.query(sql);
    console.log('[✓] Cross-dashboard operational tables successfully created and seeded.');
    
    const medRes = await client.query('SELECT COUNT(*) as count FROM facility_medicines;');
    const diagRes = await client.query('SELECT COUNT(*) as count FROM facility_diagnostics;');
    console.log(`  - facility_medicines: ${medRes.rows[0].count} records`);
    console.log(`  - facility_diagnostics: ${diagRes.rows[0].count} records`);
  } catch (err) {
    console.error('[ERR] Cross-dashboard migration error:', err.message);
  } finally {
    await client.end();
  }
}

run();

