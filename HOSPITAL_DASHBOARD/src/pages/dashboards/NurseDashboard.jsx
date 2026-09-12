import { useState } from 'react';
import {
  Users, Pill, AlertTriangle, FileText, ClipboardList,
  Search, Plus, CheckCircle2, Clock, Edit2, Check,
  Sparkles, Calendar, ShieldCheck
} from 'lucide-react';
import { STATS, PATIENTS } from '../../data/mockData';
import { useToast } from '../../components/Toast';
import PatientSearchGateway from '../../components/PatientSearchGateway';

// Standard Patient-Specific Medication Schedules Database (Indexed by Patient ID)
const INITIAL_MEDICATION_SCHEDULES = {
  'P1001': [
    { id: 'M-101', med: 'Paracetamol 500 mg', dosage: '1 tablet', quantity: '1', route: 'Oral', frequency: 'Every 6 hours', time: '08:00 AM', startDate: '2026-09-07', endDate: '2026-09-12', instructions: 'Post meals with full glass of water', status: 'Scheduled' },
    { id: 'M-102', med: 'Amoxicillin 500 mg', dosage: '1 capsule', quantity: '1', route: 'Oral', frequency: '3 times/day', time: '09:00 AM', startDate: '2026-09-07', endDate: '2026-09-14', instructions: 'Take on schedule; complete full course', status: 'Given' },
    { id: 'M-103', med: 'Omeprazole 20 mg', dosage: '1 capsule', quantity: '1', route: 'Oral', frequency: 'Once daily', time: '07:00 AM', startDate: '2026-09-07', endDate: '2026-09-20', instructions: 'Take 30 minutes before breakfast', status: 'Scheduled' },
  ],
  'P1002': [
    { id: 'M-201', med: 'Metformin 500 mg', dosage: '1 tablet', quantity: '1', route: 'Oral', frequency: 'Twice daily', time: '09:00 AM', startDate: '2026-09-07', endDate: '2026-10-07', instructions: 'With breakfast and dinner', status: 'Given' },
    { id: 'M-202', med: 'Folic Acid 5 mg', dosage: '1 tablet', quantity: '1', route: 'Oral', frequency: 'Once daily', time: '02:00 PM', startDate: '2026-09-07', endDate: '2026-10-07', instructions: 'After lunch', status: 'Scheduled' },
  ],
  'PAT001': [
    { id: 'M-301', med: 'Amlodipine 5 mg', dosage: '1 tablet', quantity: '1', route: 'Oral', frequency: 'Once daily', time: '08:00 AM', startDate: '2026-09-07', endDate: '2026-09-30', instructions: 'Daily morning', status: 'Given' },
    { id: 'M-302', med: 'Aspirin 75 mg', dosage: '1 tablet', quantity: '1', route: 'Oral', frequency: 'Once daily', time: '08:00 PM', startDate: '2026-09-07', endDate: '2026-09-30', instructions: 'Evening post-dinner dose', status: 'Scheduled' },
  ],
  'PAT014': [
    { id: 'M-401', med: 'Paracetamol 650 mg', dosage: '1 tablet', quantity: '1', route: 'Oral', frequency: 'Every 6 hours', time: '12:00 PM', startDate: '2026-09-07', endDate: '2026-09-10', instructions: 'For pyrexia > 100°F', status: 'Scheduled' },
    { id: 'M-402', med: 'IV Normal Saline 500 mL', dosage: '500 mL', quantity: '1 bottle', route: 'IV (Intravenous)', frequency: 'Continuous', time: '10:00 AM', startDate: '2026-09-07', endDate: '2026-09-08', instructions: 'Infuse over 4 hours', status: 'Given' },
  ]
};

