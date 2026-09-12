const bcrypt = require('bcryptjs');
const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:moulee2077@localhost:5432/carebridge_db';

const HOSPITAL_ROLES = [
  { name: 'HOSPITAL_ADMIN', description: 'Hospital Facility Administrator' },
  { name: 'DOCTOR', description: 'Clinical Doctor and Medical Specialist' },
  { name: 'NURSE', description: 'Inpatient and Ward Nursing Staff' },
  { name: 'RECEPTIONIST', description: 'Front Desk and Outpatient Registration' },
  { name: 'LAB_STAFF', description: 'Diagnostic and Pathology Laboratory Staff' },
  { name: 'PHARMACIST', description: 'Hospital Pharmacy and Medication Dispenser' },
  { name: 'BILLING_STAFF', description: 'Patient Billing and Financial Accounts' },
  { name: 'RECORDS_STAFF', description: 'Medical Records and EHR Custodian' },
  { name: 'EMERGENCY_STAFF', description: 'Emergency Room and Trauma Care' },
  { name: 'HR_MANAGER', description: 'Hospital Human Resources and Staffing' },
];

const HOSPITAL_USERS = [
  {
    username: 'hospital.admin@carebridge.local',
    email: 'hospital.admin@carebridge.local',
    password: 'Hospital@123',
    fullName: 'Dr. Rajesh Kumar',
    employeeId: 'CB-HADM-001',
    role: 'HOSPITAL_ADMIN',
    hospitalId: 'GDH-SALEM-01',
    district: 'Salem'
  },
  {
    username: 'admin@hospital.demo',
    email: 'admin@hospital.demo',
    password: 'Admin@123',
    fullName: 'Dr. Rajesh Kumar',
    employeeId: 'EMP-001',
    role: 'HOSPITAL_ADMIN',
    hospitalId: 'GDH-SALEM-01',
    district: 'Salem'
  },
  {
    username: 'doctor@carebridge.local',
    email: 'doctor@carebridge.local',
    password: 'Doctor@123',
    fullName: 'Dr. Priya Sharma',
    employeeId: 'CB-DOC-001',
    role: 'DOCTOR',
    hospitalId: 'GDH-SALEM-01',
    district: 'Salem'
  },
  {
    username: 'doctor@hospital.demo',
    email: 'doctor@hospital.demo',
    password: 'Doctor@123',
    fullName: 'Dr. Priya Sharma',
    employeeId: 'EMP-002',
    role: 'DOCTOR',
    hospitalId: 'GDH-SALEM-01',
    district: 'Salem'
  },
  {
    username: 'nurse@carebridge.local',
    email: 'nurse@carebridge.local',
    password: 'Nurse@123',
    fullName: 'Anitha Ravi',
    employeeId: 'CB-NUR-001',
    role: 'NURSE',
    hospitalId: 'GDH-SALEM-01',
    district: 'Salem'
  },
  {
    username: 'nurse@hospital.demo',
    email: 'nurse@hospital.demo',
    password: 'Nurse@123',
    fullName: 'Anitha Ravi',
    employeeId: 'EMP-003',
    role: 'NURSE',
    hospitalId: 'GDH-SALEM-01',
    district: 'Salem'
  },
  {
    username: 'reception@carebridge.local',
    email: 'reception@carebridge.local',
    password: 'Reception@123',
    fullName: 'Meena Krishnan',
    employeeId: 'CB-REC-001',
    role: 'RECEPTIONIST',
    hospitalId: 'GDH-SALEM-01',
    district: 'Salem'
  },
  {
    username: 'reception@hospital.demo',
    email: 'reception@hospital.demo',
    password: 'Reception@123',
    fullName: 'Meena Krishnan',
    employeeId: 'REC-1001',
    role: 'RECEPTIONIST',
    hospitalId: 'GDH-SALEM-01',
    district: 'Salem'
  },
  {
    username: 'lab@carebridge.local',
    email: 'lab@carebridge.local',
    password: 'Lab@123',
    fullName: 'Ravi Shankar',
    employeeId: 'CB-LAB-001',
    role: 'LAB_STAFF',
    hospitalId: 'GDH-SALEM-01',
    district: 'Salem'
  },
  {
    username: 'lab@hospital.demo',
    email: 'lab@hospital.demo',
    password: 'Lab@123',
    fullName: 'Ravi Shankar',
    employeeId: 'EMP-005',
    role: 'LAB_STAFF',
    hospitalId: 'GDH-SALEM-01',
    district: 'Salem'
  },
  {
    username: 'pharmacy@carebridge.local',
    email: 'pharmacy@carebridge.local',
    password: 'Pharmacy@123',
    fullName: 'Kumar Pillai',
    employeeId: 'CB-PHM-001',
    role: 'PHARMACIST',
    hospitalId: 'GDH-SALEM-01',
    district: 'Salem'
  },
  {
    username: 'pharmacy@hospital.demo',
    email: 'pharmacy@hospital.demo',
    password: 'Pharmacy@123',
    fullName: 'Kumar Pillai',
    employeeId: 'EMP-006',
    role: 'PHARMACIST',
    hospitalId: 'GDH-SALEM-01',
    district: 'Salem'
  },
  {
    username: 'billing@carebridge.local',
    email: 'billing@carebridge.local',
    password: 'Billing@123',
    fullName: 'Sunita Verma',
    employeeId: 'CB-BIL-001',
    role: 'BILLING_STAFF',
    hospitalId: 'GDH-SALEM-01',
    district: 'Salem'
  },
  {
    username: 'billing@hospital.demo',
    email: 'billing@hospital.demo',
    password: 'Billing@123',
    fullName: 'Sunita Verma',
    employeeId: 'EMP-007',
    role: 'BILLING_STAFF',
    hospitalId: 'GDH-SALEM-01',
    district: 'Salem'
  },
  {
    username: 'records@carebridge.local',
    email: 'records@carebridge.local',
    password: 'Records@123',
    fullName: 'Lakshmi Nair',
    employeeId: 'CB-REC-002',
    role: 'RECORDS_STAFF',
    hospitalId: 'GDH-SALEM-01',
    district: 'Salem'
  },
  {
    username: 'records@hospital.demo',
    email: 'records@hospital.demo',
    password: 'Records@123',
    fullName: 'Lakshmi Nair',
    employeeId: 'EMP-008',
    role: 'RECORDS_STAFF',
    hospitalId: 'GDH-SALEM-01',
    district: 'Salem'
  },
  {
    username: 'emergency@carebridge.local',
    email: 'emergency@carebridge.local',
    password: 'Emergency@123',
    fullName: 'Arjun Singh',
    employeeId: 'CB-EMG-001',
    role: 'EMERGENCY_STAFF',
    hospitalId: 'GDH-SALEM-01',
    district: 'Salem'
  },
  {
    username: 'emergency@hospital.demo',
    email: 'emergency@hospital.demo',
    password: 'Emergency@123',
    fullName: 'Arjun Singh',
    employeeId: 'EMP-009',
    role: 'EMERGENCY_STAFF',
    hospitalId: 'GDH-SALEM-01',
    district: 'Salem'
  },
  {
    username: 'hr@carebridge.local',
    email: 'hr@carebridge.local',
    password: 'HR@123',
    fullName: 'Divya Menon',
    employeeId: 'CB-HR-001',
    role: 'HR_MANAGER',
    hospitalId: 'GDH-SALEM-01',
    district: 'Salem'
  },
  {
    username: 'hr@hospital.demo',
    email: 'hr@hospital.demo',
    password: 'HR@123',
    fullName: 'Divya Menon',
    employeeId: 'EMP-010',
    role: 'HR_MANAGER',
    hospitalId: 'GDH-SALEM-01',
    district: 'Salem'
  }
];

