# CareBridge Master Administrator Dashboard

[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/)
[![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/)
[![CSS3](https://img.shields.io/badge/CSS3-Standard-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/)
[![SheetJS](https://img.shields.io/badge/SheetJS-0.20-339933?style=flat-square)](https://sheetjs.com/)

The **CareBridge Master Administrator Dashboard** is the central governance portal for state and district health authorities. It equips authorized master administrators (`ADMIN`) with complete oversight over healthcare facility accreditation, pharmacy licensing, healthcare worker credentials, bulk data ingestion, and immutable audit trails.

---

## 1. Key Capabilities & Functional Modules

### 🏥 Healthcare Facility Accreditation & Master Registry
- **Facility Lifecycle Management**: Onboard, verify, edit, and monitor government district hospitals, taluk hospitals, community health centers (CHCs), and primary health centers (PHCs).
- **Capacity & Location Configuration**: Track bed capacities (General, ICU, Pediatric), geo-coordinates (latitude/longitude), taluk, district, and emergency casualty status.
- **Facility Discovery Sync**: Changes made by the Admin immediately synchronize across the CareBridge Patient App and Government Dashboard.

### 💊 Medical Store & Pharmacy Registry
- **Drug License Accreditation**: Register authorized government Jan Aushadhi Kendras and retail pharmacies.
- **Operating Hours & Stock Directory**: Maintain pharmacy operating schedules, license validity, contact details, and location mapping.

### 👥 User Provisioning & Role-Based Access Control (RBAC)
- **Centralized Credential Issuance**: Admin-only user account creation with secure password hashing (`bcryptjs`) on the backend.
- **Supported Roles Provisioning**:
  - `GOVERNMENT`: State & District Health Administrators
  - `HOSPITAL_ADMIN`: Hospital Operations Directors
  - `DOCTOR`: Clinical Specialists & Medical Officers
  - `NURSE`, `RECEPTIONIST`, `PHARMACIST`, `LAB_STAFF`, `BILLING_STAFF`, `EMERGENCY_STAFF`
- **Account Actions**: Edit user metadata, change assigned facility / district scope, activate / deactivate credentials.

### 📤 Bulk Ingestion Engine (Excel / SheetJS)
- **Mass Data Ingestion**: Bulk-upload hundreds of facilities, pharmacies, and inventory items via Excel spreadsheets (`.xlsx`, `.xls`, `.csv`).
- **Data Validation & Sanitization**: Automated schema verification, duplicate detection, and fallback coordinate assignment ensuring zero ingestion failures.

### 📜 Master Audit Logging
- **Immutable Administrative Record**: Every facility creation, user status change, and bulk import event is recorded in the PostgreSQL audit log with user ID, IP address, and timestamp.

---

## 2. Architecture & File Structure

The Admin Dashboard runs on **Port 5173** and uses an asynchronous, reactive event architecture built with modern Vanilla JavaScript ES Modules:

```
ADMIN_DASHBOARD/
├── index.html                           # Single-page application entry point
├── package.json                         # Dependencies & launcher scripts
├── css/
│   ├── admin.css                        # Admin layout and component styles
│   └── responsive.css                   # Viewport breakpoints & accessibility tokens
├── js/
│   ├── app.js                           # Root application coordinator & route controller
│   ├── store/
│   │   └── adminStore.js                # Reactive state store synchronized with PostgreSQL
│   ├── components/admin/
│   │   ├── FacilityManagement.js        # Hospital/PHC registry component
│   │   ├── UserManagement.js            # User provisioning & permissions component
│   │   ├── PharmacyManagement.js        # Medical store registry component
│   │   ├── BulkImport.js                # SheetJS Excel import handler
│   │   └── AuditLogs.js                 # Administrative audit viewer
│   └── utils/
│       ├── api.js                       # Authenticated fetch wrapper for :5000
│       └── validators.js                # Input and file format validators
└── README.md                            # Application documentation
```

---

## 3. Authentication & Security Flow

1. **Common Login Handoff**:
   - Master Administrators log in at `http://localhost:3000` using `admin@carebridge.local` / `Admin@123`.
   - The Common Login portal redirects to `http://localhost:5173/?token=<JWT>`.
   - The Admin Dashboard ingests the token, verifies the `role === 'ADMIN'` claim, stores it in `localStorage`, and strips sensitive parameters from the URL history using `window.history.replaceState()`.

2. **Server-Side Protection**:
   - All REST calls made by the Admin Dashboard to `/api/users`, `/api/hospitals` (POST/PUT/DELETE), and `/api/admin/bulk-import/*` require a valid JWT with the `ADMIN` role claim.
   - Non-admin attempts return **HTTP 403 Forbidden**.

---

## 4. Setup & Running

### Installation
```bash
npm install
```

### Start Local Static Server
```bash
npm run dev
# or: npm start
# Runs static server on http://localhost:5173
```

### Default Credentials
- **Role**: `ADMIN`
- **Email**: `admin@carebridge.local` *(or `admin`)*
- **Password**: `Admin@123`
- **Dashboard URL**: `http://localhost:5173`

