# CareBridge Unified REST API & Database Service

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B%20%7C%20v20%20%7C%20v24-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B%20%7C%2018-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-RFC%207519-000000?style=flat-square&logo=json-web-tokens&logoColor=white)](https://jwt.io/)
[![Backend Tests](https://img.shields.io/badge/Backend%20Tests-101%2F101%20Passing-brightgreen?style=flat-square)](https://github.com/MOULEESHWARAN-S31/CareBridge_System)

The **CareBridge Backend Service** is the central transactional engine, authentication authority, and single source of truth for the CareBridge platform. Built with Node.js, Express, and PostgreSQL, it provides secure, high-performance REST APIs serving the Patient Mobile App, Common Login Portal, Master Admin Dashboard, Government Health Dashboard, and Hospital Operations System.

---

## 1. System Architecture & Capabilities

- **Single Authenticated Gateway**: Hosted on **Port 5000** under `/api/*`.
- **Relational Integrity**: Houses 24 normalized PostgreSQL tables in `carebridge_db` with foreign keys, transactional isolation (`BEGIN ... COMMIT / ROLLBACK`), and prepared statements.
- **Role-Based Access Control (RBAC)**: Fine-grained middleware authorization supporting 13 distinct platform roles:
  - Master Admin: `ADMIN`
  - Government Health: `STATE_ADMIN`, `DISTRICT_ADMIN`, `GOVERNMENT`
  - Hospital Operations: `HOSPITAL_ADMIN`, `DOCTOR`, `NURSE`, `RECEPTIONIST`, `LAB_STAFF`, `PHARMACIST`, `BILLING_STAFF`, `RECORDS_STAFF`, `EMERGENCY_STAFF`, `HR_MANAGER`
  - Citizens: ABHA Patient access
- **Geographic Authorization Gating**: Enforces district boundaries on administrative queries (`Salem` vs statewide `ALL`); unauthorized cross-district requests return **HTTP 403 Forbidden**.
- **Cryptographic Standards**: JSON Web Tokens signed with HMAC-SHA256 and passwords hashed with `bcryptjs` (10 rounds).

---

## 2. API Route Specifications

### Authentication & Users
| Method | Endpoint | Access Level | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticates credentials; returns signed JWT with role, district, and facility claims. |
| `POST` | `/api/auth/logout` | Public | Terminates active session. |
| `GET` | `/api/auth/me` | Authenticated | Returns current authenticated user metadata from JWT. |
| `GET` | `/api/users` | `ADMIN` only | Lists all registered platform user accounts. |
| `POST` | `/api/users` | `ADMIN` only | Creates a new user with hashed password and role assignment. |
| `PUT` | `/api/users/:id` | `ADMIN` only | Updates user account details or status. |
| `DELETE`| `/api/users/:id` | `ADMIN` only | Deactivates or removes a user account. |

### ABHA & Patient Profiles
| Method | Endpoint | Access Level | Description |
|---|---|---|---|
| `GET` | `/api/abha/profiles?mobile=...` | Public / Mobile | Retrieves linked ABHA profiles for given phone number (supports ABDM test numbers). |
| `GET` | `/api/abha/profiles/:id` | Authenticated | Retrieves specific patient ABHA profile details. |
| `POST` | `/api/abha/profiles` | Public / Mobile | Registers a new citizen ABHA health ID. |

### Facilities, Hospitals & Master Registry
| Method | Endpoint | Access Level | Description |
|---|---|---|---|
| `GET` | `/api/facilities` *(or `/hospitals`)* | Public | Lists hospitals, CHCs, and PHCs with bed counts, coordinates, and contact details. |
| `GET` | `/api/facilities/:id` | Public | Retrieves detailed facility record by canonical ID (e.g., `GDH-SALEM-01`). |
| `POST` | `/api/facilities` | `ADMIN` only | Accredit and add a new healthcare facility. |
| `PUT` | `/api/facilities/:id` | `ADMIN` only | Updates facility parameters or bed capacity. |
| `DELETE`| `/api/facilities/:id` | `ADMIN` only | Archives a facility record. |
| `POST` | `/api/admin/bulk-import/hospitals`| `ADMIN` only | SheetJS bulk-import of hospitals with automatic fallback coordinate enrichment. |

### Clinical Operations & Appointments
| Method | Endpoint | Access Level | Description |
|---|---|---|---|
| `GET` | `/api/doctors` | Public | Lists medical doctors and clinical specialists. |
| `GET` | `/api/appointments` | Authenticated | Retrieves scheduled OPD appointments filtered by facility, doctor, or patient. |
| `POST` | `/api/appointments` | Authenticated | Books a new OPD appointment with transactional slot verification. |
| `PUT` | `/api/appointments/:id` | Staff | Updates appointment status (e.g., Checked-In, Completed, Cancelled). |
| `GET` | `/api/prescriptions` | Authenticated | Retrieves digital prescriptions by patient ABHA or doctor ID. |
| `POST` | `/api/prescriptions` | `DOCTOR` | Issues a new e-prescription with medicine dosage and instructions. |
| `GET` | `/api/records` | Authenticated | Retrieves patient medical records, lab reports, and clinical history. |
| `POST` | `/api/records` | Clinical Staff | Uploads a new electronic medical record (EMR). |

### Hospital Dashboard Endpoints (`GDH-SALEM-01`)
| Method | Endpoint | Access Level | Description |
|---|---|---|---|
| `GET` | `/api/hospital/overview` | Hospital Staff | Live overview: total beds, occupancy rate, on-duty doctors, OPD queues. |
| `GET` | `/api/hospital/beds` | Hospital Staff | Detailed ward-level bed matrix (General, ICU, Pediatric, Emergency). |
| `GET` | `/api/hospital/patients/search` | Hospital Staff | Fast patient lookup by ABHA, OP number, phone, or name. |
| `GET / PUT` | `/api/hospital/medicines` | Pharmacist / Admin| Query and update hospital pharmacy inventory. |
| `GET / PUT` | `/api/hospital/diagnostics`| Lab / Admin | Query and update laboratory and imaging diagnostic equipment status. |
| `GET / PUT` | `/api/hospital/camp-assignments`| Admin / Staff | Coordinate hospital medical teams assigned to health camps. |

### Government & Public Health Intelligence
| Method | Endpoint | Access Level | Description |
|---|---|---|---|
| `GET` | `/api/government/me` | Government | Returns authoritative state/district administrative scope and profile. |
| `GET` | `/api/government/camps` | Government | Persistent community health camp roster and proposal tracking. |
| `POST` | `/api/government/camps` | Government | Schedule a new health camp outreach event. |
| `GET` | `/api/government/community-requests`| Government | Citizen-requested health camp submissions. |
| `PUT` | `/api/government/community-requests/:id/status`| Government | Approve or Reject citizen health camp requests. |
| `GET` | `/api/government/audit-events` | Government | Immutable record of governmental decisions, allocations, and approvals. |
| `GET` | `/api/health-alerts` | Public / Gov | Active disease outbreak alerts and epidemic advisories. |
| `GET` | `/api/referrals` | Staff / Gov | Inbound and outbound inter-facility patient referral queue. |
| `GET` | `/api/notifications` | Public / Gov | Public health announcements and statutory warnings. |

---

## 3. Database Schema Overview

The PostgreSQL database `carebridge_db` includes 24 normalized tables:

```
carebridge_db
├── users                                # Healthcare administrative accounts & credentials
├── hospitals                            # Healthcare facilities master registry
├── doctors                              # Specialist and medical officer registry
├── abha_profiles                        # Citizen ABHA profiles & ABDM test records
├── appointments                         # OPD bookings, tokens, and schedules
├── medical_stores                       # Pharmacies and Jan Aushadhi Kendras
├── prescriptions                        # Digital e-prescriptions & medicines
├── patient_records                      # Electronic Medical Records (EMR / FHIR)
├── emergency_contacts                   # Citizen emergency SOS contact numbers
├── health_camps                         # Community medical outreach camps
├── health_alerts                        # Epidemic warnings & outbreak alerts
├── referrals                            # Patient referral tracking
├── notifications                        # Public announcements & bulletins
├── audit_logs                           # Administrative audit events
├── facility_medicines                   # Facility-specific medicine inventory
├── facility_diagnostics                 # Facility diagnostic equipment status
├── camp_facility_assignments            # Staffing assignments for health camps
├── community_camp_requests              # Citizen health camp request queue
└── government_audit_events              # Government approvals and allocations log
```

---

## 4. Setup, Database Initialization & Run

### Prerequisites
- Node.js (v18+)
- PostgreSQL 16+ running on `localhost:5432`

### Environment Configuration
Create a `.env` file in `backend/`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/carebridge_db
JWT_SECRET=carebridge_production_jwt_super_secret_key_2026
JWT_EXPIRES_IN=24h
CORS_ORIGIN=*
```

### Install Dependencies
```bash
npm install
```

### Initialize Database & Populate Seed Data
```bash
# Creates database, applies DDL schema, and inserts initial seed data
npm run db:setup

# Synchronizes canonical GDH-SALEM-01 facility mapping
node scripts/sync_canonical_facility.js

# Seeds all 10 Hospital role credentials with bcrypt hashes
node scripts/seed_hospital_roles.js
```

### Run Server in Development Mode
```bash
npm run dev
# Starts Express on http://localhost:5000 with --watch auto-reload
```

---

## 5. Automated Integration Test Suite

The backend includes a comprehensive 101-test automated integration suite covering health checks, authentication, RBAC, ABDM profiles, hospital operations, and PostgreSQL persistence:

```bash
npm test
# or: node test/backend.test.js
```

**Results: 101/101 PASSED (0 failures)**
- Health check verification
- Password hashing & negative authentication checks
- Role-based access rejection (HTTP 403)
- ABHA phone lookup across all 6 ABDM test cases
- Live facility creation, distance sorting & bulk import
- Full authentication of all 10 hospital roles with `hospitalId = 'GDH-SALEM-01'`
- Hospital clinical overview, bed matrix, and patient search
- Community camp request workflows & government audit event logging

