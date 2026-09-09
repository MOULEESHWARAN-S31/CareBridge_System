# CareBridge — PostgreSQL ABHA Mock Dataset & Setup Guide

This directory contains the database schema, synthetic seed dataset, and setup scripts for the CareBridge healthcare prototype ABHA authentication system.

---

## 1. Architectural Overview & Security

```text
┌─────────────────────────────────────────────────────────┐
│                    Flutter Client                       │
│     (Offline prototype uses MockAbhaRepository)         │
└───────────────────────────┬─────────────────────────────┘
                            │ HTTPS / REST (Future)
                            ▼
┌─────────────────────────────────────────────────────────┐
│                Future Backend REST API                  │
│       e.g., GET /api/abha/profiles?mobileNumber=...     │
│   (Secured with server-side environment credentials)    │
└───────────────────────────┬─────────────────────────────┘
                            │ SQL / Pool
                            ▼
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL Database (Local)                │
│     Table: abha_profiles (36 Synthetic Test Profiles)   │
└─────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **Security Guardrails:**
> - **Flutter never connects directly to PostgreSQL.** The Flutter client interacts with `MockAbhaRepository` in the prototype or an authenticated backend API in production.
> - **No database credentials** (usernames, passwords, connection strings) are embedded in Flutter client code or committed to Git.
> - **Synthetic Data Only:** All records in this dataset are 100% synthetic for prototype demonstration and testing. No real Aadhaar numbers, real ABHA IDs, or real personal health information (PHI) are collected or stored.

---

## 2. PostgreSQL Detection & Path Configuration

The setup scripts can run on any modern PostgreSQL installation (PostgreSQL 14, 15, 16, 17, 18+).

### Path Placeholder
In commands below, replace `<POSTGRESQL_INSTALL_PATH>` with your local PostgreSQL installation directory.

Common default paths on Windows:
- `C:\Program Files\PostgreSQL\18`
- `C:\Program Files\PostgreSQL\17`
- `C:\Program Files\PostgreSQL\16`

### Auto-Detecting `psql.exe` in PowerShell
Run this snippet in PowerShell to find your local path:

```powershell
# Check PATH or standard installation paths
$psqlCmd = Get-Command psql -ErrorAction SilentlyContinue
if ($psqlCmd) {
    $psqlPath = $psqlCmd.Source
} else {
    $detected = Get-ChildItem "C:\Program Files\PostgreSQL" -Filter "psql.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    $psqlPath = if ($detected) { $detected.FullName } else { "<POSTGRESQL_INSTALL_PATH>\bin\psql.exe" }
}
Write-Output "Detected psql at: $psqlPath"
```

---

## 3. Database Creation & Execution

### Step 1: Automated Setup & Verification (Recommended)
You can run the provided PowerShell helper script, which detects your local PostgreSQL installation, ensures the `carebridge` database is created, applies the schema and seed scripts, and executes all verification queries:

```powershell
powershell -ExecutionPolicy Bypass -File "database\run_setup.ps1"
```

---

### Step 2: Manual Setup Alternative
If you prefer running commands manually:

#### 1. Create Database
Connect to PostgreSQL as administrator (default user `postgres`) and create the `carebridge` database if it does not already exist:

```powershell
& "<POSTGRESQL_INSTALL_PATH>\bin\psql.exe" -U postgres -c "CREATE DATABASE carebridge;"
```

#### 2. Run All-in-One Setup Script
The `carebridge_setup.sql` script applies schema definitions, indexes, timestamp triggers, and inserts the authoritative 36 synthetic seed profiles idempotently:

```powershell
& "<POSTGRESQL_INSTALL_PATH>\bin\psql.exe" -U postgres -d carebridge -f "database\carebridge_setup.sql"
```

#### 3. Or Run Schema and Seed Separately
```powershell
# Apply Schema
& "<POSTGRESQL_INSTALL_PATH>\bin\psql.exe" -U postgres -d carebridge -f "database\carebridge_schema.sql"

