import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HealthDataProvider } from './context/HealthDataContext';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Overview from './pages/Overview';
import DistrictMonitoring from './pages/DistrictMonitoring';
import GovernmentHospitals from './pages/HospitalsPHCs';
import PatientMonitoring from './pages/PatientMonitoring';
import DoctorManagement from './pages/DoctorManagement';
import Telemedicine from './pages/Telemedicine';
import DiagnosticMonitoring from './pages/DiagnosticMonitoring';
import MedicineAvailability from './pages/MedicineAvailability';
import BedsResources from './pages/BedsResources';
import AccessibilityRanking from './pages/AccessibilityRanking';
import Reports from './pages/Reports';
import AuditLogs from './pages/AuditLogs';
import DiseaseAlerts from './pages/DiseaseAlerts';
import DiseaseSurveillance from './pages/DiseaseSurveillance';
import AIPrediction from './pages/AIPrediction';
import MaternalChildHealth from './pages/MaternalChildHealth';
import Vaccination from './pages/Vaccination';
import EmergencySupplies from './pages/EmergencySupplies';
import Administration from './pages/Administration';

function App() {
  return (
    <HealthDataProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Main Dashboard Layout */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            
            {/* Geographic & Facility Network */}
            <Route path="district-map" element={<DistrictMonitoring />} />
            <Route path="village-map" element={<DistrictMonitoring />} />
            <Route path="hospitals" element={<GovernmentHospitals />} />

            {/* People */}
            <Route path="patients" element={<PatientMonitoring />} />
            <Route path="patient-analytics" element={<PatientMonitoring />} />
            <Route path="doctors" element={<DoctorManagement />} />

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

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </HealthDataProvider>
  );
}

export default App;
