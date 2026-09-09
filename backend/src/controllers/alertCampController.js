const { query } = require('../config/db');

// Health Alerts
async function getHealthAlerts(req, res, next) {
  try {
    const { district, severity } = req.query;

    let sql = 'SELECT * FROM health_alerts WHERE status = \'Active\'';
    const params = [];

    if (district && district !== 'ALL') {
      params.push(district);
      sql += ` AND LOWER(district) = LOWER($${params.length})`;
    }

    if (severity && severity !== 'ALL') {
      params.push(severity);
      sql += ` AND severity = $${params.length}`;
    }

    sql += ' ORDER BY reported_at DESC;';

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function createHealthAlert(req, res, next) {
  try {
    const { title, severity, area, district, disease, casesCount, module } = req.body;

    if (!title || !severity || !area || !district) {
      return res.status(400).json({ error: 'title, severity, area, and district are required.' });
    }

    const alertId = `ALT-${Math.floor(100 + Math.random() * 900)}`;

    const sql = `
      INSERT INTO health_alerts (alert_id, title, severity, area, district, disease, cases_count, module, reported_at, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, 'Active')
      RETURNING *;
    `;

    const result = await query(sql, [
      alertId,
      title,
      severity,
      area,
      district,
      disease || 'Undifferentiated',
      casesCount ? parseInt(casesCount, 10) : 0,
      module || 'Disease Surveillance'
    ]);

    res.status(201).json({ message: 'Health alert published.', alert: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// Health Camps
async function getHealthCamps(req, res, next) {
  try {
    const { district, status } = req.query;

    let sql = 'SELECT * FROM health_camps WHERE 1=1';
    const params = [];

    if (district && district !== 'ALL') {
      params.push(district);
      sql += ` AND LOWER(district) = LOWER($${params.length})`;
    }

    if (status && status !== 'ALL') {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    sql += ' ORDER BY camp_date ASC;';

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function createHealthCamp(req, res, next) {
  try {
    const { location, district, campType, campDate, doctorsCount, nursesCount, expectedPatients, status } = req.body;

    if (!location || !district || !campType || !campDate) {
      return res.status(400).json({ error: 'location, district, campType, and campDate are required.' });
    }

    const campId = `HC-${Math.floor(100 + Math.random() * 900)}`;

    const sql = `
      INSERT INTO health_camps (camp_id, location, district, camp_type, camp_date, doctors_count, nurses_count, expected_patients, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const result = await query(sql, [
      campId,
      location,
      district,
      campType,
      campDate,
      doctorsCount ? parseInt(doctorsCount, 10) : 2,
      nursesCount ? parseInt(nursesCount, 10) : 4,
      expectedPatients ? parseInt(expectedPatients, 10) : 100,
      status || 'Scheduled'
    ]);

    res.status(201).json({ message: 'Health camp scheduled.', camp: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// Referrals
async function getReferrals(req, res, next) {
  try {
    const sql = `
      SELECT r.id, r.referral_id, r.patient_id, r.patient_name,
             r.from_facility_id, r.to_facility_id, r.disease,
             r.priority, r.status, r.created_at,
             h1.name AS from_facility_name, h2.name AS to_facility_name
      FROM referrals r
      LEFT JOIN hospitals h1 ON r.from_facility_id = h1.hospital_id
      LEFT JOIN hospitals h2 ON r.to_facility_id = h2.hospital_id
      ORDER BY r.created_at DESC;
    `;
    const result = await query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// Notifications
async function getNotifications(req, res, next) {
  try {
    const { district } = req.query;
    let sql = 'SELECT * FROM notifications WHERE 1=1';
    const params = [];
    if (district && district !== 'ALL') {
      params.push(district);
      sql += ` AND (LOWER(district) = LOWER($1) OR district = 'All')`;
    }
    sql += ' ORDER BY sent_at DESC;';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getHealthAlerts,
  createHealthAlert,
  getHealthCamps,
  createHealthCamp,
  getReferrals,
  getNotifications
};
