const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const tests = [
  { email: 'hospital.admin@carebridge.local', password: 'Hospital@123' },
  { email: 'doctor@carebridge.local', password: 'Doctor@123' },
  { email: 'nurse@carebridge.local', password: 'Nurse@123' },
  { email: 'reception@carebridge.local', password: 'Reception@123' },
  { email: 'lab@carebridge.local', password: 'Lab@123' },
  { email: 'pharmacy@carebridge.local', password: 'Pharmacy@123' },
  { email: 'billing@carebridge.local', password: 'Billing@123' },
  { email: 'records@carebridge.local', password: 'Records@123' },
  { email: 'emergency@carebridge.local', password: 'Emergency@123' },
  { email: 'hr@carebridge.local', password: 'HR@123' },
  { email: 'government@carebridge.local', password: 'Government@123' },
  { email: 'salem.dho@carebridge.local', password: 'Government@123' },
  { email: 'coimbatore.dho@carebridge.local', password: 'Government@123' },
  { email: 'chennai.dho@carebridge.local', password: 'Government@123' },
  { email: 'madurai.dho@carebridge.local', password: 'Government@123' },
];

async function checkAll() {
  for (const t of tests) {
    const res = await pool.query(
      'SELECT password_hash, role_id FROM users WHERE LOWER(email) = $1',
      [t.email.toLowerCase()]
    );
    if (res.rows.length === 0) {
      console.log('NOT_FOUND', t.email);
      continue;
    }
    const ok = await bcrypt.compare(t.password, res.rows[0].password_hash);
    console.log(ok ? '✓ OK   ' : '✗ FAIL ', t.email, '|', t.password);
  }
  await pool.end();
}

checkAll().catch(e => { console.error('ERROR:', e.message); pool.end(); });

