import { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { STATS, EMERGENCY_CASES as INITIAL_EMERGENCY_CASES } from '../../data/mockData';
import {
  Siren, AlertTriangle, Bed, Users, UserCheck, Activity,
  Truck, Heart, Droplets, Clock, Plus, Phone, CheckCircle2,
  X, Filter, Eye, ShieldAlert, ArrowRight, Radio, Stethoscope
} from 'lucide-react';
import { useToast } from '../../components/common/Toast';

// Pre-seeded 108 Ambulance Fleet & Incoming Trauma
const INITIAL_AMBULANCES = [
  { id: 'AMB-108-01', vehicleNo: 'TN-30-G-1108', driver: 'Murugan P.', paramedic: 'Kavitha EMT', location: 'Attur Highway (KM 14)', eta: '8 mins', condition: 'Multiple Trauma (RTA)', patient: 'Unknown Male (~35y)', status: 'Incoming' },
  { id: 'AMB-108-02', vehicleNo: 'TN-30-G-2208', driver: 'Selvam S.', paramedic: 'Ramesh EMT', location: 'Omalur Junction', eta: '14 mins', condition: 'Acute Chest Pain / STEMI', patient: 'Govindaraj (58y)', status: 'Incoming' },
  { id: 'AMB-108-03', vehicleNo: 'TN-30-G-3308', driver: 'Karthik R.', paramedic: 'Divya EMT', location: 'GDH Salem Bay #2', eta: 'On Standby', condition: 'Available', patient: 'None', status: 'Stationed' },
  { id: 'AMB-108-04', vehicleNo: 'TN-30-G-4408', driver: 'Anand V.', paramedic: 'Saravanan EMT', location: 'Sankari Road', eta: 'Returning', condition: 'Post-transfer', patient: 'None', status: 'Available' },
];

// Pre-seeded Blood Bank Emergency Reserves
const INITIAL_BLOOD_STOCK = [
  { type: 'O-', units: 3, status: 'Critical', alert: true }, // Universal donor - critical reserve
  { type: 'O+', units: 14, status: 'Good', alert: false },
  { type: 'A+', units: 11, status: 'Good', alert: false },
  { type: 'A-', units: 4, status: 'Low', alert: true },
  { type: 'B+', units: 18, status: 'Good', alert: false },
  { type: 'B-', units: 5, status: 'Low', alert: true },
  { type: 'AB+', units: 8, status: 'Adequate', alert: false },
  { type: 'AB-', units: 2, status: 'Critical', alert: true },
];

// Pre-seeded Emergency Staff on Active Duty
const EMERGENCY_STAFF_ON_DUTY = [
  { name: 'Dr. Suresh Babu', role: 'Chief Trauma Surgeon', dept: 'General Surgery', contact: '+91 94432 10001', onCall: true },
  { name: 'Dr. Priya Sharma', role: 'Consultant Physician', dept: 'General Medicine', contact: '+91 94432 10002', onCall: true },
  { name: 'Dr. Anand Kumar', role: 'Anesthesiologist & Critical Care', dept: 'ICU / Trauma', contact: '+91 94432 10005', onCall: true },
  { name: 'Sister Anitha Ravi', role: 'ER Nursing In-charge', dept: 'Casualty Ward', contact: '+91 94432 10010', onCall: true },
  { name: 'Arjun Singh', role: 'Emergency Triage Coordinator', dept: 'Emergency Desk', contact: '+91 94432 10015', onCall: true },
];

export default function EmergencyDashboard() {
  const { t } = useLanguage();
  const toast = useToast();
  const s = STATS.emergency;

  const [activeTab, setActiveTab] = useState('cases'); // 'cases' | 'triage' | 'ambulances' | 'blood' | 'staffing'
  const [cases, setCases] = useState(INITIAL_EMERGENCY_CASES);
  const [ambulances, setAmbulances] = useState(INITIAL_AMBULANCES);
  const [bloodStock, setBloodStock] = useState(INITIAL_BLOOD_STOCK);

  // Modals
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showBloodModal, setShowBloodModal] = useState(false);
  const [selectedCaseForTriage, setSelectedCaseForTriage] = useState(null);

  // Rapid Intake Form State
  const [intakeForm, setIntakeForm] = useState({
    patient: '',
    age: '',
    gender: 'Male',
    arrival: '108 Ambulance',
    complaint: '',
    severity: 'Emergent',
    bed: 'ER-Bay 05',
    bp: '120/80',
    spo2: '98%',
    doctor: 'Dr. Suresh Babu'
  });

  // Triage Calculator Form State
  const [triageAssessment, setTriageAssessment] = useState({
    airway: 'Patent',
    breathing: 'Normal',
    circulation: 'Normal Pulse',
    gcs: 15,
    painScore: '4/10',
    calculatedLevel: 'Level 2: Emergent'
  });

  // STAT Blood Requisition State
  const [bloodReq, setBloodReq] = useState({
    bloodGroup: 'O-',
    units: 2,
    patientName: 'Emergency Trauma Patient',
    urgency: 'STAT (Immediate)',
    crossmatch: 'Uncrossmatched (Life-Saving)'
  });

  // KPI Calculations
  const criticalCount = useMemo(() => cases.filter(c => c.severity === 'Critical' || c.severity === 'Resuscitation').length, [cases]);
  const activeCount = useMemo(() => cases.filter(c => c.status === 'Active' || c.status === 'Triaged').length, [cases]);

  // Handle Fast Emergency Patient Registration
  function handleRegisterEmergency(e) {
    e.preventDefault();
    if (!intakeForm.patient || !intakeForm.complaint) {
      toast('Please enter patient name and chief complaint.', 'warning');
      return;
    }

    const newCase = {
      id: `ER-2026-${String(cases.length + 101)}`,
      patient: intakeForm.patient,
      arrival: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      complaint: intakeForm.complaint,
      severity: intakeForm.severity,
      bed: intakeForm.bed,
      bp: intakeForm.bp,
      spo2: intakeForm.spo2,
      doctor: intakeForm.doctor,
      status: 'Active'
    };

    setCases([newCase, ...cases]);
    setShowRegisterModal(false);
    toast(`🚨 Emergency patient ${newCase.patient} registered in ${newCase.bed}!`, 'success');
  }

  // Handle Blood Request
  function handleBloodSubmit(e) {
    e.preventDefault();
    // Reduce units if available
    setBloodStock(prev => prev.map(b => {
      if (b.type === bloodReq.bloodGroup) {
        const remaining = Math.max(0, b.units - Number(bloodReq.units));
        return {
          ...b,
          units: remaining,
          alert: remaining < 5
        };
      }
      return b;
    }));
    setShowBloodModal(false);
    toast(`STAT Blood Requisition sent: ${bloodReq.units} units of ${bloodReq.bloodGroup} allocated!`, 'success');
  }

  return (
    <div className="fade-in" style={{ paddingBottom: 32 }}>
      {/* Emergency Live Trauma Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #991B1B 0%, #DC2626 50%, #EF4444 100%)',
          borderRadius: 14,
          padding: '18px 24px',
          marginBottom: 20,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          boxShadow: '0 4px 18px rgba(220, 38, 38, 0.35)',
          color: '#FFFFFF'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)'
            }}
          >
            <Siren size={24} color="#FFFFFF" className="spin-slow" />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>TRAUMA & EMERGENCY CENTER — LIVE</span>
              <span style={{ fontSize: 10, background: '#FFFFFF', color: '#DC2626', padding: '2px 8px', borderRadius: 4, fontWeight: 900 }}>
                24x7 CASUALTY
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>
              Arjun Singh (EMT Lead) · {criticalCount} Critical Cases Under Resuscitation · Salem District Node #42
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setShowBloodModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.35)',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Droplets size={15} />
            <span>STAT Blood Requisition</span>
          </button>

          <button
            onClick={() => setShowRegisterModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 18px',
              borderRadius: 8,
              background: '#FFFFFF',
              border: 'none',
              color: '#DC2626',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            <Plus size={16} />
            <span>Rapid ER Intake</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card" style={{ borderLeft: '4px solid #DC2626' }}>
          <div className="stat-icon" style={{ background: '#FEE2E2' }}><Siren size={20} color="#DC2626" /></div>
          <div className="stat-label">Active Emergency Cases</div>
          <div className="stat-value" style={{ fontSize: 22, color: '#DC2626' }}>{activeCount}</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #EF4444' }}>
          <div className="stat-icon" style={{ background: '#FEE2E2' }}><Activity size={20} color="#EF4444" /></div>
          <div className="stat-label">Critical Resuscitation (L1)</div>
          <div className="stat-value" style={{ fontSize: 22 }}>{criticalCount}</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #0EA5E9' }}>
          <div className="stat-icon" style={{ background: '#E0F2FE' }}><Truck size={20} color="#0EA5E9" /></div>
          <div className="stat-label">108 Ambulances Inbound</div>
          <div className="stat-value" style={{ fontSize: 22 }}>{ambulances.filter(a => a.status === 'Incoming').length}</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #10B981' }}>
          <div className="stat-icon" style={{ background: '#D1FAE5' }}><Bed size={20} color="#10B981" /></div>
          <div className="stat-label">ER Beds Available</div>
          <div className="stat-value" style={{ fontSize: 22, color: '#16A34A' }}>{s.bedsAvailable || 6} / 16</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #F59E0B' }}>
          <div className="stat-icon" style={{ background: '#FEF3C7' }}><Droplets size={20} color="#F59E0B" /></div>
          <div className="stat-label">O-Negative Units (Universal)</div>
          <div className="stat-value" style={{ fontSize: 22, color: '#D97706' }}>
            {bloodStock.find(b => b.type === 'O-')?.units || 3} Units
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #E2E8F0', marginBottom: 20 }}>
        {[
          { id: 'cases', label: `Active Trauma & ER Cases (${cases.length})` },
          { id: 'ambulances', label: `108 Ambulance Coordination (${ambulances.length})` },
          { id: 'blood', label: 'Emergency Blood Bank Reserves' },
          { id: 'staffing', label: `Trauma Doctors & Staff (${EMERGENCY_STAFF_ON_DUTY.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === tab.id ? '3px solid #DC2626' : '3px solid transparent',
              color: activeTab === tab.id ? '#DC2626' : '#64748B',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: ACTIVE CASES */}
      {activeTab === 'cases' && (
        <div className="card" style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>🚨 Live Casualty Case Tracking & Monitoring</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>Sorted by triage priority (ESI Level 1 to 4)</div>
            </div>
            <button
              onClick={() => setShowRegisterModal(true)}
              style={{ padding: '6px 14px', borderRadius: 8, background: '#DC2626', color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >
              + Add ER Intake
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Patient Name</th>
                  <th>Arrival Time</th>
                  <th>Chief Trauma Complaint</th>
                  <th>Triage Severity</th>
                  <th>ER Bay</th>
                  <th>Blood Pressure</th>
                  <th>SpO₂</th>
                  <th>Doctor In-Charge</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cases.map(e => (
                  <tr key={e.id} style={{ background: e.severity === 'Critical' ? '#FFF5F5' : '#FFFFFF' }}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: '#DC2626' }}>{e.id}</td>
                    <td className="table-patient-name" style={{ fontWeight: 700 }}>{e.patient}</td>
                    <td style={{ color: '#475569', fontSize: 12 }}>{e.arrival.includes(' ') ? e.arrival.split(' ')[1] : e.arrival}</td>
                    <td style={{ color: '#0F172A', fontSize: 12, maxWidth: 200, fontWeight: 500 }}>{e.complaint}</td>
                    <td>
                      <span className={`severity-${(e.severity || 'emergent').toLowerCase()}`}>
                        {e.severity}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#0F172A' }}>{e.bed}</td>
                    <td style={{ fontWeight: 600, fontSize: 12, color: '#334155' }}>{e.bp}</td>
                    <td style={{ fontWeight: 700, fontSize: 12, color: e.spo2 && parseInt(e.spo2) < 92 ? '#DC2626' : '#16A34A' }}>
                      {e.spo2}
                    </td>
                    <td style={{ color: '#0F172A', fontSize: 12 }}>{e.doctor}</td>
                    <td>
                      <span className={`badge ${e.status === 'Active' ? 'badge-danger' : e.status === 'Triaged' ? 'badge-warning' : 'badge-info'}`}>
                        {e.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => {
                            setSelectedCaseForTriage(e);
                          }}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 6,
                            border: '1px solid #CBD5E1',
                            background: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Triage Review
                        </button>
                        <button
                          onClick={() => {
                            toast(`Trauma Code Alert triggered for ${e.patient} in ${e.bed}!`, 'warning');
                          }}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 6,
                            border: 'none',
                            background: '#DC2626',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Code Blue
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

      {/* TAB 2: AMBULANCE COORDINATION */}
      {activeTab === 'ambulances' && (
        <div className="card" style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>🚑 108 Emergency Ambulance Coordination (Salem Fleet)</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>Live telemetry and inbound ETA tracking connecting to GDH Salem trauma bay</div>
            </div>
            <button
              onClick={() => toast('New 108 Ambulance Unit dispatched to Omalur Taluk Hospital.', 'success')}
              style={{ padding: '6px 14px', borderRadius: 8, background: '#0284C7', color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >
              + Dispatch Emergency 108
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vehicle ID</th>
                  <th>Registration No.</th>
                  <th>Current Location</th>
                  <th>Estimated Arrival (ETA)</th>
                  <th>Patient Condition / Mechanism</th>
                  <th>Identified Patient</th>
                  <th>Driver / Paramedic</th>
                  <th>Fleet Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {ambulances.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: '#0284C7' }}>{a.id}</td>
                    <td style={{ fontWeight: 700, color: '#0F172A' }}>{a.vehicleNo}</td>
                    <td style={{ color: '#475569', fontSize: 12 }}>{a.location}</td>
                    <td style={{ fontWeight: 800, color: a.eta.includes('8') ? '#DC2626' : '#D97706', fontSize: 13 }}>
                      ⏱️ {a.eta}
                    </td>
                    <td style={{ color: '#0F172A', fontWeight: 600, fontSize: 12 }}>{a.condition}</td>
                    <td style={{ color: '#334155', fontSize: 12 }}>{a.patient}</td>
                    <td style={{ color: '#64748B', fontSize: 11 }}>{a.driver} / {a.paramedic}</td>
                    <td>
                      <span className={`badge ${a.status === 'Incoming' ? 'badge-danger' : a.status === 'Stationed' ? 'badge-success' : 'badge-info'}`}>
                        {a.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toast(`Bay Reserved for Ambulance ${a.vehicleNo}`, 'success')}
                        style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #CBD5E1', background: '#F8FAFC', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}
                      >
                        Reserve Bay
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BLOOD BANK RESERVES */}
      {activeTab === 'blood' && (
        <div className="card" style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>🩸 GDH Salem Blood Bank Emergency Units</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>Live packed red blood cells (PRBC) and fresh frozen plasma (FFP) units available</div>
            </div>
            <button
              onClick={() => setShowBloodModal(true)}
              style={{ padding: '8px 16px', borderRadius: 8, background: '#DC2626', color: '#fff', border: 'none', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}
            >
              + STAT Blood Requisition
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
            {bloodStock.map((b, i) => (
              <div
                key={i}
                style={{
                  background: b.alert ? '#FFF5F5' : '#F8FAFC',
                  borderRadius: 10,
                  padding: 16,
                  border: b.alert ? '1.5px solid #FCA5A5' : '1px solid #E2E8F0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: b.alert ? '#DC2626' : '#0F172A' }}>{b.type}</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>
                    {b.type === 'O-' ? 'Universal Donor' : 'Packed Red Cells'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: b.alert ? '#DC2626' : '#16A34A' }}>{b.units}</div>
                  <div style={{ fontSize: 10, color: '#64748B' }}>Units in Bank</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#FEF3C7', padding: '12px 16px', borderRadius: 8, border: '1px solid #FCD34D', fontSize: '12px', color: '#92400E', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={16} color="#D97706" />
            <span>
              <strong>Emergency Protocol:</strong> If O-Negative drops below 3 units, automatic STAT notifications trigger to Salem Blood Bank Regional Depot.
            </span>
          </div>
        </div>
      )}

      {/* TAB 4: STAFFING ROSTER */}
      {activeTab === 'staffing' && (
        <div className="card" style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>👨‍⚕️ Emergency & Trauma Active Duty Roster</div>
            <div style={{ fontSize: 12, color: '#64748B' }}>Personnel currently physically stationed or on immediate 5-minute standby</div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Staff Name</th>
                  <th>Specialty / Designation</th>
                  <th>Department / Unit</th>
                  <th>Direct ER Intercom / Mobile</th>
                  <th>Duty Status</th>
                  <th>Emergency Action</th>
                </tr>
              </thead>
              <tbody>
                {EMERGENCY_STAFF_ON_DUTY.map((s_item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700, color: '#0F172A' }}>{s_item.name}</td>
                    <td style={{ color: '#0284C7', fontWeight: 600, fontSize: 12 }}>{s_item.role}</td>
                    <td style={{ color: '#475569', fontSize: 12 }}>{s_item.dept}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#0F172A' }}>{s_item.contact}</td>
                    <td>
                      <span className="badge badge-success">On Active Duty</span>
                    </td>
                    <td>
                      <button
                        onClick={() => toast(`Direct SOS Call placed to ${s_item.name}`, 'warning')}
                        style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#DC2626', color: '#FFFFFF', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <Phone size={11} /> Call SOS
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL: RAPID ER INTAKE ──────────────────────────────── */}
      {showRegisterModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: 16
          }}
        >
          <div style={{ background: '#FFFFFF', borderRadius: 14, maxWidth: 520, width: '100%', padding: 24, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 48px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#DC2626' }}>🚨 Rapid Emergency Patient Registration</div>
              <button onClick={() => setShowRegisterModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRegisterEmergency}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Patient Name (or Unknown Identity)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Unknown Trauma Male / Ravi Kumar"
                    value={intakeForm.patient}
                    onChange={e => setIntakeForm({ ...intakeForm, patient: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Est. Age / Gender
                  </label>
                  <input
                    type="text"
                    placeholder="40 / M"
                    value={intakeForm.age}
                    onChange={e => setIntakeForm({ ...intakeForm, age: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Chief Complaint / Mechanism of Injury
                </label>
                <textarea
                  placeholder="e.g. Motor vehicle collision, blunt chest trauma, severe respiratory distress"
                  value={intakeForm.complaint}
                  onChange={e => setIntakeForm({ ...intakeForm, complaint: e.target.value })}
                  rows={2}
                  required
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Triage Classification
                  </label>
                  <select
                    value={intakeForm.severity}
                    onChange={e => setIntakeForm({ ...intakeForm, severity: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  >
                    <option value="Critical">Level 1: Resuscitation (Critical)</option>
                    <option value="Emergent">Level 2: Emergent</option>
                    <option value="Urgent">Level 3: Urgent</option>
                    <option value="Semi-Urgent">Level 4: Semi-Urgent</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    ER Bed / Bay Assignment
                  </label>
                  <select
                    value={intakeForm.bed}
                    onChange={e => setIntakeForm({ ...intakeForm, bed: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  >
                    <option>ER-Bay 01 (Resus Bay)</option>
                    <option>ER-Bay 02 (Resus Bay)</option>
                    <option>ER-Bay 05 (Trauma Bay)</option>
                    <option>ER-Bay 06 (General Casualty)</option>
                    <option>ER-Bay 08 (Observation)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Initial Blood Pressure (BP)
                  </label>
                  <input
                    type="text"
                    value={intakeForm.bp}
                    onChange={e => setIntakeForm({ ...intakeForm, bp: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Initial SpO₂ Level
                  </label>
                  <input
                    type="text"
                    value={intakeForm.spo2}
                    onChange={e => setIntakeForm({ ...intakeForm, spo2: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer', fontSize: 12 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#DC2626', color: '#fff', fontWeight: 800, cursor: 'pointer', fontSize: 12.5 }}
                >
                  Admit to ER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: STAT BLOOD REQUISITION ───────────────────────── */}
      {showBloodModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: 16
          }}
        >
          <div style={{ background: '#FFFFFF', borderRadius: 14, maxWidth: 440, width: '100%', padding: 24, boxShadow: '0 20px 48px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#DC2626' }}>🩸 STAT Blood Bank Requisition</div>
              <button onClick={() => setShowBloodModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleBloodSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Required Blood Group
                </label>
                <select
                  value={bloodReq.bloodGroup}
                  onChange={e => setBloodReq({ ...bloodReq, bloodGroup: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, fontWeight: 700 }}
                >
                  <option value="O-">O-Negative (Universal Donor / Emergency)</option>
                  <option value="O+">O-Positive</option>
                  <option value="A+">A-Positive</option>
                  <option value="A-">A-Negative</option>
                  <option value="B+">B-Positive</option>
                  <option value="B-">B-Negative</option>
                  <option value="AB+">AB-Positive</option>
                  <option value="AB-">AB-Negative</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Quantity (Units)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={bloodReq.units}
                    onChange={e => setBloodReq({ ...bloodReq, units: Number(e.target.value) })}
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Urgency Level
                  </label>
                  <select
                    value={bloodReq.urgency}
                    onChange={e => setBloodReq({ ...bloodReq, urgency: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  >
                    <option>STAT (Immediate)</option>
                    <option>Within 30 Minutes</option>
                    <option>Routine OR Reserve</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Crossmatch Protocol
                </label>
                <select
                  value={bloodReq.crossmatch}
                  onChange={e => setBloodReq({ ...bloodReq, crossmatch: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                >
                  <option>Uncrossmatched (Life-Saving Emergency)</option>
                  <option>Immediate Spin Crossmatch</option>
                  <option>Complete Serological Compatibility</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowBloodModal(false)}
                  style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer', fontSize: 12 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#DC2626', color: '#fff', fontWeight: 800, cursor: 'pointer', fontSize: 12 }}
                >
                  Confirm Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: TRIAGE ASSESSMENT REVIEW ─────────────────────── */}
      {selectedCaseForTriage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: 16
          }}
        >
          <div style={{ background: '#FFFFFF', borderRadius: 14, maxWidth: 500, width: '100%', padding: 24, boxShadow: '0 20px 48px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#0F172A' }}>Digital Triage Assessment (ESI 5-Level)</div>
              <button onClick={() => setSelectedCaseForTriage(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>{selectedCaseForTriage.patient}</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>{selectedCaseForTriage.complaint} · Assigned: {selectedCaseForTriage.bed}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>Airway & Breathing</label>
                <select
                  value={triageAssessment.airway}
                  onChange={e => setTriageAssessment({ ...triageAssessment, airway: e.target.value })}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12 }}
                >
                  <option>Patent / Clear</option>
                  <option>Threatened</option>
                  <option>Obstructed</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>Glasgow Coma Scale (GCS)</label>
                <select
                  value={triageAssessment.gcs}
                  onChange={e => setTriageAssessment({ ...triageAssessment, gcs: Number(e.target.value) })}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12 }}
                >
                  <option value="15">15 (Alert, fully oriented)</option>
                  <option value="12">12 (Confused, motor response intact)</option>
                  <option value="8">&lt; 8 (Severe coma / Intubate)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>Assigned Triage Classification</label>
              <select
                value={selectedCaseForTriage.severity}
                onChange={e => {
                  const updatedSeverity = e.target.value;
                  setCases(cases.map(c => c.id === selectedCaseForTriage.id ? { ...c, severity: updatedSeverity } : c));
                  setSelectedCaseForTriage({ ...selectedCaseForTriage, severity: updatedSeverity });
                }}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, fontWeight: 700 }}
              >
                <option value="Critical">Level 1: Resuscitation (Immediate threat to life)</option>
                <option value="Emergent">Level 2: Emergent (High risk, acute distress)</option>
                <option value="Urgent">Level 3: Urgent (Stable vitals, requires 2+ resources)</option>
                <option value="Semi-Urgent">Level 4: Semi-Urgent (1 resource needed)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => {
                  toast(`Triage assessment confirmed for ${selectedCaseForTriage.patient}.`, 'success');
                  setSelectedCaseForTriage(null);
                }}
                style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#0EA5E9', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}
              >
                Save Triage Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
