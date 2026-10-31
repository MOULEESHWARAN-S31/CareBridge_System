# CareBridge System — Full Application Overview

## 1. Product summary

CareBridge is an integrated public-health platform that connects citizens,
healthcare facilities, hospital staff, government health officers, and master
administrators through a shared backend and PostgreSQL data layer.

The platform is organized into five user-facing applications:

1. **CareBridge Patient App** — Flutter mobile and web experience for citizens.
2. **Common Login** — shared authentication entry point for staff and government
   users.
3. **Admin Dashboard** — master administration for users, facilities, stores,
   roles, and operational data.
4. **Government Dashboard** — state and district public-health monitoring.
5. **Hospital Dashboard** — role-specific hospital operations for Government
   District Hospital - Salem.

All applications communicate with the unified Node.js/Express REST API.
Frontends do not connect directly to PostgreSQL.

## 2. System architecture

```text
┌──────────────────────┐
│   CareBridge Patient │
│   App (Flutter)      │
└──────────┬───────────┘
           │
┌──────────▼───────────┐      ┌──────────────────────┐
│ Common Login Portal  │      │ Admin Dashboard      │
│ Shared authentication│      │ Master administration│
└──────────┬───────────┘      └──────────┬───────────┘
           │                              │
           ├──────────────┬───────────────┤
           │              │               │
┌──────────▼──────────┐ ┌─▼─────────────┐ ┌▼────────────────┐
│ Government Dashboard│ │ Hospital      │ │ REST API        │
│ State/district      │ │ Dashboard     │ │ Node + Express  │
│ public health       │ │ Clinical ops  │ │ JWT + RBAC      │
└─────────────────────┘ └───────────────┘ └────────┬───────┘
                                                   │
                                         ┌─────────▼─────────┐
                                         │ PostgreSQL         │
                                         │ carebridge_db      │
                                         └────────────────────┘
```

### Architectural principles

- **Centralized data access:** database operations pass through the backend API.
- **Shared authentication:** Common Login is the staff and government entry
  point.
- **Backend authorization:** role and geographic permissions are enforced on
  protected API routes.
- **Frontend route protection:** each dashboard also guards its own routes for
  appropriate user experience.
- **Offline resilience:** selected frontends include local or mock fallback data
  when the backend is unavailable.
- **Feature separation:** patient, hospital, government, and master-admin
  workflows remain separate while using shared identifiers and services.

## 3. Application inventory

| Application | Directory | Local URL | Technology | Primary users |
| --- | --- | --- | --- | --- |
| Common Login | `LOGIN/` | `http://localhost:3000` | HTML, CSS, JavaScript | Staff and government users |
| Admin Dashboard | `ADMIN_DASHBOARD/` | `http://localhost:5173` | Vanilla JavaScript and CSS | Master administrators |
| Government Dashboard | `GOVERNMENT_DASHBOARD/` | `http://localhost:5174` | React, TypeScript, Vite | State and district officers |
| Hospital Dashboard | `HOSPITAL_DASHBOARD/` | `http://localhost:5175` | React, JavaScript, Vite | Hospital staff |
| Patient App | `CARE_BRIDGE/` | Flutter web default port | Flutter and Dart | Patients and citizens |
| Unified API | `backend/` | `http://localhost:5000` | Node.js, Express, PostgreSQL client | All applications |
| Database | `database/` | PostgreSQL port `5432` | PostgreSQL | Backend persistence |

## 4. CareBridge Patient App

The Patient App is a Flutter application designed for citizens, including
patients in rural and underserved communities. It supports Android, iOS,
desktop targets supported by Flutter, and web development.

### Patient navigation

Authenticated users enter a five-tab application shell:

1. **Home**
2. **Appointments**
3. **Care**
4. **Records**
5. **Profile**

The shell uses an indexed stack so tab state is preserved while the user
navigates between primary areas.

### Patient onboarding and authentication

The app includes:

- Splash screen.
- First-run onboarding.
- Patient login flow.
- OTP verification screen.
- Session restoration.
- Optional patient profile setup.
- Logout and session clearing.
- Persistent onboarding and profile state.

`SessionService` stores session state using `shared_preferences`, with an
in-memory fallback for tests and headless environments. It also stores:

- Authenticated user data.
- Active ABHA profile.
- Assigned healthcare facility.
- Last visited facility.
- Location setup completion.
- Emergency contacts.
- Preferred language.

