import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Auth & Layout
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';

// Role Dashboards
import AdminDashboard from './pages/dashboards/AdminDashboard';
import DoctorDashboard from './pages/dashboards/DoctorDashboard';
import NurseDashboard from './pages/dashboards/NurseDashboard';
import ReceptionDashboard from './pages/dashboards/ReceptionDashboard';
import LabDashboard from './pages/dashboards/LabDashboard';
import PharmacyDashboard from './pages/dashboards/PharmacyDashboard';
import BillingDashboard from './pages/dashboards/BillingDashboard';
import RecordsDashboard from './pages/dashboards/RecordsDashboard';
import EmergencyDashboard from './pages/dashboards/EmergencyDashboard';
import HRDashboard from './pages/dashboards/HRDashboard';

// Shared Pages
import PatientsPage from './pages/PatientsPage';
import PatientProfile from './pages/PatientProfile';
import AppointmentsPage from './pages/AppointmentsPage';
import DoctorsPage from './pages/DoctorsPage';
import DoctorProfile from './pages/DoctorProfile';
import StaffPage from './pages/StaffPage';
import OPDPage from './pages/OPDPage';
import ConsultationsPage from './pages/ConsultationsPage';
import EmergencyPage from './pages/EmergencyPage';
import WardsPage from './pages/WardsPage';
import PharmacyPage from './pages/PharmacyPage';
import InventoryPage from './pages/InventoryPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import ReferralsPage from './pages/ReferralsPage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import DiagnosticsPage from './pages/DiagnosticsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AmbulancePage from './pages/AmbulancePage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import BillingPage from './pages/BillingPage';
import HRPage from './pages/HRPage';
import AuditLogsPage from './pages/AuditLogsPage';
import DepartmentsPage from './pages/DepartmentsPage';
import TelemedicinePage from './pages/TelemedicinePage';
import ShiftsPage from './pages/ShiftsPage';
import DataSyncPage from './pages/DataSyncPage';
import ReportsPage from './pages/ReportsPage';
import NotFoundPage from './pages/NotFoundPage';

function AccessDeniedScreen({ message, redirectUrl, redirectLabel, secondaryUrl, secondaryLabel }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0f1d',
      color: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#131e3a',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        borderRadius: '1rem',
        maxWidth: '460px',
        width: '100%',
        textAlign: 'center',
        padding: '2.25rem',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
      }}>
        <div style={{
          width: '4rem',
          height: '4rem',
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#f87171',
          borderRadius: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          fontSize: '2rem',
          fontWeight: 900
        }}>✕</div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f87171', marginBottom: '0.25rem' }}>
          Access Denied / அனுமதி மறுக்கப்பட்டது
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6, margin: '1rem 0 1.75rem' }}>
          {message}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {redirectUrl && (
            <a
              href={redirectUrl}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.75rem',
                background: '#0284c7',
                color: '#ffffff',
                fontWeight: 700,
                borderRadius: '0.75rem',
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'background 0.2s'
              }}
            >
              {redirectLabel || 'Proceed'}
            </a>
          )}
          <a
            href={secondaryUrl || 'http://localhost:3000'}
            style={{
              display: 'block',
              width: '100%',
              padding: '0.75rem',
              background: '#334155',
              color: '#e2e8f0',
              fontWeight: 700,
              borderRadius: '0.75rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              transition: 'background 0.2s'
            }}
          >
            {secondaryLabel || 'Return to Common Login (:3000) / பொது உள்நுழைவு'}
          </a>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// RequireAuth — named component
