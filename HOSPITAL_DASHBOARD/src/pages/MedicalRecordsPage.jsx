import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FileText, Search, Download, Eye, Upload, FolderOpen, ClipboardList, Clock, CheckCircle } from 'lucide-react';
import { PATIENTS } from '../data/mockData';
import { useToast } from '../components/Toast';

// ── Clinical history records (for /history route)
const HISTORY_RECORDS = [
  { id: 'HR001', date: '2026-09-04', facility: 'CareConnect District Hospital', type: 'Consultation',   doctor: 'Dr. Priya Sharma',  patient: 'Ravi Kumar',    patientId: 'PAT001', diagnosis: 'Hypertension, T2DM Review',         treatment: 'Metformin adjusted to 1g BD, BP monitoring', notes: 'BP 148/94. HbA1c 7.2%. Advised low-sodium diet.' },
  { id: 'HR002', date: '2026-09-01', facility: 'CareConnect District Hospital', type: 'Lab Report',     doctor: 'Dr. Priya Sharma',  patient: 'Meena Devi',    patientId: 'PAT002', diagnosis: 'Ante-natal — CBC Results',           treatment: 'Iron supplements, dietary advice', notes: 'Hb 9.8g/dL. Fe deficiency anemia. FeSO4 200mg TDS.' },
  { id: 'HR003', date: '2026-08-28', facility: 'CareConnect District Hospital', type: 'Consultation',   doctor: 'Dr. Suresh Iyer',   patient: 'Arun Prakash',  patientId: 'PAT003', diagnosis: 'Appendicitis — Post-op Review',      treatment: 'Wound care, physiotherapy', notes: 'Post-appendectomy day 3. Wound healing well.' },
  { id: 'HR004', date: '2026-08-25', facility: 'CareConnect District Hospital', type: 'Surgery Record', doctor: 'Dr. Arun Raj',      patient: 'Saritha Menon', patientId: 'PAT010', diagnosis: 'Laparoscopic Cholecystectomy',        treatment: 'Procedure completed without complications', notes: 'Op time 45 min. Blood loss minimal.' },
  { id: 'HR005', date: '2026-08-20', facility: 'CareConnect District Hospital', type: 'Consultation',   doctor: 'Dr. Ritu Singh',    patient: 'Suresh Kumar',  patientId: 'PAT005', diagnosis: 'Stroke — Rehabilitation Review',     treatment: 'Physiotherapy 3x/week, Clopidogrel continued', notes: 'Motor power improving. NIHSS score 6 → 4.' },
  { id: 'HR006', date: '2026-08-18', facility: 'CareConnect District Hospital', type: 'Lab Report',     doctor: 'Dr. Suresh Iyer',   patient: 'Deepak Sharma', patientId: 'PAT013', diagnosis: 'Angina — ECG + Echo Result',         treatment: 'Isosorbide adjusted, Cardiac rehab initiated', notes: 'EF 45%. Mild LV dysfunction. Cardiology follow-up monthly.' },
  { id: 'HR007', date: '2026-08-15', facility: 'CareConnect District Hospital', type: 'Emergency Note', doctor: 'Dr. Vijay Kumar',   patient: 'Vijay Raj',     patientId: 'PAT011', diagnosis: 'RTA Polytrauma — ER Admission',      treatment: 'IV fluids, FAST scan, trauma protocol', notes: 'GCS 12. BP 90/60 on arrival. Stabilised post-resus.' },
  { id: 'HR008', date: '2026-08-10', facility: 'CareConnect District Hospital', type: 'Consultation',   doctor: 'Dr. Kavitha Menon', patient: 'Arjun Menon',   patientId: 'PAT019', diagnosis: 'Asthma — Acute Exacerbation',        treatment: 'Nebulisation, IV hydrocortisone, O2 therapy', notes: 'PEFR improved 60% → 82% post-treatment.' },
];

