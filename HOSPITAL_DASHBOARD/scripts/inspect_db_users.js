import { createRequire } from 'module';
const require = createRequire('d:/CAREBRIDGE_SYSTEM/backend/node_modules/');
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:moulee2077@localhost:5432/carebridge_db';
const client = new Client({ connectionString });

async function check() {
  try {
    await client.connect();
    console.log('Connected to carebridge_db successfully.');
    
    // Check all roles
    const rolesRes = await client.query('SELECT id, name, description FROM roles ORDER BY id;');
    console.log('\n--- ROLES TABLE ---');
    console.table(rolesRes.rows);

    // Check all users
    const usersRes = await client.query(`
      SELECT u.id, u.username, u.email, u.employee_id, u.full_name, u.is_active, r.name as role_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      ORDER BY u.id;
    `);
    console.log('\n--- USERS TABLE ---');
    console.table(usersRes.rows);

    await client.end();
  } catch (err) {
    console.error('Database connection error:', err.message);
  }
}

check();
