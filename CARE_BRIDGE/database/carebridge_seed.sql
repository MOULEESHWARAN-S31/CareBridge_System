-- ============================================================================
-- CareBridge Healthcare Prototype - PostgreSQL Synthetic Seed Dataset
-- Database: carebridge
-- File: carebridge_seed.sql
-- Description: Authoritative 36-profile synthetic ABHA dataset for testing
--              single and multi-profile mobile lookup flows.
-- Disclaimer: 100% synthetic mock data for research and prototype testing.
--             No real Aadhaar, ABHA, or patient health information is included.
-- ============================================================================

INSERT INTO abha_profiles (
    abha_id, abha_address, name, gender, date_of_birth,
    relationship, mobile_number, district, state, pincode
) VALUES
-- ----------------------------------------------------------------------------
-- Scenario 1: Mobile 9876500001 -> Exactly 1 Profile (Self)
-- ----------------------------------------------------------------------------
(
    '12-3456-7890-1001', 'ramesh.kumar@abdm', 'Ramesh Kumar', 'Male', '1979-05-15',
    'Self', '9876500001', 'Salem', 'Tamil Nadu', '636001'
),

-- ----------------------------------------------------------------------------
-- Scenario 2: Mobile 9876500002 -> Exactly 2 Profiles (Self + Spouse)
-- ----------------------------------------------------------------------------
(
    '23-4567-8901-2001', 'priya.sundaram@abdm', 'Priya Sundaram', 'Female', '1988-03-12',
    'Self', '9876500002', 'Coimbatore', 'Tamil Nadu', '641001'
),
(
    '34-5678-9012-2002', 'karthik.sundaram@abdm', 'Karthik Sundaram', 'Male', '1985-11-20',
    'Spouse', '9876500002', 'Coimbatore', 'Tamil Nadu', '641001'
),

-- ----------------------------------------------------------------------------
-- Scenario 3: Mobile 9876500003 -> Exactly 3 Profiles (Self + Spouse + Child)
-- ----------------------------------------------------------------------------
(
    '45-6789-0123-3001', 'murugan.palani@abdm', 'Murugan Palani', 'Male', '1975-07-10',
    'Self', '9876500003', 'Madurai', 'Tamil Nadu', '625001'
),
(
    '56-7890-1234-3002', 'lakshmi.murugan@abdm', 'Lakshmi Murugan', 'Female', '1980-04-18',
    'Spouse', '9876500003', 'Madurai', 'Tamil Nadu', '625001'
),
(
    '67-8901-2345-3003', 'kavin.murugan@abdm', 'Kavin Murugan', 'Male', '2010-09-25',
    'Child', '9876500003', 'Madurai', 'Tamil Nadu', '625001'
),

-- ----------------------------------------------------------------------------
-- Scenario 4: Mobile 9876500004 -> Exactly 4 Profiles (Self + Spouse + Child + Parent)
-- ----------------------------------------------------------------------------
(
    '78-9012-3456-4001', 'selvi.anbarasan@abdm', 'Selvi Anbarasan', 'Female', '1982-12-05',
    'Self', '9876500004', 'Trichy', 'Tamil Nadu', '620001'
),
(
    '89-0123-4567-4002', 'anbarasan.natarajan@abdm', 'Anbarasan Natarajan', 'Male', '1978-06-14',
    'Spouse', '9876500004', 'Trichy', 'Tamil Nadu', '620001'
),
(
    '90-1234-5678-4003', 'diya.anbarasan@abdm', 'Diya Anbarasan', 'Female', '2012-08-30',
    'Child', '9876500004', 'Trichy', 'Tamil Nadu', '620001'
),
(
    '11-2233-4455-4004', 'natarajan.chettiar@abdm', 'Natarajan Chettiar', 'Male', '1952-02-18',
    'Parent', '9876500004', 'Trichy', 'Tamil Nadu', '620001'
),

