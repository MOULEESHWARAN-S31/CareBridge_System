-- ============================================================================
-- CareBridge Healthcare Platform — Database Schema
-- Master Administration & Healthcare Management Architecture
-- Target: PostgreSQL 14+
-- ============================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. Districts & Taluks (Geographical Master Data)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS districts (
    id SERIAL PRIMARY KEY,
    district_code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Tamil Nadu',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS taluks (
    id SERIAL PRIMARY KEY,
    district_id INTEGER NOT NULL REFERENCES districts(id) ON DELETE RESTRICT,
    taluk_code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_taluks_district_id ON taluks(district_id);

-- ----------------------------------------------------------------------------
-- 2. Roles & Permissions (RBAC Master Tables)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    role_code VARCHAR(50) UNIQUE NOT NULL,
    role_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    permission_code VARCHAR(100) UNIQUE NOT NULL,
    module VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id)
);

-- ----------------------------------------------------------------------------
-- 3. Users Master Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) UNIQUE NOT NULL,       -- e.g. CB-HOS-000245 or custom HOS-SLM-001
    employee_id VARCHAR(50),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,       -- Stored as bcrypt / argon2 hash (never plaintext)
    district_id INTEGER REFERENCES districts(id),
    organization_type VARCHAR(50) NOT NULL,    -- 'Government Office', 'Hospital', 'PHC', 'Diagnostic Centre', 'Medical Store'
    status VARCHAR(20) NOT NULL DEFAULT 'Active' 
        CHECK (status IN ('Active', 'Inactive', 'Suspended', 'Pending')),
    force_password_change BOOLEAN DEFAULT FALSE,
    failed_login_attempts INTEGER DEFAULT 0,
    password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

-- ----------------------------------------------------------------------------
-- 4. Hospitals Master Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id VARCHAR(50) UNIQUE NOT NULL,   -- e.g. HOSP-SLM-001
    name VARCHAR(200) NOT NULL,
    hospital_type VARCHAR(50) NOT NULL         -- 'District Hospital', 'Government Hospital', 'Taluk Hospital', 'Community Health Centre', 'Primary Health Centre', 'Specialty Hospital'
        CHECK (hospital_type IN (
            'District Hospital', 
            'Government Hospital', 
            'Taluk Hospital', 
            'Community Health Centre', 
            'Primary Health Centre', 
            'Specialty Hospital'
        )),
    ownership_type VARCHAR(20) NOT NULL DEFAULT 'Government' CHECK (ownership_type IN ('Government', 'Private')),
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    
    -- Location
    state VARCHAR(100) NOT NULL DEFAULT 'Tamil Nadu',
    district_id INTEGER NOT NULL REFERENCES districts(id),
    taluk_id INTEGER REFERENCES taluks(id),
    city_village VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    
    -- Contact
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL,
    emergency_contact VARCHAR(30),
    
    -- Capacity
    total_beds INTEGER NOT NULL DEFAULT 0,
    occupied_beds INTEGER NOT NULL DEFAULT 0,
    icu_beds INTEGER NOT NULL DEFAULT 0,
    emergency_beds INTEGER NOT NULL DEFAULT 0,
    general_beds INTEGER NOT NULL DEFAULT 0,
    
    -- Services (Boolean flags / capabilities)
    service_opd BOOLEAN DEFAULT TRUE,
    service_emergency BOOLEAN DEFAULT TRUE,
    service_pharmacy BOOLEAN DEFAULT TRUE,
    service_laboratory BOOLEAN DEFAULT TRUE,
    service_xray BOOLEAN DEFAULT FALSE,
    service_ct BOOLEAN DEFAULT FALSE,
    service_mri BOOLEAN DEFAULT FALSE,
    service_ultrasound BOOLEAN DEFAULT FALSE,
    service_blood_bank BOOLEAN DEFAULT FALSE,
    service_ambulance BOOLEAN DEFAULT TRUE,
    service_telemedicine BOOLEAN DEFAULT FALSE,
    
    -- Governance & Verification
    status VARCHAR(25) NOT NULL DEFAULT 'Active' 
        CHECK (status IN ('Active', 'Inactive', 'Pending Verification', 'Under Maintenance')),
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hospitals_hospital_id ON hospitals(hospital_id);
CREATE INDEX IF NOT EXISTS idx_hospitals_district_id ON hospitals(district_id);
CREATE INDEX IF NOT EXISTS idx_hospitals_status ON hospitals(status);

-- Junction Table: Users assigned to Hospitals
CREATE TABLE IF NOT EXISTS hospital_users (
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_administrator BOOLEAN DEFAULT FALSE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (hospital_id, user_id)
);

