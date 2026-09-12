import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoleNav } from '../hooks/useRoleNav';
import { Activity, RefreshCw, CheckCircle, AlertTriangle, Phone, Video } from 'lucide-react';
import { useToast } from '../components/Toast';

const symptoms = [
  { id: 'fever', label: 'Fever', icon: '🌡️', severity: 1 },
  { id: 'cough', label: 'Cough', icon: '😮‍💨', severity: 1 },
  { id: 'headache', label: 'Headache', icon: '🤕', severity: 1 },
  { id: 'chest', label: 'Chest Pain', icon: '💔', severity: 3 },
  { id: 'breathing', label: 'Breathing Difficulty', icon: '😮', severity: 3 },
  { id: 'abdomen', label: 'Abdominal Pain', icon: '🤢', severity: 2 },
  { id: 'vomiting', label: 'Vomiting', icon: '🤮', severity: 2 },
  { id: 'weakness', label: 'Weakness', icon: '😔', severity: 1 },
  { id: 'dizziness', label: 'Dizziness', icon: '💫', severity: 2 },
  { id: 'rash', label: 'Skin Rash', icon: '🔴', severity: 1 },
  { id: 'swelling', label: 'Swelling', icon: '🦵', severity: 2 },
  { id: 'vision', label: 'Vision Changes', icon: '👁️', severity: 2 },
];

const recommendations = [
  { level: 0, color: '#10B981', bg: '#D1FAE5', icon: '🟢', title: 'Self Care', desc: 'Your symptoms are mild. Rest, stay hydrated, and monitor your condition at home. If symptoms worsen, visit your nearest PHC.', action: 'Home Care Tips', severity: 'Mild' },
  { level: 1, color: '#0EA5E9', bg: '#DBEAFE', icon: '🔵', title: 'Teleconsultation', desc: 'Your symptoms suggest you need medical advice. A teleconsultation with a doctor is recommended. You do not need to visit a hospital right away.', action: 'Start Teleconsult', severity: 'Moderate' },
  { level: 2, color: '#F59E0B', bg: '#FEF3C7', icon: '🟡', title: 'Visit PHC / Clinic', desc: 'Your symptoms need in-person assessment. Please visit your nearest Primary Health Centre (PHC) or clinic for a proper examination.', action: 'Find Nearest PHC', severity: 'Concerning' },
  { level: 3, color: '#EF4444', bg: '#FEE2E2', icon: '🔴', title: 'Emergency – Seek Immediate Care', desc: 'Your symptoms indicate a potential medical emergency. Please call emergency services or go to the nearest hospital immediately. Do NOT delay.', action: 'Call Emergency Now', severity: 'Critical' },
];

