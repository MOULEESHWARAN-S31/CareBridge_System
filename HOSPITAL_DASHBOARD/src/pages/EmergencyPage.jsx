import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Phone, MapPin, AlertTriangle, Clock, Heart, ArrowRight, Activity, Plus, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRoleNav } from '../hooks/useRoleNav';
import { useToast } from '../components/Toast';
import { emergencyCases, EMERGENCY_CASES } from '../data/mockData';

const emergencyContacts = [
  { name: 'National Emergency', number: '112',             type: 'National',   color: '#EF4444' },
  { name: 'Ambulance (CATS)',   number: '108',             type: 'Ambulance',  color: '#F59E0B' },
  { name: 'CareConnect ER',     number: '+91 98765 43200', type: 'Hospital',   color: '#0EA5E9' },
  { name: 'Blood Bank',         number: '+91 98765 43202', type: 'Blood Bank', color: '#EF4444' },
  { name: 'Poison Control',     number: '1800-116-117',    type: 'Poison',     color: '#6366F1' },
];

const nearbyHospitals = [
  { name: 'CareConnect District Hospital', distance: '1.2 km', status: 'Available', beds: 42, emergency: true },
  { name: 'Civil Hospital Ludhiana',       distance: '3.4 km', status: 'Limited',   beds: 12, emergency: true },
  { name: 'Rural Hospital Sangrur',        distance: '8.7 km', status: 'Available', beds: 8,  emergency: false },
];

const severityColor = {
  Critical: { badge: '#EF4444', bg: '#FEE2E2', text: '#991B1B' },
  High:     { badge: '#F59E0B', bg: '#FEF3C7', text: '#92400E' },
  Moderate: { badge: '#0EA5E9', bg: '#E0F2FE', text: '#0369A1' },
};

// ── Triage queue — waiting patients not yet allocated beds
const TRIAGE_QUEUE = [
  { id: 'TRG001', patient: 'Unknown Patient (Male)', age: '~40', arrival: '2026-09-06 09:30', complaint: 'Unconscious – Found on road', severity: 'Critical', vitals: { bp: '—', spo2: '—', hr: '—', temp: '—' }, nurse: 'NRS004', status: 'Awaiting Assessment' },
  { id: 'TRG002', patient: 'Ramesh (walk-in)',       age: '55',  arrival: '2026-09-06 10:15', complaint: 'Severe chest pain, diaphoresis', severity: 'Critical', vitals: { bp: '160/110', spo2: '92%', hr: '110', temp: '37.2°C' }, nurse: 'NRS004', status: 'Vitals Recorded' },
  { id: 'TRG003', patient: 'Kavitha (walk-in)',      age: '28',  arrival: '2026-09-06 10:40', complaint: 'High fever 104°F + convulsions', severity: 'High',     vitals: { bp: '100/70', spo2: '97%', hr: '120', temp: '40.1°C' }, nurse: 'NRS007', status: 'Awaiting Doctor' },
  { id: 'TRG004', patient: 'Anand (RTA)',            age: '35',  arrival: '2026-09-06 11:00', complaint: 'Head injury + laceration arm',  severity: 'High',     vitals: { bp: '110/80', spo2: '96%', hr: '98',  temp: '36.8°C' }, nurse: 'NRS004', status: 'Vitals Recorded' },
];

