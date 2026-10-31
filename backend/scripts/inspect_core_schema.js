const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function inspectSchema() {
  const auditRes = await pool.query(
    "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'audit_logs'"
  );
  console.log('=== audit_logs columns ===');
  auditRes.rows.forEach(r => console.log(` - ${r.column_name} (${r.data_type})`));

  const hospRes = await pool.query(
    "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'hospitals'"
  );
  console.log('=== hospitals columns ===');
  hospRes.rows.forEach(r => console.log(` - ${r.column_name} (${r.data_type})`));

  const userRes = await pool.query(
    "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'"
  );
  console.log('=== users columns ===');
  userRes.rows.forEach(r => console.log(` - ${r.column_name} (${r.data_type})`));

  pool.end();
}

inspectSchema().catch(e => { console.error(e); pool.end(); });

