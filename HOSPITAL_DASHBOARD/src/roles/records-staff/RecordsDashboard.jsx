import { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { STATS, PATIENTS as INITIAL_PATIENTS } from '../../data/mockData';
import {
  FileText, Archive, ClipboardList, Activity, Upload, Search,
  Eye, CheckCircle2, ShieldCheck, Download, Plus, Filter,
  Clock, Lock, Check, X, AlertTriangle, UserCheck, RefreshCw, FileUp
} from 'lucide-react';
import { useToast } from '../../components/common/Toast';

// Pre-seeded Medical Documents Archive
const INITIAL_DOCUMENTS = [
  { id: 'DOC-1001', patient: 'Ravi Kumar', patientId: 'PAT001', opId: 'TN-OP-10245', category: 'Discharge Summary', title: 'Cardiology Inpatient Discharge Note', file: 'Discharge_Summary_PAT001.pdf', size: '1.4 MB', date: '2026-09-04', uploadedBy: 'Dr. Priya Sharma', confidential: false },
  { id: 'DOC-1002', patient: 'Sindhu Iyer', patientId: 'PAT014', opId: 'TN-OP-10258', category: 'Diagnostic Report', title: 'STAT Platelet Count Smear & Dengue NS1', file: 'Lab_Dengue_PAT014.pdf', size: '640 KB', date: '2026-09-06', uploadedBy: 'Ravi Shankar (Lab)', confidential: false },
  { id: 'DOC-1003', patient: 'Meena Devi', patientId: 'PAT002', opId: 'TN-OP-10246', category: 'Operative Note', title: 'Obstetric Ultrasound Scan (28 Wks)', file: 'USG_Obstetric_PAT002.pdf', size: '2.8 MB', date: '2026-09-05', uploadedBy: 'Dr. Sunita Rao', confidential: false },
  { id: 'DOC-1004', patient: 'Arun Kumar', patientId: 'P1001', opId: 'OP2026001', category: 'Identity & Consent', title: 'Aadhaar ABHA e-KYC Verification Certificate', file: 'ABHA_eKYC_P1001.pdf', size: '420 KB', date: '2026-09-02', uploadedBy: 'Meena Krishnan (Rec)', confidential: true },
];

// Pre-seeded ABDM / FHIR Consent Artifacts
const INITIAL_CONSENTS = [
  { id: 'CONS-901', patient: 'Ravi Kumar', abhaId: '12-3456-7890-1234', purpose: 'Continuity of Care (Referral)', provider: 'Government District Hospital — Salem', validUntil: '2026-10-08', status: 'Granted', hiTypes: ['OPConsultation', 'Prescription', 'DiagnosticReport'] },
  { id: 'CONS-902', patient: 'Meena Devi', abhaId: '23-4567-8901-2001', purpose: 'Ante-natal Clinic Registry', provider: 'PHC Omalur to Salem GDH', validUntil: '2026-12-31', status: 'Granted', hiTypes: ['DischargeSummary', 'OPConsultation'] },
  { id: 'CONS-903', patient: 'Sindhu Iyer', abhaId: '45-6789-0123-3001', purpose: 'Private TPA Cashless Insurance Verification', provider: 'Star Health TPA Desk', validUntil: '2026-09-15', status: 'Active', hiTypes: ['DiagnosticReport', 'Invoice'] },
  { id: 'CONS-904', patient: 'Arun Kumar', abhaId: '12-3456-7890-1001', purpose: 'Third-party Research Study', provider: 'Tamil Nadu Medical Council', validUntil: '2026-09-01', status: 'Revoked', hiTypes: ['DiagnosticReport'] },
];

// Pre-seeded Access Audit History Log
const INITIAL_AUDIT_LOG = [
  { id: 'AUD-8821', timestamp: 'Today, 11:42 AM', user: 'Dr. Priya Sharma', role: 'Doctor', patient: 'Ravi Kumar (PAT001)', action: 'View EHR Records & Prescriptions', reason: 'Routine OPD Consultation' },
  { id: 'AUD-8822', timestamp: 'Today, 11:15 AM', user: 'Sunita Verma', role: 'Billing Staff', patient: 'Sindhu Iyer (PAT014)', action: 'View Diagnostic Billing Details', reason: 'Invoice Generation' },
  { id: 'AUD-8823', timestamp: 'Today, 10:30 AM', user: 'Anitha Ravi', role: 'Nurse', patient: 'Arun Kumar (P1001)', action: 'View Medication Schedule', reason: 'Inpatient Drug Administration' },
  { id: 'AUD-8824', timestamp: 'Today, 09:45 AM', user: 'Lakshmi Nair', role: 'Medical Records', patient: 'Meena Devi (PAT002)', action: 'Archival Document Scan Upload', reason: 'Paper Record Digitization' },
  { id: 'AUD-8825', timestamp: 'Yesterday, 04:20 PM', user: 'Ravi Shankar', role: 'Lab Staff', patient: 'Sindhu Iyer (PAT014)', action: 'Attach Laboratory Report', reason: 'Platelet Smear Upload' },
];

export default function RecordsDashboard() {
  const { t } = useLanguage();
  const toast = useToast();
  const s = STATS.records;

  const [activeTab, setActiveTab] = useState('index'); // 'index' | 'documents' | 'consent' | 'audit'
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [consents, setConsents] = useState(INITIAL_CONSENTS);
  const [auditLog, setAuditLog] = useState(INITIAL_AUDIT_LOG);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  // Modals
  const [viewingPatient, setViewingPatient] = useState(null); // Full digital EHR modal
  const [editingPatient, setEditingPatient] = useState(null); // Update record modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);

  // Upload Form State
  const [uploadForm, setUploadForm] = useState({
    patientName: 'Ravi Kumar',
    patientId: 'PAT001',
    category: 'Discharge Summary',
    title: '',
    fileName: 'Clinical_Scan_Note.pdf',
    confidential: false
  });

  // Edit Form State
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState('Active');

  // Filtered Patients
  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const q = searchQuery.toLowerCase();
      const matchQuery = p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.opId && p.opId.toLowerCase().includes(q)) ||
        (p.diagnosis && p.diagnosis.toLowerCase().includes(q));
      const matchDept = selectedDept === 'All' || p.dept === selectedDept;
      return matchQuery && matchDept;
    });
  }, [patients, searchQuery, selectedDept]);

  // Stat Cards
  const statCards = [
    { label: 'Master Health Records', value: s.totalRecords.toLocaleString(), icon: FileText, color: '#0EA5E9', bg: '#E0F2FE' },
    { label: 'Recently Updated', value: s.recentlyUpdated, icon: Activity, color: '#10B981', bg: '#D1FAE5' },
    { label: 'Digitized Documents', value: documents.length + 120, icon: Upload, color: '#8B5CF6', bg: '#EDE9FE' },
    { label: 'ABDM Consents Active', value: consents.filter(c => c.status === 'Granted' || c.status === 'Active').length, icon: ShieldCheck, color: '#0284C7', bg: '#E0F2FE' },
    { label: 'Audit Accesses Today', value: s.accessedToday || 48, icon: Archive, color: '#F59E0B', bg: '#FEF3C7' },
  ];

  // Open EHR Viewer
  function handleOpenEhr(patient) {
    setViewingPatient(patient);
    // Log this access in audit trail
    const newEntry = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      user: 'Lakshmi Nair',
      role: 'Medical Records Staff',
      patient: `${patient.name} (${patient.id})`,
      action: 'Full Digital Medical Record View',
      reason: 'Records Department Custodian Audit'
    };
    setAuditLog([newEntry, ...auditLog]);
  }

  // Handle Document Upload
  function handleUploadSubmit(e) {
    e.preventDefault();
    if (!uploadForm.title) {
      toast('Please enter a document title.', 'warning');
      return;
    }
    const newDoc = {
      id: `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
      patient: uploadForm.patientName,
      patientId: uploadForm.patientId,
      opId: 'TN-OP-10245',
      category: uploadForm.category,
      title: uploadForm.title,
      file: uploadForm.fileName,
      size: '1.2 MB',
      date: new Date().toISOString().slice(0, 10),
      uploadedBy: 'Lakshmi Nair (Records)',
      confidential: uploadForm.confidential
    };
    setDocuments([newDoc, ...documents]);
    setShowUploadModal(false);
    toast(`Document "${uploadForm.title}" archived successfully!`, 'success');
  }

  // Handle Record Update Submit
  function handleUpdateRecordSubmit(e) {
    e.preventDefault();
    if (!editingPatient) return;
    setPatients(prev => prev.map(p => {
      if (p.id === editingPatient.id) {
        return { ...p, status: editStatus, diagnosis: editNotes || p.diagnosis };
      }
      return p;
    }));
    toast(`Medical Record for ${editingPatient.name} updated.`, 'success');
    setEditingPatient(null);
  }

  return (
    <div className="fade-in" style={{ paddingBottom: 32 }}>
      {/* Header Banner */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          padding: '20px 24px',
          border: '1px solid #E2E8F0',
          marginBottom: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              📋 {t('records.title')} & Digital Health Custody
            </span>
            <span style={{ fontSize: '11px', background: '#E0F2FE', color: '#0284C7', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
              ABDM / FHIR COMPLIANT
            </span>
          </div>
          <div style={{ fontSize: '13px', color: '#64748B', marginTop: 4 }}>
            Lakshmi Nair · Custodian of Medical Records · Government District Hospital — Salem
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setShowConsentModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              color: '#334155',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <ShieldCheck size={15} color="#0EA5E9" />
            <span>Manage ABDM Consent</span>
          </button>

          <button
            onClick={() => setShowUploadModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              background: '#0EA5E9',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(14,165,233,0.3)'
            }}
          >
            <Upload size={15} />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {statCards.map((c, i) => (
          <div key={i} className="stat-card" style={{ borderLeft: `4px solid ${c.color}` }}>
            <div className="stat-icon" style={{ background: c.bg }}><c.icon size={20} color={c.color} /></div>
            <div className="stat-label">{c.label}</div>
            <div className="stat-value" style={{ fontSize: 22 }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #E2E8F0', marginBottom: 20 }}>
        {[
          { id: 'index', label: `Master Patient Index (${filteredPatients.length})` },
          { id: 'documents', label: `Digital Document Archive (${documents.length})` },
          { id: 'consent', label: `ABDM Consent Manager (${consents.length})` },
          { id: 'audit', label: `Access Audit Logs (${auditLog.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === tab.id ? '3px solid #0EA5E9' : '3px solid transparent',
              color: activeTab === tab.id ? '#0284C7' : '#64748B',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: MASTER PATIENT INDEX */}
      {activeTab === 'index' && (
        <div className="card" style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>🔍 Master Patient Index & Digital EHR Records</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>Search by Name, Patient ID, OP Registration, or Medical Diagnosis</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: 10, top: 10 }} />
                <input
                  type="text"
                  placeholder="Search name, OP-ID, disease..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    padding: '7px 12px 7px 32px',
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    fontSize: '12.5px',
                    color: '#0F172A',
                    outline: 'none',
                    width: 240
                  }}
                />
              </div>

              <select
                value={selectedDept}
                onChange={e => setSelectedDept(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  fontSize: '12.5px',
                  color: '#334155',
                  background: '#FFFFFF',
                  outline: 'none'
                }}
              >
                <option value="All">All Departments</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Gynecology">Gynecology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Casualty">Casualty / Emergency</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Age / Sex</th>
                  <th>Department</th>
                  <th>Clinical Diagnosis</th>
                  <th>Hospital Status</th>
                  <th>Last Record Update</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: '#0284C7' }}>{p.id}</td>
                    <td className="table-patient-name" style={{ fontWeight: 700 }}>{p.name}</td>
                    <td style={{ color: '#475569', fontSize: 12 }}>{p.age}y / {p.gender}</td>
                    <td style={{ color: '#0F172A', fontSize: 12, fontWeight: 500 }}>{p.dept}</td>
                    <td style={{ color: '#334155', fontSize: 12, maxWidth: 220 }}>{p.diagnosis}</td>
                    <td>
                      <span className={`badge ${p.status === 'Admitted' ? 'badge-info' : p.status === 'OPD' ? 'badge-success' : p.status === 'Critical' ? 'badge-critical' : p.status === 'Emergency' ? 'badge-danger' : 'badge-grey'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ color: '#64748B', fontSize: 12 }}>2026-09-06</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => handleOpenEhr(p)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 6,
                            border: '1px solid #CBD5E1',
                            background: '#FFFFFF',
                            color: '#0284C7',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          <Eye size={12} /> View EHR
                        </button>

                        <button
                          onClick={() => {
                            setEditingPatient(p);
                            setEditStatus(p.status);
                            setEditNotes(p.diagnosis);
                          }}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 6,
                            border: 'none',
                            background: '#F1F5F9',
                            color: '#334155',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Update
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

      {/* TAB 2: DIGITAL DOCUMENT ARCHIVE */}
      {activeTab === 'documents' && (
        <div className="card" style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>📁 Digital Medical Documents & Scanned Records</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>Centralized repository of hospital summaries, lab scans, and signed forms</div>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              style={{ padding: '6px 14px', borderRadius: 8, background: '#0EA5E9', color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <FileUp size={14} /> Upload New Document
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Doc ID</th>
                  <th>Document Title</th>
                  <th>Patient Name</th>
                  <th>Category</th>
                  <th>File Name</th>
                  <th>Uploaded Date</th>
                  <th>Uploaded By</th>
                  <th>Classification</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: '#7C3AED' }}>{d.id}</td>
                    <td style={{ fontWeight: 700, color: '#0F172A' }}>{d.title}</td>
                    <td style={{ fontWeight: 600, color: '#0284C7' }}>{d.patient}</td>
                    <td><span className="tag">{d.category}</span></td>
                    <td style={{ fontFamily: 'monospace', fontSize: 11, color: '#475569' }}>{d.file} ({d.size})</td>
                    <td style={{ color: '#64748B', fontSize: 12 }}>{d.date}</td>
                    <td style={{ color: '#334155', fontSize: 12 }}>{d.uploadedBy}</td>
                    <td>
                      {d.confidential ? (
                        <span style={{ fontSize: 10, background: '#FEE2E2', color: '#DC2626', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                          🔒 CONFIDENTIAL
                        </span>
                      ) : (
                        <span style={{ fontSize: 10, background: '#DCFCE7', color: '#166534', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                          GENERAL CLINICAL
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => toast(`Downloading ${d.file}...`, 'info')}
                        style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <Download size={12} /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ABDM CONSENT MANAGER */}
      {activeTab === 'consent' && (
        <div className="card" style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>🛡️ ABDM / Ayushman Bharat Digital Mission Consent Artifacts</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>Patient-controlled data access permissions conforming to ABDM Consent Manager specification</div>
            </div>
            <button
              onClick={() => setShowConsentModal(true)}
              style={{ padding: '6px 14px', borderRadius: 8, background: '#0EA5E9', color: '#fff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Plus size={14} /> New Consent Artifact
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Consent ID</th>
                  <th>Patient</th>
                  <th>ABHA Address</th>
                  <th>Purpose of Request</th>
                  <th>Authorized Provider</th>
                  <th>Health Info Types (HI-Types)</th>
                  <th>Valid Until</th>
                  <th>Consent Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {consents.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: '#0EA5E9' }}>{c.id}</td>
                    <td style={{ fontWeight: 700 }}>{c.patient}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 11, color: '#64748B' }}>{c.abhaId}</td>
                    <td style={{ color: '#0F172A', fontWeight: 500, fontSize: 12 }}>{c.purpose}</td>
                    <td style={{ color: '#475569', fontSize: 12 }}>{c.provider}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {c.hiTypes.map(h => (
                          <span key={h} style={{ fontSize: 9.5, padding: '1px 5px', borderRadius: 3, background: '#F1F5F9', color: '#475569' }}>
                            {h}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ color: '#64748B', fontSize: 12 }}>{c.validUntil}</td>
                    <td>
                      <span className={`badge ${c.status === 'Granted' || c.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      {c.status === 'Granted' || c.status === 'Active' ? (
                        <button
                          onClick={() => {
                            setConsents(consents.map(x => x.id === c.id ? { ...x, status: 'Revoked' } : x));
                            toast(`Consent ${c.id} revoked upon patient request.`, 'warning');
                          }}
                          style={{ padding: '3px 8px', borderRadius: 5, border: '1px solid #FECACA', background: '#FEE2E2', color: '#DC2626', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}
                        >
                          Revoke
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setConsents(consents.map(x => x.id === c.id ? { ...x, status: 'Granted' } : x));
                            toast(`Consent ${c.id} re-authorized.`, 'success');
                          }}
                          style={{ padding: '3px 8px', borderRadius: 5, border: '1px solid #BBF7D0', background: '#DCFCE7', color: '#166534', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}
                        >
                          Re-Grant
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="card" style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>🛡️ Authorized Records Access & Audit Trail</div>
            <div style={{ fontSize: 12, color: '#64748B' }}>Strict forensic logging of every access to patient medical records conforming to hospital privacy policy</div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Audit ID</th>
                  <th>Timestamp</th>
                  <th>Staff Member</th>
                  <th>Role</th>
                  <th>Patient File Accessed</th>
                  <th>Action Performed</th>
                  <th>Clinical Purpose / Reason</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: '#64748B' }}>{a.id}</td>
                    <td style={{ color: '#475569', fontSize: 12 }}>{a.timestamp}</td>
                    <td style={{ fontWeight: 700, color: '#0F172A' }}>{a.user}</td>
                    <td><span className="tag">{a.role}</span></td>
                    <td style={{ color: '#0284C7', fontWeight: 600 }}>{a.patient}</td>
                    <td style={{ color: '#0F172A', fontSize: 12 }}>{a.action}</td>
                    <td style={{ color: '#64748B', fontSize: 12, fontStyle: 'italic' }}>{a.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL: FULL DIGITAL EHR VIEWER ──────────────────────── */}
      {viewingPatient && (
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
          <div style={{ background: '#FFFFFF', borderRadius: 14, maxWidth: 640, width: '100%', padding: 24, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 48px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #E2E8F0', paddingBottom: 12 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>📋 Digital Health Record (EHR Summary)</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>Government District Hospital — Salem · ABDM Profile Node</div>
              </div>
              <button onClick={() => setViewingPatient(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            {/* Patient Demographics Card */}
            <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 10, border: '1px solid #E2E8F0', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>{viewingPatient.name}</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                    ID: <strong>{viewingPatient.id}</strong> · {viewingPatient.age} Yrs · {viewingPatient.gender} · Blood: {viewingPatient.blood || 'B+'}
                  </div>
                </div>
                <span className={`badge ${viewingPatient.status === 'Admitted' ? 'badge-info' : 'badge-success'}`}>
                  {viewingPatient.status}
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#0284C7', fontWeight: 600, marginTop: 8 }}>
                Assigned Department: {viewingPatient.dept} · Primary Doctor: Dr. Priya Sharma
              </div>
            </div>

            {/* Clinical Overview Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}>Primary Diagnosis & Clinical Summary</div>
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 10, fontSize: 13, color: '#0F172A' }}>
                  {viewingPatient.diagnosis || 'Essential Hypertension – Stage 2 (Controlled)'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}>Current Active Medications</div>
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 10, fontSize: 12, color: '#334155' }}>
                  • Amlodipine 5mg – 1 Tablet once daily (Morning, post-breakfast)<br />
                  • Paracetamol 500mg – 1 Tablet SOS for mild headache<br />
                  • Normal Saline IV (Completed during previous admission)
                </div>
              </div>

              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}>Verified Diagnostic Reports & Investigations</div>
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 10, fontSize: 12, color: '#334155' }}>
                  • Complete Blood Count (CBC): Normal parameters verified (Hb: 13.8 g/dL)<br />
                  • Fasting Blood Sugar: 104 mg/dL (Normal)<br />
                  • Serum Creatinine: 0.9 mg/dL (Normal Renal Function)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
              <button
                onClick={() => {
                  toast(`EHR Summary for ${viewingPatient.name} downloaded as FHIR JSON!`, 'success');
                  setViewingPatient(null);
                }}
                style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Download size={13} /> Export FHIR Bundle
              </button>
              <button
                onClick={() => setViewingPatient(null)}
                style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0EA5E9', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}
              >
                Close EHR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: UPLOAD SCANNED DOCUMENT ──────────────────────── */}
      {showUploadModal && (
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
          <div style={{ background: '#FFFFFF', borderRadius: 14, maxWidth: 480, width: '100%', padding: 24, boxShadow: '0 20px 48px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>📁 Upload & Archive Clinical Document</div>
              <button onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Patient Name
                </label>
                <input
                  type="text"
                  value={uploadForm.patientName}
                  onChange={e => setUploadForm({ ...uploadForm, patientName: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Document Category
                </label>
                <select
                  value={uploadForm.category}
                  onChange={e => setUploadForm({ ...uploadForm, category: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                >
                  <option>Discharge Summary</option>
                  <option>Diagnostic Report</option>
                  <option>Operative Note</option>
                  <option>Prescription Scan</option>
                  <option>Identity & Consent</option>
                  <option>Medicolegal Certificate (MLC)</option>
                </select>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Document Title / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Inpatient Discharge Summary - General Ward"
                  value={uploadForm.title}
                  onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Select File (PDF, Scanned Image, DICOM)
                </label>
                <input
                  type="file"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadForm({ ...uploadForm, fileName: e.target.files[0].name });
                    }
                  }}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12 }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer', fontSize: 12 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#0EA5E9', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}
                >
                  Archive Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: UPDATE RECORD ─────────────────────────────────── */}
      {editingPatient && (
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
          <div style={{ background: '#FFFFFF', borderRadius: 14, maxWidth: 460, width: '100%', padding: 24, boxShadow: '0 20px 48px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>✏️ Update Patient Record Status</div>
              <button onClick={() => setEditingPatient(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateRecordSubmit}>
              <div style={{ marginBottom: 12, background: '#F8FAFC', padding: 10, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{editingPatient.name}</div>
                <div style={{ fontSize: 11, color: '#64748B' }}>ID: {editingPatient.id} · {editingPatient.dept}</div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Current Status
                </label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                >
                  <option value="OPD">OPD (Outpatient)</option>
                  <option value="Admitted">Admitted (Inpatient)</option>
                  <option value="Discharged">Discharged</option>
                  <option value="Transferred">Transferred</option>
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Diagnosis & Archival Notes
                </label>
                <textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13, resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setEditingPatient(null)}
                  style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer', fontSize: 12 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#10B981', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CREATE ABDM CONSENT ──────────────────────────── */}
      {showConsentModal && (
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
          <div style={{ background: '#FFFFFF', borderRadius: 14, maxWidth: 480, width: '100%', padding: 24, boxShadow: '0 20px 48px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>🛡️ New ABDM Consent Request</div>
              <button onClick={() => setShowConsentModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={e => {
              e.preventDefault();
              const newCons = {
                id: `CONS-90${consents.length + 5}`,
                patient: e.target.patientName.value,
                abhaId: e.target.abhaId.value,
                purpose: e.target.purpose.value,
                provider: e.target.provider.value,
                validUntil: '2026-11-30',
                status: 'Granted',
                hiTypes: ['OPConsultation', 'Prescription', 'DiagnosticReport']
              };
              setConsents([newCons, ...consents]);
              setShowConsentModal(false);
              toast(`ABDM Consent Artifact generated for ${newCons.patient}!`, 'success');
            }}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Patient Name
                </label>
                <input name="patientName" defaultValue="Ravi Kumar" required style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Patient ABHA Address / ID
                </label>
                <input name="abhaId" defaultValue="12-3456-7890-1234" required style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Purpose of Record Access
                </label>
                <select name="purpose" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}>
                  <option>Care Management & Referral</option>
                  <option>Medical Investigation & Second Opinion</option>
                  <option>Emergency Trauma Resuscitation</option>
                  <option>Health Insurance Claim Verification</option>
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Requesting Healthcare Facility
                </label>
                <input name="provider" defaultValue="Government District Hospital — Salem" required style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }} />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowConsentModal(false)}
                  style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer', fontSize: 12 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#0EA5E9', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}
                >
                  Issue Consent Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
