# CareBridge Hospital Management System (HMS)

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Recharts](https://img.shields.io/badge/Recharts-2.x-22B5BF?style=flat-square)](https://recharts.org/)
[![Hospital Tests](https://img.shields.io/badge/Hospital%20Tests-107%2F107%20Passing-brightgreen?style=flat-square)](https://github.com/MOULEESHWARAN-S31/CareBridge_System)

The **CareBridge Hospital Management System** is a comprehensive, enterprise-grade clinical and hospital operations platform. Configured canonically for **Government District Hospital — Salem (`GDH-SALEM-01`)**, Tamil Nadu, it supports 10 distinct operational healthcare staff roles, enabling end-to-end patient care from admission and triage to diagnosis, pharmacy dispensing, and discharge.

---

## 1. System Architecture & Workspaces

The Hospital Dashboard operates on **Port 5175** (with fallback to 5173 when configured) and connects directly to the CareBridge Express Backend on Port 5000 and PostgreSQL `carebridge_db`:

```
                               ┌────────────────────────────────────────────────────────┐
                               │           CareBridge Hospital Dashboard                │
                               │               http://localhost:5175                    │
                               └──────────────────────────┬─────────────────────────────┘
                                                          │
                                         Server-Authoritative JWT Role Router
                                                          │
         ┌───────────────┬───────────────┬────────────────┼───────────────┬───────────────┬───────────────┐
         ▼               ▼               ▼                ▼               ▼               ▼               ▼
   ┌───────────┐   ┌───────────┐   ┌───────────┐    ┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐
   │  DOCTOR   │   │   NURSE   │   │RECEPTION  │    │ PHARMACY  │   │LAB TECH   │   │  BILLING  │   │ EMERGENCY │
   │ Dashboard │   │ Dashboard │   │ Dashboard │    │ Dashboard │   │ Dashboard │   │ Dashboard │   │ Dashboard │
   └─────┬─────┘   └─────┬─────┘   └─────┬─────┘    └─────┬─────┘   └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
         │               │               │                │               │               │               │
         └───────────────┴───────────────┴────────┬───────┴───────────────┴───────────────┴───────────────┘
                                                  │
                                   ┌──────────────┴──────────────┐
                                   ▼                             ▼
                            ┌──────────────┐              ┌──────────────┐
                            │HOSPITAL ADMIN│              │RECORDS / HR  │
                            │  Dashboard   │              │  Dashboard   │
                            └──────────────┘              └──────────────┘
                                                  │
                                                  ▼
                               ┌────────────────────────────────────┐
                               │       Node.js REST API (:5000)     │
                               │      /api/hospital/* Endpoints     │
                               └──────────────────┬─────────────────┘
                                                  ▼
                               ┌────────────────────────────────────┐
                               │    PostgreSQL (`carebridge_db`)    │
                               │    Hospital ID: 'GDH-SALEM-01'     │
                               └────────────────────────────────────┘
```

---

## 2. Supported Roles & Operational Workspaces

| Role Key | Primary Interface Route | Description & Responsibilities |
|---|---|---|
| `HOSPITAL_ADMIN` | `/admin/dashboard` | Executive hospital oversight: real-time bed occupancy, department load, doctor rosters, and operational KPIs. |
| `DOCTOR` | `/doctor/dashboard` | OPD consultation queue, electronic health records review, clinical diagnosis entry, and digital prescription issuance. |
| `NURSE` | `/nurse/dashboard` | Inpatient ward management, patient vital signs logging, medication administration records, and bed management. |
| `RECEPTIONIST` | `/receptionist/dashboard` | Front-desk patient intake, ABHA lookup and registration, OPD token dispatch, and doctor appointment scheduling. |
| `LAB_STAFF` | `/lab/dashboard` | Diagnostic laboratory orders, biological specimen collection tracking, test result upload, and abnormal result flagging. |
| `PHARMACIST` | `/pharmacy/dashboard` | Digital prescription dispensing, hospital medicine inventory tracking, stock batch expiration, and reorder alerts. |
| `BILLING_STAFF` | `/billing/dashboard` | Government scheme processing (PM-JAY, CMCHIS), inpatient/outpatient invoicing, payments, and discharge billing. |
| `RECORDS_STAFF` | `/records/dashboard` | Medical Records Department (MRD): digital archive, ICD-10 medical coding, and patient history retrieval. |
| `EMERGENCY_STAFF`| `/emergency/dashboard` | Triage scoring (Red / Yellow / Green), trauma bay allocation, ambulance dispatch coordination, and rapid admission. |
| `HR_MANAGER` | `/hr/dashboard` | Medical staff scheduling, duty rosters, attendance monitoring, and department personnel distribution. |

---

## 3. Real Backend API Integration

The application synchronizes with PostgreSQL via dedicated REST endpoints:
- `GET /api/hospital/overview?hospitalId=GDH-SALEM-01`: Aggregated hospital metrics (total beds, occupancy rate, doctors on duty, active OPD count).
- `GET /api/hospital/beds?hospitalId=GDH-SALEM-01`: Live ward-by-ward bed availability (General, ICU, Pediatric, Emergency, Post-Operative).
- `GET /api/hospital/patients/search?q=...`: Real-time patient lookup across ABHA number, OP ticket, phone, or name.
- `GET & PUT /api/hospital/medicines`: Hospital pharmacy inventory query and stock updates.
- `GET & PUT /api/hospital/diagnostics`: Hospital laboratory and imaging diagnostic services availability.
- `GET & PUT /api/hospital/camp-assignments`: Hospital staff and medical team assignments to community health outreach camps.

---

## 4. Default Credentials & Role Accounts

All 10 hospital accounts are pre-seeded in the database and linked to `GDH-SALEM-01`:

| Role | Email | Password | Employee ID |
|---|---|---|---|
| **Hospital Admin** | `hospital.admin@carebridge.local` | `Admin@123` | `CB-ADM-001` |
| **Doctor** | `doctor@carebridge.local` | `Doctor@123` | `CB-DOC-001` |
| **Nurse** | `nurse@carebridge.local` | `Nurse@123` | `CB-NUR-001` |
| **Receptionist** | `receptionist@carebridge.local` *(or `reception@`)* | `Reception@123` | `CB-REC-001` |
| **Laboratory Staff** | `lab@carebridge.local` | `Lab@123` | `CB-LAB-001` |
| **Pharmacist** | `pharmacist@carebridge.local` *(or `pharmacy@`)* | `Pharmacy@123` | `CB-PHM-001` |
| **Billing Staff** | `billing@carebridge.local` | `Bill@123` | `CB-BIL-001` |
| **Records Staff** | `records@carebridge.local` | `Record@123` | `CB-REC-002` |
| **Emergency Staff** | `emergency@carebridge.local` | `Emerg@123` | `CB-EMG-001` |
| **HR Manager** | `hr@carebridge.local` | `Hr@123` | `CB-HR-001` |

---

## 5. Security & Authentication Flow

1. **Common Login Handshake**:
   - Users authenticate at `http://localhost:3000`.
   - The portal issues a signed JWT and redirects to `http://localhost:5175/<role>/dashboard?token=<JWT>`.
   - The Hospital Dashboard ingests the token, saves it securely in `localStorage` / `sessionStorage`, and immediately removes sensitive query params from browser history using `window.history.replaceState()`.

2. **Cross-Role Gating & Protection**:
   - Strict client-side route guards block non-hospital roles (e.g. `GOVERNMENT` or `ADMIN`) from accessing clinical workflows with an automatic redirect or access denial.
   - Unauthorized attempts across roles (e.g., Receptionist attempting to write Doctor clinical notes) are rejected both in the UI and at the backend API layer with HTTP 403.

---

## 6. Testing & Quality Assurance

The dashboard is verified by a 107-test automated verification runner:
```bash
node scripts/run_all_tests.js
```

### Test Suite Breakdown:
- **Suite 1: Static RBAC & Route Guard Verification** (47/47 passed)
  - Validates role definitions, component mappings, and route accessibility across all 10 roles.
- **Suite 2: Live Backend Server Auth & JWT Verification** (60/60 passed)
  - Programmatically executes live server logins against `http://localhost:5000/api/auth/login` for all 10 roles.
  - Verifies cryptographic JWT signatures, role claims, and `hospitalId = 'GDH-SALEM-01'` binding.

**Total Status: 107/107 PASSED (0 failures)**

---

## 7. Setup & Run

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
# Vite runs on http://localhost:5175
```

### Production Build
```bash
npm run build
# Generates minified production bundle in dist/
```
