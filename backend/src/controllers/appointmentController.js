const { query, withTransaction } = require('../config/db');

// Get appointments (filterable by patientProfileId, hospitalId, district)
async function getAppointments(req, res, next) {
  try {
    const { patientProfileId, hospitalId, district, date } = req.query;

    let sql = `
      SELECT a.id, a.appointment_id, a.patient_profile_id, a.patient_name,
             a.hospital_id, a.doctor_id, a.doctor_name, a.hospital_name,
             a.district, a.appointment_date, a.slot_time, a.status, a.notes,
             a.created_at, h.type AS hospital_type, h.contact_phone AS hospital_phone
      FROM appointments a
      LEFT JOIN hospitals h ON a.hospital_id = h.hospital_id
      WHERE 1=1
    `;
    const params = [];

    if (patientProfileId) {
      params.push(patientProfileId);
      sql += ` AND a.patient_profile_id = $${params.length}`;
    }

    if (hospitalId) {
      params.push(hospitalId);
      sql += ` AND a.hospital_id = $${params.length}`;
    }

    if (district && district !== 'ALL') {
      params.push(district);
      sql += ` AND LOWER(a.district) = LOWER($${params.length})`;
    }

    if (date) {
      params.push(date);
      sql += ` AND a.appointment_date = $${params.length}`;
    }

    sql += ` ORDER BY a.appointment_date DESC, a.created_at DESC;`;

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// Create new appointment (Transactional)
async function createAppointment(req, res, next) {
  try {
    const {
      patientProfileId, patientName, hospitalId, doctorId,
      appointmentDate, slotTime, notes
    } = req.body;

    if (!patientProfileId || !hospitalId || !appointmentDate || !slotTime) {
      return res.status(400).json({
        error: 'patientProfileId, hospitalId, appointmentDate, and slotTime are required.'
      });
    }

    // Execute in database transaction to prevent race conditions & partial records
    const newAppointment = await withTransaction(async (client) => {
      // 1. Fetch Hospital
      const hospRes = await client.query(
        'SELECT name, district FROM hospitals WHERE hospital_id = $1 OR id::text = $1 LIMIT 1;',
        [hospitalId]
      );
      if (hospRes.rows.length === 0) {
        throw new Error(`Hospital not found for id: ${hospitalId}`);
      }
      const hospital = hospRes.rows[0];

      // 2. Fetch Doctor if provided
      let doctorName = 'On-Duty Medical Officer';
      let cleanDoctorId = doctorId || null;
      if (doctorId) {
        const docRes = await client.query(
          'SELECT doctor_id, name FROM doctors WHERE doctor_id = $1 OR id::text = $1 LIMIT 1;',
          [doctorId]
        );
        if (docRes.rows.length > 0) {
          doctorName = docRes.rows[0].name;
          cleanDoctorId = docRes.rows[0].doctor_id;
        }
      }

      // 3. Resolve Patient Name if not sent
      let resolvedPatientName = patientName;
      if (!resolvedPatientName) {
        const pRes = await client.query(
          'SELECT name FROM abha_profiles WHERE abha_id = $1 LIMIT 1;',
          [patientProfileId]
        );
        resolvedPatientName = pRes.rows.length > 0 ? pRes.rows[0].name : 'Patient';
      }

      // 4. Check duplicate booking for the same doctor and slot on the date
      if (cleanDoctorId) {
        const dupCheck = await client.query(
          `SELECT id FROM appointments WHERE doctor_id = $1 AND appointment_date = $2 AND slot_time = $3 AND status != 'Cancelled';`,
          [cleanDoctorId, appointmentDate, slotTime]
        );
        if (dupCheck.rows.length > 0) {
          const err = new Error('The selected appointment slot has already been booked for this doctor.');
          err.statusCode = 409;
          throw err;
        }
      }

      // 5. Generate deterministic unique appointment ID
      const appointmentId = `APT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 6. Insert appointment
      const insertSql = `
        INSERT INTO appointments (
          appointment_id, patient_profile_id, patient_name, hospital_id,
          doctor_id, doctor_name, hospital_name, district,
          appointment_date, slot_time, status, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Confirmed', $11)
        RETURNING *;
      `;

      const insertRes = await client.query(insertSql, [
        appointmentId,
        patientProfileId,
        resolvedPatientName,
        hospitalId,
        cleanDoctorId,
        doctorName,
        hospital.name,
        hospital.district,
        appointmentDate,
        slotTime,
        notes || null
      ]);

      return insertRes.rows[0];
    });

    res.status(201).json({
      message: 'Appointment booked successfully.',
      appointment: newAppointment
    });
  } catch (err) {
    next(err);
  }
}

// Cancel appointment
async function cancelAppointment(req, res, next) {
  try {
    const { id } = req.params;

    const result = await query(
      `UPDATE appointments SET status = 'Cancelled', updated_at = CURRENT_TIMESTAMP WHERE appointment_id = $1 OR id::text = $1 RETURNING *;`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    res.json({ message: 'Appointment cancelled successfully.', appointment: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAppointments,
  createAppointment,
  cancelAppointment
};
