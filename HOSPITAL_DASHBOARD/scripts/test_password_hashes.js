import { createRequire } from 'module';
const require = createRequire('d:/CAREBRIDGE_SYSTEM/backend/node_modules/');
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const connectionString = 'postgresql://postgres:moulee2077@localhost:5432/carebridge_db';
const client = new Client({ connectionString });

const ROLES_TO_TEST = [
  { role: 'HOSPITAL_ADMIN', email: 'hospital.admin@carebridge.local', intendedPw: 'Admin@123', seededPw: 'Hospital@123' },
  { role: 'DOCTOR', email: 'doctor@carebridge.local', intendedPw: 'Doctor@123', seededPw: 'Doctor@123' },
  { role: 'NURSE', email: 'nurse@carebridge.local', intendedPw: 'Nurse@123', seededPw: 'Nurse@123' },
  { role: 'RECEPTIONIST', email: 'reception@carebridge.local', intendedEmail: 'receptionist@carebridge.local', intendedPw: 'Recep@123', seededPw: 'Reception@123' },
  { role: 'LAB_STAFF', email: 'lab@carebridge.local', intendedPw: 'Lab@123', seededPw: 'Lab@123' },
  { role: 'PHARMACIST', email: 'pharmacy@carebridge.local', intendedEmail: 'pharmacist@carebridge.local', intendedPw: 'Pharm@123', seededPw: 'Pharmacy@123' },
  { role: 'BILLING_STAFF', email: 'billing@carebridge.local', intendedPw: 'Bill@123', seededPw: 'Billing@123' },
  { role: 'RECORDS_STAFF', email: 'records@carebridge.local', intendedPw: 'Record@123', seededPw: 'Records@123' },
  { role: 'EMERGENCY_STAFF', email: 'emergency@carebridge.local', intendedPw: 'Emerg@123', seededPw: 'Emergency@123' },
  { role: 'HR_MANAGER', email: 'hr@carebridge.local', intendedPw: 'Hr@123', seededPw: 'HR@123' }
];

async function check() {
  await client.connect();

  console.log('---------------------------------------------------------------------------------------------------');
  console.log('Role               | DB Email / Intended Email            | Intended PW | Seeded PW | Intended Result | Seeded Result');
  console.log('---------------------------------------------------------------------------------------------------');

  for (const item of ROLES_TO_TEST) {
    // Check if intended email exists
    const resIntendedEmail = await client.query('SELECT password_hash FROM users WHERE email = $1', [item.intendedEmail || item.email]);
    let matchIntended = false;
    if (resIntendedEmail.rows.length > 0) {
      matchIntended = await bcrypt.compare(item.intendedPw, resIntendedEmail.rows[0].password_hash);
    }

    // Check seeded email & seeded pw
    const resSeeded = await client.query('SELECT password_hash FROM users WHERE email = $1', [item.email]);
    let matchSeeded = false;
    if (resSeeded.rows.length > 0) {
      matchSeeded = await bcrypt.compare(item.seededPw, resSeeded.rows[0].password_hash);
    }

    const emailStatus = item.intendedEmail ? `${item.email} (want: ${item.intendedEmail})` : item.email;
    console.log(
      `${item.role.padEnd(18)} | ${emailStatus.padEnd(36)} | ${item.intendedPw.padEnd(11)} | ${item.seededPw.padEnd(9)} | ${(matchIntended ? '✅ MATCH' : '❌ FAIL').padEnd(15)} | ${matchSeeded ? '✅ MATCH' : '❌ FAIL'}`
    );
  }

  console.log('---------------------------------------------------------------------------------------------------');
  await client.end();
}

check().catch(console.error);