// Validates authentication, cross-role protection, and role match.
// ─────────────────────────────────────────────────────────────────
function RequireAuth({ role }) {
  const { isAuthenticated, user, accessDenied } = useAuth();

  if (accessDenied?.isDenied) {
    return (
      <AccessDeniedScreen
        message={accessDenied.message}
        redirectUrl={accessDenied.redirectUrl}
        redirectLabel={accessDenied.redirectLabel}
      />
    );
  }

  if (!isAuthenticated || !user) {
    window.location.replace('http://localhost:3000');
    return null;
  }

  const isRoleMatch = !role || user?.roleId === role ||
    (role === 'receptionist' && user?.roleId === 'reception') ||
    (role === 'reception' && user?.roleId === 'receptionist');

  if (!isRoleMatch) {
    return (
      <AccessDeniedScreen
        message={`Access Denied / அனுமதி மறுக்கப்பட்டது: Your authenticated role is '${user?.roleName || user?.role}'. You are not authorized to access the ${role.toUpperCase()} dashboard.`}
        redirectUrl={user?.dashboardPath}
        redirectLabel={`Go to Your Dashboard (${user?.roleName || user?.role})`}
      />
    );
  }

  return <DashboardLayout />;
}

// ─────────────────────────────────────────────────────────────────
// RootRedirect — sends authenticated user to their dashboard
// ─────────────────────────────────────────────────────────────────
function RootRedirect() {
  const { isAuthenticated, user, accessDenied } = useAuth();

  if (accessDenied?.isDenied) {
    return (
      <AccessDeniedScreen
        message={accessDenied.message}
        redirectUrl={accessDenied.redirectUrl}
        redirectLabel={accessDenied.redirectLabel}
      />
    );
  }

  if (isAuthenticated && user?.dashboardPath) {
    return <Navigate to={user.dashboardPath} replace />;
  }

  window.location.replace('http://localhost:3000');
  return null;
}

