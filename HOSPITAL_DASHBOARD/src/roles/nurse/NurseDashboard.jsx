import { useState } from 'react';
import {
  Users, Pill, AlertTriangle, FileText, ClipboardList,
  Search, Plus, CheckCircle2, Clock, Edit2, Check,
  Sparkles, Calendar, ShieldCheck, Activity, Bed,
  Thermometer, Heart, ArrowRightLeft, Send, CheckSquare,
  Square, AlertCircle, RefreshCw, ChevronRight, FileCheck
} from 'lucide-react';
import { STATS } from '../../data/mockData';
import { useToast } from '../../components/common/Toast';
import PatientSearchGateway from '../../components/common/PatientSearchGateway';

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
  { id: 'P1001', name: 'Arun Kumar', opId: 'OP2026001', abhaId: 'ABHA10001', age: 42, gender: 'Male', ward: 'General Ward', bed: 'B-04', diagnosis: 'Type 2 Diabetes & Hypertension', doctor: 'Dr. Priya Sharma', admittedOn: '2026-09-04' },
  { id: 'P1002', name: 'Meena Devi', opId: 'OP2026002', abhaId: 'ABHA10002', age: 32, gender: 'Female', ward: 'Gynecology Ward', bed: 'G-03', diagnosis: 'Ante-natal Care (32 Weeks)', doctor: 'Dr. Sunita Rao', admittedOn: '2026-09-05' },
  { id: 'PAT001', name: 'Ravi Kumar', opId: 'OP2026003', abhaId: 'ABHA10003', age: 45, gender: 'Male', ward: 'Cardiology Ward', bed: 'C-12', diagnosis: 'Hypertensive Emergency', doctor: 'Dr. Priya Sharma', admittedOn: '2026-09-06' },
  { id: 'PAT002', name: 'Priya Sharma', opId: 'OP2026004', abhaId: 'ABHA10004', age: 29, gender: 'Female', ward: 'General Ward', bed: 'B-08', diagnosis: 'Migraine & Tension Headache', doctor: 'Dr. Rajesh Kumar', admittedOn: '2026-09-06' },
  { id: 'PAT014', name: 'Sindhu Iyer', opId: 'OP2026015', abhaId: 'ABHA10015', age: 22, gender: 'Female', ward: 'Isolation Ward', bed: 'I-15', diagnosis: 'Dengue Fever with Thrombocytopenia', doctor: 'Dr. Priya Sharma', admittedOn: '2026-09-05' },
];

// Initial Patient Vitals History
const INITIAL_VITALS = [
  { id: 'VIT-101', patientId: 'P1001', opId: 'OP2026001', name: 'Arun Kumar', bp: '138/88', systolic: 138, diastolic: 88, pulse: 78, temp: 98.6, spo2: 98, respRate: 16, bloodSugar: 142, recordedAt: 'Today, 08:00 AM', nurse: 'Sister Anitha Ravi', status: 'Stable' },
  { id: 'VIT-102', patientId: 'PAT014', opId: 'OP2026015', name: 'Sindhu Iyer', bp: '102/68', systolic: 102, diastolic: 68, pulse: 96, temp: 101.4, spo2: 95, respRate: 20, bloodSugar: 110, recordedAt: 'Today, 08:15 AM', nurse: 'Sister Anitha Ravi', status: 'Warning (Febrile)' },
  { id: 'VIT-103', patientId: 'PAT001', opId: 'OP2026003', name: 'Ravi Kumar', bp: '154/96', systolic: 154, diastolic: 96, pulse: 82, temp: 98.4, spo2: 97, respRate: 18, bloodSugar: 130, recordedAt: 'Today, 07:30 AM', nurse: 'Sister Deepa Mary', status: 'Critical (High BP)' },
  { id: 'VIT-104', patientId: 'P1002', opId: 'OP2026002', name: 'Meena Devi', bp: '118/76', systolic: 118, diastolic: 76, pulse: 74, temp: 98.2, spo2: 99, respRate: 16, bloodSugar: 94, recordedAt: 'Today, 08:30 AM', nurse: 'Sister Kavitha S.', status: 'Stable' },
  { id: 'VIT-105', patientId: 'PAT002', opId: 'OP2026004', name: 'Priya Sharma', bp: '120/80', systolic: 120, diastolic: 80, pulse: 72, temp: 98.6, spo2: 99, respRate: 16, bloodSugar: 105, recordedAt: 'Today, 09:00 AM', nurse: 'Sister Anitha Ravi', status: 'Stable' },
];

