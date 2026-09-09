const { query } = require('../config/db');

// Lookup ABHA profiles by mobile number (Mandatory ABHA Flow)
async function getProfilesByMobile(req, res, next) {
  try {
    const { mobileNumber } = req.query;

    if (!mobileNumber) {
      return res.status(400).json({ error: 'Query parameter mobileNumber is required.' });
    }

    const cleanMobile = mobileNumber.trim();

    const sql = `
      SELECT id, abha_id, abha_address, name, gender, date_of_birth,
             relationship, mobile_number, district, state, pincode, created_at
      FROM abha_profiles
      WHERE mobile_number = $1
      ORDER BY id ASC;
    `;

    const result = await query(sql, [cleanMobile]);

    // Returns array of 0, 1, 2, 3, or 4 profiles
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// Get single profile by abha_id or internal ID
async function getProfileById(req, res, next) {
  try {
    const { id } = req.params;

    const sql = `
      SELECT id, abha_id, abha_address, name, gender, date_of_birth,
             relationship, mobile_number, district, state, pincode, created_at
      FROM abha_profiles
      WHERE abha_id = $1 OR id::text = $1
      LIMIT 1;
    `;

    const result = await query(sql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'ABHA profile not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Register a new synthetic ABHA profile (when 0 profiles found)
async function createProfile(req, res, next) {
  try {
    const {
      abhaId, abhaAddress, name, gender,
      dateOfBirth, relationship, mobileNumber,
      district, state, pincode
    } = req.body;

    if (!name || !mobileNumber || !gender || !dateOfBirth) {
      return res.status(400).json({ error: 'Name, mobileNumber, gender, and dateOfBirth are required.' });
    }

    const generatedAbhaId = abhaId || `${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const cleanNameSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '.');
    const generatedAddress = abhaAddress || `${cleanNameSlug}@abdm`;

    const sql = `
      INSERT INTO abha_profiles (
        abha_id, abha_address, name, gender, date_of_birth,
        relationship, mobile_number, district, state, pincode
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const result = await query(sql, [
      generatedAbhaId,
      generatedAddress,
      name,
      gender,
      dateOfBirth,
      relationship || 'Self',
      mobileNumber,
      district || 'Salem',
      state || 'Tamil Nadu',
      pincode || '636001'
    ]);

    res.status(201).json({
      message: 'ABHA profile created successfully.',
      profile: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfilesByMobile,
  getProfileById,
  createProfile
};
