const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
  await client.connect();
  console.log('[DB] Connected to PostgreSQL for government migration.');

  const sql = fs.readFileSync(path.join(__dirname, 'government_migration.sql'), 'utf8');
  
  try {
    await client.query(sql);
    console.log('[✓] Government migration completed successfully.');
    
    // Verify tables created
    const tables = ['government_camp_proposals','community_camp_requests','government_resource_requests','government_medicine_requisitions','government_audit_events','government_announcements'];
    for (const t of tables) {
      const res = await client.query(`SELECT COUNT(*) as cnt FROM ${t}`);
      console.log(`  [✓] ${t}: ${res.rows[0].cnt} records`);
    }
  } catch (err) {
    console.error('[ERR] Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();

