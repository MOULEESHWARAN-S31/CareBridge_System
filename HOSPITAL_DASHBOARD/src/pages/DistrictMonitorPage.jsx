import { districtData } from '../data/mockData';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Building2, Users, ArrowLeftRight, Stethoscope, Pill, FlaskConical, Video, Map } from 'lucide-react';

const gapStatus = {
  Critical: { color: '#EF4444', bg: '#FEE2E2', label: '⚠️ Critical' },
  Limited: { color: '#F59E0B', bg: '#FEF3C7', label: '⚡ Limited' },
  Good: { color: '#10B981', bg: '#D1FAE5', label: '✓ Good' },
};

const radarData = [
  { subject: 'Specialists', A: 30 },
  { subject: 'Medicines', A: 55 },
  { subject: 'Diagnostics', A: 60 },
  { subject: 'Connectivity', A: 80 },
  { subject: 'Beds', A: 70 },
  { subject: 'Coverage', A: 65 },
];

const facilityData = [
  { name: 'Sub-centres', count: 22, color: '#F59E0B' },
  { name: 'PHCs', count: 14, color: '#6366F1' },
  { name: 'Rural Hospitals', count: 8, color: '#0D9488' },
  { name: 'District Hospitals', count: 4, color: '#0EA5E9' },
];

