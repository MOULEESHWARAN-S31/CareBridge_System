# CareBridge System — Unified Public Healthcare Platform

[![Build & Integration Tests](https://img.shields.io/badge/Backend%20Tests-29%2F29%20Passing-brightgreen?style=flat-square)](https://github.com/MOULEESHWARAN-S31/CareBridge_System)
[![Flutter Tests](https://img.shields.io/badge/Flutter%20Tests-120%2F120%20Passing-brightgreen?style=flat-square)](https://github.com/MOULEESHWARAN-S31/CareBridge_System)
[![Flutter Analyze](https://img.shields.io/badge/Flutter%20Analyze-0%20Issues-brightgreen?style=flat-square)](https://github.com/MOULEESHWARAN-S31/CareBridge_System)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B%20%7C%20v24-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B%20%7C%2018-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Flutter](https://img.shields.io/badge/Flutter-3.x%20Web%20%26%20Mobile-02569B?style=flat-square&logo=flutter&logoColor=white)](https://flutter.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![ABDM / ABHA](https://img.shields.io/badge/ABDM%20%2F%20ABHA-Compliant-FF9933?style=flat-square)](https://abdm.gov.in/)

The **CareBridge System** is an enterprise-grade, integrated public digital health platform designed to unify state and district healthcare administration, hospital operations, and patient services under **ONE interconnected ecosystem**.

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 CAREBRIDGE SYSTEM ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘

   CareBridge Patient App        Common Login Portal        Admin Dashboard        Government Portal
        (Port 8080)                  (Port 3000)              (Port 5173)             (Port 5174)
   [Flutter Native & Web]       [HTML5 / CSS / Vanilla]     [Vanilla JS / CSS]       [React 19 Vite TS]
            │                            │                          │                         │
            │                            │                          │                         │
            └────────────────────────────┴─────────────┬────────────┴─────────────────────────┘
                                                       │
                                                       │ JSON REST API / Bearer JWT
                                                       ▼
                                     ┌────────────────────────────────────┐
                                     │     CareBridge Unified REST API    │
                                     │     Node.js + Express (Port 5000)  │
                                     │     RBAC Middleware & Auth Router  │
                                     └─────────────────┬──────────────────┘
                                                       │
                                                       │ node-postgres (pg) Connection Pool
                                                       ▼
                                     ┌────────────────────────────────────┐
                                     │       PostgreSQL Database          │
                                     │       carebridge_db (Port 5432)    │
                                     │       21 Normalized Relational     │
                                     │       Tables & Authoritative Seeds │
                                     └────────────────────────────────────┘
```

### Architectural Principles:
1. **Centralized Data Access**: No frontend communicates directly with PostgreSQL. Every database operation traverses the **Node.js Express REST API (`backend/`)**.
2. **Environment Isolation**: Database connection strings are supplied solely via `DATABASE_URL` in `.env` (never hard-coded).
3. **Strict Role-Based Access Control (RBAC)**: Enforced both on the backend (`requireRole`) and across frontend route guards.
4. **Resilient Offline Architecture**: Frontends feature seamless automatic fallbacks to localized datasets when disconnected.

---

## 2. Integrated Modules Overview

| Module | Directory | Port | Technology | Primary Role |
|---|---|---|---|---|
| **Common Login** | `Login/` | **3000** | HTML5, Vanilla JS, CSS3 | Single Entry Portal for staff and government officials; validates credentials against backend and redirects by role. |
| **Admin Dashboard** | `admin-dashboard/` | **5173** | HTML5, ES Modules, CSS3, SheetJS | Master healthcare administration, hospital accreditation, pharmacy registration, staff accounts, bulk Excel imports. |
| **Government Dashboard** | `Government-dashboard/` | **5174** | React 19, Vite, TypeScript, TailwindCSS | District & statewide monitoring, disease surveillance, outbreak cluster detection, AI prediction, emergency logistics. |
| **CareBridge Patient App** | `CARE_BRIDGE/` | **8080** | Flutter 3.x, Dart | Citizen mobile & web app: ABHA integration, OPD booking, health records (FHIR), teleconsultation, emergency SOS. |
| **Unified REST API** | `backend/` | **5000** | Node.js, Express, pg, bcrypt, JWT | Secure REST API handling authentication, CRUD operations, RBAC enforcement, transactional DB queries. |
| **Relational Database** | `database/` | **5432** | PostgreSQL 16+ / 18 | Central database (`carebridge_db`) housing 21 normalized relational tables and authoritative seed datasets. |

---

## 3. Key Capabilities per Module

### 🏥 CareBridge Patient App (`CARE_BRIDGE/`)
- **ABDM / ABHA Integration**: Complete mobile number lookup supporting individual, family, and new user ABHA registration workflows.
- **Doctor & Facility Discovery**: Real-time GPS distance sorting, taluk/district filters, and 24x7 emergency facility locator.
- **OPD Queue & Token Tracking**: Digital OPD appointment scheduling, live wait time estimation, and downloadable passes.
- **Health Records (PHR / FHIR)**: Secure storage of diagnostic reports, prescriptions, vaccination records, and doctor notes.
- **Prescription Medicine Ordering**: 1-click pharmacy order submission from digital prescriptions.
- **Multilingual Support**: Real-time localization in **English**, **Tamil (தமிழ்)**, and **Hindi (हिंदी)**.

### 🔐 Common Login Portal (`Login/`)
- **Zero-Bypass Security**: Connects directly to `POST http://localhost:5000/api/auth/login`. Mock login bypasses have been removed.
- **Smart Role-Based Redirection**:
  - `ADMIN` $\rightarrow$ Redirects to Admin Dashboard (`http://localhost:5173`) with secure session handoff.
  - `GOVERNMENT` $\rightarrow$ Redirects to Government Dashboard (`http://localhost:5174/dashboard`).
  - `DOCTOR` / `MEDICAL_STORE` $\rightarrow$ Authenticates and displays appropriate portal routing.
- **Evaluation Autofill**: One-click demo credential pills for fast evaluator testing.

### ⚙️ Master Admin Dashboard (`admin-dashboard/`)
- **Healthcare Facility Accreditation**: Add, verify, and monitor government and private hospitals, primary health centers (PHCs), and community health centers (CHCs).
- **Medical Store & Pharmacy Management**: License verification, pharmacy directory, and medicine stock levels.
- **User Account Management**: Admin-only creation of government officers, doctors, and pharmacy managers with bcrypt password hashing.
- **Bulk Import Engine**: SheetJS/XLSX workbook bulk ingestion for hospitals, pharmacies, doctors, and inventory.
- **Full Audit Logging**: Tracks administrative actions with timestamps, IP tracking, and change descriptions.

### 🏛️ Government Public Health Dashboard (`Government-dashboard/`)
- **District Healthcare Index**: Salem, Chennai, Coimbatore, Madurai, Tiruchirappalli health metrics.
- **Epidemic & Disease Surveillance**: Real-time tracking of Dengue, Typhoid, Malaria, and Influenza clusters with alert resolution workflows.
- **AI Epidemic Prediction Engine**: Predictive risk modeling calculating 7-day projected case trajectories and confidence intervals.
- **Hospital Bed & ICU Matrix**: Live tracking of general, ICU, pediatric, and ventilator bed occupancy across all state facilities.
- **Strict Role Enforcement**: Exclusively accessible by the `GOVERNMENT` role; blocks unauthorized roles with audit logging.

---

## 4. Default Credentials & Role Matrix

| Portal | Role | Username / Identifier | Password | Access URL |
|---|---|---|---|---|
| **Common Login** | Entrypoint | *(Any valid user)* | *(User password)* | [http://localhost:3000](http://localhost:3000) |
| **Admin Dashboard** | `ADMIN` | `admin@carebridge.local` *(or `admin`)* | `Admin@123` *(or `moulee2077`)* | [http://localhost:5173](http://localhost:5173) |
| **Government Dashboard** | `GOVERNMENT` | `government@carebridge.local` *(or `gov_salem`)* | `Gov@123` | [http://localhost:5174/dashboard](http://localhost:5174/dashboard) |
| **Doctor Portal** | `DOCTOR` | `dr.sundararajan@carebridge.local` | `Doctor@123` | Backend `/api/doctors` |
| **Medical Store** | `MEDICAL_STORE` | `pharmacy.salem@carebridge.local` | `Store@123` | Backend `/api/medical-stores` |

### ABHA Mobile Verification Test Scenarios

The central database includes pre-seeded ABHA profiles covering all mandatory ABDM compliance test cases:

| Mobile Number | Profiles Found | Test Scenario Description |
|---|---|---|
| `9876500000` | **0 Profiles** | Unregistered user $\rightarrow$ Triggers New ABHA Registration Flow |
| `9876500001` | **1 Profile** | Single Individual profile (Ramesh Kumar - ABHA: `12-3456-7890-1234`) |
| `9876500002` | **2 Profiles** | Family Unit: Self + Spouse |
| `9876500003` | **3 Profiles** | Nuclear Family: Self + Spouse + Child |
| `9876500004` | **4 Profiles** | Joint Family: Parents, Self, Spouse, Child |
| `9876543210` | **2 Profiles** | General Demonstration Profile |

---

## 5. Prerequisites & System Requirements

- **Node.js**: v18.0.0 or higher (v20+ / v24 recommended)
- **PostgreSQL**: v16.0 or higher (PostgreSQL 18 tested)
- **Flutter SDK**: v3.19.0 or higher (with Dart SDK 3.3+)
- **Google Chrome**: For running Flutter Web and interacting with web dashboards
- **Git**: For version control

---

## 6. Installation & Quick Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/MOULEESHWARAN-S31/CareBridge_System.git
cd CareBridge_System
```

### Step 2: Configure Environment Variables
Copy [.env.example](file:///d:/CAREBRIDGE_SYSTEM/.env.example) to `.env` in the root directory:
```bash
cp .env.example .env
```
Ensure `.env` matches your local PostgreSQL credentials:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/carebridge_db
JWT_SECRET=carebridge_production_jwt_super_secret_key_2026
JWT_EXPIRES_IN=24h
CORS_ORIGIN=*
```

### Step 3: Install Dependencies
Run the installation across modules:
```bash
npm install
npm --prefix backend install
npm --prefix admin-dashboard install
npm --prefix Government-dashboard install
cd CARE_BRIDGE && flutter pub get && cd ..
```

### Step 4: Initialize & Seed PostgreSQL Database
Run the automated database setup script to create `carebridge_db`, apply the 21-table schema, and populate seed records:
```bash
npm --prefix backend run db:setup
```

---

## 7. Running the Applications

### Option A: Launch All Web Services with ONE Command (Recommended)
From the repository root:
```bash
npm start
# or
npm run dev
```

This starts all services concurrently with color-coded terminal logs:
- **`[BACKEND]`** running on [http://localhost:5000](http://localhost:5000)
- **`[LOGIN]`** running on [http://localhost:3000](http://localhost:3000)
- **`[ADMIN]`** running on [http://localhost:5173](http://localhost:5173)
- **`[GOVERNMENT]`** running on [http://localhost:5174](http://localhost:5174)

### Option B: Launch the CareBridge Flutter Patient App
In a separate terminal:
```bash
npm run dev:carebridge
# Or directly:
cd CARE_BRIDGE
flutter run -d chrome --web-port=8080
```
Open [http://localhost:8080](http://localhost:8080) to test the Patient App.

### Option C: Running Individual Modules Independently
| Command | Action |
|---|---|
| `npm run dev:backend` | Starts only the Node.js REST API on `:5000` with hot reload (`--watch`) |
| `npm run dev:login` | Starts the Common Login server on `:3000` |
| `npm run dev:admin` | Starts the Admin Dashboard server on `:5173` |
| `npm run dev:gov` | Starts the Government Dashboard Vite dev server on `:5174` |
| `npm run dev:carebridge` | Launches the Flutter Patient Web App on `:8080` |

---

## 8. Verification & Test Suites

The CareBridge System includes comprehensive test suites across both the Node.js backend and the Flutter client.

### 1. Backend Automated Integration Tests (29/29 Passed)
```bash
npm --prefix backend test
# or from root:
npm run test:backend
```
**Test Coverage Includes**:
- Health check endpoint verification (`GET /health` $\rightarrow$ 200 OK)
- Authentication negative tests (bad password, missing body)
- Role-based access control (Government blocked from admin users table with 403 Forbidden)
- Admin user operations (`GET /api/users` $\rightarrow$ 200 OK)
- All 6 Mandatory ABHA test phone numbers verification
- Hospital creation, distance calculation, and public discovery
- Doctor appointment booking and ID generation
- Medical store creation and prescription medicine ordering

### 2. Flutter Patient App Automated Tests (120/120 Passed)
```bash
npm --prefix CARE_BRIDGE test
# or from root:
npm run test:carebridge
```
**Test Coverage Includes**:
- ABHA verification, phone lookup, profile selection, and connection flow
- Onboarding, OTP verification, and patient profile setup
- Home dashboard personalization and responsive quick actions
- Health records filtering, category cards, and FHIR clinical reports
- Appointment booking flow with doctor and time slot selection
- Accessibility text scaling (1.0x, 1.3x, 1.6x) overflow checks
- Multilingual rendering in English, Tamil, and Hindi

### 3. Flutter Code Quality Analysis (0 Issues)
```bash
cd CARE_BRIDGE
flutter analyze
```
Result: **`No issues found!`**

---

## 9. Project Directory Structure

```
CareBridge_System/
├── .env.example                         # Environment variable configuration template
├── package.json                         # Root multi-module orchestration scripts
├── README.md                            # Complete system documentation
│
├── scripts/                             # Server launchers and orchestrators
│   ├── start-all.js                     # Unified 4-service orchestrator
│   ├── serve-login.js                   # Common Login static server (Port 3000)
│   └── serve-admin.js                   # Admin Dashboard static server (Port 5173)
│
├── database/                            # Central Database Schemas & Seeds
│   ├── schema.sql                       # 21 relational tables DDL
│   └── seed.sql                         # Authoritative seed dataset & ABHA profiles
│
├── backend/                             # CareBridge REST API (Port 5000)
│   ├── package.json                     # Express, pg, bcrypt, jsonwebtoken
│   ├── scripts/
│   │   └── setupDatabase.js             # Automated DB migration and verification
│   ├── src/
│   │   ├── app.js                       # Express app configuration & CORS
│   │   ├── server.js                    # Server startup & DB connection check
│   │   ├── config/db.js                 # PostgreSQL pg connection pool
│   │   ├── middleware/                  # JWT auth and requireRole middleware
│   │   ├── routes/api.js                # Consolidated REST routes
│   │   └── controllers/                 # Controllers (auth, abha, hospital, user, etc.)
│   └── test/
│       └── backend.test.js              # 29 end-to-end integration tests
│
├── Login/                               # Common Login Portal (Port 3000)
│   ├── index.html                       # Responsive login portal
│   ├── css/design-system.css            # Standardized government healthcare tokens
│   └── js/                              # Form validation, auth, and role redirection
│
├── admin-dashboard/                     # Master Admin Dashboard (Port 5173)
│   ├── index.html                       # Admin portal SPA
│   ├── css/admin.css                    # Admin UI stylesheets
│   ├── js/
│   │   ├── app.js                       # Cross-port auth ingestion & routing
│   │   ├── store/adminStore.js          # Reactive store with PostgreSQL sync
│   │   └── components/admin/            # Facility, user, store, audit components
│   └── package.json                     # Admin launcher scripts
│
├── Government-dashboard/                # Government Health Portal (Port 5174)
│   ├── src/
│   │   ├── context/HealthDataContext.tsx# Strict GOVERNMENT role guard & live data
│   │   ├── layouts/DashboardLayout.tsx  # Navigation, alert ticker, language selector
│   │   └── pages/                       # Overview, Surveillance, Beds, AI Prediction
│   ├── vite.config.ts                   # Vite configuration (Port 5174)
│   └── package.json                     # React 19, Lucide, Recharts
│
└── CARE_BRIDGE/                         # CareBridge Patient App (Port 8080)
    ├── pubspec.yaml                     # Dependencies (http, provider, intl, etc.)
    ├── lib/
    │   ├── main.dart                    # Application entry point & theme
    │   ├── core/services/api_service.dart# Adaptive REST client (Web & Mobile)
    │   └── features/                    # abha, appointments, records, home, etc.
    └── test/                            # 120 unit, widget, and golden test suites
```

---

## 10. Security & Regulatory Compliance

- **Authentication**: Industry-standard **JSON Web Tokens (JWT)** with configurable expiration (`24h`).
- **Password Protection**: Passwords encrypted with **bcryptjs** using 10 salt rounds.
- **Role Isolation**: Strict server-side RBAC middleware prevents unauthorized privilege escalation between patients, hospital admins, and government officers.
- **Patient Privacy Protection**: Government surveillance views display **cryptographically masked patient identifiers** to prevent unauthorized exposure of Protected Health Information (PHI).
- **SQL Injection Prevention**: 100% of database queries use parameterized SQL statements through `pg` prepared statements.

---

## 11. Authors & Acknowledgements

Developed as part of the **CareBridge System Initiative** to advance public healthcare interoperability, rapid emergency response, and Ayushman Bharat Digital Mission (ABDM) integration.

- **Repository**: [https://github.com/MOULEESHWARAN-S31/CareBridge_System](https://github.com/MOULEESHWARAN-S31/CareBridge_System)
- **Maintainer**: MOULEESHWARAN S ([@MOULEESHWARAN-S31](https://github.com/MOULEESHWARAN-S31))
- **License**: MIT License
