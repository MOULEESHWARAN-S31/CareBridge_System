import { useLanguage } from '../../context/LanguageContext';
import { STATS, DOCTORS, NURSES } from '../../data/mockData';
import { Users, Stethoscope, UserCheck, Building2, Calendar, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DEPT_CHART = [
  { dept: 'Medicine',  doctors: 4, nurses: 18 },
  { dept: 'Surgery',   doctors: 3, nurses: 12 },
  { dept: 'Pediatrics',doctors: 2, nurses: 8  },
  { dept: 'Cardiology',doctors: 2, nurses: 6  },
  { dept: 'Emergency', doctors: 3, nurses: 10 },
];

export default function HRDashboard() {
  const { t } = useLanguage();
  const s = STATS.hr;
  const statCards = [
    { label: t('hr.totalStaff'),     value: s.totalStaff, icon: Users,       color: '#6366F1', bg: '#EDE9FE' },
    { label: t('hr.doctors'),        value: s.doctors,    icon: Stethoscope, color: '#0EA5E9', bg: '#E0F2FE' },
    { label: t('hr.nurses'),         value: s.nurses,     icon: UserCheck,   color: '#10B981', bg: '#D1FAE5' },
    { label: t('hr.labStaff'),       value: s.labStaff,   icon: Users,       color: '#8B5CF6', bg: '#EDE9FE' },
    { label: t('hr.pharmacyStaff'),  value: s.pharmacyStaff, icon: Users,    color: '#EC4899', bg: '#FCE7F3' },
    { label: t('hr.onDuty'),         value: s.onDuty,     icon: Building2,   color: '#14B8A6', bg: '#CCFBF1' },
    { label: t('hr.onLeave'),        value: s.onLeave,    icon: Calendar,    color: '#F59E0B', bg: '#FEF3C7' },
  ];

  return (
    <div className="fade-in">
      <div className="dashboard-header">
        <div>
          <div className="dashboard-title">👥 {t('hr.title')}</div>
          <div className="dashboard-subtitle">Divya Menon · Human Resources Department</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm">{t('hr.manageShifts')}</button>
          <button className="btn btn-primary btn-sm">{t('hr.addEmployee')}</button>
        </div>
      </div>
      <div className="stats-grid">
        {statCards.map((c, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: c.bg }}><c.icon size={20} color={c.color} /></div>
            <div className="stat-label">{c.label}</div>
            <div className="stat-value">{c.value}</div>
          </div>
        ))}
      </div>
      <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="card-header"><div className="card-title">📊 Staff by Department</div></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={DEPT_CHART} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="dept" tick={{ fill: '#6B7280', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="doctors" fill="#0EA5E9" radius={[4,4,0,0]} name="Doctors" />
                <Bar dataKey="nurses" fill="#10B981" radius={[4,4,0,0]} name="Nurses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">⚡ {t('common.quickActions')}</div></div>
          <div className="card-body">
            <div className="quick-actions-grid">
              {[
                { label: t('hr.addEmployee'), icon: Users, color: '#0EA5E9' },
                { label: t('hr.manageShifts'), icon: Calendar, color: '#10B981' },
                { label: t('hr.viewAttendance'), icon: UserCheck, color: '#8B5CF6' },
                { label: t('hr.approveLeave'), icon: BarChart3, color: '#F59E0B' },
              ].map((a, i) => (
                <button key={i} className="quick-action-btn">
                  <div className="qa-icon" style={{ background: `${a.color}18` }}><a.icon size={18} color={a.color} /></div>
                  <span>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Doctors Table */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <div className="card-title">👨‍⚕️ {t('hr.employees')} — {t('common.doctors')}</div>
          <button className="btn btn-primary btn-sm">{t('hr.addEmployee')}</button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr><th>{t('hr.empId')}</th><th>{t('common.name')}</th><th>{t('common.department')}</th><th>Qualification</th><th>Patients</th><th>{t('common.phone')}</th><th>{t('common.status')}</th></tr>
              </thead>
              <tbody>
                {DOCTORS.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#6B7280' }}>{d.id}</td>
                    <td className="table-patient-name">{d.name}</td>
                    <td style={{ color: '#374151', fontSize: 12 }}>{d.department}</td>
                    <td style={{ color: '#6B7280', fontSize: 12 }}>{d.qualification}</td>
                    <td style={{ fontWeight: 700, color: '#0F172A' }}>{d.patients}</td>
                    <td style={{ color: '#374151', fontSize: 12 }}>{d.phone}</td>
                    <td><span className={`badge ${d.available ? 'badge-success' : 'badge-warning'}`}>{d.available ? t('common.active') : 'In Consultation'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Nurses Table */}
      <div className="card">
        <div className="card-header"><div className="card-title">👩‍⚕️ {t('common.nurses')}</div></div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr><th>{t('hr.empId')}</th><th>{t('common.name')}</th><th>{t('nurse.ward')}</th><th>{t('hr.shift')}</th><th>Patients</th><th>{t('common.status')}</th></tr>
              </thead>
              <tbody>
                {NURSES.map(n => (
                  <tr key={n.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#6B7280' }}>{n.id}</td>
                    <td className="table-patient-name">{n.name}</td>
                    <td style={{ color: '#374151', fontSize: 12 }}>{n.ward}</td>
                    <td><span className="tag">{n.shift}</span></td>
                    <td style={{ fontWeight: 700, color: '#0F172A' }}>{n.patients}</td>
                    <td><span className={`badge ${n.status === 'On Duty' ? 'badge-success' : 'badge-warning'}`}>{n.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
