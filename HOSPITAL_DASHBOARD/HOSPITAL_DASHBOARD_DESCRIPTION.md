# CareBridge Hospital Dashboard

## 1. Overview

The CareBridge Hospital Dashboard is a role-aware hospital operations portal for
Government District Hospital - Salem. It provides one web application for
clinical care, patient administration, diagnostics, pharmacy operations,
emergency coordination, billing, medical records, workforce management, and
hospital administration.

The application uses a shared dashboard shell. After authentication, each staff
member receives:

- A role-specific dashboard.
- Navigation limited to that role's operational area.
- Shared patient, appointment, notification, profile, and settings pages where
  applicable.
- Access checks that prevent one hospital role from opening another role's
  workspace.
- Responsive layouts for desktop, tablet, and mobile screens.

The Hospital Dashboard is a frontend application. Password verification and
token creation are handled by the CareBridge Common Login and backend services.

## 2. Primary objectives

- Give hospital staff a single operational workspace.
- Present information and actions appropriate to the authenticated role.
- Support patient registration, search, appointments, consultations, records,
  prescriptions, diagnostics, pharmacy, emergency, billing, and HR workflows.
- Provide hospital-wide visibility for authorized administrators.
- Make alerts, critical results, synchronization state, and mock-data state
  visible to users.
- Preserve access boundaries between hospital, government, and master-admin
  workspaces.
- Work consistently across desktop, tablet, and mobile layouts.

## 3. Technology stack

| Area | Technology |
| --- | --- |
| UI framework | React 19 |
| Build tool | Vite |
| Routing | React Router |
| State management | React Context and local component state |
| Authentication state | `AuthContext` |
| Icons | `lucide-react` |
| Charts | `recharts` |
| Maps | Leaflet |
| Styling | CSS design tokens and shared component classes |
| API client | `src/services/api.js` |
| Backend integration | REST API, Node.js/Express, PostgreSQL |
| Linting | Oxlint |

## 4. Local development commands

Run these commands from the repository root:

```bash
npm --prefix HOSPITAL_DASHBOARD run dev
npm --prefix HOSPITAL_DASHBOARD run build
npm --prefix HOSPITAL_DASHBOARD run lint
npm --prefix HOSPITAL_DASHBOARD test
npm --prefix HOSPITAL_DASHBOARD run preview
```

The Vite development server uses port `5173` by default. The API client uses
`VITE_API_BASE_URL` when configured; otherwise it targets:

```text
http://localhost:5000/api
```

The Common Login application is expected at `http://localhost:3000` for local
development.

## 5. Hospital identity and environment

The default mock hospital is:

| Field | Value |
| --- | --- |
| Hospital | Government District Hospital - Salem |
| Hospital ID | `GDH-SALEM-01` |
| Location | Salem, Tamil Nadu, India |
| Hospital type | District Hospital |
| Portal | CareBridge Hospital Portal |

The frontend includes representative mock data for departments, doctors,
nurses, patients, appointments, wards, prescriptions, laboratory activity,
notifications, and operational metrics. Mock data is intended for development,
offline display, and evaluation. It must not be interpreted as production
clinical data.

## 6. Supported roles

The application supports ten hospital workspaces:

| Role | Main responsibilities | Dashboard route |
| --- | --- | --- |
| Hospital Administrator | Hospital-wide operations, staff, departments, reports, audit, synchronization, and settings | `/admin/dashboard` |
| Doctor | Patient search, appointments, consultations, prescriptions, diagnostics, referrals, records, and telemedicine | `/doctor/dashboard` |
| Nurse | Ward allocation, patient monitoring, medication schedules, doctor orders, procedures, nursing notes, and triage | `/nurse/dashboard` |
| Receptionist | Patient registration, OP cards, patient lists, appointments, and front-desk queue management | `/receptionist/dashboard` |
| Laboratory Staff | Test requests, specimens, tests in progress, result verification, critical callouts, and reagent inventory | `/lab/dashboard` |
| Pharmacist | Medication inventory, dispensing, low-stock reorders, stock alerts, expiry tracking, and prescriptions | `/pharmacy/dashboard` |
| Billing Staff | Billing records, payments, receipts, insurance-related workflows, and finance notifications | `/billing/dashboard` |
| Medical Records Staff | Medical records, documents, archives, consent-related information, and records notifications | `/records/dashboard` |
| Emergency Staff | Emergency cases, triage, ambulance coordination, trauma support, and emergency shifts | `/emergency/dashboard` |
| HR Manager | Staff directory, workforce information, shift rosters, HR notifications, and HR settings | `/hr/dashboard` |

