import { useState, useId, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Calendar, UserCheck, FileText, PlusCircle, Search, Filter,
  Printer, Download, Eye, Edit3, X, Check, CheckCircle2, Clock,
  Stethoscope, Building2, Phone, MapPin, AlertCircle, RefreshCw,
  QrCode, Barcode, ShieldAlert, ArrowRight, UserPlus, FileSpreadsheet,
  ChevronRight, Sparkles, HeartPulse
} from 'lucide-react';
import { PATIENTS as INITIAL_PATIENTS, DOCTORS, DEPARTMENTS, APPOINTMENTS as INITIAL_APPOINTMENTS, HOSPITAL_INFO } from '../../data/mockData';

// Storage keys for persistent state during receptionist session
const STORAGE_KEYS = {
  PATIENTS: 'careconnect_reception_patients',
  APPOINTMENTS: 'careconnect_reception_appts',
  OP_CARDS: 'careconnect_reception_opcards',
};

// Initial OP Cards mock
const INITIAL_OP_CARDS = [
  {
    opNumber: 'OP-2026-08421',
    patientId: 'PAT001',
    patientName: 'Ravi Kumar',
    age: 46,
    gender: 'Male',
    phone: '+91 94567 10001',
    blood: 'B+',
    address: '14/2 Anna Nagar, Salem, Tamil Nadu - 636001',
    emergencyContact: 'Meena Kumar (Spouse) - +91 94567 10099',
    department: 'General Medicine',
    doctor: 'Dr. Priya Sharma',
    visitDate: '2026-09-08',
    validUntil: '2026-09-23',
    token: 'T-01',
    consultType: 'Follow-up',
    fee: '₹50 (Govt Subsidized)',
    issuedAt: '2026-09-08 08:30 AM',
    issuedBy: 'Meena Krishnan (REC-1001)',
  },
  {
    opNumber: 'OP-2026-08422',
    patientId: 'PAT002',
    patientName: 'Meena Devi',
    age: 32,
    gender: 'Female',
    phone: '+91 94567 10002',
    blood: 'B+',
    address: '22 Bazaar Street, Salem, Tamil Nadu - 636002',
    emergencyContact: 'Rajesh Devi (Brother) - +91 94567 10098',
    department: 'Gynecology',
    doctor: 'Dr. Sunita Rao',
    visitDate: '2026-09-08',
    validUntil: '2026-09-23',
    token: 'T-02',
    consultType: 'New Consultation',
    fee: '₹50 (Govt Subsidized)',
    issuedAt: '2026-09-08 09:10 AM',
    issuedBy: 'Meena Krishnan (REC-1001)',
  },
  {
    opNumber: 'OP-2026-08423',
    patientId: 'P1001',
    patientName: 'Arun Kumar',
    age: 42,
    gender: 'Male',
    phone: '+91 98450 10001',
    blood: 'B+',
    address: '5 Cherry Road, Hasthampatti, Salem - 636007',
    emergencyContact: 'Geetha Kumar (Wife) - +91 98450 10099',
    department: 'General Medicine',
    doctor: 'Dr. Priya Sharma',
    visitDate: '2026-09-08',
    validUntil: '2026-09-23',
    token: 'T-04',
    consultType: 'Follow-up',
    fee: '₹50 (Govt Subsidized)',
    issuedAt: '2026-09-08 09:45 AM',
    issuedBy: 'Meena Krishnan (REC-1001)',
  },
];

