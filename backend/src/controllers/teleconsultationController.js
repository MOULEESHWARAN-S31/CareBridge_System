const { query } = require('../config/db');

async function getTeleconsultations(req, res, next) {
  try {
    const { patientProfileId, doctorId } = req.query;

    let sql = `
      SELECT tc.id, tc.consultation_id, tc.patient_profile_id, tc.patient_name,
             tc.doctor_id, tc.doctor_name, tc.facility_name, tc.consultation_type,
             tc.scheduled_date, tc.scheduled_time, tc.meeting_link, tc.status,
             tc.notes, tc.created_at
      FROM teleconsultations tc
      WHERE 1=1
    `;
    const params = [];

    if (patientProfileId) {
      params.push(patientProfileId);
      sql += ` AND tc.patient_profile_id = $${params.length}`;
    }

    if (doctorId) {
      params.push(doctorId);
      sql += ` AND tc.doctor_id = $${params.length}`;
    }

    sql += ` ORDER BY tc.scheduled_date DESC, tc.created_at DESC;`;

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function createTeleconsultation(req, res, next) {
  try {
    const {
      patientProfileId, patientName, doctorId, doctorName,
      facilityName, consultationType, scheduledDate, scheduledTime, notes
    } = req.body;

    if (!patientProfileId || !scheduledDate || !scheduledTime) {
      return res.status(400).json({ error: 'patientProfileId, scheduledDate, and scheduledTime are required.' });
    }

    const consultationId = `TC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const meetingLink = `https://telemed.carebridge.gov.in/room/${consultationId}`;

    const sql = `
      INSERT INTO teleconsultations (
        consultation_id, patient_profile_id, patient_name, doctor_id,
        doctor_name, facility_name, consultation_type, scheduled_date,
        scheduled_time, meeting_link, status, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Scheduled', $11)
      RETURNING *;
    `;

    const result = await query(sql, [
      consultationId,
      patientProfileId,
      patientName || 'Patient',
      doctorId || null,
      doctorName || 'Consulting Specialist',
      facilityName || 'Government Headquarters Hospital',
      consultationType || 'General Medicine',
      scheduledDate,
      scheduledTime,
      meetingLink,
      notes || null
    ]);

    res.status(201).json({
      message: 'Teleconsultation booked successfully.',
      teleconsultation: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTeleconsultations,
  createTeleconsultation
};