// ── Scanned documents (for /documents route)
const DOCUMENTS = [
  { id: 'DOC001', name: 'Ravi Kumar — Discharge Summary (Sep-05)',     patient: 'Ravi Kumar',    patientId: 'PAT001', type: 'Discharge Summary', size: '284 KB', format: 'PDF', uploaded: '2026-09-05', uploadedBy: 'Dr. Priya Sharma',  status: 'Verified' },
  { id: 'DOC002', name: 'Kavitha Raj — ECG Report',                   patient: 'Kavitha Raj',   patientId: 'PAT004', type: 'Lab Report',        size: '128 KB', format: 'PDF', uploaded: '2026-09-05', uploadedBy: 'Lab Technician',    status: 'Verified' },
  { id: 'DOC003', name: 'Bala Subramanian — CT Head Scan',            patient: 'Bala Subramanian', patientId:'PAT015', type: 'Radiology',       size: '4.2 MB', format: 'DICOM',uploaded: '2026-09-05', uploadedBy: 'Dr. Ritu Singh',    status: 'Pending Review' },
  { id: 'DOC004', name: 'Arun Prakash — Op Notes & Consent Forms',    patient: 'Arun Prakash',  patientId: 'PAT003', type: 'Surgical Record',   size: '512 KB', format: 'PDF', uploaded: '2026-09-04', uploadedBy: 'Dr. Arun Raj',      status: 'Verified' },
  { id: 'DOC005', name: 'Meena Devi — Ante-natal Card Scan',          patient: 'Meena Devi',    patientId: 'PAT002', type: 'Ante-natal Record', size: '1.1 MB', format: 'JPG', uploaded: '2026-09-04', uploadedBy: 'Dr. Sunita Rao',    status: 'Verified' },
  { id: 'DOC006', name: 'Vijay Raj — Insurance Authorisation Letter', patient: 'Vijay Raj',     patientId: 'PAT011', type: 'Insurance',         size: '96 KB',  format: 'PDF', uploaded: '2026-09-05', uploadedBy: 'Billing Staff',     status: 'Pending Review' },
  { id: 'DOC007', name: 'Suresh Kumar — MRI Brain Report',            patient: 'Suresh Kumar',  patientId: 'PAT005', type: 'Radiology',         size: '3.8 MB', format: 'DICOM',uploaded: '2026-09-03', uploadedBy: 'Dr. Ritu Singh',    status: 'Verified' },
  { id: 'DOC008', name: 'Deepak Sharma — Echo Cardiogram Report',     patient: 'Deepak Sharma', patientId: 'PAT013', type: 'Lab Report',        size: '256 KB', format: 'PDF', uploaded: '2026-09-02', uploadedBy: 'Dr. Suresh Iyer',   status: 'Verified' },
];

// ── Record access/requests
const RECORD_REQUESTS = [
  { id: 'RQ001', requestedBy: 'Dr. Priya Sharma', for: 'Ravi Kumar',    patientId: 'PAT001', purpose: 'Follow-up consultation', requestDate: '2026-09-05', status: 'Fulfilled' },
  { id: 'RQ002', requestedBy: 'Insurance Team',   for: 'Kavitha Raj',   patientId: 'PAT004', purpose: 'Insurance claim support', requestDate: '2026-09-05', status: 'Pending' },
  { id: 'RQ003', requestedBy: 'Dr. Vijay Kumar',  for: 'Vijay Raj',     patientId: 'PAT011', purpose: 'Emergency care protocol', requestDate: '2026-09-05', status: 'Fulfilled' },
  { id: 'RQ004', requestedBy: 'Patient (Self)',    for: 'Arun Prakash',  patientId: 'PAT003', purpose: 'Personal copy request',   requestDate: '2026-09-04', status: 'Pending' },
];

const typeColors = {
  'Discharge Summary': '#0EA5E9',
  'Lab Report':        '#8B5CF6',
  'Radiology':         '#F59E0B',
  'Surgical Record':   '#EF4444',
  'Ante-natal Record': '#EC4899',
  'Insurance':         '#14B8A6',
};

const facilityColors = {
  'CareConnect District Hospital': '#0EA5E9',
  'Rural Hospital':                '#0D9488',
  'PHC':                           '#6366F1',
  'Sub-centre':                    '#F59E0B',
};

const typeIcons = {
  'Consultation':   '🩺',
  'Lab Report':     '🔬',
  'Surgery Record': '🔧',
  'Emergency Note': '🚨',
  'Radiology':      '🩻',
};

