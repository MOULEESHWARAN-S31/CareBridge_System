import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Download, Eye, Upload, Search, FlaskConical, Beaker, CheckCircle, AlertTriangle, Droplets, Package } from 'lucide-react';
import { labTests, MEDICINES } from '../data/mockData';
import { useToast } from '../components/Toast';

const statusColor = { Pending: 'badge-warning', Completed: 'badge-success', 'In Progress': 'badge-info' };
const priorityColor = { Urgent: 'badge-danger', STAT: 'badge-danger', Routine: 'badge-muted' };

function inferCategory(test = '') {
  const t = test.toLowerCase();
  if (t.includes('blood') || t.includes('cbc') || t.includes('haem') || t.includes('hb')) return 'Haematology';
  if (t.includes('sugar') || t.includes('glucose') || t.includes('hba1c')) return 'Blood Sugar';
  if (t.includes('ecg') || t.includes('echo') || t.includes('troponin') || t.includes('bnp')) return 'Cardiology';
  if (t.includes('urine') || t.includes('urinal')) return 'Urine Analysis';
  if (t.includes('x-ray') || t.includes('mri') || t.includes('ct') || t.includes('ultrasound') || t.includes('xray') || t.includes('fast')) return 'Radiology';
  if (t.includes('lipid') || t.includes('abg') || t.includes('eeg') || t.includes('biochem')) return 'Biochemistry';
  return 'Haematology';
}

// ── LAB INVENTORY (medical lab reagents/supplies, distinct from pharmacy)
const LAB_INVENTORY = [
  { id: 'LBI001', name: 'CBC Reagent Kit',          category: 'Haematology',  stock: 14, minStock: 20, unit: 'Kits',    expiry: '2027-03-15', supplier: 'Sysmex India',  status: 'Low Stock' },
  { id: 'LBI002', name: 'Blood Culture Bottles',     category: 'Microbiology', stock: 80, minStock: 30, unit: 'Bottles', expiry: '2027-08-30', supplier: 'BioMerieux',    status: 'Available' },
  { id: 'LBI003', name: 'HbA1c Cartridges',          category: 'Blood Sugar',  stock: 0,  minStock: 25, unit: 'Pcs',    expiry: '2027-01-20', supplier: 'Roche Diagnostics', status: 'Out of Stock' },
  { id: 'LBI004', name: 'Troponin I Test Strips',    category: 'Cardiology',   stock: 35, minStock: 20, unit: 'Strips', expiry: '2026-11-10', supplier: 'Abbott',        status: 'Available' },
  { id: 'LBI005', name: 'Urine Dipstick Strips',     category: 'Urine',        stock: 8,  minStock: 50, unit: 'Boxes',  expiry: '2026-10-31', supplier: 'Uripath',       status: 'Low Stock' },
  { id: 'LBI006', name: 'Glucose Calibration Sol.',  category: 'Blood Sugar',  stock: 22, minStock: 10, unit: 'Vials',  expiry: '2027-05-15', supplier: 'Bio-Rad',       status: 'Available' },
  { id: 'LBI007', name: 'Plain Vacutainer Tubes',    category: 'Collection',   stock: 500, minStock: 200, unit: 'Pcs', expiry: '2028-01-01', supplier: 'BD Diagnostics', status: 'Available' },
  { id: 'LBI008', name: 'EDTA Vacutainer Tubes',     category: 'Collection',   stock: 60, minStock: 200, unit: 'Pcs',  expiry: '2027-12-31', supplier: 'BD Diagnostics', status: 'Low Stock' },
  { id: 'LBI009', name: 'Gram Stain Kit',            category: 'Microbiology', stock: 4,  minStock: 10, unit: 'Kits',  expiry: '2026-09-30', supplier: 'HiMedia',       status: 'Low Stock' },
  { id: 'LBI010', name: 'Lipid Profile Reagent',     category: 'Biochemistry', stock: 18, minStock: 10, unit: 'Sets',  expiry: '2027-04-20', supplier: 'Tulip Diagnostics', status: 'Available' },
];

