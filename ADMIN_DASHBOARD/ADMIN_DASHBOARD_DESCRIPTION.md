# CareBridge Admin Dashboard

## 1. Overview

The CareBridge Admin Dashboard is the master administration portal for the CareBridge healthcare network. It provides centralized control over:

- Healthcare user accounts
- Hospitals and other healthcare facilities
- Medical stores and pharmacies
- Role and permission definitions
- Administrative activity and audit records
- Bulk registration of hospitals and medical stores

The dashboard is designed for a trusted `ADMIN` operator. It is separate from the Government Dashboard, Hospital Dashboard, Common Login, and Patient App.

## 2. Application Details

| Item | Description |
|---|---|
| Application | CareBridge Master Administration Dashboard |
| Frontend | HTML, CSS, and vanilla JavaScript ES modules |
| Rendering model | Client-side DOM components |
| Entry point | `ADMIN_DASHBOARD/index.html` |
| Application bootstrap | `ADMIN_DASHBOARD/js/app.js` |
| Styling | `ADMIN_DASHBOARD/css/design-system.css`, `login.css`, and `admin.css` |
| Backend | Node.js and Express |
| Database | PostgreSQL through the shared backend API |
| Default development URL | `http://localhost:5173` when served by the repository admin server |
| Backend API | `http://localhost:5000/api` |
| Authentication | Backend-signed JWT with the `ADMIN` role |
| Language | English |
| Branding | Official CareBridge logo from `ADMIN_DASHBOARD/assets/logo.png` |

The application does not use React, Angular, or a frontend router. Internal navigation is handled through the reactive `adminStore` and URL hash values such as `#admin`.

## 3. Main Responsibilities

The Admin Dashboard is responsible for system-wide master-data administration. It is intended to manage identities and participating healthcare organizations rather than clinical workflows.

### 3.1 User administration

Administrators can:

- View all dashboard users
- Search users by ID, employee ID, name, role, organization, email, or mobile number
- Filter users by role and district
- Filter active, inactive, suspended, and pending users
- Sort user records
- Browse paginated user tables
- Open a detailed user profile drawer
- Create a user account
- Generate or reset a temporary password
- Activate or deactivate an account

The user table presents:

- User ID
- Full name
- Employee ID
- Role
- Mobile number
- Email address
- Assigned hospital or store
- District
- Account status
- Created date
- Last login
- Administrative actions

### 3.2 Hospital and facility administration

Administrators can:

- View registered hospitals and facilities
- Search by hospital ID, name, district, type, status, or phone
- Filter by hospital type and status
- Review pending verification records
- Open a hospital profile drawer
- Add a hospital
- Approve or reject a pending hospital
- Activate or deactivate a hospital
- View capacity and bed information
- View assigned hospital administrators
- Bulk-import hospital records from Excel

Hospital records include:

- Hospital ID and name
- Facility type
- Ownership or sector
- Registration or license number
- State, district, taluk, and locality
- Address and PIN code
- Telephone and official email
- Emergency contact
- Geographic coordinates
- Total, occupied, available, ICU, emergency, and general beds
- Clinical services
- Operational status
- Assigned administrator
- Creation date

Supported facility categories include:

- District Hospital
- Government Hospital
- Taluk Hospital
- Community Health Centre
- Primary Health Centre
- Specialty Hospital

### 3.3 Medical store administration

Administrators can:

- View registered medical stores and pharmacies
- Search by store ID, name, district, type, status, or contact person
- Filter by store type and status
- Review pending verification records
- Open a store profile drawer
- Add a medical store
- Approve or reject a pending store
- Activate or deactivate a store
- Review inventory summary indicators
- Bulk-import medical store records from Excel

Medical store records include:

- Store ID and name
- Store type
- Drug or registration license number
- State, district, taluk, and locality
- Address and PIN code
- Phone and email
- Contact person or store in-charge
- Pharmacy services
- Inventory summary
- Assigned manager
- Operational status
- Creation date

Supported store categories include:

- Government Medical Store
- Hospital Pharmacy
- Primary Health Centre Pharmacy
- Public Pharmacy
- Partner Pharmacy

### 3.4 Roles and permissions