### ABHA and patient identity

The ABHA workflow supports:

- Mobile-number lookup.
- No-profile handling.
- Single-profile selection.
- Family profile selection.
- Active ABHA profile persistence.
- Profile display through the patient account area.

The app contains API and mock repositories so ABHA flows can be exercised
without requiring a live backend in every development scenario.

### Home dashboard

The patient home screen provides:

- Personalized greeting.
- Profile and notification access.
- Quick actions for common healthcare tasks.
- Appointment summary and status.
- Referral updates.
- Public-health alerts.
- Medicine availability information.
- Health-camp information where available in the active data source.
- Emergency assistance.
- CareBridge assistant entry point.
- Nearby facility access.

### Facility and doctor discovery

The discovery workflows support:

- Healthcare facility search.
- Doctor search.
- District and taluk selection.
- Location-aware facility discovery.
- Distance sorting.
- Facility detail views.
- Doctor specialization and availability information.
- Emergency facility discovery.

The location layer uses `geolocator`, with a location permission screen and a
nearest-facility screen. Location access should be treated as optional and must
fail gracefully when permission is denied.

### Appointments and OPD access

Appointment workflows include:

- District selection.
- Hospital selection.
- Doctor selection.
- Available date and time selection.
- Appointment summary.
- Booking confirmation.
- Appointment history.
- OPD appointment and token information.
- Downloadable or shareable appointment/OPD pass behavior where supported.

The app has API-backed and mock appointment repositories. Backend appointment
operations are exposed through the unified API.

### Teleconsultation

The teleconsultation feature includes:

- Teleconsultation discovery.
- Doctor detail modal.
- Consultation booking.
- Consultation detail model.
- Consultation call screen.
- Teleconsultation repository abstraction.
- Mock teleconsultation repository.

External video-provider readiness and production call delivery should be
verified separately from the UI flow.

### Health records and personal health information

The records area supports:

- Health record list.
- Record detail view.
- Diagnostic reports.
- Prescriptions.
- Vaccination information.
- Doctor notes.
- Manual laboratory entry.
- Document selection.
- Medicine-order models and order screen.

Record and prescription workflows use shared patient identifiers and can consume
backend data when available. Any local fallback data must be clearly separated
from authoritative clinical records.

### Medicines and orders

The Patient App includes:

- Prescription-based medicine ordering.
- Medicine order summary.
- Medicine availability display.
- Backend medicine-order integration.

An order being submitted is not the same as a pharmacy fulfillment. Production
workflows should track acceptance, dispatch, delivery, and cancellation
separately.

### Emergency support

Emergency functionality includes:

- Emergency assistance dialog.
- Emergency contact management.
- Emergency contact persistence.
- Emergency contact calling through `url_launcher`.
- Emergency contact API operations.
- Facility discovery for urgent care.

Emergency UI should not be interpreted as a replacement for local emergency
services. Any provider or ambulance integration must be verified independently.

### Profile and personal settings

The profile area includes:

- Patient identity and profile information.
- ABHA card dialog.
- OPD card dialog.
- Emergency contacts.
- Preferred language.
- Session/logout actions.

### Patient localization and accessibility

The Patient App contains generated/localized resources for Indian languages,
including English, Tamil, Hindi, Bengali, Gujarati, Kannada, Malayalam,
Marathi, Telugu, Urdu, Punjabi, Odia, Assamese, Sanskrit, Nepali, Marathi
variants, and other configured locales.

The application also includes:

- Flutter material, widget, and Cupertino localization delegates.
- Runtime language selection.
- Persisted preferred language.
- RTL support where required.
- Text scale clamping up to 1.6x.
- Accessibility helper utilities.
- Large touch-friendly shared controls.
- Responsive layouts for mobile and web.

The Government Dashboard is intentionally English-only; Patient App
localization must not be removed or conflated with Government Dashboard
language policy.

## 5. Common Login Portal

Common Login is the shared authentication gateway for:

- Master Admin.
- Government Health Officer.
- Hospital Administrator.
- Doctor.
- Nurse.
- Receptionist.
- Laboratory Staff.
- Pharmacist.
- Billing Staff.
- Medical Records Staff.
- Emergency Staff.
- HR Manager.

The login flow:

