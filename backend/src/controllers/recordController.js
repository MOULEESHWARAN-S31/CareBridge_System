const { query } = require('../config/db');

// Get health records for a patient
async function getRecords(req, res, next) {
  try {
    const { patientProfileId, category } = req.query;

    let sql = `
      SELECT id, record_id, patient_profile_id, title, category,
             doctor_name, facility_name, record_date, attachment_url,
             notes, created_at
      FROM health_records
      WHERE 1=1
    `;
    const params = [];

    if (patientProfileId) {
      params.push(patientProfileId);
      sql += ` AND patient_profile_id = $${params.length}`;
    }

    if (category && category !== 'ALL') {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    sql += ` ORDER BY record_date DESC, created_at DESC;`;

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// Add health record / manual lab report
async function createRecord(req, res, next) {
  try {
    const {
      patientProfileId, title, category, doctorName,
      facilityName, recordDate, attachmentUrl, notes
    } = req.body;

    if (!patientProfileId || !title) {
      return res.status(400).json({ error: 'patientProfileId and title are required.' });
    }

    const recordId = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const sql = `
      INSERT INTO health_records (
        record_id, patient_profile_id, title, category,
        doctor_name, facility_name, record_date, attachment_url, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const result = await query(sql, [
      recordId,
      patientProfileId,
      title,
      category || 'Consultation',
      doctorName || 'Medical Officer',
      facilityName || 'Government Hospital',
      recordDate || new Date().toISOString().split('T')[0],
      attachmentUrl || null,
      notes || null
    ]);

    res.status(201).json({
      message: 'Health record added successfully.',
      record: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

// Get lab reports
async function getLabReports(req, res, next) {
  try {
    const { patientProfileId } = req.query;

    let sql = `
      SELECT id, report_id, patient_profile_id, test_name, facility_name,
             report_date, result_summary, status, attachment_url, created_at
      FROM lab_reports
    `;
    const params = [];

    if (patientProfileId) {
      params.push(patientProfileId);
      sql += ` WHERE patient_profile_id = $1`;
    }

    sql += ` ORDER BY report_date DESC;`;

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getRecords,
  createRecord,
  getLabReports
};
