import { useState, useMemo } from 'react';
import {
  FlaskConical, TestTube, Activity, FileText, AlertTriangle,
  Search, CheckCircle2, Clock, Eye, RefreshCw, Plus, Edit2, Check,
  Filter, ShieldAlert, UserCheck
} from 'lucide-react';
import { STATS } from '../../data/mockData';
import { useToast } from '../../components/Toast';
import PatientSearchGateway from '../../components/PatientSearchGateway';

// Patient-Specific Tests Database (Indexed by OP ID / Patient ID)
// Shows exact requested tests: CBC, Blood Glucose, Dengue NS1, LFT
const PATIENT_TESTS_DATA = {
  'P1001': {
    id: 'P1001',
    name: 'Arun Kumar',
    patientName: 'Arun Kumar',
    patientId: 'P1001',
    opId: 'OP2026001',
    abhaId: 'ABHA10001',
    tests: [
      { id: 'T-101', test: 'CBC (Complete Blood Count)', patientId: 'P1001', opId: 'OP2026001', status: 'Pending', requestedDate: 'Today, 09:15 AM', dept: 'Hematology', result: 'Awaiting sample processing', priority: 'Routine' },
      { id: 'T-102', test: 'Blood Glucose (Fasting & PP)', patientId: 'P1001', opId: 'OP2026001', status: 'Completed', requestedDate: 'Today, 07:45 AM', dept: 'Biochemistry', result: 'FBS: 142 mg/dL (Elevated)', priority: 'Routine' },
      { id: 'T-103', test: 'Dengue NS1 Antigen', patientId: 'P1001', opId: 'OP2026001', status: 'In Progress', requestedDate: 'Today, 08:30 AM', dept: 'Serology', result: 'Incubation stage (35m remaining)', priority: 'Urgent' },
      { id: 'T-104', test: 'LFT (Liver Function Test)', patientId: 'P1001', opId: 'OP2026001', status: 'Result Reviewed', requestedDate: 'Yesterday', dept: 'Biochemistry', result: 'Normal parameters verified by Dr. R. Shankar', priority: 'Routine' },
    ]
  },
  'P1002': {
    id: 'P1002',
    name: 'Meena Devi',
    patientName: 'Meena Devi',
    patientId: 'P1002',
    opId: 'OP2026002',
    abhaId: 'ABHA10002',
    tests: [
      { id: 'T-201', test: 'Routine Urine Analysis', patientId: 'P1002', opId: 'OP2026002', status: 'Completed', requestedDate: 'Today, 09:00 AM', dept: 'Clinical Pathology', result: 'Clear, Protein Nil, Sugar Nil', priority: 'Routine' },
      { id: 'T-202', test: 'Hemoglobin (Hb%)', patientId: 'P1002', opId: 'OP2026002', status: 'Result Reviewed', requestedDate: 'Yesterday', dept: 'Hematology', result: '11.8 g/dL (Adequate for trimester)', priority: 'Routine' },
      { id: 'T-203', test: 'Thyroid Profile (T3, T4, TSH)', patientId: 'P1002', opId: 'OP2026002', status: 'In Progress', requestedDate: 'Today, 10:00 AM', dept: 'Endocrinology', result: 'Processing in Analyzer #2', priority: 'Routine' },
    ]
  },
  'PAT001': {
    id: 'PAT001',
    name: 'Ravi Kumar',
    patientName: 'Ravi Kumar',
    patientId: 'PAT001',
    opId: 'OP2026003',
    abhaId: 'ABHA10003',
    tests: [
      { id: 'T-301', test: 'Lipid Profile', patientId: 'PAT001', opId: 'OP2026003', status: 'Result Reviewed', requestedDate: 'Yesterday', dept: 'Biochemistry', result: 'Total Cholesterol: 215 mg/dL', priority: 'Routine' },
      { id: 'T-302', test: 'Serum Creatinine & Urea', patientId: 'PAT001', opId: 'OP2026003', status: 'Completed', requestedDate: 'Today, 08:00 AM', dept: 'Biochemistry', result: 'Creatinine: 1.1 mg/dL, Urea: 28 mg/dL', priority: 'Routine' },
      { id: 'T-303', test: 'Electrolytes (Na+, K+, Cl-)', patientId: 'PAT001', opId: 'OP2026003', status: 'Pending', requestedDate: 'Today, 11:30 AM', dept: 'Biochemistry', result: 'Specimen in transit', priority: 'Routine' },
    ]
  },
  'PAT014': {
    id: 'PAT014',
    name: 'Sindhu Iyer',
    patientName: 'Sindhu Iyer',
    patientId: 'PAT014',
    opId: 'OP2026015',
    abhaId: 'ABHA10015',
    tests: [
      { id: 'T-401', test: 'Platelet Count (STAT)', patientId: 'PAT014', opId: 'OP2026015', status: 'In Progress', requestedDate: 'Today, 10:30 AM', dept: 'Hematology', result: 'Urgent smear evaluation: 64,000 /mcL', priority: 'STAT' },
      { id: 'T-402', test: 'Dengue Serology (IgM/IgG)', patientId: 'PAT014', opId: 'OP2026015', status: 'Completed', requestedDate: 'Today, 09:00 AM', dept: 'Serology', result: 'IgM Positive, IgG Negative', priority: 'Urgent' },
    ]
  }
};

