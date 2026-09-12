import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Users, Clock, CheckCircle2, Video, ArrowLeftRight, Bed, TrendingUp
} from 'lucide-react';
import { analyticsData } from '../data/mockData';

const periods = ['Today', 'This Week', 'This Month', 'This Year'];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('Today');

  // Exact metrics requested:
  // - Total Patients Today: 248
  // - Average Waiting Time: 32 min
  // - Appointments Completed: 186
  // - Teleconsultations: 42
  // - Referrals: 28
  // - Bed Occupancy: 76%
  const performanceKPIs = [
    {
      label: 'Total Patients Today',
      value: '248',
      icon: Users,
      color: '#0EA5E9',
      bg: '#E0F2FE',
      subtitle: '+12% vs previous day'
    },
    {
      label: 'Average Waiting Time',
      value: '32 min',
      icon: Clock,
      color: '#F59E0B',
      bg: '#FEF3C7',
      subtitle: 'Target: < 30 min'
    },
    {
      label: 'Appointments Completed',
      value: '186',
      icon: CheckCircle2,
      color: '#10B981',
      bg: '#D1FAE5',
      subtitle: '94% completion rate'
    },
    {
      label: 'Teleconsultations',
      value: '42',
      icon: Video,
      color: '#8B5CF6',
      bg: '#EDE9FE',
      subtitle: 'All sessions logged'
    },
    {
      label: 'Referrals',
      value: '28',
      icon: ArrowLeftRight,
      color: '#0D9488',
      bg: '#CCFBF1',
      subtitle: '19 In · 9 Out'
    },
    {
      label: 'Bed Occupancy',
      value: '76%',
      icon: Bed,
      color: '#EC4899',
      bg: '#FCE7F3',
      subtitle: '244 / 328 beds occupied'
    },
  ];

  return (
    <div className="page-content page-transition">
      <div className="page-header">
        <div>
          <h1 className="page-title">Hospital Performance</h1>
          <div className="page-subtitle">
            Operational & Clinical Performance Metrics · Salem District Hospital
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'white', borderRadius: 'var(--radius-full)', padding: 4, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          {periods.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: '6px 14px',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
                background: period === p ? 'var(--primary)' : 'transparent',
                color: period === p ? 'white' : 'var(--text-secondary)',
                transition: 'var(--transition)',
                whiteSpace: 'nowrap'
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Hospital Performance 6 Key KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 14,
          marginBottom: 24
        }}
      >
        {performanceKPIs.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div
              key={i}
              className="stat-card"
              style={{
                borderTop: `4px solid ${kpi.color}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {kpi.label}
                </span>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={kpi.color} />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: kpi.color, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {kpi.value}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                {kpi.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Charts Row 1 */}
      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        {/* Patient Visits Area Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Patient Admissions & Consultations Trend</div>
            <span className="badge badge-success">↑ 12% Growth</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={analyticsData.patientVisits}>
              <defs>
                <linearGradient id="pg1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D9488" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="last" stroke="#CBD5E1" strokeWidth={2} fill="url(#pg2)" name="Last Year" strokeDasharray="5 5" />
              <Area type="monotone" dataKey="visits" stroke="#0EA5E9" strokeWidth={2.5} fill="url(#pg1)" name="This Year" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Teleconsultations Bar */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Teleconsultations Completed This Week</div>
            <span className="badge badge-primary">42 this week</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={analyticsData.teleconsultations} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="count" name="Consultations" fill="#0EA5E9" radius={[6, 6, 0, 0]}>
                {analyticsData.teleconsultations.map((_, i) => (
                  <Cell key={i} fill={i === 4 ? '#0D9488' : '#0EA5E9'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Charts Row 2 */}
      <div className="grid grid-3" style={{ marginBottom: 24 }}>
        {/* Referral Status Pie */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Hospital Referral Distribution</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={analyticsData.referralStatus}
                cx="50%"
                cy="50%"
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                fontSize={10}
              >
                {analyticsData.referralStatus.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
            {analyticsData.referralStatus.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: r.color }} />
                <span style={{ color: 'var(--text-secondary)' }}>{r.name}: <strong>{r.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Appointment Types */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Completed Appointment Types</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={analyticsData.appointmentTypes}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {analyticsData.appointmentTypes.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} formatter={(v) => [`${v}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
            {analyticsData.appointmentTypes.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: t.color }} />
                <span style={{ color: 'var(--text-secondary)' }}>{t.name}: <strong>{t.value}%</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Load Conditions */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Top Clinical Conditions Treated</div>
          </div>
          <div style={{ marginTop: 8 }}>
            {analyticsData.commonDiseases.map((d, i) => {
              const maxCases = Math.max(...analyticsData.commonDiseases.map(x => x.cases));
              const pct = (d.cases / maxCases) * 100;
              return (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{d.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{d.cases} cases</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        borderRadius: 'var(--radius-full)',
                        background: `linear-gradient(90deg, #0EA5E9, #10B981)`,
                        transition: 'width 0.5s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
