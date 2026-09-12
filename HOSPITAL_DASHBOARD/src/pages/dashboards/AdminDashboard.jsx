import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Calendar, Bed, AlertTriangle, FlaskConical, Pill, ArrowLeftRight,
  Stethoscope, Siren, CheckCircle2, Clock, ChevronRight, Activity,
  Sparkles, RefreshCw, Volume2, ShieldCheck, TrendingUp, AlertCircle,
  FileText, ArrowRight, ExternalLink, HelpCircle
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import {
  HOSPITAL_INFO, CAREBRIDGE_ECOSYSTEM, CAREBRIDGE_KPIS,
  BED_STATISTICS, DEPARTMENTS, CRITICAL_LAB_RESULTS, CHART_DATA
} from '../../data/mockData';
import { ROLE_ROUTES } from '../../auth/accounts';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const base = ROLE_ROUTES[user?.roleId] || '/admin/dashboard';

  // State for OPD Queue caller simulation
  const [currentToken, setCurrentToken] = useState('A102');
  const [tokenCalledNotice, setTokenCalledNotice] = useState('');
  const [acknowledgedCrits, setAcknowledgedCrits] = useState({});

  function handleCallNextPatient() {
    const prefix = currentToken[0];
    const num = parseInt(currentToken.slice(1), 10) + 1;
    const next = `${prefix}${num}`;
    setCurrentToken(next);
    setTokenCalledNotice(`Calling Token ${next} to Consultation Room 4...`);
    setTimeout(() => setTokenCalledNotice(''), 4000);
  }

  function handleAcknowledgeCrit(id) {
    setAcknowledgedCrits(prev => ({ ...prev, [id]: true }));
  }

  return (
    <div className="fade-in" style={{ paddingBottom: 32 }}>
      {/* ── 1. Hospital Header Banner ─────────────────────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          padding: '20px 24px',
          border: '1px solid #E2E8F0',
          marginBottom: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                {HOSPITAL_INFO.name}
              </span>
              <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                NABH ACCREDITED
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#64748B', marginTop: 3 }}>
              <strong>{HOSPITAL_INFO.todayDate}</strong> · Tamil Nadu State Health Network · Node #42-Salem
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => navigate(`${base}/reports`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                borderRadius: 8,
                background: '#0EA5E9',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <FileText size={14} />
              <span>Generate Daily Report</span>
            </button>
          </div>
        </div>

        {/* CareBridge Connected Ecosystem Pipeline */}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: '10.5px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: 6 }}>
            CareBridge Integrated Health Highway:
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', fontSize: '11.5px', fontWeight: 600 }}>
            {CAREBRIDGE_ECOSYSTEM.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '3px 9px', borderRadius: 6, color: '#334155' }}>
                  {step.name}
                </span>
                {i < CAREBRIDGE_ECOSYSTEM.length - 1 && <span style={{ color: '#0EA5E9', fontWeight: 700 }}>→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. Interactive KPI Cards (Section 6 & 44) ──────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
          marginBottom: 16
        }}
      >
        {CAREBRIDGE_KPIS.map(kpi => (
          <div
            key={kpi.id}
            onClick={() => navigate(`${base}/${kpi.route}`)}
            style={{
              background: '#FFFFFF',
              borderRadius: 12,
              padding: '16px 18px',
              border: '1px solid #E2E8F0',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.15s ease-in-out',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
              e.currentTarget.style.borderColor = kpi.color;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }}
            title={`Click to open ${kpi.label} details`}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {kpi.label}
              </span>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: kpi.color }} />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              {kpi.value}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, fontSize: '11px' }}>
              <span style={{ color: kpi.dir === 'up' ? '#16A34A' : kpi.dir === 'down' ? '#DC2626' : '#64748B', fontWeight: 600 }}>
                {kpi.change}
              </span>
              <ChevronRight size={14} color="#94A3B8" />
            </div>
          </div>
        ))}
      </div>



      {/* ── 4. Operational Grid: OPD Caller, Bed Summary, Critical Lab Alerts ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 16 }}>
        
        {/* Live OPD Queue Caller (Section 9) */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 14,
            padding: '18px 20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={16} color="#0EA5E9" />
                <span>Live OPD Queue Control</span>
              </div>
              <span style={{ fontSize: '10px', background: '#E0F2FE', color: '#0369A1', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                TOKEN DISPENSARY
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Current Calling Token</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#0EA5E9', marginTop: 2 }}>{currentToken}</div>
                <div style={{ fontSize: '10.5px', color: '#64748B' }}>Room 4 · Dr. Priya Sharma</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Waiting Queue</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#D97706', marginTop: 2 }}>186</div>
                <div style={{ fontSize: '10.5px', color: '#64748B' }}>Avg Wait: 32m · Consult: 14m</div>
              </div>
            </div>

            {tokenCalledNotice && (
              <div style={{ padding: '8px 12px', background: '#DCFCE7', borderRadius: 6, color: '#15803D', fontSize: '11.5px', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Volume2 size={14} />
                <span>{tokenCalledNotice}</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleCallNextPatient}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 8,
                background: '#0EA5E9',
                border: 'none',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                boxShadow: '0 2px 6px rgba(14,165,233,0.3)'
              }}
            >
              <Volume2 size={15} />
              <span>Call Next Patient</span>
            </button>
            <button
              onClick={() => navigate(`${base}/opd`)}
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                color: '#334155',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Full Queue →
            </button>
          </div>
        </div>

        {/* Bed Status Summary (Section 15) */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 14,
            padding: '18px 20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Bed size={16} color="#0EA5E9" />
                <span>Ward & Bed Occupancy</span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669' }}>
                {BED_STATISTICS.available} Available / {BED_STATISTICS.total} Total
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 12 }}>
              {BED_STATISTICS.wards.map(ward => (
                <div key={ward.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: '#334155', marginBottom: 3 }}>
                    <span>{ward.name}</span>
                    <span>
                      <strong style={{ color: '#059669' }}>{ward.available} free</strong> ({ward.occupied}/{ward.total} occ)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: 6, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${(ward.occupied / ward.total) * 100}%`,
                        height: '100%',
                        background: ward.color,
                        borderRadius: 4
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate(`${base}/wards`)}
            style={{
              width: '100%',
              padding: '9px',
              borderRadius: 8,
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              color: '#0EA5E9',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <span>Open Ward-Level Bed Map</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Critical Lab Alerts & Triage Callout (Section 20 & 27) */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 14,
            padding: '18px 20px',
            border: '1px solid #FECACA',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#991B1B', display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertCircle size={16} color="#DC2626" />
                <span>Critical Results Callout</span>
              </div>
              <span style={{ fontSize: '10px', background: '#FEE2E2', color: '#991B1B', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                STAT ACTION
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              {CRITICAL_LAB_RESULTS.map(crit => (
                <div
                  key={crit.id}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: acknowledgedCrits[crit.id] ? '#F8FAFC' : '#FEF2F2',
                    border: acknowledgedCrits[crit.id] ? '1px solid #E2E8F0' : '1px solid #FEE2E2',
                    opacity: acknowledgedCrits[crit.id] ? 0.7 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: acknowledgedCrits[crit.id] ? '#64748B' : '#991B1B' }}>
                      {crit.patientName} ({crit.patientId})
                    </span>
                    <span style={{ fontSize: '10px', color: '#64748B' }}>{crit.time}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#1E293B', marginTop: 2 }}>
                    {crit.test}: <strong>{crit.value}</strong> <span style={{ color: '#64748B', fontSize: '10px' }}>(Normal: {crit.normal})</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                    <span style={{ fontSize: '10px', color: '#64748B' }}>Doc: {crit.doctor}</span>
                    {!acknowledgedCrits[crit.id] ? (
                      <button
                        onClick={() => handleAcknowledgeCrit(crit.id)}
                        style={{
                          fontSize: '10px',
                          padding: '2px 7px',
                          background: '#DC2626',
                          color: '#FFF',
                          border: 'none',
                          borderRadius: 4,
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Acknowledge & Alert
                      </button>
                    ) : (
                      <span style={{ fontSize: '10px', color: '#16A34A', fontWeight: 700 }}>✓ Acknowledged</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate(`${base}/lab`)}
            style={{
              width: '100%',
              padding: '9px',
              borderRadius: 8,
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#991B1B',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <span>Review Laboratory Dashboard</span>
            <ArrowRight size={13} />
          </button>
        </div>

      </div>

      {/* ── 6. Department Workload & Admissions Trend Charts ────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
        {/* Department Workload Bar Chart */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 14,
            padding: '18px 20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                Department Workload & Active Patients
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                Total patient load across key clinical departments today
              </div>
            </div>
            <button
              onClick={() => navigate(`${base}/departments`)}
              style={{ background: 'none', border: 'none', color: '#0EA5E9', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
            >
              All 13 Departments →
            </button>
          </div>

          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={DEPARTMENTS.slice(0, 7)} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} interval={0} />
              <YAxis tick={{ fill: '#64748B', fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 11 }} />
              <Bar dataKey="patients" fill="#0EA5E9" radius={[4, 4, 0, 0]} name="Patients Handled" />
              <Bar dataKey="waiting" fill="#F59E0B" radius={[4, 4, 0, 0]} name="In Queue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Admissions vs Discharges Trend Chart */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 14,
            padding: '18px 20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                Monthly Admissions vs Discharges
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                Salem District Hospital institutional throughput
              </div>
            </div>
            <button
              onClick={() => navigate(`${base}/analytics`)}
              style={{ background: 'none', border: 'none', color: '#0EA5E9', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
            >
              Analytics Suite →
            </button>
          </div>

          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={CHART_DATA.admissionsTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="admissions" stroke="#0EA5E9" strokeWidth={2.5} dot={{ fill: '#0EA5E9', r: 3 }} name="Admissions" />
              <Line type="monotone" dataKey="discharges" stroke="#10B981" strokeWidth={2.5} dot={{ fill: '#10B981', r: 3 }} name="Discharges" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