Role identifiers are normalized through aliases in
`HOSPITAL_DASHBOARD/src/context/AuthContext.jsx`. For example, backend values
such as `HOSPITAL_ADMINISTRATOR`, `LABORATORY_STAFF`, and `HR_MANAGER` are
mapped to the corresponding hospital workspace.

## 7. Authentication and authorization

The Hospital Dashboard consumes a session established by the Common Login
service. It does not create passwords or issue authentication tokens.

The authentication flow is:

1. The user signs in through Common Login.
2. Common Login hands the frontend a signed token and user information.
3. `AuthContext` reads the token from the URL handoff or browser storage.
4. The JWT payload and user object are normalized into a hospital user model.
5. The user is redirected to the dashboard route for the verified role.
6. `RequireAuth` protects role routes and renders the shared dashboard layout.

The user model may include:

- User ID.
- Name and username.
- Email.
- Employee ID.
- Hospital ID.
- District.
- Department.
- Normalized role and role label.
- Avatar initials.
- Dashboard path.

Authorization protections include:

- Redirecting unauthenticated users to Common Login.
- Rejecting expired tokens.
- Rejecting unknown roles.
- Rejecting master-admin users from the Hospital Dashboard.
- Rejecting government users from the Hospital Dashboard.
- Showing an access-denied screen when a valid hospital user opens another
  hospital role route.
- Preserving the authenticated user's backend-provided identity and role data.

Local demo account metadata is maintained in
`HOSPITAL_DASHBOARD/src/auth/accounts.js`. Development credentials must be
handled through the Common Login/backend environment and must not be treated as
production credentials.

## 8. Shared application shell

All authenticated role routes render the shared
`src/components/layout/DashboardLayout/DashboardLayout.jsx`.

### Header

The shared header contains:

- Government District Hospital - Salem name.
- Sidebar menu control.
- Patient and hospital global search trigger.
- Notification bell and unread count.
- Critical laboratory result callouts.
- User avatar and role information.
- Profile menu and logout action.

Header behavior is shared across all ten roles. The header uses a dark navy
surface with light text, teal/cyan accents, compact rounded controls, and
responsive spacing.

### Sidebar

The shared sidebar contains:

- The official CareBridge logo asset.
- CareBridge Hospital Portal branding.
- Role-specific navigation sections.
- Active route highlighting.
- Emergency and critical-workflow emphasis.
- Collapse and expand control.
- Scrollable navigation for long menus.
- Profile and logout actions.
- Mobile overlay and drawer behavior.

The navigation is generated by `src/hooks/useRoleNav.js` and the role
configuration in `src/components/layout/Sidebar/Sidebar.jsx`. Shared shell
changes must not replace role-specific navigation with another workspace's
menu.

### Main content

The main content region provides:

- Page titles and descriptive subtitles.
- Responsive statistic cards.
- Tables and operational lists.
- Search and filter toolbars.
- Forms, dialogs, modals, and drawers.
- Loading, empty, error, and confirmation states.
- Error-boundary isolation for page-level rendering failures.

## 9. Functional areas

### Patient and OPD operations

- Patient search and lookup.
- Patient lists and patient profiles.
- Registration and demographic information.
- OPD queue management.
- OP card creation.
- Appointment scheduling and cancellation.
- Referral visibility.

### Clinical care

- Doctor directory and doctor profiles.
- Clinical consultations.
- Diagnoses and prescriptions.
- Doctor orders for nursing workflows.
- Medical records access.
- Laboratory orders and reports.
- Telemedicine operations.
- Department information.

### Nursing and inpatient care

- Ward and bed allocation.
- Inpatient monitoring.
- Vital and nursing task views.
- Medication schedules.
- Doctor-order review.
- Nursing notes.
- Emergency and triage escalation.
- Shift alerts.

