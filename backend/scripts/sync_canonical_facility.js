const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function fixHospitalMapping() {
  const check = await pool.query('SELECT * FROM hospitals WHERE hospital_id = $1', ['GDH-SALEM-01']);
  if (check.rows.length === 0) {
    const orig = await pool.query('SELECT * FROM hospitals WHERE hospital_id = $1', ['fac_gh_salem']);
    if (orig.rows.length > 0) {
      const h = orig.rows[0];
      await pool.query(
        `INSERT INTO hospitals (hospital_id, name, type, district, city, address, contact_phone, latitude, longitude, general_beds_total, general_beds_available, icu_beds_total, icu_beds_available, status)
         VALUES ('GDH-SALEM-01', $1, $2, $3, $4, $5, $6, 11.6643, 78.1460, $7, $8, $9, $10, 'Operational')`,
        [h.name, h.type, h.district, h.city, h.address, h.contact_phone, h.general_beds_total, h.general_beds_available, h.icu_beds_total, h.icu_beds_available]
      );
      console.log('Inserted canonical GDH-SALEM-01 facility record with lat/long');
    }
  } else {
    console.log('GDH-SALEM-01 already present in hospitals');
  }

  // Update appointments to reference GDH-SALEM-01
  await pool.query("UPDATE appointments SET hospital_id = 'GDH-SALEM-01' WHERE hospital_id = 'fac_gh_salem'");
  console.log('Synchronized appointments for GDH-SALEM-01');

  pool.end();
}

fixHospitalMapping().catch(e => { console.error(e); pool.end(); });
