# CareBridge Government Health Dashboard

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Government Tests](https://img.shields.io/badge/Test%20Suite-94%2F94%20Passing-brightgreen?style=flat-square)](https://github.com/MOULEESHWARAN-S31/CareBridge_System)

The **CareBridge Government Health Dashboard** is an enterprise public healthcare intelligence and administrative operations application. It provides real-time epidemiological surveillance, statewide healthcare monitoring, district health administration, inter-facility resource coordination, and emergency response management.

---

## 1. Core Architecture & Dedicated Workspaces

The application runs on **Port 5174** and provides two authenticated administrative workspaces governed by strict server-signed JSON Web Tokens (JWT) and PostgreSQL geographic authorization:

```
                               ┌────────────────────────────────────────────────────────┐
                               │           CareBridge Government Dashboard              │
                               │                (React 19 + TypeScript)                 │
                               │               http://localhost:5174                    │
                               └──────────────────────────┬─────────────────────────────┘
                                                          │
                                         Role & Geographic Workspace Switcher
                                                          │
                      ┌───────────────────────────────────┴───────────────────────────────────┐
                      ▼                                                                       ▼
    ┌───────────────────────────────────┐                                   ┌───────────────────────────────────┐
    │       STATE ADMIN WORKSPACE       │                                   │      DISTRICT ADMIN WORKSPACE     │
    │          (`STATE_ADMIN`)          │                                   │         (`DISTRICT_ADMIN`)        │
    │   Statewide Oversight & Governance│                                   │ Authorized District Ops (Salem)   │
    └─────────────────┬─────────────────┘                                   └─────────────────┬─────────────────┘
                      │                                                                       │
                      │ S01: Statewide Command Center                                         │ D01: District Command Center
                      │ S02: District Comparisons & Indices                                   │ D02: Hospitals, CHCs & PHCs
                      │ S03: Statewide Disease Surveillance                                   │ D03: Village/Block Health Metrics
                      │ S04: Facility Capacity & ICU Matrix                                   │ D04: Village Outbreak Surveillance
                      │ S05: Medicine Shortage Intelligence                                   │ D05: Camp Planning & Rostering
                      │ S06: Blood Bank Directory & Transfers                                 │ D06: Citizen Camp Request Actions
                      │ S07: Health Camp Oversight                                            │ D07: Local Medicine Stock Levels
                      │ S08: Statewide Resource Allocation                                    │ D08: Blood Availability & Donors
                      │ S09: District Escalations Queue                                       │ D09: Hospital OPD Queue & Appts
                      │ S10: Official Public Announcements                                    │ D10: Patient Referral Tracker
                      │ S11: Executive Health Digests & Reports                               │ D11: High-Risk Follow-Up Programs
                      │                                                                       │ D12: District Health Advisories
                      │                                                                       │ D13: Operational Reports & Audits
                      │                                                                       │ D14: Diagnostic Equipment Uptime
                      └───────────────────────────────────┬───────────────────────────────────┘
                                                          │
                                                          ▼
                                      ┌───────────────────────────────────────┐
                                      │        Node.js REST API (:5000)       │
                                      │      /api/government/* Endpoints      │
                                      └───────────────────┬───────────────────┘
                                                          ▼
                                      ┌───────────────────────────────────────┐
                                      │      PostgreSQL (`carebridge_db`)     │
                                      │     Real Persistent Operational DB    │
                                      └───────────────────────────────────────┘
```

---

## 2. Key Modules & Routes Matrix

### State Admin Workspace (`/dashboard/state/*`)
| Route | Component | Purpose |
|---|---|---|
| `/dashboard/state/overview` | `StateOverview` | Statewide executive command center, health score cards, and high-level KPIs. |
| `/dashboard/state/districts` | `DistrictComparison` | Inter-district comparative analytics, ranking tables, and resource indexes. |
| `/dashboard/state/surveillance` | `StateSurveillance` | Epidemic monitoring, disease clustering (Dengue, Malaria, Typhoid), and outbreak hotspots. |
| `/dashboard/state/facilities` | `StateFacilities` | Statewide network capacity, bed occupancy, ICU beds, and ventilator status. |
| `/dashboard/state/medicines` | `StateMedicine` | Statewide essential medicine and diagnostic availability, critical shortage alerts. |
| `/dashboard/state/blood` | `StateBlood` | State blood bank network, rare blood group reserves, inter-district transfer logistics. |
| `/dashboard/state/camps` | `StateCampOversight` | Statewide oversight of community health outreach camps, coverage analytics. |
| `/dashboard/state/resources` | `StateResources` | Strategic resource reallocation directives between surplus and deficit facilities. |
| `/dashboard/state/requests` | `StateRequests` | District resource escalation review queue (actionable **Approve** / **Reject**). |
| `/dashboard/state/announcements` | `StateAnnouncements` | Authoritative state-level public health notifications and media releases. |
| `/dashboard/state/reports` | `StateReports` | Consolidated executive health digest generation and exportable compliance reports. |

### District Admin Workspace (`/dashboard/district/*`)
| Route | Component | Purpose |
|---|---|---|
| `/dashboard/district/overview` | `DistrictOverview` | Assigned district command center (Salem District) with operational metrics. |
| `/dashboard/district/hospitals` | `DistrictHospitalsPHCs` | Local facility network oversight (Salem District Hospital, PHCs, CHCs, sub-centers). |
| `/dashboard/district/villages` | `VillageMonitoring` | Village and block-level health indicators, ASHA worker metrics, immunization coverage. |
| `/dashboard/district/camps` | `CampManagement` | Operational health camp roster, venue coordination, medical team assignments. |
| `/dashboard/district/community-requests` | `CommunityRequests` | Review citizen-submitted health camp requests with **Approve** / **Reject** workflow. |
| `/dashboard/district/medicines` | `MedicineDiagnostics` | District medicine inventory levels, PHC stockouts, replenishment reorders. |
| `/dashboard/district/diagnostics` | `DiagnosticAvailability` | Diagnostic equipment uptime (X-Ray, CT, Ultrasound) and laboratory status. |
| `/dashboard/district/blood` | `BloodManagement` | Salem district blood banks, emergency blood stock alerts, donor registry. |
| `/dashboard/district/queue` | `AppointmentsQueue` | Real-time OPD patient queue and appointment volume across district hospitals. |
| `/dashboard/district/referrals` | `Referrals` | Inbound and outbound patient referral tracking between primary and secondary centers. |
| `/dashboard/district/follow-ups` | `FollowUps` | High-risk patient monitoring (maternal health, TB, diabetes, hypertension). |
| `/dashboard/district/notifications` | `Notifications` | District-wide health advisories, public warnings, and local press bulletins. |
| `/dashboard/district/reports` | `DistrictReports` | District operational health reports, attendance metrics, and audit history. |

### Geographic & Health Network Views
- `/dashboard` — Master Overview & District Health Index
- `/dashboard/district-map` — Interactive Tamil Nadu district GIS map
- `/dashboard/village-map` — High-resolution village cluster mapping
- `/dashboard/hospitals` — Public hospital network directory
- `/dashboard/patients` — Masked surveillance patient registry
- `/dashboard/doctors` — Specialist and medical officer roster
- `/dashboard/health-camps` — Citizen and mobile medical outreach camps
- `/dashboard/resource-optimization` — Resource reallocation engine
- `/dashboard/telemedicine` — Rural tele-consultation hub
- `/dashboard/diagnostics` — Laboratory and radiology monitoring
- `/dashboard/medicine` — Essential drug inventory
- `/dashboard/beds-resources` — Live bed matrix (General, ICU, Pediatric, Emergency)
- `/dashboard/emergency-supplies` — Disaster and emergency supply depots
- `/dashboard/accessibility` — Rural healthcare transit and accessibility scores
- `/dashboard/maternal-child` — MCH and nutritional monitoring
- `/dashboard/vaccination` — Universal Immunization Programme tracking
- `/dashboard/audit-logs` — Immutable administrative event logs
- `/dashboard/ai-prediction` — Epidemic forecasting (isolated module)

---

## 3. Strict Operating Directives & Compliance

1. **English-Only UI**:
   - In accordance with health department administrative standards, the Government Dashboard operates exclusively in **English**.
   - Language selector dropdowns and translation strings have been cleanly excised from the navigation header and sidebar.
   - Multilingual citizen communication is handled by the citizen Flutter mobile app.

2. **Strict Geographic Gating**:
   - District Administrators are cryptographically restricted to their assigned district jurisdiction (e.g., `Salem`).
   - The backend enforces district boundaries at the SQL query level; any attempt to query or mutate records from other districts returns **HTTP 403 Forbidden**.
   - State Administrators hold statewide oversight and can filter or aggregate across all districts (`ALL`).

3. **Real PostgreSQL Data Persistence**:
   - Zero synthetic front-end offsets or hardcoded client arrays in operational workflows.
   - Camp proposals (`/api/government/camps`), citizen requests (`/api/government/community-requests`), and audit records (`/api/government/audit-events`) persist directly into PostgreSQL `carebridge_db`.

4. **Strict AI Isolation Mandate**:
   - Machine learning forecasting modules (`AIPrediction.tsx`) remain strictly decoupled from baseline transactional and administrative workflows.

---

## 4. Setup, Build & Testing

### Installation
```bash
npm install
```

### Running Development Server
```bash
npm run dev
# Starts Vite development server on http://localhost:5174
```

### Building for Production
```bash
npm run build
# Executes TypeScript validation (tsc -b) followed by production bundle generation (vite build)
```

### Automated Verification Test Runner
The dashboard features an automated end-to-end test runner validating static routes, responsive layouts, JWT authentication, and live PostgreSQL CRUD:
```bash
npm test
# or: node scripts/test_government_dashboard.js
```

**Verification Results: 94/94 PASSED (0 failures)**
- **Suite 1: Static Route & RBAC Security Verification** (30/30 passed)
- **Suite 2: Real Backend Authentication & Live API Verification** (14/14 passed)
- **Suite 3: Interactive Workflows & Responsive Viewports** (8/8 passed)
- **Suite 4: State Admin & District Admin Workspaces Verification** (22/22 passed)
- **Suite 5: Government Workspaces & Persistent CRUD Verification** (20/20 passed)

---

## 5. Environment & Configuration

Configured in `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5174,
    strictPort: true,
  }
})
```

- **Target Port**: `5174`
- **Backend API**: `http://localhost:5000/api`
- **Common Login Gateway**: `http://localhost:3000`
