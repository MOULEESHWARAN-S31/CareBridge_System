-- ============================================================================
-- CareBridge Healthcare Prototype - All-in-One Setup Script
-- Database: carebridge
-- File: carebridge_setup.sql
-- Description: Executes schema creation and authoritative 36-profile seed
--              idempotently in a single script.
-- Usage:
--   psql -U postgres -d carebridge -f database/carebridge_setup.sql
-- ============================================================================

\echo '>>> Starting CareBridge PostgreSQL Setup...'

-- 1. SCHEMA DEFINITION
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS abha_profiles (
    id SERIAL PRIMARY KEY,
    abha_id VARCHAR(32) NOT NULL UNIQUE,
    abha_address VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    date_of_birth DATE NOT NULL,
    relationship VARCHAR(50) NOT NULL CHECK (relationship IN ('Self', 'Spouse', 'Child', 'Parent')),
    mobile_number VARCHAR(15) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Tamil Nadu',
    pincode VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_abha_profiles_mobile 
    ON abha_profiles (mobile_number);

CREATE INDEX IF NOT EXISTS idx_abha_profiles_district 
    ON abha_profiles (district);

CREATE OR REPLACE FUNCTION update_abha_profiles_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_abha_profiles_timestamp ON abha_profiles;
CREATE TRIGGER trg_abha_profiles_timestamp
    BEFORE UPDATE ON abha_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_abha_profiles_timestamp();

\echo '>>> Schema and indexes created/verified successfully.'

-- 2. SEED DATA (AUTHORITATIVE 36 SYNTHETIC PROFILES)
-- ----------------------------------------------------------------------------
INSERT INTO abha_profiles (
    abha_id, abha_address, name,gender, date_of_birth,
    relationship, mobile_number, district, state, pincode
) VALUES
-- Scenario 1: 9876500001 -> 1 Profile
('12-3456-7890-1001', 'ramesh.kumar@abdm', 'Ramesh Kumar', 'Male', '1979-05-15', 'Self', '9876500001', 'Salem', 'Tamil Nadu', '636001'),

-- Scenario 2: 9876500002 -> 2 Profiles
('23-4567-8901-2001', 'priya.sundaram@abdm', 'Priya Sundaram', 'Female', '1988-03-12', 'Self', '9876500002', 'Coimbatore', 'Tamil Nadu', '641001'),
('34-5678-9012-2002', 'karthik.sundaram@abdm', 'Karthik Sundaram', 'Male', '1985-11-20', 'Spouse', '9876500002', 'Coimbatore', 'Tamil Nadu', '641001'),

-- Scenario 3: 9876500003 -> 3 Profiles
('45-6789-0123-3001', 'murugan.palani@abdm', 'Murugan Palani', 'Male', '1975-07-10', 'Self', '9876500003', 'Madurai', 'Tamil Nadu', '625001'),
('56-7890-1234-3002', 'lakshmi.murugan@abdm', 'Lakshmi Murugan', 'Female', '1980-04-18', 'Spouse', '9876500003', 'Madurai', 'Tamil Nadu', '625001'),
('67-8901-2345-3003', 'kavin.murugan@abdm', 'Kavin Murugan', 'Male', '2010-09-25', 'Child', '9876500003', 'Madurai', 'Tamil Nadu', '625001'),

-- Scenario 4: 9876500004 -> 4 Profiles
('78-9012-3456-4001', 'selvi.anbarasan@abdm', 'Selvi Anbarasan', 'Female', '1982-12-05', 'Self', '9876500004', 'Trichy', 'Tamil Nadu', '620001'),
('89-0123-4567-4002', 'anbarasan.natarajan@abdm', 'Anbarasan Natarajan', 'Male', '1978-06-14', 'Spouse', '9876500004', 'Trichy', 'Tamil Nadu', '620001'),
('90-1234-5678-4003', 'diya.anbarasan@abdm', 'Diya Anbarasan', 'Female', '2012-08-30', 'Child', '9876500004', 'Trichy', 'Tamil Nadu', '620001'),
('11-2233-4455-4004', 'natarajan.chettiar@abdm', 'Natarajan Chettiar', 'Male', '1952-02-18', 'Parent', '9876500004', 'Trichy', 'Tamil Nadu', '620001'),

-- Scenario 5: 9876543210 -> 2 Profiles (Default CareBridge Demo)
('12-3456-7890-1234', 'ramesh.k@abdm', 'Ramesh Kumar', 'Male', '1979-05-15', 'Self', '9876543210', 'Salem', 'Tamil Nadu', '636001'),
('98-7654-3210-4321', 'sunita.k@abdm', 'Sunita Kumar', 'Female', '1982-08-22', 'Spouse', '9876543210', 'Salem', 'Tamil Nadu', '636001'),

-- Additional synthetic family & individual clusters
('14-2536-4758-1101', 'vijay.raghavan@abdm', 'Vijay Raghavan', 'Male', '1984-01-19', 'Self', '9876500011', 'Chennai', 'Tamil Nadu', '600001'),
('25-3647-5869-1102', 'anitha.vijay@abdm', 'Anitha Vijay', 'Female', '1987-10-08', 'Spouse', '9876500011', 'Chennai', 'Tamil Nadu', '600001'),
('36-4758-6970-1103', 'raghavan.swamy@abdm', 'Raghavan Swamy', 'Male', '1955-04-12', 'Parent', '9876500011', 'Chennai', 'Tamil Nadu', '600001'),

('47-5869-7081-1201', 'senthil.kumar@abdm', 'Senthil Kumar', 'Male', '1981-09-03', 'Self', '9876500012', 'Erode', 'Tamil Nadu', '638001'),
('58-6970-8192-1202', 'poongodi.senthil@abdm', 'Poongodi Senthil', 'Female', '1986-07-21', 'Spouse', '9876500012', 'Erode', 'Tamil Nadu', '638001'),
('69-7081-9203-1203', 'tharun.senthil@abdm', 'Tharun Senthil', 'Male', '2014-03-17', 'Child', '9876500012', 'Erode', 'Tamil Nadu', '638001'),

('70-8192-0314-1301', 'saravanan.subramani@abdm', 'Saravanan Subramani', 'Male', '1977-11-14', 'Self', '9876500013', 'Salem', 'Tamil Nadu', '636007'),
('81-9203-1425-1302', 'malarvizhi.saravanan@abdm', 'Malarvizhi Saravanan', 'Female', '1983-05-29', 'Spouse', '9876500013', 'Salem', 'Tamil Nadu', '636007'),
('92-0314-2536-1303', 'nithya.saravanan@abdm', 'Nithya Saravanan', 'Female', '2011-12-08', 'Child', '9876500013', 'Salem', 'Tamil Nadu', '636007'),
('13-2435-4657-1304', 'subramani.kounder@abdm', 'Subramani Kounder', 'Male', '1950-08-15', 'Parent', '9876500013', 'Salem', 'Tamil Nadu', '636007'),

('24-3546-5768-1401', 'deepa.ganesan@abdm', 'Deepa Ganesan', 'Female', '1990-02-14', 'Self', '9876500014', 'Namakkal', 'Tamil Nadu', '637001'),
('35-4657-6879-1402', 'pranav.ganesan@abdm', 'Pranav Ganesan', 'Male', '2016-06-23', 'Child', '9876500014', 'Namakkal', 'Tamil Nadu', '637001'),

('46-5768-7980-1501', 'madhan.raj@abdm', 'Madhan Raj', 'Male', '1986-12-19', 'Self', '9876500015', 'Dharmapuri', 'Tamil Nadu', '636701'),
('57-6879-8091-1502', 'bhuvaneswari.madhan@abdm', 'Bhuvaneswari Madhan', 'Female', '1989-08-04', 'Spouse', '9876500015', 'Dharmapuri', 'Tamil Nadu', '636701'),
('68-7980-9102-1503', 'yazhini.madhan@abdm', 'Yazhini Madhan', 'Female', '2017-01-11', 'Child', '9876500015', 'Dharmapuri', 'Tamil Nadu', '636701'),

('79-8091-0213-1601', 'arun.venkatesh@abdm', 'Arun Venkatesh', 'Male', '1992-06-27', 'Self', '9876500016', 'Coimbatore', 'Tamil Nadu', '641018'),
('80-9102-1324-1602', 'kamalam.venkatesh@abdm', 'Kamalam Venkatesh', 'Female', '1962-03-30', 'Parent', '9876500016', 'Coimbatore', 'Tamil Nadu', '641018'),

('91-0213-2435-1701', 'gopal.krishnan@abdm', 'Gopal Krishnan', 'Male', '1983-04-16', 'Self', '9876500017', 'Madurai', 'Tamil Nadu', '625020'),
('15-2637-4859-1702', 'vasuki.gopal@abdm', 'Vasuki Gopal', 'Female', '1987-09-09', 'Spouse', '9876500017', 'Madurai', 'Tamil Nadu', '625020'),

('26-3748-5960-1801', 'revathi.shankar@abdm', 'Revathi Shankar', 'Female', '1995-10-12', 'Self', '9876500018', 'Trichy', 'Tamil Nadu', '620015'),
('37-4859-6071-1901', 'manikandan.velu@abdm', 'Manikandan Velu', 'Male', '1991-01-28', 'Self', '9876500019', 'Chennai', 'Tamil Nadu', '600028'),
('48-5960-7182-2001', 'kavitha.dharmalingam@abdm', 'Kavitha Dharmalingam', 'Female', '1989-11-03', 'Self', '9876500020', 'Salem', 'Tamil Nadu', '636004'),
('59-6071-8293-2101', 'balaji.srinivasan@abdm', 'Balaji Srinivasan', 'Male', '1993-07-22', 'Self', '9876500021', 'Erode', 'Tamil Nadu', '638009'),
('60-7182-9304-2201', 'sandhya.nandakumar@abdm', 'Sandhya Nandakumar', 'Female', '1996-05-18', 'Self', '9876500022', 'Namakkal', 'Tamil Nadu', '637002')
ON CONFLICT (abha_id) DO NOTHING;

\echo '>>> Synthetic seed records inserted successfully.'

-- 3. VALIDATION SUMMARY
-- ----------------------------------------------------------------------------
\echo '>>> Database Verification Summary:'
SELECT 'Total ABHA Profiles' AS metric, COUNT(*)::text AS value FROM abha_profiles
UNION ALL
SELECT 'Distinct Mobile Numbers', COUNT(DISTINCT mobile_number)::text FROM abha_profiles
UNION ALL
SELECT 'Multi-Profile Mobile Numbers', COUNT(*)::text FROM (
    SELECT mobile_number FROM abha_profiles GROUP BY mobile_number HAVING COUNT(*) > 1
) sub;
