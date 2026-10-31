# CareBridge System — Smart Public Healthcare Access Platform

[![Build & Integration Tests](https://img.shields.io/badge/Backend%20Tests-101%2F101%20Passing-brightgreen?style=flat-square)](https://github.com/MOULEESHWARAN-S31/CareBridge_System)
[![Hospital Tests](https://img.shields.io/badge/Hospital%20Tests-107%2F107%20Passing-brightgreen?style=flat-square)](https://github.com/MOULEESHWARAN-S31/CareBridge_System)
[![Government Tests](https://img.shields.io/badge/Government%20Tests-94%2F94%20Passing-brightgreen?style=flat-square)](https://github.com/MOULEESHWARAN-S31/CareBridge_System)
[![Flutter Tests](https://img.shields.io/badge/Flutter%20Tests-120%2F120%20Passing-brightgreen?style=flat-square)](https://github.com/MOULEESHWARAN-S31/CareBridge_System)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B%20%7C%20v20%20%7C%20v24-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B%20%7C%2018-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Flutter](https://img.shields.io/badge/Flutter-3.x%20Web%20%26%20Mobile-02569B?style=flat-square&logo=flutter&logoColor=white)](https://flutter.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![ABDM / ABHA](https://img.shields.io/badge/ABDM%20%2F%20ABHA-Compliant-FF9933?style=flat-square)](https://abdm.gov.in/)

**CareBridge** is an enterprise-grade public healthcare access and operations platform developed for state health departments, district administrations, public hospitals, primary health centers (PHCs), and citizens. It unifies healthcare delivery under **ONE single authenticated backend and authoritative PostgreSQL database (`carebridge_db`)**.

---

## 1. System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     CAREBRIDGE SYSTEM ARCHITECTURE                                     │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘

   CareBridge Patient App         Common Login Portal         Admin Dashboard         Government Portal         Hospital Dashboard
     [Flutter / Android]              (Port 3000)               (Port 5173)              (Port 5174)                (Port 5175)
    [Dart 3.x / Web: 8080]       [HTML5 / CSS / Vanilla]     [Vanilla JS / CSS]       [React 19 Vite TS]         [React 19 Vite JS]
             │                             │                          │                          │                          │
             │                             │ POST /api/auth/login     │                          │                          │
             └─────────────────────────────┴────────────┬─────────────┴──────────────────────────┴──────────────────────────┘
                                                        │
                                                        │ JSON REST API / Bearer JWT
                                                        ▼
                                      ┌────────────────────────────────────┐
                                      │     CareBridge Unified REST API    │
                                      │     Node.js + Express (Port 5000)  │
                                      │   RBAC Middleware & Geographic Gating│
                                      └─────────────────┬──────────────────┘
                                                        │
                                                        │ node-postgres (pg) Connection Pool
                                                        ▼
                                      ┌────────────────────────────────────┐
                                      │       PostgreSQL Database          │
                                      │       carebridge_db (Port 5432)    │
                                      │      24 Normalized DB Tables       │
                                      │    & Authoritative Live Datasets   │
                                      └────────────────────────────────────┘
```

### Architectural Principles:
1. **Single Source of Truth**: All five applications interact exclusively with the Node.js Express REST API (`backend/`) on Port 5000 and PostgreSQL (`carebridge_db`) on Port 5432.
2. **Canonical Identification**: Persistent canonical IDs connect workflows across portals:
   - Facilities: `GDH-SALEM-01` (Government District Hospital — Salem), `PHC-OMALUR-01`, `PHC-MECHERI-01`
   - Districts: `Salem`, `Chennai`, `Coimbatore`, `Madurai`, `Tiruchirappalli`
   - Patients: Universal 14-digit ABHA numbers (e.g., `12-3456-7890-1234`)
3. **Strict Role-Based Access Control (RBAC)**: Enforced via cryptographic server-signed JWTs (`requireRole`) and frontend guards.
4. **Geographic Gating**: District Health Administrators are restricted strictly to their assigned district jurisdiction (`Salem`); cross-district queries are rejected with HTTP 403 Forbidden.
5. **English-Only Government UI**: Government Dashboard retains strict English-only UI for administrative precision; multilingual localization (23 languages) is housed within the citizen Flutter Patient App.
6. **Strict AI Isolation**: Machine learning and epidemiological forecast models remain decoupled from baseline operational transaction flows.

---

## 2. Integrated Applications & Port Matrix

| Application | Directory | Port | Technology | Primary Role & Access |
|---|---|---|---|---|
| **Common Login** | `LOGIN/` | **3000** | HTML5, CSS3, Vanilla JS | Unified central authentication gateway with evaluator demo pills and seamless role redirection. |
| **Master Admin Dashboard** | `ADMIN_DASHBOARD/` | **5173** | HTML5, Vanilla JS, SheetJS | Master administrator portal: facility accreditation, pharmacy management, user provisioning, bulk Excel import, audit logs. |
| **Government Dashboard** | `GOVERNMENT_DASHBOARD/` | **5174** | React 19, TypeScript, Vite, TailwindCSS | Dual-workspace administration: Statewide Health Command Center (`STATE_ADMIN`) & District Health Administration (`DISTRICT_ADMIN`). |
| **Hospital Dashboard** | `HOSPITAL_DASHBOARD/` | **5175** | React 19, JavaScript, Vite, Recharts | Hospital Operations Management System for `GDH-SALEM-01` across 10 specialized hospital roles. |
| **CareBridge Patient App** | `CARE_BRIDGE/` | **Mobile / 8080** | Flutter 3.x, Dart | Citizen digital health app: ABHA integration, OPD booking, live token queue, FHIR records, emergency SOS, 23 languages. |
| **Backend REST API** | `backend/` | **5000** | Node.js, Express, pg, JWT, bcrypt | Authoritative REST API serving all frontends with RBAC and transaction management. |
| **PostgreSQL Database** | `database/` | **5432** | PostgreSQL 16+ / 18 | Central database (`carebridge_db`) storing 24 relational tables and audit trails. |

---

## 3. Applications Deep Dive

### 🏛️ Government Health Dashboard (`GOVERNMENT_DASHBOARD/`)
Provides real-time healthcare monitoring, disease surveillance, and resource governance across two authenticated workspaces:
- **State Admin (`STATE_ADMIN`)**:
  - `S01`: Statewide Executive Command Center & KPIs
  - `S02`: District Performance Comparisons & Health Indices
  - `S03`: Disease Surveillance & Outbreak Cluster Detection
  - `S04`: Statewide Facility Bed & ICU Capacity Monitoring
  - `S05`: Medicine & Diagnostic Shortage Intelligence
  - `S06`: Blood Bank Inventory & Inter-District Coordination
  - `S07`: Smart Health Camp Oversight
  - `S08`: Statewide Resource Reallocation Directives
  - `S09`: District Resource Escalations Queue (Approve / Reject)
  - `S10`: Official State Public Announcements
  - `S11`: Executive Health Digests & Statutory Reports
- **District Admin (`DISTRICT_ADMIN` — Salem District)**:
  - `D01`: District Command Center (Local Key Indicators)
  - `D02`: District Hospitals, CHCs & PHC Network Monitoring
  - `D03`: Block & Village Health Metrics
  - `D04`: Disease Surveillance & Village-Level Clusters
  - `D05`: Smart Health Camp Scheduling & Roster Management
  - `D06`: Citizen Health Camp Request Approvals
  - `D07`: District Medicine & Diagnostic Stock Levels
  - `D08`: District Blood Bank Availability & Emergency Units
  - `D09`: OPD Appointments & Hospital Queue Monitoring
  - `D10`: Inter-Facility Patient Referral Tracking
  - `D11`: High-Risk Chronic & Maternal Follow-Up Programs
  - `D12`: District Public Health Notices & Advisories
  - `D13`: District Operational Reports & Audit Logs
  - `D14`: Diagnostic Equipment Availability & Uptime Tracking

### 🏥 Hospital Management System (`HOSPITAL_DASHBOARD/`)
Operational Hospital Management System configured for **Government District Hospital — Salem (`GDH-SALEM-01`)**, supporting 10 distinct hospital staff roles:
1. **Hospital Administrator (`HOSPITAL_ADMIN`)**: Overall hospital operations, occupancy, staff rotas, facility KPIs.
2. **Doctor (`DOCTOR`)**: OPD consultation queue, electronic medical records, e-prescriptions, referral issuance.
3. **Nurse (`NURSE`)**: Inpatient vitals logging, bed allocations, medication administration schedules.
4. **Receptionist (`RECEPTIONIST`)**: Patient registration, ABHA verification, token generation, queue dispatch.
5. **Laboratory Technician (`LAB_STAFF`)**: Diagnostic test orders, sample collection, lab result entry.
6. **Pharmacist (`PHARMACIST`)**: Digital prescription dispensing, inventory tracking, stock alerts.
7. **Billing Staff (`BILLING_STAFF`)**: Government scheme verification (PM-JAY / CMCHIS), invoice generation.
8. **Medical Records Staff (`RECORDS_STAFF`)**: Electronic Health Records (EHR), ICD-10 coding, record archival.
9. **Emergency Staff (`EMERGENCY_STAFF`)**: Triage scoring, ambulance dispatch, trauma bay management.
10. **Bed / HR Manager (`HR_MANAGER`)**: Staff shifts, department allocations, attendance logs.

### 📱 CareBridge Patient App (`CARE_BRIDGE/`)
Citizen-facing Flutter mobile application designed for high accessibility, rural low-bandwidth resilience, and multilingual inclusivity:
- **ABDM / ABHA Digital Identity**: Fast phone number lookup, OTP verification, instant profile linking, and QR code generation.
- **Multilingual Localization Engine**: Native support for **23 Indian Languages** (Tamil, Hindi, Telugu, Malayalam, Kannada, Bengali, Marathi, Gujarati, etc.).
- **OPD Appointment Booking**: Real-time hospital selection, department and specialist scheduling, digital token generation.
- **Live Queue Tracking**: Real-time token progress monitoring reducing waiting room congestion.
- **Personal Health Records (PHR / FHIR)**: Access lab reports, doctor prescriptions, discharge summaries, and immunizations.
- **Emergency SOS & Facility Locator**: GPS-sorted nearest 24x7 emergency facilities, quick hotline dialing, and ambulance routing.
- **Offline Sync Queue**: Offline data caching ensuring appointment details and emergency cards are accessible without active internet.

### ⚙️ Master Admin Dashboard (`ADMIN_DASHBOARD/`)
Master network oversight platform for health department super administrators:
- **Facility Master Registry**: Accreditation, capacity configuration, and coordinates for Hospitals, PHCs, and CHCs.
- **User Provisioning & RBAC**: Admin-controlled credential issuance for government officials, hospital admins, and medical staff.
- **Pharmacy & Medical Store Registry**: Licensing verification, pharmacy mapping, and essential medicine catalogue management.
- **Bulk Import Engine**: SheetJS/XLSX workbook ingestion for mass onboarding of facilities, doctors, and inventories.
- **System Audit Log**: Immutable record of all system-wide administrative changes with timestamps and IP logging.

### 🔐 Common Unified Login Portal (`LOGIN/`)
Single sign-on entry point hosted on port `3000`:
- **Cryptographic Backend Authentication**: Directly hits `POST /api/auth/login` on port 5000.
- **Role-Based Redirection Engine**:
  - `ADMIN` $\rightarrow$ `http://localhost:5173`
  - `STATE_ADMIN` / `DISTRICT_ADMIN` / `GOVERNMENT` $\rightarrow$ `http://localhost:5174/dashboard`
  - Hospital Roles (`HOSPITAL_ADMIN`, `DOCTOR`, `RECEPTIONIST`, etc.) $\rightarrow$ `http://localhost:5175/<role>/dashboard`
- **Zero-Bypass Token Protection**: Sanitizes tokens from URL history via `window.history.replaceState()`.
- **Evaluator Fast-Pills**: One-click demo credential autofill for rapid evaluator inspection across all roles.

---

## 4. Default Credentials & Role Matrix

| Application | Role | Email / Identifier | Password | Access URL |
|---|---|---|---|---|
| **Common Login** | Gateway | *(Any valid account)* | *(Password)* | [http://localhost:3000](http://localhost:3000) |
| **Master Admin Dashboard** | `ADMIN` | `admin@carebridge.local` | `Admin@123` | [http://localhost:5173](http://localhost:5173) |
| **Government Dashboard** | `GOVERNMENT` | `government@carebridge.local` | `Gov@123` | [http://localhost:5174/dashboard](http://localhost:5174/dashboard) |
| **Hospital Administrator** | `HOSPITAL_ADMIN` | `hospital.admin@carebridge.local` | `Admin@123` | [http://localhost:5175/admin/dashboard](http://localhost:5175/admin/dashboard) |
| **Doctor** | `DOCTOR` | `doctor@carebridge.local` | `Doctor@123` | [http://localhost:5175/doctor/dashboard](http://localhost:5175/doctor/dashboard) |
| **Nurse** | `NURSE` | `nurse@carebridge.local` | `Nurse@123` | [http://localhost:5175/nurse/dashboard](http://localhost:5175/nurse/dashboard) |
| **Receptionist** | `RECEPTIONIST` | `receptionist@carebridge.local` | `Reception@123` | [http://localhost:5175/receptionist/dashboard](http://localhost:5175/receptionist/dashboard) |
| **Laboratory Staff** | `LAB_STAFF` | `lab@carebridge.local` | `Lab@123` | [http://localhost:5175/lab/dashboard](http://localhost:5175/lab/dashboard) |
| **Pharmacist** | `PHARMACIST` | `pharmacist@carebridge.local` | `Pharmacy@123` | [http://localhost:5175/pharmacy/dashboard](http://localhost:5175/pharmacy/dashboard) |
| **Billing Staff** | `BILLING_STAFF` | `billing@carebridge.local` | `Bill@123` | [http://localhost:5175/billing/dashboard](http://localhost:5175/billing/dashboard) |
| **Medical Records Staff** | `RECORDS_STAFF` | `records@carebridge.local` | `Record@123` | [http://localhost:5175/records/dashboard](http://localhost:5175/records/dashboard) |
| **Emergency Staff** | `EMERGENCY_STAFF` | `emergency@carebridge.local` | `Emerg@123` | [http://localhost:5175/emergency/dashboard](http://localhost:5175/emergency/dashboard) |
| **HR Manager** | `HR_MANAGER` | `hr@carebridge.local` | `Hr@123` | [http://localhost:5175/hr/dashboard](http://localhost:5175/hr/dashboard) |

### ABDM / ABHA Test Phone Numbers
Pre-seeded in PostgreSQL to test full ABDM compliance:
- `9876500000`: Unregistered user $\rightarrow$ Triggers New ABHA Registration Flow
- `9876500001`: Single Individual profile (`12-3456-7890-1234` — Ramesh Kumar)
- `9876500002`: Family Unit: Self + Spouse
- `9876500003`: Nuclear Family: Self + Spouse + Child
- `9876500004`: Joint Family: Parents, Self, Spouse, Child
- `9876543210`: Multi-Profile General Demonstration Account

---

## 5. Prerequisites & Environment Setup

- **Node.js**: v18.0.0 or higher (v20+ / v24 tested)
- **PostgreSQL**: v16.0 or higher (`carebridge_db` on port 5432)
- **Flutter SDK**: v3.19.0 or higher with Dart SDK 3.3+
- **Google Chrome / Microsoft Edge**: For web applications and dashboards
- **Git**: For source version control

### Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/MOULEESHWARAN-S31/CareBridge_System.git
   cd CareBridge_System
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in `backend/` and root (or copy `.env.example`):
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/carebridge_db
   JWT_SECRET=carebridge_production_jwt_super_secret_key_2026
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=*
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   npm --prefix backend install
   npm --prefix ADMIN_DASHBOARD install
   npm --prefix GOVERNMENT_DASHBOARD install
   npm --prefix HOSPITAL_DASHBOARD install
   cd CARE_BRIDGE && flutter pub get && cd ..
   ```

4. **Initialize & Seed PostgreSQL Database**:
   ```bash
   npm --prefix backend run db:setup
   node backend/scripts/sync_canonical_facility.js
   node backend/scripts/seed_hospital_roles.js
   ```

---

## 6. Running the Applications

### Launch All Services Concurrently (Recommended)
```bash
npm start
# or: npm run dev:all
```
This runs all services concurrently:
- **`[BACKEND]`** on [http://localhost:5000](http://localhost:5000)
- **`[LOGIN]`** on [http://localhost:3000](http://localhost:3000)
- **`[ADMIN]`** on [http://localhost:5173](http://localhost:5173)
- **`[GOVERNMENT]`** on [http://localhost:5174](http://localhost:5174)
- **`[HOSPITAL]`** on [http://localhost:5175](http://localhost:5175)

The orchestrator preflights all five ports and fails before launching children if any
required port is already occupied. Press `Ctrl+C` to terminate the complete process
tree; rerun `npm run dev:all` after shutdown for a clean restart.

Common Login uses a short-lived, single-use backend handoff code for new dashboard
redirects. The code is exchanged over `POST /api/auth/handoff/exchange` and removed
from the browser URL immediately. Legacy URL-token ingestion remains available only
for backward compatibility with existing sessions.

### Launch Flutter Patient App
```bash
npm run dev:carebridge
# or:
cd CARE_BRIDGE && flutter run -d chrome --web-port=8080
```

---

## 7. Automated Test Suites & Verification

CareBridge features comprehensive automated test coverage across all five tiers:

| Suite | Command | Test Count | Status |
|---|---|---|---|
| **Backend API & PostgreSQL** | `npm --prefix backend test` | **101 tests** | **101/101 PASSED** |
| **Hospital Dashboard** | `node HOSPITAL_DASHBOARD/scripts/run_all_tests.js` | **107 tests** | **107/107 PASSED** |
| **Government Dashboard** | `npm --prefix GOVERNMENT_DASHBOARD test` | **94 tests** | **94/94 PASSED** |
| **Flutter Patient App** | `cd CARE_BRIDGE && flutter test` | **120 tests** | **120/120 PASSED** |
| **Flutter Static Analysis** | `cd CARE_BRIDGE && flutter analyze` | **0 issues** | **Clean** |
| **Frontend Production Builds** | `npm --prefix GOVERNMENT_DASHBOARD run build`<br>`npm --prefix HOSPITAL_DASHBOARD run build` | **All bundles** | **Exit code 0** |

---

## 8. Repository Structure

```
CareBridge_System/
├── README.md                            # Complete System Architecture & Overview
├── package.json                         # Multi-service launcher scripts
├── .env.example                         # Environment template
│
├── LOGIN/                               # Common Login Portal (Port 3000)
│   ├── index.html                       # Responsive login portal
│   ├── css/design-system.css            # Standardized healthcare tokens
│   └── js/                              # Form validation, auth, and role redirection
│
├── ADMIN_DASHBOARD/                     # Master Admin Dashboard (Port 5173)
│   ├── index.html                       # Admin portal SPA
│   ├── css/admin.css                    # Admin UI styles
│   ├── js/                              # Facility, user, pharmacy & audit components
│   └── README.md                        # Admin Dashboard documentation
│
├── GOVERNMENT_DASHBOARD/                # Government Health Portal (Port 5174)
│   ├── src/
│   │   ├── context/HealthDataContext.tsx# Role guard, state sync & live API client
│   │   ├── layouts/DashboardLayout.tsx  # Header, sidebar & workspace switcher
│   │   ├── pages/state/                 # S01-S11 State Admin workspace pages
│   │   ├── pages/district/              # D01-D14 District Admin workspace pages
│   │   └── pages/                       # Geographic, facility & surveillance views
│   ├── scripts/test_government_dashboard.js # 94-test verification runner
│   └── README.md                        # Government Dashboard documentation
│
├── HOSPITAL_DASHBOARD/                  # Hospital Operations Portal (Port 5175)
│   ├── src/
│   │   ├── auth/accounts.js             # Canonical credentials for 10 hospital roles
│   │   ├── components/                  # Role-based dashboards & clinical workflows
│   │   └── services/                    # Live backend API connectors
│   ├── scripts/run_all_tests.js         # 107-test verification runner
│   └── README.md                        # Hospital Dashboard documentation
│
├── CARE_BRIDGE/                         # Flutter Patient Mobile App (Mobile / Port 8080)
│   ├── lib/
│   │   ├── core/                        # API client, localization (23 languages), theme
│   │   └── features/                    # ABHA, appointments, records, emergency, queue
│   ├── test/                            # 120 Flutter unit, widget & integration tests
│   └── README.md                        # Flutter App documentation
│
└── backend/                             # Express REST API & Database (Port 5000)
    ├── src/
    │   ├── server.js                    # Express HTTP server & connection health
    │   ├── config/db.js                 # PostgreSQL connection pool
    │   ├── middleware/                  # JWT auth, requireRole, governmentScope
    │   ├── controllers/                 # Business logic controllers
    │   └── routes/api.js                # Consolidated REST API router
    ├── scripts/                         # Database setup, migrations, and seeders
    ├── test/backend.test.js             # 101-test backend integration suite
    └── README.md                        # Backend & Database documentation
```

---

## 9. Regulatory & Security Compliance

- **ABDM Compliance**: Full integration with National Health Authority Ayushman Bharat Digital Mission (ABDM) specifications for ABHA creation, verification, and FHIR-compliant health records.
- **Privacy & PHI Protection**: Patient identities are cryptographically masked in administrative surveillance heatmaps.
- **Parameterized SQL**: All PostgreSQL interactions utilize strictly parameterized statements via `pg` pool queries to eliminate SQL injection risks.
- **Auditing**: Comprehensive audit logs (`audit_logs` & `government_audit_events`) capture every resource alteration, request status change, and user creation event.

---

## 10. License & Maintainer

- **Maintainer**: MOULEESHWARAN S ([@MOULEESHWARAN-S31](https://github.com/MOULEESHWARAN-S31))
- **Repository**: [https://github.com/MOULEESHWARAN-S31/CareBridge_System](https://github.com/MOULEESHWARAN-S31/CareBridge_System)
- **License**: MIT License