### Laboratory and diagnostics

- Test request tracking.
- Sample and specimen collection.
- Tests in progress.
- Result verification.
- Critical result callouts.
- Laboratory notifications.
- Reagent inventory.

### Pharmacy and medication supply

- Medication inventory.
- Stock-level monitoring.
- Low-stock alerts and reorders.
- Expiry tracking.
- Prescription review.
- Dispensing-related alerts.

### Emergency and ambulance operations

- Emergency case visibility.
- Triage coordination.
- Critical patient workflows.
- Ambulance fleet information.
- Trauma and on-call doctor coordination.
- Emergency staffing and shift information.

### Billing and payments

- Billing records.
- Payment workflows.
- Receipts.
- Insurance-related information.
- Billing status and notifications.

### Medical records

- Medical record access.
- Patient documentation.
- Document management.
- Archive navigation.
- Records notifications.

### Hospital administration

- Staff directory.
- Doctor and department management views.
- Ward and bed capacity.
- Ambulance fleet.
- Shift rosters.
- Hospital analytics.
- Operational reports.
- Audit logs.
- Data synchronization.
- Portal settings.

### Human resources

- Employee directory information.
- Workforce and department information.
- Shift roster views.
- HR notifications.
- HR profile and settings.

## 10. Routing model

Routes are grouped by role and protected by `RequireAuth`. Each role has a
dashboard base path and nested operational paths. Examples include:

```text
/admin/dashboard/patients
/admin/dashboard/appointments
/doctor/dashboard/consultations
/nurse/dashboard/ward
/receptionist/dashboard/opd
/lab/dashboard/results
/pharmacy/dashboard/inventory
/billing/dashboard
/records/dashboard
/emergency/dashboard/triage
/hr/dashboard/employees
```

Shared routes are reused where the workflow is common, including:

- Patient lists and profiles.
- Appointments.
- Notifications.
- Profile.
- Settings.
- Medical records.
- Referrals.
- Telemedicine.

`useRoleNav` builds links from the authenticated role's base route so that
shared components preserve the correct workspace prefix.

## 11. Backend API integration

`src/services/api.js` provides the authenticated REST client. It:

- Reads the access token from local or session storage.
- Sends the token in the `Authorization` header.
- Uses `VITE_API_BASE_URL` when supplied.
- Returns a consistent offline response when the API cannot be reached.

The current service surface includes:

| Area | Representative operations |
| --- | --- |
| Hospital overview | Get overview, get beds, update beds |
| Patients | Search by ABHA ID, mobile number, or name |
| Appointments | List appointments, cancel appointments |
| OPD | List OPD cards, create OPD cards |
| Prescriptions | Retrieve prescriptions |
| Records | Retrieve and create medical records |
| Laboratory | Retrieve laboratory reports |
| Telemedicine | Retrieve teleconsultations |
| Referrals | Retrieve hospital referrals |
| Health alerts | Retrieve health alerts and emergency contacts |
| Translation | Request backend translation for supported workflows |

The frontend must not bypass backend authorization, fabricate signed tokens, or
turn an offline fallback into a claim that data was successfully persisted.

## 12. Data and offline behavior

The dashboard combines backend responses with representative local data for
development and offline presentation. The UI should distinguish:

- Live backend data.
- Loading state.
- API failure or offline state.
- Simulated/mock data.
- Pending synchronization records.

Synchronization controls and status views are presentation surfaces for the
existing synchronization mechanism. They must not be changed into hardcoded
success indicators.

## 13. Notifications and status feedback

The shared header and notification pages support:

- Unread notification counts.
- Critical laboratory alert callouts.
- Critical and warning filters.
- Notification detail views.
- Manual synchronization feedback.
- Last synchronization information.
- Online/offline or simulated-data indicators.
- Toast messages.
- Error-boundary recovery for rendering failures.

Critical alerts must remain visually distinguishable from ordinary information
notifications and must not be hidden for layout convenience.

## 14. Design system and responsive behavior

The dashboard follows the CareBridge visual language:

- Dark navy header.
- White sidebar.
- Light page background.
- White cards and panels.
- Navy headings and primary text.
- Teal and cyan accents.
- Soft blue active navigation surfaces.
- Subtle borders and shadows.
- Green success states.
- Amber warning states.
- Red emergency and critical states.
- Rounded controls and consistent focus states.