1. Collects the user's identifier, role selection, and password.
2. Sends credentials to `POST /api/auth/login`.
3. Receives a backend-signed JWT and user object.
4. Stores the session according to the selected persistence option.
5. Redirects to the dashboard associated with the verified role.

The portal must not bypass backend password verification or infer permissions
from an editable URL. Development demo credentials are for local evaluation
only and must not be used in production.

## 6. Admin Dashboard

The Admin Dashboard is the master administration portal. It provides:

- User account management.
- Hospital and facility management.
- Medical store and pharmacy management.
- Role and permission administration.
- Activity and audit records.
- Hospital bulk import.
- Medical-store bulk import.
- Search and filtering.
- Administrative modals and drawers.
- Responsive sidebar and header.

The Admin Dashboard is restricted to the `ADMIN` role. It preserves
authentication, logout, navigation, and backend integrations while providing
master-level management capabilities.

## 7. Government Dashboard

The Government Dashboard is a React and TypeScript application for public-health
administration. It supports state and district workspaces.

### State and district capabilities

The dashboard includes modules for:

- State overview.
- District comparison.
- State facilities.
- State resources.
- State health-camp oversight.
- State requests.
- State medicines.
- State announcements.
- District overview.
- District hospitals and PHCs.
- Village and block monitoring.
- Community health requests.
- District health camps.
- District medicine and diagnostics.
- Blood management.
- Appointment queue.
- Referral tracking.
- High-risk follow-ups.
- District notifications.
- District reports.
- Audit logs.

Additional monitoring modules include:

- Disease surveillance.
- Diagnostic monitoring.
- Medicine availability.
- Bed and resource monitoring.
- Emergency supplies.
- Vaccination.
- Maternal and child health.
- Telemedicine.
- Accessibility ranking.
- Reports and dashboards.

### Government authorization

Government API access uses:

- JWT authentication.
- `GOVERNMENT` role validation.
- State versus district scope derived from server-side user data.
- District filtering for district administrators.
- Statewide access only for authorized state assignments.
- HTTP 403 responses for unauthorized cross-district access.

Frontend workspace controls are not authoritative. Backend middleware must
enforce every protected read and write.

### Government data lifecycle

The backend contains persistent tables for:

- Camp proposals.
- Community camp requests.
- Government resource requests.
- Government medicine requisitions.
- Government audit events.
- Government announcements.

These workflows support drafts, review, approval, scheduling, publication, and
audit-related states where implemented. Patient-facing publication and external
delivery-provider acknowledgment require separate integration verification.

### AI boundary

AI-related Government pages and services are intentionally preserved as a
separate capability area. Non-AI Government security and workflow work must not
modify AI models, datasets, predictions, recommendations, risk scores, or AI
endpoints.

## 8. Hospital Dashboard

The Hospital Dashboard is a React and Vite hospital management system for
Government District Hospital - Salem (`GDH-SALEM-01`).

It supports ten hospital roles:

- Hospital Administrator.
- Doctor.
- Nurse.
- Receptionist.
- Laboratory Staff.
- Pharmacist.
- Billing Staff.
- Medical Records Staff.
- Emergency Staff.
- HR Manager.

Shared hospital capabilities include:

- Patient search and profiles.
- Appointments and OPD queues.
- Doctors and departments.
- Wards and beds.
- Consultations.
- Prescriptions.
- Diagnostics and laboratory reports.
- Pharmacy and inventory.
- Referrals.
- Telemedicine.
- Emergency care.
- Ambulance fleet.
- Billing.
- Medical records.
- Staff and shift rosters.
- Analytics and reports.
- Notifications.
- Data synchronization.
- Audit logs.
- Profile and settings.

The shared hospital shell provides:

- CareBridge logo sidebar.
- Role-specific navigation.
- Collapsible desktop sidebar.
- Mobile navigation drawer.
- Hospital header.
- Global search.
- Notification and critical-lab alerts.
- Profile menu and logout.
- Responsive cards, tables, forms, and dialogs.

Hospital role routes are protected in the frontend and cross-dashboard access
is rejected when the authenticated role is not authorized for the requested
workspace.

## 9. Unified backend API

The backend is a Node.js/Express service using PostgreSQL through `pg`.
Authentication uses bcrypt-compatible password verification and signed JWTs.

### API areas

The backend exposes operations for:

