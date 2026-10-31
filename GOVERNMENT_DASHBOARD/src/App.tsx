import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HealthDataProvider } from './context/HealthDataContext';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Overview from './pages/Overview';
import DistrictMonitoring from './pages/DistrictMonitoring';
import VillageHealthMap from './pages/VillageHealthMap';
import GovernmentHospitals from './pages/HospitalsPHCs';
import PatientMonitoring from './pages/PatientMonitoring';
import PatientAnalytics from './pages/PatientAnalytics';
import DoctorManagement from './pages/DoctorManagement';
import SmartHealthCamps from './pages/SmartHealthCamps';
import ResourceOptimization from './pages/ResourceOptimization';
import Telemedicine from './pages/Telemedicine';
import DiagnosticMonitoring from './pages/DiagnosticMonitoring';
import MedicineAvailability from './pages/MedicineAvailability';
import BedsResources from './pages/BedsResources';
import EmergencySupplies from './pages/EmergencySupplies';
import AccessibilityRanking from './pages/AccessibilityRanking';
import Reports from './pages/Reports';
import AuditLogs from './pages/AuditLogs';
import DiseaseAlerts from './pages/DiseaseAlerts';
import DiseaseSurveillance from './pages/DiseaseSurveillance';
import AIPrediction from './pages/AIPrediction';
import MaternalChildHealth from './pages/MaternalChildHealth';
import Vaccination from './pages/Vaccination';
import Administration from './pages/Administration';

// State Admin Pages
import StateOverview from './pages/state/StateOverview';
import DistrictComparison from './pages/state/DistrictComparison';
import StateResources from './pages/state/StateResources';
import StateCampOversight from './pages/state/StateCampOversight';
import StateRequests from './pages/state/StateRequests';
import StateReports from './pages/state/StateReports';
import StateSurveillance from './pages/state/StateSurveillance';
import StateFacilities from './pages/state/StateFacilities';
import StateMedicine from './pages/state/StateMedicine';
import StateBlood from './pages/state/StateBlood';
import StateAnnouncements from './pages/state/StateAnnouncements';

// District Admin Pages
import DistrictOverview from './pages/district/DistrictOverview';
import CampManagement from './pages/district/CampManagement';
import CommunityRequests from './pages/district/CommunityRequests';
import MedicineDiagnostics from './pages/district/MedicineDiagnostics';
import BloodManagement from './pages/district/BloodManagement';
import AppointmentsQueue from './pages/district/AppointmentsQueue';
import Referrals from './pages/district/Referrals';
import FollowUps from './pages/district/FollowUps';
import Notifications from './pages/district/Notifications';
import DistrictReports from './pages/district/DistrictReports';
import DistrictHospitalsPHCs from './pages/district/DistrictHospitalsPHCs';
import VillageMonitoring from './pages/district/VillageMonitoring';
import DiagnosticAvailability from './pages/district/DiagnosticAvailability';

function App() {
  return (
    <HealthDataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Main Dashboard Layout */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            
            {/* State Admin Workspace Routes */}
            <Route path="state" element={<StateOverview />} />
            <Route path="state/overview" element={<StateOverview />} />
            <Route path="state/districts" element={<DistrictComparison />} />
            <Route path="state/surveillance" element={<StateSurveillance />} />
            <Route path="state/facilities" element={<StateFacilities />} />
            <Route path="state/medicines" element={<StateMedicine />} />
            <Route path="state/blood" element={<StateBlood />} />
            <Route path="state/resources" element={<StateResources />} />
            <Route path="state/camps" element={<StateCampOversight />} />
            <Route path="state/requests" element={<StateRequests />} />
            <Route path="state/announcements" element={<StateAnnouncements />} />
            <Route path="state/reports" element={<StateReports />} />

            {/* District Admin Workspace Routes */}
            <Route path="district" element={<DistrictOverview />} />
            <Route path="district/overview" element={<DistrictOverview />} />
            <Route path="district/hospitals" element={<DistrictHospitalsPHCs />} />
            <Route path="district/villages" element={<VillageMonitoring />} />
            <Route path="district/camps" element={<CampManagement />} />
            <Route path="district/community-requests" element={<CommunityRequests />} />
            <Route path="district/medicines" element={<MedicineDiagnostics />} />
            <Route path="district/diagnostics" element={<DiagnosticAvailability />} />
            <Route path="district/blood" element={<BloodManagement />} />
            <Route path="district/queue" element={<AppointmentsQueue />} />
            <Route path="district/referrals" element={<Referrals />} />
            <Route path="district/follow-ups" element={<FollowUps />} />
            <Route path="district/notifications" element={<Notifications />} />
            <Route path="district/reports" element={<DistrictReports />} />

            {/* Geographic & Facility Network */}
            <Route path="district-map" element={<DistrictMonitoring />} />
            <Route path="village-map" element={<VillageHealthMap />} />
            <Route path="hospitals" element={<GovernmentHospitals />} />

            {/* People & Demographics */}
            <Route path="patients" element={<PatientMonitoring />} />
            <Route path="patient-analytics" element={<PatientAnalytics />} />
            <Route path="doctors" element={<DoctorManagement />} />

            {/* Planning & Optimization (SIH 2026 Mandate) */}
            <Route path="health-camps" element={<SmartHealthCamps />} />
            <Route path="resource-optimization" element={<ResourceOptimization />} />

            {/* Services & Logistics */}
            <Route path="telemedicine" element={<Telemedicine />} />
            <Route path="diagnostics" element={<DiagnosticMonitoring />} />
            <Route path="medicine" element={<MedicineAvailability />} />
            <Route path="beds-resources" element={<BedsResources />} />
            <Route path="emergency-supplies" element={<EmergencySupplies />} />
            <Route path="blood-bank" element={<Navigate to="/dashboard/emergency-supplies" replace />} />

            {/* Analytics & Surveillance */}
            <Route path="accessibility" element={<AccessibilityRanking />} />
            <Route path="surveillance" element={<DiseaseSurveillance />} />
            <Route path="ai-prediction" element={<AIPrediction />} />
            <Route path="maternal-child" element={<MaternalChildHealth />} />
            <Route path="vaccination" element={<Vaccination />} />

            {/* Reports, Audits & Alerts */}
            <Route path="reports" element={<Reports />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="alerts" element={<DiseaseAlerts />} />
            <Route path="administration" element={<Administration />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </HealthDataProvider>
  );
}

export default App;
