-- ============================================================
-- CareBridge Platform: Cross-Dashboard Shared Synchronization
-- Unifies Hospital Clinical Operations with Government & Admin
-- ============================================================

-- 1. Facility Medicines / Inventory Table
CREATE TABLE IF NOT EXISTS facility_medicines (
  id SERIAL PRIMARY KEY,
  hospital_id VARCHAR(50) NOT NULL,
  medicine_name VARCHAR(200) NOT NULL,
  category VARCHAR(100) DEFAULT 'General',
  batch_number VARCHAR(100),
  expiry_date DATE,
  available_quantity INTEGER DEFAULT 0,
  minimum_stock_threshold INTEGER DEFAULT 50,
  unit VARCHAR(50) DEFAULT 'Tablets',
  status VARCHAR(50) DEFAULT 'Adequate' CHECK (status IN ('Adequate', 'Low', 'Critical')),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  updated_by INTEGER REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_fac_med_hosp ON facility_medicines(hospital_id);

-- 2. Facility Diagnostic Equipment & Laboratory Services
CREATE TABLE IF NOT EXISTS facility_diagnostics (
  id SERIAL PRIMARY KEY,
  hospital_id VARCHAR(50) NOT NULL,
  test_name VARCHAR(200) NOT NULL,
  test_category VARCHAR(100) DEFAULT 'General Pathology',
  equipment_model VARCHAR(200),
  equipment_status VARCHAR(50) DEFAULT 'Operational' CHECK (equipment_status IN ('Operational', 'Degraded', 'Offline')),
  reagent_stock_days INTEGER DEFAULT 30,
  daily_capacity INTEGER DEFAULT 100,
  tests_performed_today INTEGER DEFAULT 0,
  pending_queue INTEGER DEFAULT 0,
  turnaround_time_hours NUMERIC(4,1) DEFAULT 2.0,
  status VARCHAR(50) DEFAULT 'Available' CHECK (status IN ('Available', 'High Queue', 'Critical Delay')),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  updated_by INTEGER REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_fac_diag_hosp ON facility_diagnostics(hospital_id);

-- 3. Health Camp Hospital Personnel & Logistics Assignments
CREATE TABLE IF NOT EXISTS camp_facility_assignments (
  id SERIAL PRIMARY KEY,
  camp_proposal_id INTEGER REFERENCES government_camp_proposals(id) ON DELETE CASCADE,
  hospital_id VARCHAR(50) NOT NULL,
  doctors_assigned INTEGER DEFAULT 0,
  nurses_assigned INTEGER DEFAULT 0,
  medicines_kit_status VARCHAR(50) DEFAULT 'Pending' CHECK (medicines_kit_status IN ('Pending', 'Ready', 'Dispatched', 'Unavailable')),
  diagnostics_kit_status VARCHAR(50) DEFAULT 'Pending' CHECK (diagnostics_kit_status IN ('Pending', 'Ready', 'Dispatched', 'Unavailable')),
  acceptance_status VARCHAR(50) DEFAULT 'Pending' CHECK (acceptance_status IN ('Pending', 'Accepted', 'Declined', 'Confirmed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cfa_camp ON camp_facility_assignments(camp_proposal_id);
CREATE INDEX IF NOT EXISTS idx_cfa_hosp ON camp_facility_assignments(hospital_id);

-- Seed baseline medicines for GDH-SALEM-01
INSERT INTO facility_medicines (hospital_id, medicine_name, category, batch_number, expiry_date, available_quantity, minimum_stock_threshold, unit, status)
VALUES
  ('GDH-SALEM-01', 'Paracetamol 500mg', 'Analgesic', 'BATCH-2026-A1', '2028-06-30', 12500, 2000, 'Tablets', 'Adequate'),
  ('GDH-SALEM-01', 'Amoxicillin 500mg', 'Antibiotic', 'BATCH-2026-B2', '2027-11-15', 3400, 1000, 'Capsules', 'Adequate'),
  ('GDH-SALEM-01', 'Amlodipine 5mg', 'Antihypertensive', 'BATCH-2026-C3', '2027-08-20', 420, 1500, 'Tablets', 'Critical'),
  ('GDH-SALEM-01', 'Metformin 500mg', 'Anti-Diabetic', 'BATCH-2026-D4', '2028-02-28', 850, 1200, 'Tablets', 'Low'),
  ('GDH-SALEM-01', 'ORS Sachets', 'Electrolyte', 'BATCH-2026-E5', '2029-01-10', 4800, 800, 'Sachets', 'Adequate')
ON CONFLICT DO NOTHING;

-- Seed baseline diagnostics for GDH-SALEM-01
INSERT INTO facility_diagnostics (hospital_id, test_name, test_category, equipment_model, equipment_status, reagent_stock_days, daily_capacity, tests_performed_today, pending_queue, turnaround_time_hours, status)
VALUES
  ('GDH-SALEM-01', 'Complete Blood Count (CBC)', 'Hematology', 'Sysmex XN-350', 'Operational', 45, 200, 114, 8, 1.0, 'Available'),
  ('GDH-SALEM-01', '128-Slice CT Scan Brain', 'Radiology', 'Siemens SOMATOM', 'Operational', 60, 40, 22, 4, 2.5, 'Available'),
  ('GDH-SALEM-01', 'Digital Chest X-Ray', 'Radiology', 'GE Definium 646 HD', 'Operational', 90, 150, 88, 12, 1.0, 'Available'),
  ('GDH-SALEM-01', 'Serum Creatinine & Urea', 'Biochemistry', 'Roche Cobas c311', 'Operational', 30, 120, 72, 6, 1.5, 'Available'),
  ('GDH-SALEM-01', 'HbA1c Glycated Hemoglobin', 'POCT', 'Alere Afinion AS100', 'Degraded', 3, 30, 18, 9, 0.5, 'High Queue')
ON CONFLICT DO NOTHING;