The Roles & Permissions module displays the configured role-permission matrix for healthcare tiers such as:

- Hospital Administrator
- Doctor
- Nurse
- Pharmacist
- Medical Store Staff
- Lab Technician
- Reception Staff
- Health Worker
- District Administrator
- Government Administrator

The matrix documents the permissions associated with each role and communicates the intended organizational boundary between hospitals, PHCs, pharmacies, and government agencies.

The backend remains authoritative for request authorization. The frontend matrix is an administrative visibility and configuration view; it must not be treated as a replacement for backend authorization.

### 3.5 Audit and activity logs

The Activity & Audit Logs module displays administrative events with:

- Timestamp
- Administrator ID
- Administrator name
- Module
- Action
- Record ID
- Operational details
- Result

Supported event categories include:

- User creation
- User activation or deactivation
- Password reset
- Hospital creation
- Hospital verification
- Hospital activation or deactivation
- Medical store creation
- Medical store verification
- Medical store activation or deactivation
- Logout

Logs can be searched and filtered by module.

### 3.6 Summary indicators

The dashboard displays summary cards for:

- Total users and active users
- Total hospitals and active hospitals
- Total medical stores and active medical stores

The summary strip also highlights:

- Pending user accounts
- Hospitals awaiting verification
- Medical stores awaiting verification
- Inactive or suspended accounts

Summary alerts link directly to the relevant filtered management view.

## 4. Navigation Structure

The sidebar is organized into three administration groups:

```text
Administration
├── User Management
│   ├── All Users
│   ├── Create User
│   ├── Active Users
│   ├── Inactive Users
│   └── Roles & Permissions
├── Hospital Management
│   ├── All Hospitals
│   ├── Add Hospital
│   ├── Bulk Import Hospitals
│   ├── Pending Verification
│   └── Hospital Users
├── Medical Store Management
│   ├── All Medical Stores
│   ├── Add Medical Store
│   ├── Bulk Import Medical Stores
│   ├── Pending Verification
│   └── Store Users
└── Audit Logs
```

The active section and sub-filter are stored in the shared `adminStore`. The application also supports hash-based deep links for the two bulk-import views:

- `#admin/hospitals/bulk-import`
- `#admin/stores/bulk-import`

## 5. Header and Layout

The dashboard shell contains:

- CareBridge branding and official emblem
- “Master Administration” product label
- Network operational status indicator
- Live local time display
- Current administrator name and role
- Authenticated user identifier in the profile tooltip
- Sign-out control
- Responsive sidebar navigation
- Main content viewport
- Modal, drawer, and toast mount points

The layout uses the CareBridge visual language:

- Navy administrative surfaces
- White and light neutral content areas
- Teal primary actions
- Rounded cards and controls
- Status pills
- Responsive data tables
- Drawer-based record details
- Modal-based create and reset workflows

## 6. Authentication and Authorization

### 6.1 Login contract

The Common Login or another authorized handoff supplies:

- `cb_auth_token`
- `cb_auth_user`

The token is stored in local storage and session storage when supplied through the URL handoff. URL credentials are removed from the visible browser address after ingestion.

### 6.2 Strict Admin role enforcement

At startup, `ADMIN_DASHBOARD/js/app.js`:

1. Reads the token from local or session storage.
2. Decodes the signed JWT payload.
3. Reads the server-issued role.
4. Requires the role to be exactly `ADMIN`.
5. Initializes the current administrator from server-authenticated claims.
6. Redirects unauthenticated users to the Common Login.
7. Shows an access-denied screen for non-admin roles.

Government officers, hospital staff, doctors, and other non-admin roles must use their own dashboards. Frontend-provided role text is not sufficient to grant access.

### 6.3 Backend protection

The backend protects the administrative APIs with:

- JWT authentication
- `ADMIN` role authorization
- Password hashing with bcrypt for created users
- Duplicate username and email checks
- Server-side role lookup
- Account activation state

The existing backend `/api/users` routes remain restricted to `ADMIN`.

## 7. Backend API Integration

The dashboard reads and writes data through the shared Express API.

### 7.1 Live reads

During initialization, the store attempts to load:

| Dashboard data | Endpoint | Purpose |
|---|---|---|
| Hospitals/facilities | `GET /api/facilities` | Load live facility records |
| Medical stores | `GET /api/medical-stores` | Load active medical store records |
| Users | `GET /api/users` | Load users for an authenticated admin |

The hospital and medical-store read endpoints are also used by other CareBridge clients, so the dashboard maps their API shape into its administrative display model.

### 7.2 Administrative writes

The create workflows call:

| Operation | Endpoint | Authorization |
|---|---|---|
| Create user | `POST /api/users` | `ADMIN` |
| Create hospital/facility | `POST /api/facilities` | `ADMIN` |
| Create medical store | `POST /api/medical-stores` | `ADMIN` |

The backend validates required fields, generates or stores identifiers, hashes passwords for users, and persists records in PostgreSQL.

### 7.3 Backend update and deactivation APIs

The backend also exposes:

- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `PUT /api/facilities/:id`
- `DELETE /api/facilities/:id`
- `PUT /api/medical-stores/:id`
- `DELETE /api/medical-stores/:id`

These endpoints are protected by the `ADMIN` role. Any workflow that updates records should use these server endpoints as the authoritative persistence path.

## 8. Data and Offline Behavior

The dashboard includes seed data in `ADMIN_DASHBOARD/js/data/masterData.js` for development and initial rendering. It also initializes local collections before live backend data is loaded.

If the backend is unavailable:

- The application displays a visible “Development / Offline Mock Data” banner.
- Local seed collections remain available for UI exploration.
- The dashboard does not silently present the fallback as live PostgreSQL data.
- The administrator should restore backend connectivity before treating the displayed data as authoritative.

The offline banner is created by `AdminDashboard.js` from the `adminStore.isOfflineMockData` state.

## 9. Bulk Import

The dashboard provides Excel workflows for hospitals and medical stores using SheetJS.

### 9.1 Hospital import

The hospital template supports:

- Hospital name and ID
- Hospital type
- Ownership
- Registration or license number
- District and taluk
- City or village
- PIN code and address
- Latitude and longitude
- Telephone and official email
- Emergency contact
- Total, ICU, emergency, and general beds
- Certified clinical services

Validation includes required fields, allowed enum values, email format, phone format, PIN format, and numeric ranges.

### 9.2 Medical store import

The medical store template supports:

- Store name and ID
- Store type
- Drug license number
- District and taluk
- City or village
- PIN code and address
- Phone and email
- Store in-charge
- Pharmacy services

Validation includes required fields, allowed store types, district values, email format, phone format, and PIN format.

Both modules provide:

- Downloadable `.xlsx` template
- Instructions sheet
- Sample rows
- Uploaded-file parsing
- Validation summary
- Valid and invalid row previews
- Error reporting
- Import result summary

The import UI feeds validated rows into the dashboard store. Administrative deployments should verify that each imported record is also persisted through the corresponding backend API before considering the import complete.

## 10. Forms, Modals, and Drawers

The dashboard uses modular overlays:

### Modals

- Create User
- Reset Password
- Add Hospital
- Add Medical Store

### Drawers

- User Detail Drawer
- Hospital Profile Drawer
- Medical Store Profile Drawer

### Notifications

- Toast messages confirm successful local actions or report warnings.
- Backend network and non-success responses are logged to the browser console.
- Offline mode is shown as a persistent warning banner inside the main viewport.

## 11. Security and Data Integrity Notes

The following controls are implemented:

- Server-signed JWT role verification
- Strict `ADMIN` dashboard access
- Backend `ADMIN` protection for user and master-data mutation routes
- Bcrypt password hashing for newly created users
- Duplicate username and email validation
- No client-side role switcher for elevating privileges
- Visible distinction between live and development/offline data
- URL cleanup after token handoff
- Server-side account deactivation endpoints

The following limitations must be understood:

1. The dashboard store performs optimistic local updates for several status and profile actions.
2. Some status actions in the current frontend store create local audit entries but do not immediately call the matching backend update endpoint.
3. Audit logs currently live in the browser-side store for the dashboard session; they are not a centralized, tamper-evident PostgreSQL audit ledger.
4. Summary cards include seeded baseline offsets intended for the current prototype dataset. They should not be interpreted as a complete authoritative statewide count unless the backend dataset is known to cover the same population.
5. Bulk import validation and local insertion are implemented in the browser; backend persistence and duplicate handling should be verified for each production import process.
6. A successful UI toast alone does not prove that a backend transaction completed. The server response and subsequent reload are the authoritative verification steps.