// Initial Sample Collection Records (Requirement 9)
const INITIAL_SAMPLE_RECORDS = [
  {
    id: 'SMP-1001',
    opId: 'OP2026001',
    patientName: 'Arun Kumar',
    patientId: 'P1001',
    testName: 'CBC',
    sampleType: 'Blood (EDTA)',
    collectionDate: '07-09-2026',
    collectionTime: '08:30 AM',
    collectedBy: 'Lab Tech Rajesh',
    status: 'Collected',
    priority: 'Routine',
    notes: 'Standard lavender tube, 3 mL venous'
  },
  {
    id: 'SMP-1002',
    opId: 'OP2026001',
    patientName: 'Arun Kumar',
    patientId: 'P1001',
    testName: 'Blood Glucose',
    sampleType: 'Blood (Fluoride)',
    collectionDate: '07-09-2026',
    collectionTime: '07:15 AM',
    collectedBy: 'Lab Tech Rajesh',
    status: 'Processing',
    priority: 'Routine',
    notes: 'Fasting specimen, grey top'
  },
  {
    id: 'SMP-1003',
    opId: 'OP2026001',
    patientName: 'Arun Kumar',
    patientId: 'P1001',
    testName: 'Dengue NS1',
    sampleType: 'Serum',
    collectionDate: '07-09-2026',
    collectionTime: '09:00 AM',
    collectedBy: 'Lab Tech Priya',
    status: 'Collected',
    priority: 'Urgent',
    notes: 'Yellow SST tube, centrifuged'
  },
  {
    id: 'SMP-1004',
    opId: 'OP2026002',
    patientName: 'Meena Devi',
    patientId: 'P1002',
    testName: 'Routine Urine Analysis',
    sampleType: 'Urine',
    collectionDate: '07-09-2026',
    collectionTime: '09:15 AM',
    collectedBy: 'Lab Tech Priya',
    status: 'Completed',
    priority: 'Routine',
    notes: 'Mid-stream clean catch specimen'
  },
  {
    id: 'SMP-1005',
    opId: 'OP2026015',
    patientName: 'Sindhu Iyer',
    patientId: 'PAT014',
    testName: 'Platelet Count (STAT)',
    sampleType: 'Blood',
    collectionDate: '07-09-2026',
    collectionTime: '10:00 AM',
    collectedBy: 'Lab Tech Rajesh',
    status: 'Processing',
    priority: 'STAT',
    notes: 'STAT requisition from Ward B; transport on ice'
  }
];