- Authentication and current-user lookup.
- User management.
- ABHA profile lookup and registration.
- Hospital and facility discovery.
- Doctor directories and slots.
- Appointments.
- Teleconsultations.
- Medical stores.
- Prescriptions and medicine orders.
- Medical records and laboratory reports.
- Emergency contacts.
- OPD cards.
- Health alerts.
- Health camps.
- Referrals.
- Notifications.
- Statistics and KPIs.
- Hospital overview and beds.
- Hospital patient search.
- Government camps and community requests.
- Government resources and medicine requisitions.
- Government announcements and audit events.
- Translation and assistant services.

### Authentication and middleware

Backend protection is implemented through:

- JWT authentication middleware.
- Role middleware for Admin and hospital operations.
- Government scope middleware for state/district access.
- Error handling middleware.
- Parameterized PostgreSQL queries.

Client applications should treat a successful HTTP response as an operation
result only when the response represents the intended persisted state. Offline
fallbacks must not be presented as confirmed backend writes.

## 10. PostgreSQL data layer

The database stores shared platform data such as:

- Users and roles.
- Hospitals and facilities.
- Doctors.
- Patients and ABHA profiles.
- Appointments.
- OPD cards.
- Prescriptions and medicine orders.
- Medical records and laboratory reports.
- Teleconsultations.
- Emergency contacts.
- Health alerts and health camps.
- Referrals and notifications.
- Government operational tables.
- Translation data and audit-related data.

Database initialization and migrations are maintained under `database/` and
`backend/scripts/`. Environment-specific database URLs must remain in
environment variables and must not be committed.

## 11. Cross-application data flow

### Patient to hospital

1. Patient discovers a facility or doctor.
2. Patient books an appointment or OPD service.
3. Backend persists the appointment.
4. Hospital staff retrieve and manage the appointment.
5. Clinical staff update consultation, prescription, diagnostic, or record
   information through authorized workflows.

### Patient to government

The platform has Government-side community health request and camp-proposal
tables. A complete Patient App submission-to-publication workflow requires a
Patient App API client and backend endpoint that explicitly create and expose
those records. If that integration is not present, the workflow remains
partially integrated and must not be described as fully end-to-end.

### Admin to all workspaces

1. Admin creates or updates users, facilities, or stores.
2. Backend persists the authorized administrative change.
3. Common Login uses the resulting account data.
4. The user is redirected to the appropriate Government or Hospital workspace.

### Government to hospital and patient services

Government officers can monitor authorized aggregate information and coordinate
public-health operations. Access to individual clinical data should remain
limited to the minimum required operational information.

## 12. Security model

### Required controls

- Signed JWT validation.
- Password hashing and backend verification.
- Role-based API authorization.
- Government state/district scope enforcement.
- Frontend route protection.
- Parameterized database queries.
- CORS and environment configuration.
- Explicit unauthorized and expired-session handling.
- Audit records for Government administrative actions.

### Security boundaries

- Patients must not access staff dashboards.
- Hospital staff must not access Admin or Government workspaces without the
  appropriate role.
- District administrators must not access another district's protected
  Government records.
- District administrators must not perform state-only approvals or publishing.
- Admin-only management endpoints must reject Government and hospital roles.
- Audit records must not be treated as immutable unless immutability is
  technically enforced.

## 13. Offline and mock-data behavior

Several frontends include mock repositories or fallback datasets for:

- Patient records.
- Appointment listings.
- Facility and doctor discovery.
- Teleconsultations.
- Hospital operational data.
- Government dashboard metrics.

Mock data is useful for development and demonstrations but is not equivalent to
live persisted data. User interfaces should label simulated/offline content and
should not report a successful synchronization or delivery when only a local
fallback was used.

## 14. Accessibility and responsive design

Across the platform, the design system emphasizes:

- High-contrast surfaces and status colors.
- Large touch targets.
- Accessible labels and tooltips.
- Keyboard-friendly web controls.
- Responsive sidebars and navigation drawers.
- Flexible cards and tables.
- Text scaling support in Flutter.
- RTL-aware localization where configured.
- Explicit loading, empty, validation, and error states.

Responsive validation should cover:

- 1536px desktop.
- 1366px laptop.
- 1280px desktop.
- 1024px tablet landscape.
- 768px tablet.
- 390px mobile.

## 15. Repository structure

