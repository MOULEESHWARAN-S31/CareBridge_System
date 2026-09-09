const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function setup() {
  console.log('===========================================================');
  console.log(' CareBridge PostgreSQL Database Setup & Seeding');
  console.log('===========================================================');

  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/carebridge_db';
  console.log(`Connecting via: ${connectionString.replace(/:[^:@]+@/, ':****@')}`);

  // Parse connection details to connect to maintenance db first
  const parsedUrl = new URL(connectionString.replace(/^postgresql:\/\//, 'http://'));
  const dbName = parsedUrl.pathname.replace(/^\//, '') || 'carebridge_db';
  const username = parsedUrl.username || 'postgres';
  const password = parsedUrl.password || 'postgres';
  const host = parsedUrl.hostname || 'localhost';
  const port = parseInt(parsedUrl.port || '5432', 10);

  // 1. Check/Create database
  const maintenanceClient = new Client({
    user: username,
    password,
    host,
    port,
    database: 'postgres'
  });

  try {
    await maintenanceClient.connect();
    const checkRes = await maintenanceClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1;`,
      [dbName]
    );

    if (checkRes.rows.length === 0) {
      console.log(`Creating database "${dbName}"...`);
      await maintenanceClient.query(`CREATE DATABASE "${dbName}";`);
      console.log(`[✓] Database "${dbName}" created.`);
    } else {
      console.log(`[✓] Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.warn(`[!] Maintenance check warning: ${err.message}. Proceeding to connect to target DB...`);
  } finally {
    try { await maintenanceClient.end(); } catch (_) {}
  }

  // 2. Connect to carebridge_db and run schema + seed
  const dbClient = new Client({
    user: username,
    password,
    host,
    port,
    database: dbName
  });

  try {
    await dbClient.connect();
    console.log(`Connected to target database "${dbName}".`);

    // Load schema.sql
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    console.log(`Applying schema from: ${schemaPath}`);
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await dbClient.query(schemaSql);
    console.log('[✓] Schema applied successfully.');

    // Load seed.sql
    const seedPath = path.join(__dirname, '../../database/seed.sql');
    console.log(`Applying authoritative seed from: ${seedPath}`);
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await dbClient.query(seedSql);
    console.log('[✓] Seed data applied successfully.');

    // Print summary verification
    console.log('\n--- Database Verification Summary ---');
    const summaryQueries = [
      { name: 'Users', sql: 'SELECT COUNT(*) AS count FROM users' },
      { name: 'Roles', sql: 'SELECT COUNT(*) AS count FROM roles' },
      { name: 'ABHA Profiles', sql: 'SELECT COUNT(*) AS count FROM abha_profiles' },
      { name: 'Hospitals & PHCs', sql: 'SELECT COUNT(*) AS count FROM hospitals' },
      { name: 'Doctors', sql: 'SELECT COUNT(*) AS count FROM doctors' },
      { name: 'Medical Stores', sql: 'SELECT COUNT(*) AS count FROM medical_stores' },
      { name: 'Appointments', sql: 'SELECT COUNT(*) AS count FROM appointments' },
      { name: 'Teleconsultations', sql: 'SELECT COUNT(*) AS count FROM teleconsultations' },
      { name: 'Prescriptions', sql: 'SELECT COUNT(*) AS count FROM prescriptions' },
      { name: 'Medicine Orders', sql: 'SELECT COUNT(*) AS count FROM medicine_orders' },
      { name: 'Health Records', sql: 'SELECT COUNT(*) AS count FROM health_records' },
      { name: 'Health Alerts', sql: 'SELECT COUNT(*) AS count FROM health_alerts' },
      { name: 'Health Camps', sql: 'SELECT COUNT(*) AS count FROM health_camps' }
    ];

    for (const item of summaryQueries) {
      const res = await dbClient.query(item.sql);
      console.log(`  ${item.name.padEnd(22)}: ${res.rows[0].count} records`);
    }

    console.log('\n===========================================================');
    console.log(' [✓] PostgreSQL Database Setup Complete!');
    console.log('===========================================================');
  } catch (err) {
    console.error('\n[✗] Database setup failed:', err.message);
    process.exit(1);
  } finally {
    try { await dbClient.end(); } catch (_) {}
  }
}

setup();