export default function ReceptionDashboard({ initialTab = 'dashboard' }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync tab with prop change
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Load / initialize persistent local storage
  const [patients, setPatients] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PATIENTS;
  });

  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_APPOINTMENTS;
  });

  const [opCards, setOpCards] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OP_CARDS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_OP_CARDS;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    } catch (e) {}
  }, [patients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {}
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.OP_CARDS, JSON.stringify(opCards));
    } catch (e) {}
  }, [opCards]);

  // -------------------------------------------------------------
  // Summary Metrics calculations
  // -------------------------------------------------------------
  const todayStr = '2026-09-08';
  const totalPatientsCount = patients.length;
  const newPatientsTodayCount = patients.filter(p => p.regDate === todayStr || p.regDate?.startsWith('2026-09-08')).length + 4; // realistic offset for active frontdesk
  const todaysAppointmentsCount = appointments.filter(a => a.date === '2026-09-05' || a.date === todayStr).length;
  const opCardsIssuedTodayCount = opCards.filter(c => c.visitDate === todayStr).length;

  // -------------------------------------------------------------
  // State for Add Patient Form
  // -------------------------------------------------------------
  const [patientForm, setPatientForm] = useState({
    name: '',
    dob: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    district: 'Salem',
    state: 'Tamil Nadu',
    pincode: '636001',
    emergencyContactName: '',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '',
    blood: 'O+',
    maritalStatus: 'Married',
    allergies: 'None',
    medicalHistory: '',
    abhaId: '',
  });

  const [formSuccessMessage, setFormSuccessMessage] = useState(null);
  const [newlyAddedPatient, setNewlyAddedPatient] = useState(null);

  // Auto calculate age from DOB if entered
  const handleDobChange = (dobVal) => {
    let calculatedAge = patientForm.age;
    if (dobVal) {
      const birthDate = new Date(dobVal);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (!isNaN(age) && age >= 0) calculatedAge = String(age);
    }
    setPatientForm(prev => ({ ...prev, dob: dobVal, age: calculatedAge }));
  };

  const handleAddPatientSubmit = (e) => {
    e.preventDefault();
    if (!patientForm.name.trim() || !patientForm.phone.trim()) {
      alert('Please fill in Patient Name and Phone Number.');
      return;
    }

    const newIdNum = patients.length + 101;
    const generatedPatientId = `PAT-${newIdNum}`;
    const generatedAbha = patientForm.abhaId || `ABHA${Math.floor(100000 + Math.random() * 900000)}`;

    const newPatient = {
      id: generatedPatientId,
      patientId: generatedPatientId,
      name: patientForm.name.trim(),
      age: parseInt(patientForm.age, 10) || 30,
      gender: patientForm.gender,
      phone: patientForm.phone.trim(),
      blood: patientForm.blood,
      dept: 'General Medicine',
      status: 'OPD',
      regDate: todayStr,
      visitDate: todayStr,
      dob: patientForm.dob || '1995-01-01',
      address: `${patientForm.address.trim() || 'Salem'}, ${patientForm.district}, ${patientForm.state} - ${patientForm.pincode}`,
      emergencyContact: `${patientForm.emergencyContactName} (${patientForm.emergencyContactRelation}) - ${patientForm.emergencyContactPhone}`,
      allergies: patientForm.allergies ? [patientForm.allergies] : ['None'],
      medicalNotes: patientForm.medicalHistory || 'New registration at front desk.',
      abhaId: generatedAbha,
      maskedAbha: `ABHA****${generatedAbha.slice(-4)}`,
      maskedPhone: patientForm.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2'),
    };

    setPatients(prev => [newPatient, ...prev]);
    setNewlyAddedPatient(newPatient);
    setFormSuccessMessage(`Patient "${newPatient.name}" registered successfully with Patient ID: ${newPatient.id}`);

    // Reset form
    setPatientForm({
      name: '',
      dob: '',
      age: '',
      gender: 'Male',
      phone: '',
      email: '',
      address: '',
      district: 'Salem',
      state: 'Tamil Nadu',
      pincode: '636001',
      emergencyContactName: '',
      emergencyContactRelation: 'Spouse',
      emergencyContactPhone: '',
      blood: 'O+',
      maritalStatus: 'Married',
      allergies: 'None',
      medicalHistory: '',
      abhaId: '',
    });
  };

  // -------------------------------------------------------------
  // State for OP Card Module
  // -------------------------------------------------------------
  const [opSearchQuery, setOpSearchQuery] = useState('');
  const [selectedPatientForOp, setSelectedPatientForOp] = useState(null);
  const [opDepartment, setOpDepartment] = useState('General Medicine');
  const [opDoctor, setOpDoctor] = useState('Dr. Priya Sharma');
  const [opConsultType, setOpConsultType] = useState('New Consultation');
  const [opSymptoms, setOpSymptoms] = useState('');
  const [generatedOpCard, setGeneratedOpCard] = useState(null);
  const [previewOpModal, setPreviewOpModal] = useState(null); // OP Card object to view/print

  // Filter doctors by selected department in OP form
  const availableDeptDoctors = useMemo(() => {
    const matched = DOCTORS.filter(d => d.department.toLowerCase() === opDepartment.toLowerCase());
    return matched.length > 0 ? matched : DOCTORS;
  }, [opDepartment]);

  // Update selected doctor when department changes if current doctor is not in new department
  useEffect(() => {
    if (availableDeptDoctors.length > 0) {
      const exists = availableDeptDoctors.some(d => d.name === opDoctor);
      if (!exists) {
        setOpDoctor(availableDeptDoctors[0].name);
      }
    }
  }, [opDepartment, availableDeptDoctors, opDoctor]);

  // Live search patients for OP Card selection
  const filteredOpPatients = useMemo(() => {
    if (!opSearchQuery.trim()) return [];
    const q = opSearchQuery.toLowerCase();
    return patients.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.id?.toLowerCase().includes(q) ||
      p.patientId?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [patients, opSearchQuery]);

  const handleSelectPatientForOp = (patient) => {
    setSelectedPatientForOp(patient);
    setOpSearchQuery('');
  };

  const handleGenerateOpCard = (e) => {
    if (e) e.preventDefault();
    if (!selectedPatientForOp) {
      alert('Please select a patient first.');
      return;
    }

    const opNum = `OP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const tokenNum = `T-${String(opCards.length + 5).padStart(2, '0')}`;

    // Valid for 15 days from today
    const vDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(vDate.getDate() + 15);
    const validUntilStr = expiryDate.toISOString().split('T')[0];

    const newCard = {
      opNumber: opNum,
      patientId: selectedPatientForOp.id || selectedPatientForOp.patientId,
      patientName: selectedPatientForOp.name,
      age: selectedPatientForOp.age,
      gender: selectedPatientForOp.gender,
      phone: selectedPatientForOp.phone,
      blood: selectedPatientForOp.blood,
      address: selectedPatientForOp.address,
      emergencyContact: selectedPatientForOp.emergencyContact || 'Not recorded',
      department: opDepartment,
      doctor: opDoctor,
      visitDate: todayStr,
      validUntil: validUntilStr,
      token: tokenNum,
      consultType: opConsultType,
      symptoms: opSymptoms || 'Routine OPD Evaluation',
      fee: '₹50 (Govt Subsidized)',
      issuedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + todayStr,
      issuedBy: 'Meena Krishnan (REC-1001)',
    };

    setOpCards(prev => [newCard, ...prev]);
    setGeneratedOpCard(newCard);
    setPreviewOpModal(newCard);
  };

  // -------------------------------------------------------------
  // Patients Directory Search & Filter State
  // -------------------------------------------------------------
  const [patientsSearch, setPatientsSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [bloodFilter, setBloodFilter] = useState('All');
  const [viewPatientModal, setViewPatientModal] = useState(null);
  const [editPatientModal, setEditPatientModal] = useState(null);

  const filteredPatientsList = useMemo(() => {
    return patients.filter(p => {
      const matchSearch = !patientsSearch.trim() ||
        p.name?.toLowerCase().includes(patientsSearch.toLowerCase()) ||
        p.id?.toLowerCase().includes(patientsSearch.toLowerCase()) ||
        p.phone?.toLowerCase().includes(patientsSearch.toLowerCase());
      const matchGender = genderFilter === 'All' || p.gender === genderFilter;
      const matchBlood = bloodFilter === 'All' || p.blood === bloodFilter;
      return matchSearch && matchGender && matchBlood;
    });
  }, [patients, patientsSearch, genderFilter, bloodFilter]);

  const handleSaveEditPatient = (e) => {
    e.preventDefault();
    if (!editPatientModal) return;
    setPatients(prev => prev.map(p => (p.id === editPatientModal.id ? editPatientModal : p)));
    setEditPatientModal(null);
    alert('Patient details updated successfully.');
  };

  // -------------------------------------------------------------
  // Appointments Booking & Rescheduling State
  // -------------------------------------------------------------
  const [apptFilterStatus, setApptFilterStatus] = useState('All');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [rescheduleModal, setRescheduleModal] = useState(null); // Appointment object

  const [bookingForm, setBookingForm] = useState({
    patientId: '',
    patientName: '',
    department: 'General Medicine',
    doctor: 'Dr. Priya Sharma',
    date: todayStr,
    time: '10:00 AM',
    type: 'Consultation',
  });

  const [apptPatientSearch, setApptPatientSearch] = useState('');
  const apptPatientSuggestions = useMemo(() => {
    if (!apptPatientSearch.trim()) return [];
    const q = apptPatientSearch.toLowerCase();
    return patients.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.id?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [patients, apptPatientSearch]);

  const handleSelectPatientForAppt = (patient) => {
    setBookingForm(prev => ({
      ...prev,
      patientId: patient.id,
      patientName: patient.name,
    }));
    setApptPatientSearch(`${patient.name} (${patient.id})`);
  };

  const handleBookAppointmentSubmit = (e) => {
    e.preventDefault();
    if (!bookingForm.patientName) {
      alert('Please select or enter patient name.');
      return;
    }

    const newAppt = {
      id: `APT${String(appointments.length + 101).padStart(3, '0')}`,
      patient: bookingForm.patientName,
      patientId: bookingForm.patientId || 'PAT-NEW',
      doctor: bookingForm.doctor,
      dept: bookingForm.department,
      date: bookingForm.date,
      time: bookingForm.time,
      type: bookingForm.type,
      status: 'Scheduled',
      token: `T-${String(appointments.length + 1).padStart(2, '0')}`,
    };

    setAppointments(prev => [newAppt, ...prev]);
    setIsBookModalOpen(false);
    alert(`Appointment booked successfully for ${newAppt.patient} with ${newAppt.doctor} on ${newAppt.date} at ${newAppt.time}. Token: ${newAppt.token}`);
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!rescheduleModal) return;
    setAppointments(prev => prev.map(a => a.id === rescheduleModal.id ? rescheduleModal : a));
    alert(`Appointment ${rescheduleModal.id} rescheduled to ${rescheduleModal.date} at ${rescheduleModal.time}.`);
    setRescheduleModal(null);
  };

  const handleCancelAppointment = (apptId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, status: 'Cancelled' } : a));
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => {
      if (apptFilterStatus === 'All') return true;
      if (apptFilterStatus === 'Today') return a.date === todayStr || a.date === '2026-09-05';
      return a.status === apptFilterStatus;
    });
  }, [appointments, apptFilterStatus]);

  // Direct trigger for OP Card print
  const handlePrintOpCard = () => {
    window.print();
  };

  // Direct trigger for OP Card download / receipt
  const handleDownloadOpCard = (card) => {
    const cardContent = `
============================================================
GOVERNMENT DISTRICT HOSPITAL — SALEM
CAREBRIDGE HEALTHCARE NETWORK · OUTPATIENT CARD
============================================================
OP Card Number: ${card.opNumber}
Token Number:   ${card.token}
Issued Date:    ${card.issuedAt}
Validity:       Valid until ${card.validUntil}
------------------------------------------------------------
PATIENT DETAILS:
Patient ID:     ${card.patientId}
Name:           ${card.patientName}
Age / Gender:   ${card.age} Yrs / ${card.gender}
Blood Group:    ${card.blood || 'N/A'}
Phone:          ${card.phone}
Address:        ${card.address || 'Salem District'}
Emergency:      ${card.emergencyContact || 'N/A'}
------------------------------------------------------------
CONSULTATION DETAILS:
Department:     ${card.department}
Consulting Dr:  ${card.doctor}
Consult Type:   ${card.consultType}
Registration Fee: ${card.fee}
Issued By:      ${card.issuedBy}
============================================================
Please report to the assigned OPD room 15 minutes before token call.
This card must be produced during all follow-up visits and pharmacy dispensing.
============================================================
`;
    const blob = new Blob([cardContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${card.opNumber}_${card.patientName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fade-in" style={{ padding: '0 4px' }}>

      {/* Header Bar */}
      <div className="dashboard-header" style={{ marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>💼</span>
            <h1 className="dashboard-title" style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0F172A' }}>
              Reception & Front Desk Portal
            </h1>
          </div>
          <div className="dashboard-subtitle" style={{ marginTop: 4, color: '#64748B', fontSize: 13 }}>
            Meena Krishnan · Staff ID: <code style={{ color: '#0369A1', fontWeight: 600 }}>REC-1001</code> · Salem District Hospital Front Desk
          </div>
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn ${activeTab === 'add-patient' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => { setActiveTab('add-patient'); navigate('/receptionist/dashboard/add-patient'); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <UserPlus size={16} />
            <span>Add Patient</span>
          </button>
          <button
            type="button"
            className={`btn ${activeTab === 'op-card' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => { setActiveTab('op-card'); navigate('/receptionist/dashboard/op-card'); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <FileText size={16} />
            <span>Issue OP Card</span>
          </button>
          <button
            type="button"
            className={`btn ${activeTab === 'appointments' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => { setActiveTab('appointments'); navigate('/receptionist/dashboard/appointments'); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Calendar size={16} />
            <span>Appointments</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div style={{
        display: 'flex',
        gap: 8,
        borderBottom: '1px solid #E2E8F0',
        marginBottom: 20,
        paddingBottom: 4,
        overflowX: 'auto'
      }}>
        {[
          { id: 'dashboard', label: 'Overview Dashboard', icon: HeartPulse, path: '/receptionist/dashboard' },
          { id: 'add-patient', label: 'Add Patient Registration', icon: UserCheck, path: '/receptionist/dashboard/add-patient' },
          { id: 'patients', label: `Patients List (${patients.length})`, icon: Users, path: '/receptionist/dashboard/patients' },
          { id: 'op-card', label: `OP Card Generator (${opCards.length})`, icon: FileText, path: '/receptionist/dashboard/op-card' },
          { id: 'appointments', label: `Appointments (${appointments.length})`, icon: Calendar, path: '/receptionist/dashboard/appointments' },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              navigate(tab.path);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              fontSize: 13,
              fontWeight: activeTab === tab.id ? 700 : 500,
              borderRadius: '8px 8px 0 0',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid #0EA5E9' : '3px solid transparent',
              background: activeTab === tab.id ? '#F0F9FF' : 'transparent',
              color: activeTab === tab.id ? '#0284C7' : '#64748B',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* =========================================================================
          TAB 1: DASHBOARD OVERVIEW
          ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div>
          {/* 4 Core Summary Cards Required */}
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
            {/* 1. Total Patients */}
            <div className="stat-card" style={{ borderLeft: '4px solid #0EA5E9' }}>
              <div className="stat-icon" style={{ background: '#E0F2FE' }}>
                <Users size={22} color="#0284C7" />
              </div>
              <div className="stat-label" style={{ fontWeight: 600, color: '#64748B' }}>Total Patients</div>
              <div className="stat-value" style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
                {totalPatientsCount.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: '#10B981', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>● Registered in system</span>
              </div>
            </div>

            {/* 2. New Patients Today */}
            <div className="stat-card" style={{ borderLeft: '4px solid #10B981' }}>
              <div className="stat-icon" style={{ background: '#D1FAE5' }}>
                <UserPlus size={22} color="#059669" />
              </div>
              <div className="stat-label" style={{ fontWeight: 600, color: '#64748B' }}>New Patients Today</div>
              <div className="stat-value" style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
                {newPatientsTodayCount}
              </div>
              <div style={{ fontSize: 11, color: '#059669', marginTop: 4 }}>
                ↑ Front desk intake active
              </div>
            </div>

            {/* 3. Today's Appointments */}
            <div className="stat-card" style={{ borderLeft: '4px solid #F59E0B' }}>
              <div className="stat-icon" style={{ background: '#FEF3C7' }}>
                <Calendar size={22} color="#D97706" />
              </div>
              <div className="stat-label" style={{ fontWeight: 600, color: '#64748B' }}>Today's Appointments</div>
              <div className="stat-value" style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
                {todaysAppointmentsCount}
              </div>
              <div style={{ fontSize: 11, color: '#D97706', marginTop: 4 }}>
                Scheduled across all OPDs
              </div>
            </div>

            {/* 4. OP Cards Issued Today */}
            <div className="stat-card" style={{ borderLeft: '4px solid #8B5CF6' }}>
              <div className="stat-icon" style={{ background: '#EDE9FE' }}>
                <FileText size={22} color="#7C3AED" />
              </div>
              <div className="stat-label" style={{ fontWeight: 600, color: '#64748B' }}>OP Cards Issued Today</div>
              <div className="stat-value" style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
                {opCardsIssuedTodayCount}
              </div>
              <div style={{ fontSize: 11, color: '#7C3AED', marginTop: 4 }}>
                Valid for 15 days consultations
              </div>
            </div>
          </div>

          {/* Quick Action Shortcuts Grid */}
          <div className="card" style={{ marginBottom: 20, background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)', border: '1px solid #BFDBFE' }}>
            <div className="card-header" style={{ borderBottom: '1px solid #DBEAFE' }}>
              <div className="card-title" style={{ color: '#1E3A8A', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={18} color="#2563EB" />
                <span>Front Desk Quick Workflows</span>
              </div>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                <button
                  type="button"
                  onClick={() => { setActiveTab('add-patient'); navigate('/receptionist/dashboard/add-patient'); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    borderRadius: 10,
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserPlus size={20} color="#0284C7" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Register Patient</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>Create new Patient ID</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('op-card'); navigate('/receptionist/dashboard/op-card'); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    borderRadius: 10,
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={20} color="#7C3AED" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Generate OP Card</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>Search patient & print card</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('appointments'); navigate('/receptionist/dashboard/appointments'); setIsBookModalOpen(true); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    borderRadius: 10,
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={20} color="#059669" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Book Appointment</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>Doctor slot & token</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('patients'); navigate('/receptionist/dashboard/patients'); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    borderRadius: 10,
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={20} color="#D97706" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Patients Directory</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>View, Edit & History</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* 2 Column Layout: OPD Queue & Available Doctors */}
          <div className="grid-2" style={{ gap: 20, marginBottom: 20 }}>

            {/* Today's OPD Queue */}
            <div className="card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={18} color="#0EA5E9" />
                  <span>Today's OPD Queue & Tokens</span>
                </div>
                <span className="badge badge-info">{appointments.length} in queue</span>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                {appointments.slice(0, 6).map((a, idx) => (
                  <div
                    key={a.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 18px',
                      borderBottom: '1px solid #F1F5F9',
                      background: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA'
                    }}
                  >
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: idx === 0 ? '#0284C7' : '#F1F5F9',
                      color: idx === 0 ? '#FFFFFF' : '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 13,
                      flexShrink: 0
                    }}>
                      {a.token}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {a.patient}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>
                        {a.doctor} · <span style={{ color: '#0369A1' }}>{a.dept || 'General Medicine'}</span> · {a.time}
                      </div>
                    </div>
                    <div>
                      <span className={`badge ${
                        a.status === 'Checked-in' ? 'badge-info' :
                        a.status === 'Waiting' ? 'badge-warning' :
                        a.status === 'Cancelled' ? 'badge-danger' : 'badge-neutral'
                      }`}>
                        {a.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Doctors on Duty */}
            <div className="card">
              <div className="card-header">
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Stethoscope size={18} color="#10B981" />
                  <span>Doctors on Duty (OPD Consultation)</span>
                </div>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                {DOCTORS.slice(0, 6).map(doc => (
                  <div
                    key={doc.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '11px 18px',
                      borderBottom: '1px solid #F1F5F9'
                    }}
                  >
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: doc.available ? '#D1FAE5' : '#FEE2E2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 700,
                      color: doc.available ? '#059669' : '#DC2626',
                      flexShrink: 0
                    }}>
                      {doc.name.split(' ')[1]?.[0] || 'D'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                        {doc.name}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>
                        {doc.department} · {doc.timings}
                      </div>
                    </div>
                    <div>
                      {doc.available ? (
                        <button
                          type="button"
                          className="btn btn-primary btn-xs"
                          onClick={() => {
                            setBookingForm(prev => ({
                              ...prev,
                              department: doc.department,
                              doctor: doc.name
                            }));
                            setActiveTab('appointments');
                            navigate('/receptionist/dashboard/appointments');
                            setIsBookModalOpen(true);
                          }}
                        >
                          Book Slot
                        </button>
                      ) : (
                        <span className="badge badge-neutral" style={{ fontSize: 10 }}>In Round</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Recent Issued OP Cards */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={18} color="#8B5CF6" />
                <span>Recently Issued OP Cards</span>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-xs"
                onClick={() => { setActiveTab('op-card'); navigate('/receptionist/dashboard/op-card'); }}
              >
                View All OP Cards →
              </button>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B', fontSize: 11, textTransform: 'uppercase' }}>
                      <th style={{ padding: '10px 16px' }}>OP Number</th>
                      <th style={{ padding: '10px 16px' }}>Patient</th>
                      <th style={{ padding: '10px 16px' }}>Doctor & Dept</th>
                      <th style={{ padding: '10px 16px' }}>Visit Date</th>
                      <th style={{ padding: '10px 16px' }}>Token</th>
                      <th style={{ padding: '10px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opCards.slice(0, 4).map(card => (
                      <tr key={card.opNumber} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '10px 16px', fontWeight: 700, color: '#0284C7' }}>
                          {card.opNumber}
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ fontWeight: 600, color: '#0F172A' }}>{card.patientName}</div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>ID: {card.patientId} · {card.age}Y/{card.gender}</div>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <div>{card.doctor}</div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>{card.department}</div>
                        </td>
                        <td style={{ padding: '10px 16px', color: '#475569' }}>
                          {card.visitDate}
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <span className="badge badge-info">{card.token}</span>
                        </td>
                        <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-xs"
                              onClick={() => setPreviewOpModal(card)}
                              title="View OP Card"
                            >
                              <Eye size={13} />
                              <span>View</span>
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary btn-xs"
                              onClick={() => setPreviewOpModal(card)}
                              title="Print OP Card"
                            >
                              <Printer size={13} />
                              <span>Print</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: ADD PATIENT REGISTRATION
          ========================================================================= */}
      {activeTab === 'add-patient' && (
        <div className="card" style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="card-header" style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
            <div>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16 }}>
                <UserPlus size={20} color="#0EA5E9" />
                <span>New Patient Registration Form</span>
              </div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                Enter patient personal, contact and emergency information. Unique Patient ID is generated automatically.
              </div>
            </div>
          </div>

          {/* Success Banner if newly added */}
          {formSuccessMessage && newlyAddedPatient && (
            <div style={{
              margin: '16px 20px 0',
              padding: '14px 18px',
              borderRadius: 8,
              background: '#ECFDF5',
              border: '1px solid #A7F3D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle2 size={22} color="#059669" />
                <div>
                  <div style={{ fontWeight: 700, color: '#065F46', fontSize: 13 }}>Registration Completed!</div>
                  <div style={{ fontSize: 12, color: '#047857' }}>
                    {formSuccessMessage}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    handleSelectPatientForOp(newlyAddedPatient);
                    setActiveTab('op-card');
                    navigate('/receptionist/dashboard/op-card');
                  }}
                  style={{ background: '#059669', borderColor: '#059669' }}
                >
                  <FileText size={14} />
                  <span>Issue OP Card Now</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setFormSuccessMessage(null)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <div className="card-body" style={{ padding: 24 }}>
            <form onSubmit={handleAddPatientSubmit}>

              {/* Section 1: Basic Information */}
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 12, borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                  1. Basic Patient Details
                </h3>

                <div className="grid-2" style={{ gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Full Patient Name <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={patientForm.name}
                      onChange={e => setPatientForm({ ...patientForm, name: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div className="grid-2" style={{ gap: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        className="form-input"
                        value={patientForm.dob}
                        onChange={e => handleDobChange(e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                        Age (Years) <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="125"
                        required
                        className="form-input"
                        placeholder="e.g. 42"
                        value={patientForm.age}
                        onChange={e => setPatientForm({ ...patientForm, age: e.target.value })}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid-3" style={{ gap: 14, marginTop: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Gender <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <select
                      className="form-select"
                      value={patientForm.gender}
                      onChange={e => setPatientForm({ ...patientForm, gender: e.target.value })}
                      style={{ width: '100%' }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Transgender">Transgender</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Blood Group
                    </label>
                    <select
                      className="form-select"
                      value={patientForm.blood}
                      onChange={e => setPatientForm({ ...patientForm, blood: e.target.value })}
                      style={{ width: '100%' }}
                    >
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Marital Status
                    </label>
                    <select
                      className="form-select"
                      value={patientForm.maritalStatus}
                      onChange={e => setPatientForm({ ...patientForm, maritalStatus: e.target.value })}
                      style={{ width: '100%' }}
                    >
                      <option value="Married">Married</option>
                      <option value="Single">Single</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Divorced">Divorced</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Contact & Address */}
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 12, borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                  2. Contact & Residential Address
                </h3>

                <div className="grid-2" style={{ gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Phone Number <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      required
                      placeholder="+91 98765 43210"
                      value={patientForm.phone}
                      onChange={e => setPatientForm({ ...patientForm, phone: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="patient@example.com"
                      value={patientForm.email}
                      onChange={e => setPatientForm({ ...patientForm, email: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Street Address / House No.
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 14/2 Gandhi Road, Fairlands"
                    value={patientForm.address}
                    onChange={e => setPatientForm({ ...patientForm, address: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div className="grid-3" style={{ gap: 14, marginTop: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      District / City
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={patientForm.district}
                      onChange={e => setPatientForm({ ...patientForm, district: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      State
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={patientForm.state}
                      onChange={e => setPatientForm({ ...patientForm, state: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Pincode
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={patientForm.pincode}
                      onChange={e => setPatientForm({ ...patientForm, pincode: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Emergency Contact & Medical Info */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 12, borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
                  3. Emergency Contact & Basic Medical Data
                </h3>

                <div className="grid-3" style={{ gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. S. Kumar"
                      value={patientForm.emergencyContactName}
                      onChange={e => setPatientForm({ ...patientForm, emergencyContactName: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Relationship
                    </label>
                    <select
                      className="form-select"
                      value={patientForm.emergencyContactRelation}
                      onChange={e => setPatientForm({ ...patientForm, emergencyContactRelation: e.target.value })}
                      style={{ width: '100%' }}
                    >
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Child">Child</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Relative / Guardian">Relative / Guardian</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Emergency Phone
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="+91 94432 00000"
                      value={patientForm.emergencyContactPhone}
                      onChange={e => setPatientForm({ ...patientForm, emergencyContactPhone: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: 14, marginTop: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Known Drug Allergies
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Penicillin, Sulfa drugs or None"
                      value={patientForm.allergies}
                      onChange={e => setPatientForm({ ...patientForm, allergies: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      National ABHA ID / Health ID (Optional)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. ABHA10099"
                      value={patientForm.abhaId}
                      onChange={e => setPatientForm({ ...patientForm, abhaId: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Pre-existing Conditions / Medical Notes
                  </label>
                  <textarea
                    rows="2"
                    className="form-input"
                    placeholder="e.g. Patient has history of hypertension, reports fever since 2 days..."
                    value={patientForm.medicalHistory}
                    onChange={e => setPatientForm({ ...patientForm, medicalHistory: e.target.value })}
                    style={{ width: '100%', resize: 'vertical' }}
                  ></textarea>
                </div>
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid #E2E8F0', paddingTop: 18 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setPatientForm({
                      name: '', dob: '', age: '', gender: 'Male', phone: '', email: '',
                      address: '', district: 'Salem', state: 'Tamil Nadu', pincode: '636001',
                      emergencyContactName: '', emergencyContactRelation: 'Spouse', emergencyContactPhone: '',
                      blood: 'O+', maritalStatus: 'Married', allergies: 'None', medicalHistory: '', abhaId: ''
                    });
                  }}
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', fontSize: 14 }}
                >
                  <UserCheck size={18} />
                  <span>Register Patient & Generate ID</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: OP CARD MODULE
          ========================================================================= */}
      {activeTab === 'op-card' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>

          {/* Top Generator Card */}
          <div className="card">
            <div className="card-header" style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={20} color="#0EA5E9" />
                <span>Outpatient (OP) Card Generator</span>
              </div>
            </div>
            <div className="card-body" style={{ padding: 20 }}>

              {/* Search Patient Bar */}
              <div style={{ marginBottom: 20, position: 'relative' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                  Search Patient (by Name, Patient ID, or Phone Number):
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 11 }} />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Type patient name, e.g. 'Ravi Kumar', 'PAT001', or '+91 94567...'"
                      value={opSearchQuery}
                      onChange={e => setOpSearchQuery(e.target.value)}
                      style={{ paddingLeft: 38, width: '100%' }}
                    />
                  </div>
                </div>

                {/* Live Dropdown Results */}
                {filteredOpPatients.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: 8,
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    zIndex: 50,
                    marginTop: 4,
                    maxHeight: 240,
                    overflowY: 'auto'
                  }}>
                    {filteredOpPatients.map(p => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectPatientForOp(p)}
                        style={{
                          padding: '10px 14px',
                          borderBottom: '1px solid #F1F5F9',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'background 0.1s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F0F9FF'}
                        onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
                      >
                        <div>
                          <span style={{ fontWeight: 700, color: '#0F172A', marginRight: 8 }}>{p.name}</span>
                          <span style={{ fontSize: 12, color: '#0284C7', background: '#E0F2FE', padding: '2px 6px', borderRadius: 4 }}>ID: {p.id}</span>
                        </div>
                        <div style={{ fontSize: 12, color: '#64748B' }}>
                          {p.age}Y/{p.gender} · {p.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Patient Selected Pill / Form */}
              {selectedPatientForOp ? (
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 18, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div>
                      <span className="badge badge-info" style={{ marginBottom: 4 }}>Selected Patient</span>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: '4px 0' }}>
                        {selectedPatientForOp.name}
                      </h3>
                      <div style={{ fontSize: 12, color: '#64748B' }}>
                        ID: <strong style={{ color: '#0284C7' }}>{selectedPatientForOp.id}</strong> · Age/Gender: <strong>{selectedPatientForOp.age} Yrs / {selectedPatientForOp.gender}</strong> · Blood: <strong>{selectedPatientForOp.blood || 'O+'}</strong>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-xs"
                      onClick={() => setSelectedPatientForOp(null)}
                    >
                      Change Patient
                    </button>
                  </div>

                  {/* OP Generation Form Controls */}
                  <div className="grid-3" style={{ gap: 14 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                        Department <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <select
                        className="form-select"
                        value={opDepartment}
                        onChange={e => setOpDepartment(e.target.value)}
                        style={{ width: '100%' }}
                      >
                        {DEPARTMENTS.map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                        Consulting Doctor <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <select
                        className="form-select"
                        value={opDoctor}
                        onChange={e => setOpDoctor(e.target.value)}
                        style={{ width: '100%' }}
                      >
                        {availableDeptDoctors.map(doc => (
                          <option key={doc.id} value={doc.name}>{doc.name} ({doc.specialization})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                        Consultation Type
                      </label>
                      <select
                        className="form-select"
                        value={opConsultType}
                        onChange={e => setOpConsultType(e.target.value)}
                        style={{ width: '100%' }}
                      >
                        <option value="New Consultation">New Consultation</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Emergency Consultation">Emergency Consultation</option>
                        <option value="Review / Prescription Refill">Review / Prescription Refill</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Chief Complaint / Presenting Symptoms (Optional)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Headache and fever for 3 days / Routine blood pressure check..."
                      value={opSymptoms}
                      onChange={e => setOpSymptoms(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleGenerateOpCard}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontSize: 14 }}
                    >
                      <FileText size={18} />
                      <span>Generate & Preview OP Card</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '24px',
                  borderRadius: 8,
                  border: '2px dashed #CBD5E1',
                  textAlign: 'center',
                  background: '#F8FAFC',
                  color: '#64748B'
                }}>
                  <Search size={32} color="#94A3B8" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>No Patient Selected</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    Use the search bar above to select a registered patient, or click "Add Patient" if the patient is visiting for the first time.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Issued OP Cards Table */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Barcode size={20} color="#6366F1" />
                <span>Issued OP Cards Register ({opCards.length})</span>
              </div>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B', fontSize: 11, textTransform: 'uppercase' }}>
                      <th style={{ padding: '10px 16px' }}>OP Number</th>
                      <th style={{ padding: '10px 16px' }}>Patient Details</th>
                      <th style={{ padding: '10px 16px' }}>Department & Doctor</th>
                      <th style={{ padding: '10px 16px' }}>Visit Date</th>
                      <th style={{ padding: '10px 16px' }}>Token</th>
                      <th style={{ padding: '10px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opCards.map(card => (
                      <tr key={card.opNumber} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 800, color: '#0284C7' }}>
                          {card.opNumber}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#0F172A' }}>{card.patientName}</div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>
                            ID: {card.patientId} · {card.age}Y/{card.gender} · {card.phone}
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 600, color: '#1E293B' }}>{card.doctor}</div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>{card.department}</div>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#475569' }}>
                          <div>{card.visitDate}</div>
                          <div style={{ fontSize: 10, color: '#059669' }}>Valid: 15 Days</div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span className="badge badge-info" style={{ fontWeight: 800 }}>{card.token}</span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-xs"
                              onClick={() => setPreviewOpModal(card)}
                              title="View OP Card"
                            >
                              <Eye size={14} />
                              <span>View</span>
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary btn-xs"
                              onClick={() => handleDownloadOpCard(card)}
                              title="Download OP Card"
                            >
                              <Download size={14} />
                              <span>Download</span>
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary btn-xs"
                              onClick={() => setPreviewOpModal(card)}
                              title="Print OP Card"
                            >
                              <Printer size={14} />
                              <span>Print</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 4: PATIENTS DIRECTORY (VIEW / EDIT / GENERATE OP CARD)
          ========================================================================= */}
      {activeTab === 'patients' && (
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={20} color="#0EA5E9" />
                <span>Patients Management Directory</span>
              </div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                Search, filter, view complete records, edit information, and generate instant OP Cards.
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => { setActiveTab('add-patient'); navigate('/receptionist/dashboard/add-patient'); }}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <UserPlus size={15} />
              <span>Register New Patient</span>
            </button>
          </div>

          <div className="card-body" style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
                <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 10, top: 10 }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by Patient ID, Name, Phone..."
                  value={patientsSearch}
                  onChange={e => setPatientsSearch(e.target.value)}
                  style={{ paddingLeft: 34, width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>Gender:</span>
                <select
                  className="form-select"
                  value={genderFilter}
                  onChange={e => setGenderFilter(e.target.value)}
                  style={{ padding: '6px 12px', fontSize: 12 }}
                >
                  <option value="All">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B' }}>Blood Group:</span>
                <select
                  className="form-select"
                  value={bloodFilter}
                  onChange={e => setBloodFilter(e.target.value)}
                  style={{ padding: '6px 12px', fontSize: 12 }}
                >
                  <option value="All">All Blood</option>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {(patientsSearch || genderFilter !== 'All' || bloodFilter !== 'All') && (
                <button
                  type="button"
                  className="btn btn-secondary btn-xs"
                  onClick={() => { setPatientsSearch(''); setGenderFilter('All'); setBloodFilter('All'); }}
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          <div className="card-body" style={{ padding: 0 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B', fontSize: 11, textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px 16px' }}>Patient ID</th>
                    <th style={{ padding: '10px 16px' }}>Patient Name</th>
                    <th style={{ padding: '10px 16px' }}>Age</th>
                    <th style={{ padding: '10px 16px' }}>Gender</th>
                    <th style={{ padding: '10px 16px' }}>Phone</th>
                    <th style={{ padding: '10px 16px' }}>Registration Date</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatientsList.slice(0, 15).map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0284C7' }}>
                        {p.id}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0F172A' }}>
                        <div>{p.name}</div>
                        {p.blood && <span style={{ fontSize: 10, background: '#FEE2E2', color: '#DC2626', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>{p.blood}</span>}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#334155' }}>
                        {p.age} Yrs
                      </td>
                      <td style={{ padding: '12px 16px', color: '#334155' }}>
                        {p.gender}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#334155' }}>
                        {p.phone}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#64748B' }}>
                        {p.regDate || '2026-09-01'}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-xs"
                            onClick={() => setViewPatientModal(p)}
                            title="View Details"
                          >
                            <Eye size={13} />
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-xs"
                            onClick={() => setEditPatientModal({ ...p })}
                            title="Edit Patient"
                          >
                            <Edit3 size={13} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-xs"
                            onClick={() => {
                              handleSelectPatientForOp(p);
                              setActiveTab('op-card');
                              navigate('/receptionist/dashboard/op-card');
                            }}
                            title="Generate OP Card for this patient"
                          >
                            <FileText size={13} />
                            <span>OP Card</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPatientsList.length === 0 && (
              <div style={{ padding: 30, textAlign: 'center', color: '#64748B' }}>
                No patients found matching your search criteria.
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: APPOINTMENTS (BOOK / VIEW TODAY / RESCHEDULE / CANCEL)
          ========================================================================= */}
      {activeTab === 'appointments' && (
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={20} color="#0EA5E9" />
                <span>Appointments Management</span>
              </div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                Book patient doctor consultations, view today's schedule, reschedule slots, and manage cancellations.
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setIsBookModalOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <PlusCircle size={16} />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="card-body" style={{ padding: '14px 20px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginRight: 4 }}>Filter Status:</span>
              {['All', 'Today', 'Scheduled', 'Checked-in', 'Waiting', 'Cancelled'].map(status => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setApptFilterStatus(status)}
                  style={{
                    padding: '4px 12px',
                    fontSize: 12,
                    fontWeight: apptFilterStatus === status ? 700 : 500,
                    borderRadius: 6,
                    border: '1px solid',
                    borderColor: apptFilterStatus === status ? '#0EA5E9' : '#CBD5E1',
                    background: apptFilterStatus === status ? '#E0F2FE' : '#FFFFFF',
                    color: apptFilterStatus === status ? '#0284C7' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="card-body" style={{ padding: 0 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B', fontSize: 11, textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px 16px' }}>Token</th>
                    <th style={{ padding: '10px 16px' }}>Patient</th>
                    <th style={{ padding: '10px 16px' }}>Doctor & Department</th>
                    <th style={{ padding: '10px 16px' }}>Date & Time</th>
                    <th style={{ padding: '10px 16px' }}>Type</th>
                    <th style={{ padding: '10px 16px' }}>Status</th>
                    <th style={{ padding: '10px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map(a => (
                    <tr key={a.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 800, color: '#0F172A' }}>
                        <span className="badge badge-info">{a.token}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{a.patient}</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>ID: {a.patientId}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#1E293B' }}>{a.doctor}</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>{a.dept}</div>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#334155' }}>
                        <div style={{ fontWeight: 600 }}>{a.date}</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>{a.time}</div>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>
                        {a.type || 'Consultation'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className={`badge ${
                          a.status === 'Checked-in' ? 'badge-info' :
                          a.status === 'Waiting' ? 'badge-warning' :
                          a.status === 'Cancelled' ? 'badge-danger' :
                          a.status === 'Completed' ? 'badge-success' : 'badge-neutral'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          {a.status !== 'Cancelled' && (
                            <>
                              <button
                                type="button"
                                className="btn btn-secondary btn-xs"
                                onClick={() => setRescheduleModal({ ...a })}
                                title="Reschedule Appointment"
                              >
                                Reschedule
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger btn-xs"
                                onClick={() => handleCancelAppointment(a.id)}
                                title="Cancel Appointment"
                                style={{ background: '#FEE2E2', color: '#DC2626', borderColor: '#FECACA' }}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {a.status === 'Cancelled' && (
                            <span style={{ fontSize: 11, color: '#94A3B8' }}>Cancelled</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAppointments.length === 0 && (
              <div style={{ padding: 30, textAlign: 'center', color: '#64748B' }}>
                No appointments found for the selected filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: VIEW PATIENT DETAILS
          ========================================================================= */}
      {viewPatientModal && (
        <div className="modal-overlay active" style={{ zIndex: 100 }}>
          <div className="modal-card" style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={20} color="#0EA5E9" />
                <span>Patient Profile — {viewPatientModal.name}</span>
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setViewPatientModal(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Patient ID</span>
                  <strong style={{ color: '#0284C7' }}>{viewPatientModal.id}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>National ABHA ID</span>
                  <strong>{viewPatientModal.abhaId || 'ABHA10001'}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Age & Gender</span>
                  <strong>{viewPatientModal.age} Yrs · {viewPatientModal.gender}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Blood Group</span>
                  <strong style={{ color: '#DC2626' }}>{viewPatientModal.blood || 'Unknown'}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Phone Number</span>
                  <strong>{viewPatientModal.phone}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Registration Date</span>
                  <strong>{viewPatientModal.regDate || '2026-09-01'}</strong>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Residential Address</span>
                  <strong>{viewPatientModal.address || 'Salem, Tamil Nadu'}</strong>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Emergency Contact</span>
                  <strong>{viewPatientModal.emergencyContact || 'Not recorded'}</strong>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Known Drug Allergies</span>
                  <strong style={{ color: '#D97706' }}>
                    {Array.isArray(viewPatientModal.allergies) ? viewPatientModal.allergies.join(', ') : (viewPatientModal.allergies || 'None')}
                  </strong>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ color: '#64748B', display: 'block', fontSize: 11 }}>Medical Notes</span>
                  <div style={{ background: '#F8FAFC', padding: 10, borderRadius: 6, marginTop: 4, color: '#334155' }}>
                    {viewPatientModal.medicalNotes || 'No specific notes recorded.'}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ padding: '12px 20px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  handleSelectPatientForOp(viewPatientModal);
                  setViewPatientModal(null);
                  setActiveTab('op-card');
                  navigate('/receptionist/dashboard/op-card');
                }}
              >
                <FileText size={14} />
                <span>Issue OP Card</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setViewPatientModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT PATIENT DETAILS
          ========================================================================= */}
      {editPatientModal && (
        <div className="modal-overlay active" style={{ zIndex: 100 }}>
          <div className="modal-card" style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Edit3 size={18} color="#0EA5E9" />
                <span>Edit Patient Information — {editPatientModal.id}</span>
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setEditPatientModal(null)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveEditPatient}>
              <div className="modal-body" style={{ padding: 20 }}>
                <div className="grid-2" style={{ gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Patient Name
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={editPatientModal.name}
                      onChange={e => setEditPatientModal({ ...editPatientModal, name: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-input"
                      required
                      value={editPatientModal.phone}
                      onChange={e => setEditPatientModal({ ...editPatientModal, phone: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Age
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      required
                      value={editPatientModal.age}
                      onChange={e => setEditPatientModal({ ...editPatientModal, age: parseInt(e.target.value, 10) || 0 })}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Gender
                    </label>
                    <select
                      className="form-select"
                      value={editPatientModal.gender}
                      onChange={e => setEditPatientModal({ ...editPatientModal, gender: e.target.value })}
                      style={{ width: '100%' }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Transgender">Transgender</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Address
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={editPatientModal.address || ''}
                      onChange={e => setEditPatientModal({ ...editPatientModal, address: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Emergency Contact
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={editPatientModal.emergencyContact || ''}
                      onChange={e => setEditPatientModal({ ...editPatientModal, emergencyContact: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>
              <div style={{ padding: '12px 20px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setEditPatientModal(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: BOOK APPOINTMENT
          ========================================================================= */}
      {isBookModalOpen && (
        <div className="modal-overlay active" style={{ zIndex: 100 }}>
          <div className="modal-card" style={{ maxWidth: 550 }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={18} color="#0EA5E9" />
                <span>Book Doctor Appointment</span>
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsBookModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleBookAppointmentSubmit}>
              <div className="modal-body" style={{ padding: 20 }}>

                {/* Patient Search for Appt */}
                <div style={{ marginBottom: 14, position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    Select Patient <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search patient by name or ID..."
                    required
                    value={apptPatientSearch || bookingForm.patientName}
                    onChange={e => {
                      setApptPatientSearch(e.target.value);
                      setBookingForm(prev => ({ ...prev, patientName: e.target.value }));
                    }}
                    style={{ width: '100%' }}
                  />
                  {apptPatientSuggestions.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: 6,
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                      zIndex: 50,
                      maxHeight: 160,
                      overflowY: 'auto'
                    }}>
                      {apptPatientSuggestions.map(p => (
                        <div
                          key={p.id}
                          onClick={() => handleSelectPatientForAppt(p)}
                          style={{ padding: '8px 12px', borderBottom: '1px solid #F1F5F9', cursor: 'pointer', fontSize: 12 }}
                        >
                          <strong>{p.name}</strong> ({p.id}) · {p.phone}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid-2" style={{ gap: 12, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Department <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <select
                      className="form-select"
                      value={bookingForm.department}
                      onChange={e => setBookingForm({ ...bookingForm, department: e.target.value })}
                      style={{ width: '100%' }}
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Doctor <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <select
                      className="form-select"
                      value={bookingForm.doctor}
                      onChange={e => setBookingForm({ ...bookingForm, doctor: e.target.value })}
                      style={{ width: '100%' }}
                    >
                      {DOCTORS.map(d => (
                        <option key={d.id} value={d.name}>{d.name} ({d.department})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid-2" style={{ gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Date <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      required
                      value={bookingForm.date}
                      onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                      Time Slot <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <select
                      className="form-select"
                      value={bookingForm.time}
                      onChange={e => setBookingForm({ ...bookingForm, time: e.target.value })}
                      style={{ width: '100%' }}
                    >
                      {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'].map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>
              <div style={{ padding: '12px 20px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsBookModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: RESCHEDULE APPOINTMENT
          ========================================================================= */}
      {rescheduleModal && (
        <div className="modal-overlay active" style={{ zIndex: 100 }}>
          <div className="modal-card" style={{ maxWidth: 450 }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={18} color="#0EA5E9" />
                <span>Reschedule Appointment</span>
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setRescheduleModal(null)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleRescheduleSubmit}>
              <div className="modal-body" style={{ padding: 20 }}>
                <div style={{ fontSize: 13, marginBottom: 14 }}>
                  Patient: <strong>{rescheduleModal.patient}</strong> (Token: {rescheduleModal.token})
                  <div style={{ color: '#64748B', fontSize: 12 }}>Doctor: {rescheduleModal.doctor} ({rescheduleModal.dept})</div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    New Appointment Date
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    required
                    value={rescheduleModal.date}
                    onChange={e => setRescheduleModal({ ...rescheduleModal, date: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                    New Time Slot
                  </label>
                  <select
                    className="form-select"
                    value={rescheduleModal.time}
                    onChange={e => setRescheduleModal({ ...rescheduleModal, time: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'].map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ padding: '12px 20px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setRescheduleModal(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                >
                  Save Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: OFFICIAL OP CARD VIEW / PRINT LAYOUT
          ========================================================================= */}
      {previewOpModal && (
        <div className="modal-overlay active" style={{ zIndex: 120 }}>
          <div className="modal-card" style={{ maxWidth: 680, background: '#F8FAFC' }}>
            <div className="modal-header" style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Printer size={18} color="#0EA5E9" />
                <h3 className="modal-title" style={{ margin: 0 }}>
                  Hospital Outpatient (OP) Card Preview
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setPreviewOpModal(null)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Print Area Body */}
            <div className="modal-body" style={{ padding: 20 }}>

              {/* Physical Printable Card Container */}
              <div id="printable-op-card" style={{
                background: '#FFFFFF',
                border: '2px solid #0369A1',
                borderRadius: 12,
                padding: '24px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.08)',
                color: '#0F172A',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}>

                {/* Card Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #0284C7', paddingBottom: 14, marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 8, background: '#0284C7', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900 }}>
                      🏥
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: '#0369A1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Government District Hospital — Salem
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
                        National Healthcare Network · Health & Family Welfare Dept, Govt. of Tamil Nadu
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Token No.</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#DC2626', background: '#FEE2E2', padding: '2px 10px', borderRadius: 6 }}>
                      {previewOpModal.token}
                    </div>
                  </div>
                </div>

                {/* OP & Patient Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, marginBottom: 14, background: '#F0F9FF', padding: '12px 16px', borderRadius: 8, border: '1px solid #BAE6FD' }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#0369A1', textTransform: 'uppercase', fontWeight: 700 }}>OP Number</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#0284C7' }}>{previewOpModal.opNumber}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#0369A1', textTransform: 'uppercase', fontWeight: 700 }}>Patient ID</div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#0F172A' }}>{previewOpModal.patientId}</div>
                  </div>
                </div>

                {/* Patient Information Table */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 14, fontSize: 13, borderBottom: '1px dashed #CBD5E1', paddingBottom: 14, marginBottom: 14 }}>
                  <div>
                    <div style={{ marginBottom: 6 }}>
                      <span style={{ color: '#64748B', fontSize: 11 }}>Patient Name: </span>
                      <strong style={{ fontSize: 14, color: '#0F172A' }}>{previewOpModal.patientName}</strong>
                    </div>
                    <div style={{ marginBottom: 6 }}>
                      <span style={{ color: '#64748B', fontSize: 11 }}>Age / Gender: </span>
                      <strong>{previewOpModal.age} Years / {previewOpModal.gender}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748B', fontSize: 11 }}>Phone: </span>
                      <strong>{previewOpModal.phone}</strong>
                    </div>
                  </div>

                  <div>
                    <div style={{ marginBottom: 6 }}>
                      <span style={{ color: '#64748B', fontSize: 11 }}>Blood Group: </span>
                      <strong style={{ color: '#DC2626' }}>{previewOpModal.blood || 'O+'}</strong>
                    </div>
                    <div style={{ marginBottom: 6 }}>
                      <span style={{ color: '#64748B', fontSize: 11 }}>Visit Date: </span>
                      <strong>{previewOpModal.visitDate}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748B', fontSize: 11 }}>Validity: </span>
                      <strong style={{ color: '#059669' }}>15 Days (Till {previewOpModal.validUntil})</strong>
                    </div>
                  </div>
                </div>

                {/* Consultation & Doctor Allocation */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 13, background: '#F8FAFC', padding: 12, borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 14 }}>
                  <div>
                    <span style={{ color: '#64748B', fontSize: 11, display: 'block' }}>Department Assigned</span>
                    <strong style={{ color: '#0284C7', fontSize: 14 }}>{previewOpModal.department}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', fontSize: 11, display: 'block' }}>Consulting Medical Officer</span>
                    <strong style={{ color: '#0F172A', fontSize: 14 }}>{previewOpModal.doctor}</strong>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ color: '#64748B', fontSize: 11, display: 'block' }}>Consultation Type & Notes</span>
                    <span>{previewOpModal.consultType} — {previewOpModal.symptoms || 'Routine OPD Evaluation'}</span>
                  </div>
                </div>

                {/* Footer Signatures & Barcode */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10 }}>
                  <div>
                    <div style={{ fontFamily: 'monospace', fontSize: 14, letterSpacing: '4px', color: '#334155' }}>
                      ||| | |||| | ||||| || ||| ||||
                    </div>
                    <div style={{ fontSize: 9, color: '#94A3B8', marginTop: 2 }}>
                      Issued by: {previewOpModal.issuedBy}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', width: 140, borderTop: '1px solid #94A3B8', paddingTop: 4 }}>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>Doctor's Signature / Stamp</div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px solid #F1F5F9', fontSize: 9, color: '#94A3B8', textAlign: 'center' }}>
                  • Please present this card at the Pharmacy and Laboratory counters • Retain for subsequent review within 15 days •
                </div>

              </div>

            </div>

            {/* Modal Actions */}
            <div style={{ padding: '14px 20px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleDownloadOpCard(previewOpModal)}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Download size={15} />
                <span>Download Slip (.txt)</span>
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPreviewOpModal(null)}
                >
                  Close Preview
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handlePrintOpCard}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Printer size={15} />
                  <span>Print OP Card</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
