import { useLanguage } from '../../context/LanguageContext';
import { STATS, EMERGENCY_CASES } from '../../data/mockData';
import { Siren, AlertTriangle, Bed, Users, UserCheck, Activity } from 'lucide-react';

export default function EmergencyDashboard() {
  const { t } = useLanguage();
  const s = STATS.emergency;
  const statCards = [
    { label: t('emergency.activeCases'),    value: s.activeCases,    icon: Siren,         color: '#EF4444', bg: '#FEE2E2' },
    { label: t('emergency.criticalCases'),  value: s.criticalCases,  icon: AlertTriangle, color: '#DC2626', bg: '#FEE2E2' },
    { label: t('emergency.waitingTriage'),  value: s.waitingTriage,  icon: Users,         color: '#F59E0B', bg: '#FEF3C7' },
    { label: t('emergency.bedsAvailable'),  value: s.bedsAvailable,  icon: Bed,           color: '#10B981', bg: '#D1FAE5' },
    { label: t('emergency.doctorsOnDuty'),  value: s.doctorsOnDuty,  icon: UserCheck,     color: '#0EA5E9', bg: '#E0F2FE' },
    { label: t('emergency.nursesOnDuty'),   value: s.nursesOnDuty,   icon: Users,         color: '#8B5CF6', bg: '#EDE9FE' },
  ];

  return (
    <div className="fade-in">
      {/* Emergency alert banner */}
      <div style={{ background: 'linear-gradient(135deg, #DC2626, #EF4444)', borderRadius: 14, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Siren size={22} color="white" />
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>🚨 EMERGENCY DEPARTMENT — LIVE</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Arjun Singh · {s.criticalCases} critical cases · Immediate attention required</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button style={{ padding: '7px 14px', borderRadius: 9, background: 'white', color: '#DC2626', border: 'none', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>{t('emergency.registerEmergency')}</button>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((c, i) => (
          <div key={i} className="stat-card" style={{ borderLeft: `4px solid ${c.color}` }}>
            <div className="stat-icon" style={{ background: c.bg }}><c.icon size={20} color={c.color} /></div>
            <div className="stat-label">{c.label}</div>
            <div className="stat-value">{c.value}</div>
          </div>
        ))}
      </div>

      {/* Live Cases */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <div>
            <div className="card-title">🚨 {t('emergency.activeCases')} — Live Status</div>
            <div className="card-subtitle">Last updated: Just now</div>
          </div>
          <button className="btn btn-danger btn-sm">{t('emergency.registerEmergency')}</button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr><th>Case ID</th><th>Patient</th><th>{t('emergency.arrivalTime')}</th><th>{t('emergency.chiefComplaint')}</th><th>{t('emergency.severity')}</th><th>Bed</th><th>BP</th><th>SpO₂</th><th>Doctor</th><th>{t('common.status')}</th><th>{t('common.actions')}</th></tr>
              </thead>
              <tbody>
                {EMERGENCY_CASES.map(e => (
                  <tr key={e.id} className={e.severity === 'Critical' ? 'critical-row' : ''}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: '#6B7280' }}>{e.id}</td>
                    <td className="table-patient-name">{e.patient}</td>
                    <td style={{ color: '#374151', fontSize: 12 }}>{e.arrival.split(' ')[1]}</td>
                    <td style={{ color: '#374151', fontSize: 12, maxWidth: 180 }}>{e.complaint}</td>
                    <td><span className={`severity-${e.severity.toLowerCase()}`}>{e.severity}</span></td>
                    <td style={{ fontWeight: 700, color: '#0F172A' }}>{e.bed}</td>
                    <td style={{ fontWeight: 600, fontSize: 12, color: '#374151' }}>{e.bp}</td>
                    <td style={{ fontWeight: 600, fontSize: 12, color: e.spo2 && parseInt(e.spo2) < 92 ? '#EF4444' : '#10B981' }}>{e.spo2}</td>
                    <td style={{ color: '#374151', fontSize: 12 }}>{e.doctor}</td>
                    <td><span className={`badge ${e.status === 'Active' ? 'badge-danger' : e.status === 'Triaged' ? 'badge-warning' : 'badge-info'}`}>{e.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-secondary btn-xs">{t('emergency.triage')}</button>
                        <button className="btn btn-danger btn-xs">Alert</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Triage Guide */}
      <div className="card">
        <div className="card-header"><div className="card-title">📊 Triage Reference</div></div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[
              { level: 'Level 1', name: 'Resuscitation', color: '#DC2626', bg: '#FEE2E2', desc: 'Immediate threat to life', icon: '🔴' },
              { level: 'Level 2', name: 'Emergent', color: '#F97316', bg: '#FFEDD5', desc: 'High risk, urgent', icon: '🟠' },
              { level: 'Level 3', name: 'Urgent', color: '#F59E0B', bg: '#FEF3C7', desc: 'Important but not immediate', icon: '🟡' },
              { level: 'Level 4', name: 'Semi-Urgent', color: '#10B981', bg: '#D1FAE5', desc: 'Less urgent, can wait', icon: '🟢' },
            ].map((t_item, i) => (
              <div key={i} style={{ background: t_item.bg, borderRadius: 12, padding: '14px', borderLeft: `4px solid ${t_item.color}` }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{t_item.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: t_item.color }}>{t_item.level}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>{t_item.name}</div>
                <div style={{ fontSize: 11, color: '#374151' }}>{t_item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
