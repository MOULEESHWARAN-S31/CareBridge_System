const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function addAliases() {
  const hashRec = await bcrypt.hash('Reception@123', 10);
  const hashPhm = await bcrypt.hash('Pharmacy@123', 10);
  
  const recRole = (await pool.query("SELECT id FROM roles WHERE name = 'RECEPTIONIST'")).rows[0].id;
  const phmRole = (await pool.query("SELECT id FROM roles WHERE name = 'PHARMACIST'")).rows[0].id;

  // Insert or update receptionist@carebridge.local with distinct employee_id CB-REC-001A
  const recExists = await pool.query("SELECT id FROM users WHERE email = 'receptionist@carebridge.local'");
  if (recExists.rows.length === 0) {
    await pool.query(
      `INSERT INTO users (username, email, password_hash, role_id, full_name, employee_id, district, hospital_id, is_active)
       VALUES ('receptionist@carebridge.local', 'receptionist@carebridge.local', $1, $2, 'Meena Krishnan', 'CB-REC-001A', 'Salem', 'GDH-SALEM-01', true)`,
      [hashRec, recRole]
    );
  } else {
    await pool.query("UPDATE users SET password_hash = $1 WHERE email = 'receptionist@carebridge.local'", [hashRec]);
  }

  // Insert or update pharmacist@carebridge.local with distinct employee_id CB-PHM-001A
  const phmExists = await pool.query("SELECT id FROM users WHERE email = 'pharmacist@carebridge.local'");
  if (phmExists.rows.length === 0) {
    await pool.query(
      `INSERT INTO users (username, email, password_hash, role_id, full_name, employee_id, district, hospital_id, is_active)
       VALUES ('pharmacist@carebridge.local', 'pharmacist@carebridge.local', $1, $2, 'Kumar Pillai', 'CB-PHM-001A', 'Salem', 'GDH-SALEM-01', true)`,
      [hashPhm, phmRole]
    );
  } else {
    await pool.query("UPDATE users SET password_hash = $1 WHERE email = 'pharmacist@carebridge.local'", [hashPhm]);
  }

  console.log('Successfully configured both canonical and alias credentials for Receptionist & Pharmacist in DB');
  pool.end();
}

addAliases().catch(e => { console.error(e); pool.end(); });