-- ----------------------------------------------------------------------------
-- 5. Medical Stores Master Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS medical_stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id VARCHAR(50) UNIQUE NOT NULL,      -- e.g. MS-SLM-001
    name VARCHAR(200) NOT NULL,
    store_type VARCHAR(50) NOT NULL            -- 'Government Medical Store', 'Hospital Pharmacy', 'Primary Health Centre Pharmacy', 'Public Pharmacy', 'Partner Pharmacy'
        CHECK (store_type IN (
            'Government Medical Store', 
            'Hospital Pharmacy', 
            'Primary Health Centre Pharmacy', 
            'Public Pharmacy', 
            'Partner Pharmacy'
        )),
    registration_license_number VARCHAR(100) UNIQUE NOT NULL,
    
    -- Location
    state VARCHAR(100) NOT NULL DEFAULT 'Tamil Nadu',
    district_id INTEGER NOT NULL REFERENCES districts(id),
    taluk_id INTEGER REFERENCES taluks(id),
    city_village VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    
    -- Contact
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contact_person VARCHAR(150),
    
    -- Services
    service_prescription_medicines BOOLEAN DEFAULT TRUE,
    service_generic_medicines BOOLEAN DEFAULT TRUE,
    service_emergency_medicines BOOLEAN DEFAULT TRUE,
    service_stock_updates BOOLEAN DEFAULT TRUE,
    service_online_requests BOOLEAN DEFAULT FALSE,
    
    -- Inventory Summary Totals
    total_medicines INTEGER DEFAULT 0,
    available_medicines INTEGER DEFAULT 0,
    low_stock_medicines INTEGER DEFAULT 0,
    out_of_stock_medicines INTEGER DEFAULT 0,
    
    -- Status & Verification
    status VARCHAR(25) NOT NULL DEFAULT 'Active' 
        CHECK (status IN ('Active', 'Inactive', 'Pending Verification')),
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_medical_stores_store_id ON medical_stores(store_id);
CREATE INDEX IF NOT EXISTS idx_medical_stores_district_id ON medical_stores(district_id);
CREATE INDEX IF NOT EXISTS idx_medical_stores_status ON medical_stores(status);

-- Junction Table: Users assigned to Medical Stores
CREATE TABLE IF NOT EXISTS medical_store_users (
    store_id UUID NOT NULL REFERENCES medical_stores(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_store_manager BOOLEAN DEFAULT FALSE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (store_id, user_id)
);

-- ----------------------------------------------------------------------------
-- 6. Audit Logs Table (Master Event Logging)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    admin_id VARCHAR(50) NOT NULL,             -- e.g. 'ADMIN-001'
    admin_name VARCHAR(150),
    action VARCHAR(100) NOT NULL,              -- e.g. 'CREATE_USER', 'RESET_PASSWORD', 'DEACTIVATE_STORE'
    module VARCHAR(50) NOT NULL,              -- e.g. 'User Management', 'Hospital Management', 'Medical Store Management'
    record_id VARCHAR(50) NOT NULL,            -- e.g. 'CB-HOS-000245', 'HOSP-SLM-001'
    details TEXT,
    ip_address VARCHAR(45),
    result VARCHAR(20) NOT NULL DEFAULT 'SUCCESS' CHECK (result IN ('SUCCESS', 'FAILED', 'WARNING')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_module ON audit_logs(module);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ----------------------------------------------------------------------------
-- 7. Password Reset Tokens (Secure Reset Workflow)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    is_temporary_password BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pwd_reset_user_id ON password_reset_tokens(user_id);

-- ============================================================================
-- INITIAL SEED DATA
-- ============================================================================

INSERT INTO districts (district_code, name, state) VALUES
('SLM', 'Salem', 'Tamil Nadu'),
('CHN', 'Chennai', 'Tamil Nadu'),
('CBE', 'Coimbatore', 'Tamil Nadu'),
('MDU', 'Madurai', 'Tamil Nadu'),
('TRY', 'Tiruchirappalli', 'Tamil Nadu')
ON CONFLICT (district_code) DO NOTHING;

INSERT INTO roles (role_code, role_name, description, is_system_role) VALUES
('GOV_ADMIN', 'Government Administrator', 'Master oversight of statewide health infrastructure, analytics and users', TRUE),
('DIST_ADMIN', 'District Administrator', 'District-level healthcare management and operational monitoring', TRUE),
('HOSP_ADMIN', 'Hospital Administrator', 'Administrative control of hospital facility, wards, staff and operations', TRUE),
('DOCTOR', 'Doctor', 'Clinical patient diagnostics, consultation, prescriptions, and referral workflows', FALSE),
('NURSE', 'Nurse', 'Patient vital monitoring, bed care, shift logs, and medicine administration', FALSE),
('PHARMACIST', 'Pharmacist', 'Prescription dispensation, pharmacy stock maintenance, and inventory auditing', FALSE),
('STORE_STAFF', 'Medical Store Staff', 'Commercial and institutional inventory management, stock orders, and availability', FALSE),
('LAB_TECH', 'Lab Technician', 'Diagnostic sample analysis, laboratory testing, and pathology report publishing', FALSE),
('RECEPTION', 'Reception Staff', 'Outpatient registration, patient desk token generation, and appointment triage', FALSE),
('HEALTH_WORKER', 'Health Worker', 'Field outreach, immunization camps, village maternal care, and PHC surveys', FALSE)
ON CONFLICT (role_code) DO NOTHING;
