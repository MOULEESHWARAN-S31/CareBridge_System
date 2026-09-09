const { query } = require('../config/db');

// List hospitals and facilities with optional filters
async function getHospitals(req, res, next) {
  try {
    const { district, type, status, search, lat, lng } = req.query;

    let sql = `
      SELECT id, hospital_id, name, type, district, city, address,
             contact_phone, latitude, longitude,
             general_beds_total, general_beds_available,
             icu_beds_total, icu_beds_available,
             emergency_status, occupancy, doctors_count, specialists_count,
             is_24x7, services, status, created_at, updated_at
    `;

    // Calculate distance if lat and lng provided
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      sql += `, (
        6371 * acos(
          cos(radians(${userLat})) * cos(radians(latitude)) *
          cos(radians(longitude) - radians(${userLng})) +
          sin(radians(${userLat})) * sin(radians(latitude))
        )
      ) AS distance_km`;
    }

    sql += ` FROM hospitals WHERE 1=1`;
    const params = [];

    if (district && district !== 'ALL') {
      params.push(district);
      sql += ` AND LOWER(district) = LOWER($${params.length})`;
    }

    if (type && type !== 'ALL') {
      params.push(`%${type}%`);
      sql += ` AND type ILIKE $${params.length}`;
    }

    if (status && status !== 'ALL') {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      sql += ` AND (name ILIKE $${params.length} OR city ILIKE $${params.length} OR district ILIKE $${params.length})`;
    }

    if (lat && lng) {
      sql += ` ORDER BY distance_km ASC`;
    } else {
      sql += ` ORDER BY id ASC`;
    }

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// Get hospital by hospital_id with associated doctors
async function getHospitalById(req, res, next) {
  try {
    const { id } = req.params;

    const hospResult = await query(
      'SELECT * FROM hospitals WHERE hospital_id = $1 OR id::text = $1 LIMIT 1;',
      [id]
    );

    if (hospResult.rows.length === 0) {
      return res.status(404).json({ error: 'Hospital/facility not found.' });
    }

    const hospital = hospResult.rows[0];

    const docsResult = await query(
      'SELECT * FROM doctors WHERE hospital_id = $1 ORDER BY name ASC;',
      [hospital.hospital_id]
    );

    res.json({
      ...hospital,
      doctors: docsResult.rows
    });
  } catch (err) {
    next(err);
  }
}

// Admin: Create hospital
async function createHospital(req, res, next) {
  try {
    const {
      name, type, district, city, address, contactPhone,
      latitude, longitude, generalBedsTotal, icuBedsTotal,
      is24x7, services, status
    } = req.body;

    if (!name || !district || !city || !address || !contactPhone) {
      return res.status(400).json({ error: 'Name, district, city, address, and contactPhone are required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 20);
    const hospitalId = `fac_${slug}_${Math.floor(100 + Math.random() * 900)}`;

    const lat = latitude !== undefined ? parseFloat(latitude) : 11.6643;
    const lng = longitude !== undefined ? parseFloat(longitude) : 78.1460;
    const genBeds = generalBedsTotal ? parseInt(generalBedsTotal, 10) : 50;
    const icuBeds = icuBedsTotal ? parseInt(icuBedsTotal, 10) : 10;

    const insertSql = `
      INSERT INTO hospitals (
        hospital_id, name, type, district, city, address, contact_phone,
        latitude, longitude, general_beds_total, general_beds_available,
        icu_beds_total, icu_beds_available, emergency_status, occupancy,
        doctors_count, specialists_count, is_24x7, services, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *;
    `;

    const result = await query(insertSql, [
      hospitalId,
      name.trim(),
      type || 'Hospital',
      district.trim(),
      city.trim(),
      address.trim(),
      contactPhone.trim(),
      lat,
      lng,
      genBeds,
      Math.max(0, Math.round(genBeds * 0.2)),
      icuBeds,
      Math.max(0, Math.round(icuBeds * 0.2)),
      'Available',
      80,
      10,
      2,
      is24x7 !== undefined ? is24x7 : true,
      services || ['General OPD', 'Emergency', 'Pharmacy'],
      status || 'Operational'
    ]);

    res.status(201).json({
      message: 'Healthcare facility created successfully.',
      hospital: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

// Admin: Update hospital
async function updateHospital(req, res, next) {
  try {
    const { id } = req.params;
    const {
      name, type, district, city, address, contactPhone,
      latitude, longitude, generalBedsTotal, icuBedsTotal,
      occupancy, status, is24x7
    } = req.body;

    const checkRes = await query('SELECT * FROM hospitals WHERE hospital_id = $1 OR id::text = $1;', [id]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ error: 'Hospital not found.' });
    }
    const hosp = checkRes.rows[0];

    const updateSql = `
      UPDATE hospitals
      SET name = COALESCE($1, name),
          type = COALESCE($2, type),
          district = COALESCE($3, district),
          city = COALESCE($4, city),
          address = COALESCE($5, address),
          contact_phone = COALESCE($6, contact_phone),
          latitude = COALESCE($7, latitude),
          longitude = COALESCE($8, longitude),
          general_beds_total = COALESCE($9, general_beds_total),
          icu_beds_total = COALESCE($10, icu_beds_total),
          occupancy = COALESCE($11, occupancy),
          status = COALESCE($12, status),
          is_24x7 = COALESCE($13, is_24x7),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
      RETURNING *;
    `;

    const result = await query(updateSql, [
      name || null,
      type || null,
      district || null,
      city || null,
      address || null,
      contactPhone || null,
      latitude ? parseFloat(latitude) : null,
      longitude ? parseFloat(longitude) : null,
      generalBedsTotal ? parseInt(generalBedsTotal, 10) : null,
      icuBedsTotal ? parseInt(icuBedsTotal, 10) : null,
      occupancy !== undefined ? parseInt(occupancy, 10) : null,
      status || null,
      is24x7 !== undefined ? is24x7 : null,
      hosp.id
    ]);

    res.json({
      message: 'Hospital updated successfully.',
      hospital: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

// Admin: Delete/Deactivate hospital
async function deleteHospital(req, res, next) {
  try {
    const { id } = req.params;

    const result = await query(
      'UPDATE hospitals SET status = \'Closed\', updated_at = CURRENT_TIMESTAMP WHERE hospital_id = $1 OR id::text = $1 RETURNING id, hospital_id, name, status;',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hospital not found.' });
    }

    res.json({ message: 'Hospital deactivated successfully.', hospital: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getHospitals,
  getHospitalById,
  createHospital,
  updateHospital,
  deleteHospital
};