-- ----------------------------------------------------------------------------
-- Scenario 5: Mobile 9876543210 -> Exactly 2 Profiles (Default CareBridge Prototype Demo)
-- ----------------------------------------------------------------------------
(
    '12-3456-7890-1234', 'ramesh.k@abdm', 'Ramesh Kumar', 'Male', '1979-05-15',
    'Self', '9876543210', 'Salem', 'Tamil Nadu', '636001'
),
(
    '98-7654-3210-4321', 'sunita.k@abdm', 'Sunita Kumar', 'Female', '1982-08-22',
    'Spouse', '9876543210', 'Salem', 'Tamil Nadu', '636001'
),

-- ----------------------------------------------------------------------------
-- Cluster 6: Mobile 9876500011 -> 3 Profiles (Self + Spouse + Parent, Chennai)
-- ----------------------------------------------------------------------------
(
    '14-2536-4758-1101', 'vijay.raghavan@abdm', 'Vijay Raghavan', 'Male', '1984-01-19',
    'Self', '9876500011', 'Chennai', 'Tamil Nadu', '600001'
),
(
    '25-3647-5869-1102', 'anitha.vijay@abdm', 'Anitha Vijay', 'Female', '1987-10-08',
    'Spouse', '9876500011', 'Chennai', 'Tamil Nadu', '600001'
),
(
    '36-4758-6970-1103', 'raghavan.swamy@abdm', 'Raghavan Swamy', 'Male', '1955-04-12',
    'Parent', '9876500011', 'Chennai', 'Tamil Nadu', '600001'
),

-- ----------------------------------------------------------------------------
-- Cluster 7: Mobile 9876500012 -> 3 Profiles (Self + Spouse + Child, Erode)
-- ----------------------------------------------------------------------------
(
    '47-5869-7081-1201', 'senthil.kumar@abdm', 'Senthil Kumar', 'Male', '1981-09-03',
    'Self', '9876500012', 'Erode', 'Tamil Nadu', '638001'
),
(
    '58-6970-8192-1202', 'poongodi.senthil@abdm', 'Poongodi Senthil', 'Female', '1986-07-21',
    'Spouse', '9876500012', 'Erode', 'Tamil Nadu', '638001'
),
(
    '69-7081-9203-1203', 'tharun.senthil@abdm', 'Tharun Senthil', 'Male', '2014-03-17',
    'Child', '9876500012', 'Erode', 'Tamil Nadu', '638001'
),

-- ----------------------------------------------------------------------------
-- Cluster 8: Mobile 9876500013 -> 4 Profiles (Self + Spouse + Child + Parent, Salem)
-- ----------------------------------------------------------------------------
(
    '70-8192-0314-1301', 'saravanan.subramani@abdm', 'Saravanan Subramani', 'Male', '1977-11-14',
    'Self', '9876500013', 'Salem', 'Tamil Nadu', '636007'
),
(
    '81-9203-1425-1302', 'malarvizhi.saravanan@abdm', 'Malarvizhi Saravanan', 'Female', '1983-05-29',
    'Spouse', '9876500013', 'Salem', 'Tamil Nadu', '636007'
),
(
    '92-0314-2536-1303', 'nithya.saravanan@abdm', 'Nithya Saravanan', 'Female', '2011-12-08',
    'Child', '9876500013', 'Salem', 'Tamil Nadu', '636007'
),
(
    '13-2435-4657-1304', 'subramani.kounder@abdm', 'Subramani Kounder', 'Male', '1950-08-15',
    'Parent', '9876500013', 'Salem', 'Tamil Nadu', '636007'
),

-- ----------------------------------------------------------------------------
-- Cluster 9: Mobile 9876500014 -> 2 Profiles (Self + Child, Namakkal)
-- ----------------------------------------------------------------------------
(
    '24-3546-5768-1401', 'deepa.ganesan@abdm', 'Deepa Ganesan', 'Female', '1990-02-14',
    'Self', '9876500014', 'Namakkal', 'Tamil Nadu', '637001'
),
(
    '35-4657-6879-1402', 'pranav.ganesan@abdm', 'Pranav Ganesan', 'Male', '2016-06-23',
    'Child', '9876500014', 'Namakkal', 'Tamil Nadu', '637001'
),