// All Lab Orders for General Queue
const ALL_LAB_ORDERS = [
  { id: 'LAB-501', patientName: 'Arun Kumar', patientId: 'P1001', opId: 'OP2026001', test: 'CBC', doctor: 'Dr. Kumar', priority: 'Routine', status: 'Pending', result: '—' },
  { id: 'LAB-502', patientName: 'Arun Kumar', patientId: 'P1001', opId: 'OP2026001', test: 'Blood Glucose', doctor: 'Dr. Kumar', priority: 'Routine', status: 'Completed', result: '142 mg/dL' },
  { id: 'LAB-503', patientName: 'Arun Kumar', patientId: 'P1001', opId: 'OP2026001', test: 'Dengue NS1', doctor: 'Dr. Kumar', priority: 'Urgent', status: 'In Progress', result: 'Processing' },
  { id: 'LAB-504', patientName: 'Arun Kumar', patientId: 'P1001', opId: 'OP2026001', test: 'LFT', doctor: 'Dr. Kumar', priority: 'Routine', status: 'Result Reviewed', result: 'Normal' },
  { id: 'LAB-505', patientName: 'Meena Devi', patientId: 'P1002', opId: 'OP2026002', test: 'Routine Urine Analysis', doctor: 'Dr. Sunita Rao', priority: 'Routine', status: 'Completed', result: 'Normal' },
  { id: 'LAB-506', patientName: 'Ravi Kumar', patientId: 'PAT001', opId: 'OP2026003', test: 'Lipid Profile', doctor: 'Dr. Priya Sharma', priority: 'Routine', status: 'Result Reviewed', result: '215 mg/dL' },
  { id: 'LAB-507', patientName: 'Sindhu Iyer', patientId: 'PAT014', opId: 'OP2026015', test: 'Platelet Count', doctor: 'Dr. Priya Sharma', priority: 'STAT', status: 'In Progress', result: '64,000 /mcL' },
];

const statusBadgeColor = {
  'Pending': 'badge-warning',
  'In Progress': 'badge-info',
  'Completed': 'badge-success',
  'Result Reviewed': 'badge-primary'
};

const sampleStatusBadgeColor = {
  'Pending Collection': 'badge-warning',
  'Collected': 'badge-info',
  'Processing': 'badge-primary',
  'Completed': 'badge-success'
};