async function run() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log('[DB] Connected to PostgreSQL for hospital roles migration.');

  try {
    // 1. Add hospital_id to users if not present
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS hospital_id VARCHAR(50);
    `);
    console.log('[✓] Column hospital_id ensured on users table.');

    // 2. Insert roles
    for (const r of HOSPITAL_ROLES) {
      const existing = await client.query('SELECT id FROM roles WHERE UPPER(name) = $1', [r.name]);
      if (existing.rows.length === 0) {
        await client.query(
          'INSERT INTO roles (name, description) VALUES ($1, $2)',
          [r.name, r.description]
        );
        console.log(`[✓] Added role: ${r.name}`);
      }
    }

    // 3. Fetch all role IDs
    const rolesRes = await client.query('SELECT id, name FROM roles');
    const roleMap = {};
    rolesRes.rows.forEach(row => {
      roleMap[row.name.toUpperCase()] = row.id;
    });

    // 4. Seed hospital users
    for (const u of HOSPITAL_USERS) {
      const roleId = roleMap[u.role.toUpperCase()];
      if (!roleId) {
        console.warn(`[!] Role ${u.role} not found in roleMap!`);
        continue;
      }

      const existingUser = await client.query(
        'SELECT id FROM users WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($2)',
        [u.username, u.email]
      );

      const hash = await bcrypt.hash(u.password, 10);

      if (existingUser.rows.length === 0) {
        await client.query(`
          INSERT INTO users (username, email, password_hash, role_id, full_name, employee_id, district, hospital_id, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
        `, [u.username, u.email, hash, roleId, u.fullName, u.employeeId, u.district, u.hospitalId]);
        console.log(`[✓] Created user: ${u.username} (${u.role})`);
      } else {
        // Update role, password, and hospitalId
        await client.query(`
          UPDATE users
          SET role_id = $1, password_hash = $2, hospital_id = $3, full_name = $4, employee_id = $5, is_active = true
          WHERE id = $6
        `, [roleId, hash, u.hospitalId, u.fullName, u.employeeId, existingUser.rows[0].id]);
        console.log(`[✓] Updated user: ${u.username} (${u.role})`);
      }
    }

    console.log('[✓] Hospital roles and users migration successfully completed.');
  } catch (err) {
    console.error('[ERR] Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
