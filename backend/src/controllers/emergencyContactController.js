const { query } = require('../config/db');

// Get emergency contacts for patient
async function getEmergencyContacts(req, res, next) {
  try {
    const { patientProfileId } = req.query;

    if (!patientProfileId) {
      return res.status(400).json({ error: 'patientProfileId query parameter is required.' });
    }

    const sql = `
      SELECT id, patient_profile_id, name, relationship, phone_number, is_primary, created_at
      FROM emergency_contacts
      WHERE patient_profile_id = $1
      ORDER BY is_primary DESC, id ASC;
    `;

    const result = await query(sql, [patientProfileId]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// Add emergency contact
async function addEmergencyContact(req, res, next) {
  try {
    const { patientProfileId, name, relationship, phoneNumber, isPrimary } = req.body;

    if (!patientProfileId || !name || !relationship || !phoneNumber) {
      return res.status(400).json({ error: 'patientProfileId, name, relationship, and phoneNumber are required.' });
    }

    if (isPrimary) {
      // If setting as primary, clear existing primary for this patient
      await query(
        'UPDATE emergency_contacts SET is_primary = FALSE WHERE patient_profile_id = $1;',
        [patientProfileId]
      );
    }

    const sql = `
      INSERT INTO emergency_contacts (patient_profile_id, name, relationship, phone_number, is_primary)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const result = await query(sql, [
      patientProfileId,
      name.trim(),
      relationship.trim(),
      phoneNumber.trim(),
      isPrimary !== undefined ? isPrimary : false
    ]);

    res.status(201).json({
      message: 'Emergency contact added successfully.',
      contact: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

// Update emergency contact
async function updateEmergencyContact(req, res, next) {
  try {
    const { id } = req.params;
    const { name, relationship, phoneNumber, isPrimary, patientProfileId } = req.body;

    if (isPrimary && patientProfileId) {
      await query(
        'UPDATE emergency_contacts SET is_primary = FALSE WHERE patient_profile_id = $1 AND id != $2;',
        [patientProfileId, id]
      );
    }

    const sql = `
      UPDATE emergency_contacts
      SET name = COALESCE($1, name),
          relationship = COALESCE($2, relationship),
          phone_number = COALESCE($3, phone_number),
          is_primary = COALESCE($4, is_primary),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *;
    `;

    const result = await query(sql, [
      name || null,
      relationship || null,
      phoneNumber || null,
      isPrimary !== undefined ? isPrimary : null,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Emergency contact not found.' });
    }

    res.json({ message: 'Emergency contact updated successfully.', contact: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// Delete emergency contact
async function deleteEmergencyContact(req, res, next) {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM emergency_contacts WHERE id = $1 RETURNING id;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Emergency contact not found.' });
    }

    res.json({ message: 'Emergency contact deleted successfully.', id });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getEmergencyContacts,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact
};
