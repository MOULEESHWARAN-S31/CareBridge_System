const bcrypt = require('bcryptjs');
const { Client } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
  await client.connect();
  const hash = await bcrypt.hash('Government@123', 10);
  const govRoleRes = await client.query("SELECT id FROM roles WHERE UPPER(name)='GOVERNMENT'");
  if (govRoleRes.rows.length === 0) {
    console.log('GOVERNMENT role not found');
    await client.end();
    return;
  }
  const govRoleId = govRoleRes.rows[0].id;
  const updated = await client.query(
    'UPDATE users SET password_hash=$1 WHERE role_id=$2 RETURNING email',
    [hash, govRoleId]
  );
  console.log('Updated GOVERNMENT users:', updated.rows.map(r => r.email));
  await client.end();
}

run().catch(e => { console.error(e.message); client.end(); });