// Known Patients Directory with OP ID and ABHA ID
const PATIENT_DATABASE = [
  { id: 'P1001', name: 'Arun Kumar', opId: 'OP2026001', abhaId: 'ABHA10001', age: 42, gender: 'Male', ward: 'General Ward', bed: 'B-04', diagnosis: 'Type 2 Diabetes & Hypertension' },
  { id: 'P1002', name: 'Meena Devi', opId: 'OP2026002', abhaId: 'ABHA10002', age: 32, gender: 'Female', ward: 'Gynecology Ward', bed: 'G-03', diagnosis: 'Ante-natal Care' },
  { id: 'PAT001', name: 'Ravi Kumar', opId: 'OP2026003', abhaId: 'ABHA10003', age: 45, gender: 'Male', ward: 'Cardiology Ward', bed: 'C-12', diagnosis: 'Hypertension' },
  { id: 'PAT002', name: 'Priya Sharma', opId: 'OP2026004', abhaId: 'ABHA10004', age: 29, gender: 'Female', ward: 'General Ward', bed: 'B-08', diagnosis: 'Migraine & Tension Headache' },
  { id: 'PAT014', name: 'Sindhu Iyer', opId: 'OP2026015', abhaId: 'ABHA10015', age: 22, gender: 'Female', ward: 'Isolation Ward', bed: 'I-15', diagnosis: 'Dengue Fever with Thrombocytopenia' },
];