-- ----------------------------------------------------------------------------
-- Cluster 10: Mobile 9876500015 -> 3 Profiles (Self + Spouse + Child, Dharmapuri)
-- ----------------------------------------------------------------------------
(
    '46-5768-7980-1501', 'madhan.raj@abdm', 'Madhan Raj', 'Male', '1986-12-19',
    'Self', '9876500015', 'Dharmapuri', 'Tamil Nadu', '636701'
),
(
    '57-6879-8091-1502', 'bhuvaneswari.madhan@abdm', 'Bhuvaneswari Madhan', 'Female', '1989-08-04',
    'Spouse', '9876500015', 'Dharmapuri', 'Tamil Nadu', '636701'
),
(
    '68-7980-9102-1503', 'yazhini.madhan@abdm', 'Yazhini Madhan', 'Female', '2017-01-11',
    'Child', '9876500015', 'Dharmapuri', 'Tamil Nadu', '636701'
),

-- ----------------------------------------------------------------------------
-- Cluster 11: Mobile 9876500016 -> 2 Profiles (Self + Parent, Coimbatore)
-- ----------------------------------------------------------------------------
(
    '79-8091-0213-1601', 'arun.venkatesh@abdm', 'Arun Venkatesh', 'Male', '1992-06-27',
    'Self', '9876500016', 'Coimbatore', 'Tamil Nadu', '641018'
),
(
    '80-9102-1324-1602', 'kamalam.venkatesh@abdm', 'Kamalam Venkatesh', 'Female', '1962-03-30',
    'Parent', '9876500016', 'Coimbatore', 'Tamil Nadu', '641018'
),

-- ----------------------------------------------------------------------------
-- Cluster 12: Mobile 9876500017 -> 2 Profiles (Self + Spouse, Madurai)
-- ----------------------------------------------------------------------------
(
    '91-0213-2435-1701', 'gopal.krishnan@abdm', 'Gopal Krishnan', 'Male', '1983-04-16',
    'Self', '9876500017', 'Madurai', 'Tamil Nadu', '625020'
),
(
    '15-2637-4859-1702', 'vasuki.gopal@abdm', 'Vasuki Gopal', 'Female', '1987-09-09',
    'Spouse', '9876500017', 'Madurai', 'Tamil Nadu', '625020'
),

-- ----------------------------------------------------------------------------
-- Individual Profiles: 9876500018 through 9876500022 -> Exactly 1 Profile Each (Self)
-- ----------------------------------------------------------------------------
(
    '26-3748-5960-1801', 'revathi.shankar@abdm', 'Revathi Shankar', 'Female', '1995-10-12',
    'Self', '9876500018', 'Trichy', 'Tamil Nadu', '620015'
),
(
    '37-4859-6071-1901', 'manikandan.velu@abdm', 'Manikandan Velu', 'Male', '1991-01-28',
    'Self', '9876500019', 'Chennai', 'Tamil Nadu', '600028'
),
(
    '48-5960-7182-2001', 'kavitha.dharmalingam@abdm', 'Kavitha Dharmalingam', 'Female', '1989-11-03',
    'Self', '9876500020', 'Salem', 'Tamil Nadu', '636004'
),
(
    '59-6071-8293-2101', 'balaji.srinivasan@abdm', 'Balaji Srinivasan', 'Male', '1993-07-22',
    'Self', '9876500021', 'Erode', 'Tamil Nadu', '638009'
),
(
    '60-7182-9304-2201', 'sandhya.nandakumar@abdm', 'Sandhya Nandakumar', 'Female', '1996-05-18',
    'Self', '9876500022', 'Namakkal', 'Tamil Nadu', '637002'
)
ON CONFLICT (abha_id) DO NOTHING;
