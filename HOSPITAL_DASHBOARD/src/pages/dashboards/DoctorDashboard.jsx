import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search, Users, Calendar, Stethoscope, Pill, FileText, FlaskConical,
  Clock, CheckCircle2, AlertTriangle, X, ChevronRight, ChevronDown,
  Printer, Download, ShieldCheck, Plus, Sparkles, AlertCircle,
  Eye, RefreshCw, Activity, ArrowRight, Check, Heart, HelpCircle
} from 'lucide-react';
import {
  PATIENTS,
  MEDICINES,
  DOCTOR_APPOINTMENTS_DATA,
  getPatientClinicalData,
  HOSPITAL_INFO
} from '../../data/mockData';
import PatientSearchGateway from '../../components/PatientSearchGateway';

// Configurable Tamil Nadu OP ID convention format description
const OP_ID_FORMAT_INFO = {
  prefix: 'TN-OP-',
  pattern: '^TN-OP-\\d{5,}$',
  placeholder: 'TN-OP-XXXXXXXX or CB10024 / PAT001',
  description: 'Tamil Nadu Government Hospital OP-Registration Convention'
};

export default function DoctorDashboard({ initialSection = 'overview' }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Active section: 'overview' | 'search' | 'patients' | 'appointments' | 'medicines' | 'consultation'
  const [activeSection, setActiveSection] = useState(() => {
    const urlSection = searchParams.get('section');
    return urlSection || initialSection;
  });

  // OP ID / Patient ID Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchState, setSearchState] = useState('idle'); // 'idle' | 'searching' | 'found' | 'not_found' | 'invalid' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [recentSearches, setRecentSearches] = useState(['TN-OP-10245', 'TN-OP-10250', 'TN-OP-10258', 'CB10024']);

  // Selected Patient Profile
  const [selectedPatient, setSelectedPatient] = useState(() => {
    // Default to Ravi Kumar (PAT001 / TN-OP-10245) for immediate demo readiness
    return PATIENTS.find(p => p.id === 'PAT001' || p.opId === 'TN-OP-10245') || PATIENTS[0];
  });

  // Patient Profile Tab: 'overview' | 'history' | 'lab' | 'records' | 'medicines' | 'appointments' | 'consultation'
  const [patientTab, setPatientTab] = useState('overview');

  // Expandable medical history record
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);

  // Modals
  const [viewingLabReport, setViewingLabReport] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [notificationToast, setNotificationToast] = useState(null);

  // Appointments filter in Appointments view
  const [appointmentTab, setAppointmentTab] = useState('today'); // 'today' | 'completed' | 'cancelled'
  const [appointmentSearch, setAppointmentSearch] = useState('');

  // My Patients search
  const [patientListSearch, setPatientListSearch] = useState('');

  // Medicines catalog filter
  const [medicineSearch, setMedicineSearch] = useState('');
  const [medicineCategory, setMedicineCategory] = useState('All');

  // Consultation Workspace State
  const [consultationData, setConsultationData] = useState({
    chiefComplaint: 'Follow-up for hypertension and mild exertional headache',
    symptoms: 'Mild occipital headache for 2 days, no blurring of vision or chest tightness',
    observations: 'Conscious, oriented, afebrile. BP: 138/88 mmHg, Pulse: 74 bpm, SpO2: 98% on room air. S1 S2 normal, chest clear.',
    diagnosis: 'Essential Hypertension – Stage 2 (Controlled on medication)',
    doctorNotes: 'Patient compliant with salt restriction. Advised morning 30 min brisk walking. Continue regular home BP monitoring.',
    treatmentPlan: 'Maintain current Telmisartan regimen. Add Paracetamol SOS for tension headaches. Re-evaluate renal markers in 3 months.',
    prescriptions: [
      { name: 'Amlodipine 5mg', dosage: '1 tablet', frequency: 'Once daily (Morning)', duration: '30 days', instructions: 'Take with or without food', route: 'Oral' },
      { name: 'Paracetamol 500mg', dosage: '1 tablet', frequency: 'Twice daily as needed', duration: '3 days', instructions: 'Take after meals for headache', route: 'Oral' }
    ],
    investigations: ['Complete Blood Count (CBC)', 'Fasting Lipid Profile'],
    followUp: '2 Weeks'
  });

  const [draftSaved, setDraftSaved] = useState(false);
  const [consultationCompleted, setConsultationCompleted] = useState(false);

  // Sync state if initialSection changes
  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  // Doctor details
  const doctor = {
    name: 'Dr. Priya Sharma',
    degree: 'MBBS, MD (General Medicine)',
    department: 'General Medicine',
    hospital: HOSPITAL_INFO.name || 'Government District Hospital — Salem',
    regNo: 'TN-MC-64821',
    opdRoom: 'Room 104, OPD Block B'
  };

  // Patients assigned to Dr. Priya Sharma
  const myPatients = useMemo(() => {
    return PATIENTS.filter(p => p.doctor === 'DOC001' || p.dept === 'General Medicine');
  }, []);

  // Filtered patients for My Patients section
  const filteredMyPatients = useMemo(() => {
    if (!patientListSearch.trim()) return myPatients;
    const q = patientListSearch.toLowerCase();
    return myPatients.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.opId && p.opId.toLowerCase().includes(q)) ||
      (p.patientId && p.patientId.toLowerCase().includes(q)) ||
      p.id.toLowerCase().includes(q)
    );
  }, [myPatients, patientListSearch]);

  // Clinical data for selected patient
  const clinicalData = useMemo(() => {
    return getPatientClinicalData(selectedPatient);
  }, [selectedPatient]);

  // Appointments data
  const appointmentsData = DOCTOR_APPOINTMENTS_DATA;

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    const list = appointmentsData[appointmentTab] || [];
    if (!appointmentSearch.trim()) return list;
    const q = appointmentSearch.toLowerCase();
    return list.filter(a =>
      a.patient.toLowerCase().includes(q) ||
      (a.opId && a.opId.toLowerCase().includes(q)) ||
      (a.patientId && a.patientId.toLowerCase().includes(q))
    );
  }, [appointmentsData, appointmentTab, appointmentSearch]);

  // Filtered medicines
  const filteredMedicines = useMemo(() => {
    return MEDICINES.filter(m => {
      const matchCat = medicineCategory === 'All' || m.category === medicineCategory;
      const q = medicineSearch.toLowerCase();
      const matchQuery = !q ||
        m.name.toLowerCase().includes(q) ||
        (m.genericName && m.genericName.toLowerCase().includes(q)) ||
        m.category.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [medicineSearch, medicineCategory]);

  const medicineCategories = ['All', 'Cardiovascular', 'Analgesic', 'Antibiotic', 'Diabetes', 'GI', 'Antiplatelet', 'Vitamins', 'Diuretics'];

  // Handle OP ID Search
  const handleSearch = (queryOverride) => {
    const query = (queryOverride !== undefined ? queryOverride : searchQuery).trim();
    if (!query) {
      setSearchState('invalid');
      setErrorMessage('Please enter a valid Patient ID / OP ID.');
      return;
    }

    setSearchState('searching');
    setErrorMessage('');

    setTimeout(() => {
      const q = query.toLowerCase();
      const found = PATIENTS.find(p =>
        (p.opId && p.opId.toLowerCase() === q) ||
        (p.patientId && p.patientId.toLowerCase() === q) ||
        p.id.toLowerCase() === q ||
        p.name.toLowerCase() === q
      );

      if (found) {
        setSelectedPatient(found);
        setSearchState('found');
        setActiveSection('search');
        if (!recentSearches.includes(found.opId || found.id)) {
          setRecentSearches(prev => [found.opId || found.id, ...prev.slice(0, 4)]);
        }
      } else {
        setSearchState('not_found');
        setErrorMessage('Patient not found. Please verify the Patient ID / OP ID.');
      }
    }, 350);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchState('idle');
    setErrorMessage('');
  };

  const selectPatientDirectly = (patient, targetTab = 'overview') => {
    setSelectedPatient(patient);
    setSearchQuery(patient.opId || patient.patientId || patient.id);
    setSearchState('found');
    setPatientTab(targetTab);
    setActiveSection('search');
  };

  const startConsultationForPatient = (patient) => {
    setSelectedPatient(patient);
    setSearchQuery(patient.opId || patient.patientId || patient.id);
    setSearchState('found');
    setPatientTab('consultation');
    setActiveSection('search');
    setDraftSaved(false);
    setConsultationCompleted(false);
  };

  const triggerToast = (msg) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  return (
    <div className="fade-in" style={{ paddingBottom: 40 }}>
      {/* Toast Notification */}
      {notificationToast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          zIndex: 9999,
          fontSize: 13,
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} color="#10B981" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* ── 1. DOCTOR HEADER (Good Morning, Dr. Priya Sharma · Department: General Medicine) ── */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 14,
        padding: '20px 24px',
        marginBottom: 20,
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>🩺</span>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Good Morning, {doctor.name}
            </h1>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 6,
              background: '#E0F2FE',
              color: '#0284C7',
              border: '1px solid #BAE6FD'
            }}>
              Govt. Hospital Duty
            </span>
          </div>
          <div style={{ fontSize: 13, color: '#64748B', marginTop: 4, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span><strong>Department:</strong> {doctor.department}</span>
            <span>·</span>
            <span><strong>Facility:</strong> {doctor.hospital}</span>
            <span>·</span>
            <span><strong>OPD Station:</strong> {doctor.opdRoom}</span>
            <span>·</span>
            <span style={{ color: '#059669', fontWeight: 600 }}>● Active Clinical Session</span>
          </div>
        </div>

      </div>

      {/* ── 2. PROMINENT PATIENT ID / OP ID / ABHA ID SEARCH SECTION ── */}
      <PatientSearchGateway
        title="Doctor Consultation: Patient Identification & Access"
        subtitle="Search patient by OP ID (e.g. OP2026001) or ABHA ID (e.g. ABHA10001) to review clinical records and start consultation"
        actionLabel="Start Clinical Consultation"
        selectedPatient={selectedPatient}
        onPatientSelect={(patient) => {
          setSelectedPatient(patient);
          setSearchQuery(patient.opId || patient.id);
          setSearchState('found');
          setActiveSection('search');
        }}
        onAction={(patient) => {
          startConsultationForPatient(patient);
        }}
        onClear={() => {
          handleClearSearch();
        }}
      />

      {/* ── 3. MAIN CONTENT BASED ON ACTIVE SECTION ── */}

      {/* SECTION: OVERVIEW */}
      {activeSection === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Today's Appointments & My Patients Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>

            {/* Today's Appointments Card */}
            <div style={{ background: '#FFFFFF', borderRadius: 14, border: '1px solid #E2E8F0', padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Calendar size={18} color="#0EA5E9" />
                    Today's Appointments
                  </h3>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                    {DOCTOR_APPOINTMENTS_DATA.today.length} scheduled outpatients for Dr. Priya Sharma
                  </div>
                </div>
                <button
                  onClick={() => setActiveSection('appointments')}
                  style={{ background: 'none', border: 'none', color: '#0284C7', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  View All &rarr;
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {DOCTOR_APPOINTMENTS_DATA.today.map((apt) => {
                  const patientObj = PATIENTS.find(p => p.name === apt.patient) || PATIENTS[0];
                  return (
                    <div
                      key={apt.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 10,
                        border: '1px solid #F1F5F9',
                        background: '#F8FAFC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          background: '#E0F2FE',
                          color: '#0284C7',
                          fontWeight: 800,
                          fontSize: 12,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {apt.time.split(' ')[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                            {apt.patient}
                          </div>
                          <div style={{ fontSize: 12, color: '#64748B', display: 'flex', gap: 8 }}>
                            <span><code>{apt.opId}</code></span>
                            <span>·</span>
                            <span>{apt.type}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: apt.status === 'Waiting' ? '#FEF3C7' : '#E0F2FE',
                          color: apt.status === 'Waiting' ? '#D97706' : '#0284C7'
                        }}>
                          {apt.status}
                        </span>
                        <button
                          onClick={() => startConsultationForPatient(patientObj)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 6,
                            background: '#0EA5E9',
                            color: '#FFFFFF',
                            border: 'none',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Consult
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* My Patients Compact Card */}
            <div style={{ background: '#FFFFFF', borderRadius: 14, border: '1px solid #E2E8F0', padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Users size={18} color="#10B981" />
                    My Assigned Patients
                  </h3>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                    {myPatients.length} active patients under Dr. Priya Sharma's care
                  </div>
                </div>
                <button
                  onClick={() => setActiveSection('patients')}
                  style={{ background: 'none', border: 'none', color: '#059669', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  Manage Patients &rarr;
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {myPatients.slice(0, 5).map((p) => (
                  <div
                    key={p.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '1px solid #F1F5F9',
                      background: '#F8FAFC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748B', display: 'flex', gap: 8, marginTop: 2 }}>
                        <span><code>{p.opId}</code></span>
                        <span>·</span>
                        <span>{p.age}y / {p.gender}</span>
                        <span>·</span>
                        <span style={{ color: '#0284C7', fontWeight: 600 }}>{p.diagnosis}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => selectPatientDirectly(p, 'overview')}
                        style={{
                          padding: '5px 10px',
                          borderRadius: 6,
                          background: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          color: '#334155',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => startConsultationForPatient(p)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: 6,
                          background: '#10B981',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Consult
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Patient Visits Table */}
          <div style={{ background: '#FFFFFF', borderRadius: 14, border: '1px solid #E2E8F0', padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={18} color="#6366F1" />
                  Recent Patient Visits & Consultations
                </h3>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  Recently concluded visits with clinical summaries
                </div>
              </div>
              <span style={{ fontSize: 12, color: '#64748B' }}>Government Health System Verified</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '10px 14px' }}>Patient</th>
                    <th style={{ padding: '10px 14px' }}>OP ID</th>
                    <th style={{ padding: '10px 14px' }}>Visit Date</th>
                    <th style={{ padding: '10px 14px' }}>Diagnosis Summary</th>
                    <th style={{ padding: '10px 14px' }}>Status</th>
                    <th style={{ padding: '10px 14px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {DOCTOR_APPOINTMENTS_DATA.completed.map((rec) => {
                    const patientObj = PATIENTS.find(p => p.name === rec.patient) || PATIENTS[0];
                    return (
                      <tr key={rec.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>{rec.patient}</td>
                        <td style={{ padding: '12px 14px' }}><code>{rec.opId}</code></td>
                        <td style={{ padding: '12px 14px', color: '#64748B' }}>{rec.consultDate}</td>
                        <td style={{ padding: '12px 14px', color: '#334155' }}>{rec.diagnosisSummary}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#D1FAE5', color: '#065F46' }}>
                            {rec.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          <button
                            onClick={() => selectPatientDirectly(patientObj, 'records')}
                            style={{
                              padding: '5px 12px',
                              borderRadius: 6,
                              background: '#F1F5F9',
                              border: '1px solid #CBD5E1',
                              color: '#0284C7',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            View Record
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: SEARCH / PATIENT PROFILE VIEW */}
      {activeSection === 'search' && selectedPatient && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* 15. CLEAN PATIENT PROFILE HEADER */}
          <div style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
            borderRadius: 14,
            border: '1px solid #E2E8F0',
            padding: '20px 24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Patient: {selectedPatient.name}
                  </h2>
                  <span style={{ background: '#E0F2FE', color: '#0369A1', fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 6, fontFamily: 'monospace' }}>
                    OP ID: {selectedPatient.opId || 'OP2026001'}
                  </span>
                  <span style={{ background: '#F1F5F9', color: '#475569', fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 6, fontFamily: 'monospace' }}>
                    Patient ID: {selectedPatient.patientId || selectedPatient.id}
                  </span>
                  <span style={{ background: '#EDE9FE', color: '#5B21B6', fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 6, fontFamily: 'monospace' }}>
                    ABHA ID: {selectedPatient.abhaId || 'ABHA10001'}
                  </span>
                  {selectedPatient.allergies && selectedPatient.allergies.length > 0 && selectedPatient.allergies[0] !== 'No known drug allergies (NKDA)' ? (
                    <span style={{ background: '#FEE2E2', color: '#B91C1C', fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 6, border: '1px solid #FECACA' }}>
                      ⚠️ Allergy: {selectedPatient.allergies.join(', ')}
                    </span>
                  ) : (
                    <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6 }}>
                      No Drug Allergies (NKDA)
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 13, color: '#475569', flexWrap: 'wrap' }}>
                  <span><strong>Age / Gender:</strong> {selectedPatient.age} yrs · {selectedPatient.gender}</span>
                  <span>·</span>
                  <span><strong>Blood Group:</strong> <strong style={{ color: '#DC2626' }}>{selectedPatient.blood || 'B+'}</strong></span>
                  <span>·</span>
                  <span><strong>Contact:</strong> {selectedPatient.maskedPhone || '+91 94567 ****1'}</span>
                  <span>·</span>
                  <span><strong>Location:</strong> {selectedPatient.address || 'Salem, Tamil Nadu'}</span>
                </div>
              </div>

              {/* Patient Top Actions */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => startConsultationForPatient(selectedPatient)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 8,
                    background: '#0EA5E9',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Stethoscope size={16} /> Start Consultation
                </button>
                <button
                  onClick={() => setActiveSection('overview')}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 8,
                    background: '#FFFFFF',
                    color: '#475569',
                    border: '1px solid #CBD5E1',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  Close Profile
                </button>
              </div>
            </div>

            {/* 7 PROFILE TABS */}
            <div style={{
              display: 'flex',
              gap: 6,
              marginTop: 20,
              borderTop: '1px solid #E2E8F0',
              paddingTop: 14,
              overflowX: 'auto'
            }}>
              {[
                { id: 'overview', label: 'Overview', icon: Users },
                { id: 'history', label: 'Medical History', icon: Activity },
                { id: 'lab', label: 'Lab Reports', icon: FlaskConical },
                { id: 'records', label: 'Previous Records', icon: FileText },
                { id: 'medicines', label: 'Medicine Details', icon: Pill },
                { id: 'appointments', label: 'Appointments', icon: Calendar },
                { id: 'consultation', label: 'Current Consultation', icon: Stethoscope },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = patientTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setPatientTab(tab.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: isActive ? 700 : 500,
                      border: '1px solid',
                      borderColor: isActive ? '#0EA5E9' : 'transparent',
                      background: isActive ? '#E0F2FE' : '#FFFFFF',
                      color: isActive ? '#0284C7' : '#475569',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Icon size={15} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {patientTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
              {/* Demographics & Current Visit */}
              <div style={{ background: '#FFFFFF', borderRadius: 14, border: '1px solid #E2E8F0', padding: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ShieldCheck size={17} color="#0EA5E9" /> Patient Demographics & Registration
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                    <span style={{ color: '#64748B' }}>Full Name:</span>
                    <strong style={{ color: '#0F172A' }}>{selectedPatient.name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                    <span style={{ color: '#64748B' }}>Patient OP ID:</span>
                    <code>{selectedPatient.opId || 'TN-OP-10245'}</code>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                    <span style={{ color: '#64748B' }}>Patient ID:</span>
                    <code>{selectedPatient.patientId || selectedPatient.id}</code>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                    <span style={{ color: '#64748B' }}>Date of Birth:</span>
                    <span>{selectedPatient.dob || '1980-05-14'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                    <span style={{ color: '#64748B' }}>Age & Gender:</span>
                    <span>{selectedPatient.age} Years / {selectedPatient.gender}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                    <span style={{ color: '#64748B' }}>Blood Group:</span>
                    <strong style={{ color: '#DC2626' }}>{selectedPatient.blood || 'B+'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                    <span style={{ color: '#64748B' }}>Mobile Number:</span>
                    <span>{selectedPatient.maskedPhone || '+91 94567 ****1'} (Masked)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                    <span style={{ color: '#64748B' }}>Residential Address:</span>
                    <span style={{ maxWidth: 200, textAlign: 'right' }}>{selectedPatient.address || 'Salem, Tamil Nadu'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                    <span style={{ color: '#64748B' }}>Initial Registration Date:</span>
                    <span>{selectedPatient.regDate || '2024-03-12'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6 }}>
                    <span style={{ color: '#64748B' }}>Current Visit Date:</span>
                    <strong style={{ color: '#0284C7' }}>{selectedPatient.visitDate || '2026-09-07'}</strong>
                  </div>
                </div>
              </div>

              {/* Clinical Assignment & Vitals */}
              <div style={{ background: '#FFFFFF', borderRadius: 14, border: '1px solid #E2E8F0', padding: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Activity size={17} color="#10B981" /> Current Clinical Vitals & Assignment
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 }}>
                  <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: 11, color: '#64748B' }}>Blood Pressure</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>130/85 mmHg</div>
                    <div style={{ fontSize: 10, color: '#059669' }}>Controlled on medication</div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: 11, color: '#64748B' }}>Heart Rate</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>74 bpm</div>
                    <div style={{ fontSize: 10, color: '#059669' }}>Regular rhythm</div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: 11, color: '#64748B' }}>Temperature</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>98.4 °F</div>
                    <div style={{ fontSize: 10, color: '#059669' }}>Afebrile</div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: 11, color: '#64748B' }}>SpO2 (Room Air)</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>98 %</div>
                    <div style={{ fontSize: 10, color: '#059669' }}>Normal</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                    <span style={{ color: '#64748B' }}>Assigned Doctor:</span>
                    <strong>{doctor.name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                    <span style={{ color: '#64748B' }}>Department:</span>
                    <span>{selectedPatient.dept || doctor.department}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                    <span style={{ color: '#64748B' }}>Ward / Bed:</span>
                    <span>{selectedPatient.ward || 'OPD'} · {selectedPatient.bed || 'Outpatient'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6 }}>
                    <span style={{ color: '#64748B' }}>Scheme / Insurance:</span>
                    <span style={{ color: '#059669', fontWeight: 600 }}>TN CMCHIS / PMJAY Active</span>
                  </div>
                </div>

                <button
                  onClick={() => startConsultationForPatient(selectedPatient)}
                  style={{
                    width: '100%',
                    marginTop: 14,
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: '#0EA5E9',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                >
                  <Stethoscope size={16} /> Open Consultation Workspace
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: 4. MEDICAL HISTORY */}
          {patientTab === 'history' && (
            <div style={{ background: '#FFFFFF', borderRadius: 14, border: '1px solid #E2E8F0', padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Chronological Medical History
                  </h3>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                    Past diagnoses, consultations, admissions, and procedures (Click a row to expand details)
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 12, background: '#F1F5F9', padding: '4px 10px', borderRadius: 6, color: '#334155', fontWeight: 600 }}>
                    {clinicalData.medicalHistory.length} Recorded Episodes
                  </span>
                </div>
              </div>

              {/* Chronic conditions & Allergies bar */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 14px', borderRadius: 8, flex: 1, minWidth: 240 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Chronic Conditions</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                    {(selectedPatient.chronicConditions || ['Hypertension']).map((c, i) => (
                      <span key={i} style={{ fontSize: 12, background: '#E0F2FE', color: '#0369A1', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#FFF5F5', border: '1px solid #FECACA', padding: '10px 14px', borderRadius: 8, flex: 1, minWidth: 240 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#B91C1C', textTransform: 'uppercase' }}>Drug Allergies Warning</div>
                  <div style={{ fontSize: 12, color: '#991B1B', marginTop: 4, fontWeight: 600 }}>
                    {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? selectedPatient.allergies.join(', ') : 'No known drug allergies (NKDA)'}
                  </div>
                </div>
              </div>

              {/* Medical History Table with expandable rows */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#475569' }}>
                      <th style={{ padding: '10px 12px' }}>Date</th>
                      <th style={{ padding: '10px 12px' }}>Diagnosis</th>
                      <th style={{ padding: '10px 12px' }}>Consulting Doctor</th>
                      <th style={{ padding: '10px 12px' }}>Hospital / Facility</th>
                      <th style={{ padding: '10px 12px' }}>Clinical Notes</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clinicalData.medicalHistory.map((item) => {
                      const isExpanded = expandedHistoryId === item.id;
                      return (
                        <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td colSpan={6} style={{ padding: 0 }}>
                            <div
                              onClick={() => setExpandedHistoryId(isExpanded ? null : item.id)}
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '120px 220px 160px 200px 1fr 60px',
                                padding: '12px',
                                alignItems: 'center',
                                cursor: 'pointer',
                                background: isExpanded ? '#F8FAFC' : 'transparent',
                                transition: 'background 0.15s'
                              }}
                            >
                              <div style={{ fontWeight: 600, color: '#0F172A' }}>{item.date}</div>
                              <div style={{ fontWeight: 700, color: '#0284C7' }}>{item.diagnosis}</div>
                              <div style={{ color: '#334155' }}>{item.doctor}</div>
                              <div style={{ color: '#64748B', fontSize: 12 }}>{item.hospital}</div>
                              <div style={{ color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
                                {item.notes}
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                              </div>
                            </div>

                            {/* Expanded Additional Details */}
                            {isExpanded && (
                              <div style={{
                                padding: '14px 20px',
                                background: '#F1F5F9',
                                borderTop: '1px solid #E2E8F0',
                                borderBottom: '1px solid #CBD5E1',
                                fontSize: 12,
                                color: '#334155'
                              }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                                  <div>
                                    <strong style={{ color: '#0F172A' }}>Complete Medical Notes:</strong>
                                    <p style={{ marginTop: 4, lineHeight: 1.5 }}>{item.notes}</p>
                                  </div>
                                  <div>
                                    <strong style={{ color: '#0F172A' }}>Procedures Undertaken:</strong>
                                    <p style={{ marginTop: 4, lineHeight: 1.5 }}>{item.procedures || 'None recorded'}</p>
                                  </div>
                                  <div>
                                    <strong style={{ color: '#0F172A' }}>Admission Classification:</strong>
                                    <p style={{ marginTop: 4, lineHeight: 1.5 }}>{item.admission || 'Outpatient encounter'}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: 5. LAB REPORTS */}
          {patientTab === 'lab' && (
            <div style={{ background: '#FFFFFF', borderRadius: 14, border: '1px solid #E2E8F0', padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Diagnostic Laboratory Reports
                  </h3>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                    Authorized laboratory investigations and verified clinical values
                  </div>
                </div>
                <button
                  onClick={() => triggerToast('Lab reports printed successfully.')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    color: '#334155',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Printer size={14} /> Print All Reports
                </button>
              </div>

              {/* Lab Reports List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {clinicalData.labReports.map((lab) => (
                  <div
                    key={lab.id}
                    style={{
                      border: lab.isAbnormal || lab.isCritical ? '1.5px solid #FED7AA' : '1px solid #E2E8F0',
                      borderRadius: 10,
                      padding: '14px 18px',
                      background: lab.isAbnormal ? '#FFFBF5' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 12
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>{lab.test}</span>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 6,
                          background: lab.status === 'Abnormal' ? '#FEF3C7' : lab.status === 'Critical' ? '#FEE2E2' : '#D1FAE5',
                          color: lab.status === 'Abnormal' ? '#B45309' : lab.status === 'Critical' ? '#B91C1C' : '#047857'
                        }}>
                          {lab.status}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, marginTop: 6, color: '#334155' }}>
                        <strong>Result:</strong> <span style={{ color: lab.isAbnormal ? '#B45309' : '#0F172A', fontWeight: 600 }}>{lab.result}</span>
                        <span style={{ margin: '0 8px', color: '#CBD5E1' }}>|</span>
                        <strong>Reference Range:</strong> {lab.reference}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>
                        Tested on {lab.date} · {lab.lab} · {lab.reviewStatus}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => setViewingLabReport(lab)}
                        style={{
                          padding: '7px 14px',
                          borderRadius: 6,
                          background: '#0EA5E9',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <Eye size={14} /> View Report
                      </button>
                      <button
                        onClick={() => triggerToast(`Report for ${lab.test} downloaded.`)}
                        style={{
                          padding: '7px 12px',
                          borderRadius: 6,
                          background: '#F1F5F9',
                          border: '1px solid #CBD5E1',
                          color: '#334155',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <Download size={14} /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: 6. PREVIOUS MEDICAL RECORDS */}
          {patientTab === 'records' && (
            <div style={{ background: '#FFFFFF', borderRadius: 14, border: '1px solid #E2E8F0', padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Previous Medical & Consultation Records
                  </h3>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                    Discharge summaries, specialist notes, imaging reports, and referral transmissions
                  </div>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#475569' }}>
                      <th style={{ padding: '10px 12px' }}>Date</th>
                      <th style={{ padding: '10px 12px' }}>Facility / Hospital</th>
                      <th style={{ padding: '10px 12px' }}>Attending Doctor</th>
                      <th style={{ padding: '10px 12px' }}>Department</th>
                      <th style={{ padding: '10px 12px' }}>Record Type</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clinicalData.previousRecords.map((rec) => (
                      <tr key={rec.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px', fontWeight: 600, color: '#0F172A' }}>{rec.date}</td>
                        <td style={{ padding: '12px', color: '#334155' }}>{rec.facility}</td>
                        <td style={{ padding: '12px', color: '#0284C7', fontWeight: 600 }}>{rec.doctor}</td>
                        <td style={{ padding: '12px', color: '#475569' }}>{rec.dept}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ fontSize: 11, background: '#E0F2FE', color: '#0369A1', padding: '3px 8px', borderRadius: 6, fontWeight: 600 }}>
                            {rec.type}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <button
                            onClick={() => setViewingRecord(rec)}
                            style={{
                              padding: '5px 12px',
                              borderRadius: 6,
                              background: '#F1F5F9',
                              border: '1px solid #CBD5E1',
                              color: '#0284C7',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            View Document
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: 7. MEDICINE DETAILS */}
          {patientTab === 'medicines' && (
            <div style={{ background: '#FFFFFF', borderRadius: 14, border: '1px solid #E2E8F0', padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Medicine Details & Formulary Catalog
                  </h3>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                    Verified pharmacological details, active stock, dosages, and contraindications
                  </div>
                </div>
                <div style={{ fontSize: 12, background: '#FEF3C7', color: '#B45309', padding: '4px 10px', borderRadius: 6, fontWeight: 600 }}>
                  Clinical Note: Doctors must explicitly review and approve all prescriptions
                </div>
              </div>

              {/* Medicine List with Complete Parameters */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
                {MEDICINES.slice(0, 6).map((med) => {
                  const hasAllergyWarning = selectedPatient.allergies?.some(a =>
                    a.toLowerCase().includes('penicillin') && med.name.toLowerCase().includes('amoxicillin')
                  );
                  return (
                    <div
                      key={med.id}
                      style={{
                        border: hasAllergyWarning ? '1.5px solid #EF4444' : '1px solid #E2E8F0',
                        borderRadius: 12,
                        padding: 16,
                        background: hasAllergyWarning ? '#FFF5F5' : '#F8FAFC',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>{med.name}</h4>
                            <div style={{ fontSize: 12, color: '#64748B', fontStyle: 'italic' }}>Generic: {med.genericName}</div>
                          </div>
                          <span style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 6,
                            background: med.stockStatus === 'In Stock' ? '#D1FAE5' : '#FEE2E2',
                            color: med.stockStatus === 'In Stock' ? '#047857' : '#B91C1C'
                          }}>
                            {med.stockStatus}
                          </span>
                        </div>

                        {hasAllergyWarning && (
                          <div style={{ marginTop: 8, padding: '6px 10px', background: '#FEE2E2', color: '#B91C1C', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                            ⚠️ Patient Allergy Warning: Contains Penicillin derivatives!
                          </div>
                        )}

                        <p style={{ fontSize: 12, color: '#475569', margin: '8px 0 12px', lineHeight: 1.4 }}>
                          {med.description}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, background: '#FFFFFF', padding: 10, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                          <div><strong>Strength:</strong> {med.strength}</div>
                          <div><strong>Form:</strong> {med.form}</div>
                          <div><strong>Available Qty:</strong> {med.available} {med.unit}</div>
                          <div><strong>Expiry Date:</strong> {med.expiry}</div>
                          <div><strong>Dosage:</strong> {med.dosage}</div>
                          <div><strong>Frequency:</strong> {med.frequency}</div>
                          <div><strong>Duration:</strong> {med.duration}</div>
                          <div><strong>Route:</strong> {med.route}</div>
                        </div>

                        <div style={{ marginTop: 10, fontSize: 11, color: '#64748B' }}>
                          <strong>Instructions:</strong> {med.instructions}
                        </div>
                        {med.contraindications && (
                          <div style={{ marginTop: 4, fontSize: 11, color: '#B91C1C' }}>
                            <strong>Contraindications:</strong> {med.contraindications}
                          </div>
                        )}
                      </div>

                      <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => {
                            setConsultationData(prev => ({
                              ...prev,
                              prescriptions: [
                                ...prev.prescriptions,
                                {
                                  name: med.name,
                                  dosage: med.dosage,
                                  frequency: med.frequency,
                                  duration: med.duration,
                                  instructions: med.instructions,
                                  route: med.route
                                }
                              ]
                            }));
                            setPatientTab('consultation');
                            triggerToast(`Added ${med.name} to Consultation workspace.`);
                          }}
                          style={{
                            padding: '6px 14px',
                            borderRadius: 6,
                            background: '#0EA5E9',
                            color: '#FFFFFF',
                            border: 'none',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          <Plus size={14} /> Add to Prescription
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: 8. APPOINTMENTS */}
          {patientTab === 'appointments' && (
            <div style={{ background: '#FFFFFF', borderRadius: 14, border: '1px solid #E2E8F0', padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 14 }}>
                Patient Appointments Schedule
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ border: '1px solid #E2E8F0', borderRadius: 10, padding: 14, background: '#F8FAFC' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ color: '#0F172A' }}>Today's Scheduled Consult</strong>
                      <div style={{ fontSize: 12, color: '#64748B' }}>Time: 09:00 AM · General Medicine · Dr. Priya Sharma</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, background: '#FEF3C7', color: '#D97706', padding: '3px 8px', borderRadius: 6 }}>
                      In Queue / Waiting
                    </span>
                  </div>
                </div>

                <div style={{ border: '1px solid #E2E8F0', borderRadius: 10, padding: 14, background: '#FFFFFF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ color: '#0F172A' }}>Past Completed Review (2026-08-12)</strong>
                      <div style={{ fontSize: 12, color: '#64748B' }}>Summary: Essential Hypertension follow-up · Telmisartan adjusted</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, background: '#D1FAE5', color: '#065F46', padding: '3px 8px', borderRadius: 6 }}>
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: 11. START CONSULTATION WORKSPACE */}
          {patientTab === 'consultation' && (
            <div style={{ background: '#FFFFFF', borderRadius: 14, border: '1px solid #E2E8F0', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Stethoscope size={20} color="#0EA5E9" />
                    Doctor Consultation Workspace
                  </h3>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                    Treating: <strong>{selectedPatient.name}</strong> · OP ID: <code>{selectedPatient.opId}</code> · Blood Group: {selectedPatient.blood}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => {
                      setDraftSaved(true);
                      triggerToast('Consultation draft saved successfully.');
                    }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      background: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      color: '#334155',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Save Draft
                  </button>
                  <button
                    onClick={() => {
                      setConsultationCompleted(true);
                      triggerToast('Consultation completed and added to medical history.');
                    }}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 8,
                      background: '#10B981',
                      border: 'none',
                      color: '#FFFFFF',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Complete Consultation
                  </button>
                </div>
              </div>

              {draftSaved && (
                <div style={{ padding: '10px 14px', background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 8, color: '#0369A1', fontSize: 13, marginBottom: 16 }}>
                  ✓ Consultation draft saved locally at {new Date().toLocaleTimeString()}.
                </div>
              )}

              {consultationCompleted && (
                <div style={{ padding: '12px 16px', background: '#ECFDF5', border: '1.5px solid #6EE7B7', borderRadius: 8, color: '#065F46', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
                  ✓ Consultation successfully completed. Record saved to Patient Medical History and prescriptions routed to Pharmacy Dispensing.
                </div>
              )}

              {/* Patient Quick Summary Box */}
              <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 14, border: '1px solid #E2E8F0', marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>
                  Patient Clinical Summary & Allergies
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#1E293B', flexWrap: 'wrap' }}>
                  <span><strong>Allergies:</strong> <span style={{ color: '#DC2626', fontWeight: 700 }}>{selectedPatient.allergies?.join(', ') || 'NKDA'}</span></span>
                  <span>·</span>
                  <span><strong>Chronic Illnesses:</strong> {selectedPatient.chronicConditions?.join(', ') || 'None'}</span>
                  <span>·</span>
                  <span><strong>Previous Admissions:</strong> {selectedPatient.previousAdmissions?.[0] || 'None in past 12 months'}</span>
                </div>
              </div>

              {/* Consultation Input Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: 6 }}>
                    Chief Complaint *
                  </label>
                  <input
                    type="text"
                    value={consultationData.chiefComplaint}
                    onChange={(e) => setConsultationData({ ...consultationData, chiefComplaint: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #CBD5E1', fontSize: 14 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: 6 }}>
                    Symptoms & History of Present Illness
                  </label>
                  <textarea
                    rows={2}
                    value={consultationData.symptoms}
                    onChange={(e) => setConsultationData({ ...consultationData, symptoms: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #CBD5E1', fontSize: 13 }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: 6 }}>
                      Clinical Observations & Examination
                    </label>
                    <textarea
                      rows={2}
                      value={consultationData.observations}
                      onChange={(e) => setConsultationData({ ...consultationData, observations: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #CBD5E1', fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: 6 }}>
                      Doctor's Clinical Diagnosis *
                    </label>
                    <textarea
                      rows={2}
                      value={consultationData.diagnosis}
                      onChange={(e) => setConsultationData({ ...consultationData, diagnosis: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #CBD5E1', fontSize: 13 }}
                    />
                  </div>
                </div>

                {/* Prescriptions Section */}
                <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 16, border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <label style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Pill size={16} color="#0EA5E9" /> Current Prescribed Medicines ({consultationData.prescriptions.length})
                    </label>
                    <button
                      onClick={() => setPatientTab('medicines')}
                      style={{ background: 'none', border: 'none', color: '#0284C7', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      + Browse Medicines Catalog
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {consultationData.prescriptions.map((rx, idx) => (
                      <div key={idx} style={{ background: '#FFFFFF', padding: '10px 14px', borderRadius: 8, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ color: '#0F172A', fontSize: 13 }}>{rx.name}</strong>
                          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                            Dosage: {rx.dosage} · Freq: {rx.frequency} · Duration: {rx.duration} · {rx.instructions}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setConsultationData(prev => ({
                              ...prev,
                              prescriptions: prev.prescriptions.filter((_, i) => i !== idx)
                            }));
                          }}
                          style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: 12, cursor: 'pointer' }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Investigations & Follow up */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: 6 }}>
                      Requested Investigations (Lab / Imaging)
                    </label>
                    <input
                      type="text"
                      value={consultationData.investigations.join(', ')}
                      onChange={(e) => setConsultationData({ ...consultationData, investigations: e.target.value.split(', ') })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #CBD5E1', fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: 6 }}>
                      Follow-up Instructions
                    </label>
                    <input
                      type="text"
                      value={consultationData.followUp}
                      onChange={(e) => setConsultationData({ ...consultationData, followUp: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #CBD5E1', fontSize: 13 }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      triggerToast('Prescription order generated for hospital pharmacy.');
                    }}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 8,
                      background: '#6366F1',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer'
                    }}
                  >
                    Create Prescription
                  </button>
                  <button
                    onClick={() => {
                      triggerToast('Diagnostic order submitted to Laboratory.');
                    }}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 8,
                      background: '#0EA5E9',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer'
                    }}
                  >
                    Request Investigation
                  </button>
                  <button
                    onClick={() => {
                      setDraftSaved(true);
                      triggerToast('Draft saved.');
                    }}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 8,
                      background: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      color: '#334155',
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: 'pointer'
                    }}
                  >
                    Save Draft
                  </button>
                  <button
                    onClick={() => {
                      setConsultationCompleted(true);
                      triggerToast('Consultation finalized.');
                    }}
                    style={{
                      padding: '10px 22px',
                      borderRadius: 8,
                      background: '#10B981',
                      border: 'none',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer',
                      marginLeft: 'auto'
                    }}
                  >
                    Complete Consultation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION: MY PATIENTS (10. Dedicated My Patients Section) */}
      {activeSection === 'patients' && (
        <div style={{ background: '#FFFFFF', borderRadius: 14, border: '1px solid #E2E8F0', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={20} color="#10B981" />
                My Assigned Patients
              </h2>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                Patients assigned to Dr. Priya Sharma ({doctor.department})
              </div>
            </div>

            {/* Search Patient by Name / OP ID / Patient ID */}
            <div style={{ position: 'relative', width: 320 }}>
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={patientListSearch}
                onChange={(e) => setPatientListSearch(e.target.value)}
                placeholder="Search patient by Name, OP ID, or ID..."
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  fontSize: 13
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '10px 14px' }}>Patient</th>
                  <th style={{ padding: '10px 14px' }}>Patient ID</th>
                  <th style={{ padding: '10px 14px' }}>OP ID</th>
                  <th style={{ padding: '10px 14px' }}>Age / Gender</th>
                  <th style={{ padding: '10px 14px' }}>Department</th>
                  <th style={{ padding: '10px 14px' }}>Last Visit</th>
                  <th style={{ padding: '10px 14px' }}>Today's Appt</th>
                  <th style={{ padding: '10px 14px' }}>Current Status</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMyPatients.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>{p.name}</td>
                    <td style={{ padding: '12px 14px' }}><code>{p.patientId || p.id}</code></td>
                    <td style={{ padding: '12px 14px' }}><code>{p.opId}</code></td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{p.age}y / {p.gender}</td>
                    <td style={{ padding: '12px 14px', color: '#64748B' }}>{p.dept}</td>
                    <td style={{ padding: '12px 14px', color: '#64748B' }}>{p.regDate || '2026-08-12'}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#0284C7' }}>09:30 AM</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: '#E0F2FE', color: '#0369A1' }}>
                        {p.condition || 'Stable'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => selectPatientDirectly(p, 'overview')}
                          style={{
                            padding: '5px 10px',
                            borderRadius: 6,
                            background: '#F1F5F9',
                            border: '1px solid #CBD5E1',
                            color: '#334155',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          View Patient
                        </button>
                        <button
                          onClick={() => startConsultationForPatient(p)}
                          style={{
                            padding: '5px 12px',
                            borderRadius: 6,
                            background: '#0EA5E9',
                            color: '#FFFFFF',
                            border: 'none',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Start Consultation
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION: APPOINTMENTS (8. Dedicated Appointments Section) */}
      {activeSection === 'appointments' && (
        <div style={{ background: '#FFFFFF', borderRadius: 14, border: '1px solid #E2E8F0', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={20} color="#0EA5E9" />
                Doctor Appointments Management
              </h2>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                Today's schedule, completed consults, and cancelled sessions
              </div>
            </div>

            {/* Search within appointments */}
            <div style={{ position: 'relative', width: 320 }}>
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={appointmentSearch}
                onChange={(e) => setAppointmentSearch(e.target.value)}
                placeholder="Search by Patient name, OP ID, or ID..."
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  fontSize: 13
                }}
              />
            </div>
          </div>

          {/* Sub-tabs: Today's Appointments | Completed Appointments | Cancelled Appointments */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
            {[
              { id: 'today', label: `Today's Appointments (${appointmentsData.today.length})` },
              { id: 'completed', label: `Completed Appointments (${appointmentsData.completed.length})` },
              { id: 'cancelled', label: `Cancelled Appointments (${appointmentsData.cancelled.length})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setAppointmentTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: appointmentTab === tab.id ? 700 : 500,
                  border: 'none',
                  background: appointmentTab === tab.id ? '#0EA5E9' : '#F1F5F9',
                  color: appointmentTab === tab.id ? '#FFFFFF' : '#475569',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Appointments Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '10px 14px' }}>Patient</th>
                  <th style={{ padding: '10px 14px' }}>OP ID</th>
                  {appointmentTab === 'today' && <th style={{ padding: '10px 14px' }}>Time</th>}
                  {appointmentTab === 'today' && <th style={{ padding: '10px 14px' }}>Department</th>}
                  {appointmentTab === 'today' && <th style={{ padding: '10px 14px' }}>Type</th>}
                  {appointmentTab === 'completed' && <th style={{ padding: '10px 14px' }}>Consult Date</th>}
                  {appointmentTab === 'completed' && <th style={{ padding: '10px 14px' }}>Diagnosis Summary</th>}
                  {appointmentTab === 'cancelled' && <th style={{ padding: '10px 14px' }}>Cancel Date</th>}
                  {appointmentTab === 'cancelled' && <th style={{ padding: '10px 14px' }}>Reason</th>}
                  <th style={{ padding: '10px 14px' }}>Status</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((apt) => {
                  const pObj = PATIENTS.find(p => p.name === apt.patient) || PATIENTS[0];
                  return (
                    <tr key={apt.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>{apt.patient}</td>
                      <td style={{ padding: '12px 14px' }}><code>{apt.opId}</code></td>
                      {appointmentTab === 'today' && <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0284C7' }}>{apt.time}</td>}
                      {appointmentTab === 'today' && <td style={{ padding: '12px 14px', color: '#475569' }}>{apt.dept}</td>}
                      {appointmentTab === 'today' && <td style={{ padding: '12px 14px', color: '#64748B' }}>{apt.type}</td>}
                      {appointmentTab === 'completed' && <td style={{ padding: '12px 14px', color: '#64748B' }}>{apt.consultDate}</td>}
                      {appointmentTab === 'completed' && <td style={{ padding: '12px 14px', color: '#334155' }}>{apt.diagnosisSummary}</td>}
                      {appointmentTab === 'cancelled' && <td style={{ padding: '12px 14px', color: '#64748B' }}>{apt.cancelDate}</td>}
                      {appointmentTab === 'cancelled' && <td style={{ padding: '12px 14px', color: '#B91C1C' }}>{apt.reason}</td>}
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: apt.status === 'Completed' ? '#D1FAE5' : apt.status === 'Waiting' ? '#FEF3C7' : apt.status === 'Cancelled' ? '#FEE2E2' : '#E0F2FE',
                          color: apt.status === 'Completed' ? '#047857' : apt.status === 'Waiting' ? '#B45309' : apt.status === 'Cancelled' ? '#B91C1C' : '#0369A1'
                        }}>
                          {apt.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        {appointmentTab === 'today' ? (
                          <button
                            onClick={() => startConsultationForPatient(pObj)}
                            style={{
                              padding: '5px 12px',
                              borderRadius: 6,
                              background: '#0EA5E9',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Start Consultation
                          </button>
                        ) : (
                          <button
                            onClick={() => selectPatientDirectly(pObj, 'overview')}
                            style={{
                              padding: '5px 12px',
                              borderRadius: 6,
                              background: '#F1F5F9',
                              border: '1px solid #CBD5E1',
                              color: '#334155',
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            View Patient
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION: MEDICINES (7. Dedicated Medicine Details Catalog) */}
      {activeSection === 'medicines' && (
        <div style={{ background: '#FFFFFF', borderRadius: 14, border: '1px solid #E2E8F0', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Pill size={20} color="#0EA5E9" />
                Hospital Medicine Formulary & Clinical Catalog
              </h2>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                Complete clinical details, availability, batch tracking, and contraindications
              </div>
            </div>

            {/* Medicine Search */}
            <div style={{ position: 'relative', width: 300 }}>
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={medicineSearch}
                onChange={(e) => setMedicineSearch(e.target.value)}
                placeholder="Search medicine by name, generic, or category..."
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  fontSize: 13
                }}
              />
            </div>
          </div>

          {/* Category Filter Chips */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {medicineCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setMedicineCategory(cat)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: medicineCategory === cat ? 700 : 500,
                  border: '1px solid',
                  borderColor: medicineCategory === cat ? '#0EA5E9' : '#E2E8F0',
                  background: medicineCategory === cat ? '#E0F2FE' : '#FFFFFF',
                  color: medicineCategory === cat ? '#0284C7' : '#475569',
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Medicines Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
            {filteredMedicines.map((med) => (
              <div
                key={med.id}
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: 12,
                  padding: 16,
                  background: '#F8FAFC',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>{med.name}</h4>
                      <div style={{ fontSize: 12, color: '#64748B', fontStyle: 'italic' }}>Generic: {med.genericName}</div>
                    </div>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 6,
                      background: med.stockStatus === 'In Stock' ? '#D1FAE5' : '#FEE2E2',
                      color: med.stockStatus === 'In Stock' ? '#047857' : '#B91C1C'
                    }}>
                      {med.stockStatus}
                    </span>
                  </div>

                  <p style={{ fontSize: 12, color: '#475569', margin: '8px 0 12px', lineHeight: 1.4 }}>
                    {med.description}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, background: '#FFFFFF', padding: 10, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                    <div><strong>Strength:</strong> {med.strength}</div>
                    <div><strong>Form:</strong> {med.form}</div>
                    <div><strong>Available Qty:</strong> {med.available} {med.unit}</div>
                    <div><strong>Expiry Date:</strong> {med.expiry}</div>
                    <div><strong>Dosage:</strong> {med.dosage}</div>
                    <div><strong>Frequency:</strong> {med.frequency}</div>
                    <div><strong>Duration:</strong> {med.duration}</div>
                    <div><strong>Route:</strong> {med.route}</div>
                  </div>

                  <div style={{ marginTop: 10, fontSize: 11, color: '#64748B' }}>
                    <strong>Instructions:</strong> {med.instructions}
                  </div>
                  {med.contraindications && (
                    <div style={{ marginTop: 4, fontSize: 11, color: '#B91C1C' }}>
                      <strong>Contraindications:</strong> {med.contraindications}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Batch: <code>{med.batchNo}</code></span>
                  <button
                    onClick={() => {
                      if (selectedPatient) {
                        setConsultationData(prev => ({
                          ...prev,
                          prescriptions: [
                            ...prev.prescriptions,
                            {
                              name: med.name,
                              dosage: med.dosage,
                              frequency: med.frequency,
                              duration: med.duration,
                              instructions: med.instructions,
                              route: med.route
                            }
                          ]
                        }));
                        triggerToast(`Added ${med.name} to ${selectedPatient.name}'s prescription.`);
                      } else {
                        triggerToast('Please select a patient first to prescribe.');
                      }
                    }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 6,
                      background: '#0EA5E9',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <Plus size={14} /> Add to Prescription
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL: VIEW LAB REPORT ── */}
      {viewingLabReport && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: 14,
            maxWidth: 600,
            width: '100%',
            padding: 24,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: 14, marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Diagnostic Lab Report — {viewingLabReport.test}
                </h3>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  {HOSPITAL_INFO.name} · Department of Pathology & Biochemistry
                </div>
              </div>
              <button
                onClick={() => setViewingLabReport(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0', marginBottom: 16, fontSize: 13, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div><strong>Patient Name:</strong> {selectedPatient?.name}</div>
              <div><strong>OP ID:</strong> {selectedPatient?.opId}</div>
              <div><strong>Date of Test:</strong> {viewingLabReport.date}</div>
              <div><strong>Review Status:</strong> {viewingLabReport.reviewStatus}</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Test Findings & Parameters</div>
              <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, padding: 14, fontSize: 13, lineHeight: 1.6 }}>
                <div><strong>Primary Result:</strong> <span style={{ color: viewingLabReport.isAbnormal ? '#B45309' : '#0F172A', fontWeight: 700 }}>{viewingLabReport.result}</span></div>
                <div><strong>Biological Reference Interval:</strong> {viewingLabReport.reference}</div>
                <div style={{ marginTop: 8, color: '#475569' }}><strong>Full Panel Breakdown:</strong> {viewingLabReport.details}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: 14 }}>
              <span style={{ fontSize: 11, color: '#64748B' }}>
                Digitally verified by GDH Salem Clinical Pathologist
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => {
                    triggerToast('Lab report printed.');
                    setViewingLabReport(null);
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    color: '#334155',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Printer size={15} /> Print
                </button>
                <button
                  onClick={() => {
                    triggerToast('Lab report PDF downloaded.');
                    setViewingLabReport(null);
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: '#0EA5E9',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Download size={15} /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: VIEW PREVIOUS MEDICAL RECORD ── */}
      {viewingRecord && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: 14,
            maxWidth: 600,
            width: '100%',
            padding: 24,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: 14, marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {viewingRecord.type}
                </h3>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  {viewingRecord.facility} · Date: {viewingRecord.date}
                </div>
              </div>
              <button
                onClick={() => setViewingRecord(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0', marginBottom: 16, fontSize: 13, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div><strong>Patient:</strong> {selectedPatient?.name}</div>
              <div><strong>OP ID:</strong> {selectedPatient?.opId}</div>
              <div><strong>Doctor:</strong> {viewingRecord.doctor}</div>
              <div><strong>Department:</strong> {viewingRecord.dept}</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Clinical Summary & Findings</div>
              <p style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, padding: 14, fontSize: 13, lineHeight: 1.6, color: '#334155' }}>
                {viewingRecord.summary}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid #E2E8F0', paddingTop: 14 }}>
              <button
                onClick={() => setViewingRecord(null)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 8,
                  background: '#0EA5E9',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