export default function EmergencyPage() {
  const navigate = useNavigate();
  const { path } = useRoleNav();
  const toast = useToast();
  const location = useLocation();
  const currentPath = location.pathname;

  const isTriage   = currentPath.endsWith('/triage');
  const isCritical = currentPath.endsWith('/critical');
  const isCases    = currentPath.endsWith('/cases');

  // ── TRIAGE VIEW
  if (isTriage) {
    return (
      <div className="page-content page-transition">
        <div className="page-header">
          <div>
            <div className="page-title">Triage Assessment</div>
            <div className="page-subtitle">{TRIAGE_QUEUE.length} patients awaiting triage</div>
          </div>
          <button className="btn btn-danger" onClick={() => toast('New triage entry created.', 'info')}><Plus size={15}/> New Patient</button>
        </div>

        {/* Triage Legend */}
        <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
          {[
            { label:'🔴 Critical — Immediate (< 1 min)',  color:'#EF4444', bg:'#FEE2E2' },
            { label:'🟡 High — Urgent (< 15 min)',        color:'#F59E0B', bg:'#FEF3C7' },
            { label:'🟢 Moderate — Semi-urgent (< 1 hr)', color:'#10B981', bg:'#D1FAE5' },
          ].map((t,i) => (
            <div key={i} style={{ padding:'6px 14px', background:t.bg, borderRadius:20, fontSize:12, fontWeight:600, color:t.color }}>
              {t.label}
            </div>
          ))}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {TRIAGE_QUEUE.map(p => {
            const sc = severityColor[p.severity] || severityColor.Moderate;
            return (
              <div key={p.id} className="card" style={{ padding:'20px', borderLeft:`4px solid ${sc.badge}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14, flexWrap:'wrap', gap:10 }}>
                  <div>
                    <div style={{ fontWeight:800, fontSize:15, color:'var(--text-primary)', marginBottom:4 }}>{p.patient}</div>
                    <div style={{ fontSize:12, color:'var(--text-muted)' }}>Age: {p.age} · Arrived: {p.arrival.split(' ')[1]} · Nurse: {p.nurse}</div>
                  </div>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <span style={{ padding:'4px 12px', background:sc.bg, color:sc.badge, fontSize:12, fontWeight:700, borderRadius:20 }}>{p.severity}</span>
                    <span style={{ padding:'4px 12px', background:'var(--bg)', color:'var(--text-muted)', fontSize:11, borderRadius:20, border:'1px solid var(--border-light)' }}>{p.status}</span>
                  </div>
                </div>
                <div style={{ background:'var(--bg)', borderRadius:8, padding:'12px 14px', marginBottom:14 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)' }}>Chief Complaint: </span>
                  <span style={{ fontSize:13, color:'var(--text-primary)' }}>{p.complaint}</span>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:14 }}>
                  {[
                    { label:'BP',   value:p.vitals.bp,   icon:'💉' },
                    { label:'SpO₂', value:p.vitals.spo2, icon:'🫁' },
                    { label:'HR',   value:p.vitals.hr,   icon:'❤️' },
                    { label:'Temp', value:p.vitals.temp, icon:'🌡️' },
                  ].map((v,i) => (
                    <div key={i} style={{ textAlign:'center', padding:'10px', background:'white', borderRadius:8, border:'1px solid var(--border-light)' }}>
                      <div style={{ fontSize:16, marginBottom:2 }}>{v.icon}</div>
                      <div style={{ fontWeight:800, fontSize:14, color: v.value==='—'?'var(--text-muted)':'var(--text-primary)' }}>{v.value || '—'}</div>
                      <div style={{ fontSize:10, color:'var(--text-muted)' }}>{v.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn btn-primary btn-sm" onClick={() => toast(`Assigning bed for ${p.patient}...`,'success')}>Assign Bed</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => toast('Doctor notified.','info')}>Call Doctor</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => toast('Vitals form opened.','info')}>Update Vitals</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── CRITICAL CASES VIEW
  if (isCritical) {
    const criticalCases = EMERGENCY_CASES.filter(c => c.severity === 'Critical');
    return (
      <div className="page-content page-transition">
        <div className="page-header">
          <div>
            <div className="page-title" style={{ color:'#EF4444' }}>🚨 Critical Cases</div>
            <div className="page-subtitle">{criticalCases.length} critical patients requiring immediate attention</div>
          </div>
          <button className="btn btn-danger" onClick={() => toast('Critical alert broadcast sent!','info')}>
            <AlertTriangle size={15}/> Broadcast Alert
          </button>
        </div>

        {/* Alert Banner */}
        <div style={{ padding:'16px 20px', background:'linear-gradient(135deg,#FEE2E2,#FECACA)', border:'1px solid #FECACA', borderRadius:'var(--radius-md)', marginBottom:24, display:'flex', gap:14, alignItems:'center' }}>
          <AlertTriangle size={22} color="#EF4444" />
          <div>
            <div style={{ fontWeight:800, color:'#991B1B', fontSize:14 }}>{criticalCases.length} CRITICAL PATIENTS — All hands required</div>
            <div style={{ fontSize:12, color:'#B91C1C', marginTop:2 }}>Ensure ICU bed availability and attending specialist presence at all times.</div>
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {criticalCases.map(c => (
            <div key={c.id} className="card" style={{ padding:'20px', borderLeft:'5px solid #EF4444', background:'linear-gradient(to right,#FFF5F5,white)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14, flexWrap:'wrap', gap:10 }}>
                <div>
                  <div style={{ fontWeight:800, fontSize:16, color:'var(--text-primary)', marginBottom:4 }}>{c.patient}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>Bed {c.bed} · Arrived {c.arrival.split(' ')[1]} · Dr. {c.doctor}</div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <span style={{ padding:'5px 14px', background:'#FEE2E2', color:'#991B1B', fontWeight:800, fontSize:13, borderRadius:20 }}>CRITICAL</span>
                  <span className={`badge ${c.status==='Active'?'badge-danger':'badge-info'}`}>{c.status}</span>
                </div>
              </div>
              <div style={{ background:'#FEE2E2', borderRadius:8, padding:'10px 14px', marginBottom:14 }}>
                <span style={{ fontWeight:700, fontSize:12, color:'#991B1B' }}>Presenting Complaint: </span>
                <span style={{ fontSize:13 }}>{c.complaint}</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
                <div style={{ background:'white', borderRadius:8, padding:'12px', border:'1px solid #FECACA' }}>
                  <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>BLOOD PRESSURE</div>
                  <div style={{ fontWeight:800, fontSize:18, color: parseFloat(c.bp)<100?'#EF4444':'var(--text-primary)' }}>{c.bp}</div>
                </div>
                <div style={{ background:'white', borderRadius:8, padding:'12px', border:'1px solid #FECACA' }}>
                  <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>SPO₂</div>
                  <div style={{ fontWeight:800, fontSize:18, color: parseInt(c.spo2)<95?'#EF4444':'#10B981' }}>{c.spo2}</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button className="btn btn-danger btn-sm" onClick={() => toast(`Code Blue — ${c.patient}!`,'error')}>Code Blue</button>
                <button className="btn btn-secondary btn-sm" onClick={() => toast('Specialist called.','info')}>Call Specialist</button>
                <button className="btn btn-ghost btn-sm" onClick={() => toast('Updating case notes...','info')}>Update Notes</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── ACTIVE CASES VIEW (/cases or /emergency routes)
  if (isCases) {
    return (
      <div className="page-content page-transition">
        <div className="page-header">
          <div>
            <div className="page-title">Active Emergency Cases</div>
            <div className="page-subtitle">{EMERGENCY_CASES.length} active cases in the emergency department</div>
          </div>
          <button className="btn btn-primary" onClick={() => toast('New case created.','info')}><Plus size={15}/> New Case</button>
        </div>

        {/* Summary */}
        <div className="grid grid-4" style={{ marginBottom:24 }}>
          {[
            { label:'Active Cases',    value: EMERGENCY_CASES.filter(c=>c.status==='Active').length,   color:'#EF4444', bg:'#FEE2E2' },
            { label:'Critical',        value: EMERGENCY_CASES.filter(c=>c.severity==='Critical').length, color:'#DC2626', bg:'#FEE2E2' },
            { label:'Triaged',         value: EMERGENCY_CASES.filter(c=>c.status==='Triaged').length,   color:'#F59E0B', bg:'#FEF3C7' },
            { label:'Admitted from ER',value: EMERGENCY_CASES.filter(c=>c.status==='Admitted').length,  color:'#10B981', bg:'#D1FAE5' },
          ].map((s,i) => (
            <div key={i} className="stat-card">
              <div style={{ fontSize:28, fontWeight:800, color:s.color, marginBottom:4 }}>{s.value}</div>
              <div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {EMERGENCY_CASES.map(c => {
            const sc = severityColor[c.severity] || severityColor.Moderate;
            return (
              <div key={c.id} className="card" style={{ padding:'18px 20px', borderLeft:`4px solid ${sc.badge}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                      <span style={{ fontWeight:800, fontSize:14 }}>{c.patient}</span>
                      <span style={{ padding:'2px 10px', background:sc.bg, color:sc.badge, fontSize:11, fontWeight:700, borderRadius:20 }}>{c.severity}</span>
                      <span className={`badge ${c.status==='Active'?'badge-danger':c.status==='Admitted'?'badge-success':'badge-warning'}`}>{c.status}</span>
                    </div>
                    <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:6 }}>{c.complaint}</div>
                    <div style={{ display:'flex', gap:16, fontSize:12, color:'var(--text-muted)', flexWrap:'wrap' }}>
                      <span>🛏 {c.bed}</span>
                      <span>👨‍⚕️ {c.doctor}</span>
                      <span>🕐 {c.arrival.split(' ')[1]}</span>
                      <span style={{ fontWeight:600, color: parseInt(c.bp)<100?'#EF4444':'inherit' }}>BP: {c.bp}</span>
                      <span style={{ fontWeight:600, color: parseInt(c.spo2)<94?'#EF4444':'#10B981' }}>SpO₂: {c.spo2}</span>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => toast(`Viewing ${c.patient}...`,'info')}>View</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => toast('Updating notes...','info')}>Notes</button>
                    {c.status === 'Active' && (
                      <button className="btn btn-primary btn-sm" onClick={() => toast(`${c.patient} admitted to ward.`,'success')}>Admit</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── DEFAULT: General Emergency landing page (for non-emergency-staff using this page)
  return (
    <div className="page-content page-transition">
      {/* Emergency Banner */}
      <div style={{ background:'linear-gradient(135deg,#EF4444,#DC2626)', borderRadius:'var(--radius-lg)', padding:'28px 32px', marginBottom:28, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-20, top:-20, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
            <AlertTriangle size={28} color="white" />
            <h2 style={{ color:'white', fontSize:'1.4rem' }}>Emergency Services</h2>
          </div>
          <p style={{ color:'rgba(255,255,255,0.85)', fontSize:14, marginBottom:20 }}>
            24/7 Emergency care and support. Contact emergency services immediately for life-threatening situations.
          </p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <button style={{ display:'flex', alignItems:'center', gap:8, padding:'13px 24px', background:'white', color:'#EF4444', borderRadius:'var(--radius-full)', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:15, fontWeight:700, boxShadow:'0 4px 16px rgba(0,0,0,0.2)' }}
              onClick={() => toast('Calling emergency services...','info')}>
              <Phone size={18}/> Call Emergency Now
            </button>
            <button style={{ display:'flex', alignItems:'center', gap:8, padding:'13px 24px', background:'rgba(255,255,255,0.15)', color:'white', borderRadius:'var(--radius-full)', border:'2px solid rgba(255,255,255,0.4)', cursor:'pointer', fontFamily:'inherit', fontSize:15, fontWeight:600 }}
              onClick={() => toast('Ambulance requested! ETA: 8 minutes.','success')}>
              🚑 Request Ambulance
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom:24 }}>
        {/* Emergency Contacts */}
        <div className="card">
          <div className="section-title">Emergency Contacts</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:12 }}>
            {emergencyContacts.map((c,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', background:'var(--bg)', borderRadius:'var(--radius)', border:`1px solid ${c.color}20` }}>
                <div style={{ width:36, height:36, borderRadius:10, background:c.color+'15', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Phone size={15} color={c.color}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:600 }}>{c.name}</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)' }}>{c.type}</div>
                </div>
                <button style={{ fontWeight:800, fontSize:13, color:c.color, background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}
                  onClick={() => toast(`Calling ${c.number}...`,'info')}>{c.number}</button>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Hospitals */}
        <div className="card">
          <div className="section-title">Nearest Hospitals</div>
          <div style={{ display:'flex', flexDirection:'column', gap:12, marginTop:12 }}>
            {nearbyHospitals.map((h,i) => (
              <div key={i} style={{ padding:'14px', background:'var(--bg)', borderRadius:'var(--radius)', border:`1px solid ${h.status==='Available'?'var(--success-light)':'var(--warning-light)'}` }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:8 }}>
                  <div style={{ fontWeight:600, fontSize:13 }}>{h.name}</div>
                  <span className={`badge badge-${h.status==='Available'?'success':'warning'}`}>{h.status}</span>
                </div>
                <div style={{ fontSize:12, color:'var(--text-muted)', display:'flex', gap:12, flexWrap:'wrap' }}>
                  <span><MapPin size={12} style={{ display:'inline' }}/> {h.distance}</span>
                  <span>🛏 {h.beds} beds</span>
                  {h.emergency && <span style={{ color:'var(--danger)', fontWeight:600 }}>🚨 ER</span>}
                </div>
                <button className="btn btn-primary btn-sm" style={{ width:'100%', justifyContent:'center', marginTop:10 }}
                  onClick={() => toast(`Getting directions to ${h.name}...`,'info')}>
                  Directions <ArrowRight size={13}/>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Cases Quick View */}
        <div className="card">
          <div className="section-title">Active ER Cases</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:12 }}>
            {EMERGENCY_CASES.map(c => {
              const sc = severityColor[c.severity] || severityColor.Moderate;
              return (
                <div key={c.id} style={{ padding:'12px', background:'var(--bg)', borderRadius:'var(--radius)', borderLeft:`3px solid ${sc.badge}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                    <span style={{ fontWeight:600, fontSize:13 }}>{c.patient}</span>
                    <span style={{ fontSize:11, padding:'2px 8px', background:sc.bg, color:sc.badge, borderRadius:10, fontWeight:700 }}>{c.severity}</span>
                  </div>
                  <div style={{ fontSize:11, color:'var(--text-muted)' }}>{c.complaint}</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>Bed {c.bed} · {c.doctor}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