// ── SAMPLE COLLECTION queue (patients whose samples need to be collected)
const SAMPLE_COLLECTION = [
  { id: 'SC001', patient: 'Kavitha Raj',    patientId: 'PAT004', test: 'Complete Blood Count', type: 'Blood – EDTA',  priority: 'Urgent', collected: false, time: '08:00', nurse: 'NRS002', ward: 'ICU',       collectionTime: null },
  { id: 'SC002', patient: 'Suresh Kumar',   patientId: 'PAT005', test: 'MRI Brain',            type: 'N/A (Imaging)', priority: 'Urgent', collected: false, time: '09:00', nurse: 'NRS012', ward: 'Neurology', collectionTime: null },
  { id: 'SC003', patient: 'Bala Subramanian', patientId: 'PAT015', test: 'CT Scan Head',       type: 'N/A (Imaging)', priority: 'STAT',   collected: false, time: '08:30', nurse: 'NRS002', ward: 'ICU',       collectionTime: null },
  { id: 'SC004', patient: 'Arjun Menon',    patientId: 'PAT019', test: 'Chest X-ray',          type: 'N/A (Imaging)', priority: 'Routine',collected: false, time: '10:00', nurse: 'NRS003', ward: 'Pediatric', collectionTime: null },
  { id: 'SC005', patient: 'Vijay Raj',      patientId: 'PAT011', test: 'FAST Ultrasound',      type: 'N/A (Imaging)', priority: 'STAT',   collected: true,  time: '07:30', nurse: 'NRS004', ward: 'Emergency', collectionTime: '07:35' },
  { id: 'SC006', patient: 'Shankar Rajan',  patientId: 'PAT021', test: 'Troponin I',           type: 'Blood – Plain', priority: 'STAT',   collected: true,  time: '06:00', nurse: 'NRS004', ward: 'Emergency', collectionTime: '06:10' },
  { id: 'SC007', patient: 'Mani Kumar',     patientId: 'PAT023', test: 'BNP, ABG',            type: 'Blood – Arterial', priority: 'Urgent', collected: false, time: '11:00', nurse: 'NRS008', ward: 'Cardiology',collectionTime: null },
  { id: 'SC008', patient: 'Radha Nair',     patientId: 'PAT024', test: 'EEG',                  type: 'N/A (Neuro)',   priority: 'Routine',collected: true,  time: '15:00', nurse: 'NRS012', ward: 'Neurology', collectionTime: '15:05' },
];

// ── CRITICAL RESULTS data
const CRITICAL_RESULTS = [
  { id: 'CR001', patient: 'Shankar Rajan',   patientId: 'PAT021', test: 'Troponin I',     result: '18.6 ng/mL',  normalRange: '< 0.04',  severity: 'CRITICAL', reportedAt: '2026-09-05 06:45', notifiedTo: 'Dr. Vijay Kumar',   notified: true  },
  { id: 'CR002', patient: 'Kavitha Raj',     patientId: 'PAT004', test: 'Potassium (K+)', result: '6.8 mEq/L',   normalRange: '3.5–5.0', severity: 'CRITICAL', reportedAt: '2026-09-05 08:20', notifiedTo: 'Dr. Suresh Iyer',   notified: false },
  { id: 'CR003', patient: 'Bala Subramanian',patientId: 'PAT015', test: 'CT Head Scan',   result: 'Large ICH – Basal ganglia', normalRange: 'Normal',  severity: 'CRITICAL', reportedAt: '2026-09-05 09:10', notifiedTo: 'Dr. Ritu Singh',    notified: true  },
  { id: 'CR004', patient: 'Vijay Raj',       patientId: 'PAT011', test: 'Haemoglobin',    result: '5.2 g/dL',    normalRange: '12–17',   severity: 'CRITICAL', reportedAt: '2026-09-05 07:50', notifiedTo: 'Dr. Vijay Kumar',   notified: true  },
];

