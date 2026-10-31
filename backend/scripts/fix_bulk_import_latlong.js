const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/controllers/crossDashboardController.js');
let content = fs.readFileSync(filePath, 'utf8');

const targetSql = `        const insRes = await query(
          \`INSERT INTO hospitals (hospital_id, name, type, district, city, address, contact_phone, general_beds_total, general_beds_available, icu_beds_total, icu_beds_available, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Operational')
           RETURNING id, hospital_id, name, district, status\`,
          [
            hospitalId,
            h.name.trim(),
            h.type || 'Government Hospital',
            h.district.trim(),
            h.city || h.district.trim(),
            h.address || \`\${h.name.trim()}, \${h.district.trim()}\`,
            h.phone || '+91 427 2415121',
            parseInt(h.totalBeds, 10) || 100,
            Math.max(0, parseInt(h.availableBeds, 10) || 20),
            parseInt(h.icuBeds, 10) || 10,
            Math.max(0, parseInt(h.icuBedsAvailable, 10) || 2)
          ]
        );`;

const replacementSql = `        const lat = h.latitude !== undefined ? parseFloat(h.latitude) : 11.6643;
        const lng = h.longitude !== undefined ? parseFloat(h.longitude) : 78.1460;

        const insRes = await query(
          \`INSERT INTO hospitals (hospital_id, name, type, district, city, address, contact_phone, latitude, longitude, general_beds_total, general_beds_available, icu_beds_total, icu_beds_available, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'Operational')
           RETURNING id, hospital_id, name, district, status\`,
          [
            hospitalId,
            h.name.trim(),
            h.type || 'Government Hospital',
            h.district.trim(),
            h.city || h.district.trim(),
            h.address || \`\${h.name.trim()}, \${h.district.trim()}\`,
            h.phone || '+91 427 2415121',
            lat,
            lng,
            parseInt(h.totalBeds, 10) || 100,
            Math.max(0, parseInt(h.availableBeds, 10) || 20),
            parseInt(h.icuBeds, 10) || 10,
            Math.max(0, parseInt(h.icuBedsAvailable, 10) || 2)
          ]
        );`;

const normalizedContent = content.replace(/\r\n/g, '\n');
const normalizedTarget = targetSql.replace(/\r\n/g, '\n');

if (normalizedContent.includes(normalizedTarget)) {
  const updated = normalizedContent.replace(normalizedTarget, replacementSql.replace(/\r\n/g, '\n'));
  fs.writeFileSync(filePath, updated, 'utf8');
  console.log('Successfully added latitude/longitude to bulk import query');
} else {
  console.error('Target query not found in crossDashboardController');
}