```text
CAREBRIDGE_SYSTEM/
├── ADMIN_DASHBOARD/
├── CARE_BRIDGE/
│   ├── android/
│   ├── ios/
│   ├── lib/
│   │   ├── app/
│   │   ├── core/
│   │   ├── features/
│   │   ├── l10n/
│   │   └── shared/
│   ├── test/
│   └── pubspec.yaml
├── GOVERNMENT_DASHBOARD/
├── HOSPITAL_DASHBOARD/
├── LOGIN/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   └── scripts/
├── database/
├── ADMIN_DASHBOARD_DESCRIPTION.md
├── HOSPITAL_DASHBOARD_DESCRIPTION.md
└── README.md
```

## 16. Development commands

### Backend

```bash
npm --prefix backend install
npm --prefix backend run db:setup
npm --prefix backend test
npm --prefix backend start
```

### Admin Dashboard

```bash
npm --prefix ADMIN_DASHBOARD install
npm --prefix ADMIN_DASHBOARD run build
```

### Government Dashboard

```bash
npm --prefix GOVERNMENT_DASHBOARD install
npm --prefix GOVERNMENT_DASHBOARD run dev
npm --prefix GOVERNMENT_DASHBOARD run build
npm --prefix GOVERNMENT_DASHBOARD run lint
npm --prefix GOVERNMENT_DASHBOARD test
```

### Hospital Dashboard

```bash
npm --prefix HOSPITAL_DASHBOARD install
npm --prefix HOSPITAL_DASHBOARD run dev
npm --prefix HOSPITAL_DASHBOARD run build
npm --prefix HOSPITAL_DASHBOARD run lint
npm --prefix HOSPITAL_DASHBOARD test
```

### Patient App

```bash
cd CARE_BRIDGE
flutter pub get
flutter analyze
flutter test
flutter run
```

For Android emulator testing, the Patient App defaults to
`http://10.0.2.2:5000/api`; web, Windows, macOS, iOS, and Linux default to
`http://localhost:5000/api`. The API base URL can be overridden through
`ApiService.customBaseUrl`.

## 17. Validation checklist

Before a platform release, verify:

- Backend health and database connectivity.
- Common Login success and failure handling.
- Every supported role redirects to the correct dashboard.
- Expired and invalid tokens are rejected.
- Cross-role access is denied.
- Government geographic scope is enforced server-side.
- Patient ABHA lookup scenarios work.
- Facility and doctor discovery work.
- Appointment creation and cancellation work.
- Hospital staff can retrieve authorized operational data.
- Government workflows persist and reload correctly.
- Notification and announcement statuses distinguish draft, approval,
  publication, provider acceptance, delivery, and failure.
- Offline/mock data is visibly labeled.
- Patient privacy is preserved in Government aggregate views.
- Critical alerts remain visible.
- Mobile navigation and forms work without horizontal overflow.
- Builds, linting, and automated tests pass.

## 18. Current implementation boundaries

The following areas require explicit verification before being described as
production-complete:

- Patient App submission of community health camp requests to Government tables.
- Government announcement delivery into the Patient App.
- SMS, IVR, push-notification, and provider acknowledgment workflows.
- Camp attendance and outcome synchronization from field operations.
- Complete medicine requisition fulfillment and inventory reconciliation.
- Complete referral status synchronization and follow-up escalation.
- Production teleconsultation provider integration.
- Immutable or tamper-evident audit storage.
- Full clinical privacy and compliance review.
- Removal of development credentials and mock records.

These boundaries are documentation requirements, not permission to silently
replace missing integrations with local success-shaped fallbacks.

## 19. Production readiness recommendations

Before production deployment:

1. Configure HTTPS, production CORS, secrets, and database credentials.
2. Replace development accounts and demo autofill controls.
3. Verify every protected read and write with role and scope tests.
4. Add end-to-end tests across Patient App, Hospital Dashboard, Government
   Dashboard, and backend.
5. Confirm clinical-data privacy, retention, consent, and audit requirements.
6. Add monitoring for API failures, synchronization failures, and critical
   alert delivery.
7. Verify offline conflict resolution and retry behavior.
8. Perform accessibility, security, load, and device compatibility testing.
9. Confirm disaster recovery and database backup procedures.
10. Document external dependencies and operational ownership for every
    notification, teleconsultation, and emergency integration.