// ─────────────────────────────────────────────────────────────────
// ROUTING STRUCTURE — matches sidebar link generation exactly.
//
// Sidebar uses:  base = ROLE_ROUTES[roleId]  (e.g. '/hr/dashboard')
//   sub-links:   `${base}/employees`  →  '/hr/dashboard/employees'
//
// So routes MUST be nested as:
//   /hr  →  RequireAuth (DashboardLayout + Outlet)
//     /dashboard  →  HRDashboard
//     /dashboard/employees → StaffPage
//     /dashboard/...
//
// Same pattern applies to all 10 roles.
// ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public ──────────────────────────────────────────────── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RootRedirect />} />

        {/* ════════════════════════════════════════════════════════════
            ADMIN  —  base: /admin/dashboard
        ════════════════════════════════════════════════════════════ */}
        <Route path="/admin" element={<RequireAuth role="admin" />}>
          {/* /admin → /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          {/* /admin/dashboard (index) */}
          <Route path="dashboard">
            <Route index element={<AdminDashboard />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="patients/:id" element={<PatientProfile />} />
            <Route path="inpatients" element={<Navigate to="../patients" replace />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="doctors/:id" element={<DoctorProfile />} />
            <Route path="nurses" element={<StaffPage />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="opd" element={<OPDPage />} />
            <Route path="consultations" element={<ConsultationsPage />} />
            <Route path="referrals" element={<ReferralsPage />} />
            <Route path="prescriptions" element={<PrescriptionsPage />} />
            <Route path="lab" element={<DiagnosticsPage />} />
            <Route path="pharmacy" element={<PharmacyPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="records" element={<MedicalRecordsPage />} />
            <Route path="wards" element={<WardsPage />} />
            <Route path="emergency" element={<EmergencyPage />} />
            <Route path="ambulance" element={<AmbulancePage />} />
            <Route path="billing" element={<InventoryPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="telemedicine" element={<TelemedicinePage />} />
            <Route path="shifts" element={<ShiftsPage />} />
            <Route path="sync" element={<DataSyncPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="audit" element={<AuditLogsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
        </Route>

        {/* ════════════════════════════════════════════════════════════
            DOCTOR  —  base: /doctor/dashboard
        ════════════════════════════════════════════════════════════ */}
        <Route path="/doctor" element={<RequireAuth role="doctor" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard">
            <Route index element={<DoctorDashboard />} />
            <Route path="search" element={<DoctorDashboard initialSection="search" />} />
            <Route path="patients" element={<DoctorDashboard initialSection="patients" />} />
            <Route path="patients/:id" element={<DoctorDashboard initialSection="search" />} />
            <Route path="appointments" element={<DoctorDashboard initialSection="appointments" />} />
            <Route path="medicines" element={<DoctorDashboard initialSection="medicines" />} />
            <Route path="consultations" element={<DoctorDashboard initialSection="consultation" />} />
            <Route path="telemedicine" element={<TelemedicinePage />} />
            <Route path="diagnosis" element={<DoctorDashboard initialSection="consultation" />} />
            <Route path="prescriptions" element={<DoctorDashboard initialSection="medicines" />} />
            <Route path="lab-orders" element={<DiagnosticsPage />} />
            <Route path="lab-results" element={<DiagnosticsPage />} />
            <Route path="referrals" element={<ReferralsPage />} />
            <Route path="followups" element={<DoctorDashboard initialSection="appointments" />} />
            <Route path="records" element={<MedicalRecordsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
        </Route>

        {/* ════════════════════════════════════════════════════════════
            NURSE  —  base: /nurse/dashboard
        ════════════════════════════════════════════════════════════ */}
        <Route path="/nurse" element={<RequireAuth role="nurse" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard">
            <Route index element={<NurseDashboard />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="patients/:id" element={<PatientProfile />} />
            <Route path="ward" element={<WardsPage />} />
            <Route path="vitals" element={<Navigate to="../patients" replace />} />
            <Route path="medications" element={<NurseDashboard />} />
            <Route path="notes" element={<MedicalRecordsPage />} />
            <Route path="orders" element={<ConsultationsPage />} />
            <Route path="procedures" element={<ConsultationsPage />} />
            <Route path="emergency" element={<EmergencyPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
        </Route>

        {/* ════════════════════════════════════════════════════════════
            RECEPTIONIST  —  base: /receptionist/dashboard
        ════════════════════════════════════════════════════════════ */}
        <Route path="/receptionist" element={<RequireAuth role="receptionist" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard">
            <Route index element={<ReceptionDashboard />} />
            <Route path="add-patient" element={<ReceptionDashboard initialTab="add-patient" />} />
            <Route path="patients" element={<ReceptionDashboard initialTab="patients" />} />
            <Route path="patients/:id" element={<ReceptionDashboard initialTab="patients" />} />
            <Route path="op-card" element={<ReceptionDashboard initialTab="op-card" />} />
            <Route path="appointments" element={<ReceptionDashboard initialTab="appointments" />} />
            <Route path="register" element={<ReceptionDashboard initialTab="add-patient" />} />
          </Route>
        </Route>

        {/* Legacy / Alias redirects for /reception */}
        <Route path="/reception" element={<Navigate to="/receptionist/dashboard" replace />} />
        <Route path="/reception/dashboard" element={<Navigate to="/receptionist/dashboard" replace />} />
        <Route path="/reception/dashboard/*" element={<Navigate to="/receptionist/dashboard" replace />} />

        {/* ════════════════════════════════════════════════════════════
            LAB  —  base: /lab/dashboard
        ════════════════════════════════════════════════════════════ */}
        <Route path="/lab" element={<RequireAuth role="lab" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard">
            <Route index element={<LabDashboard />} />
            <Route path="orders" element={<DiagnosticsPage />} />
            <Route path="samples" element={<DiagnosticsPage />} />
            <Route path="in-progress" element={<DiagnosticsPage />} />
            <Route path="results" element={<DiagnosticsPage />} />
            <Route path="critical" element={<DiagnosticsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
        </Route>

        {/* ════════════════════════════════════════════════════════════
            PHARMACY  —  base: /pharmacy/dashboard
        ════════════════════════════════════════════════════════════ */}
        <Route path="/pharmacy" element={<RequireAuth role="pharmacy" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard">
            <Route index element={<PharmacyDashboard />} />
            <Route path="inventory" element={<PharmacyDashboard initialTab="inventory" />} />
            <Route path="low-stock" element={<PharmacyDashboard initialTab="low-stock" />} />
            <Route path="stock-alerts" element={<PharmacyDashboard initialTab="stock-alerts" />} />
            <Route path="expiry" element={<PharmacyDashboard initialTab="expiry" />} />
            <Route path="prescriptions" element={<Navigate to="../inventory" replace />} />
            <Route path="dispense" element={<Navigate to="../inventory" replace />} />
            <Route path="suppliers" element={<PharmacyDashboard initialTab="inventory" />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
        </Route>

        {/* ════════════════════════════════════════════════════════════
            BILLING  —  base: /billing/dashboard
        ════════════════════════════════════════════════════════════ */}
        <Route path="/billing" element={<RequireAuth role="billing" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard">
            <Route index element={<BillingDashboard />} />
            <Route path="bills" element={<BillingPage />} />
            <Route path="payments" element={<BillingPage />} />
            <Route path="pending" element={<BillingPage />} />
            <Route path="insurance" element={<BillingPage />} />
            <Route path="refunds" element={<BillingPage />} />
            <Route path="reports" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
        </Route>

        {/* ════════════════════════════════════════════════════════════
            RECORDS  —  base: /records/dashboard
        ════════════════════════════════════════════════════════════ */}
        <Route path="/records" element={<RequireAuth role="records" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard">
            <Route index element={<RecordsDashboard />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="patients/:id" element={<PatientProfile />} />
            <Route path="history" element={<MedicalRecordsPage />} />
            <Route path="documents" element={<MedicalRecordsPage />} />
            <Route path="requests" element={<MedicalRecordsPage />} />
            <Route path="access-log" element={<SettingsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
        </Route>

        {/* ════════════════════════════════════════════════════════════
            EMERGENCY  —  base: /emergency/dashboard
        ════════════════════════════════════════════════════════════ */}
        <Route path="/emergency" element={<RequireAuth role="emergency" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard">
            <Route index element={<EmergencyDashboard />} />
            <Route path="cases" element={<EmergencyPage />} />
            <Route path="triage" element={<EmergencyPage />} />
            <Route path="critical" element={<EmergencyPage />} />
            <Route path="beds" element={<WardsPage />} />
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="diagnostics" element={<DiagnosticsPage />} />
            <Route path="transfers" element={<ReferralsPage />} />
            <Route path="discharge" element={<PatientsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
        </Route>

        {/* ════════════════════════════════════════════════════════════
            HR  —  base: /hr/dashboard
            Full list matches sidebar nav generated paths exactly:
              /hr/dashboard/employees
              /hr/dashboard/doctors
              /hr/dashboard/nurses
              /hr/dashboard/departments
              /hr/dashboard/shifts
              /hr/dashboard/attendance
              /hr/dashboard/leave
              /hr/dashboard/assignments
              /hr/dashboard/reports
              /hr/dashboard/settings
              /hr/dashboard/profile
              /hr/dashboard/notifications
        ════════════════════════════════════════════════════════════ */}
        <Route path="/hr" element={<RequireAuth role="hr" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard">
            <Route index element={<HRDashboard />} />
            <Route path="employees" element={<HRPage />} />
            <Route path="doctors" element={<HRPage />} />
            <Route path="nurses" element={<HRPage />} />
            <Route path="departments" element={<HRPage />} />
            <Route path="shifts" element={<HRPage />} />
            <Route path="attendance" element={<HRPage />} />
            <Route path="leave" element={<HRPage />} />
            <Route path="assignments" element={<HRPage />} />
            <Route path="reports" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
        </Route>

        {/* ── 404 — must be last ─────────────────────────────────── */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}
