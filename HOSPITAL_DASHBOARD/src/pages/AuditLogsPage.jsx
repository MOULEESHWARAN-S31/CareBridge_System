import { useState } from 'react';
import { Search, Download, Shield, User, FileText, Settings, Trash2, Edit3, LogIn, LogOut } from 'lucide-react';
import { useToast } from '../components/Toast';

const ACTION_TYPES = {
  LOGIN:    { label: 'Login',          color: '#10B981', bg: '#D1FAE5', icon: LogIn     },
  LOGOUT:   { label: 'Logout',         color: '#6366F1', bg: '#EDE9FE', icon: LogOut    },
  CREATE:   { label: 'Record Created', color: '#0EA5E9', bg: '#E0F2FE', icon: FileText  },
  UPDATE:   { label: 'Record Updated', color: '#F59E0B', bg: '#FEF3C7', icon: Edit3     },
  DELETE:   { label: 'Record Deleted', color: '#EF4444', bg: '#FEE2E2', icon: Trash2    },
  SETTINGS: { label: 'Settings Change',color: '#8B5CF6', bg: '#EDE9FE', icon: Settings  },
  ACCESS:   { label: 'Access Control', color: '#EC4899', bg: '#FCE7F3', icon: Shield    },
};

const AUDIT_LOGS = [
  { id: 'LOG001', user: 'Dr. Priya Sharma',    role: 'Doctor',     action: 'LOGIN',    module: 'Authentication',  detail: 'Logged in from 192.168.1.42 (Chrome/Windows)',              ip: '192.168.1.42',  time: '2026-09-06 08:02:14' },
  { id: 'LOG002', user: 'Admin (Raj Kumar)',    role: 'Admin',      action: 'UPDATE',   module: 'Patient Records', detail: 'Updated patient Kavitha Raj (PAT004) — Diagnosis field',    ip: '192.168.1.10',  time: '2026-09-06 08:15:30' },
  { id: 'LOG003', user: 'Nurse (Lakshmi)',      role: 'Nurse',      action: 'CREATE',   module: 'Vitals',          detail: 'Entered vitals for Ravi Kumar (PAT001) — BP 148/94, SPO2 96%',ip: '192.168.1.55', time: '2026-09-06 08:20:11' },
  { id: 'LOG004', user: 'Dr. Suresh Iyer',      role: 'Doctor',     action: 'CREATE',   module: 'Lab Orders',      detail: 'Requested CBC STAT for Kavitha Raj (PAT004)',               ip: '192.168.1.38',  time: '2026-09-06 08:22:45' },
  { id: 'LOG005', user: 'Lab Tech (Ram)',        role: 'Lab',        action: 'UPDATE',   module: 'Lab Results',     detail: 'Entered critical result — Troponin I 18.6 for Shankar Rajan (PAT021)', ip: '192.168.1.71', time: '2026-09-06 08:30:00' },
  { id: 'LOG006', user: 'Admin (Raj Kumar)',    role: 'Admin',      action: 'SETTINGS', module: 'System Settings', detail: 'Changed session timeout from 60 min to 30 min',             ip: '192.168.1.10',  time: '2026-09-06 09:00:55' },
  { id: 'LOG007', user: 'Receptionist (Priya)', role: 'Receptionist',action:'CREATE',   module: 'Patient Reg.',    detail: 'Registered new patient: Arjun Singh (PAT030)',              ip: '192.168.1.22',  time: '2026-09-06 09:15:20' },
  { id: 'LOG008', user: 'Dr. Ritu Singh',       role: 'Doctor',     action: 'ACCESS',   module: 'Records Access',  detail: 'Accessed ICU patient records outside assigned ward',        ip: '192.168.1.61',  time: '2026-09-06 09:25:10' },
  { id: 'LOG009', user: 'Pharmacy (Krishnan)',  role: 'Pharmacy',   action: 'UPDATE',   module: 'Medicine Inventory', detail: 'Updated stock — Amoxicillin 500mg from 230 to 210 units', ip: '192.168.1.80', time: '2026-09-06 09:30:45' },
  { id: 'LOG010', user: 'Admin (Raj Kumar)',    role: 'Admin',      action: 'DELETE',   module: 'User Management', detail: 'Deactivated user account: Lab Tech (retired) – ID USR045',  ip: '192.168.1.10',  time: '2026-09-06 10:00:00' },
  { id: 'LOG011', user: 'Billing (Meena)',       role: 'Billing',    action: 'CREATE',   module: 'Billing',         detail: 'Generated invoice INV-2026-0892 for Vijay Raj (PAT011)',   ip: '192.168.1.45',  time: '2026-09-06 10:15:30' },
  { id: 'LOG012', user: 'Dr. Priya Sharma',    role: 'Doctor',     action: 'LOGOUT',   module: 'Authentication',  detail: 'Session ended after 30 min inactivity timeout',            ip: '192.168.1.42',  time: '2026-09-06 10:45:00' },
  { id: 'LOG013', user: 'Admin (Raj Kumar)',    role: 'Admin',      action: 'ACCESS',   module: 'Access Control',  detail: 'Granted Pharmacy role access to insurance module temporarily', ip: '192.168.1.10', time: '2026-09-06 11:00:12' },
  { id: 'LOG014', user: 'Nurse (Sunita)',        role: 'Nurse',      action: 'UPDATE',   module: 'Medication',      detail: 'Marked Metformin 1g OD administered for Ravi Kumar (PAT001)', ip: '192.168.1.55', time: '2026-09-06 11:30:00' },
  { id: 'LOG015', user: 'HR Manager (Devi)',    role: 'HR',         action: 'UPDATE',   module: 'Attendance',      detail: 'Marked Dr. Arun Raj attendance — Present for duty 09/06',  ip: '192.168.1.90',  time: '2026-09-06 12:00:00' },
];

