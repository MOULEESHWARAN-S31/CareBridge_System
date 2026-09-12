import { useState } from 'react';
import {
  Video, VideoOff, Mic, MicOff, PhoneOff, Monitor,
  Users, Stethoscope, Clock, ShieldCheck, CheckCircle2,
  Calendar, Activity, FileText, Send, User, Sparkles
} from 'lucide-react';
import { DOCTORS, PATIENTS } from '../data/mockData';
import { useToast } from '../components/Toast';

export default function TelemedicinePage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [inCall, setInCall] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [screenSharing, setScreenSharing] = useState(false);

  // Consultations state
  const consultations = [
    { id: 'TELE-101', patientName: 'Meena Devi', patientId: 'PAT002', doctor: 'Dr. Priya Sharma', dept: 'General Medicine', time: '14:45 Today', status: 'Active', vitals: 'BP 120/80 · Pulse 74 · SpO2 99%', reason: 'Post-discharge recovery review & hypertension follow-up' },
    { id: 'TELE-102', patientName: 'Deepak Sharma', patientId: 'PAT013', doctor: 'Dr. Suresh Iyer', dept: 'Cardiology', time: '15:15 Today', status: 'Upcoming', vitals: 'BP 140/90 · Pulse 82 · SpO2 96%', reason: 'ECG report discussion and nitrate dosage review' },
    { id: 'TELE-103', patientName: 'Radha Nair', patientId: 'PAT024', doctor: 'Dr. Ritu Singh', dept: 'Neurology', time: '16:00 Today', status: 'Upcoming', vitals: 'BP 118/76 · Pulse 70 · SpO2 98%', reason: 'Migraine prophylaxis follow-up' },
    { id: 'TELE-100', patientName: 'Ravi Kumar', patientId: 'PAT001', doctor: 'Dr. Priya Sharma', dept: 'General Medicine', time: '11:00 Today', status: 'Completed', vitals: 'BP 130/85 · Pulse 72 · SpO2 98%', reason: 'Lab report review & prescription renewal' },
  ];

  function startCall(consult) {
    setSelectedCall(consult);
    setClinicalNotes('');
    setInCall(true);
    toast?.success?.(`Teleconsultation connected with ${consult.patientName}`);
  }

  function endCall() {
    setInCall(false);
    toast?.info?.('Teleconsultation ended. Clinical notes saved to patient health record.');
  }

  const filtered = consultations.filter(c => {
    if (activeTab === 'upcoming') return c.status === 'Upcoming' || c.status === 'Active';
    if (activeTab === 'active') return c.status === 'Active';
    if (activeTab === 'completed') return c.status === 'Completed';
    return true;
  });

  return (
    <div className="fade-in" style={{ paddingBottom: 32 }}>
      {/* ── Page Header ────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
            Telemedicine & Remote Specialist Consultations
          </div>
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            Connected e-Sanjeevani / CareBridge telemedicine suite linking PHCs, CHCs, and specialists
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#15803D', padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}>
            🟢 12 Specialists Available Online
          </span>
        </div>
      </div>

      {/* ── Specialist Availability Banner (Section 23) ──────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #F0F9FF 0%, #FFFFFF 100%)',
          borderRadius: 12,
          padding: '14px 18px',
          border: '1.5px solid #BAE6FD',
          marginBottom: 18
        }}
      >
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
          Available Specialist Duty Roster
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {[
            { dept: 'Cardiology', doc: 'Dr. Suresh Iyer', status: 'Specialist Available', color: '#16A34A' },
            { dept: 'General Medicine', doc: 'Dr. Priya Sharma', status: 'Specialist Available', color: '#16A34A' },
            { dept: 'Pediatrics', doc: 'Dr. Kavitha Menon', status: 'In Consultation', color: '#D97706' },
            { dept: 'Neurology', doc: 'Dr. Ritu Singh', status: 'Specialist Available', color: '#16A34A' },
            { dept: 'Gynecology', doc: 'Dr. Sunita Rao', status: 'Specialist Available', color: '#16A34A' },
            { dept: 'Orthopedics', doc: 'Dr. Mohan Das', status: 'Specialist Available', color: '#16A34A' },
          ].map((sp, idx) => (
            <div
              key={idx}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                padding: '8px 12px',
                borderRadius: 8,
                minWidth: 170,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#0EA5E9' }}>{sp.dept}</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginTop: 1 }}>{sp.doc}</div>
              </div>
              <div style={{ fontSize: '10px', color: sp.color, fontWeight: 700, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: sp.color }} />
                <span>{sp.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Simulated Call View (if call active) ─────────────────── */}
      {inCall && selectedCall && (
        <div
          style={{
            background: '#0F172A',
            borderRadius: 16,
            padding: '20px',
            marginBottom: 20,
            color: '#FFFFFF',
            boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
            border: '2px solid #0EA5E9'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444', animation: 'pulse 1.5s infinite' }} />
              <div>
                <span style={{ fontSize: '15px', fontWeight: 800 }}>
                  Active Teleconsultation: {selectedCall.patientName} ({selectedCall.patientId})
                </span>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                  e-Sanjeevani Secure Channel · Doctor: {selectedCall.doctor} · {selectedCall.dept}
                </div>
              </div>
            </div>

            <button
              onClick={endCall}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 8,
                background: '#DC2626',
                color: '#FFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <PhoneOff size={14} />
              <span>End Consultation</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            {/* Main Video Stream Simulator */}
            <div
              style={{
                background: '#1E293B',
                borderRadius: 12,
                height: '320px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {videoEnabled ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #0EA5E9, #0284C7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, margin: '0 auto 12px' }}>
                    {selectedCall.patientName.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700 }}>{selectedCall.patientName}</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>Live Patient Stream (Salem District Sub-centre)</div>
                  <div style={{ fontSize: '11px', color: '#38BDF8', marginTop: 4 }}>720p HD · Encrypted WebRTC</div>
                </div>
              ) : (
                <div style={{ color: '#94A3B8', fontSize: '13px' }}>Video feed disabled</div>
              )}

              {/* PiP Doctor preview */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 14,
                  right: 14,
                  width: 100,
                  height: 70,
                  borderRadius: 8,
                  background: '#334155',
                  border: '1.5px solid #0EA5E9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#FFF'
                }}
              >
                Doctor (You)
              </div>

              {/* Video control buttons */}
              <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  style={{ width: 36, height: 36, borderRadius: '50%', background: videoEnabled ? '#334155' : '#DC2626', border: 'none', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  {videoEnabled ? <Video size={16} /> : <VideoOff size={16} />}
                </button>
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  style={{ width: 36, height: 36, borderRadius: '50%', background: audioEnabled ? '#334155' : '#DC2626', border: 'none', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  {audioEnabled ? <Mic size={16} /> : <MicOff size={16} />}
                </button>
                <button
                  onClick={() => setScreenSharing(!screenSharing)}
                  style={{ width: 36, height: 36, borderRadius: '50%', background: screenSharing ? '#0EA5E9' : '#334155', border: 'none', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Monitor size={16} />
                </button>
              </div>
            </div>

            {/* Side Panel: Live Patient Vitals & Doctor Note Pad */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: '#1E293B', padding: '12px 14px', borderRadius: 10, border: '1px solid #334155' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#38BDF8', textTransform: 'uppercase' }}>
                  Live Telemetry Vitals
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC', marginTop: 3 }}>
                  {selectedCall.vitals}
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: 2 }}>
                  Transmitted from rural health terminal
                </div>
              </div>

              <div style={{ background: '#1E293B', padding: '12px 14px', borderRadius: 10, border: '1px solid #334155', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#38BDF8', textTransform: 'uppercase', marginBottom: 6 }}>
                  Doctor's Clinical Notes (e-Prescription)
                </div>
                <textarea
                  value={clinicalNotes}
                  onChange={e => setClinicalNotes(e.target.value)}
                  placeholder="Record symptoms, observations, and prescription orders here..."
                  style={{
                    flex: 1,
                    width: '100%',
                    background: '#0F172A',
                    border: '1px solid #334155',
                    borderRadius: 6,
                    padding: '8px',
                    color: '#F8FAFC',
                    fontSize: '11.5px',
                    resize: 'none',
                    outline: 'none',
                    minHeight: '100px'
                  }}
                />
                <button
                  onClick={() => toast?.success?.('Prescription dispatched to Hospital Pharmacy')}
                  style={{
                    marginTop: 8,
                    padding: '8px',
                    borderRadius: 6,
                    background: '#0EA5E9',
                    color: '#FFF',
                    border: 'none',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Sign & Send e-Prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Consultation Queues Tab Bar ──────────────────────────── */}
      <div style={{ display: 'flex', gap: 6, borderBottom: '2px solid #E2E8F0', marginBottom: 16 }}>
        {[
          { id: 'upcoming', label: 'Upcoming Consultations' },
          { id: 'active', label: 'Active Sessions' },
          { id: 'completed', label: 'Completed Consultations' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: 'transparent',
              fontSize: '12.5px',
              fontWeight: activeTab === t.id ? 700 : 500,
              color: activeTab === t.id ? '#0EA5E9' : '#64748B',
              borderBottom: activeTab === t.id ? '2.5px solid #0EA5E9' : '2.5px solid transparent',
              cursor: 'pointer',
              marginBottom: -2
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Consultations List ───────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(consult => (
          <div
            key={consult.id}
            style={{
              background: '#FFFFFF',
              borderRadius: 12,
              padding: '16px 20px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                  {consult.patientName}
                </span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>({consult.patientId})</span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 4,
                    background: consult.status === 'Active' ? '#DCFCE7' : consult.status === 'Upcoming' ? '#E0F2FE' : '#F1F5F9',
                    color: consult.status === 'Active' ? '#15803D' : consult.status === 'Upcoming' ? '#0369A1' : '#64748B'
                  }}
                >
                  {consult.status}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#475569', marginTop: 3 }}>
                Doctor: <strong>{consult.doctor}</strong> · Department: {consult.dept} · Time: <strong>{consult.time}</strong>
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: 2 }}>
                Reason: {consult.reason} · Vitals: {consult.vitals}
              </div>
            </div>

            <div>
              {consult.status !== 'Completed' ? (
                <button
                  onClick={() => startCall(consult)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: '#0EA5E9',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(14,165,233,0.3)'
                  }}
                >
                  <Video size={14} />
                  <span>Connect Teleconsultation</span>
                </button>
              ) : (
                <span style={{ fontSize: '11.5px', color: '#16A34A', fontWeight: 700 }}>
                  ✓ Record Synced
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