export default function TriagePage() {
  const navigate = useNavigate();
  const { path } = useRoleNav();
  const toast = useToast();
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [assessed, setAssessed] = useState(false);

  const toggleSymptom = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    setResult(null);
    setAssessed(false);
  };

  const assess = () => {
    if (selected.length === 0) { toast('Please select at least one symptom.', 'warning'); return; }
    const selectedSymptoms = symptoms.filter(s => selected.includes(s.id));
    const maxSeverity = Math.max(...selectedSymptoms.map(s => s.severity));
    const totalSeverity = selectedSymptoms.reduce((sum, s) => sum + s.severity, 0);
    let level = 0;
    if (maxSeverity >= 3) level = 3;
    else if (maxSeverity >= 2 && totalSeverity >= 4) level = 2;
    else if (maxSeverity >= 2 || totalSeverity >= 3) level = 1;
    setResult(recommendations[level]);
    setAssessed(true);
  };

  const reset = () => { setSelected([]); setResult(null); setAssessed(false); };

  return (
    <div className="page-content page-transition">
      <div className="page-header">
        <div>
          <div className="page-title">Digital Symptom Assessment</div>
          <div className="page-subtitle">AI-powered triage to determine the right level of care</div>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ padding: '14px 18px', background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 'var(--radius)', marginBottom: 24, display: 'flex', gap: 10, alignItems: 'center' }}>
        <AlertTriangle size={18} color="#F59E0B" />
        <span style={{ fontSize: 13, color: '#92400E' }}>
          <strong>Disclaimer:</strong> This tool provides general guidance only. For serious emergencies, call emergency services immediately. This is not a replacement for professional medical advice.
        </span>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start', gap: 24 }}>
        {/* Symptom Selection */}
        <div className="card">
          <div className="section-title">What symptoms are you experiencing?</div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Select all that apply. You can choose multiple symptoms.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 }}>
            {symptoms.map(s => (
              <button
                key={s.id}
                onClick={() => toggleSymptom(s.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 14px',
                  border: `2px solid ${selected.includes(s.id) ? (s.severity >= 3 ? '#EF4444' : s.severity >= 2 ? '#F59E0B' : 'var(--primary)') : 'var(--border-light)'}`,
                  borderRadius: 'var(--radius)',
                  background: selected.includes(s.id) ? (s.severity >= 3 ? '#FEE2E2' : s.severity >= 2 ? '#FEF3C7' : 'var(--primary-light)') : 'white',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: selected.includes(s.id) ? 600 : 400,
                  color: selected.includes(s.id) ? (s.severity >= 3 ? '#991B1B' : s.severity >= 2 ? '#92400E' : 'var(--primary-dark)') : 'var(--text-secondary)',
                  transition: 'var(--transition)',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <span>{s.label}</span>
                {selected.includes(s.id) && <CheckCircle size={14} style={{ marginLeft: 'auto', flexShrink: 0 }} />}
              </button>
            ))}
          </div>

          {selected.length > 0 && (
            <div style={{ padding: '10px 14px', background: 'var(--bg)', borderRadius: 'var(--radius)', marginBottom: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
              <strong>{selected.length}</strong> symptom{selected.length > 1 ? 's' : ''} selected: {selected.map(id => symptoms.find(s => s.id === id)?.label).join(', ')}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={assess}>
              <Activity size={16} /> Start Assessment
            </button>
            <button className="btn btn-ghost" onClick={reset}>
              <RefreshCw size={14} /> Reset
            </button>
          </div>
        </div>

        {/* Result */}
        <div>
          {!assessed ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px 32px' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🩺</div>
              <h3 style={{ marginBottom: 8 }}>Ready to Assess</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Select your symptoms on the left and click "Start Assessment" to receive a care recommendation.</p>
            </div>
          ) : result && (
            <div className="card" style={{ border: `2px solid ${result.color}`, animation: 'slideUp 0.3s ease' }}>
              <div style={{ padding: '20px', background: result.bg, borderRadius: 'calc(var(--radius-md) - 2px)', marginBottom: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>{result.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: result.color }}>{result.title}</div>
                <span className="badge" style={{ background: result.color + '20', color: result.color, marginTop: 8 }}>{result.severity}</span>
              </div>

              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>{result.desc}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {result.level === 3 && (
                  <button className="btn btn-danger" style={{ justifyContent: 'center', padding: '14px' }} onClick={() => navigate(path('emergency'))}>
                    <Phone size={18} /> {result.action}
                  </button>
                )}
                {result.level === 1 && (
                  <button className="btn btn-primary" style={{ justifyContent: 'center' }} onClick={() => navigate(path('consultations'))}>
                    <Video size={16} /> {result.action}
                  </button>
                )}
                {result.level === 2 && (
                  <button className="btn btn-primary" style={{ justifyContent: 'center', background: result.color }} onClick={() => navigate(path('wards'))}>
                    {result.action}
                  </button>
                )}
                {result.level === 0 && (
                  <button className="btn btn-secondary" style={{ justifyContent: 'center' }} onClick={() => toast('Home care tips: Rest, hydrate, monitor temperature.', 'success')}>
                    <CheckCircle size={16} /> {result.action}
                  </button>
                )}
                <button className="btn btn-ghost" style={{ justifyContent: 'center' }} onClick={reset}>
                  <RefreshCw size={14} /> Start Over
                </button>
              </div>
            </div>
          )}

          {/* Color guide */}
          <div className="card" style={{ marginTop: 20 }}>
            <div className="section-title">Triage Color Guide</div>
            {recommendations.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border-light)' : 'none' }}>
                <span style={{ fontSize: 22 }}>{r.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: r.color }}>{r.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.severity} symptoms</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
