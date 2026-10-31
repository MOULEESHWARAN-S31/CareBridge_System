/**
 * CareBridge Government Dashboard — Backend Controller
 * Handles all government-specific persistent operations:
 *   - Camp proposals (full 11-status lifecycle)
 *   - Community camp requests
 *   - Resource requests
 *   - Medicine requisitions
 *   - Audit events
 *   - Announcements
 *
 * Geographic enforcement: every write and read checks req.governmentScope
 * set by requireGovernmentScope('ANY') middleware.
 */
const { query } = require('../config/db');

// ─── Helper ─────────────────────────────────────────────────────────────────
function scopedDistrict(req, bodyDistrict) {
  const scope = req.governmentScope;
  if (!scope) return null;
  if (scope.level === 'STATE_ADMIN') {
    // State admin may specify any district; if none supplied return null (all)
    return bodyDistrict && bodyDistrict !== 'ALL' ? bodyDistrict : null;
  }
  // District admin is locked to their assigned district
  return scope.district;
}

function unauthorized(res, msg) {
  return res.status(403).json({ error: msg || 'Geographic authorization denied.' });
}

// ─── CAMP PROPOSALS ─────────────────────────────────────────────────────────

async function getCampProposals(req, res, next) {
  try {
    const { district, status } = req.query;
    const authorizedDistrict = scopedDistrict(req, district);

    let sql = 'SELECT * FROM government_camp_proposals WHERE 1=1';
    const params = [];

    if (authorizedDistrict) {
      // District admin: enforce scope
      if (district && district !== 'ALL' && district.toLowerCase() !== authorizedDistrict.toLowerCase()) {
        return unauthorized(res, 'Requested district is outside your authorized scope.');
      }
      params.push(authorizedDistrict);
      sql += ` AND LOWER(district) = LOWER($${params.length})`;
    } else if (district && district !== 'ALL') {
      params.push(district);
      sql += ` AND LOWER(district) = LOWER($${params.length})`;
    }

    if (status && status !== 'ALL') {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    sql += ' ORDER BY created_at DESC';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function createCampProposal(req, res, next) {
  try {
    const { district, block, village, venue, campDate, campTime, campType, services, doctorsCount, nursesCount, expectedPatients, assignedFacility, stateEscalation } = req.body;

    if (!district || !campDate || !campType) {
      return res.status(400).json({ error: 'district, campDate, and campType are required.' });
    }

    // Authorization check
    const scope = req.governmentScope;
    if (!scope) return unauthorized(res);
    if (scope.level === 'DISTRICT_ADMIN' && scope.district && district.toLowerCase() !== scope.district.toLowerCase()) {
      return unauthorized(res, 'Camp district is outside your authorized scope.');
    }

    const campId = `GCP-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 100)}`;
    const proposerName = req.user?.name || req.user?.full_name || 'District Officer';
    const proposerId = req.user?.id || req.user?.userId || null;

    const sql = `
      INSERT INTO government_camp_proposals
        (camp_id, proposer_id, proposer_name, district, block, village, venue,
         camp_date, camp_time, camp_type, services, doctors_count, nurses_count,
         expected_patients, assigned_facility, state_escalation, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,'Draft')
      RETURNING *
    `;
    const result = await query(sql, [
      campId, proposerId, proposerName, district, block || '', village || '', venue || '',
      campDate, campTime || '09:00:00', campType,
      JSON.stringify(services || []),
      parseInt(doctorsCount) || 2, parseInt(nursesCount) || 4, parseInt(expectedPatients) || 100,
      assignedFacility || '', stateEscalation || false
    ]);

    // Audit
    await _auditEvent(req, 'CREATE_CAMP_PROPOSAL', 'Health Camps', campId, 'CampProposal', district, 'SUCCESS', `Created camp proposal: ${campType} at ${village || district}`);

    res.status(201).json({ message: 'Camp proposal created.', camp: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function updateCampStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, reviewNotes, actualAttendance, outcomeSummary } = req.body;

    const VALID_STATUSES = ['Draft','Submitted','Under Review','Approved','Rejected','Escalated','Scheduled','Published','Ongoing','Completed','Cancelled'];
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    // Fetch existing to check geographic scope
    const existing = await query('SELECT * FROM government_camp_proposals WHERE id=$1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Camp proposal not found.' });
    const camp = existing.rows[0];

    const scope = req.governmentScope;
    if (scope?.level === 'DISTRICT_ADMIN' && scope.district && camp.district.toLowerCase() !== scope.district.toLowerCase()) {
      return unauthorized(res);
    }

    // State-level approvals only by STATE_ADMIN
    if (['Approved','Rejected','Escalated'].includes(status) && scope?.level === 'DISTRICT_ADMIN') {
      return unauthorized(res, 'Approval/Rejection requires State Admin authorization.');
    }

    const reviewerName = req.user?.name || req.user?.full_name || null;
    const reviewerId = req.user?.id || req.user?.userId || null;

    const sql = `
      UPDATE government_camp_proposals
      SET status=$1, reviewer_id=$2, reviewer_name=$3, review_notes=$4,
          actual_attendance=$5, outcome_summary=$6, updated_at=NOW()
      WHERE id=$7 RETURNING *
    `;
    const result = await query(sql, [
      status, reviewerId, reviewerName, reviewNotes || camp.review_notes,
      actualAttendance || camp.actual_attendance, outcomeSummary || camp.outcome_summary, id
    ]);

    await _auditEvent(req, `UPDATE_CAMP_STATUS_${status.toUpperCase().replace(' ','_')}`, 'Health Camps', camp.camp_id, 'CampProposal', camp.district, 'SUCCESS', `Status changed to ${status}${reviewNotes ? ': ' + reviewNotes : ''}`);

    res.json({ message: `Camp status updated to ${status}.`, camp: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// ─── COMMUNITY REQUESTS ─────────────────────────────────────────────────────

async function getCommunityRequests(req, res, next) {
  try {
    const { district, status } = req.query;
    const authorizedDistrict = scopedDistrict(req, district);

    let sql = 'SELECT * FROM community_camp_requests WHERE 1=1';
    const params = [];

    if (authorizedDistrict) {
      if (district && district !== 'ALL' && district.toLowerCase() !== authorizedDistrict.toLowerCase()) {
        return unauthorized(res);
      }
      params.push(authorizedDistrict);
      sql += ` AND LOWER(district) = LOWER($${params.length})`;
    } else if (district && district !== 'ALL') {
      params.push(district);
      sql += ` AND LOWER(district) = LOWER($${params.length})`;
    }

    if (status && status !== 'ALL') {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    sql += ' ORDER BY urgency_level DESC, created_at DESC';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function updateCommunityRequestStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;

    const existing = await query('SELECT * FROM community_camp_requests WHERE id=$1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Community request not found.' });
    const req2 = existing.rows[0];

    const scope = req.governmentScope;
    if (scope?.level === 'DISTRICT_ADMIN' && scope.district && req2.district.toLowerCase() !== scope.district.toLowerCase()) {
      return unauthorized(res);
    }

    const sql = 'UPDATE community_camp_requests SET status=$1, review_notes=$2, reviewer_id=$3, updated_at=NOW() WHERE id=$4 RETURNING *';
    const result = await query(sql, [status, reviewNotes || '', req.user?.id || null, id]);

    await _auditEvent(req, `UPDATE_COMMUNITY_REQUEST_${status}`, 'Community Requests', req2.request_id, 'CommunityRequest', req2.district, 'SUCCESS', `Status updated to ${status}`);

    res.json({ message: 'Community request updated.', request: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function convertCommunityRequestToCamp(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM community_camp_requests WHERE id=$1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Community request not found.' });
    const cr = existing.rows[0];

    const scope = req.governmentScope;
    if (scope?.level === 'DISTRICT_ADMIN' && scope.district && cr.district.toLowerCase() !== scope.district.toLowerCase()) {
      return unauthorized(res);
    }

    // Create a camp proposal from this request
    const campId = `GCP-${Date.now().toString().slice(-6)}`;
    const campSql = `
      INSERT INTO government_camp_proposals
        (camp_id, proposer_id, proposer_name, district, block, village, camp_type, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,'Submitted') RETURNING id
    `;
    const campRes = await query(campSql, [
      campId, req.user?.id || null, req.user?.name || 'Officer',
      cr.district, cr.block || '', cr.village, cr.category || 'General Health Camp'
    ]);
    const campRowId = campRes.rows[0].id;

    // Mark request as converted
    await query('UPDATE community_camp_requests SET status=\'CONVERTED\', converted_camp_id=$1, updated_at=NOW() WHERE id=$2', [campRowId, id]);

    await _auditEvent(req, 'CONVERT_COMMUNITY_REQUEST', 'Community Requests', cr.request_id, 'CommunityRequest', cr.district, 'SUCCESS', `Converted to camp proposal ${campId}`);

    res.json({ message: 'Community request converted to camp proposal.', campId, campProposalId: campRowId });
  } catch (err) {
    next(err);
  }
}

// ─── RESOURCE REQUESTS ───────────────────────────────────────────────────────

async function getResourceRequests(req, res, next) {
  try {
    const { district, status } = req.query;
    const authorizedDistrict = scopedDistrict(req, district);

    let sql = 'SELECT * FROM government_resource_requests WHERE 1=1';
    const params = [];

    if (authorizedDistrict) {
      if (district && district !== 'ALL' && district.toLowerCase() !== authorizedDistrict.toLowerCase()) {
        return unauthorized(res, 'Requested district is outside your authorized scope.');
      }
      params.push(authorizedDistrict);
      sql += ` AND LOWER(requesting_district) = LOWER($${params.length})`;
    } else if (district && district !== 'ALL') {
      params.push(district);
      sql += ` AND LOWER(requesting_district) = LOWER($${params.length})`;
    }

    if (status && status !== 'ALL') {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    sql += ' ORDER BY created_at DESC';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function createResourceRequest(req, res, next) {
  try {
    const { requestType, title, description, quantityNeeded, urgency } = req.body;

    const scope = req.governmentScope;
    if (!scope) return unauthorized(res);

    const district = scope.level === 'DISTRICT_ADMIN' ? scope.district : (req.body.district || 'State');
    const officerName = req.user?.name || req.user?.full_name || 'Government Officer';

    const requestId = `RR-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    const sql = `
      INSERT INTO government_resource_requests
        (request_id, requesting_district, requesting_officer_id, requesting_officer_name, request_type, title, description, quantity_needed, urgency, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'SUBMITTED') RETURNING *
    `;
    const result = await query(sql, [
      requestId, district, req.user?.id || null, officerName,
      requestType || 'GENERAL', title, description || '', quantityNeeded || 1, urgency || 'ROUTINE'
    ]);

    await _auditEvent(req, 'SUBMIT_RESOURCE_REQUEST', 'Resource Requests', requestId, 'ResourceRequest', district, 'SUCCESS', `Submitted: ${title}`);

    res.status(201).json({ message: 'Resource request submitted.', request: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function updateResourceRequest(req, res, next) {
  try {
    const { id } = req.params;
    const { status, reviewNotes, assignedTo } = req.body;

    const existing = await query('SELECT * FROM government_resource_requests WHERE id=$1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Resource request not found.' });
    const rr = existing.rows[0];

    const scope = req.governmentScope;
    if (scope?.level === 'DISTRICT_ADMIN' && scope.district &&
        rr.requesting_district.toLowerCase() !== scope.district.toLowerCase()) {
      return unauthorized(res, 'Resource request is outside your authorized scope.');
    }
    // Only STATE_ADMIN can approve/reject
    if (['APPROVED','REJECTED','FULFILLED'].includes(status) && scope?.level === 'DISTRICT_ADMIN') {
      return unauthorized(res, 'Approvals require State Admin authorization.');
    }

    const sql = `
      UPDATE government_resource_requests
      SET status=$1, reviewer_id=$2, reviewer_name=$3, review_notes=$4, assigned_to=$5, updated_at=NOW()
      WHERE id=$6 RETURNING *
    `;
    const result = await query(sql, [
      status, req.user?.id || null, req.user?.name || null, reviewNotes || '', assignedTo || rr.assigned_to, id
    ]);

    await _auditEvent(req, `UPDATE_RESOURCE_REQUEST_${status}`, 'Resource Requests', rr.request_id, 'ResourceRequest', rr.requesting_district, 'SUCCESS', `Status: ${status}`);

    res.json({ message: 'Resource request updated.', request: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// ─── MEDICINE REQUISITIONS ───────────────────────────────────────────────────

async function getMedicineRequisitions(req, res, next) {
  try {
    const { district, status } = req.query;
    const authorizedDistrict = scopedDistrict(req, district);

    let sql = 'SELECT * FROM government_medicine_requisitions WHERE 1=1';
    const params = [];

    if (authorizedDistrict) {
      if (district && district !== 'ALL' && district.toLowerCase() !== authorizedDistrict.toLowerCase()) {
        return unauthorized(res, 'Requested district is outside your authorized scope.');
      }
      params.push(authorizedDistrict);
      sql += ` AND LOWER(requesting_district) = LOWER($${params.length})`;
    } else if (district && district !== 'ALL') {
      params.push(district);
      sql += ` AND LOWER(requesting_district) = LOWER($${params.length})`;
    }

    if (status && status !== 'ALL') {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    sql += ' ORDER BY created_at DESC';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function createMedicineRequisition(req, res, next) {
  try {
    const { targetFacility, itemName, itemType, quantity, unit, urgency, justification } = req.body;

    if (!itemName || !quantity) {
      return res.status(400).json({ error: 'itemName and quantity are required.' });
    }

    const scope = req.governmentScope;
    if (!scope) return unauthorized(res);
    const district = scope.level === 'DISTRICT_ADMIN' ? scope.district : (req.body.district || 'State');
    const officerName = req.user?.name || req.user?.full_name || 'Officer';

    const reqId = `MR-${Date.now().toString().slice(-7)}`;
    const sql = `
      INSERT INTO government_medicine_requisitions
        (requisition_id, requesting_district, requesting_officer_id, requesting_officer_name,
         target_facility, item_name, item_type, quantity, unit, urgency, justification, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'SUBMITTED') RETURNING *
    `;
    const result = await query(sql, [
      reqId, district, req.user?.id || null, officerName,
      targetFacility || '', itemName, itemType || 'MEDICINE',
      parseInt(quantity), unit || 'Units', urgency || 'ROUTINE', justification || ''
    ]);

    await _auditEvent(req, 'SUBMIT_MEDICINE_REQUISITION', 'Medicine & Diagnostics', reqId, 'MedicineRequisition', district, 'SUCCESS', `Requisition for ${itemName} x${quantity}`);

    res.status(201).json({ message: 'Medicine requisition submitted.', requisition: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// ─── AUDIT EVENTS ────────────────────────────────────────────────────────────

async function getAuditEvents(req, res, next) {
  try {
    const { district, module, limit } = req.query;
    const authorizedDistrict = scopedDistrict(req, district);

    let sql = 'SELECT * FROM government_audit_events WHERE 1=1';
    const params = [];

    if (authorizedDistrict) {
      params.push(authorizedDistrict);
      sql += ` AND (LOWER(district) = LOWER($${params.length}) OR district IS NULL)`;
    } else if (district && district !== 'ALL') {
      params.push(district);
      sql += ` AND LOWER(district) = LOWER($${params.length})`;
    }

    if (module && module !== 'ALL') {
      params.push(module);
      sql += ` AND module = $${params.length}`;
    }

    sql += ' ORDER BY created_at DESC';
    if (limit) {
      params.push(parseInt(limit));
      sql += ` LIMIT $${params.length}`;
    }

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function createAuditEvent(req, res, next) {
  try {
    const { action, module, resourceId, resourceType, district, result: eventResult, details } = req.body;

    if (!action) return res.status(400).json({ error: 'action is required.' });

    const actorName = req.user?.name || req.user?.full_name || 'Government Officer';
    const actorRole = req.governmentScope?.level || 'GOVERNMENT';
    const ip = req.ip || req.headers['x-forwarded-for'] || null;

    const sql = `
      INSERT INTO government_audit_events
        (actor_user_id, actor_name, actor_role, action, module, resource_id, resource_type, district, result, details, ip_address)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id
    `;
    const r = await query(sql, [
      req.user?.id || req.user?.userId || null, actorName, actorRole, action, module || null,
      resourceId || null, resourceType || null, district || null, eventResult || 'SUCCESS', details || null, ip
    ]);

    res.status(201).json({ message: 'Audit event recorded.', id: r.rows[0].id });
  } catch (err) {
    next(err);
  }
}

// ─── ANNOUNCEMENTS ───────────────────────────────────────────────────────────

async function getAnnouncements(req, res, next) {
  try {
    const { status, district } = req.query;
    let sql = 'SELECT * FROM government_announcements WHERE 1=1';
    const params = [];

    if (status && status !== 'ALL') {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    sql += ' ORDER BY created_at DESC LIMIT 50';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

async function createAnnouncement(req, res, next) {
  try {
    const { title, content, audienceType, targetDistricts, category, publishAt } = req.body;

    if (!title || !content) return res.status(400).json({ error: 'title and content are required.' });

    const scope = req.governmentScope;
    // Only STATE_ADMIN can create statewide announcements
    if (audienceType === 'ALL' && scope?.level === 'DISTRICT_ADMIN') {
      return unauthorized(res, 'Statewide announcements require State Admin authorization.');
    }

    const announcementId = `ANN-${Date.now().toString().slice(-7)}`;
    const sql = `
      INSERT INTO government_announcements
        (announcement_id, author_id, author_name, title, content, audience_type, target_districts, category, status, publish_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'Draft',$9) RETURNING *
    `;
    const result = await query(sql, [
      announcementId, req.user?.id || null, req.user?.name || 'Officer',
      title, content, audienceType || 'ALL',
      JSON.stringify(targetDistricts || []), category || 'General', publishAt || null
    ]);

    await _auditEvent(req, 'CREATE_ANNOUNCEMENT', 'Announcements', announcementId, 'Announcement', null, 'SUCCESS', `Created: ${title}`);

    res.status(201).json({ message: 'Announcement created as draft.', announcement: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function updateAnnouncementStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existing = await query('SELECT * FROM government_announcements WHERE id=$1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Announcement not found.' });

    // Publishing requires STATE_ADMIN
    const scope = req.governmentScope;
    if (['Published','Approved'].includes(status) && scope?.level === 'DISTRICT_ADMIN') {
      return unauthorized(res, 'Publishing announcements requires State Admin authorization.');
    }

    const publishedAt = status === 'Published' ? 'NOW()' : 'NULL';
    const sql = `
      UPDATE government_announcements
      SET status=$1, approver_id=$2, ${status === 'Published' ? 'published_at=NOW(),' : ''}  updated_at=NOW()
      WHERE id=$3 RETURNING *
    `;
    // Avoid literal NOW() interpolation bug:
    const updateSql = status === 'Published'
      ? 'UPDATE government_announcements SET status=$1, approver_id=$2, published_at=NOW(), updated_at=NOW() WHERE id=$3 RETURNING *'
      : 'UPDATE government_announcements SET status=$1, approver_id=$2, updated_at=NOW() WHERE id=$3 RETURNING *';

    const result = await query(updateSql, [status, req.user?.id || null, id]);
    res.json({ message: `Announcement ${status}.`, announcement: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// ─── GOVERNMENT PROFILE (for frontend verification) ─────────────────────────

async function getGovernmentProfile(req, res, next) {
  try {
    const user = req.user;
    const scope = req.governmentScope;
    res.json({
      id: user.id || user.userId,
      email: user.email,
      name: user.name || user.full_name,
      role: user.role,
      district: user.district,
      governmentRole: scope?.level || 'DISTRICT_ADMIN',
      authorizedDistrict: scope?.district || null,
      stateName: 'Tamil Nadu',
    });
  } catch (err) {
    next(err);
  }
}

// ─── Internal Audit Helper ───────────────────────────────────────────────────
async function _auditEvent(req, action, module, resourceId, resourceType, district, result, details) {
  try {
    const actorName = req.user?.name || req.user?.full_name || 'Government Officer';
    const actorRole = req.governmentScope?.level || 'GOVERNMENT';
    const ip = req.ip || null;
    await query(
      `INSERT INTO government_audit_events (actor_user_id, actor_name, actor_role, action, module, resource_id, resource_type, district, result, details, ip_address) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [req.user?.id || req.user?.userId || null, actorName, actorRole, action, module, resourceId, resourceType, district, result, details, ip]
    );
  } catch (_) {
    // Audit failures must not break primary operations
  }
}

module.exports = {
  getCampProposals,
  createCampProposal,
  updateCampStatus,
  getCommunityRequests,
  updateCommunityRequestStatus,
  convertCommunityRequestToCamp,
  getResourceRequests,
  createResourceRequest,
  updateResourceRequest,
  getMedicineRequisitions,
  createMedicineRequisition,
  getAuditEvents,
  createAuditEvent,
  getAnnouncements,
  createAnnouncement,
  updateAnnouncementStatus,
  getGovernmentProfile,
};
