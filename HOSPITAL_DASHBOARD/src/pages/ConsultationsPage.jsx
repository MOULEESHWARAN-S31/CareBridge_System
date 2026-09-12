import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useRoleNav } from '../hooks/useRoleNav';
import { Video, Phone, MessageCircle, Mic, MicOff, VideoOff, X, FileText, User, Syringe, ClipboardCheck, Plus, CheckCircle } from 'lucide-react';
import { doctors, patients, PATIENTS } from '../data/mockData';
import { useToast } from '../components/Toast';

export default function ConsultationsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { path } = useRoleNav();
  const toast = useToast();
  const [activeConsult, setActiveConsult] = useState(null);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState([
    { from: 'doctor', text: 'Hello, how are you feeling today?', time: '10:02 AM' },
    { from: 'patient', text: 'I have had a persistent headache for 3 days.', time: '10:03 AM' },
  ]);

  const isProcedures = location.pathname.endsWith('/procedures');
  const isOrders     = location.pathname.endsWith('/orders');

  // ── PROCEDURES VIEW (Nurse)
  if (isProcedures) {
    return <ProceduresView toast={toast} />;
  }

  // ── DOCTOR ORDERS VIEW (Nurse)
  if (isOrders) {
    return <DoctorOrdersView toast={toast} navigate={navigate} path={path} />;
  }

  const onlineDoctors = doctors.filter(d => d.status !== 'offline');

  const sendMessage = () => {
    if (!chatMsg.trim()) return;
    setMessages(prev => [...prev, { from: 'patient', text: chatMsg, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }]);
    setChatMsg('');
  };

  if (activeConsult) {
    return (
      <div className="page-content page-transition" style={{ padding: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', height: 'calc(100vh - var(--header-height))', background: '#0F172A' }}>
          {/* Video Area */}
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* Main Video (Doctor) */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0F172A, #1E293B)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 800, color: 'white', margin: '0 auto 16px', boxShadow: '0 0 40px rgba(14,165,233,0.3)' }}>
                  {activeConsult.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div style={{ color: 'white', fontWeight: 600, fontSize: 18 }}>{activeConsult.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{activeConsult.specialization}</div>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', animation: 'pulse 1.5s infinite' }} />
                  <span style={{ color: '#10B981', fontSize: 13, fontWeight: 500 }}>Connected · 00:04:32</span>
                </div>
              </div>
            </div>

            {/* Patient Video (small) */}
            {!camOff && (
              <div style={{ position: 'absolute', bottom: 100, right: 20, width: 160, height: 110, borderRadius: 12, background: 'linear-gradient(135deg, #1E293B, #334155)', border: '2px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
                  <User size={32} />
                  <div style={{ fontSize: 11, marginTop: 4 }}>You</div>
                </div>
              </div>
            )}

            {/* Controls */}
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, background: 'rgba(15,23,42,0.9)' }}>
              <button onClick={() => setMuted(!muted)} style={{ width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: muted ? '#EF4444' : 'rgba(255,255,255,0.15)', color: 'white', transition: 'var(--transition)' }}>
                {muted ? <MicOff size={22} /> : <Mic size={22} />}
              </button>
              <button onClick={() => setCamOff(!camOff)} style={{ width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: camOff ? '#EF4444' : 'rgba(255,255,255,0.15)', color: 'white', transition: 'var(--transition)' }}>
                {camOff ? <VideoOff size={22} /> : <Video size={22} />}
              </button>
              <button style={{ width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.15)', color: 'white' }} onClick={() => toast('Opening prescription pad...', 'info')}>
                <FileText size={22} />
              </button>
              <button onClick={() => { setActiveConsult(null); toast('Consultation ended.', 'info'); }} style={{ width: 64, height: 64, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EF4444', color: 'white', boxShadow: '0 4px 16px rgba(239,68,68,0.5)' }}>
                <Phone size={26} />
              </button>
            </div>
          </div>

          {/* Side Panel */}
          <div style={{ background: 'white', display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border-light)' }}>
            {/* Patient Info */}
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10 }}>PATIENT</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="avatar avatar-md" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>RK</div>
                <div>
                  <div style={{ fontWeight: 600 }}>Ravi Kumar</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>P1001 · Male · 45 yrs · B+</div>
                </div>
              </div>
              <div style={{ marginTop: 12, padding: 10, background: 'var(--bg)', borderRadius: 8, fontSize: 12 }}>
                <div style={{ fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 4 }}>Current Complaint</div>
                <div style={{ color: 'var(--text-primary)' }}>Persistent headache, dizziness for 3 days. BP: 148/94 mmHg</div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: 11 }} onClick={() => navigate(path('patients/P1001'))}>View Records</button>
                <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: 11 }} onClick={() => toast('Prescription saved!', 'success')}>Write Rx</button>
              </div>
            </div>

            {/* Chat */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', fontWeight: 600, fontSize: 13 }}>Chat</div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.from === 'patient' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '80%', padding: '8px 12px', borderRadius: m.from === 'patient' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: m.from === 'patient' ? 'var(--primary)' : 'var(--bg)', color: m.from === 'patient' ? 'white' : 'var(--text-primary)', fontSize: 13 }}>
                      {m.text}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{m.time}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: 8 }}>
                <input className="form-input" style={{ flex: 1, borderRadius: 'var(--radius-full)' }} placeholder="Type a message..." value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} />
                <button className="btn btn-primary btn-sm" onClick={sendMessage}>Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content page-transition">
      <div className="page-header">
        <div>
          <h1 className="page-title">Teleconsultation</h1>
          <div className="page-subtitle">{onlineDoctors.length} doctors available for consultation</div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-3" style={{ marginBottom: 24 }}>
        {[
          { label: 'Online Now', count: doctors.filter(d => d.status === 'online').length, color: 'var(--success)', bg: 'var(--success-light)' },
          { label: 'In Consultation', count: doctors.filter(d => d.status === 'busy').length, color: 'var(--warning)', bg: 'var(--warning-light)' },
          { label: 'Offline', count: doctors.filter(d => d.status === 'offline').length, color: 'var(--text-muted)', bg: 'var(--border-light)' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ width: 14, height: 14, borderRadius: '50%', background: s.color }} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.count}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {doctors.map(doc => (
          <div key={doc.id} className="card" style={{ transition: 'var(--transition)' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, var(--primary-light), var(--secondary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: 'var(--primary-dark)' }}>
                  {doc.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <span className={`status-dot ${doc.status}`} style={{ position: 'absolute', bottom: 2, right: 2, border: '2px solid white' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{doc.name}</div>
                <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 500 }}>{doc.specialization}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{doc.fee} per session</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-primary btn-sm"
                style={{ flex: 1, justifyContent: 'center', opacity: doc.status === 'offline' ? 0.5 : 1 }}
                onClick={() => { if (doc.status === 'offline') { toast('Doctor is offline', 'warning'); } else if (doc.status === 'busy') { toast('Doctor is in consultation', 'warning'); } else { setActiveConsult(doc); } }}
              >
                <Video size={13} /> Video Call
              </button>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => toast('Audio call feature coming soon', 'info')}>
                <Phone size={13} /> Audio
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setActiveConsult(doc)}>
                <MessageCircle size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Doctor Orders View (/orders route — Nurse sees orders from doctors)
function DoctorOrdersView({ toast, navigate, path }) {
  const DOCTOR_ORDERS = [
    { id: 'ORD001', patient: 'Ravi Kumar',    patientId: 'PAT001', doctor: 'Dr. Priya Sharma',  type: 'Medication',  order: 'Amlodipine 5mg OD + Telma 40mg OD — oral, after food',         priority: 'Routine', time: '08:00', status: 'Pending'    },
    { id: 'ORD002', patient: 'Kavitha Raj',   patientId: 'PAT004', doctor: 'Dr. Suresh Iyer',   type: 'Lab',         order: 'CBC Urgent — collect blood EDTA, send to lab immediately',       priority: 'Urgent',  time: '08:10', status: 'Acknowledged' },
    { id: 'ORD003', patient: 'Kavitha Raj',   patientId: 'PAT004', doctor: 'Dr. Suresh Iyer',   type: 'IV Fluids',   order: 'Normal Saline 500ml IV @ 60ml/hr — change bag every 8 hrs',      priority: 'Urgent',  time: '08:15', status: 'Completed'  },
    { id: 'ORD004', patient: 'Bala Subramanian', patientId: 'PAT015', doctor: 'Dr. Ritu Singh', type: 'Medication',  order: 'Mannitol 100ml IV over 20 min STAT — monitor ICP',               priority: 'STAT',    time: '08:20', status: 'Completed'  },
    { id: 'ORD005', patient: 'Meena Devi',    patientId: 'PAT002', doctor: 'Dr. Sunita Rao',    type: 'Diet',        order: 'High protein, iron-rich diet — 6 small meals/day',               priority: 'Routine', time: '09:00', status: 'Pending'    },
    { id: 'ORD006', patient: 'Arun Prakash',  patientId: 'PAT003', doctor: 'Dr. Arun Raj',      type: 'Nursing Care',order: 'Wound dressing change BD — use povidone-iodine, non-adherent pad', priority: 'Routine', time: '09:30', status: 'Pending'    },
    { id: 'ORD007', patient: 'Vijay Raj',     patientId: 'PAT011', doctor: 'Dr. Vijay Kumar',   type: 'O2 Therapy',  order: 'O2 via facemask @ 6L/min — maintain SpO2 > 94%',                priority: 'Urgent',  time: '07:40', status: 'Acknowledged' },
    { id: 'ORD008', patient: 'Suresh Kumar',  patientId: 'PAT005', doctor: 'Dr. Ritu Singh',    type: 'Activity',    order: 'Bed rest strictly — assist to bedside commode only',              priority: 'Routine', time: '10:00', status: 'Pending'    },
  ];

  const typeColors = {
    Medication: '#8B5CF6', Lab: '#0EA5E9', 'IV Fluids': '#14B8A6',
    Diet: '#10B981', 'Nursing Care': '#F59E0B', 'O2 Therapy': '#EF4444', Activity: '#6366F1',
  };

  return (
    <div className="page-content page-transition">
      <div className="page-header">
        <div>
          <h1 className="page-title">Doctor's Orders</h1>
          <div className="page-subtitle">{DOCTOR_ORDERS.filter(o => o.status === 'Pending').length} pending orders · {DOCTOR_ORDERS.filter(o => o.status === 'Acknowledged').length} acknowledged</div>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Pending',       value: DOCTOR_ORDERS.filter(o => o.status === 'Pending').length,       color: '#F59E0B', bg: '#FEF3C7' },
          { label: 'Acknowledged',  value: DOCTOR_ORDERS.filter(o => o.status === 'Acknowledged').length,  color: '#0EA5E9', bg: '#E0F2FE' },
          { label: 'Completed',     value: DOCTOR_ORDERS.filter(o => o.status === 'Completed').length,     color: '#10B981', bg: '#D1FAE5' },
          { label: 'STAT Orders',   value: DOCTOR_ORDERS.filter(o => o.priority === 'STAT').length,        color: '#EF4444', bg: '#FEE2E2' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {DOCTOR_ORDERS.map(o => {
          const tc = typeColors[o.type] || '#0EA5E9';
          return (
            <div key={o.id} className="card" style={{ padding: '16px 20px', borderLeft: `4px solid ${tc}`, background: o.priority === 'STAT' ? 'linear-gradient(to right,#FFF5F5,white)' : 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                    <span style={{ fontWeight: 800, fontSize: 14 }}>{o.patient}</span>
                    <span style={{ fontSize: 11, padding: '2px 8px', background: tc + '15', color: tc, borderRadius: 20, fontWeight: 700 }}>{o.type}</span>
                    {o.priority === 'STAT' && <span className="badge badge-danger">⚡ STAT</span>}
                    {o.priority === 'Urgent' && <span className="badge badge-warning">Urgent</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Ordered by: {o.doctor} · {o.time}</div>
                </div>
                <span className={`badge ${o.status === 'Completed' ? 'badge-success' : o.status === 'Acknowledged' ? 'badge-info' : 'badge-warning'}`}>{o.status}</span>
              </div>
              <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 10 }}>{o.order}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {o.status === 'Pending' && (
                  <button className="btn btn-primary btn-sm" onClick={() => toast(`Order acknowledged for ${o.patient}!`, 'success')}><CheckCircle size={12} /> Acknowledge</button>
                )}
                {o.status === 'Acknowledged' && (
                  <button className="btn btn-primary btn-sm" onClick={() => toast(`Order completed for ${o.patient}!`, 'success')}><CheckCircle size={12} /> Mark Complete</button>
                )}
                <button className="btn btn-ghost btn-sm" onClick={() => navigate(path(`patients/${o.patientId}`))}>View Patient</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Procedures View (/procedures route — Nurse)
function ProceduresView({ toast }) {
  const PROCEDURES = [
    { id: 'PRC001', patient: 'Kavitha Raj',    patientId: 'PAT004', procedure: 'IV Cannula Insertion (18G)',          ward: 'ICU',       nurse: 'NRS002', scheduledAt: '08:00', status: 'Completed', notes: 'Right antecubital, 1st attempt success' },
    { id: 'PRC002', patient: 'Kavitha Raj',    patientId: 'PAT004', procedure: 'ECG Recording (12-lead)',             ward: 'ICU',       nurse: 'NRS008', scheduledAt: '08:30', status: 'Completed', notes: 'Sent to Dr. Suresh Iyer immediately' },
    { id: 'PRC003', patient: 'Bala Subramanian', patientId: 'PAT015', procedure: 'Urinary Catheter Insertion (Foley)', ward: 'ICU',     nurse: 'NRS002', scheduledAt: '08:45', status: 'Completed', notes: '14Fr Foley, 250ml urine output' },
    { id: 'PRC004', patient: 'Ravi Kumar',     patientId: 'PAT001', procedure: 'Wound Dressing – Leg Ulcer',          ward: 'General',   nurse: 'NRS001', scheduledAt: '09:00', status: 'Pending',   notes: '' },
    { id: 'PRC005', patient: 'Vijay Raj',      patientId: 'PAT011', procedure: 'Nasogastric Tube Insertion',          ward: 'Emergency', nurse: 'NRS004', scheduledAt: '08:00', status: 'Completed', notes: '16Fr NGT, position confirmed by X-ray' },
    { id: 'PRC006', patient: 'Bala Subramanian', patientId: 'PAT015', procedure: 'Suctioning (Orotracheal)',          ward: 'ICU',       nurse: 'NRS002', scheduledAt: '10:00', status: 'Pending',   notes: '' },
    { id: 'PRC007', patient: 'Arun Prakash',   patientId: 'PAT003', procedure: 'Post-Op Wound Dressing Change',       ward: 'Surgery',   nurse: 'NRS006', scheduledAt: '11:00', status: 'Pending',   notes: '' },
    { id: 'PRC008', patient: 'Shankar Rajan',  patientId: 'PAT021', procedure: 'Cardiac Monitor Application',         ward: 'Emergency', nurse: 'NRS004', scheduledAt: '06:15', status: 'Completed', notes: 'Continuous monitoring initiated' },
  ];

  const procTypes = ['IV Therapy', 'Catheter Care', 'Wound Dressing', 'Monitoring', 'Airway', 'Diagnostic'];

  return (
    <div className="page-content page-transition">
      <div className="page-header">
        <div>
          <h1 className="page-title">Nursing Tasks</h1>
          <div className="page-subtitle">{PROCEDURES.filter(p => p.status === 'Pending').length} pending · {PROCEDURES.filter(p => p.status === 'Completed').length} completed today</div>
        </div>
        <button className="btn btn-primary" onClick={() => toast('Procedure charting form opened.', 'info')}><Plus size={15} /> Chart Procedure</button>
      </div>

      {/* Quick Procedure Types */}
      <div className="card" style={{ marginBottom: 24, padding: '16px 20px' }}>
        <div className="section-title" style={{ marginBottom: 12 }}>Common Procedures</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { name: 'IV Cannula',      icon: '💉', color: '#8B5CF6' },
            { name: 'Wound Dressing',  icon: '🩹', color: '#F59E0B' },
            { name: 'Foley Catheter',  icon: '🔬', color: '#0EA5E9' },
            { name: 'NGT Insertion',   icon: '🫁', color: '#10B981' },
            { name: 'Blood Draw',      icon: '🩸', color: '#EF4444' },
            { name: 'ECG Recording',   icon: '❤️', color: '#EC4899' },
            { name: 'Suctioning',      icon: '🌬️', color: '#6366F1' },
            { name: 'O2 Mask Setup',   icon: '😷', color: '#14B8A6' },
          ].map((p, i) => (
            <button key={i} onClick={() => toast(`${p.name} charted!`, 'success')}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', border: `1.5px solid ${p.color}30`, borderRadius: 'var(--radius)', background: p.color + '08', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, color: p.color, transition: 'var(--transition)' }}
              onMouseEnter={e => e.currentTarget.style.background = p.color + '20'}
              onMouseLeave={e => e.currentTarget.style.background = p.color + '08'}>
              <span>{p.icon}</span>{p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Procedures Table */}
      <div className="grid grid-3" style={{ marginBottom: 24 }}>
        {[
          { label: 'Pending',   value: PROCEDURES.filter(p => p.status === 'Pending').length,   color: '#F59E0B' },
          { label: 'Completed', value: PROCEDURES.filter(p => p.status === 'Completed').length, color: '#10B981' },
          { label: 'Total Today', value: PROCEDURES.length,                                     color: '#0EA5E9' },
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
            <thead><tr><th>ID</th><th>Patient</th><th>Procedure</th><th>Ward</th><th>Nurse</th><th>Scheduled</th><th>Status</th><th>Notes</th><th>Actions</th></tr></thead>
            <tbody>
              {PROCEDURES.map(p => (
                <tr key={p.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>{p.id}</td>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{p.patient}</td>
                  <td style={{ fontSize: 12, fontWeight: 500 }}>{p.procedure}</td>
                  <td style={{ fontSize: 12 }}>{p.ward}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.nurse}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.scheduledAt}</td>
                  <td><span className={`badge ${p.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>{p.status}</span></td>
                  <td style={{ fontSize: 11, color: 'var(--text-muted)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.notes || '—'}</td>
                  <td>
                    {p.status === 'Pending'
                      ? <button className="btn btn-primary btn-sm" onClick={() => toast(`${p.procedure} completed for ${p.patient}!`, 'success')}><CheckCircle size={12} /> Done</button>
                      : <button className="btn btn-ghost btn-sm" onClick={() => toast('Viewing procedure record...', 'info')}>View</button>
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

