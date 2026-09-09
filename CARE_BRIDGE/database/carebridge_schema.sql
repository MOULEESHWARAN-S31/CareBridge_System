-- ============================================================================
-- CareBridge Healthcare Prototype - PostgreSQL Schema
-- Database: carebridge
-- File: carebridge_schema.sql
-- Description: Defines the synthetic ABHA profiles table and performance indexes
--              for mobile number lookups and family account linking.
-- Security Note: Strictly synthetic prototype data. No real PII/ABHA data stored.
-- Architecture: Flutter -> Backend REST API -> PostgreSQL (Never direct Flutter-to-DB)
-- ============================================================================

-- Create table for synthetic ABHA profiles
CREATE TABLE IF NOT EXISTS abha_profiles (
    id SERIAL PRIMARY KEY,
    abha_id VARCHAR(32) NOT NULL UNIQUE,
    abha_address VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    date_of_birth DATE NOT NULL,
    relationship VARCHAR(50) NOT NULL CHECK (relationship IN ('Self', 'Spouse', 'Child', 'Parent')),
    mobile_number VARCHAR(15) NOT NULL, -- NON-UNIQUE: multiple profiles can link to one mobile
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Tamil Nadu',
    pincode VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for high-frequency mobile number search (Select Profile flow)
CREATE INDEX IF NOT EXISTS idx_abha_profiles_mobile 
    ON abha_profiles (mobile_number);

-- Index for district-level filtering and facility assignment
CREATE INDEX IF NOT EXISTS idx_abha_profiles_district 
    ON abha_profiles (district);

-- Automated updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION update_abha_profiles_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on row modification
DROP TRIGGER IF EXISTS trg_abha_profiles_timestamp ON abha_profiles;
CREATE TRIGGER trg_abha_profiles_timestamp
    BEFORE UPDATE ON abha_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_abha_profiles_timestamp();
