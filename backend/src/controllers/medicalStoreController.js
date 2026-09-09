const { query } = require('../config/db');

// List medical stores with optional district and GPS distance calculation
async function getMedicalStores(req, res, next) {
  try {
    const { district, lat, lng, search } = req.query;

    let sql = `
      SELECT id, store_id, name, address, district, city,
             contact_phone, latitude, longitude, is_24x7, status
    `;

    if (lat && lng) {
      const uLat = parseFloat(lat);
      const uLng = parseFloat(lng);
      sql += `, (
        6371 * acos(
          cos(radians(${uLat})) * cos(radians(latitude)) *
          cos(radians(longitude) - radians(${uLng})) +
          sin(radians(${uLat})) * sin(radians(latitude))
        )
      ) AS distance_km`;
    }

    sql += ` FROM medical_stores WHERE status = 'Active'`;
    const params = [];

    if (district && district !== 'ALL') {
      params.push(district);
      sql += ` AND LOWER(district) = LOWER($${params.length})`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      sql += ` AND (name ILIKE $${params.length} OR address ILIKE $${params.length} OR city ILIKE $${params.length})`;
    }

    if (lat && lng) {
      sql += ` ORDER BY distance_km ASC;`;
    } else {
      sql += ` ORDER BY name ASC;`;
    }

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// Admin: Create medical store
async function createMedicalStore(req, res, next) {
  try {
    const { name, address, district, city, contactPhone, latitude, longitude, is24x7 } = req.body;

    if (!name || !address || !district || !city || !contactPhone) {
      return res.status(400).json({ error: 'Name, address, district, city, and contactPhone are required.' });
    }

    const storeId = `med_${district.toLowerCase().substring(0, 3)}_${Math.floor(100 + Math.random() * 900)}`;
    const lat = latitude ? parseFloat(latitude) : 11.6643;
    const lng = longitude ? parseFloat(longitude) : 78.1460;

    const sql = `
      INSERT INTO medical_stores (
        store_id, name, address, district, city, contact_phone,
        latitude, longitude, is_24x7, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Active')
      RETURNING *;
    `;

    const result = await query(sql, [
      storeId,
      name.trim(),
      address.trim(),
      district.trim(),
      city.trim(),
      contactPhone.trim(),
      lat,
      lng,
      is24x7 !== undefined ? is24x7 : false
    ]);

    res.status(201).json({
      message: 'Medical store created successfully.',
      store: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

// Admin: Update medical store
async function updateMedicalStore(req, res, next) {
  try {
    const { id } = req.params;
    const { name, address, district, city, contactPhone, latitude, longitude, is24x7, status } = req.body;

    const sql = `
      UPDATE medical_stores
      SET name = COALESCE($1, name),
          address = COALESCE($2, address),
          district = COALESCE($3, district),
          city = COALESCE($4, city),
          contact_phone = COALESCE($5, contact_phone),
          latitude = COALESCE($6, latitude),
          longitude = COALESCE($7, longitude),
          is_24x7 = COALESCE($8, is_24x7),
          status = COALESCE($9, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE store_id = $10 OR id::text = $10
      RETURNING *;
    `;

    const result = await query(sql, [
      name || null,
      address || null,
      district || null,
      city || null,
      contactPhone || null,
      latitude ? parseFloat(latitude) : null,
      longitude ? parseFloat(longitude) : null,
      is24x7 !== undefined ? is24x7 : null,
      status || null,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Medical store not found.' });
    }

    res.json({ message: 'Medical store updated successfully.', store: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// Admin: Delete/Deactivate medical store
async function deleteMedicalStore(req, res, next) {
  try {
    const { id } = req.params;
    const result = await query(
      `UPDATE medical_stores SET status = 'Inactive', updated_at = CURRENT_TIMESTAMP WHERE store_id = $1 OR id::text = $1 RETURNING *;`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Medical store not found.' });
    }

    res.json({ message: 'Medical store deactivated successfully.', store: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMedicalStores,
  createMedicalStore,
  updateMedicalStore,
  deleteMedicalStore
};