// Initial Ward Bed Matrix
const INITIAL_BEDS = [
  { id: 'B-01', ward: 'General Ward', status: 'Available', type: 'Standard', patient: null },
  { id: 'B-02', ward: 'General Ward', status: 'Available', type: 'Standard', patient: null },
  { id: 'B-03', ward: 'General Ward', status: 'Occupied', type: 'Standard', patient: { name: 'Karthik S.', opId: 'OP2026021', diagnosis: 'Post-Hernia Repair' } },
  { id: 'B-04', ward: 'General Ward', status: 'Occupied', type: 'Standard', patient: { name: 'Arun Kumar', opId: 'OP2026001', diagnosis: 'Type 2 Diabetes' } },
  { id: 'B-08', ward: 'General Ward', status: 'Occupied', type: 'Standard', patient: { name: 'Priya Sharma', opId: 'OP2026004', diagnosis: 'Migraine' } },
  { id: 'G-01', ward: 'Gynecology Ward', status: 'Available', type: 'Maternity', patient: null },
  { id: 'G-03', ward: 'Gynecology Ward', status: 'Occupied', type: 'Maternity', patient: { name: 'Meena Devi', opId: 'OP2026002', diagnosis: 'Ante-natal Care' } },
  { id: 'C-12', ward: 'Cardiology Ward', status: 'Occupied', type: 'Step-Down', patient: { name: 'Ravi Kumar', opId: 'OP2026003', diagnosis: 'Hypertensive Emergency' } },
  { id: 'I-15', ward: 'Isolation Ward', status: 'Occupied', type: 'Isolation / Barrier', patient: { name: 'Sindhu Iyer', opId: 'OP2026015', diagnosis: 'Dengue Fever' } },
  { id: 'ICU-01', ward: 'ICU / Critical Care', status: 'Occupied', type: 'Ventilator', patient: { name: 'V. Murugan', opId: 'OP2026033', diagnosis: 'Severe ARDS' } },
  { id: 'ICU-02', ward: 'ICU / Critical Care', status: 'Available', type: 'Ventilator', patient: null },
  { id: 'ICU-03', ward: 'ICU / Critical Care', status: 'Cleaning', type: 'Ventilator', patient: null },
];

// Initial Nursing Shift Tasks Checklist
const INITIAL_TASKS = [
  { id: 'TSK-1', task: 'IV Cannula Site Inspection & Heparin Flush', patient: 'Arun Kumar (P1001)', time: '10:00 AM', status: 'Pending', priority: 'Routine' },
  { id: 'TSK-2', task: 'Stat Blood Specimen Collection for Platelet Count', patient: 'Sindhu Iyer (PAT014)', time: '10:30 AM', status: 'Completed', priority: 'Urgent' },
  { id: 'TSK-3', task: 'Hourly Urine Output & Strict Fluid Balance Charting', patient: 'Sindhu Iyer (PAT014)', time: '11:00 AM', status: 'Pending', priority: 'Urgent' },
  { id: 'TSK-4', task: 'Post-Medication BP Measurement (Amlodipine effect check)', patient: 'Ravi Kumar (PAT001)', time: '11:30 AM', status: 'Pending', priority: 'High' },
  { id: 'TSK-5', task: 'Fetal Heart Rate Monitoring & Doppler Assessment', patient: 'Meena Devi (P1002)', time: '12:00 PM', status: 'Pending', priority: 'Routine' },
  { id: 'TSK-6', task: '2-Hourly Position Change / Pressure Injury Prevention', patient: 'Karthik S. (B-03)', time: '12:30 PM', status: 'Pending', priority: 'Routine' },
];

// Initial Clinical Nursing Shift Notes
const INITIAL_NOTES = [
  { id: 'NTE-1', patient: 'Sindhu Iyer (PAT014)', opId: 'OP2026015', category: 'Clinical Alert', note: 'Patient developed fever spike (101.4°F) at 08:15 AM. Paracetamol 650mg given orally. Ice sponge applied. Platelet sample dispatched to lab STAT. On-call physician Dr. Priya notified.', time: '08:25 AM', nurse: 'Sister Anitha Ravi' },
  { id: 'NTE-2', patient: 'Arun Kumar (P1001)', opId: 'OP2026001', category: 'Medication', note: 'Fasting blood glucose recorded at 142 mg/dL. Morning dose of regular insulin administered as per sliding scale. Patient tolerated breakfast well with no signs of hypoglycemia.', time: '08:45 AM', nurse: 'Sister Anitha Ravi' },
  { id: 'NTE-3', patient: 'Ravi Kumar (PAT001)', opId: 'OP2026003', category: 'Observation', note: 'Patient reports mild occipital headache. BP elevated at 154/96 mmHg. Oral Amlodipine 5mg given. Bed rest advised; re-checking BP in 2 hours.', time: '07:45 AM', nurse: 'Sister Deepa Mary' },
];

