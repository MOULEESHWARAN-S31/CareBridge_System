const { query } = require('../config/db');

async function getDoctors(req, res, next) {
  try {
    const { hospitalId, specialization } = req.query;

    let sql = `
      SELECT d.id, d.doctor_id, d.name, d.specialization, d.hospital_id,
             d.phone, d.experience_years, d.available_days, d.consultation_fee,
             d.status, h.name AS hospital_name, h.district AS hospital_district
      FROM doctors d
      LEFT JOIN hospitals h ON d.hospital_id = h.hospital_id
      WHERE d.status = 'Active'
    `;
    const params = [];

    if (hospitalId) {
      params.push(hospitalId);
      sql += ` AND d.hospital_id = $${params.length}`;
    }

    if (specialization) {
      params.push(`%${specialization}%`);
      sql += ` AND d.specialization ILIKE $${params.length}`;
    }

    sql += ` ORDER BY d.name ASC;`;

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function getDoctorById(req, res, next) {
  try {
    const { id } = req.params;

    const sql = `
      SELECT d.*, h.name AS hospital_name, h.district AS hospital_district
      FROM doctors d
      LEFT JOIN hospitals h ON d.hospital_id = h.hospital_id
      WHERE d.doctor_id = $1 OR d.id::text = $1
      LIMIT 1;
    `;

    const result = await query(sql, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function getDoctorSlots(req, res, next) {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const targetDate = date || new Date().toISOString().split('T')[0];

    // Standard consultation slots
    const standardSlots = [
      '09:00 AM - 09:30 AM',
      '09:30 AM - 10:00 AM',
      '10:00 AM - 10:30 AM',
      '10:30 AM - 11:00 AM',
      '11:00 AM - 11:30 AM',
      '11:30 AM - 12:00 PM',
      '02:00 PM - 02:30 PM',
      '02:30 PM - 03:00 PM',
      '03:00 PM - 03:30 PM',
      '03:30 PM - 04:00 PM'
    ];

    // Check booked slots for this doctor on targetDate
    const bookedRes = await query(
      `SELECT slot_time FROM appointments WHERE (doctor_id = $1 OR doctor_id IN (SELECT doctor_id FROM doctors WHERE id::text = $1)) AND appointment_date = $2 AND status != 'Cancelled';`,
      [id, targetDate]
    );

    const bookedSlots = bookedRes.rows.map(r => r.slot_time);

    const slots = standardSlots.map((time, idx) => ({
      id: `slot_${idx + 1}`,
      time,
      isAvailable: !bookedSlots.includes(time)
    }));

    res.json({
      doctorId: id,
      date: targetDate,
      slots
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDoctors,
  getDoctorById,
  getDoctorSlots
};