export default function NurseDashboard() {
  const toast = useToast();
  const s = STATS.nurse;

  // Selected Patient State for Medication Schedule
  const [selectedPatient, setSelectedPatient] = useState(PATIENT_DATABASE[0]);
  const [medSchedules, setMedSchedules] = useState(INITIAL_MEDICATION_SCHEDULES);

  // Modals State
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [showUpdateMedModal, setShowUpdateMedModal] = useState(false);
  const [editingMed, setEditingMed] = useState(null);

  // Patient Directory Search filter
  const [patientSearchTerm, setPatientSearchTerm] = useState('');

  // Add Medication Form State (All 13 required fields)
  const [medForm, setMedForm] = useState({
    opId: 'OP2026001',
    patientName: 'Arun Kumar',
    patientId: 'P1001',
    medName: '',
    dosage: '1 tablet',
    quantity: '1',
    route: 'Oral',
    frequency: 'Every 6 hours',
    scheduledTime: '08:00 AM',
    startDate: '2026-09-07',
    endDate: '2026-09-12',
    instructions: 'Post meals with water',
    status: 'Scheduled'
  });

  // KPI stat cards (Vital Signs completely removed)
  const statCards = [
    { label: 'All Patients', value: PATIENT_DATABASE.length, icon: Users, color: '#0EA5E9', bg: '#E0F2FE' },
    { label: 'Medication Tasks', value: s.medicationTasks || 18, icon: Pill, color: '#10B981', bg: '#D1FAE5' },
    { label: 'Critical Patients', value: s.criticalPatients || 2, icon: AlertTriangle, color: '#EF4444', bg: '#FEE2E2' },
    { label: 'Doctor Instructions', value: s.doctorInstructions || 9, icon: FileText, color: '#8B5CF6', bg: '#EDE9FE' },
    { label: 'Procedures Today', value: s.proceduresToday || 12, icon: ClipboardList, color: '#14B8A6', bg: '#CCFBF1' },
    { label: 'Active Schedules', value: Object.values(medSchedules).flat().length, icon: Clock, color: '#F59E0B', bg: '#FEF3C7' },
  ];

  // Select patient handler
  function handleSelectPatient(patient) {
    setSelectedPatient(patient);
    setMedForm(prev => ({
      ...prev,
      opId: patient.opId,
      patientName: patient.name,
      patientId: patient.id,
    }));
  }

  // Open Update Medication Modal
  function handleOpenUpdateModal(med) {
    setEditingMed(med);
    setShowUpdateMedModal(true);
  }

  // Save Updated Medication
  function handleSaveMedicationUpdate(e) {
    e.preventDefault();
    if (!selectedPatient || !editingMed) return;

    setMedSchedules(prev => {
      const patientMeds = prev[selectedPatient.id] || [];
      const updated = patientMeds.map(m => m.id === editingMed.id ? { ...editingMed } : m);
      return { ...prev, [selectedPatient.id]: updated };
    });

    setShowUpdateMedModal(false);
    toast(`Updated ${editingMed.med} schedule successfully`, 'success');
  }

  // Add Medication Submission
  function handleAddMedicationSubmit(e) {
    e.preventDefault();
    if (!selectedPatient) {
      toast('Please select a patient first', 'error');
      return;
    }
    if (!medForm.medName.trim()) {
      toast('Please enter the medication name', 'error');
      return;
    }

    const newEntry = {
      id: `M-${Date.now().toString().slice(-4)}`,
      med: medForm.medName,
      dosage: medForm.dosage,
      quantity: medForm.quantity,
      route: medForm.route,
      frequency: medForm.frequency,
      time: medForm.scheduledTime,
      startDate: medForm.startDate,
      endDate: medForm.endDate,
      instructions: medForm.instructions,
      status: medForm.status
    };

    setMedSchedules(prev => ({
      ...prev,
      [selectedPatient.id]: [...(prev[selectedPatient.id] || []), newEntry]
    }));

    setShowAddMedModal(false);
    toast(`Added ${medForm.medName} to ${selectedPatient.name}'s schedule`, 'success');

    // Reset form
    setMedForm(prev => ({
      ...prev,
      medName: '',
      dosage: '1 tablet',
      quantity: '1',
      route: 'Oral',
      frequency: 'Every 6 hours',
      scheduledTime: '08:00 AM',
      instructions: 'Post meals with water',
      status: 'Scheduled'
    }));
  }

  // Current Patient's medications only (strictly isolated)
  const currentPatientMeds = selectedPatient ? (medSchedules[selectedPatient.id] || []) : [];

  // Filtered patients for All Patients table
  const filteredPatients = PATIENT_DATABASE.filter(p => {
    const q = patientSearchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.opId.toLowerCase().includes(q) ||
      p.abhaId.toLowerCase().includes(q) ||
      p.ward.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fade-in" style={{ paddingBottom: 32 }}>
      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: 20 }}>
        <div>
          <div className="dashboard-title">👩‍⚕️ Nurse Operations Dashboard</div>
          <div className="dashboard-subtitle">Anitha Ravi · Inpatient & General Ward · Salem District Hospital</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              if (!selectedPatient) {
                toast('Please identify and select a patient first', 'error');
                return;
              }
              setShowAddMedModal(true);
            }}
          >
            <Plus size={15} /> Add Medication
          </button>
        </div>
      </div>

      {/* KPI Stats (Vital signs removed) */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {statCards.map((c, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: c.bg }}><c.icon size={20} color={c.color} /></div>
            <div className="stat-label">{c.label}</div>
            <div className="stat-value">{c.value}</div>
          </div>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION: PATIENT IDENTIFICATION & MEDICATION SCHEDULE
          Workflow: Enter OP ID / Patient ID / ABHA ID -> Search Patient ->
                    Display Patient Details -> Display patient's medications -> Add / Update
      ───────────────────────────────────────────────────────────── */}
      <div
        className="card"
        style={{
          marginBottom: 24,
          padding: 20,
          border: '1.5px solid #BAE6FD',
          boxShadow: '0 4px 16px rgba(14, 165, 233, 0.08)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Pill size={18} color="#0EA5E9" />
              <span>Patient Medication Schedule</span>
            </div>
            <div style={{ fontSize: 12, color: '#64748B' }}>
              Select a patient using OP ID, ABHA ID, or Patient ID to manage their active medication administration schedule
            </div>
          </div>
          {selectedPatient && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowAddMedModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Plus size={14} /> Add Medication
            </button>
          )}
        </div>

        {/* Common Patient Identification Gateway */}
        <PatientSearchGateway
          title="Nurse Workspace: Patient Identification & Access"
          subtitle="Enter OP ID (e.g. OP2026001), ABHA ID (e.g. ABHA10001), or Patient ID (e.g. P1001)"
          actionLabel="Add Medication to Schedule"
          selectedPatient={selectedPatient}
          onPatientSelect={(patient) => {
            handleSelectPatient(patient);
          }}
          onAction={() => {
            setShowAddMedModal(true);
          }}
          onClear={() => {
            setSelectedPatient(null);
          }}
        />

        {/* Patient Details Banner (Arun Kumar — P1001 — OP2026001 — ABHA10001) */}
        {selectedPatient && (
          <div
            style={{
              marginTop: 14,
              marginBottom: 16,
              padding: '12px 16px',
              borderRadius: 8,
              background: '#F0F9FF',
              border: '1px solid #BAE6FD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0369A1', fontWeight: 700 }}>
                  Active Patient Record:
                </span>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0C4A6E' }}>
                  {selectedPatient.name} — <span style={{ color: '#0284C7' }}>{selectedPatient.id}</span> — <span style={{ color: '#0369A1' }}>{selectedPatient.opId}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className="badge badge-primary" style={{ fontFamily: 'monospace' }}>OP ID: {selectedPatient.opId}</span>
                <span className="badge badge-info" style={{ fontFamily: 'monospace' }}>ABHA: {selectedPatient.abhaId}</span>
                <span className="badge" style={{ background: '#E0E7FF', color: '#4338CA' }}>{selectedPatient.ward || 'General Ward'} · {selectedPatient.bed || 'B-04'}</span>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>
              Diagnosis: <span style={{ color: '#0F172A' }}>{selectedPatient.diagnosis || 'Type 2 Diabetes & Hypertension'}</span>
            </div>
          </div>
        )}

        {/* Patient-Specific Medication Schedule Table */}
        {selectedPatient ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>
                Medication Schedule for {selectedPatient.name} ({currentPatientMeds.length} items)
              </div>
              <span style={{ fontSize: 11.5, color: '#64748B' }}>
                Showing only medications prescribed for this patient
              </span>
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid #E2E8F0', borderRadius: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    <th style={{ padding: '12px 14px' }}>Medication</th>
                    <th style={{ padding: '12px 14px' }}>Dosage</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Quantity</th>
                    <th style={{ padding: '12px 14px' }}>Route</th>
                    <th style={{ padding: '12px 14px' }}>Frequency</th>
                    <th style={{ padding: '12px 14px' }}>Scheduled Time</th>
                    <th style={{ padding: '12px 14px' }}>Status</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPatientMeds.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: 24, textAlign: 'center', color: '#64748B' }}>
                        No medications currently scheduled for this patient. Click "+ Add Medication" to create one.
                      </td>
                    </tr>
                  ) : (
                    currentPatientMeds.map(med => (
                      <tr key={med.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Pill size={15} color="#0EA5E9" />
                            <span>{med.med}</span>
                          </div>
                          {med.instructions && (
                            <div style={{ fontSize: 11, color: '#64748B', marginLeft: 23, marginTop: 2 }}>{med.instructions}</div>
                          )}
                        </td>
                        <td style={{ padding: '12px 14px', color: '#334155', fontWeight: 600 }}>{med.dosage}</td>
                        <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700 }}>{med.quantity}</td>
                        <td style={{ padding: '12px 14px' }}><span className="tag">{med.route}</span></td>
                        <td style={{ padding: '12px 14px', color: '#475569' }}>{med.frequency}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={13} color="#64748B" />
                            {med.time}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span className={`badge ${
                            med.status === 'Given' ? 'badge-success' :
                            med.status === 'Scheduled' ? 'badge-primary' :
                            med.status === 'Held' ? 'badge-warning' : 'badge-muted'
                          }`}>
                            {med.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          <button
                            className="btn btn-primary btn-xs"
                            onClick={() => handleOpenUpdateModal(med)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          >
                            <Edit2 size={12} /> Update
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{ padding: 28, textAlign: 'center', color: '#64748B', background: '#F8FAFC', borderRadius: 8, border: '1px dashed #CBD5E1' }}>
            <Pill size={28} color="#94A3B8" style={{ marginBottom: 8 }} />
            <div style={{ fontWeight: 600, fontSize: 14 }}>No Patient Selected</div>
            <div style={{ fontSize: 12 }}>Enter an OP ID, ABHA ID, or Patient ID above to view that patient's medication schedule.</div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION: ALL PATIENTS DIRECTORY (Replaces "Assigned Patients")
          Allows Nurse to search/select patient by OP ID, ABHA ID, Patient ID
          Displays: Patient Name, Patient ID, OP ID, ABHA ID
      ───────────────────────────────────────────────────────────── */}
      <div className="card" style={{ marginBottom: 24, padding: 0, overflow: 'hidden' }}>
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={18} color="#0EA5E9" />
              <span>All Patients Directory</span>
            </div>
            <div style={{ fontSize: 12, color: '#64748B' }}>
              Search across all hospital patients using OP ID, ABHA ID, or Patient ID
            </div>
          </div>

          <div className="search-bar" style={{ minWidth: 260 }}>
            <Search size={15} color="var(--text-muted)" />
            <input
              placeholder="Search by OP ID, ABHA ID, Name..."
              value={patientSearchTerm}
              onChange={e => setPatientSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Patient Details</th>
                <th>Patient ID</th>
                <th>OP ID</th>
                <th>ABHA ID</th>
                <th>Ward & Bed</th>
                <th>Diagnosis</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map(p => (
                <tr
                  key={p.id}
                  style={{
                    background: selectedPatient?.id === p.id ? 'rgba(14, 165, 233, 0.05)' : undefined
                  }}
                >
                  <td style={{ fontWeight: 700, color: '#0F172A' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <div>{p.name}</div>
                        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>{p.age} yrs · {p.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ padding: '3px 8px', background: '#F1F5F9', borderRadius: 4, fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: '#334155' }}>
                      {p.id}
                    </span>
                  </td>
                  <td>
                    <span style={{ padding: '3px 8px', background: '#E0F2FE', borderRadius: 4, fontFamily: 'monospace', fontWeight: 800, fontSize: 12, color: '#0284C7' }}>
                      {p.opId}
                    </span>
                  </td>
                  <td>
                    <span style={{ padding: '3px 8px', background: '#EDE9FE', borderRadius: 4, fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: '#6D28D9' }}>
                      {p.abhaId}
                    </span>
                  </td>
                  <td style={{ fontSize: 12.5, color: '#475569' }}>
                    {p.ward} · <span style={{ fontWeight: 600 }}>{p.bed}</span>
                  </td>
                  <td style={{ fontSize: 12, color: '#334155', maxWidth: 220 }}>
                    {p.diagnosis}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className={`btn btn-xs ${selectedPatient?.id === p.id ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => {
                        handleSelectPatient(p);
                        toast(`Loaded medication schedule for ${p.name} (${p.opId})`, 'success');
                      }}
                    >
                      <Pill size={12} /> {selectedPatient?.id === p.id ? 'Active Patient' : 'Select Patient'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Doctor's Orders (Preserved clean section) */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">📋 Doctor Orders & Active Clinical Instructions</div>
        </div>
        <div className="card-body">
          {[
            { patient: 'Arun Kumar (P1001)', opId: 'OP2026001', order: 'Monitor blood glucose AC/PC. Continue regular insulin if fasting > 180 mg/dL', doctor: 'Dr. Kumar', time: '08:30 AM', urgent: false },
            { patient: 'Sindhu Iyer (PAT014)', opId: 'OP2026015', order: 'IV Fluid replacement 1L NS over 6 hours. Strict input/output chart. Daily platelet count.', doctor: 'Dr. Priya Sharma', time: '09:30 AM', urgent: true },
            { patient: 'Ravi Kumar (PAT001)', opId: 'OP2026003', order: 'Monitor BP every 4 hours. Report immediately if systolic > 160 mmHg', doctor: 'Dr. Priya Sharma', time: '08:00 AM', urgent: false },
          ].map((o, i) => (
            <div key={i} style={{ padding: '12px 0', borderBottom: i < 2 ? '1px solid #F1F5F9' : 'none', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: o.urgent ? '#FEE2E2' : '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={16} color={o.urgent ? '#EF4444' : '#0EA5E9'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>
                  <span style={{ color: '#0EA5E9' }}>{o.patient}</span> [{o.opId}] — {o.order}
                </div>
                <div style={{ fontSize: 11, color: '#64748B' }}>{o.doctor} · {o.time}</div>
              </div>
              {o.urgent && <span className="badge badge-danger">Urgent</span>}
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ADD MEDICATION MODAL
          Fields: OP ID, Patient Name, Patient ID, Medication Name,
                  Dosage, Quantity, Route, Frequency, Scheduled Time,
                  Start Date, End Date, Instructions, Status
      ───────────────────────────────────────────────────────────── */}
      {showAddMedModal && selectedPatient && (
        <div
          className="modal-overlay"
          onClick={() => setShowAddMedModal(false)}
        >
          <div
            className="modal"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: 580 }}
          >
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0 }}>Add Medication Schedule</h3>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  {selectedPatient.name} — {selectedPatient.id} — {selectedPatient.opId}
                </div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAddMedModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddMedicationSubmit}>
              <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                {/* Identification Banner */}
                <div style={{ padding: '10px 14px', background: '#F0F9FF', borderRadius: 8, marginBottom: 14, border: '1px solid #BAE6FD', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, fontSize: 12 }}>
                  <div><strong>Patient Name:</strong> {selectedPatient.name}</div>
                  <div><strong>Patient ID:</strong> {selectedPatient.id}</div>
                  <div><strong>OP ID:</strong> {selectedPatient.opId}</div>
                  <div><strong>ABHA ID:</strong> {selectedPatient.abhaId}</div>
                </div>

                <div style={{ display: 'grid', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Medication Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Paracetamol 500 mg, Amoxicillin 500 mg, Omeprazole 20 mg"
                      value={medForm.medName}
                      onChange={e => setMedForm({ ...medForm, medName: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="form-group">
                      <label className="form-label">Dosage *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 1 tablet, 1 capsule, 500 mg"
                        value={medForm.dosage}
                        onChange={e => setMedForm({ ...medForm, dosage: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Quantity *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 1, 2"
                        value={medForm.quantity}
                        onChange={e => setMedForm({ ...medForm, quantity: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="form-group">
                      <label className="form-label">Route *</label>
                      <select
                        className="form-select"
                        value={medForm.route}
                        onChange={e => setMedForm({ ...medForm, route: e.target.value })}
                      >
                        <option>Oral</option>
                        <option>IV (Intravenous)</option>
                        <option>IM (Intramuscular)</option>
                        <option>Subcutaneous</option>
                        <option>Inhalation</option>
                        <option>Topical</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Frequency *</label>
                      <select
                        className="form-select"
                        value={medForm.frequency}
                        onChange={e => setMedForm({ ...medForm, frequency: e.target.value })}
                      >
                        <option>Every 6 hours</option>
                        <option>Every 8 hours</option>
                        <option>3 times/day</option>
                        <option>Twice daily</option>
                        <option>Once daily</option>
                        <option>SOS / As needed</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="form-group">
                      <label className="form-label">Scheduled Time *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 08:00 AM"
                        value={medForm.scheduledTime}
                        onChange={e => setMedForm({ ...medForm, scheduledTime: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Status *</label>
                      <select
                        className="form-select"
                        value={medForm.status}
                        onChange={e => setMedForm({ ...medForm, status: e.target.value })}
                      >
                        <option>Scheduled</option>
                        <option>Given</option>
                        <option>Held</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="form-group">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={medForm.startDate}
                        onChange={e => setMedForm({ ...medForm, startDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={medForm.endDate}
                        onChange={e => setMedForm({ ...medForm, endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Instructions / Notes</label>
                    <textarea
                      className="form-input"
                      rows={2}
                      placeholder="e.g. Take post-meals with water; check BP prior to administration"
                      value={medForm.instructions}
                      onChange={e => setMedForm({ ...medForm, instructions: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddMedModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Medication Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          UPDATE MEDICATION MODAL (Requirement 4: Update / Action)
          Allows updating: Status, Dosage, Quantity, Scheduled Time,
          Instructions, Route, Frequency
      ───────────────────────────────────────────────────────────── */}
      {showUpdateMedModal && editingMed && selectedPatient && (
        <div
          className="modal-overlay"
          onClick={() => setShowUpdateMedModal(false)}
        >
          <div
            className="modal"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: 540 }}
          >
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0 }}>Update Medication</h3>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  {editingMed.med} — {selectedPatient.name} ({selectedPatient.opId})
                </div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowUpdateMedModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveMedicationUpdate}>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Medication Status *</label>
                    <select
                      className="form-select"
                      value={editingMed.status}
                      onChange={e => setEditingMed({ ...editingMed, status: e.target.value })}
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Given">Given</option>
                      <option value="Held">Held</option>
                      <option value="Discontinued">Discontinued</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="form-group">
                      <label className="form-label">Dosage</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editingMed.dosage}
                        onChange={e => setEditingMed({ ...editingMed, dosage: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Quantity</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editingMed.quantity}
                        onChange={e => setEditingMed({ ...editingMed, quantity: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="form-group">
                      <label className="form-label">Scheduled Time</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editingMed.time}
                        onChange={e => setEditingMed({ ...editingMed, time: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Frequency</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editingMed.frequency}
                        onChange={e => setEditingMed({ ...editingMed, frequency: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Route</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingMed.route}
                      onChange={e => setEditingMed({ ...editingMed, route: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Administration Instructions</label>
                    <textarea
                      className="form-input"
                      rows={2}
                      value={editingMed.instructions || ''}
                      onChange={e => setEditingMed({ ...editingMed, instructions: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowUpdateMedModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
