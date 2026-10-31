/**
 * CareBridge Cross-Dashboard Synchronization Controller
 * Shared endpoints connecting Hospital clinical operations with Government & Admin
 */
const { query } = require('../config/db');

const FACILITY_READ_ROLES = ['ADMIN', 'GOVERNMENT', 'HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'LAB_STAFF', 'PHARMACIST'];
const FACILITY_WRITE_ROLES = ['ADMIN', 'HOSPITAL_ADMIN', 'LAB_STAFF', 'PHARMACIST'];

function isStateScope(user) {
  const district = String(user?.district || '').trim().toLowerCase();
  return district === 'all' || district === 'state level' || district === 'statewide';
}

function enforceFacilityScope(req, res, hospitalId) {
  const role = String(req.user?.role || '').toUpperCase();
  if (!FACILITY_READ_ROLES.includes(role) && !FACILITY_WRITE_ROLES.includes(role)) {
    res.status(403).json({ error: 'This facility operation is not authorized for your role.' });
    return false;
  }

  if (role === 'GOVERNMENT') {
    if (!isStateScope(req.user) && req.user?.district && req.query?.district &&
        String(req.query.district).toLowerCase() !== String(req.user.district).toLowerCase()) {
      res.status(403).json({ error: 'Requested district is outside your authorized scope.' });
      return false;
    }
    return true;
  }

  if (['ADMIN', 'HOSPITAL_ADMIN'].includes(role)) return true;

  const assignedHospital = req.user?.hospitalId || req.user?.hospital_id;
  if (!assignedHospital || assignedHospital !== hospitalId) {
    res.status(403).json({ error: 'Hospital staff may access only their assigned facility.' });
    return false;
  }
  return true;
}

// ─── FACILITY MEDICINES (Hospital Pharmacist -> District/State Admin) ────────

async function getFacilityMedicines(req, res, next) {
  try {
    const { hospitalId, district } = req.query;
    const requestedHospital = hospitalId || req.user?.hospitalId || req.user?.hospital_id;
    if (!enforceFacilityScope(req, res, requestedHospital)) return;
    let sql = `
      SELECT fm.*, h.name as hospital_name, h.district
      FROM facility_medicines fm
      JOIN hospitals h ON fm.hospital_id = h.hospital_id
      WHERE 1=1
    `;
    const params = [];

    if (hospitalId) {
      params.push(hospitalId);
      sql += ` AND fm.hospital_id = $${params.length}`;
    }

    if (district && district !== 'ALL') {
      params.push(district);
      sql += ` AND LOWER(h.district) = LOWER($${params.length})`;
    }

    sql += ' ORDER BY fm.medicine_name ASC';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function updateFacilityMedicineStock(req, res, next) {
  try {
    const { id } = req.params;
    const { availableQuantity, batchNumber, expiryDate } = req.body;

    // Check item exists
    const existing = await query('SELECT * FROM facility_medicines WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Medicine stock record not found.' });
    }
    const med = existing.rows[0];
    if (!FACILITY_WRITE_ROLES.includes(String(req.user?.role || '').toUpperCase())) {
      return res.status(403).json({ error: 'Inventory updates require authorized facility staff.' });
    }
    if (!enforceFacilityScope(req, res, med.hospital_id)) return;

    const qty = parseInt(availableQuantity, 10);
    const threshold = med.minimum_stock_threshold || 50;
    let newStatus = 'Adequate';
    if (qty <= threshold * 0.3) {
      newStatus = 'Critical';
    } else if (qty <= threshold) {
      newStatus = 'Low';
    }

    const sql = `
      UPDATE facility_medicines
      SET available_quantity = $1,
          batch_number = COALESCE($2, batch_number),
          expiry_date = COALESCE($3, expiry_date),
          status = $4,
          last_updated = NOW(),
          updated_by = $5
      WHERE id = $6
      RETURNING *
    `;
    const result = await query(sql, [
      qty, batchNumber || null, expiryDate || null, newStatus, req.user?.id || null, id
    ]);

    // Record audit event
    await query(
      `INSERT INTO audit_logs (user_id, user_name, role, action, module, location, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [
        String(req.user?.id || req.user?.userId || 'SYS'),
        req.user?.name || req.user?.full_name || 'Pharmacist',
        req.user?.role || 'PHARMACIST',
        `UPDATE_STOCK: ${med.medicine_name} set to ${qty} (${newStatus})`,
        'Pharmacy & Inventory',
        med.hospital_id
      ]
    );

    res.json({ message: 'Medicine stock updated successfully.', medicine: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// ─── FACILITY DIAGNOSTICS (Hospital Lab -> District/State Admin) ────────────

async function getFacilityDiagnostics(req, res, next) {
  try {
    const { hospitalId, district } = req.query;
    const requestedHospital = hospitalId || req.user?.hospitalId || req.user?.hospital_id;
    if (!enforceFacilityScope(req, res, requestedHospital)) return;
    let sql = `
      SELECT fd.*, h.name as hospital_name, h.district
      FROM facility_diagnostics fd
      JOIN hospitals h ON fd.hospital_id = h.hospital_id
      WHERE 1=1
    `;
    const params = [];

    if (hospitalId) {
      params.push(hospitalId);
      sql += ` AND fd.hospital_id = $${params.length}`;
    }

    if (district && district !== 'ALL') {
      params.push(district);
      sql += ` AND LOWER(h.district) = LOWER($${params.length})`;
    }

    sql += ' ORDER BY fd.test_name ASC';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function updateFacilityDiagnosticStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { equipmentStatus, pendingQueue, testsPerformedToday, reagentStockDays } = req.body;

    const existing = await query('SELECT * FROM facility_diagnostics WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Diagnostic test record not found.' });
    }
    const diag = existing.rows[0];
    if (!FACILITY_WRITE_ROLES.includes(String(req.user?.role || '').toUpperCase())) {
      return res.status(403).json({ error: 'Diagnostic updates require authorized facility staff.' });
    }
    if (!enforceFacilityScope(req, res, diag.hospital_id)) return;

    let overallStatus = 'Available';
    const qCount = pendingQueue !== undefined ? parseInt(pendingQueue, 10) : diag.pending_queue;
    const equipSt = equipmentStatus || diag.equipment_status;

    if (equipSt === 'Offline' || qCount > 30) {
      overallStatus = 'Critical Delay';
    } else if (equipSt === 'Degraded' || qCount > 15) {
      overallStatus = 'High Queue';
    }

    const sql = `
      UPDATE facility_diagnostics
      SET equipment_status = COALESCE($1, equipment_status),
          pending_queue = COALESCE($2, pending_queue),
          tests_performed_today = COALESCE($3, tests_performed_today),
          reagent_stock_days = COALESCE($4, reagent_stock_days),
          status = $5,
          last_updated = NOW(),
          updated_by = $6
      WHERE id = $7
      RETURNING *
    `;
    const result = await query(sql, [
      equipmentStatus || null,
      pendingQueue !== undefined ? parseInt(pendingQueue, 10) : null,
      testsPerformedToday !== undefined ? parseInt(testsPerformedToday, 10) : null,
      reagentStockDays !== undefined ? parseInt(reagentStockDays, 10) : null,
      overallStatus,
      req.user?.id || null,
      id
    ]);

    await query(
      `INSERT INTO audit_logs (user_id, user_name, role, action, module, location, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [
        String(req.user?.id || req.user?.userId || 'SYS'),
        req.user?.name || req.user?.full_name || 'Lab Staff',
        req.user?.role || 'LAB_STAFF',
        `UPDATE_DIAGNOSTIC: ${diag.test_name} status ${overallStatus}`,
        'Laboratory & Diagnostics',
        diag.hospital_id
      ]
    );

    res.json({ message: 'Diagnostic status updated successfully.', diagnostic: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// ─── CAMP HOSPITAL ASSIGNMENTS (Government -> Hospital Staff) ───────────────

async function getHospitalCampAssignments(req, res, next) {
  try {
    const hospitalId = req.query.hospitalId || req.user?.hospitalId || 'GDH-SALEM-01';
    if (!enforceFacilityScope(req, res, hospitalId)) return;
    const sql = `
      SELECT cfa.*, gcp.camp_id, gcp.camp_type, gcp.camp_date, gcp.venue, gcp.district, gcp.block, gcp.village, gcp.status as proposal_status
      FROM camp_facility_assignments cfa
      JOIN government_camp_proposals gcp ON cfa.camp_proposal_id = gcp.id
      WHERE cfa.hospital_id = $1
      ORDER BY gcp.camp_date ASC
    `;
    const result = await query(sql, [hospitalId]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function respondToCampAssignment(req, res, next) {
  try {
    const { id } = req.params;
    const { acceptanceStatus, doctorsAssigned, nursesAssigned, medicinesKitStatus, diagnosticsKitStatus, notes } = req.body;
    if (!FACILITY_WRITE_ROLES.includes(String(req.user?.role || '').toUpperCase())) {
      return res.status(403).json({ error: 'Camp assignment responses require authorized hospital staff.' });
    }

    const assignment = await query('SELECT hospital_id FROM camp_facility_assignments WHERE id = $1', [id]);
    if (assignment.rows.length === 0) {
      return res.status(404).json({ error: 'Camp assignment record not found.' });
    }
    if (!enforceFacilityScope(req, res, assignment.rows[0].hospital_id)) return;

    const sql = `
      UPDATE camp_facility_assignments
      SET acceptance_status = COALESCE($1, acceptance_status),
          doctors_assigned = COALESCE($2, doctors_assigned),
          nurses_assigned = COALESCE($3, nurses_assigned),
          medicines_kit_status = COALESCE($4, medicines_kit_status),
          diagnostics_kit_status = COALESCE($5, diagnostics_kit_status),
          notes = COALESCE($6, notes),
          updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `;
    const result = await query(sql, [
      acceptanceStatus || null,
      doctorsAssigned !== undefined ? parseInt(doctorsAssigned, 10) : null,
      nursesAssigned !== undefined ? parseInt(nursesAssigned, 10) : null,
      medicinesKitStatus || null,
      diagnosticsKitStatus || null,
      notes || null,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Camp assignment record not found.' });
    }

    res.json({ message: 'Camp assignment response recorded.', assignment: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// ─── ADMIN BULK IMPORT ENDPOINT (Transactional Batch Import) ─────────────────

async function bulkImportHospitals(req, res, next) {
  try {
    const { hospitals } = req.body;
    if (!Array.isArray(hospitals) || hospitals.length === 0) {
      return res.status(400).json({ error: 'Array of hospital records is required.' });
    }

    const inserted = [];
    const rejected = [];

    for (const h of hospitals) {
      try {
        if (!h.name || !h.district) {
          rejected.push({ record: h, reason: 'Missing required fields (name, district)' });
          continue;
        }

        const slug = h.name.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 15);
        const hospitalId = h.hospitalId || `fac_${slug}_${Date.now().toString().slice(-4)}_${Math.floor(Math.random()*100)}`;

        const checkDup = await query('SELECT id FROM hospitals WHERE hospital_id = $1 OR LOWER(name) = LOWER($2) LIMIT 1', [hospitalId, h.name.trim()]);
        if (checkDup.rows.length > 0) {
          rejected.push({ record: h, reason: `Hospital with name "${h.name}" already exists` });
          continue;
        }

        const lat = h.latitude !== undefined ? parseFloat(h.latitude) : 11.6643;
        const lng = h.longitude !== undefined ? parseFloat(h.longitude) : 78.1460;

        const insRes = await query(
          `INSERT INTO hospitals (hospital_id, name, type, district, city, address, contact_phone, latitude, longitude, general_beds_total, general_beds_available, icu_beds_total, icu_beds_available, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'Operational')
           RETURNING id, hospital_id, name, district, status`,
          [
            hospitalId,
            h.name.trim(),
            h.type || 'Government Hospital',
            h.district.trim(),
            h.city || h.district.trim(),
            h.address || `${h.name.trim()}, ${h.district.trim()}`,
            h.phone || '+91 427 2415121',
            lat,
            lng,
            parseInt(h.totalBeds, 10) || 100,
            Math.max(0, parseInt(h.availableBeds, 10) || 20),
            parseInt(h.icuBeds, 10) || 10,
            Math.max(0, parseInt(h.icuBedsAvailable, 10) || 2)
          ]
        );
        inserted.push(insRes.rows[0]);
      } catch (rowErr) {
        rejected.push({ record: h, reason: rowErr.message });
      }
    }

    await query(
      `INSERT INTO audit_logs (user_id, user_name, role, action, module, location, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [
        String(req.user?.id || 'ADMIN'),
        req.user?.name || 'System Admin',
        'ADMIN',
        `BULK_IMPORT_HOSPITALS: Inserted ${inserted.length}, Rejected ${rejected.length}`,
        'Hospital Management',
        'Statewide'
      ]
    );

    res.status(201).json({
      message: `Bulk import completed. ${inserted.length} added, ${rejected.length} rejected.`,
      insertedCount: inserted.length,
      rejectedCount: rejected.length,
      inserted,
      rejected
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getFacilityMedicines,
  updateFacilityMedicineStock,
  getFacilityDiagnostics,
  updateFacilityDiagnosticStatus,
  getHospitalCampAssignments,
  respondToCampAssignment,
  bulkImportHospitals
};