# Populate 36 Synthetic Profiles
& "<POSTGRESQL_INSTALL_PATH>\bin\psql.exe" -U postgres -d carebridge -f "database\carebridge_seed.sql"
```

---

## 4. Test Mobile Numbers Reference Matrix

These test phone numbers are designated for automated tests, manual testing, and demo presentations:

| Mobile Number | Expected Profiles | Relationships Present | Purpose / Scenario |
| :--- | :---: | :--- | :--- |
| `9876500001` | **1** | Self | Single profile direct match |
| `9876500002` | **2** | Self, Spouse | Multi-profile selection dialog |
| `9876500003` | **3** | Self, Spouse, Child | Family cluster lookup |
| `9876500004` | **4** | Self, Spouse, Child, Parent | Full family lookup with elder parent |
| `9876543210` | **2** | Self, Spouse | Default CareBridge prototype demo login |
| `9876500000` | **0** | None | Triggers "No ABHA Profile Found" → Create ABHA |

---

## 5. Required Verification Queries

Execute these verification queries against the `carebridge` database using `psql.exe` to ensure database integrity:

### 1. Total Profile Count (Expected: 36)
```sql
SELECT COUNT(*) FROM abha_profiles;
```

### 2. Multi-Profile Mobile Numbers
```sql
SELECT mobile_number, COUNT(*)
FROM abha_profiles
GROUP BY mobile_number
HAVING COUNT(*) > 1
ORDER BY mobile_number;
```

### 3. Specific Test Number (Expected: 3)
```sql
SELECT COUNT(*)
FROM abha_profiles
WHERE mobile_number = '9876500003';
```

### 4. Zero-Profile Number (Expected: 0)
```sql
SELECT COUNT(*)
FROM abha_profiles
WHERE mobile_number = '9876500000';
```

### 5. ABHA ID Uniqueness (Expected: 0 rows)
```sql
SELECT abha_id, COUNT(*)
FROM abha_profiles
GROUP BY abha_id
HAVING COUNT(*) > 1;
```

### 6. ABHA Address Uniqueness (Expected: 0 rows)
```sql
SELECT abha_address, COUNT(*)
FROM abha_profiles
GROUP BY abha_address
HAVING COUNT(*) > 1;
```

### 7. Performance Index Verification
```sql
SELECT indexname
FROM pg_indexes
WHERE tablename = 'abha_profiles';
```
*(Confirms `idx_abha_profiles_mobile` and `idx_abha_profiles_district` are present)*

### 8. Deterministic Profile Lookup Query
When fetching profiles by mobile number in backend services or queries, always specify deterministic ordering:
```sql
SELECT id, abha_id, abha_address, name, gender, date_of_birth, relationship, mobile_number, district, state, pincode
FROM abha_profiles
WHERE mobile_number = '9876500003'
ORDER BY id;
```

---

## 6. Future Backend API Specification

When connecting CareBridge to a live backend microservice, the server-side route should expose:

```http
GET /api/abha/profiles?mobileNumber={cleanMobile}
```

**Sample Response (HTTP 200 OK):**
```json
[
  {
    "id": "45-6789-0123-3001",
    "name": "Murugan Palani",
    "abhaNumber": "45-6789-0123-3001",
    "abhaAddress": "murugan.palani@abdm",
    "relationship": "Self",
    "mobileNumber": "9876500003",
    "gender": "Male",
    "dateOfBirth": "1975-07-10",
    "district": "Madurai",
    "state": "Tamil Nadu",
    "pincode": "625001"
  },
  {
    "id": "56-7890-1234-3002",
    "name": "Lakshmi Murugan",
    "abhaNumber": "56-7890-1234-3002",
    "abhaAddress": "lakshmi.murugan@abdm",
    "relationship": "Spouse",
    "mobileNumber": "9876500003",
    "gender": "Female",
    "dateOfBirth": "1980-04-18",
    "district": "Madurai",
    "state": "Tamil Nadu",
    "pincode": "625001"
  },
  {
    "id": "67-8901-2345-3003",
    "name": "Kavin Murugan",
    "abhaNumber": "67-8901-2345-3003",
    "abhaAddress": "kavin.murugan@abdm",
    "relationship": "Child",
    "mobileNumber": "9876500003",
    "gender": "Male",
    "dateOfBirth": "2010-09-25",
    "district": "Madurai",
    "state": "Tamil Nadu",
    "pincode": "625001"
  }
]
```

If no profiles match the mobile number, the API returns an empty array `[]` (HTTP 200 OK), cleanly triggering the prototype's "No ABHA Profile Found" flow.