// Doctor Orders
const INITIAL_DOCTOR_ORDERS = [
  { id: 'ORD-1', patient: 'Arun Kumar (P1001)', opId: 'OP2026001', order: 'Monitor blood glucose AC/PC. Continue regular insulin if fasting > 180 mg/dL', doctor: 'Dr. Rajesh Kumar', time: '08:30 AM', urgent: false, completed: false },
  { id: 'ORD-2', patient: 'Sindhu Iyer (PAT014)', opId: 'OP2026015', order: 'IV Fluid replacement 1L NS over 6 hours. Strict input/output chart. Daily platelet count.', doctor: 'Dr. Priya Sharma', time: '09:30 AM', urgent: true, completed: false },
  { id: 'ORD-3', patient: 'Ravi Kumar (PAT001)', opId: 'OP2026003', order: 'Monitor BP every 4 hours. Report immediately if systolic > 160 mmHg', doctor: 'Dr. Priya Sharma', time: '08:00 AM', urgent: false, completed: true },
];

export default function NurseDashboard() {
  const toast = useToast();
  const s = STATS.nurse;

  // Active Nurse Workspace Tab
  const [activeTab, setActiveTab] = useState('medications'); // 'medications', 'vitals', 'beds', 'tasks', 'notes', 'handover'

  // Selected Patient State for Medication Schedule
  const [selectedPatient, setSelectedPatient] = useState(PATIENT_DATABASE[0]);
  const [medSchedules, setMedSchedules] = useState(INITIAL_MEDICATION_SCHEDULES);

  // Vitals State
  const [vitalsList, setVitalsList] = useState(INITIAL_VITALS);
  const [showRecordVitalsModal, setShowRecordVitalsModal] = useState(false);
  const [vitalsForm, setVitalsForm] = useState({
    patientId: 'P1001',
    systolic: '130',
    diastolic: '85',
    pulse: '76',
    temp: '98.6',
    spo2: '98',
    respRate: '16',
    bloodSugar: '120',
    notes: 'Resting, oriented, cooperative'
  });

  // Bed Allocation State
  const [beds, setBeds] = useState(INITIAL_BEDS);
  const [showBedTransferModal, setShowBedTransferModal] = useState(false);
  const [selectedBedToTransfer, setSelectedBedToTransfer] = useState(null);
  const [newBedWard, setNewBedWard] = useState('General Ward');

  // Tasks & Orders State
  const [taskList, setTaskList] = useState(INITIAL_TASKS);
  const [doctorOrders, setDoctorOrders] = useState(INITIAL_DOCTOR_ORDERS);

  // Nursing Notes State
  const [nursingNotes, setNursingNotes] = useState(INITIAL_NOTES);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNoteForm, setNewNoteForm] = useState({
    patientId: 'P1001',
    category: 'Observation',
    note: ''
  });

  // Critical Alerts State
  const [criticalAlerts, setCriticalAlerts] = useState([
    { id: 'ALT-1', patient: 'Sindhu Iyer (PAT014)', ward: 'Isolation Ward (Bed I-15)', issue: 'Platelet drop to 64,000 /mcL · Febrile 101.4°F', severity: 'Critical', acknowledged: false },
    { id: 'ALT-2', patient: 'Ravi Kumar (PAT001)', ward: 'Cardiology Ward (Bed C-12)', issue: 'Elevated blood pressure 154/96 mmHg', severity: 'High', acknowledged: false },
  ]);

  // Medication Modals State
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

  // KPI stat cards
  const unreadAlerts = criticalAlerts.filter(a => !a.acknowledged).length;
  const pendingTasks = taskList.filter(t => t.status === 'Pending').length;
  const occupiedBeds = beds.filter(b => b.status === 'Occupied').length;

  const statCards = [
    { label: 'Assigned Patients', value: PATIENT_DATABASE.length, subtext: 'In Ward B & C', icon: Users, color: '#0EA5E9', bg: '#E0F2FE' },
    { label: 'Medication Doses', value: Object.values(medSchedules).flat().length, subtext: 'Active schedules', icon: Pill, color: '#10B981', bg: '#D1FAE5' },
    { label: 'Critical Alerts', value: unreadAlerts, subtext: unreadAlerts > 0 ? 'Requires STAT action' : 'All acknowledged', icon: AlertTriangle, color: '#EF4444', bg: '#FEE2E2' },
    { label: 'Doctor Orders', value: doctorOrders.length, subtext: `${doctorOrders.filter(o => o.completed).length} completed`, icon: FileText, color: '#8B5CF6', bg: '#EDE9FE' },
    { label: 'Nursing Shift Tasks', value: pendingTasks, subtext: `${taskList.length - pendingTasks} done`, icon: ClipboardList, color: '#14B8A6', bg: '#CCFBF1' },
    { label: 'Ward Bed Occupancy', value: `${occupiedBeds}/${beds.length}`, subtext: `${beds.filter(b => b.status === 'Available').length} beds available`, icon: Bed, color: '#F59E0B', bg: '#FEF3C7' },
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
    setVitalsForm(prev => ({
      ...prev,
      patientId: patient.id
    }));
    setNewNoteForm(prev => ({
      ...prev,
      patientId: patient.id
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

  // Vitals Submission Handler
  function handleRecordVitalsSubmit(e) {
    e.preventDefault();
    const p = PATIENT_DATABASE.find(pt => pt.id === vitalsForm.patientId) || selectedPatient || PATIENT_DATABASE[0];
    const sys = parseInt(vitalsForm.systolic, 10);
    const dia = parseInt(vitalsForm.diastolic, 10);
    const tempNum = parseFloat(vitalsForm.temp);

    let status = 'Stable';
    if (sys >= 150 || dia >= 95) status = 'Critical (High BP)';
    else if (tempNum >= 100.4) status = 'Warning (Febrile)';
    else if (parseInt(vitalsForm.spo2, 10) < 94) status = 'Hypoxia Alert';

    const newVit = {
      id: `VIT-${Date.now().toString().slice(-4)}`,
      patientId: p.id,
      opId: p.opId,
      name: p.name,
      bp: `${vitalsForm.systolic}/${vitalsForm.diastolic}`,
      systolic: sys,
      diastolic: dia,
      pulse: parseInt(vitalsForm.pulse, 10),
      temp: tempNum,
      spo2: parseInt(vitalsForm.spo2, 10),
      respRate: parseInt(vitalsForm.respRate, 10),
      bloodSugar: parseInt(vitalsForm.bloodSugar, 10),
      recordedAt: 'Just Now',
      nurse: 'Sister Anitha Ravi',
      status
    };

    setVitalsList(prev => [newVit, ...prev]);
    setShowRecordVitalsModal(false);
    toast(`Vitals recorded for ${p.name}: BP ${newVit.bp}, SpO2 ${newVit.spo2}%, Temp ${newVit.temp}°F`, 'success');

    if (status !== 'Stable') {
      setCriticalAlerts(prev => [
        {
          id: `ALT-${Date.now()}`,
          patient: `${p.name} (${p.id})`,
          ward: `${p.ward} (${p.bed})`,
          issue: `Abnormal vitals: ${status} [BP: ${newVit.bp}, Temp: ${newVit.temp}°F]`,
          severity: 'Critical',
          acknowledged: false
        },
        ...prev
      ]);
    }
  }

  // Task toggle handler
  function handleToggleTask(taskId) {
    setTaskList(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
        toast(`Task marked as ${nextStatus}`, 'info');
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  }

  // Doctor order completion toggle
  function handleToggleDoctorOrder(orderId) {
    setDoctorOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const next = !o.completed;
        toast(`Order ${o.id} marked as ${next ? 'executed' : 'pending'}`, 'info');
        return { ...o, completed: next };
      }
      return o;
    }));
  }

  // Add Nursing Note submit
  function handleAddNoteSubmit(e) {
    e.preventDefault();
    if (!newNoteForm.note.trim()) {
      toast('Please write note text', 'error');
      return;
    }
    const pt = PATIENT_DATABASE.find(p => p.id === newNoteForm.patientId) || selectedPatient;
    const newEntry = {
      id: `NTE-${Date.now().toString().slice(-4)}`,
      patient: `${pt.name} (${pt.id})`,
      opId: pt.opId,
      category: newNoteForm.category,
      note: newNoteForm.note,
      time: 'Just Now',
      nurse: 'Sister Anitha Ravi'
    };

    setNursingNotes(prev => [newEntry, ...prev]);
    setShowAddNoteModal(false);
    setNewNoteForm(prev => ({ ...prev, note: '' }));
    toast('Nursing observation logged to clinical record', 'success');
  }

  // Acknowledge alert
  function handleAcknowledgeAlert(alertId) {
    setCriticalAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return { ...a, acknowledged: true };
      }
      return a;
    }));
    toast('Alert acknowledged. Escalation logged in audit record.', 'success');
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
      {/* ── 1. Top Header ───────────────────────────────────────────── */}
      <div className="dashboard-header" style={{ marginBottom: 16 }}>
        <div>
          <div className="dashboard-title">👩‍⚕️ Inpatient Nursing & Clinical Care Operations</div>
          <div className="dashboard-subtitle">Sister Anitha Ravi, RN · Inpatient Ward Station B · Salem District Hospital</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowRecordVitalsModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Activity size={14} /> Record Vitals
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              if (!selectedPatient) {
                toast('Please identify and select a patient first', 'error');
                return;
              }
              setShowAddMedModal(true);
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={14} /> Add Medication
          </button>
        </div>
      </div>

      {/* ── 2. STAT Critical Patient Alerts Banner ───────────────────── */}
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
                    {alert.patient} — <span style={{ fontWeight: 600 }}>{alert.ward}</span>
                  </div>
                  <div style={{ fontSize: 12, color: alert.acknowledged ? '#64748B' : '#7F1D1D', marginTop: 2 }}>
                    ⚠️ {alert.issue}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {!alert.acknowledged ? (
                  <>
                    <button
                      className="btn btn-primary btn-xs"
                      onClick={() => handleAcknowledgeAlert(alert.id)}
                      style={{ background: '#DC2626', borderColor: '#DC2626' }}
                    >
                      Acknowledge Alert
                    </button>
                    <button
                      className="btn btn-secondary btn-xs"
                      onClick={() => toast(`Emergency STAT page sent to on-call physician for ${alert.patient}`, 'success')}
                    >
                      Notify Doctor
                    </button>
                  </>
                ) : (
                  <span style={{ fontSize: 11, color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={13} /> Acknowledged by Nurse
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
            <div>
              <div className="stat-value" style={{ margin: '6px 0 2px' }}>{c.value}</div>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>{c.subtext}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 4. Nurse Operations Navigation Tabs ─────────────────────── */}
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
          { id: 'medications', label: 'Medication Administration', icon: Pill },
          { id: 'vitals', label: 'Patient Vitals & Trends', icon: Activity, count: vitalsList.length },
          { id: 'beds', label: 'Ward & Bed Allocation', icon: Bed, count: `${occupiedBeds}/${beds.length}` },
          { id: 'tasks', label: 'Doctor Orders & Nursing Tasks', icon: ClipboardList, count: pendingTasks },
          { id: 'notes', label: 'Clinical Nursing Notes', icon: FileText, count: nursingNotes.length },
          { id: 'handover', label: 'Shift Coordination & Handover', icon: ArrowRightLeft },
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
                    background: isActive ? 'rgba(255,255,255,0.2)' : '#F1F5F9',
                    color: isActive ? '#FFFFFF' : '#475569'
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── 5. TAB 1: MEDICATION ADMINISTRATION ─────────────────────── */}
      {activeTab === 'medications' && (
        <div style={{ display: 'grid', gap: 16 }}>
          {/* Patient Identification Card */}
          <div
            className="card"
            style={{
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

            {/* Patient Details Banner */}
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

          {/* All Patients Directory */}
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
        </div>
      )}

      {/* ── 6. TAB 2: PATIENT VITALS & TRENDS ──────────────────────── */}
      {activeTab === 'vitals' && (
        <div style={{ display: 'grid', gap: 16 }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Activity size={18} color="#0EA5E9" />
                  <span>Ward Patient Vitals & Observation Log</span>
                </div>
                <div style={{ fontSize: 12, color: '#64748B' }}>
                  Real-time recording of blood pressure, heart rate, SpO2, body temperature, and glucose
                </div>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowRecordVitalsModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Plus size={14} /> Record New Vitals
              </button>
            </div>

            <div className="table-container">
              <table className="table" style={{ width: '100%', fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569', fontSize: 11, textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 14px' }}>Patient</th>
                    <th style={{ padding: '12px 14px' }}>BP (mmHg)</th>
                    <th style={{ padding: '12px 14px' }}>Pulse</th>
                    <th style={{ padding: '12px 14px' }}>SpO2</th>
                    <th style={{ padding: '12px 14px' }}>Temp (°F)</th>
                    <th style={{ padding: '12px 14px' }}>Resp Rate</th>
                    <th style={{ padding: '12px 14px' }}>Blood Sugar</th>
                    <th style={{ padding: '12px 14px' }}>Recorded At</th>
                    <th style={{ padding: '12px 14px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vitalsList.map(v => (
                    <tr key={v.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{v.name}</div>
                        <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>{v.opId} · {v.patientId}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontWeight: 700, color: (v.systolic >= 140 || v.diastolic >= 90) ? '#DC2626' : '#0F172A' }}>
                          {v.bp}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#334155' }}>{v.pulse} bpm</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontWeight: 700, color: v.spo2 < 95 ? '#DC2626' : '#15803D' }}>
                          {v.spo2}%
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ color: v.temp >= 100.4 ? '#DC2626' : '#334155', fontWeight: v.temp >= 100.4 ? 700 : 500 }}>
                          {v.temp}°F
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#334155' }}>{v.respRate}/min</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontWeight: 700, color: v.bloodSugar > 140 ? '#D97706' : '#334155' }}>
                          {v.bloodSugar} mg/dL
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 11.5, color: '#64748B' }}>
                        {v.recordedAt}
                        <div style={{ fontSize: 10.5, color: '#94A3B8' }}>{v.nurse}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className={`badge ${v.status.includes('Critical') ? 'badge-danger' : v.status.includes('Warning') ? 'badge-warning' : 'badge-success'}`}>
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. TAB 3: WARD & BED ALLOCATION ────────────────────────── */}
      {activeTab === 'beds' && (
        <div style={{ display: 'grid', gap: 16 }}>
          {/* Bed status summary strip */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div className="card" style={{ flex: 1, minWidth: 200, padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Capacity</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>{beds.length} Beds</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>Across 4 active clinical wings</div>
            </div>
            <div className="card" style={{ flex: 1, minWidth: 200, padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Occupied Beds</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0EA5E9', marginTop: 4 }}>{occupiedBeds} Beds</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>{Math.round((occupiedBeds/beds.length)*100)}% ward occupancy</div>
            </div>
            <div className="card" style={{ flex: 1, minWidth: 200, padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Immediately Available</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#10B981', marginTop: 4 }}>{beds.filter(b => b.status === 'Available').length} Beds</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>Ready for emergency admissions</div>
            </div>
          </div>

          {/* Interactive Bed Map */}
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
              Inpatient Bed Board & Ward Allocation
            </div>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 16 }}>
              Live occupancy and bed assignment grid for Salem District Hospital
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {beds.map(bed => {
                const isOcc = bed.status === 'Occupied';
                const isAvail = bed.status === 'Available';
                return (
                  <div
                    key={bed.id}
                    style={{
                      borderRadius: 10,
                      border: isOcc ? '1.5px solid #BAE6FD' : isAvail ? '1.5px solid #BBF7D0' : '1.5px solid #FED7AA',
                      background: isOcc ? '#F0F9FF' : isAvail ? '#F0FDF4' : '#FFF7ED',
                      padding: 14,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: 120
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>
                          Bed {bed.id}
                        </span>
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: isOcc ? '#E0F2FE' : isAvail ? '#DCFCE7' : '#FFEDD5',
                            color: isOcc ? '#0284C7' : isAvail ? '#15803D' : '#C2410C'
                          }}
                        >
                          {bed.status}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{bed.ward} · {bed.type}</div>

                      {bed.patient ? (
                        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #BAE6FD' }}>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0C4A6E' }}>{bed.patient.name}</div>
                          <div style={{ fontSize: 10.5, color: '#0284C7' }}>{bed.patient.opId} · {bed.patient.diagnosis}</div>
                        </div>
                      ) : (
                        <div style={{ marginTop: 8, fontSize: 11, color: '#94A3B8', fontStyle: 'italic' }}>
                          {isAvail ? 'Ready for assignment' : 'Sanitization in progress'}
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: 10, textAlign: 'right' }}>
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() => {
                          setSelectedBedToTransfer(bed);
                          setShowBedTransferModal(true);
                        }}
                        style={{ fontSize: 11 }}
                      >
                        <ArrowRightLeft size={12} /> Manage Bed
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── 8. TAB 4: DOCTOR ORDERS & NURSING TASKS ─────────────────── */}
      {activeTab === 'tasks' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
          {/* Nursing Shift Tasks */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>Nursing Shift Tasks Checklist</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>Assigned clinical procedures and bedside care</div>
              </div>
              <span className="badge badge-info">{pendingTasks} Pending</span>
            </div>

            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {taskList.map(t => {
                const isDone = t.status === 'Completed';
                return (
                  <div
                    key={t.id}
                    onClick={() => handleToggleTask(t.id)}
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      border: isDone ? '1px solid #E2E8F0' : '1px solid #CBD5E1',
                      background: isDone ? '#F8FAFC' : '#FFFFFF',
                      opacity: isDone ? 0.7 : 1,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12
                    }}
                  >
                    <div style={{ marginTop: 2 }}>
                      {isDone ? <CheckSquare size={18} color="#10B981" /> : <Square size={18} color="#94A3B8" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isDone ? '#64748B' : '#0F172A', textDecoration: isDone ? 'line-through' : 'none' }}>
                        {t.task}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                        {t.patient} · <Clock size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> {t.time}
                      </div>
                    </div>
                    <span className={`badge ${t.priority === 'Urgent' ? 'badge-danger' : t.priority === 'High' ? 'badge-warning' : 'badge-muted'}`}>
                      {t.priority}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Doctor Orders Execution */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>Doctor Orders & Active Directives</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>Physician instructions for inpatient care</div>
              </div>
              <span className="badge badge-primary">{doctorOrders.length} Directives</span>
            </div>

            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {doctorOrders.map(order => (
                <div
                  key={order.id}
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    background: order.completed ? '#F8FAFC' : order.urgent ? '#FEF2F2' : '#F0F9FF',
                    border: order.completed ? '1px solid #E2E8F0' : order.urgent ? '1px solid #FECACA' : '1px solid #BAE6FD',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                      {order.patient}
                    </div>
                    {order.urgent && <span className="badge badge-danger">STAT Directive</span>}
                  </div>
                  <div style={{ fontSize: 12, color: '#334155', fontWeight: 500 }}>
                    {order.order}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, paddingTop: 6, borderTop: '1px dashed #CBD5E1' }}>
                    <span style={{ fontSize: 11, color: '#64748B' }}>{order.doctor} · {order.time}</span>
                    <button
                      className={`btn btn-xs ${order.completed ? 'btn-ghost' : 'btn-primary'}`}
                      onClick={() => handleToggleDoctorOrder(order.id)}
                    >
                      {order.completed ? '✓ Completed' : 'Mark Executed'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 9. TAB 5: CLINICAL NURSING NOTES ───────────────────────── */}
      {activeTab === 'notes' && (
        <div style={{ display: 'grid', gap: 16 }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>Inpatient Nursing Shift Notes</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>Forensic clinical shift entries, patient observations, and event logging</div>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowAddNoteModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Plus size={14} /> Add Clinical Note
              </button>
            </div>

            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {nursingNotes.map(n => (
                <div key={n.id} style={{ padding: 14, borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 13.5 }}>{n.patient}</span>
                      <span className="badge badge-info">{n.category}</span>
                    </div>
                    <span style={{ fontSize: 11, color: '#64748B' }}>{n.time}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.5 }}>
                    {n.note}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileCheck size={12} color="#10B981" />
                    <span>Logged by: <strong>{n.nurse}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 10. TAB 6: SHIFT COORDINATION & HANDOVER ───────────────── */}
      {activeTab === 'handover' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
          <div className="card">
            <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
              Shift Handover Protocol (Morning → Evening)
            </div>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 16 }}>
              Transfer of clinical responsibility for Ward B & C
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5 }}>
              <div style={{ padding: 10, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ color: '#64748B', fontSize: 11 }}>Outgoing Staff:</div>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>Sister Anitha Ravi (Morning Shift 07:00 – 15:00)</div>
              </div>
              <div style={{ padding: 10, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ color: '#64748B', fontSize: 11 }}>Incoming Staff:</div>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>Sister Deepa Mary (Evening Shift 15:00 – 23:00)</div>
              </div>

              <div style={{ marginTop: 8 }}>
                <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>Clinical Handover Checklist:</div>
                {[
                  'All morning scheduled medications administered and charted',
                  'Febrile patient Sindhu Iyer (PAT014) repeat platelet drawn',
                  'Controlled substances safe inventory verified & signed',
                  'Pending blood transfusion request for Bed I-15 noted',
                  'Critical lab results notified to Dr. Priya Sharma'
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', color: '#334155' }}>
                    <CheckCircle2 size={14} color="#10B981" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <button
                className="btn btn-primary"
                onClick={() => toast('Shift Handover Dossier signed and archived into hospital log', 'success')}
                style={{ marginTop: 14 }}
              >
                Sign Off & Transfer Shift Responsibility
              </button>
            </div>
          </div>

          <div className="card">
            <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
              Active Ward Census & High-Risk Watchlist
            </div>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 14 }}>
              Key patients requiring intensive bedside monitoring during evening shift
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PATIENT_DATABASE.slice(0, 3).map(p => (
                <div key={p.id} style={{ padding: 10, borderRadius: 8, background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#0C4A6E' }}>{p.name}</span>
                    <span className="badge badge-primary">{p.bed}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#0369A1', marginTop: 2 }}>{p.diagnosis}</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>Attending: {p.doctor}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 11. MODAL: RECORD VITALS ───────────────────────────────── */}
      {showRecordVitalsModal && (
        <div className="modal-overlay" onClick={() => setShowRecordVitalsModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0 }}>Record Patient Vital Signs</h3>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  Log bedside physiological measurements
                </div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowRecordVitalsModal(false)}>✕</button>
            </div>

            <form onSubmit={handleRecordVitalsSubmit}>
              <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Select Inpatient *</label>
                    <select
                      className="form-select"
                      value={vitalsForm.patientId}
                      onChange={e => setVitalsForm({ ...vitalsForm, patientId: e.target.value })}
                    >
                      {PATIENT_DATABASE.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.opId}) — {p.ward} ({p.bed})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="form-group">
                      <label className="form-label">Systolic BP (mmHg) *</label>
                      <input
                        type="number"
                        className="form-input"
                        required
                        value={vitalsForm.systolic}
                        onChange={e => setVitalsForm({ ...vitalsForm, systolic: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Diastolic BP (mmHg) *</label>
                      <input
                        type="number"
                        className="form-input"
                        required
                        value={vitalsForm.diastolic}
                        onChange={e => setVitalsForm({ ...vitalsForm, diastolic: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="form-group">
                      <label className="form-label">Pulse (bpm) *</label>
                      <input
                        type="number"
                        className="form-input"
                        required
                        value={vitalsForm.pulse}
                        onChange={e => setVitalsForm({ ...vitalsForm, pulse: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">SpO2 (%) *</label>
                      <input
                        type="number"
                        className="form-input"
                        required
                        value={vitalsForm.spo2}
                        onChange={e => setVitalsForm({ ...vitalsForm, spo2: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="form-group">
                      <label className="form-label">Temperature (°F) *</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-input"
                        required
                        value={vitalsForm.temp}
                        onChange={e => setVitalsForm({ ...vitalsForm, temp: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Blood Glucose (mg/dL)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={vitalsForm.bloodSugar}
                        onChange={e => setVitalsForm({ ...vitalsForm, bloodSugar: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bedside Observations</label>
                    <textarea
                      className="form-input"
                      rows={2}
                      value={vitalsForm.notes}
                      onChange={e => setVitalsForm({ ...vitalsForm, notes: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowRecordVitalsModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Vitals Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 12. MODAL: ADD CLINICAL NOTE ───────────────────────────── */}
      {showAddNoteModal && (
        <div className="modal-overlay" onClick={() => setShowAddNoteModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0 }}>Add Clinical Nursing Note</h3>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  Log nursing observation to patient EHR
                </div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAddNoteModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddNoteSubmit}>
              <div className="modal-body">
                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label className="form-label">Patient *</label>
                  <select
                    className="form-select"
                    value={newNoteForm.patientId}
                    onChange={e => setNewNoteForm({ ...newNoteForm, patientId: e.target.value })}
                  >
                    {PATIENT_DATABASE.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.opId})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label className="form-label">Note Category *</label>
                  <select
                    className="form-select"
                    value={newNoteForm.category}
                    onChange={e => setNewNoteForm({ ...newNoteForm, category: e.target.value })}
                  >
                    <option>Observation</option>
                    <option>Clinical Alert</option>
                    <option>Medication Response</option>
                    <option>Wound Care</option>
                    <option>Doctor Handover</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Note Content *</label>
                  <textarea
                    className="form-input"
                    rows={4}
                    required
                    placeholder="Enter detailed clinical observation..."
                    value={newNoteForm.note}
                    onChange={e => setNewNoteForm({ ...newNoteForm, note: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddNoteModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 13. MODAL: MANAGE BED / TRANSFER ───────────────────────── */}
      {showBedTransferModal && selectedBedToTransfer && (
        <div className="modal-overlay" onClick={() => setShowBedTransferModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0 }}>Manage Bed {selectedBedToTransfer.id}</h3>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  {selectedBedToTransfer.ward} ({selectedBedToTransfer.status})
                </div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowBedTransferModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div style={{ padding: 12, background: '#F8FAFC', borderRadius: 8, marginBottom: 12, fontSize: 12 }}>
                <div><strong>Current Bed Status:</strong> {selectedBedToTransfer.status}</div>
                <div><strong>Current Patient:</strong> {selectedBedToTransfer.patient ? selectedBedToTransfer.patient.name : 'None (Vacant)'}</div>
              </div>

              <div className="form-group">
                <label className="form-label">Change Bed State</label>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setBeds(prev => prev.map(b => b.id === selectedBedToTransfer.id ? { ...b, status: 'Available', patient: null } : b));
                      setShowBedTransferModal(false);
                      toast(`Bed ${selectedBedToTransfer.id} marked as Available`, 'success');
                    }}
                  >
                    Mark Available
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setBeds(prev => prev.map(b => b.id === selectedBedToTransfer.id ? { ...b, status: 'Cleaning' } : b));
                      setShowBedTransferModal(false);
                      toast(`Bed ${selectedBedToTransfer.id} marked for Cleaning`, 'info');
                    }}
                  >
                    Send to Cleaning
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={() => setShowBedTransferModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 14. MODAL: ADD MEDICATION (Preserved) ───────────────────── */}
      {showAddMedModal && selectedPatient && (
        <div className="modal-overlay" onClick={() => setShowAddMedModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 580 }}>
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

      {/* ── 15. MODAL: UPDATE MEDICATION (Preserved) ────────────────── */}
      {showUpdateMedModal && editingMed && selectedPatient && (
        <div className="modal-overlay" onClick={() => setShowUpdateMedModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
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
