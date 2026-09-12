import { useState } from 'react';
import { MapPin, Users, Building2, Stethoscope, Pill, Wifi } from 'lucide-react';
import { facilities } from '../data/mockData';
import { useToast } from '../components/Toast';

const typeColor = {
  'District Hospital': '#0EA5E9',
  'Rural Hospital': '#0D9488',
  'PHC': '#6366F1',
  'Sub-centre': '#F59E0B',
};
const statusStyle = {
  'Available': { bg: '#D1FAE5', color: '#065F46', dot: '#10B981' },
  'Limited': { bg: '#FEF3C7', color: '#92400E', dot: '#F59E0B' },
  'Critical': { bg: '#FEE2E2', color: '#991B1B', dot: '#EF4444' },
};

export default function FacilitiesPage() {
  const toast = useToast();
  const [filter, setFilter] = useState('All');
  const types = ['All', 'District Hospital', 'Rural Hospital', 'PHC', 'Sub-centre'];

  const filtered = filter === 'All' ? facilities : facilities.filter(f => f.type === filter);

  return (
    <div className="page-content page-transition">
      <div className="page-header">
        <div>
          <div className="page-title">Healthcare Facilities</div>
          <div className="page-subtitle">{facilities.length} facilities in the network</div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        {types.slice(1).map((t, i) => {
          const count = facilities.filter(f => f.type === t).length;
          return (
            <div key={t} className="stat-card" style={{ borderTop: `4px solid ${typeColor[t]}`, cursor: 'pointer' }} onClick={() => setFilter(t)}>
              <div className="stat-card-icon" style={{ background: typeColor[t] + '18' }}>
                <Building2 size={22} color={typeColor[t]} />
              </div>
              <div className="stat-card-value" style={{ color: typeColor[t] }}>{count}</div>
              <div className="stat-card-label">{t}s</div>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="filter-tabs" style={{ marginBottom: 20 }}>
        {types.map(t => (
          <button key={t} className={`filter-tab ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t}</button>
        ))}
      </div>

      {/* Facility Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
        {filtered.map(fac => {
          const ss = statusStyle[fac.status];
          const tc = typeColor[fac.type];
          return (
            <div key={fac.id} className="card" style={{ borderTop: `4px solid ${tc}`, transition: 'var(--transition)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}>

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: tc, background: tc + '15', padding: '2px 8px', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{fac.type}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{fac.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, color: 'var(--text-muted)', fontSize: 12 }}>
                    <MapPin size={12} />{fac.location}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', background: ss.bg, borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 600, color: ss.color, flexShrink: 0 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: ss.dot }} />
                  {fac.status}
                </div>
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                {[
                  { icon: Stethoscope, label: 'Doctors', value: fac.doctors, color: tc },
                  { icon: Building2, label: 'Beds', value: fac.beds, color: tc },
                  { icon: Users, label: 'Diagnostics', value: fac.diagnostics, color: tc },
                  { icon: Pill, label: 'Medicines', value: fac.medicines, color: tc },
                ].map((s, i) => (
                  <div key={i} style={{ padding: '10px 12px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <s.icon size={16} color={s.color} />
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: typeof s.value === 'number' ? s.color : (s.value === 'Full' || s.value === 'Available') ? 'var(--success)' : s.value === 'Partial' ? 'var(--warning)' : 'var(--danger)' }}>{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Connectivity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', marginBottom: 14 }}>
                <Wifi size={14} color={fac.connectivity === 'Excellent' ? 'var(--success)' : fac.connectivity === 'Good' ? 'var(--primary)' : fac.connectivity === 'Moderate' ? 'var(--warning)' : 'var(--danger)'} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Connectivity: <strong style={{ color: 'var(--text-primary)' }}>{fac.connectivity}</strong></span>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => toast(`Viewing ${fac.name} details...`, 'info')}>View Details</button>
                <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => toast(`Creating referral to ${fac.name}...`, 'success')}>Refer Patient</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
