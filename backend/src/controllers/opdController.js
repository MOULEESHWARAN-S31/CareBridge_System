const { query } = require('../config/db');

// Get OPD card for patient
async function getOpdCard(req, res, next) {
  try {
    const { patientProfileId } = req.query;

    if (!patientProfileId) {
      return res.status(400).json({ error: 'patientProfileId query parameter is required.' });
    }

    const sql = `
      SELECT oc.*, p.name, p.gender, p.date_of_birth, p.mobile_number,
             p.district, p.state, p.pincode, p.abha_address
      FROM opd_cards oc
      JOIN abha_profiles p ON oc.patient_profile_id = p.abha_id
      WHERE oc.patient_profile_id = $1
      ORDER BY oc.issue_date DESC
      LIMIT 1;
    `;

    const result = await query(sql, [patientProfileId]);

    if (result.rows.length === 0) {
      // Return synthetic fallback based on ABHA profile if card not yet generated
      const profileRes = await query('SELECT * FROM abha_profiles WHERE abha_id = $1 LIMIT 1;', [patientProfileId]);
      if (profileRes.rows.length === 0) {
        return res.status(404).json({ error: 'Patient ABHA profile not found.' });
      }
      const p = profileRes.rows[0];

      return res.json({
        cardNumber: `OPD-${p.district.substring(0, 3).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        patientProfileId: p.abha_id,
        patientName: p.name,
        department: 'General Medicine',
        issueDate: new Date().toISOString().split('T')[0],
        validTill: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Active',
        gender: p.gender,
        dateOfBirth: p.date_of_birth,
        mobileNumber: p.mobile_number,
        district: p.district
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Issue / create OPD Card
async function createOpdCard(req, res, next) {
  try {
    const { patientProfileId, patientName, department } = req.body;

    if (!patientProfileId) {
      return res.status(400).json({ error: 'patientProfileId is required.' });
    }

    const cardNumber = `OPD-TN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const issueDate = new Date().toISOString().split('T')[0];
    const validTill = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const sql = `
      INSERT INTO opd_cards (card_number, patient_profile_id, patient_name, department, issue_date, valid_till, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'Active')
      RETURNING *;
    `;

    const result = await query(sql, [
      cardNumber,
      patientProfileId,
      patientName || 'Patient',
      department || 'General Medicine',
      issueDate,
      validTill
    ]);

    res.status(201).json({
      message: 'OPD Card issued successfully.',
      opdCard: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getOpdCard,
  createOpdCard
};