// Shared filtered table used by orders and in-progress views
function TestTable({ data, toast, showStart = false, showResult = false }) {
  const [search, setSearch] = useState('');
  const [section, setSection] = useState('All');
  const filtered = data.filter(t => {
    const ms = t.patient.toLowerCase().includes(search.toLowerCase()) || t.test.toLowerCase().includes(search.toLowerCase());
    const mf = section === 'All' || t.status === section;
    return ms && mf;
  });
  return (
    <>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
          <Search size={15} color="var(--text-muted)" />
          <input placeholder="Search tests or patients..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {['All', 'Pending', 'In Progress', 'Completed'].map(s => (
            <button key={s} className={`filter-tab ${section === s ? 'active' : ''}`} onClick={() => setSection(s)}>{s}</button>
          ))}
        </div>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Test ID</th><th>Patient</th><th>Test Name</th><th>Category</th>
                <th>Doctor</th><th>Date</th><th>Priority</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 11, background: 'var(--bg)', padding: '2px 6px', borderRadius: 4, color: 'var(--primary-dark)' }}>{t.id}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="avatar avatar-sm" style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)' }}>{t.patient.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                      <div><div style={{ fontWeight: 600, fontSize: 12 }}>{t.patient}</div><div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.patientId}</div></div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 500, fontSize: 13 }}>{t.test}</td>
                  <td><span className="tag">{inferCategory(t.test)}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.doctor}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.ordered?.split(' ')[0]}</td>
                  <td><span className={`badge ${priorityColor[t.priority]}`}>{t.priority}</span></td>
                  <td><span className={`badge ${statusColor[t.status]}`}>{t.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {t.status === 'Completed' && (
                        <><button className="btn btn-ghost btn-sm" onClick={() => toast('Viewing report...', 'info')}><Eye size={12} /></button>
                          <button className="btn btn-ghost btn-sm" onClick={() => toast('Downloading...', 'success')}><Download size={12} /></button></>
                      )}
                      {t.status === 'Pending' && showStart && (
                        <button className="btn btn-primary btn-sm" onClick={() => toast('Test started!', 'success')}>Start</button>
                      )}
                      {t.status === 'In Progress' && (
                        <button className="btn btn-primary btn-sm" onClick={() => toast('Result entered!', 'success')}>Enter Result</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function DiagnosticsPage() {
  const toast = useToast();
  const location = useLocation();
  const path = location.pathname;

  const isSamples    = path.endsWith('/samples');
  const isInProgress = path.endsWith('/in-progress');
  const isResults    = path.endsWith('/results');
  const isCritical   = path.endsWith('/critical');
  const isInventory  = path.endsWith('/inventory');

  // ── SAMPLE COLLECTION VIEW
  if (isSamples) {
    const pending   = SAMPLE_COLLECTION.filter(s => !s.collected);
    const collected = SAMPLE_COLLECTION.filter(s => s.collected);
    return (
      <div className="page-content page-transition">
        <div className="page-header">
          <div><h1 className="page-title">Sample Collection</h1><div className="page-subtitle">{pending.length} samples pending · {collected.length} collected today</div></div>
          <button className="btn btn-primary" onClick={() => toast('New sample request created.', 'info')}><Plus size={15} /> Add Sample Request</button>
        </div>
        <div className="grid grid-3" style={{ marginBottom: 24 }}>
          {[
            { label: 'Pending Collection', value: pending.length,                                    color: '#F59E0B', bg: '#FEF3C7' },
            { label: 'STAT / Urgent',      value: SAMPLE_COLLECTION.filter(s => s.priority === 'STAT' || s.priority === 'Urgent').length, color: '#EF4444', bg: '#FEE2E2' },
            { label: 'Collected Today',    value: collected.length,                                  color: '#10B981', bg: '#D1FAE5' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container">
            <table className="table">
              <thead><tr><th>ID</th><th>Patient</th><th>Test</th><th>Sample Type</th><th>Ward</th><th>Nurse</th><th>Ordered</th><th>Priority</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {SAMPLE_COLLECTION.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>{s.id}</td>
                    <td><div style={{ fontWeight: 600, fontSize: 13 }}>{s.patient}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.patientId}</div></td>
                    <td style={{ fontSize: 12 }}>{s.test}</td>
                    <td><span className="tag">{s.type}</span></td>
                    <td style={{ fontSize: 12 }}>{s.ward}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.nurse}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.time}</td>
                    <td><span className={`badge ${s.priority === 'STAT' || s.priority === 'Urgent' ? 'badge-danger' : 'badge-muted'}`}>{s.priority}</span></td>
                    <td><span className={`badge ${s.collected ? 'badge-success' : 'badge-warning'}`}>{s.collected ? 'Collected' : 'Pending'}</span></td>
                    <td>
                      {!s.collected
                        ? <button className="btn btn-primary btn-sm" onClick={() => toast(`Sample collected for ${s.patient}!`, 'success')}><Droplets size={12} /> Collect</button>
                        : <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>✓ {s.collectionTime}</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ── TESTS IN PROGRESS VIEW
  if (isInProgress) {
    const inProgress = labTests.filter(t => t.status === 'In Progress');
    return (
      <div className="page-content page-transition">
        <div className="page-header">
          <div><h1 className="page-title">Test in Progress</h1><div className="page-subtitle">{inProgress.length} tests currently being processed</div></div>
        </div>
        <div className="grid grid-3" style={{ marginBottom: 24 }}>
          {[
            { label: 'In Progress',  value: labTests.filter(t => t.status === 'In Progress').length, color: '#3B82F6', bg: '#DBEAFE' },
            { label: 'STAT Orders',  value: labTests.filter(t => t.priority === 'STAT').length,      color: '#EF4444', bg: '#FEE2E2' },
            { label: 'Avg Turn-around', value: '38 min',                                             color: '#8B5CF6', bg: '#EDE9FE' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
        {inProgress.length === 0 ? (
          <div className="card"><div className="empty-state"><div style={{ fontSize: 48 }}>🔬</div><h3>No Tests In Progress</h3><p>All ordered tests are either pending or completed.</p></div></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {inProgress.map(t => (
              <div key={t.id} className="card" style={{ padding: '18px 20px', borderLeft: '4px solid #3B82F6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, fontSize: 14 }}>{t.test}</span>
                      <span className={`badge ${priorityColor[t.priority]}`}>{t.priority}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Patient: {t.patient} ({t.patientId}) · Dr: {t.doctor}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Category: {inferCategory(t.test)} · Ordered: {t.ordered}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ textAlign: 'center', padding: '8px 16px', background: '#DBEAFE', borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: '#1E40AF', fontWeight: 600 }}>IN PROGRESS</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: '#1E40AF', marginTop: 2 }}>⏳</div>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => toast(`Results entered for ${t.patient}!`, 'success')}>Enter Result</button>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                    <span>Processing</span><span>~{t.priority === 'STAT' ? '10' : '30'} min remaining</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--border-light)', borderRadius: 3 }}>
                    <div style={{ width: t.priority === 'STAT' ? '65%' : '40%', height: '100%', background: 'linear-gradient(90deg,#3B82F6,#0EA5E9)', borderRadius: 3 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── RESULTS VIEW (completed tests)
  if (isResults) {
    const completed = labTests.filter(t => t.status === 'Completed');
    return (
      <div className="page-content page-transition">
        <div className="page-header">
          <div><h1 className="page-title">Results Verification</h1><div className="page-subtitle">{completed.length} completed test results ready</div></div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" onClick={() => toast('Uploading result...', 'info')}><Upload size={15} /> Upload Report</button>
            <button className="btn btn-primary" onClick={() => toast('Downloading all results...', 'success')}><Download size={15} /> Export All</button>
          </div>
        </div>
        <div className="grid grid-3" style={{ marginBottom: 24 }}>
          {[
            { label: 'Results Ready',   value: completed.length,                                                 color: '#10B981', bg: '#D1FAE5' },
            { label: 'Abnormal',        value: labTests.filter(t => t.result === 'Abnormal' || t.result === 'CRITICAL').length, color: '#EF4444', bg: '#FEE2E2' },
            { label: 'Normal',          value: labTests.filter(t => t.result === 'Normal').length,               color: '#0EA5E9', bg: '#E0F2FE' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Test ID</th><th>Patient</th><th>Test Name</th><th>Doctor</th><th>Ordered</th><th>Priority</th><th>Result</th><th>Actions</th></tr></thead>
              <tbody>
                {completed.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--primary-dark)', background: 'var(--bg)', padding: '2px 6px', borderRadius: 4 }}>{t.id}</td>
                    <td><div style={{ fontWeight: 600, fontSize: 13 }}>{t.patient}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.patientId}</div></td>
                    <td style={{ fontWeight: 500, fontSize: 13 }}>{t.test}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.doctor}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.ordered?.split(' ')[0]}</td>
                    <td><span className={`badge ${priorityColor[t.priority]}`}>{t.priority}</span></td>
                    <td>
                      <span style={{ fontWeight: 700, fontSize: 13, color: t.result === 'Normal' ? '#10B981' : t.result === 'CRITICAL' ? '#EF4444' : '#F59E0B' }}>
                        {t.result === 'CRITICAL' ? '⚠️ CRITICAL' : t.result === 'Abnormal' ? '⚡ Abnormal' : '✓ Normal'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => toast('Viewing result...', 'info')}><Eye size={12} /> View</button>
                        <button className="btn btn-primary btn-sm" onClick={() => toast('Downloading report...', 'success')}><Download size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ── CRITICAL RESULTS VIEW
  if (isCritical) {
    return (
      <div className="page-content page-transition">
        <div className="page-header">
          <div>
            <h1 className="page-title">Critical Result Callout</h1>
            <div className="page-subtitle">{CRITICAL_RESULTS.filter(r => !r.notified).length} unnotified · Immediate physician contact required</div>
          </div>
          <button className="btn btn-danger" onClick={() => toast('Alert broadcast sent to all attending physicians!', 'info')}><AlertTriangle size={15} /> Broadcast Alert</button>
        </div>

        <div style={{ padding: '14px 18px', background: 'linear-gradient(135deg, #FEE2E2, #FECACA)', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)', marginBottom: 24, display: 'flex', gap: 14, alignItems: 'center' }}>
          <AlertTriangle size={22} color="#EF4444" />
          <div>
            <div style={{ fontWeight: 800, color: '#991B1B', fontSize: 14 }}>Critical values must be verbally communicated to the attending physician within 30 minutes of result.</div>
            <div style={{ fontSize: 12, color: '#B91C1C', marginTop: 2 }}>NABL / CAP standard — document time and name of person notified.</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {CRITICAL_RESULTS.map(r => (
            <div key={r.id} className="card" style={{ padding: '20px', borderLeft: '5px solid #EF4444', background: r.notified ? 'white' : 'linear-gradient(to right,#FFF5F5,white)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 3 }}>{r.patient} <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>({r.patientId})</span></div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Reported: {r.reportedAt} · Notify: {r.notifiedTo}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ padding: '4px 14px', background: '#FEE2E2', color: '#991B1B', fontWeight: 800, fontSize: 12, borderRadius: 20 }}>⚠️ CRITICAL</span>
                  <span className={`badge ${r.notified ? 'badge-success' : 'badge-danger'}`}>{r.notified ? 'Notified' : 'Not Notified'}</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 14 }}>
                {[
                  { label: 'Test', value: r.test },
                  { label: 'Critical Value', value: r.result },
                  { label: 'Normal Range', value: r.normalRange },
                ].map((f, i) => (
                  <div key={i} style={{ background: 'var(--bg)', borderRadius: 8, padding: '10px 14px' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{f.label}</div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: i === 1 ? '#EF4444' : 'var(--text-primary)' }}>{f.value}</div>
                  </div>
                ))}
              </div>
              {!r.notified && (
                <button className="btn btn-danger btn-sm" onClick={() => toast(`Dr. notified of critical result for ${r.patient}!`, 'success')}>
                  <CheckCircle size={13} /> Mark as Notified
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── LAB INVENTORY VIEW
  if (isInventory) {
    const lowStock = LAB_INVENTORY.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock');
    return (
      <div className="page-content page-transition">
        <div className="page-header">
          <div><div className="page-title">Lab Inventory</div><div className="page-subtitle">Laboratory reagents, consumables and supplies</div></div>
          <button className="btn btn-primary" onClick={() => toast('Reorder placed!', 'success')}><Package size={15} /> Place Reorder</button>
        </div>
        <div className="grid grid-4" style={{ marginBottom: 24 }}>
          {[
            { label: 'Total Items',   value: LAB_INVENTORY.length,                                  color: '#0EA5E9', bg: '#E0F2FE' },
            { label: 'Available',     value: LAB_INVENTORY.filter(i => i.status === 'Available').length, color: '#10B981', bg: '#D1FAE5' },
            { label: 'Low Stock',     value: LAB_INVENTORY.filter(i => i.status === 'Low Stock').length, color: '#F59E0B', bg: '#FEF3C7' },
            { label: 'Out of Stock',  value: LAB_INVENTORY.filter(i => i.status === 'Out of Stock').length, color: '#EF4444', bg: '#FEE2E2' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
        {lowStock.length > 0 && (
          <div style={{ padding: '12px 16px', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 'var(--radius-md)', marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
            <AlertTriangle size={16} color="#92400E" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#92400E' }}>{lowStock.length} items require immediate reorder — lab operations may be affected.</span>
          </div>
        )}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container">
            <table className="table">
              <thead><tr><th>ID</th><th>Item Name</th><th>Category</th><th>Current Stock</th><th>Min. Required</th><th>Unit</th><th>Expiry</th><th>Supplier</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {LAB_INVENTORY.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>{item.id}</td>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</td>
                    <td><span className="tag">{item.category}</span></td>
                    <td style={{ fontWeight: 800, color: item.status === 'Out of Stock' ? '#EF4444' : item.status === 'Low Stock' ? '#F59E0B' : '#10B981' }}>{item.stock}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{item.minStock}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.unit}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.expiry}</td>
                    <td style={{ fontSize: 12 }}>{item.supplier}</td>
                    <td><span className={`badge ${item.status === 'Available' ? 'badge-success' : item.status === 'Low Stock' ? 'badge-warning' : 'badge-danger'}`}>{item.status}</span></td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => toast(`Reorder placed for ${item.name}!`, 'success')}>Reorder</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ── DEFAULT / ORDERS VIEW (all test orders)
  return (
    <div className="page-content page-transition">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {path.includes('/lab/dashboard/orders') || path.endsWith('/orders')
              ? 'Test Requests'
              : 'Diagnosis & Laboratory'}
          </h1>
          <div className="page-subtitle">{labTests.length} total test orders</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => toast('Opening upload panel...', 'info')}><Upload size={16} /> Upload Report</button>
          <button className="btn btn-primary" onClick={() => toast('Opening test request form...', 'info')}><Plus size={16} /> Request Test</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Pending Tests', count: labTests.filter(t => t.status === 'Pending').length,     color: '#F59E0B', bg: '#FEF3C7' },
          { label: 'In Progress',   count: labTests.filter(t => t.status === 'In Progress').length,  color: '#3B82F6', bg: '#DBEAFE' },
          { label: 'Completed',     count: labTests.filter(t => t.status === 'Completed').length,    color: '#10B981', bg: '#D1FAE5' },
          { label: 'Urgent / STAT', count: labTests.filter(t => t.priority === 'Urgent' || t.priority === 'STAT').length, color: '#EF4444', bg: '#FEE2E2' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-icon" style={{ background: s.bg }}><FlaskConical size={22} color={s.color} /></div>
            <div className="stat-card-value" style={{ color: s.color }}>{s.count}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>
      <TestTable data={labTests} toast={toast} showStart />
    </div>
  );
}
