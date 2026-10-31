import { useState, useMemo } from 'react';
import {
  FlaskConical, TestTube, Activity, FileText, AlertTriangle,
  Search, CheckCircle2, Clock, Eye, RefreshCw, Plus, Edit2, Check,
  Filter, ShieldAlert, UserCheck, AlertCircle, Wrench, Package,
  Download, Send, CheckSquare, Layers
} from 'lucide-react';
import { STATS } from '../../data/mockData';
import { useToast } from '../../components/common/Toast';
import PatientSearchGateway from '../../components/common/PatientSearchGateway';

// Patient-Specific Tests Database (Indexed by OP ID / Patient ID)
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
const INITIAL_LAB_ORDERS = [
  { id: 'LAB-501', patientName: 'Arun Kumar', patientId: 'P1001', opId: 'OP2026001', test: 'CBC', doctor: 'Dr. Kumar', priority: 'Routine', status: 'Pending', result: '—' },
  { id: 'LAB-502', patientName: 'Arun Kumar', patientId: 'P1001', opId: 'OP2026001', test: 'Blood Glucose', doctor: 'Dr. Kumar', priority: 'Routine', status: 'Completed', result: '142 mg/dL' },
  { id: 'LAB-503', patientName: 'Arun Kumar', patientId: 'P1001', opId: 'OP2026001', test: 'Dengue NS1', doctor: 'Dr. Kumar', priority: 'Urgent', status: 'In Progress', result: 'Processing' },
  { id: 'LAB-504', patientName: 'Arun Kumar', patientId: 'P1001', opId: 'OP2026001', test: 'LFT', doctor: 'Dr. Kumar', priority: 'Routine', status: 'Result Reviewed', result: 'Normal' },
  { id: 'LAB-505', patientName: 'Meena Devi', patientId: 'P1002', opId: 'OP2026002', test: 'Routine Urine Analysis', doctor: 'Dr. Sunita Rao', priority: 'Routine', status: 'Completed', result: 'Normal' },
  { id: 'LAB-506', patientName: 'Ravi Kumar', patientId: 'PAT001', opId: 'OP2026003', test: 'Lipid Profile', doctor: 'Dr. Priya Sharma', priority: 'Routine', status: 'Result Reviewed', result: '215 mg/dL' },
  { id: 'LAB-507', patientName: 'Sindhu Iyer', patientId: 'PAT014', opId: 'OP2026015', test: 'Platelet Count', doctor: 'Dr. Priya Sharma', priority: 'STAT', status: 'In Progress', result: '64,000 /mcL' },
];

// Diagnostic Equipments
const INITIAL_EQUIPMENT = [
  { id: 'EQ-01', name: 'Automated 5-Part Hematology Analyzer', brand: 'Sysmex XN-550', dept: 'Hematology', status: 'Online', lastCalibrated: 'Today, 06:00 AM', testsToday: 84, throughput: '60 samples/hr' },
  { id: 'EQ-02', name: 'Fully Automated Clinical Chemistry System', brand: 'Roche Cobas c311', dept: 'Biochemistry', status: 'Online', lastCalibrated: 'Today, 06:30 AM', testsToday: 142, throughput: '120 tests/hr' },
  { id: 'EQ-03', name: 'Chemiluminescence Immunoassay Analyzer', brand: 'Abbott Architect i1000', dept: 'Serology / Endocrine', status: 'Online', lastCalibrated: 'Yesterday', testsToday: 38, throughput: '65 tests/hr' },
  { id: 'EQ-04', name: 'Blood Gas & Electrolyte Analyzer (STAT)', brand: 'Radiometer ABL80', dept: 'Critical Care Lab', status: 'Online', lastCalibrated: 'Today, 07:15 AM', testsToday: 26, throughput: '2m / sample' },
  { id: 'EQ-05', name: 'Clinical Centrifuge Station A', brand: 'Thermo Heraeus', dept: 'Phlebotomy & Sample Prep', status: 'Online', lastCalibrated: 'Weekly QA Pass', testsToday: 110, throughput: '24 tubes/cycle' },
  { id: 'EQ-06', name: 'Microhematocrit Centrifuge Station B', brand: 'Remi RM-12C', dept: 'Hematology', status: 'Maintenance', lastCalibrated: 'Under QA Check', testsToday: 12, throughput: 'Calibration pending' },
];