export default function DistrictMonitorPage() {
  const kpis = [
    { label: 'Total Facilities', value: districtData.totalFacilities, icon: Building2, color: '#0EA5E9', bg: '#E0F2FE' },
    { label: 'Total Patients', value: districtData.totalPatients.toLocaleString(), icon: Users, color: '#0D9488', bg: '#CCFBF1' },
    { label: 'Pending Referrals', value: districtData.pendingReferrals, icon: ArrowLeftRight, color: '#F59E0B', bg: '#FEF3C7' },
    { label: 'Specialist Availability', value: `${districtData.specialistAvailability}%`, icon: Stethoscope, color: '#6366F1', bg: '#EEF2FF' },
    { label: 'Medicine Shortages', value: districtData.medicineShortages, icon: Pill, color: '#EF4444', bg: '#FEE2E2' },
    { label: 'Diagnostic Gaps', value: districtData.diagnosticGaps, icon: FlaskConical, color: '#F59E0B', bg: '#FEF3C7' },
    { label: 'Tele Requests', value: districtData.teleRequests, icon: Video, color: '#10B981', bg: '#D1FAE5' },
    { label: 'Healthcare Coverage', value: '72%', icon: Map, color: '#0EA5E9', bg: '#E0F2FE' },
  ];

  return (
    <div className="page-content page-transition">
      <div className="page-header">
        <div>
          <div className="page-title">District Health Monitor</div>
          <div className="page-subtitle">Real-time district-level healthcare system monitoring</div>
        </div>
        <div style={{ padding: '8px 16px', background: 'var(--success-light)', borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 600, color: '#065F46', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
          Live Monitoring Active
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {kpis.map((k, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-icon" style={{ background: k.bg }}><k.icon size={22} color={k.color} /></div>
            <div className="stat-card-value" style={{ color: k.color }}>{k.value}</div>
            <div className="stat-card-label">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Gap Analysis */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-title">Healthcare Gap Analysis</div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Critical gaps across the district healthcare network that require immediate attention.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {districtData.gaps.map((g, i) => {
            const gs = gapStatus[g.status];
            return (
              <div key={i} style={{ padding: '18px', background: gs.bg, borderRadius: 'var(--radius-md)', border: `1px solid ${gs.color}30` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: gs.color }}>{g.type}</div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: gs.color, background: 'white', padding: '3px 8px', borderRadius: 'var(--radius-full)', border: `1px solid ${gs.color}30` }}>{gs.label}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>{g.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 8, background: 'rgba(0,0,0,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${g.value}%`, height: '100%', background: gs.color, borderRadius: 4, transition: 'width 0.5s ease' }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: gs.color }}>{g.value}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-2">
        {/* Facility Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Facility Distribution</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={facilityData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="count" name="Facilities" radius={[8, 8, 0, 0]}>
                {facilityData.map((f, i) => (
                  <rect key={i} fill={f.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Healthcare Coverage Radar */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Healthcare Coverage Radar</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Radar name="Coverage %" dataKey="A" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.2} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Map Visual */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="section-title">Facility Map – Punjab District Network</div>
        <div style={{ background: 'linear-gradient(135deg, #E0F2FE, #CCFBF1)', borderRadius: 'var(--radius)', padding: 24, position: 'relative', minHeight: 280, overflow: 'hidden' }}>
          {/* Simple visual map */}
          <svg viewBox="0 0 600 280" style={{ width: '100%', opacity: 0.9 }}>
            {/* Grid lines */}
            {[0, 1, 2, 3, 4, 5].map(i => (
              <line key={`h${i}`} x1="0" y1={i * 50} x2="600" y2={i * 50} stroke="rgba(14,165,233,0.1)" strokeWidth="1" />
            ))}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <line key={`v${i}`} x1={i * 75} y1="0" x2={i * 75} y2="280" stroke="rgba(14,165,233,0.1)" strokeWidth="1" />
            ))}
            {/* District outline */}
            <path d="M60 40 L540 40 L560 240 L40 240 Z" stroke="rgba(14,165,233,0.3)" strokeWidth="2" fill="rgba(14,165,233,0.05)" />
            {/* Facilities */}
            {[
              { x: 300, y: 130, type: 'district', color: '#0EA5E9', name: 'CareConnect District', size: 18 },
              { x: 180, y: 90, type: 'rural', color: '#0D9488', name: 'Rural Sangrur', size: 14 },
              { x: 420, y: 100, type: 'rural', color: '#0D9488', name: 'Rural Hoshiarpur', size: 14 },
              { x: 120, y: 170, type: 'phc', color: '#6366F1', name: 'PHC Jalandhar', size: 11 },
              { x: 460, y: 170, type: 'phc', color: '#6366F1', name: 'PHC Moga', size: 11 },
              { x: 250, y: 200, type: 'sub', color: '#F59E0B', name: 'Sub-centre', size: 8 },
              { x: 370, y: 60, type: 'sub', color: '#F59E0B', name: 'Sub-centre', size: 8 },
              { x: 80, y: 120, type: 'sub', color: '#F59E0B', name: 'Sub-centre', size: 8 },
              { x: 510, y: 200, type: 'sub', color: '#F59E0B', name: 'Sub-centre', size: 8 },
            ].map((f, i) => (
              <g key={i}>
                <circle cx={f.x} cy={f.y} r={f.size + 4} fill={f.color} opacity={0.15} />
                <circle cx={f.x} cy={f.y} r={f.size} fill={f.color} opacity={0.9} />
                <text x={f.x} y={f.y + f.size + 14} textAnchor="middle" fontSize={9} fill={f.color} fontWeight="600" fontFamily="Poppins, sans-serif">{f.name}</text>
              </g>
            ))}
            {/* Connection lines */}
            {[[300, 130, 180, 90], [300, 130, 420, 100], [180, 90, 120, 170], [420, 100, 460, 170], [300, 130, 250, 200], [180, 90, 80, 120]].map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(14,165,233,0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
            ))}
          </svg>
          {/* Legend */}
          <div style={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', gap: 12, flexWrap: 'wrap', background: 'rgba(255,255,255,0.8)', padding: '8px 12px', borderRadius: 'var(--radius)', backdropFilter: 'blur(4px)' }}>
            {[['#0EA5E9', 'District Hospital'], ['#0D9488', 'Rural Hospital'], ['#6366F1', 'PHC'], ['#F59E0B', 'Sub-centre']].map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 500 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />{l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
