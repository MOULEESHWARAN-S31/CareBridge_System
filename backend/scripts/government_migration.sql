-- ============================================================
-- CareBridge Government Dashboard - Backend Migration
-- Government operational tables for persistent data
-- Safe: additive only, no drops, no resets
-- ============================================================

-- Government Camp Proposals (Full 11-status lifecycle)
CREATE TABLE IF NOT EXISTS government_camp_proposals (
  id SERIAL PRIMARY KEY,
  camp_id VARCHAR(50) UNIQUE NOT NULL,
  proposer_id INTEGER REFERENCES users(id),
  proposer_name VARCHAR(200),
  district VARCHAR(100) NOT NULL,
  block VARCHAR(100),
  village VARCHAR(100),
  venue TEXT,
  camp_date DATE,
  camp_time TIME DEFAULT '09:00:00',
  camp_type VARCHAR(100) DEFAULT 'General Health Camp',
  services JSONB DEFAULT '[]',
  doctors_count INTEGER DEFAULT 2,
  nurses_count INTEGER DEFAULT 4,
  expected_patients INTEGER DEFAULT 100,
  status VARCHAR(50) DEFAULT 'Draft'
    CHECK (status IN ('Draft','Submitted','Under Review','Approved','Rejected','Escalated','Scheduled','Published','Ongoing','Completed','Cancelled')),
  reviewer_id INTEGER REFERENCES users(id),
  reviewer_name VARCHAR(200),
  review_notes TEXT,
  state_escalation BOOLEAN DEFAULT false,
  assigned_facility VARCHAR(200),
  actual_attendance INTEGER,
  outcome_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_gov_camps_district ON government_camp_proposals(district);
CREATE INDEX IF NOT EXISTS idx_gov_camps_status ON government_camp_proposals(status);
CREATE INDEX IF NOT EXISTS idx_gov_camps_date ON government_camp_proposals(camp_date);

-- Community Health Camp Requests (from citizens/Patient App)
CREATE TABLE IF NOT EXISTS community_camp_requests (
  id SERIAL PRIMARY KEY,
  request_id VARCHAR(50) UNIQUE NOT NULL,
  village VARCHAR(100) NOT NULL,
  block VARCHAR(100),
  district VARCHAR(100) NOT NULL,
  category VARCHAR(100) DEFAULT 'General Health',
  request_count INTEGER DEFAULT 1,
  lead_reason TEXT,
  status VARCHAR(50) DEFAULT 'PENDING'
    CHECK (status IN ('PENDING','UNDER_REVIEW','APPROVED','CONVERTED','REJECTED','CLOSED')),
  converted_camp_id INTEGER REFERENCES government_camp_proposals(id),
  first_reported_date DATE DEFAULT CURRENT_DATE,
  urgency_level VARCHAR(20) DEFAULT 'MEDIUM'
    CHECK (urgency_level IN ('LOW','MEDIUM','HIGH','CRITICAL')),
  reviewer_id INTEGER REFERENCES users(id),
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ccr_district ON community_camp_requests(district);
CREATE INDEX IF NOT EXISTS idx_ccr_status ON community_camp_requests(status);

-- Resource Requests (District → State escalations)
CREATE TABLE IF NOT EXISTS government_resource_requests (
  id SERIAL PRIMARY KEY,
  request_id VARCHAR(50) UNIQUE NOT NULL,
  requesting_district VARCHAR(100) NOT NULL,
  requesting_officer_id INTEGER REFERENCES users(id),
  requesting_officer_name VARCHAR(200),
  request_type VARCHAR(50) DEFAULT 'GENERAL'
    CHECK (request_type IN ('STAFF','MEDICINE','DIAGNOSTICS','BLOOD','CAMP_RESOURCES','GENERAL')),
  title TEXT NOT NULL,
  description TEXT,
  quantity_needed INTEGER,
  urgency VARCHAR(20) DEFAULT 'ROUTINE'
    CHECK (urgency IN ('ROUTINE','URGENT','EMERGENCY')),
  status VARCHAR(50) DEFAULT 'SUBMITTED'
    CHECK (status IN ('SUBMITTED','UNDER_REVIEW','APPROVED','REJECTED','FULFILLED','ESCALATED')),
  reviewer_id INTEGER REFERENCES users(id),
  reviewer_name VARCHAR(200),
  review_notes TEXT,
  assigned_to VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_grr_district ON government_resource_requests(requesting_district);
CREATE INDEX IF NOT EXISTS idx_grr_status ON government_resource_requests(status);

-- Medicine / Diagnostic Requisitions
CREATE TABLE IF NOT EXISTS government_medicine_requisitions (
  id SERIAL PRIMARY KEY,
  requisition_id VARCHAR(50) UNIQUE NOT NULL,
  requesting_district VARCHAR(100),
  requesting_officer_id INTEGER REFERENCES users(id),
  requesting_officer_name VARCHAR(200),
  target_facility VARCHAR(200),
  item_name TEXT NOT NULL,
  item_type VARCHAR(50) DEFAULT 'MEDICINE'
    CHECK (item_type IN ('MEDICINE','DIAGNOSTIC','EQUIPMENT','BLOOD','OTHER')),
  quantity INTEGER NOT NULL,
  unit VARCHAR(50) DEFAULT 'Units',
  urgency VARCHAR(20) DEFAULT 'ROUTINE'
    CHECK (urgency IN ('ROUTINE','URGENT','EMERGENCY')),
  justification TEXT,
  status VARCHAR(50) DEFAULT 'SUBMITTED'
    CHECK (status IN ('SUBMITTED','PROCESSING','DISPATCHED','RECEIVED','REJECTED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_gmr_district ON government_medicine_requisitions(requesting_district);

-- Government Audit Events (persistent, server-side)
CREATE TABLE IF NOT EXISTS government_audit_events (
  id SERIAL PRIMARY KEY,
  actor_user_id INTEGER REFERENCES users(id),
  actor_name VARCHAR(200),
  actor_role VARCHAR(50),
  action TEXT NOT NULL,
  module VARCHAR(100),
  resource_id VARCHAR(100),
  resource_type VARCHAR(100),
  district VARCHAR(100),
  state_name VARCHAR(100) DEFAULT 'Tamil Nadu',
  result VARCHAR(50) DEFAULT 'SUCCESS'
    CHECK (result IN ('SUCCESS','FAILURE','PARTIAL','PENDING')),
  details TEXT,
  ip_address VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_gae_actor ON government_audit_events(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_gae_district ON government_audit_events(district);
CREATE INDEX IF NOT EXISTS idx_gae_module ON government_audit_events(module);
CREATE INDEX IF NOT EXISTS idx_gae_created ON government_audit_events(created_at DESC);

-- Government Announcements
CREATE TABLE IF NOT EXISTS government_announcements (
  id SERIAL PRIMARY KEY,
  announcement_id VARCHAR(50) UNIQUE NOT NULL,
  author_id INTEGER REFERENCES users(id),
  author_name VARCHAR(200),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  audience_type VARCHAR(50) DEFAULT 'ALL'
    CHECK (audience_type IN ('ALL','DISTRICT','FACILITY','PATIENTS')),
  target_districts JSONB DEFAULT '[]',
  category VARCHAR(100) DEFAULT 'General',
  status VARCHAR(50) DEFAULT 'Draft'
    CHECK (status IN ('Draft','Pending Approval','Approved','Published','Cancelled','Archived')),
  publish_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  approver_id INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ga_status ON government_announcements(status);

-- Seed initial community requests for Salem district (demo data)
INSERT INTO community_camp_requests (request_id, village, block, district, category, request_count, lead_reason, status, urgency_level)
VALUES
  ('CCR-001', 'Edappadi', 'Edappadi', 'Salem', 'General Health', 47, 'High fever prevalence reported in block', 'PENDING', 'HIGH'),
  ('CCR-002', 'Mettur', 'Mettur', 'Salem', 'Maternal Health', 23, 'ANC services needed for high-risk mothers', 'UNDER_REVIEW', 'HIGH'),
  ('CCR-003', 'Omalur', 'Omalur', 'Salem', 'Immunization', 34, 'Pending childhood vaccination drive', 'PENDING', 'MEDIUM'),
  ('CCR-004', 'Attur', 'Attur', 'Salem', 'Dental Health', 18, 'No dental facility within 30 km', 'PENDING', 'LOW'),
  ('CCR-005', 'Yercaud', 'Yercaud', 'Salem', 'Eye Care', 29, 'Tribal population with high cataract incidence', 'APPROVED', 'HIGH')
ON CONFLICT (request_id) DO NOTHING;

-- Seed initial resource requests for districts
INSERT INTO government_resource_requests (request_id, requesting_district, requesting_officer_name, request_type, title, description, quantity_needed, urgency, status)
VALUES
  ('RR-2026-001', 'Salem', 'Dr. S. Ramachandran', 'MEDICINE', 'Antihypertensive Drug Shortage', 'Amlodipine 5mg critically low at 3 PHCs', 5000, 'URGENT', 'UNDER_REVIEW'),
  ('RR-2026-002', 'Coimbatore', 'Dr. K. Muthukumar', 'DIAGNOSTICS', 'ECG Machine Required', 'PHC Karamadai requires portable ECG unit', 2, 'ROUTINE', 'SUBMITTED'),
  ('RR-2026-003', 'Madurai', 'Dr. P. Selvakumar', 'STAFF', 'Specialist Surgeon Required', 'Orthopaedic surgeon vacancy for 3 months', 1, 'URGENT', 'APPROVED'),
  ('RR-2026-004', 'Chennai', 'Dr. R. Krishnamurthy', 'BLOOD', 'B+ Blood Group Shortage', 'Emergency supply needed for district hospital', 20, 'EMERGENCY', 'FULFILLED'),
  ('RR-2026-005', 'Salem', 'Dr. S. Ramachandran', 'CAMP_RESOURCES', 'Health Camp Equipment', 'Portable lab units for upcoming camp series', 5, 'ROUTINE', 'SUBMITTED')
ON CONFLICT (request_id) DO NOTHING;

-- Seed initial government camp proposals
INSERT INTO government_camp_proposals (camp_id, proposer_name, district, block, village, venue, camp_date, camp_type, doctors_count, nurses_count, expected_patients, status)
VALUES
  ('GCP-2026-001', 'Dr. S. Ramachandran', 'Salem', 'Edappadi', 'Edappadi Town', 'Government Primary School Ground', '2026-11-10', 'General Health Camp', 4, 8, 250, 'Approved'),
  ('GCP-2026-002', 'Dr. S. Ramachandran', 'Salem', 'Mettur', 'Mettur Dam Colony', 'PHC Mettur Courtyard', '2026-11-15', 'Maternal and Child Health', 3, 6, 180, 'Scheduled'),
  ('GCP-2026-003', 'Dr. S. Ramachandran', 'Salem', 'Yercaud', 'Yercaud Hill Colony', 'Tribal Welfare Centre', '2026-11-22', 'Eye and ENT Camp', 2, 4, 120, 'Published'),
  ('GCP-2026-004', 'Dr. S. Ramachandran', 'Salem', 'Omalur', 'Omalur Panchayat', 'Block Development Office', '2026-12-05', 'Dental Health Camp', 2, 3, 150, 'Submitted'),
  ('GCP-2026-005', 'Dr. S. Ramachandran', 'Salem', 'Attur', 'Attur Town', 'Municipal Ground', '2026-12-12', 'General Health Camp', 5, 10, 300, 'Draft')
ON CONFLICT (camp_id) DO NOTHING;

-- Seed initial government audit events
INSERT INTO government_audit_events (actor_name, actor_role, action, module, resource_id, resource_type, district, result, details)
VALUES
  ('Dr. S. Ramachandran', 'DISTRICT_ADMIN', 'CREATE_CAMP_PROPOSAL', 'Health Camps', 'GCP-2026-001', 'CampProposal', 'Salem', 'SUCCESS', 'Created camp proposal for Edappadi General Health Camp'),
  ('Dr. S. Sundararajan', 'STATE_ADMIN', 'APPROVE_CAMP', 'Health Camps', 'GCP-2026-001', 'CampProposal', 'Salem', 'SUCCESS', 'State-level approval granted for General Health Camp'),
  ('Dr. S. Ramachandran', 'DISTRICT_ADMIN', 'PUBLISH_NOTIFICATION', 'Notifications', 'NOT-001', 'Notification', 'Salem', 'SUCCESS', 'Published health camp announcement to Salem district'),
  ('Dr. S. Ramachandran', 'DISTRICT_ADMIN', 'SUBMIT_RESOURCE_REQUEST', 'Resource Requests', 'RR-2026-001', 'ResourceRequest', 'Salem', 'SUCCESS', 'Submitted antihypertensive shortage request'),
  ('Dr. K. Muthukumar', 'DISTRICT_ADMIN', 'CONVERT_COMMUNITY_REQUEST', 'Community Requests', 'CCR-002', 'CommunityRequest', 'Coimbatore', 'SUCCESS', 'Converted maternal health request to camp proposal')
ON CONFLICT DO NOTHING;