export default function LabDashboard() {
  const toast = useToast();
  const s = STATS.lab;

  // Selected Patient Record for Tests
  const [selectedPatientRecord, setSelectedPatientRecord] = useState(PATIENT_TESTS_DATA['P1001']);

  // Samples State (Requirement 9)
  const [samples, setSamples] = useState(INITIAL_SAMPLE_RECORDS);
  const [sampleSearch, setSampleSearch] = useState('');
  const [showAddSampleModal, setShowAddSampleModal] = useState(false);
  const [selectedSampleDetails, setSelectedSampleDetails] = useState(null);

  // New Sample Form State (11 fields)
  const [sampleForm, setSampleForm] = useState({
    opId: 'OP2026001',
    patientName: 'Arun Kumar',
    patientId: 'P1001',
    testName: 'CBC',
    sampleType: 'Blood',
    collectionDate: '07-09-2026',
    collectionTime: '08:30 AM',
    collectedBy: 'Lab Tech Rajesh',
    status: 'Collected',
    priority: 'Routine',
    notes: 'Venous draw, 3 mL EDTA'
  });

  // KPI Stats
  const statCards = [
    { label: 'Pending Orders', value: s.pendingOrders || 14, icon: FlaskConical, color: '#8B5CF6', bg: '#EDE9FE' },
    { label: 'Samples Collected', value: samples.filter(s => s.status !== 'Pending Collection').length, icon: TestTube, color: '#0EA5E9', bg: '#E0F2FE' },
    { label: 'Tests in Progress', value: s.testsInProgress || 8, icon: Activity, color: '#3B82F6', bg: '#DBEAFE' },
    { label: 'Completed Tests', value: s.completedTests || 42, icon: FileText, color: '#10B981', bg: '#D1FAE5' },
    { label: 'Critical STAT Results', value: s.criticalResults || 2, icon: AlertTriangle, color: '#EF4444', bg: '#FEE2E2' },
  ];

  // Advance Test Status
  function handleUpdateTestStatus(testId) {
    if (!selectedPatientRecord) return;
    const nextMap = {
      'Pending': 'In Progress',
      'In Progress': 'Completed',
      'Completed': 'Result Reviewed',
      'Result Reviewed': 'Completed'
    };

    setSelectedPatientRecord(prev => {
      const updatedTests = prev.tests.map(t => {
        if (t.id === testId) {
          const next = nextMap[t.status] || 'Completed';
          toast(`${t.test} status updated to ${next}`, 'success');
          return { ...t, status: next };
        }
        return t;
      });
      return { ...prev, tests: updatedTests };
    });
  }

  // Change Sample Status
  function handleCycleSampleStatus(sampleId) {
    const nextStatusMap = {
      'Pending Collection': 'Collected',
      'Collected': 'Processing',
      'Processing': 'Completed',
      'Completed': 'Collected'
    };

    setSamples(prev => prev.map(s => {
      if (s.id === sampleId) {
        const next = nextStatusMap[s.status] || 'Completed';
        toast(`Sample ${s.id} status updated to ${next}`, 'success');
        return { ...s, status: next };
      }
      return s;
    }));
  }

  // Handle Add Sample Submit
  function handleAddSampleSubmit(e) {
    e.preventDefault();
    if (!sampleForm.patientName || !sampleForm.testName) {
      toast('Please enter patient and test details', 'error');
      return;
    }

    const newSample = {
      id: `SMP-${Date.now().toString().slice(-4)}`,
      ...sampleForm
    };

    setSamples(prev => [newSample, ...prev]);
    setShowAddSampleModal(false);
    toast(`Sample registered for ${sampleForm.patientName} (${sampleForm.opId})`, 'success');

    // Reset Form
    setSampleForm(prev => ({
      ...prev,
      testName: 'CBC',
      notes: ''
    }));
  }

  // Filtered Samples
  const filteredSamples = useMemo(() => {
    const q = sampleSearch.toLowerCase().trim();
    if (!q) return samples;
    return samples.filter(s =>
      s.patientName.toLowerCase().includes(q) ||
      s.opId.toLowerCase().includes(q) ||
      s.patientId.toLowerCase().includes(q) ||
      s.testName.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q)
    );
  }, [samples, sampleSearch]);

  return (
    <div className="fade-in" style={{ paddingBottom: 32 }}>
      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: 20 }}>
        <div>
          <div className="dashboard-title">🔬 Laboratory Staff Workspace</div>
          <div className="dashboard-subtitle">Ravi Shankar · Senior Diagnostic Specialist · Salem District Hospital Pathology Labs</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddSampleModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={15} /> Add Sample Record
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {statCards.map((c, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: c.bg }}><c.icon size={20} color={c.color} /></div>
            <div className="stat-label">{c.label}</div>
            <div className="stat-value">{c.value}</div>
          </div>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 8: PATIENT IDENTIFICATION (OP ID / ABHA ID / Patient ID)
          Display: Patient Name + Patient ID + OP ID (Arun Kumar — P1001 — OP2026001)
      ───────────────────────────────────────────────────────────── */}
      <PatientSearchGateway
        title="Laboratory Diagnostics: Patient Identification & Access"
        subtitle="Search patient by OP ID (e.g. OP2026001) or ABHA ID (e.g. ABHA10001) to view diagnostic tests and phlebotomy orders"
        actionLabel="Load Lab Orders"
        selectedPatient={selectedPatientRecord}
        onPatientSelect={(patient) => {
          const key = Object.keys(PATIENT_TESTS_DATA).find(k =>
            k === patient.id ||
            PATIENT_TESTS_DATA[k].patientId === patient.id ||
            PATIENT_TESTS_DATA[k].opId === patient.opId ||
            PATIENT_TESTS_DATA[k].patientName.toLowerCase() === patient.name.toLowerCase()
          );

          if (key && PATIENT_TESTS_DATA[key]) {
            setSelectedPatientRecord({
              ...PATIENT_TESTS_DATA[key],
              id: patient.id,
              name: patient.name,
              opId: patient.opId,
              abhaId: patient.abhaId
            });
          } else {
            setSelectedPatientRecord({
              ...patient,
              patientName: patient.name,
              patientId: patient.id,
              tests: [
                { id: `T-${patient.id}-1`, test: 'CBC (Complete Blood Count)', patientId: patient.id, opId: patient.opId, status: 'Pending', requestedDate: 'Today, 09:15 AM', dept: 'Hematology', result: 'Awaiting sample collection', priority: 'Routine' },
                { id: `T-${patient.id}-2`, test: 'Blood Glucose', patientId: patient.id, opId: patient.opId, status: 'Completed', requestedDate: 'Today, 07:45 AM', dept: 'Biochemistry', result: '138 mg/dL', priority: 'Routine' },
                { id: `T-${patient.id}-3`, test: 'Dengue NS1', patientId: patient.id, opId: patient.opId, status: 'In Progress', requestedDate: 'Today, 08:30 AM', dept: 'Serology', result: 'Analyzing specimen', priority: 'Urgent' },
                { id: `T-${patient.id}-4`, test: 'LFT', patientId: patient.id, opId: patient.opId, status: 'Result Reviewed', requestedDate: 'Yesterday', dept: 'Biochemistry', result: 'Normal parameters verified', priority: 'Routine' },
              ]
            });
          }
          toast(`Diagnostic profile active: ${patient.name} (${patient.opId})`, 'success');
        }}
        onAction={(patient) => {
          toast(`Active diagnostic orders loaded for ${patient.name} (${patient.opId})`, 'success');
        }}
        onClear={() => {
          setSelectedPatientRecord(null);
        }}
      />

      {/* ─────────────────────────────────────────────────────────────
          SECTION 10: PATIENT-SPECIFIC LAB TESTS
          Shows: CBC, Blood Glucose, Dengue NS1, LFT
          Clear status badges: Pending, In Progress, Completed, Result Reviewed
      ───────────────────────────────────────────────────────────── */}
      {selectedPatientRecord && (
        <div className="card" style={{ marginBottom: 28, padding: 20, border: '1.5px solid #BAE6FD', boxShadow: '0 4px 16px rgba(14, 165, 233, 0.06)' }}>
          {/* Patient Header: Arun Kumar — P1001 — OP2026001 */}
          <div style={{ padding: '12px 16px', background: '#F0F9FF', borderRadius: 8, marginBottom: 16, border: '1px solid #BAE6FD', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0369A1', fontWeight: 700 }}>
                Verified Patient Diagnostic File:
              </span>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#0C4A6E', marginTop: 2 }}>
                {selectedPatientRecord.patientName || selectedPatientRecord.name} — <span style={{ color: '#0284C7' }}>{selectedPatientRecord.patientId || selectedPatientRecord.id}</span> — <span style={{ color: '#0369A1' }}>{selectedPatientRecord.opId || 'OP2026001'}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span className="badge badge-primary" style={{ fontFamily: 'monospace' }}>OP ID: {selectedPatientRecord.opId || 'OP2026001'}</span>
              <span className="badge badge-info" style={{ fontFamily: 'monospace' }}>ABHA: {selectedPatientRecord.abhaId || 'ABHA10001'}</span>
              <span className="badge" style={{ background: '#E0E7FF', color: '#4338CA' }}>
                {selectedPatientRecord.tests?.length || 0} Diagnostic Orders
              </span>
            </div>
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 10 }}>
            Diagnostic Tests for {selectedPatientRecord.patientName || selectedPatientRecord.name}
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Test Name</th>
                  <th>Patient ID & OP ID</th>
                  <th>Department</th>
                  <th>Requested On</th>
                  <th>Status</th>
                  <th>Results / Clinical Notes</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedPatientRecord.tests.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <TestTube size={15} color="#0EA5E9" />
                        <span>{t.test}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{ padding: '2px 6px', background: '#F1F5F9', borderRadius: 4, fontFamily: 'monospace', fontWeight: 700, fontSize: 11.5, color: '#334155' }}>
                          {t.patientId}
                        </span>
                        <span style={{ padding: '2px 6px', background: '#E0F2FE', borderRadius: 4, fontFamily: 'monospace', fontWeight: 800, fontSize: 11.5, color: '#0284C7' }}>
                          {t.opId || selectedPatientRecord.opId}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: '#64748B' }}>{t.dept}</td>
                    <td style={{ fontSize: 11.5, color: '#64748B' }}>{t.requestedDate}</td>
                    <td>
                      <span className={`badge ${statusBadgeColor[t.status] || 'badge-muted'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: '#334155', fontWeight: 500 }}>
                      {t.result}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => handleUpdateTestStatus(t.id)}
                        title="Update Status Lifecycle"
                      >
                        Advance Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SECTION 9: SAMPLE COLLECTION (Requirement 9: DO NOT REMOVE!)
          Fields: OP ID, Patient Name, Patient ID, Test Name, Sample Type,
                  Collection Date, Collection Time, Collected By, Status, Priority, Notes
          Actions: Add Sample, Update, View Details, Change Status
      ───────────────────────────────────────────────────────────── */}
      <div className="card" style={{ marginBottom: 28, padding: 0, overflow: 'hidden' }}>
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            background: '#F8FAFC'
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
              <TestTube size={18} color="#0EA5E9" />
              <span>Sample Collection & Phlebotomy Management</span>
              <span className="badge badge-primary" style={{ fontSize: 11 }}>{filteredSamples.length} active samples</span>
            </div>
            <div style={{ fontSize: 12, color: '#64748B' }}>
              Register biological specimens, track chain of custody, and record phlebotomy intake
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="search-bar" style={{ minWidth: 240 }}>
              <Search size={15} color="var(--text-muted)" />
              <input
                placeholder="Search OP ID, Patient Name, Test..."
                value={sampleSearch}
                onChange={e => setSampleSearch(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                if (selectedPatientRecord) {
                  setSampleForm(prev => ({
                    ...prev,
                    opId: selectedPatientRecord.opId || 'OP2026001',
                    patientName: selectedPatientRecord.patientName || selectedPatientRecord.name,
                    patientId: selectedPatientRecord.patientId || selectedPatientRecord.id,
                  }));
                }
                setShowAddSampleModal(true);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Plus size={14} /> Add Sample
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="table" style={{ fontSize: 12.5 }}>
            <thead>
              <tr>
                <th>Sample ID</th>
                <th>Patient Details</th>
                <th>OP ID & ID</th>
                <th>Test Name</th>
                <th>Sample Type</th>
                <th>Collection Timestamp</th>
                <th>Collected By</th>
                <th>Priority</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSamples.map(sample => (
                <tr key={sample.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0F172A' }}>
                    {sample.id}
                  </td>
                  <td style={{ fontWeight: 700, color: '#0F172A' }}>
                    {sample.patientName}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <span style={{ padding: '2px 6px', background: '#E0F2FE', borderRadius: 4, fontFamily: 'monospace', fontWeight: 800, fontSize: 11, color: '#0284C7' }}>
                        {sample.opId}
                      </span>
                      <span style={{ padding: '2px 6px', background: '#F1F5F9', borderRadius: 4, fontFamily: 'monospace', fontWeight: 600, fontSize: 11, color: '#475569' }}>
                        {sample.patientId}
                      </span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: '#334155' }}>{sample.testName}</td>
                  <td><span className="tag">{sample.sampleType}</span></td>
                  <td style={{ fontSize: 11.5, color: '#64748B' }}>
                    {sample.collectionDate} · {sample.collectionTime}
                  </td>
                  <td style={{ fontSize: 12, color: '#475569' }}>{sample.collectedBy}</td>
                  <td>
                    <span className={`badge ${sample.priority === 'STAT' ? 'badge-danger' : sample.priority === 'Urgent' ? 'badge-warning' : 'badge-muted'}`}>
                      {sample.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${sampleStatusBadgeColor[sample.status] || 'badge-info'}`}>
                      {sample.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => setSelectedSampleDetails(sample)}
                        title="View Full Specimen Details"
                      >
                        <Eye size={12} /> Details
                      </button>
                      <button
                        className="btn btn-primary btn-xs"
                        onClick={() => handleCycleSampleStatus(sample.id)}
                        title="Advance Sample Status Lifecycle"
                      >
                        Change Status
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CENTRALIZED LABORATORY ORDERS QUEUE
      ───────────────────────────────────────────────────────────── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
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
              <FileText size={18} color="#0EA5E9" />
              <span>Centralized Laboratory Orders Queue</span>
            </div>
            <div style={{ fontSize: 12, color: '#64748B' }}>
              All tests display verified Patient Name directly beside Patient ID and OP ID
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Lab ID</th>
                <th>Patient (Name — ID)</th>
                <th>OP ID</th>
                <th>Test Name</th>
                <th>Requesting Doctor</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Result</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {ALL_LAB_ORDERS.map(order => (
                <tr key={order.id} className={order.priority === 'STAT' ? 'critical-row' : ''}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                    {order.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>
                      {order.patientName} — <span style={{ color: '#0EA5E9' }}>{order.patientId}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 11.5, color: '#0284C7' }}>
                      {order.opId}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#1E293B', fontSize: 13 }}>
                    {order.test}
                  </td>
                  <td style={{ fontSize: 12, color: '#475569' }}>
                    {order.doctor}
                  </td>
                  <td>
                    <span className={`badge ${order.priority === 'STAT' ? 'badge-danger' : order.priority === 'Urgent' ? 'badge-warning' : 'badge-muted'}`}>
                      {order.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${statusBadgeColor[order.status] || 'badge-muted'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, fontWeight: 600, color: order.result === '—' ? '#94A3B8' : '#0F172A' }}>
                    {order.result}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        if (PATIENT_TESTS_DATA[order.patientId]) {
                          setSelectedPatientRecord(PATIENT_TESTS_DATA[order.patientId]);
                          toast(`Loaded records for ${order.patientName} (${order.patientId})`, 'success');
                        }
                      }}
                    >
                      <Eye size={13} /> View Tests
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MODAL: ADD SAMPLE (Requirement 9)
          Fields: OP ID, Patient Name, Patient ID, Test Name, Sample Type,
                  Collection Date, Collection Time, Collected By, Status, Priority, Notes
      ───────────────────────────────────────────────────────────── */}
      {showAddSampleModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAddSampleModal(false)}
        >
          <div
            className="modal"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: 580 }}
          >
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0 }}>Add Specimen Sample Record</h3>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  Log biological specimen intake for laboratory processing
                </div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAddSampleModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddSampleSubmit}>
              <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="form-group">
                      <label className="form-label">OP ID *</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        placeholder="e.g. OP2026001"
                        value={sampleForm.opId}
                        onChange={e => setSampleForm({ ...sampleForm, opId: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Patient ID *</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        placeholder="e.g. P1001"
                        value={sampleForm.patientId}
                        onChange={e => setSampleForm({ ...sampleForm, patientId: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Patient Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Arun Kumar"
                      value={sampleForm.patientName}
                      onChange={e => setSampleForm({ ...sampleForm, patientName: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="form-group">
                      <label className="form-label">Test Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        placeholder="e.g. CBC, Blood Glucose, Dengue NS1"
                        value={sampleForm.testName}
                        onChange={e => setSampleForm({ ...sampleForm, testName: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Sample Type *</label>
                      <select
                        className="form-select"
                        value={sampleForm.sampleType}
                        onChange={e => setSampleForm({ ...sampleForm, sampleType: e.target.value })}
                      >
                        <option>Blood</option>
                        <option>Blood (EDTA)</option>
                        <option>Blood (Fluoride)</option>
                        <option>Serum</option>
                        <option>Plasma</option>
                        <option>Urine</option>
                        <option>Sputum</option>
                        <option>Swab (Throat/Nasal)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="form-group">
                      <label className="form-label">Collection Date *</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        placeholder="07-09-2026"
                        value={sampleForm.collectionDate}
                        onChange={e => setSampleForm({ ...sampleForm, collectionDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Collection Time *</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        placeholder="08:30 AM"
                        value={sampleForm.collectionTime}
                        onChange={e => setSampleForm({ ...sampleForm, collectionTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="form-group">
                      <label className="form-label">Collected By *</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        placeholder="e.g. Lab Tech Rajesh"
                        value={sampleForm.collectedBy}
                        onChange={e => setSampleForm({ ...sampleForm, collectedBy: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Sample Status *</label>
                      <select
                        className="form-select"
                        value={sampleForm.status}
                        onChange={e => setSampleForm({ ...sampleForm, status: e.target.value })}
                      >
                        <option>Pending Collection</option>
                        <option>Collected</option>
                        <option>Processing</option>
                        <option>Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Priority *</label>
                    <select
                      className="form-select"
                      value={sampleForm.priority}
                      onChange={e => setSampleForm({ ...sampleForm, priority: e.target.value })}
                    >
                      <option>Routine</option>
                      <option>Urgent</option>
                      <option>STAT</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Specimen Notes</label>
                    <textarea
                      className="form-input"
                      rows={2}
                      placeholder="e.g. Lavender EDTA tube, 3 mL venous sample. Patient non-fasting."
                      value={sampleForm.notes}
                      onChange={e => setSampleForm({ ...sampleForm, notes: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddSampleModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Sample Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: VIEW SAMPLE DETAILS
      ───────────────────────────────────────────────────────────── */}
      {selectedSampleDetails && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedSampleDetails(null)}
        >
          <div
            className="modal"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: 500 }}
          >
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>Sample Details — {selectedSampleDetails.id}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelectedSampleDetails(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gap: 10, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Patient Name:</span>
                  <strong>{selectedSampleDetails.patientName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Patient ID:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{selectedSampleDetails.patientId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>OP ID:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0284C7' }}>{selectedSampleDetails.opId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Test Requisition:</span>
                  <strong>{selectedSampleDetails.testName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Specimen / Sample Type:</span>
                  <span>{selectedSampleDetails.sampleType}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Collection Timestamp:</span>
                  <span>{selectedSampleDetails.collectionDate} at {selectedSampleDetails.collectionTime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Phlebotomist / Tech:</span>
                  <span>{selectedSampleDetails.collectedBy}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Priority Level:</span>
                  <span className={`badge ${selectedSampleDetails.priority === 'STAT' ? 'badge-danger' : selectedSampleDetails.priority === 'Urgent' ? 'badge-warning' : 'badge-muted'}`}>
                    {selectedSampleDetails.priority}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Lifecycle Status:</span>
                  <span className={`badge ${sampleStatusBadgeColor[selectedSampleDetails.status] || 'badge-info'}`}>
                    {selectedSampleDetails.status}
                  </span>
                </div>
                {selectedSampleDetails.notes && (
                  <div style={{ marginTop: 6, padding: '10px 12px', background: '#F8FAFC', borderRadius: 6, color: '#334155' }}>
                    <strong>Notes:</strong> {selectedSampleDetails.notes}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelectedSampleDetails(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