Responsive requirements include:

- Sidebar collapse on desktop.
- Mobile navigation drawer and overlay.
- Scrollable long navigation menus.
- Flexible header and search controls.
- Responsive statistic and card grids.
- Mobile-friendly content padding.
- Horizontal scrolling only for intentionally wide tables.
- No clipping or accidental horizontal page overflow.

The shared stylesheet is `src/index.css`. Role-specific styling is kept in
the role or feature stylesheets only when it cannot be expressed through the
shared design system.

## 15. Project structure

```text
HOSPITAL_DASHBOARD/
├── index.html
├── package.json
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── logo.png
├── scripts/
│   ├── run_all_tests.js
│   ├── test_password_hashes.js
│   ├── test_real_auth_integration.js
│   └── verify_roles.js
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── auth/
    │   └── accounts.js
    ├── components/
    │   ├── common/
    │   └── layout/
    ├── context/
    │   ├── AuthContext.jsx
    │   └── LanguageContext.jsx
    ├── data/
    │   └── mockData.js
    ├── hooks/
    │   └── useRoleNav.js
    ├── locales/
    ├── pages/
    ├── roles/
    │   ├── billing-staff/
    │   ├── doctor/
    │   ├── emergency-staff/
    │   ├── hospital-admin/
    │   ├── hr-manager/
    │   ├── lab-staff/
    │   ├── nurse/
    │   ├── pharmacist/
    │   ├── receptionist/
    │   └── records-staff/
    ├── services/
    │   └── api.js
    └── translations/
```

## 16. Important implementation boundaries

Hospital Dashboard UI work should remain independent from core business
behavior. Visual or layout changes must not modify:

- Common Login behavior.
- Backend authentication or JWT creation.
- Role permissions or route protection.
- PostgreSQL schema or database records.
- API endpoint contracts.
- Patient, appointment, medication, laboratory, emergency, billing, records,
  or HR calculations.
- Search and filtering logic.
- Existing handlers, permissions, and workflow transitions.

Prefer shared layout components, existing CSS variables, route helpers, and
reusable page components over duplicated role-specific implementations.

## 17. Verification checklist

Before releasing a change, verify:

- All ten role dashboards load.
- Unauthenticated users are redirected to Common Login.
- Cross-role dashboard access is denied.
- Expired and unknown sessions are rejected.
- Sidebar links preserve their role-specific destinations.
- Sidebar collapse and mobile drawer controls work.
- Branding remains visible and does not overlap the toggle.
- Long navigation lists scroll correctly.
- Global patient search opens and remains functional.
- Notification and profile menus remain usable.
- Sync controls remain interactive and accurate.
- Mock/offline indicators remain visible when applicable.
- Cards, tables, forms, dialogs, and buttons retain their handlers.
- No horizontal overflow appears at desktop, tablet, or mobile widths.
- Logo and favicon assets load correctly.
- API failures show an explicit offline or error state.
- Build, lint, and tests pass.

## 18. Validation commands

```bash
npm --prefix HOSPITAL_DASHBOARD run build
npm --prefix HOSPITAL_DASHBOARD run lint
npm --prefix HOSPITAL_DASHBOARD test
```

For responsive checks, inspect at approximately:

- 1536px desktop.
- 1366px laptop.
- 1280px desktop.
- 1024px tablet landscape.
- 768px tablet.
- 390px mobile.

Existing warnings should be evaluated separately from new changes. A
presentation-only change must not be described as fixing authentication,
backend, or clinical workflow defects.

## 19. Production considerations

Before production deployment:

- Replace development and mock accounts with managed authentication.
- Verify backend authorization for every read and write operation.
- Use production API URLs and HTTPS.
- Confirm token expiration and logout behavior.
- Remove or isolate representative mock data.
- Add server-side audit logging for sensitive clinical operations.
- Review patient-data privacy, retention, and access policies.
- Confirm that offline synchronization cannot overwrite newer backend data.
- Monitor API failures, synchronization failures, and critical-alert delivery.
- Run accessibility, browser, security, and end-to-end workflow testing.