// Reagent Inventory
const INITIAL_REAGENTS = [
  { id: 'RGT-101', name: 'CBC Diluent & Lyse Pack', dept: 'Hematology', stock: 12, unit: 'Packs (5L)', testsRemaining: 600, batch: 'HMT-2512', expiry: '2027-02-28', reorderLevel: 5, status: 'Adequate' },
  { id: 'RGT-102', name: 'Glucose Hexokinase Enzymatic Assay', dept: 'Biochemistry', stock: 3, unit: 'Kits (100 tests)', testsRemaining: 150, batch: 'GLU-2601', expiry: '2026-10-15', reorderLevel: 5, status: 'Low Stock Alert' },
  { id: 'RGT-103', name: 'Dengue NS1 Antigen Rapid Cartridges', dept: 'Serology', stock: 24, unit: 'Boxes (25 tests)', testsRemaining: 600, batch: 'DEN-2608', expiry: '2027-04-30', reorderLevel: 10, status: 'Adequate' },
  { id: 'RGT-104', name: 'Platelet Aggregation / EDTA Calibrator', dept: 'Hematology', stock: 2, unit: 'Vials (10 mL)', testsRemaining: 40, batch: 'PLT-2604', expiry: '2026-09-30', reorderLevel: 4, status: 'Critical Reorder' },
  { id: 'RGT-105', name: 'Serum Creatinine Jaffe Reagent Kit', dept: 'Biochemistry', stock: 8, unit: 'Kits', testsRemaining: 480, batch: 'CRT-2509', expiry: '2027-06-15', reorderLevel: 4, status: 'Adequate' },
  { id: 'RGT-106', name: 'Urine Multistix 10-SG Dipsticks', dept: 'Clinical Pathology', stock: 15, unit: 'Bottles (100 strips)', testsRemaining: 1500, batch: 'URN-2602', expiry: '2027-09-01', reorderLevel: 6, status: 'Adequate' },
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

  // Active Tab
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'samples', 'equipment', 'reagents'

  // Selected Patient Record for Tests
  const [selectedPatientRecord, setSelectedPatientRecord] = useState(PATIENT_TESTS_DATA['P1001']);
  const [labOrders, setLabOrders] = useState(INITIAL_LAB_ORDERS);

  // Samples State (Requirement 9)
  const [samples, setSamples] = useState(INITIAL_SAMPLE_RECORDS);
  const [sampleSearch, setSampleSearch] = useState('');
  const [showAddSampleModal, setShowAddSampleModal] = useState(false);
  const [selectedSampleDetails, setSelectedSampleDetails] = useState(null);

  // Equipment & Reagents State
  const [equipments, setEquipments] = useState(INITIAL_EQUIPMENT);
  const [reagents, setReagents] = useState(INITIAL_REAGENTS);

  // Critical Alerts State
  const [criticalAlerts, setCriticalAlerts] = useState([
    { id: 'CRIT-1', patientName: 'Sindhu Iyer', opId: 'OP2026015', patientId: 'PAT014', test: 'Platelet Count', value: '64,000 /mcL', normal: '150,000 - 450,000 /mcL', doctor: 'Dr. Priya Sharma', time: '10:30 AM', acknowledged: false },
    { id: 'CRIT-2', patientName: 'Arun Kumar', opId: 'OP2026001', patientId: 'P1001', test: 'Blood Glucose (Post-Meal)', value: '318 mg/dL', normal: '< 140 mg/dL', doctor: 'Dr. Rajesh Kumar', time: '08:45 AM', acknowledged: true }
  ]);

  // Result Entry & Verification Modal State
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultModalData, setResultModalData] = useState({
    testId: '',
    testName: '',
    patientName: '',
    patientId: '',
    opId: '',
    dept: 'Hematology',
    value: '',
    referenceRange: '',
    assessment: 'Normal', // 'Normal', 'Elevated', 'Depressed', 'Critical STAT'
    pathologist: 'Dr. R. Shankar, MD (Path)',
    notes: '',
    dispatchAlert: false
  });

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
    { label: 'Critical STAT Results', value: criticalAlerts.filter(a => !a.acknowledged).length, icon: AlertTriangle, color: '#EF4444', bg: '#FEE2E2' },
    { label: 'Reagent Alerts', value: reagents.filter(r => r.status !== 'Adequate').length, icon: Package, color: '#F59E0B', bg: '#FEF3C7' },
  ];

  // Open Result Entry Modal
  function handleOpenResultModal(item, isOrder = false) {
    const isPatientTest = !isOrder;
    setResultModalData({
      testId: item.id,
      testName: isPatientTest ? item.test : item.test,
      patientName: isPatientTest ? (selectedPatientRecord?.patientName || selectedPatientRecord?.name) : item.patientName,
      patientId: isPatientTest ? (selectedPatientRecord?.patientId || selectedPatientRecord?.id) : item.patientId,
      opId: isPatientTest ? selectedPatientRecord?.opId : item.opId,
      dept: item.dept || 'Biochemistry',
      value: item.result !== '—' && !item.result.includes('Awaiting') ? item.result : '',
      referenceRange: item.test.includes('Glucose') ? '70 - 110 mg/dL (Fasting)' : item.test.includes('Platelet') ? '150,000 - 450,000 /mcL' : 'Standard clinical baseline',
      assessment: item.priority === 'STAT' ? 'Critical STAT' : 'Normal',
      pathologist: 'Dr. R. Shankar, MD (Path)',
      notes: 'Calibrated specimen verified on automated analyzer.',
      dispatchAlert: item.priority === 'STAT'
    });
    setShowResultModal(true);
  }

  // Save Result Entry & Verification Submit
  function handleSaveResultSubmit(e) {
    e.preventDefault();
    const { testId, testName, patientName, patientId, opId, value, assessment, pathologist, notes, dispatchAlert } = resultModalData;

    // Update patient tests if loaded
    if (selectedPatientRecord) {
      setSelectedPatientRecord(prev => ({
        ...prev,
        tests: prev.tests.map(t => {
          if (t.id === testId || t.test === testName) {
            return {
              ...t,
              result: value,
              status: 'Result Reviewed'
            };
          }
          return t;
        })
      }));
    }

    // Update in lab orders
    setLabOrders(prev => prev.map(o => {
      if (o.id === testId || (o.patientId === patientId && o.test === testName)) {
        return {
          ...o,
          result: value,
          status: 'Completed'
        };
      }
      return o;
    }));

    // If marked critical, dispatch STAT alert
    if (assessment === 'Critical STAT' || dispatchAlert) {
      setCriticalAlerts(prev => [
        {
          id: `CRIT-${Date.now()}`,
          patientName,
          patientId,
          opId,
          test: testName,
          value,
          normal: resultModalData.referenceRange,
          doctor: 'Attending Physician',
          time: 'Just Now',
          acknowledged: false
        },
        ...prev
      ]);
      toast(`Critical STAT result recorded! Emergency alert sent to doctor for ${patientName}`, 'error');
    } else {
      toast(`Verified result entered for ${patientName}: ${testName} = ${value}`, 'success');
    }

    setShowResultModal(false);
  }

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

  // Acknowledge critical alert
  function handleAcknowledgeCriticalAlert(alertId) {
    setCriticalAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
    toast('Critical lab alert acknowledged and documented', 'success');
  }

  // Reorder reagent
  function handleReorderReagent(reagentId, name) {
    setReagents(prev => prev.map(r => r.id === reagentId ? { ...r, status: 'Reordered' } : r));
    toast(`Requisition dispatched to Central Pharmacy for ${name}`, 'success');
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
    <div className="fade-in lab-dashboard" style={{ paddingBottom: 32 }}>
      {/* ── 1. Top Header ───────────────────────────────────────────── */}
      <div className="dashboard-header" style={{ marginBottom: 16 }}>
        <div>
          <div className="dashboard-title">🔬 Laboratory Diagnostics & Pathology Workspace</div>
          <div className="dashboard-subtitle">Ravi Shankar · Senior Diagnostic Specialist · Salem District Hospital Central Labs</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('reagents')}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Package size={14} /> Reagent Inventory
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddSampleModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={14} /> Add Specimen Sample
          </button>
        </div>
      </div>

      {/* ── 2. STAT Critical Lab Alerts Banner ──────────────────────── */}
      {criticalAlerts.length > 0 && (
        <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {criticalAlerts.map(alert => (
            <div
              key={alert.id}
              style={{
                background: alert.acknowledged ? '#F8FAFC' : '#FEF2F2',
                border: alert.acknowledged ? '1px solid #E2E8F0' : '1.5px solid #FECACA',
                borderRadius: 10,
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: alert.acknowledged ? '#E2E8F0' : '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertCircle size={18} color={alert.acknowledged ? '#64748B' : '#DC2626'} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: alert.acknowledged ? '#475569' : '#991B1B' }}>
                    STAT ALERT: {alert.patientName} ({alert.opId}) — <span style={{ color: '#DC2626' }}>{alert.test}: {alert.value}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>
                    Normal: {alert.normal} · Attending: {alert.doctor} · Dispatched: {alert.time}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {!alert.acknowledged ? (
                  <>
                    <button
                      className="btn btn-primary btn-xs"
                      onClick={() => handleAcknowledgeCriticalAlert(alert.id)}
                      style={{ background: '#DC2626', borderColor: '#DC2626' }}
                    >
                      Acknowledge & Sign
                    </button>
                    <button
                      className="btn btn-secondary btn-xs"
                      onClick={() => toast(`Phone call and push notification dispatched to ${alert.doctor}`, 'success')}
                    >
                      Direct Call Doctor
                    </button>
                  </>
                ) : (
                  <span style={{ fontSize: 11, color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={13} /> Verified by Pathologist
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 3. Top KPI Cards ────────────────────────────────────────── */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {statCards.map((c, i) => (
          <div key={i} className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="stat-label">{c.label}</div>
              <div className="stat-icon" style={{ background: c.bg }}><c.icon size={18} color={c.color} /></div>
            </div>
            <div className="stat-value" style={{ margin: '6px 0 2px' }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* ── 4. Laboratory Navigation Tabs ───────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          background: '#FFFFFF',
          padding: 6,
          borderRadius: 10,
          border: '1px solid #E2E8F0',
          marginBottom: 16,
          overflowX: 'auto'
        }}
      >
        {[
          { id: 'orders', label: 'Diagnostic Orders & Result Verification', icon: FlaskConical },
          { id: 'samples', label: 'Sample Collection & Phlebotomy', icon: TestTube, count: filteredSamples.length },
          { id: 'equipment', label: 'Diagnostic Equipment Availability', icon: Wrench, count: `${equipments.filter(e => e.status === 'Online').length}/${equipments.length}` },
          { id: 'reagents', label: 'Reagent Inventory & Quality Control', icon: Package, count: reagents.filter(r => r.status !== 'Adequate').length, badgeDanger: reagents.some(r => r.status.includes('Critical')) },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderRadius: 8,
                border: 'none',
                background: isActive ? '#061E38' : 'transparent',
                color: isActive ? '#FFFFFF' : '#475569',
                fontSize: 12.5,
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <tab.icon size={15} color={isActive ? '#38BDF8' : '#64748B'} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  style={{
                    fontSize: 10.5,
                    padding: '1px 6px',
                    borderRadius: 999,
                    fontWeight: 700,
                    background: tab.badgeDanger ? '#EF4444' : isActive ? 'rgba(255,255,255,0.2)' : '#F1F5F9',
                    color: tab.badgeDanger ? '#FFFFFF' : isActive ? '#FFFFFF' : '#475569'
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── 5. TAB 1: DIAGNOSTIC ORDERS & RESULT VERIFICATION ─────────── */}
      {activeTab === 'orders' && (
        <div style={{ display: 'grid', gap: 16 }}>
          {/* Patient Identification Gateway */}
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

          {/* Active Patient Diagnostic Profile */}
          {selectedPatientRecord && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2E8F0', background: '#F0F9FF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#0369A1', textTransform: 'uppercase' }}>Verified Diagnostic Record:</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0C4A6E' }}>
                    {selectedPatientRecord.patientName || selectedPatientRecord.name} — <span style={{ color: '#0284C7' }}>{selectedPatientRecord.patientId || selectedPatientRecord.id}</span> — <span style={{ color: '#0369A1' }}>{selectedPatientRecord.opId}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span className="badge badge-primary">OP: {selectedPatientRecord.opId}</span>
                  <span className="badge badge-info">ABHA: {selectedPatientRecord.abhaId || 'ABHA10001'}</span>
                </div>
              </div>

              <div className="table-container">
                <table className="table" style={{ fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569', fontSize: 11, textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 14px' }}>Diagnostic Test</th>
                      <th style={{ padding: '12px 14px' }}>Department</th>
                      <th style={{ padding: '12px 14px' }}>Requested At</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 14px' }}>Observed Result</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPatientRecord.tests.map(t => (
                      <tr key={t.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <TestTube size={15} color="#0EA5E9" />
                            <span>{t.test}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', color: '#475569' }}>{t.dept}</td>
                        <td style={{ padding: '12px 14px', color: '#64748B' }}>{t.requestedDate}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span className={`badge ${statusBadgeColor[t.status] || 'badge-muted'}`}>
                            {t.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0F172A' }}>
                          {t.result}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: 6 }}>
                            <button
                              className="btn btn-primary btn-xs"
                              onClick={() => handleOpenResultModal(t)}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                            >
                              <Edit2 size={12} /> Enter / Verify
                            </button>
                            <button
                              className="btn btn-ghost btn-xs"
                              onClick={() => handleUpdateTestStatus(t.id)}
                            >
                              Advance
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

          {/* Centralized Orders Queue */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileText size={18} color="#0EA5E9" />
                  <span>Centralized Laboratory Orders Queue</span>
                </div>
                <div style={{ fontSize: 12, color: '#64748B' }}>
                  All orders across outpatient, inpatient, and emergency departments
                </div>
              </div>
            </div>

            <div className="table-container">
              <table className="table" style={{ fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569', fontSize: 11, textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 14px' }}>Order ID</th>
                    <th style={{ padding: '12px 14px' }}>Patient Details</th>
                    <th style={{ padding: '12px 14px' }}>OP ID</th>
                    <th style={{ padding: '12px 14px' }}>Requisition Test</th>
                    <th style={{ padding: '12px 14px' }}>Ordering Doctor</th>
                    <th style={{ padding: '12px 14px' }}>Priority</th>
                    <th style={{ padding: '12px 14px' }}>Status</th>
                    <th style={{ padding: '12px 14px' }}>Result</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {labOrders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 600, color: '#64748B' }}>
                        {order.id}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{order.patientName}</div>
                        <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>{order.patientId}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0284C7', background: '#E0F2FE', padding: '2px 6px', borderRadius: 4, fontSize: 11.5 }}>
                          {order.opId}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0F172A' }}>
                        {order.test}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#475569' }}>
                        {order.doctor}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className={`badge ${order.priority === 'STAT' ? 'badge-danger' : order.priority === 'Urgent' ? 'badge-warning' : 'badge-muted'}`}>
                          {order.priority}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className={`badge ${statusBadgeColor[order.status] || 'badge-muted'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0F172A' }}>
                        {order.result}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <button
                          className="btn btn-primary btn-xs"
                          onClick={() => handleOpenResultModal(order, true)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                        >
                          <Edit2 size={12} /> Verify Result
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. TAB 2: SAMPLE COLLECTION & PHLEBOTOMY ────────────────── */}
      {activeTab === 'samples' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #E2E8F0',
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
                <span className="badge badge-primary">{filteredSamples.length} active</span>
              </div>
              <div style={{ fontSize: 12, color: '#64748B' }}>
                Register biological specimens, track chain of custody, and record phlebotomy intake
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="search-bar" style={{ minWidth: 240, background: '#FFFFFF' }}>
                <Search size={15} color="#94A3B8" />
                <input
                  placeholder="Search OP ID, Patient Name, Test..."
                  value={sampleSearch}
                  onChange={e => setSampleSearch(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowAddSampleModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Plus size={14} /> Add Sample
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="table" style={{ fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569', fontSize: 11, textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>Sample ID</th>
                  <th style={{ padding: '12px 14px' }}>Patient Details</th>
                  <th style={{ padding: '12px 14px' }}>OP ID & ID</th>
                  <th style={{ padding: '12px 14px' }}>Test Name</th>
                  <th style={{ padding: '12px 14px' }}>Sample Type</th>
                  <th style={{ padding: '12px 14px' }}>Collection Timestamp</th>
                  <th style={{ padding: '12px 14px' }}>Collected By</th>
                  <th style={{ padding: '12px 14px' }}>Priority</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSamples.map(sample => (
                  <tr key={sample.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#0F172A' }}>
                      {sample.id}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>
                      {sample.patientName}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '2px 6px', background: '#E0F2FE', borderRadius: 4, fontFamily: 'monospace', fontWeight: 800, fontSize: 11, color: '#0284C7' }}>
                        {sample.opId}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#334155' }}>{sample.testName}</td>
                    <td style={{ padding: '12px 14px' }}><span className="tag">{sample.sampleType}</span></td>
                    <td style={{ padding: '12px 14px', fontSize: 11.5, color: '#64748B' }}>
                      {sample.collectionDate} · {sample.collectionTime}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>{sample.collectedBy}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className={`badge ${sample.priority === 'STAT' ? 'badge-danger' : sample.priority === 'Urgent' ? 'badge-warning' : 'badge-muted'}`}>
                        {sample.priority}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className={`badge ${sampleStatusBadgeColor[sample.status] || 'badge-info'}`}>
                        {sample.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={() => setSelectedSampleDetails(sample)}
                        >
                          <Eye size={12} /> Details
                        </button>
                        <button
                          className="btn btn-primary btn-xs"
                          onClick={() => handleCycleSampleStatus(sample.id)}
                        >
                          Status
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

      {/* ── 7. TAB 3: DIAGNOSTIC EQUIPMENT AVAILABILITY ──────────────── */}
      {activeTab === 'equipment' && (
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
            {equipments.map(eq => {
              const isOnline = eq.status === 'Online';
              return (
                <div key={eq.id} className="card" style={{ borderLeft: `4px solid ${isOnline ? '#10B981' : '#F59E0B'}`, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>{eq.name}</div>
                      <div style={{ fontSize: 11.5, color: '#64748B' }}>{eq.brand} · {eq.dept}</div>
                    </div>
                    <span className={`badge ${isOnline ? 'badge-success' : 'badge-warning'}`}>
                      ● {eq.status}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10, padding: 10, background: '#F8FAFC', borderRadius: 8, fontSize: 11.5 }}>
                    <div>
                      <span style={{ color: '#64748B' }}>Throughput:</span>
                      <div style={{ fontWeight: 700, color: '#0F172A' }}>{eq.throughput}</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Processed Today:</span>
                      <div style={{ fontWeight: 700, color: '#0284C7' }}>{eq.testsToday} Tests</div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <span style={{ color: '#64748B' }}>Calibration QA:</span>
                      <div style={{ fontWeight: 600, color: '#10B981' }}>{eq.lastCalibrated}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 12, textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-xs"
                      onClick={() => toast(`Ran diagnostic self-test & calibration QC on ${eq.name}`, 'success')}
                    >
                      Run Calibration QC
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 8. TAB 4: REAGENT INVENTORY & QUALITY CONTROL ────────────── */}
      {activeTab === 'reagents' && (
        <div style={{ display: 'grid', gap: 16 }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>Pathology & Biochemistry Reagent Stocks</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>Monitor test kit inventories, consumption rates, and expiry controls</div>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => toast('Exported reagent consumption log for audit', 'success')}
              >
                <Download size={14} /> Export Reagent Report
              </button>
            </div>

            <div className="table-container">
              <table className="table" style={{ fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569', fontSize: 11, textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 14px' }}>Reagent Requisition</th>
                    <th style={{ padding: '12px 14px' }}>Department</th>
                    <th style={{ padding: '12px 14px' }}>Available Stock</th>
                    <th style={{ padding: '12px 14px' }}>Tests Remaining</th>
                    <th style={{ padding: '12px 14px' }}>Batch No.</th>
                    <th style={{ padding: '12px 14px' }}>Expiry Date</th>
                    <th style={{ padding: '12px 14px' }}>Status</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reagents.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>
                        {r.name}
                        <div style={{ fontSize: 10.5, color: '#64748B', fontFamily: 'monospace' }}>{r.id}</div>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#475569' }}>{r.dept}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>
                        {r.stock} {r.unit}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0284C7' }}>
                        ~{r.testsRemaining} tests
                      </td>
                      <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#64748B' }}>{r.batch}</td>
                      <td style={{ padding: '12px 14px', color: '#334155' }}>{r.expiry}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className={`badge ${r.status === 'Adequate' ? 'badge-success' : r.status.includes('Critical') ? 'badge-danger' : 'badge-warning'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <button
                          className={`btn btn-xs ${r.status !== 'Adequate' ? 'btn-primary' : 'btn-ghost'}`}
                          onClick={() => handleReorderReagent(r.id, r.name)}
                        >
                          Reorder Kit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── 9. MODAL: RESULT ENTRY & VERIFICATION ──────────────────── */}
      {showResultModal && (
        <div className="modal-overlay" onClick={() => setShowResultModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0 }}>Result Entry & Clinical Verification</h3>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  {resultModalData.testName} — {resultModalData.patientName} ({resultModalData.opId})
                </div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowResultModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveResultSubmit}>
              <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                <div style={{ padding: '10px 14px', background: '#F0F9FF', borderRadius: 8, marginBottom: 14, border: '1px solid #BAE6FD', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, fontSize: 12 }}>
                  <div><strong>Patient:</strong> {resultModalData.patientName}</div>
                  <div><strong>Patient ID:</strong> {resultModalData.patientId}</div>
                  <div><strong>OP ID:</strong> {resultModalData.opId}</div>
                  <div><strong>Department:</strong> {resultModalData.dept}</div>
                </div>

                <div style={{ display: 'grid', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Observed Test Value *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. 142 mg/dL or 64,000 /mcL"
                      value={resultModalData.value}
                      onChange={e => setResultModalData({ ...resultModalData, value: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="form-group">
                      <label className="form-label">Biological Reference Range</label>
                      <input
                        type="text"
                        className="form-input"
                        value={resultModalData.referenceRange}
                        onChange={e => setResultModalData({ ...resultModalData, referenceRange: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Clinical Interpretation *</label>
                      <select
                        className="form-select"
                        value={resultModalData.assessment}
                        onChange={e => setResultModalData({
                          ...resultModalData,
                          assessment: e.target.value,
                          dispatchAlert: e.target.value === 'Critical STAT'
                        })}
                      >
                        <option>Normal</option>
                        <option>Elevated</option>
                        <option>Depressed</option>
                        <option>Critical STAT</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Sign-off Pathologist / Specialist</label>
                    <input
                      type="text"
                      className="form-input"
                      value={resultModalData.pathologist}
                      onChange={e => setResultModalData({ ...resultModalData, pathologist: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pathologist Remarks / Observations</label>
                    <textarea
                      className="form-input"
                      rows={2}
                      value={resultModalData.notes}
                      onChange={e => setResultModalData({ ...resultModalData, notes: e.target.value })}
                    />
                  </div>

                  <div style={{ padding: 10, background: resultModalData.assessment === 'Critical STAT' ? '#FEE2E2' : '#F8FAFC', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="checkbox"
                      id="critAlertCheck"
                      checked={resultModalData.dispatchAlert}
                      onChange={e => setResultModalData({ ...resultModalData, dispatchAlert: e.target.checked })}
                    />
                    <label htmlFor="critAlertCheck" style={{ fontSize: 12, fontWeight: 700, color: resultModalData.assessment === 'Critical STAT' ? '#DC2626' : '#334155' }}>
                      Dispatch Urgent Critical (STAT) Alert to Attending Physician
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowResultModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Sign & Verify Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 10. MODAL: ADD SAMPLE (Requirement 9) ──────────────────── */}
      {showAddSampleModal && (
        <div className="modal-overlay" onClick={() => setShowAddSampleModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 580 }}>
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
                      <label className="form-label">Patient ID</label>
                      <input
                        type="text"
                        className="form-input"
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
                        placeholder="e.g. CBC, Dengue NS1, LFT"
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
                        <option>Blood (EDTA)</option>
                        <option>Blood (Fluoride)</option>
                        <option>Serum</option>
                        <option>Urine</option>
                        <option>CSF</option>
                        <option>Swab / Culture</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="form-group">
                      <label className="form-label">Collection Date</label>
                      <input
                        type="text"
                        className="form-input"
                        value={sampleForm.collectionDate}
                        onChange={e => setSampleForm({ ...sampleForm, collectionDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Collection Time</label>
                      <input
                        type="text"
                        className="form-input"
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
                      placeholder="e.g. Lavender EDTA tube, 3 mL venous sample."
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

      {/* ── 11. MODAL: VIEW SAMPLE DETAILS ─────────────────────────── */}
      {selectedSampleDetails && (
        <div className="modal-overlay" onClick={() => setSelectedSampleDetails(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
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
