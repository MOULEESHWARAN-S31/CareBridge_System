import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoleNav } from '../hooks/useRoleNav';
import { Search, Calendar, Video, MessageCircle, Star, Filter } from 'lucide-react';
import { doctors } from '../data/mockData';
import { useToast } from '../components/Toast';

const specializations = ['All', 'General Physician', 'Cardiologist', 'Pediatrician', 'Dermatologist', 'Gynaecologist', 'Orthopaedic Surgeon', 'Neurologist', 'ENT Specialist'];

const statusColor = { online: 'online', offline: 'offline', busy: 'busy' };
const statusLabel = { online: 'Online', offline: 'Offline', busy: 'Busy' };

export default function DoctorsPage() {
  const navigate = useNavigate();
  const { path } = useRoleNav();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [spec, setSpec] = useState('All');

  const filtered = doctors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.specialization || '').toLowerCase().includes(search.toLowerCase());
    const matchSpec = spec === 'All' || d.specialization === spec;
    return matchSearch && matchSpec;
  });

  return (
    <div className="page-content page-transition">
      <div className="page-header">
        <div>
          <h1 className="page-title">Doctors</h1>
          <div className="page-subtitle">{doctors.length} doctors registered · {doctors.filter(d => d.status === 'online').length} currently online</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="card" style={{ marginBottom: 20, padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: 220 }}>
            <Search size={16} color="var(--text-muted)" />
            <input placeholder="Search by name or specialization..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
            {['All', 'General Physician', 'Cardiologist', 'Pediatrician', 'Gynaecologist', 'Neurologist'].map(s => (
              <button key={s} className={`filter-tab ${spec === s ? 'active' : ''}`} onClick={() => setSpec(s)}>{s}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {filtered.map(doc => (
          <div key={doc.id} className="doctor-card card">
            {/* Status Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 'var(--radius-full)', background: doc.status === 'online' ? 'var(--success-light)' : doc.status === 'busy' ? 'var(--warning-light)' : 'var(--border-light)', fontSize: 12, fontWeight: 600, color: doc.status === 'online' ? '#065F46' : doc.status === 'busy' ? '#92400E' : 'var(--text-muted)' }}>
                <span className={`status-dot ${statusColor[doc.status]}`} />
                {statusLabel[doc.status]}
              </div>
            </div>

            {/* Avatar & Info */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, var(--primary-light), var(--secondary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: 'var(--primary-dark)', flexShrink: 0 }}>
                {doc.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{doc.name}</div>
                <div style={{ color: 'var(--primary)', fontSize: 13, fontWeight: 500 }}>{doc.specialization}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{doc.department || doc.dept}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <Star size={12} fill="#F59E0B" color="#F59E0B" />
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{doc.rating}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· {doc.experience}</span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', padding: '10px 12px', marginBottom: 16 }}>
              <div className="info-row" style={{ padding: '4px 0' }}><span className="info-row-label">Timings</span><span className="info-row-value" style={{ fontSize: 11 }}>{doc.timings}</span></div>
              <div className="info-row" style={{ padding: '4px 0' }}><span className="info-row-label">Fee</span><span className="info-row-value" style={{ color: 'var(--primary)', fontWeight: 700 }}>{doc.fee}</span></div>
              <div className="info-row" style={{ padding: '4px 0', border: 'none' }}><span className="info-row-label">Patients</span><span className="info-row-value">{doc.patients.toLocaleString()}</span></div>
            </div>

            {/* Languages */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap' }}>
              {(doc.languages || []).map(l => <span key={l} className="tag">{l}</span>)}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate(path(`doctors/${doc.id}`))}>View Profile</button>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { toast(`Booking appointment with ${doc.name}`, 'success'); navigate(path('appointments')); }}>
                <Calendar size={13} /> Book
              </button>
              <button
                className="btn btn-sm"
                style={{ flex: 1, justifyContent: 'center', background: doc.status === 'offline' ? 'var(--border-light)' : 'linear-gradient(135deg, var(--primary), var(--secondary))', color: doc.status === 'offline' ? 'var(--text-muted)' : 'white' }}
                onClick={() => { if (doc.status !== 'offline') { navigate(path('consultations')); } else { toast('Doctor is currently offline', 'warning'); } }}
              >
                <Video size={13} /> Consult
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .doctor-card { transition: var(--transition); }
        .doctor-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
      `}</style>
    </div>
  );
}