const roles = ['All Roles', 'Admin', 'Doctor', 'Nurse', 'Lab', 'Pharmacy', 'Billing', 'Receptionist', 'HR'];
const actions = ['All Actions', 'LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'SETTINGS', 'ACCESS'];

export default function AuditLogsPage() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All Roles');
  const [filterAction, setFilterAction] = useState('All Actions');

  const filtered = AUDIT_LOGS.filter(log => {
    const ms = log.user.toLowerCase().includes(search.toLowerCase()) ||
               log.detail.toLowerCase().includes(search.toLowerCase()) ||
               log.module.toLowerCase().includes(search.toLowerCase());
    const mr = filterRole === 'All Roles' || log.role === filterRole;
    const ma = filterAction === 'All Actions' || log.action === filterAction;
    return ms && mr && ma;
  });

  return (
    <div className="page-content page-transition">
      <div className="page-header">
        <div>
          <h1 className="page-title">Audit Logs</h1>
          <div className="page-subtitle">System activity trail — {AUDIT_LOGS.length} events today</div>
        </div>
        <button className="btn btn-primary" onClick={() => toast('Exporting audit report...', 'success')}>
          <Download size={15} /> Export Log
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Events',    value: AUDIT_LOGS.length,                                           color: '#0EA5E9', bg: '#E0F2FE' },
          { label: 'Security Events', value: AUDIT_LOGS.filter(l => l.action === 'ACCESS' || l.action === 'DELETE').length, color: '#EF4444', bg: '#FEE2E2' },
          { label: 'Data Changes',    value: AUDIT_LOGS.filter(l => ['CREATE','UPDATE','DELETE'].includes(l.action)).length, color: '#F59E0B', bg: '#FEF3C7' },
          { label: 'Active Users',    value: new Set(AUDIT_LOGS.map(l => l.user)).size,                   color: '#10B981', bg: '#D1FAE5' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Security Alert */}
      {AUDIT_LOGS.filter(l => l.action === 'ACCESS').length > 0 && (
        <div style={{ padding: '12px 18px', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 'var(--radius-md)', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
          <Shield size={16} color="#92400E" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#92400E' }}>
            {AUDIT_LOGS.filter(l => l.action === 'ACCESS').length} access control events flagged — review recommended.
          </span>
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setFilterAction('ACCESS')}>View All</button>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 240 }}>
          <Search size={15} color="var(--text-muted)" />
          <input placeholder="Search by user, module, or activity..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: 160 }} value={filterRole} onChange={e => setFilterRole(e.target.value)}>
          {roles.map(r => <option key={r}>{r}</option>)}
        </select>
        <select className="form-select" style={{ width: 160 }} value={filterAction} onChange={e => setFilterAction(e.target.value)}>
          {actions.map(a => <option key={a}>{a}</option>)}
        </select>
        {(filterRole !== 'All Roles' || filterAction !== 'All Actions' || search) && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setFilterRole('All Roles'); setFilterAction('All Actions'); setSearch(''); }}>Clear Filters</button>
        )}
      </div>

      {/* Log Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Role</th>
                <th>Action</th>
                <th>Module</th>
                <th>Details</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => {
                const at = ACTION_TYPES[log.action] || ACTION_TYPES.ACCESS;
                const IconComp = at.icon;
                return (
                  <tr key={log.id}>
                    <td style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{log.time}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="avatar avatar-sm" style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', fontSize: 10 }}>
                          {log.user.split(' ').slice(-1)[0]?.[0] || 'U'}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 12 }}>{log.user}</span>
                      </div>
                    </td>
                    <td><span className="tag" style={{ fontSize: 11 }}>{log.role}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 24, height: 24, borderRadius: 6, background: at.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconComp size={12} color={at.color} />
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: at.color }}>{at.label}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{log.module}</td>
                    <td style={{ fontSize: 12, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.detail}>{log.detail}</td>
                    <td style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{log.ip}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7}><div className="empty-state" style={{ padding: '32px 20px' }}><div style={{ fontSize: 40 }}>🔍</div><h3>No logs found</h3><p>Try adjusting your filters.</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