export default function MedicalRecordsPage() {
  const toast = useToast();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  const path = location.pathname;
  const isDocuments = path.endsWith('/documents');
  const isHistory   = path.endsWith('/history');
  const isRequests  = path.endsWith('/requests');

  // ── DOCUMENTS VIEW
  if (isDocuments) {
    const filtered = DOCUMENTS.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.patient.toLowerCase().includes(search.toLowerCase()) ||
      d.type.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <div className="page-content page-transition">
        <div className="page-header">
          <div>
            <div className="page-title">Documents Repository</div>
            <div className="page-subtitle">{DOCUMENTS.length} documents · Scanned files and uploaded records</div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button className="btn btn-ghost" onClick={()=>toast('Scanning new document...','info')}><Upload size={15}/> Upload</button>
            <button className="btn btn-primary" onClick={()=>toast('Downloading all documents...','success')}><Download size={15}/> Export All</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-4" style={{ marginBottom:24 }}>
          {[
            { label:'Total Documents', value: DOCUMENTS.length,                                         color:'#0EA5E9', bg:'#E0F2FE' },
            { label:'Verified',        value: DOCUMENTS.filter(d=>d.status==='Verified').length,        color:'#10B981', bg:'#D1FAE5' },
            { label:'Pending Review',  value: DOCUMENTS.filter(d=>d.status==='Pending Review').length,  color:'#F59E0B', bg:'#FEF3C7' },
            { label:'Radiology/DICOM', value: DOCUMENTS.filter(d=>d.format==='DICOM').length,           color:'#6366F1', bg:'#EDE9FE' },
          ].map((s,i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize:28, fontWeight:800, color:s.color, marginBottom:4 }}>{s.value}</div>
              <div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="card" style={{ marginBottom:16, padding:'12px 16px' }}>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <Search size={15} color="var(--text-muted)"/>
            <input style={{ border:'none', outline:'none', flex:1, fontSize:13, fontFamily:'inherit', background:'transparent' }}
              placeholder="Search by patient name or document type..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
        </div>

        {/* Document Cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.map(doc => {
            const tc = typeColors[doc.type] || '#0EA5E9';
            return (
              <div key={doc.id} className="card" style={{ padding:'16px 20px', display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' }}>
                <div style={{ width:44, height:44, borderRadius:12, background:tc+'20', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <FileText size={20} color={tc}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:13, marginBottom:3 }}>{doc.name}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)', display:'flex', gap:14, flexWrap:'wrap' }}>
                    <span>👤 {doc.patient}</span>
                    <span>📅 {doc.uploaded}</span>
                    <span>👤 Uploaded by: {doc.uploadedBy}</span>
                    <span>📦 {doc.size} · {doc.format}</span>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, background:tc+'15', color:tc }}>{doc.type}</span>
                  <span className={`badge ${doc.status==='Verified'?'badge-success':'badge-warning'}`}>{doc.status}</span>
                  <button className="btn btn-ghost btn-sm" onClick={()=>toast(`Opening ${doc.name}...`,'info')}><Eye size={13}/> View</button>
                  <button className="btn btn-primary btn-sm" onClick={()=>toast('Downloading...','success')}><Download size={13}/></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── REQUESTS VIEW
  if (isRequests) {
    return (
      <div className="page-content page-transition">
        <div className="page-header">
          <div>
            <div className="page-title">Record Access Requests</div>
            <div className="page-subtitle">{RECORD_REQUESTS.filter(r=>r.status==='Pending').length} pending · {RECORD_REQUESTS.filter(r=>r.status==='Fulfilled').length} fulfilled</div>
          </div>
        </div>
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div className="table-container">
            <table className="table">
              <thead><tr><th>Request ID</th><th>Requested By</th><th>Patient</th><th>Purpose</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {RECORD_REQUESTS.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontFamily:'monospace', fontSize:11, color:'var(--text-muted)' }}>{r.id}</td>
                    <td style={{ fontWeight:600, fontSize:13 }}>{r.requestedBy}</td>
                    <td style={{ fontSize:13 }}>{r.for}</td>
                    <td style={{ fontSize:12, color:'var(--text-muted)' }}>{r.purpose}</td>
                    <td style={{ fontSize:12 }}>{r.requestDate}</td>
                    <td><span className={`badge ${r.status==='Fulfilled'?'badge-success':'badge-warning'}`}>{r.status}</span></td>
                    <td><div style={{ display:'flex', gap:4 }}>
                      {r.status === 'Pending' && <button className="btn btn-primary btn-sm" onClick={()=>toast('Records shared!','success')}><CheckCircle size={12}/> Fulfill</button>}
                      <button className="btn btn-ghost btn-sm" onClick={()=>toast('Viewing request...','info')}>View</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ── HISTORY VIEW (for /history route) — Clinical notes, consultation records
  if (isHistory) {
    const filtered = HISTORY_RECORDS.filter(r =>
      r.patient.toLowerCase().includes(search.toLowerCase()) ||
      r.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
      r.doctor.toLowerCase().includes(search.toLowerCase())
    );
    const types = ['All', ...new Set(HISTORY_RECORDS.map(r=>r.type))];
    const filteredByType = filtered.filter(r => filterType === 'All' || r.type === filterType);
    return (
      <div className="page-content page-transition">
        <div className="page-header">
          <div>
            <div className="page-title">Medical History</div>
            <div className="page-subtitle">Clinical notes, consultation records and treatment history</div>
          </div>
          <button className="btn btn-primary" onClick={()=>toast('Generating report...','success')}><Download size={16}/> Export Records</button>
        </div>

        {/* Filters */}
        <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
          <div className="search-bar" style={{ flex:1, minWidth:200 }}>
            <Search size={15} color="var(--text-muted)"/>
            <input placeholder="Search patient, diagnosis or doctor..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <div className="filter-tabs">
            {types.map(t => <button key={t} className={`filter-tab ${filterType===t?'active':''}`} onClick={()=>setFilterType(t)}>{t}</button>)}
          </div>
        </div>

        {/* Records */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {filteredByType.map(r => {
            const icon = typeIcons[r.type] || '📋';
            const fc = facilityColors[r.facility] || '#0EA5E9';
            return (
              <div key={r.id} className="card" style={{ padding:'20px', borderLeft:`4px solid ${fc}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10, flexWrap:'wrap', gap:8 }}>
                  <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                    <span style={{ fontSize:24 }}>{icon}</span>
                    <div>
                      <div style={{ fontWeight:800, fontSize:14, color:'var(--text-primary)' }}>{r.patient}</div>
                      <div style={{ fontSize:12, color:'var(--text-muted)' }}>{r.date} · {r.facility} · {r.doctor}</div>
                    </div>
                  </div>
                  <span style={{ fontSize:11, fontWeight:700, padding:'3px 12px', borderRadius:20, background:fc+'15', color:fc }}>{r.type}</span>
                </div>
                <div style={{ background:'var(--bg)', borderRadius:8, padding:'12px 14px', marginBottom:10 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', marginBottom:4 }}>Diagnosis</div>
                  <div style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{r.diagnosis}</div>
                </div>
                <div style={{ marginBottom:10 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', marginBottom:2 }}>Treatment</div>
                  <div style={{ fontSize:13, color:'var(--text-primary)' }}>{r.treatment}</div>
                </div>
                {r.notes && (
                  <div style={{ background:'#FFF7ED', borderRadius:8, padding:'10px 14px', borderLeft:'3px solid #F59E0B' }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'#92400E', marginBottom:2 }}>📝 Clinical Notes</div>
                    <div style={{ fontSize:12, color:'#78350F' }}>{r.notes}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── DEFAULT: General medical records landing (for /records route used by Doctor, Admin etc.)
  const facilityColors2 = {
    'District Hospital': '#0EA5E9',
    'Rural Hospital':    '#0D9488',
    'PHC':               '#6366F1',
    'Sub-centre':        '#F59E0B',
  };
  const simpleRecords = HISTORY_RECORDS;
  const filteredDefault = simpleRecords.filter(r =>
    r.patient.toLowerCase().includes(search.toLowerCase()) ||
    r.diagnosis.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content page-transition">
      <div className="page-header">
        <div>
          <div className="page-title">Unified Digital Health Records</div>
          <div className="page-subtitle">Consolidated records across all facilities</div>
        </div>
        <button className="btn btn-primary" onClick={()=>toast('Generating report...','success')}><Download size={16}/> Export Records</button>
      </div>

      {/* Facility Legend */}
      <div className="card" style={{ marginBottom:20, padding:'14px 20px' }}>
        <div style={{ display:'flex', gap:20, flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ fontSize:13, fontWeight:600, color:'var(--text-secondary)' }}>Records Source:</div>
          {Object.entries(facilityColors2).map(([name, color]) => (
            <div key={name} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:10, height:10, borderRadius:3, background:color }} />
              <span style={{ fontSize:12, color:'var(--text-muted)' }}>{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom:20 }}>
        <div className="search-bar" style={{ maxWidth:400 }}>
          <Search size={15} color="var(--text-muted)" />
          <input placeholder="Search patient or diagnosis..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
      </div>

      {/* Records Table */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Date</th><th>Patient</th><th>Type</th><th>Doctor</th><th>Diagnosis</th><th>Treatment</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredDefault.map(r => {
                const fc = facilityColors2[r.facility] || '#0EA5E9';
                return (
                  <tr key={r.id}>
                    <td style={{ fontSize:12, color:'var(--text-muted)', whiteSpace:'nowrap' }}>{r.date}</td>
                    <td style={{ fontWeight:600, fontSize:13 }}>{r.patient}</td>
                    <td><span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:20, background:fc+'15', color:fc }}>{r.type}</span></td>
                    <td style={{ fontSize:12 }}>{r.doctor}</td>
                    <td style={{ fontSize:12, maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.diagnosis}</td>
                    <td style={{ fontSize:12, color:'var(--text-muted)', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.treatment}</td>
                    <td>
                      <div style={{ display:'flex', gap:4 }}>
                        <button className="btn btn-ghost btn-sm" onClick={()=>toast('Viewing record...','info')}><Eye size={13}/> View</button>
                        <button className="btn btn-primary btn-sm" onClick={()=>toast('Downloading...','success')}><Download size={13}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
