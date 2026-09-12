import { useNavigate } from 'react-router-dom';
import { useRoleNav } from '../hooks/useRoleNav';
import {
  Users, Calendar, Video, ArrowLeftRight, FlaskConical, Pill,
  UserPlus, ClipboardList, Bed, AlertTriangle, Ambulance,
  PackageOpen, FileText, Activity, TrendingUp, TrendingDown,
  ArrowRight, Clock
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { analyticsData, appointments, notifications } from '../data/mockData';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function DashboardHome() {
  const navigate = useNavigate();
  const { path } = useRoleNav();
  const toast = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();

  // Safe fallback
  const displayUser = user || { name: 'Hospital Staff', role: 'Admin', hospital: 'CareConnect Hospital' };

  const stats = [
    { tKey: 'totalPatients',      value: '1,248', icon: Users,         color: '#0EA5E9', bg: '#E0F2FE', trend: '+12%', up: true,  route: path('patients') },
    { tKey: 'todayAppointments',  value: '86',    icon: Calendar,      color: '#0D9488', bg: '#CCFBF1', trend: '+5%',  up: true,  route: path('appointments') },
    { tKey: 'opdPatients',        value: '142',   icon: ClipboardList, color: '#6366F1', bg: '#EEF2FF', trend: '+9%',  up: true,  route: path('opd') },
    { tKey: 'pendingReferrals',   value: '24',    icon: ArrowLeftRight,color: '#F59E0B', bg: '#FEF3C7', trend: '-3%',  up: false, route: path('referrals') },
    { tKey: 'teleconsultations',  value: '38',    icon: Video,         color: '#8B5CF6', bg: '#F5F3FF', trend: '+18%', up: true,  route: path('consultations') },
    { tKey: 'pendingLabTests',    value: '17',    icon: FlaskConical,  color: '#10B981', bg: '#D1FAE5', trend: '-2%',  up: false, route: path('lab') },
    { tKey: 'availableBeds',      value: '64',    icon: Bed,           color: '#0D9488', bg: '#CCFBF1', trend: '-8',   up: false, route: path('wards') },
    { tKey: 'lowStockMedicines',  value: '12',    icon: Pill,          color: '#EF4444', bg: '#FEE2E2', trend: '+4',   up: false, route: path('pharmacy') },
    { tKey: 'emergencyCases',     value: '8',     icon: AlertTriangle, color: '#DC2626', bg: '#FEE2E2', trend: '+2',   up: false, route: path('emergency') },
  ];

  const quickActions = [
    { tKey: 'registerPatient',       icon: UserPlus,      color: '#0EA5E9', bg: '#E0F2FE', route: path('patients') },
    { tKey: 'scheduleAppointment',   icon: Calendar,      color: '#0D9488', bg: '#CCFBF1', route: path('appointments') },
    { tKey: 'createReferral',        icon: ArrowLeftRight,color: '#6366F1', bg: '#EEF2FF', route: path('referrals') },
    { tKey: 'requestLabTest',        icon: FlaskConical,  color: '#10B981', bg: '#D1FAE5', route: path('lab') },
    { tKey: 'dispenseMedicine',      icon: Pill,          color: '#F59E0B', bg: '#FEF3C7', route: path('pharmacy') },
    { tKey: 'startTeleconsult',      icon: Video,         color: '#8B5CF6', bg: '#F5F3FF', route: path('consultations') },
    { tKey: 'emergencyAction',       icon: AlertTriangle, color: '#EF4444', bg: '#FEE2E2', route: path('emergency') },
    { tKey: 'viewMedicalRecords',    icon: FileText,      color: '#0EA5E9', bg: '#E0F2FE', route: path('records') },
  ];

  const hour = new Date().getHours();
  const greetKey = hour < 12 ? 'goodMorning' : hour < 17 ? 'goodAfternoon' : 'goodEvening';
  const recentAlerts = notifications.filter(n => !n.read).slice(0, 3);

  const handleQuickAction = (action) => {
    toast(`${t(action.tKey)}...`, 'info');
    navigate(action.route);
  };

  return (
    <div className="page-content page-transition">
      {/* Greeting Banner */}
      <div className="greeting-banner">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>
            {t(greetKey)}, {displayUser.name.split(' ').slice(0, 2).join(' ')} 👋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: 4, fontSize: 14 }}>
            {t('portalTitle')} · CareConnect · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 'var(--radius-full)', padding: '6px 14px', fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
            🏥 {displayUser.role}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 'var(--radius-full)', padding: '6px 14px', fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
            📍 {displayUser.hospital || 'CareConnect Hospital'}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }} className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card" onClick={() => navigate(s.route)}
            style={{ cursor: 'pointer', borderTop: `3px solid ${s.color}` }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div className="stat-card-icon" style={{ background: s.bg }}><s.icon size={20} color={s.color} /></div>
              <span style={{ fontSize: 11, fontWeight: 700, color: s.up ? 'var(--success)' : 'var(--danger)', display: 'flex', alignItems: 'center', gap: 2 }}>
                {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{s.trend}
              </span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div className="stat-card-label" style={{ marginTop: 2 }}>{t(s.tKey)}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-title" style={{ marginBottom: 14 }}>⚡ {t('quickActions')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }} className="quick-actions-grid">
          {quickActions.map((qa, i) => (
            <button key={i} onClick={() => handleQuickAction(qa)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 10px', border: `1.5px solid ${qa.color}20`, borderRadius: 'var(--radius-md)', background: qa.bg, cursor: 'pointer', transition: 'var(--transition)', fontFamily: 'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${qa.color}25`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: qa.color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px ${qa.color}40` }}>
                <qa.icon size={18} color="white" />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.3 }}>{t(qa.tKey)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-2" style={{ marginBottom: 28 }}>
        {/* Patient Visits */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Patient Visits</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last 6 months vs previous year</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate(path('analytics'))}>
              View All <ArrowRight size={13} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={analyticsData.patientVisits}>
              <defs>
                <linearGradient id="visitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 12 }} />
              <Area type="monotone" dataKey="last" stroke="#CBD5E1" strokeWidth={2} fill="none" strokeDasharray="4 4" name="Last Year" />
              <Area type="monotone" dataKey="visits" stroke="#0EA5E9" strokeWidth={2.5} fill="url(#visitGrad)" name="This Year" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Referral Status */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Referral Overview</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Current referral status</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate(path('referrals'))}>
              Manage <ArrowRight size={13} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie data={analyticsData.referralStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {analyticsData.referralStatus.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {analyticsData.referralStatus.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: r.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{r.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-2">
        {/* Today's Appointments */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="section-title" style={{ margin: 0 }}>{t('todayAppointments')}</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate(path('appointments'))}>View All <ArrowRight size={13} /></button>
          </div>
          <div>
            {appointments.slice(0, 4).map((apt, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--border-light)', cursor: 'pointer', transition: 'var(--transition)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
                onClick={() => navigate(path('appointments'))}>
                <div className="avatar avatar-sm" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  {apt.patient.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{apt.patient}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{apt.doctor} · {apt.time}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span className={`badge badge-${apt.status === 'Confirmed' ? 'success' : apt.status === 'Pending' ? 'warning' : apt.status === 'Completed' ? 'primary' : 'danger'}`}>
                    {apt.status}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{apt.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="section-title" style={{ margin: 0 }}>Active Alerts</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate(path('notifications'))}>View All <ArrowRight size={13} /></button>
          </div>
          <div style={{ padding: '8px 0' }}>
            {recentAlerts.map((n, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 20px', cursor: 'pointer', transition: 'var(--transition)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
                onClick={() => navigate(path('notifications'))}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: n.type === 'warning' ? '#FEF3C7' : n.type === 'danger' ? '#FEE2E2' : '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {n.type === 'warning' ? <AlertTriangle size={16} color="#F59E0B" /> : n.type === 'danger' ? <AlertTriangle size={16} color="#EF4444" /> : <Activity size={16} color="#3B82F6" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{n.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.5 }}>{(n.message || '').slice(0, 70)}...</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={10} />{n.time}
                  </div>
                </div>
              </div>
            ))}
            {/* Weekly bar chart */}
            <div style={{ padding: '8px 20px 4px' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Teleconsultations This Week</div>
              <ResponsiveContainer width="100%" height={80}>
                <BarChart data={analyticsData.teleconsultations} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="count" fill="#0D9488" radius={[4, 4, 0, 0]} name="Consultations" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .greeting-banner {
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 60%, var(--accent) 100%);
          border-radius: var(--radius-lg);
          padding: 28px 32px;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          box-shadow: 0 8px 32px rgba(14,165,233,0.3);
          position: relative;
          overflow: hidden;
        }
        .greeting-banner::before {
          content: '';
          position: absolute;
          right: -40px;
          top: -40px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
        }
        .greeting-banner::after {
          content: '';
          position: absolute;
          right: 60px;
          bottom: -60px;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
        }
        .stats-grid { grid-template-columns: repeat(3, 1fr); }
        .quick-actions-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 1200px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .quick-actions-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .quick-actions-grid { grid-template-columns: repeat(2, 1fr); }
          .greeting-banner { padding: 20px; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr; }
          .quick-actions-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