## 12. Backend Route Reference

### Authentication

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### User management

- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

### Facilities

- `GET /api/hospitals`
- `GET /api/facilities`
- `GET /api/hospitals/:id`
- `GET /api/facilities/:id`
- `POST /api/hospitals`
- `POST /api/facilities`
- `PUT /api/hospitals/:id`
- `PUT /api/facilities/:id`
- `DELETE /api/hospitals/:id`
- `DELETE /api/facilities/:id`

### Medical stores

- `GET /api/medical-stores`
- `POST /api/medical-stores`
- `PUT /api/medical-stores/:id`
- `DELETE /api/medical-stores/:id`

All mutation routes listed above require an authenticated `ADMIN` token where enforced by the backend route configuration.

## 13. Operational Workflow

### Administrator sign-in

1. Open the Common Login.
2. Sign in with an account assigned the backend `ADMIN` role.
3. Follow the redirect to the Admin Dashboard.
4. Confirm the administrator name and role in the header.
5. Confirm that the backend data loads without the offline banner.

### Creating a user

1. Open **User Management**.
2. Select **Create User**.
3. Enter identity, role, organization, district, and password details.
4. Submit the form.
5. Confirm the success message.
6. Verify the record using the backend and after a page reload.

### Registering a hospital or store

1. Open the appropriate management section.
2. Select **Add Hospital** or **Add Medical Store**.
3. Complete required registration and contact fields.
4. Submit the form.
5. Review the initial verification status.
6. Confirm persistence through the backend and a fresh dashboard load.

### Reviewing verification queues

1. Select the relevant **Pending Verification** view.
2. Open the record profile.
3. Review registration, contact, and operational information.
4. Approve or reject the record according to administrative policy.
5. Verify the resulting server-side status.

## 14. Development and Maintenance

The primary files are:

- [Admin Dashboard entry point](./ADMIN_DASHBOARD/index.html)
- [Application bootstrap](./ADMIN_DASHBOARD/js/app.js)
- [Dashboard shell](./ADMIN_DASHBOARD/js/components/admin/AdminDashboard.js)
- [Sidebar](./ADMIN_DASHBOARD/js/components/admin/AdminSidebar.js)
- [Header](./ADMIN_DASHBOARD/js/components/admin/AdminHeader.js)
- [Central store](./ADMIN_DASHBOARD/js/store/adminStore.js)
- [Seed data](./ADMIN_DASHBOARD/js/data/masterData.js)
- [Admin styling](./ADMIN_DASHBOARD/css/admin.css)
- [Design tokens](./ADMIN_DASHBOARD/css/design-system.css)
- [Backend API routes](./backend/src/routes/api.js)
- [User controller](./backend/src/controllers/userController.js)
- [Hospital controller](./backend/src/controllers/hospitalController.js)
- [Medical store controller](./backend/src/controllers/medicalStoreController.js)

The Admin Dashboard package uses the repository's admin server scripts. Its package build command is a readiness check rather than a bundling pipeline:

```powershell
npm --prefix ADMIN_DASHBOARD run build
```

## 15. Scope Boundaries

The Admin Dashboard does not replace:

- Common Login
- Government State or District operations
- Hospital clinical workflows
- Patient mobile workflows
- AI prediction or recommendation systems
- Backend database administration

It administers platform identities and healthcare organization master records while preserving the separate permissions and workflows of the other CareBridge applications.

## 16. Recommended Production Verification

Before production use, verify:

- Admin JWT issuance and expiration
- `ADMIN` authorization on every mutation
- User creation and deactivation persistence
- Password reset persistence and forced-change behavior
- Hospital and medical-store create/update/deactivate persistence
- Duplicate identifiers and email handling
- Bulk import API persistence and transactional failure handling
- Centralized server-side audit logging
- Reload consistency between PostgreSQL and the dashboard
- Offline banner behavior and recovery after backend reconnection
- No sensitive data is exposed in browser storage, logs, or exported files

