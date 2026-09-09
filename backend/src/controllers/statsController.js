const { query } = require('../config/db');

async function getStats(req, res, next) {
  try {
    const { district } = req.query;

    const districtFilter = district && district !== 'ALL' ? district : null;

    // Total Patients / ABHA profiles
    const patientsQuery = districtFilter
      ? 'SELECT COUNT(*) AS total FROM abha_profiles WHERE LOWER(district) = LOWER($1);'
      : 'SELECT COUNT(*) AS total FROM abha_profiles;';
    const patientsRes = await query(patientsQuery, districtFilter ? [districtFilter] : []);

    // Facilities
    const facilitiesQuery = districtFilter
      ? 'SELECT COUNT(*) AS total, SUM(general_beds_total + icu_beds_total) AS total_beds, SUM(general_beds_available + icu_beds_available) AS available_beds FROM hospitals WHERE LOWER(district) = LOWER($1);'
      : 'SELECT COUNT(*) AS total, SUM(general_beds_total + icu_beds_total) AS total_beds, SUM(general_beds_available + icu_beds_available) AS available_beds FROM hospitals;';
    const facilitiesRes = await query(facilitiesQuery, districtFilter ? [districtFilter] : []);

    // Today's Appointments
    const apptQuery = districtFilter
      ? `SELECT COUNT(*) AS total FROM appointments WHERE LOWER(district) = LOWER($1) AND appointment_date = CURRENT_DATE;`
      : `SELECT COUNT(*) AS total FROM appointments WHERE appointment_date = CURRENT_DATE;`;
    const apptRes = await query(apptQuery, districtFilter ? [districtFilter] : []);

    // Active Referrals
    const refRes = await query(`SELECT COUNT(*) AS total FROM referrals WHERE status != 'Completed';`);

    // Active Alerts
    const alertRes = await query(`SELECT COUNT(*) AS total FROM health_alerts WHERE status = 'Active';`);

    // Health Camps
    const campRes = await query(`SELECT COUNT(*) AS total FROM health_camps WHERE status IN ('Scheduled', 'Published', 'Ongoing');`);

    // Teleconsultations
    const teleRes = await query(`SELECT COUNT(*) AS total FROM teleconsultations WHERE status != 'Cancelled';`);

    const stats = {
      totalPatients: parseInt(patientsRes.rows[0]?.total || 0, 10),
      activeFacilities: parseInt(facilitiesRes.rows[0]?.total || 0, 10),
      totalBeds: parseInt(facilitiesRes.rows[0]?.total_beds || 0, 10),
      availableBeds: parseInt(facilitiesRes.rows[0]?.available_beds || 0, 10),
      todayAppointments: parseInt(apptRes.rows[0]?.total || 0, 10),
      activeReferrals: parseInt(refRes.rows[0]?.total || 0, 10),
      activeAlerts: parseInt(alertRes.rows[0]?.total || 0, 10),
      activeHealthCamps: parseInt(campRes.rows[0]?.total || 0, 10),
      teleconsultations: parseInt(teleRes.rows[0]?.total || 0, 10)
    };

    res.json(stats);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStats
};
