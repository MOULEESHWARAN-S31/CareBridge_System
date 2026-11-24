# CareBridge
### Bridging People to Better Healthcare

[![Backend Tests](https://img.shields.io/badge/Backend%20Tests-101%2F101%20Passing-brightgreen?style=flat-square)](https://github.com/MOULEESHWARAN-S31/CareBridge_System)
[![Flutter Tests](https://img.shields.io/badge/Flutter%20Tests-131%2F131%20Passing-brightgreen?style=flat-square)](https://github.com/MOULEESHWARAN-S31/CareBridge_System)
[![Flutter Analyze](https://img.shields.io/badge/Flutter%20Analyze-0%20Issues-brightgreen?style=flat-square)](https://github.com/MOULEESHWARAN-S31/CareBridge_System)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B%20%7C%20v20%20%7C%20v24-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B%20%7C%2018-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Flutter](https://img.shields.io/badge/Flutter-3.x%20Web%20%26%20Mobile-02569B?style=flat-square&logo=flutter&logoColor=white)](https://flutter.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![ABDM / ABHA](https://img.shields.io/badge/ABDM%20%2F%20ABHA-Compliant-FF9933?style=flat-square)](https://abdm.gov.in/)

**CareBridge** is an enterprise-grade, integrated public digital health platform designed to connect citizens, healthcare facilities, hospital staff, and government health authorities into a unified digital healthcare ecosystem. Powered by a centralized Node.js/Express backend, an authoritative PostgreSQL database, and an interactive multilingual healthcare assistant, CareBridge bridges systemic gaps across primary, secondary, and tertiary public healthcare delivery.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Proposed Solution](#proposed-solution)
- [System Architecture](#system-architecture)
- [Applications Overview](#applications-overview)
  - [1. Patient Mobile Application](#1-patient-mobile-application)
  - [2. Master Administration Dashboard](#2-master-administration-dashboard)
  - [3. Hospital Management Dashboard](#3-hospital-management-dashboard)
  - [4. Government Health Dashboard](#4-government-health-dashboard)
  - [5. Common Unified Login Portal](#5-common-unified-login-portal)
- [LLM-Powered Healthcare Assistant](#llm-powered-healthcare-assistant)
- [Technology Stack](#technology-stack)
- [Authentication and Security](#authentication-and-security)
- [Database Architecture](#database-architecture)
- [Project Directory Structure](#project-directory-structure)
- [Installation and Setup](#installation-and-setup)
- [Application URLs](#application-urls)
- [Testing and Validation](#testing-and-validation)
- [Future Enhancements](#future-enhancements)
- [Contribution and License](#contribution-and-license)
- [Acknowledgements](#acknowledgements)

---

## Problem Statement

Public healthcare systems across developing regions face acute logistical and operational challenges:

1. **Rural Healthcare Inaccessibility:** Citizens in remote villages and taluks often travel long distances without prior knowledge of doctor availability, bed capacity, or facility status.
2. **Fragmented Patient Records:** Medical history, diagnostic reports, and prescriptions remain stored on loose paper documents, causing lost clinical context during inter-facility referrals.
3. **Severe OPD Congestion:** Unmanaged walk-in patient volumes lead to hours of waiting in crowded outpatient queues, increasing stress on healthcare personnel.
4. **Supply Chain Blindspots:** Stockouts of essential drugs, diagnostic reagent shortages, and blood reserve imbalances are often identified reactively rather than preemptively.
5. **Linguistic and Digital Barriers:** India's linguistic diversity creates communication gaps when clinical applications fail to provide native language access for non-English-speaking citizens.
6. **Administrative Disconnect:** District and state health officials lack unified, real-time data feeds connecting primary health centers (PHCs), community health centers (CHCs), and district headquarter hospitals.

---

## Proposed Solution

CareBridge addresses these challenges by consolidating healthcare delivery into **five dedicated, interconnected applications** backed by a shared source of truth:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             CAREBRIDGE CONNECTED ECOSYSTEM                       │
└──────────────────────────────────────────────────────────────────────────────────┘

     Citizen Tier                Operational Hospital Tier             Governance Tier
 ┌───────────────────┐        ┌────────────────────────────┐        ┌───────────────────┐
 │ CareBridge Mobile │        │     Hospital Dashboard     │        │    Government     │
 │  (Flutter / Dart) │        │ (10 Clinical Staff Roles)  │        │ Health Dashboard  │
 └─────────┬─────────┘        └──────────────┬─────────────┘        └─────────┬─────────┘
           │                                 │                                │
           │                                 │                                │
           └──────────────────┬──────────────┴──────────────┬─────────────────┘
                              │                             │
                              ▼                             ▼
                 ┌─────────────────────────┐   ┌─────────────────────────┐
                 │   Common Login Portal   │   │ Master Admin Dashboard  │
                 │    Single Sign-On       │   │ Network Master Registry │
                 └────────────┬────────────┘   └────────────┬────────────┘
                              │                             │
                              └──────────────┬──────────────┘
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │     Express REST API      │
                               │  (Port 5000 / Node.js)    │
                               └─────────────┬─────────────┘
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │    PostgreSQL Database    │
                               │      (carebridge_db)      │
                               └───────────────────────────┘
```

### Feature Implementation Status Matrix

| Component | Implemented & Verified | Planned / In Development |
|---|---|---|
| **Patient App** | ABDM/ABHA phone lookup, family profile linking, OPD token booking, live wait tracking, PHR/FHIR records, emergency SOS with GPS, 23-language localization engine. | Biometric ABHA KYC, push notifications via FCM, teleconsultation video streaming. |
| **Common Login** | Server-authoritative JWT issuance, bcrypt verification, role-based redirection, instant URL token sanitization, evaluator demo pills. | Multi-factor SMS OTP authentication for staff. |
| **Admin Dashboard** | Facility accreditation, pharmacy registry, user provisioning, role assignments, SheetJS bulk Excel ingestion, immutable audit trail. | Automated facility geo-fencing and polygon boundary mapper. |
| **Hospital Dashboard** | 10 specialized staff role workspaces, bed occupancy matrix, live patient lookup, prescription dispensing, diagnostic status, camp assignments. | Real-time HL7/FHIR hospital PACS imaging integration. |
| **Government Portal** | State Admin (`STATE_ADMIN`) S01–S11 oversight, District Admin (`DISTRICT_ADMIN`) D01–D14 operations, geographic data isolation, live camp proposals. | Automated epidemiological forecasting pipelines. |
| **Health Assistant** | Multilingual intent-based triage prototype, 108 emergency detector, clinical disclaimers, offline rule fallback across 23 languages. | Self-hosted open-weights LLM inference (Qwen-2.5 / BioMistral) via secure backend proxy. |

---

## System Architecture

All user-facing applications communicate through authenticated, stateless REST APIs served by the central Node.js/Express service. The database layer (`carebridge_db`) remains strictly isolated behind the API.

```mermaid
flowchart TD
    subgraph Clients["CareBridge Client Applications"]
        FlutterApp["CareBridge Patient App<br/>(Flutter / Mobile & Port 8080)"]
        CommonLogin["Common Login Portal<br/>(Vanilla JS / Port 3000)"]
        AdminDash["Master Admin Dashboard<br/>(Vanilla JS / Port 5173)"]
        GovDash["Government Dashboard<br/>(React 19 TS / Port 5174)"]
        HospDash["Hospital Dashboard<br/>(React 19 JS / Port 5175)"]
    end

    subgraph Gateway["Authentication & REST Gateway"]
        AuthRouter["POST /api/auth/login<br/>(JWT Token Issuer)"]
        RestAPI["Express REST API & Middleware<br/>(Node.js / Port 5000)<br/>• authenticateToken<br/>• requireRole<br/>• requireGovernmentScope"]
    end

    subgraph Intelligence["Healthcare Assistance & NLP Tier"]
        AssistantSvc["Multilingual Assistant Service<br/>(Triage Engine & Intent Classifier)"]
        PlannedLLM["Open-Weights Medical LLM<br/>(Qwen-2.5-7B / HF Endpoint)<br/>[Planned In-Development Phase]"]
    end

    subgraph DataLayer["Authoritative Data Layer"]
        PostgresDB[("PostgreSQL Database<br/>carebridge_db : 5432<br/>24 Relational Tables")]
    end

    %% Client authentication flows
    CommonLogin -->|Credentials Check| AuthRouter
    AuthRouter -->|Signed Bearer JWT| CommonLogin
    CommonLogin -.->|Token Handoff| AdminDash
    CommonLogin -.->|Token Handoff| GovDash
    CommonLogin -.->|Token Handoff| HospDash

    %% API access flows
    FlutterApp -->|Bearer JWT / REST| RestAPI
    AdminDash -->|Bearer JWT / REST| RestAPI
    GovDash -->|Bearer JWT / REST| RestAPI
    HospDash -->|Bearer JWT / REST| RestAPI

    %% Assistant flow
    FlutterApp -->|POST /api/assistant/chat| RestAPI
    RestAPI --> AssistantSvc
    AssistantSvc -.-> PlannedLLM

    %% Database persistence
    RestAPI -->|Parameterized SQL Pool Queries| PostgresDB
```

---

## Applications Overview

### 1. Patient Mobile Application (`CARE_BRIDGE/`)

The citizen mobile application is developed in Flutter 3.x, optimized for low-bandwidth rural connectivity and universal digital inclusion.

- **ABDM / ABHA Digital Identity:** Supports instant phone number discovery of registered ABHA profiles, family account linking (Self, Spouse, Children, Parents), and new ABHA registration workflows.
- **Multilingual Engine (23 Languages):** Native language selection supporting Assamese, Bengali, Bodo, Dogri, English, Gujarati, Hindi, Kannada, Kashmiri, Konkani, Maithili, Malayalam, Manipuri, Marathi, Nepali, Odia, Punjabi, Sanskrit, Santali, Sindhi, Tamil, Telugu, and Urdu (with bidirectional RTL support).
- **OPD Appointment Booking:** Real-time facility search, department and specialist filtering, date/time slot reservation, and digital token generation.
- **Live Queue Tracking:** Real-time queue position display showing current token served, estimated consultation wait time, and room assignments.
- **Personal Health Records (PHR / FHIR):** Secure repository categorizing prescriptions, laboratory diagnostic reports, vaccination history, and discharge summaries.
- **Emergency SOS & Facility Locator:** One-touch emergency trigger alerting registered family contacts with GPS coordinates, alongside direct dialing to 108 Emergency Ambulance.
- **Offline Cache:** SQLite-backed local storage ensuring critical patient IDs, scheduled appointments, and emergency information remain accessible during network outages.

### 2. Master Administration Dashboard (`ADMIN_DASHBOARD/`)

The governance portal for health department super administrators on Port 5173.

- **Healthcare Facility Accreditation:** Onboard, verify, configure bed capacities, and update coordinates for Government Hospitals, CHCs, and PHCs.
- **Medical Store & Pharmacy Registry:** Licensing verification, operating schedules, and inventory tracking for Jan Aushadhi Kendras and retail pharmacies.
- **User Account Management:** Provision and manage user accounts with role-based access for Government Officers, Doctors, and Hospital Staff.
- **SheetJS Bulk Ingestion Engine:** Automated spreadsheet parser (`.xlsx`, `.xls`, `.csv`) for bulk onboarding of facilities, doctors, and essential medicine catalogues.
- **Master Audit Trail:** Immutable log of system-wide administrative actions, capturing user identifiers, IP addresses, and exact change descriptions.

### 3. Hospital Management Dashboard (`HOSPITAL_DASHBOARD/`)

Configured for **Government District Hospital — Salem (`GDH-SALEM-01`)**, supporting 10 distinct staff roles on Port 5175:

| Role Identifier | Role Title | Implemented Responsibilities |
|---|---|---|
| `HOSPITAL_ADMIN` | Hospital Administrator | Overall facility occupancy oversight, doctor shift rosters, emergency department load, and hospital KPIs. |
| `DOCTOR` | Medical Officer / Specialist | OPD consultation queue, electronic medical record reviews, clinical diagnosis notes, and e-prescriptions. |
| `NURSE` | Inpatient Care Nurse | Inpatient ward bed management, patient vital signs recording, and medication administration logging. |
| `RECEPTIONIST` | Front Desk Receptionist | Walk-in patient intake, ABHA verification, token generation, and clinic queue dispatch. |
| `LAB_STAFF` | Laboratory Technician | Diagnostic order processing, biological sample intake tracking, and diagnostic test result entry. |
| `PHARMACIST` | Hospital Pharmacist | Digital e-prescription dispensing, inventory batch tracking, drug expiration monitoring, and reorder alerts. |
| `BILLING_STAFF` | Billing & Claims Officer | Government health scheme verification (PM-JAY / CMCHIS), outpatient/inpatient billing, and payment logging. |
| `RECORDS_STAFF` | Medical Records Officer | Medical Records Department (MRD) archival, ICD-10 clinical coding, and patient history retrieval. |
| `EMERGENCY_STAFF`| Casualty Triage Officer | Trauma bay intake, Emergency Severity Index (ESI) triage scoring, and ambulance reception coordination. |
| `HR_MANAGER` | Hospital HR Manager | Medical officer and nursing duty schedules, staff attendance records, and departmental personnel allocation. |

### 4. Government Health Dashboard (`GOVERNMENT_DASHBOARD/`)

A high-performance command center for public health governance on Port 5174, featuring two isolated administrative workspaces:

#### State Admin Workspace (`STATE_ADMIN`)
- **S01 — Statewide Command Center:** Executive KPIs on statewide healthcare access, total bed occupancy, and alert volumes.
- **S02 — District Comparison:** Comparative metrics and health indices across all 38 districts of Tamil Nadu.
- **S03 — Disease Surveillance:** Real-time tracking of communicable disease clusters (Dengue, Malaria, Typhoid, Influenza).
- **S04 — Facility Capacity:** Statewide bed availability, ICU bed reserves, and ventilator status.
- **S05 — Medicine & Supply Intelligence:** Automated shortage detection for essential life-saving drugs.
- **S06 — Blood Bank Network:** Blood group inventory tracking and inter-district transfer logistics.
- **S07 — Health Camp Oversight:** State-level monitoring of community medical outreach camps.
- **S08 — Resource Allocation:** Strategic directives for reallocating surplus medical supplies and staff to deficit zones.
- **S09 — District Escalations:** Review queue for district resource requests with actionable **Approve** and **Reject** controls.
- **S10 — State Announcements:** Broadcast of official public health advisories and notices.
- **S11 — Statutory Reports:** Automated compilation and export of state public health digests.

#### District Admin Workspace (`DISTRICT_ADMIN` — Salem District)
- **D01 — District Command Center:** Operational metrics specific to the assigned district jurisdiction.
- **D02 — District Facilities:** Monitoring of Salem District Hospital, taluk hospitals, and rural PHCs.
- **D03 — Village & Block Health:** Village-level health indicators, maternal mortality indices, and block performance.
- **D04 — Local Surveillance:** Active surveillance of localized outbreak clusters.
- **D05 — Camp Management:** Scheduling, venue coordination, and medical team rostering for health camps.
- **D06 — Community Requests:** Review of citizen-submitted health camp requests with **Approve** and **Reject** workflows.
- **D07 — Medicine & Diagnostics:** Local facility stockout monitoring and reorder tracking.
- **D08 — Blood Bank Monitoring:** Real-time stock status across district blood banks.
- **D09 — OPD & Queue Load:** Real-time consultation queue monitoring across district OPD departments.
- **D10 — Patient Referrals:** Inbound and outbound patient referral tracking between primary and secondary centers.
- **D11 — High-Risk Follow-Ups:** Dedicated monitoring of high-risk maternal cases and chronic diseases.
- **D12 — Public Notices:** Issuance of localized health warnings, vector control advisories, and clinic schedules.
- **D13 — District Audit Logs:** Immutable audit history of district-level administrative actions.
- **D14 — Diagnostic Uptime:** Operational uptime tracking of diagnostic equipment (X-Ray, Ultrasound, CT scanners).

**Geographic Data Isolation:** District Administrators are strictly restricted to their assigned jurisdiction (`Salem`). The backend enforces district boundaries at the SQL query level; cross-district data modification requests return **HTTP 403 Forbidden**.

### 5. Common Unified Login Portal (`LOGIN/`)

Hosted on Port 3000, this portal serves as the single authentication entry point for all staff and administrative accounts. It communicates directly with `POST /api/auth/login`, validates bcrypt-hashed credentials, issues a server-signed JWT, and redirects users to their appropriate dashboard while immediately purging credentials from the browser URL history via `window.history.replaceState()`.

---

## LLM-Powered Healthcare Assistant

### Current Status: Functional Prototype (In-Development Phase)

CareBridge includes an interactive healthcare assistant designed to make digital healthcare intuitive for rural and multilingual citizens. 

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   HEALTHCARE ASSISTANT ARCHITECTURE & SAFETY GATES                │
└──────────────────────────────────────────────────────────────────────────────────┘

   Patient Mobile UI
  (CareBridgeAssistantSheet)
          │
          │ 1. Natural Language Query + Language Code (e.g. 'ta', 'hi', 'en')
          ▼
   Backend REST Endpoint (/api/assistant/chat)
          │
          ├─────────────────────────┐
          │                         │
          ▼                         ▼
   Intent Classification    Clinical Safety Filter
   (detectIntent)           (Blocks Medical Prescriptions & Diagnosis)
          │                         │
          ▼                         ▼
   ┌───────────────────────────────────────────────────┐
   │ 1. Emergency Intent?   ──> Immediately returns    │
   │                            108 Ambulance Dispatch │
   │ 2. Appointment Booking?──> Returns Step-by-Step   │
   │                            Booking Guidance       │
   │ 3. ABHA Identity Query?──> Returns 14-Digit       │
   │                            Health ID Guidance     │
   │ 4. Symptom Inquiries?  ──> Returns General Care   │
   │                            Advice + Mandatory     │
   │                            PHC Doctor Referral    │
   └────────────────────────┬──────────────────────────┘
                            │
                            │ 2. Append Mandatory Clinical Disclaimer
                            ▼
                     Patient Response
```

### Verified Implementation in Codebase
- **Frontend Interface:** Implemented in `CARE_BRIDGE/lib/features/home/carebridge_assistant_sheet.dart`. Features dynamic greeting localization, quick-prompt chips, bidirectional chat bubbles, and an offline fallback response engine.
- **Backend Service:** Implemented in `backend/src/services/assistantService.js` and exposed via `POST /api/assistant/chat` in `translationController.js`.
- **Multilingual Support:** Fully mapped intent triggers and localized answers across 13 Indian languages (English, Tamil, Hindi, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Urdu, and Assamese).
- **Planned Cloud / Open-Weights LLM Integration:** The architecture is designed to integrate open-weights medical LLMs (specifically **Qwen-2.5-7B-Instruct** or **BioMistral-7B**) hosted on private inference endpoints. When fully deployed, the LLM will operate through the existing backend proxy, ensuring no external provider ever receives direct database credentials or unmasked patient health information.

### Healthcare Safety & Regulatory Guardrails
To prevent harm and ensure compliance with medical ethics, the assistant enforces strict clinical boundaries:
1. **Not a Replacement for Physicians:** The assistant explicitly includes a localized disclaimer on every clinical response:
   > *"Note: CareBridge Assistant provides general informational guidance only. It is not a clinical diagnosis or treatment prescription. In emergencies, call 108 immediately."*
2. **Zero Automated Prescriptions:** The assistant does not generate medication dosages, chemical drug prescriptions, or drug regimens.
3. **Emergency Priority Triage:** Any query containing keywords related to chest pain, severe breathlessness, trauma, or emergency instantly triggers an emergency alert instructing the patient to call **108**.
4. **Data Privacy (PHI Protection):** Identifiable patient medical records are never transmitted to third-party LLM providers. Queries are stateless and strictly anonymized.
5. **No Client-Side Secrets:** No LLM API tokens, model keys, or credentials exist in the client-side Flutter app.

---

## Technology Stack

| Layer | Technologies Confirmed in Repository |
|---|---|
| **Mobile & Patient App** | Flutter 3.x, Dart 3.3+, Provider, Shared Preferences, SQLite, Material 3 |
| **Web Dashboards** | React 19, TypeScript, JavaScript (ES6+ Modules), Vite 6.x, TailwindCSS 3.x, Recharts, Lucide Icons, SheetJS (XLSX) |
| **Backend API** | Node.js (v18+, v20, v24), Express.js 4.x, node-postgres (`pg`), JSON Web Tokens (`jsonwebtoken`), bcryptjs, CORS, Dotenv |
| **Database** | PostgreSQL (v16+, v18), Relational DDL Schema, ACID Transactions, Connection Pooling |
| **Security & Auth** | Cryptographic JWT (HMAC-SHA256), Role-Based Access Control (RBAC), Geographic Authorization Gating |
| **Tooling & Environments** | Git, GitHub, npm, Flutter CLI, Android SDK, VS Code, Google Chrome |

---

## Authentication and Security

1. **Centralized Authentication Gateway:**
   - Single entry point at `http://localhost:3000` (`LOGIN/`).
   - Verifies user email and bcrypt-hashed password against the `users` table.
   - Issues an HMAC-SHA256 signed JSON Web Token containing authoritative claims: `userId`, `role`, `hospitalId`, and `district`.

2. **Role-Based Access Control (RBAC):**
   - Backend middleware (`requireRole`) strictly validates JWT claims prior to controller execution.
   - 13 distinct platform roles: `ADMIN`, `STATE_ADMIN`, `DISTRICT_ADMIN`, `GOVERNMENT`, `HOSPITAL_ADMIN`, `DOCTOR`, `NURSE`, `RECEPTIONIST`, `LAB_STAFF`, `PHARMACIST`, `BILLING_STAFF`, `RECORDS_STAFF`, `EMERGENCY_STAFF`, `HR_MANAGER`.
   - Access attempts to unauthorized resources (e.g. Doctor attempting to access user provisioning) return **HTTP 403 Forbidden**.

3. **Geographic Scoping Middleware (`requireGovernmentScope`):**
   - Enforces regional jurisdiction on district administrators.
   - Requests targeting districts outside the administrator's assigned token scope are rejected at the database query boundary.

4. **URL Token Sanitization:**
   - Destination dashboards ingest authentication tokens upon cross-origin redirect and immediately scrub the token parameter from the browser address bar using `window.history.replaceState()`, preventing token leakage via browser history or shoulder-surfing.

5. **SQL Injection Defense:**
   - 100% of database operations use parameterized SQL queries through `pg` prepared statements.

---

## Database Architecture

The system utilizes PostgreSQL (`carebridge_db`) as its single source of truth across 24 relational tables:

```
carebridge_db (PostgreSQL 16+ / 18)
├── users                           # Healthcare personnel credentials, roles, and status
├── roles                           # System role definitions
├── permissions                     # Granular administrative permissions
├── role_permissions                # Role-to-permission mapping table
├── districts                       # Geographic district master records
├── taluks                          # Sub-district administrative divisions
├── hospitals                       # Healthcare facility registry (capacity, coordinates, type)
├── hospital_users                  # Staff facility assignment mapping
├── medical_stores                  # Registered pharmacies and Jan Aushadhi Kendras
├── medical_store_users             # Pharmacy personnel mapping
├── doctors                         # Clinical specialists, qualifications, and schedules
├── abha_profiles                   # Synthetic ABDM patient identity records
├── appointments                    # Outpatient consultations, tokens, and statuses
├── teleconsultations               # Virtual consultation bookings and links
├── prescriptions                   # Digital e-prescriptions and instructions
├── medicine_orders                 # Prescription fulfillment and pharmacy orders
├── health_records                  # PHR records (laboratory tests, notes, immunizations)
├── health_camps                    # Community medical outreach camp registry
├── health_alerts                   # Communicable disease alerts and advisories
├── referrals                       # Inter-facility patient referral tracking
├── notifications                   # Public health notices and broadcast bulletins
├── facility_medicines              # Hospital pharmacy stock levels and reorder thresholds
├── facility_diagnostics            # Diagnostic equipment status and operational uptime
├── camp_facility_assignments       # Hospital medical teams assigned to health camps
├── community_camp_requests         # Citizen-requested outreach camp proposals
├── government_camp_proposals       # Official government health camp schedules
├── government_resource_requests    # Inter-district resource escalations
├── government_medicine_requisitions# State medicine supply chain orders
├── government_announcements        # State-level public announcements
├── government_audit_events         # State and district governance audit trail
└── audit_logs                      # System-wide administrative modifications log
```

### Relational Integrity Highlights
- **Foreign Keys:** Appointments reference both `abha_profiles(abha_id)` and `hospitals(hospital_id)`.
- **Indexing:** High-performance B-Tree indexes on `abha_profiles(mobile_number)`, `hospitals(district)`, and `appointments(hospital_id, appointment_date)`.
- **Audit Logging:** Every status modification across camp proposals, resource escalations, and user accounts triggers an entry in `government_audit_events` or `audit_logs`.

---

## Project Directory Structure

```
D:\CAREBRIDGE_SYSTEM\
├── .env.example                         # Environment configuration template
├── package.json                         # Multi-service launcher scripts
├── README.md                            # Complete platform documentation
│
├── scripts/                             # Server launchers and orchestrators
│   ├── start-all.js                     # Concurrent 5-service runner
│   └── serve-login.js                   # Common Login static server (:3000)
│
├── database/                            # Database DDL schemas and seeds
│   ├── schema.sql                       # ABHA synthetic profile schema
│   └── seed.sql                         # Authoritative demonstration dataset
│
├── backend/                             # Express REST API (Port 5000)
│   ├── src/
│   │   ├── server.js                    # Server startup and health check
│   │   ├── app.js                       # Express configuration & CORS
│   │   ├── config/db.js                 # PostgreSQL connection pool
│   │   ├── middleware/                  # JWT auth, requireRole, governmentScope
│   │   ├── controllers/                 # Business logic controllers
│   │   ├── services/                    # Assistant service & translation service
│   │   └── routes/api.js                # Consolidated REST endpoints
│   ├── scripts/                         # Database initialization & role seeds
│   └── test/backend.test.js             # 101-test backend integration suite
│
├── LOGIN/                               # Common Login Portal (Port 3000)
│   ├── index.html                       # Responsive portal interface
│   ├── css/design-system.css            # Healthcare design tokens
│   └── js/                              # Form validation and role redirector
│
├── ADMIN_DASHBOARD/                     # Master Admin Dashboard (Port 5173)
│   ├── index.html                       # Admin single-page application
│   ├── css/admin.css                    # Admin UI styles
│   ├── js/                              # Facility, user, store, and audit modules
│   └── db/schema.sql                    # Admin and network master schema
│
├── GOVERNMENT_DASHBOARD/                # Government Health Portal (Port 5174)
│   ├── src/
│   │   ├── context/HealthDataContext.tsx# Role guard, state sync & live API client
│   │   ├── layouts/DashboardLayout.tsx  # Header, sidebar & workspace switcher
│   │   ├── pages/state/                 # S01-S11 State Admin workspace pages
│   │   ├── pages/district/              # D01-D14 District Admin workspace pages
│   │   └── pages/                       # Geographic, facility & surveillance views
│   ├── scripts/test_government_dashboard.js # 94-test verification runner
│   └── vite.config.ts                   # Vite configuration (Port 5174)
│
├── HOSPITAL_DASHBOARD/                  # Hospital Operations Portal (Port 5175)
│   ├── src/
│   │   ├── auth/accounts.js             # Canonical credentials for 10 hospital roles
│   │   ├── components/                  # 10 role dashboards & clinical workflows
│   │   └── services/                    # Live backend API connectors
│   ├── scripts/run_all_tests.js         # 107-test verification runner
│   └── vite.config.js                   # Vite configuration (Port 5175)
│
└── CARE_BRIDGE/                         # CareBridge Patient App (Mobile / Port 8080)
    ├── lib/
    │   ├── main.dart                    # App entry point & MultiProvider
    │   ├── core/                        # Localization (23 languages), API client, theme
    │   └── features/
    │       ├── abha/                    # ABHA lookup & registration screens
    │       ├── appointments/            # OPD facility search & slot booking
    │       ├── home/                    # Home screen, quick access & assistant sheet
    │       ├── health_records/          # PHR records & diagnostic reports
    │       └── profile/                 # Profile management & language switcher
    └── test/                            # 131 Flutter unit, widget & integration tests
```

---

## Installation and Setup

### Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ / v24 recommended)
- **PostgreSQL:** v16.0 or higher running on `localhost:5432`
- **Flutter SDK:** v3.19.0 or higher with Dart SDK 3.3+
- **Google Chrome / Microsoft Edge:** For running web dashboards
- **Git:** For source control

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/MOULEESHWARAN-S31/CareBridge_System.git
cd CareBridge_System
```

---

### Step 2: Configure Environment Variables
Copy the template [.env.example](file:///d:/CAREBRIDGE_SYSTEM/.env.example) to `.env`:
```bash
cp .env.example .env
cp .env.example backend/.env
```

Update `.env` with your local PostgreSQL credentials:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/carebridge_db
JWT_SECRET=YOUR_SECURE_RANDOM_JWT_SECRET_KEY_HERE
VITE_API_URL=http://localhost:5000/api
```

---

### Step 3: Install Dependencies
Run the installation across all modules:
```bash
npm install
npm --prefix backend install
npm --prefix ADMIN_DASHBOARD install
npm --prefix GOVERNMENT_DASHBOARD install
npm --prefix HOSPITAL_DASHBOARD install
cd CARE_BRIDGE && flutter pub get && cd ..
```

---

### Step 4: Initialize and Seed PostgreSQL Database
Execute the database setup and seeding scripts:
```bash
# 1. Create database and apply schemas + authoritative seeds
npm --prefix backend run db:setup

# 2. Synchronize canonical GDH-SALEM-01 hospital mapping
node backend/scripts/sync_canonical_facility.js

# 3. Seed verified credentials for all 10 Hospital roles
node backend/scripts/seed_hospital_roles.js
```

---

### Step 5: Launch the Applications

#### Option A: Unified Launcher (Recommended)
From the repository root, start all five web services concurrently:
```bash
npm start
# or: npm run dev:all
```
This launches:
- `[BACKEND]` on [http://localhost:5000](http://localhost:5000)
- `[LOGIN]` on [http://localhost:3000](http://localhost:3000)
- `[ADMIN]` on [http://localhost:5173](http://localhost:5173)
- `[GOVERNMENT]` on [http://localhost:5174](http://localhost:5174)
- `[HOSPITAL]` on [http://localhost:5175](http://localhost:5175)

#### Option B: Launch the Flutter Patient App
In a separate terminal:
```bash
# Web preview:
npm run dev:carebridge

# Or directly on Android device/emulator:
cd CARE_BRIDGE
flutter run -d android
```

---

## Application URLs

| Application | URL | Default Access Scope |
|---|---|---|
| **Common Login Portal** | [http://localhost:3000](http://localhost:3000) | Public Authentication Gateway |
| **Master Admin Dashboard** | [http://localhost:5173](http://localhost:5173) | Master Administrator (`ADMIN`) |
| **Government Dashboard** | [http://localhost:5174](http://localhost:5174) | State Admin & District Admin |
| **Hospital Dashboard** | [http://localhost:5175](http://localhost:5175) | 10 Hospital Clinical & Staff Roles |
| **Backend REST API** | [http://localhost:5000/api](http://localhost:5000/api) | Authenticated REST Endpoints |
| **Flutter Patient Web App**| [http://localhost:8080](http://localhost:8080) | Citizen Mobile & Web Experience |

---

## Testing and Validation

CareBridge maintains a strict, verified automated testing regime across all tiers:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             AUTOMATED TEST VERIFICATION                          │
└──────────────────────────────────────────────────────────────────────────────────┘

   Backend REST API           Hospital Dashboard         Government Dashboard      CareBridge Patient App
  101 / 101 Tests Passed    107 / 107 Tests Passed       94 / 94 Tests Passed      131 / 131 Tests Passed
   (Node.js / Express)      (47 Static + 60 Live Auth)  (5 Verification Suites)       (Flutter 3.x)
```

### 1. Backend REST API Tests (101/101 Passed)
```bash
npm --prefix backend test
```
- Validates health endpoints, negative authentication, and 403 role-based access denials.
- Verifies all 6 mandatory ABDM mobile number test cases.
- Validates token issuance and claims for all 10 hospital roles (`hospitalId = GDH-SALEM-01`).
- Validates multilingual translation endpoints and assistant intent detection in Tamil and Hindi.

### 2. Flutter Patient App Tests (131/131 Passed)
```bash
cd CARE_BRIDGE
flutter test
```
- Tests ABHA phone lookup, OTP verification, and profile selection flows.
- Validates 2-column responsive quick access card grid alignment across 320px–768px viewports.
- Verifies natural multiline text wrapping without ellipsis clipping.
- Validates accessibility text scaling at 1.0x, 1.3x, and 1.6x.
- Tests Tamil and Hindi rendering without overflow errors.

### 3. Flutter Static Code Analysis (0 Issues)
```bash
cd CARE_BRIDGE
flutter analyze
```
- **Result:** `No issues found!` Clean analysis.

### 4. Hospital Dashboard Tests (107/107 Passed)
```bash
cd HOSPITAL_DASHBOARD
node scripts/run_all_tests.js
```
- Suite 1: Static RBAC and Route Guard Verification (47 passed).
- Suite 2: Live Server JWT Authentication across all 10 Hospital Roles (60 passed).

### 5. Government Dashboard Tests (94/94 Passed)
```bash
cd GOVERNMENT_DASHBOARD
npm test
```
- Suite 1: Static Route & RBAC Security (30 passed).
- Suite 2: Real Backend Authentication & Live API (14 passed).
- Suite 3: Interactive Workflows & Responsive Viewports (8 passed).
- Suite 4: State Admin & District Admin Workspaces (22 passed).
- Suite 5: Government Workspaces & Persistent CRUD Verification (20 passed).

### 6. Production Builds
```bash
npm --prefix GOVERNMENT_DASHBOARD run build
npm --prefix HOSPITAL_DASHBOARD run build
```
- Both Vite production builds compile cleanly with exit code 0.

---

## Future Enhancements

The following roadmap features are planned for future development milestones:

1. **Self-Hosted Open-Weights Medical LLM:** Deployment of fine-tuned medical models (such as Qwen-2.5-7B or BioMistral-7B) on private, HIPAA/ABDM-compliant inference nodes to replace rule-based triage.
2. **Voice-to-Voice Multilingual Interaction:** Integration of speech recognition (ASR) and text-to-speech (TTS) in regional dialects to assist non-literate rural patients.
3. **ABDM Milestone 2 & 3 Certification:** Direct bridge with the National Health Authority (NHA) gateway for real-time electronic consent management and FHIR record exchange.
4. **IoT Ambulance & Oxygen Telemetry:** Live GPS and oxygen cylinder telemetry feeds connecting 108 emergency dispatchers directly to hospital trauma ward dashboards.
5. **Federated Outbreak Forecasting:** Machine learning models running on localized epidemiological data to forecast dengue and seasonal flu outbreaks 14 days in advance.

---

## Contribution and License

### Contributing
Contributions to CareBridge are welcome. Please ensure that:
1. All changes adhere to existing ESLint and Dart analysis rules (`flutter analyze` must pass with 0 issues).
2. Existing test suites pass without regression (`npm run test:backend` and `npm run test:carebridge`).
3. Commit messages follow standard conventional commit conventions.

### License
No formal open-source license has been specified for this repository (`UNLICENSED` in `package.json`). All rights are reserved by the CareBridge project development team.

---

## Acknowledgements

Developed as part of the **CareBridge System Initiative** to advance equitable healthcare access, inter-facility communication, and Ayushman Bharat Digital Mission (ABDM) adoption across public healthcare networks. Special recognition is extended to the open-source communities powering Flutter, React, Express, and PostgreSQL.
