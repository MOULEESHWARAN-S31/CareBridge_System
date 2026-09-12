import { useState } from 'react';
import { UserCog, Search, Plus, Phone, Mail, Calendar, Shield } from 'lucide-react';
import { staff } from '../data/mockData';
import { useToast } from '../components/Toast';

const roleColors = {
  'Doctor':         { color: '#0D9488', bg: '#CCFBF1' },
  'Nurse':          { color: '#6366F1', bg: '#EEF2FF' },
  'Receptionist':   { color: '#F59E0B', bg: '#FEF3C7' },
  'Lab Staff':      { color: '#10B981', bg: '#D1FAE5' },
  'Pharmacy Staff': { color: '#EF4444', bg: '#FEE2E2' },
  'Hospital Admin': { color: '#0EA5E9', bg: '#E0F2FE' },
};

const shiftColors = {
  'Morning (8AM–2PM)':  '#0D9488',
  'Evening (2PM–8PM)':  '#6366F1',
  'Night (8PM–8AM)':    '#1E293B',
};

export default function StaffPage() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [view, setView] = useState('cards'); // 'cards' | 'table'

  const roles = ['All', ...new Set(staff.map(s => s.role))];

  const filtered = staff.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.dept.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'All' || s.role === filterRole;
    return matchSearch && matchRole;
  });

  const onDuty = staff.filter(s => s.status === 'On Duty').length;
  const offDuty = staff.filter(s => s.status === 'Off Duty').length;

  return (
    <div className="page-content page-transition">
      <div className="page-header">
        <div>
          <h1 className="page-title">Staff Directory</h1>
          <div className="page-subtitle">{staff.length} staff members · {onDuty} on duty · {offDuty} off duty</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => setView(view === 'cards' ? 'table' : 'cards')}>
            {view === 'cards' ? '☰ Table View' : '⊞ Card View'}
          </button>
          <button className="btn btn-primary" onClick={() => toast('Add staff dialog opened.', 'info')}>
            <Plus size={15} /> Add Staff
          </button>
        </div>
      </div>

      {/* Role summary */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        {Object.entries(roleColors).map(([role, rc]) => {
          const count = staff.filter(s => s.role === role).length;
          return (
            <div key={role} style={{ padding: '8px 14px', background: rc.bg, borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', border: `1px solid ${rc.color}20` }}
              onClick={() => setFilterRole(filterRole === role ? 'All' : role)}>
              <span style={{ fontWeight: 700, fontSize: 14, color: rc.color }}>{count}</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{role}s</span>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-box" style={{ flex: 1, minWidth: 220 }}>
          <Search size={15} className="search-icon" />
          <input className="search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, department, role..." />
        </div>
        <div className="filter-tabs">
          {roles.map(r => (
            <button key={r} className={`filter-tab ${filterRole === r ? 'active' : ''}`} onClick={() => setFilterRole(r)}>{r}</button>
          ))}
        </div>
      </div>

      {view === 'cards' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map(s => {
            const rc = roleColors[s.role] || { color: '#0EA5E9', bg: '#E0F2FE' };
            const initials = s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
            const sc = shiftColors[s.shift] || '#0EA5E9';
            return (
              <div key={s.id} className="card"
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}>
                {/* Header */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${rc.color}, ${rc.color}aa)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: 'white', flexShrink: 0 }}>
                    {initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.dept}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <span style={{ padding: '2px 8px', background: rc.bg, color: rc.color, borderRadius: 'var(--radius-full)', fontSize: 10, fontWeight: 700 }}>{s.role}</span>
                      <span className={`badge ${s.status === 'On Duty' ? 'badge-success' : 'badge-warning'}`}>{s.status}</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <Phone size={12} color="var(--text-muted)" />{s.phone}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <Mail size={12} color="var(--text-muted)" />{s.email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <Calendar size={12} color="var(--text-muted)" />
                    <span style={{ color: sc, fontWeight: 600 }}>{s.shift}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => toast(`Viewing ${s.name}'s profile`, 'info')}>View Profile</button>
                  <button className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => toast(`Editing ${s.name}'s schedule`, 'info')}>Edit Schedule</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Role</th>
                <th>Department</th>
                <th>Shift</th>
                <th>Status</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const rc = roleColors[s.role] || { color: '#0EA5E9', bg: '#E0F2FE' };
                const initials = s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                return (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: rc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: rc.color, flexShrink: 0 }}>{initials}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ padding: '3px 10px', background: rc.bg, color: rc.color, borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 700 }}>{s.role}</span></td>
                    <td style={{ fontSize: 13 }}>{s.dept}</td>
                    <td style={{ fontSize: 12, color: shiftColors[s.shift] || '#0EA5E9', fontWeight: 600 }}>{s.shift}</td>
                    <td><span className={`badge ${s.status === 'On Duty' ? 'badge-success' : 'badge-warning'}`}>{s.status}</span></td>
                    <td style={{ fontSize: 12 }}>{s.phone}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => toast(`Editing ${s.name}`, 'info')}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => toast(`Are you sure? (demo)`, 'warning')}>Remove</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
