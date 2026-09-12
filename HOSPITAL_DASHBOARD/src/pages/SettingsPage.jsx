import { useState } from 'react';
import { Building2, Users, Shield, Globe, Bell, Lock, Eye, Sun, Moon, ChevronRight, Check } from 'lucide-react';
import { useToast } from '../components/Toast';
import { useLanguage } from '../context/LanguageContext';

const sections = [
  { id: 'hospital', icon: Building2, label: 'Hospital Profile', desc: 'Manage hospital information and details' },
  { id: 'users', icon: Users, label: 'User Management', desc: 'Add, edit and manage system users' },
  { id: 'roles', icon: Shield, label: 'Role Permissions', desc: 'Configure role-based access control' },
  { id: 'notifications', icon: Bell, label: 'Notification Settings', desc: 'Configure system notifications' },
  { id: 'security', icon: Lock, label: 'Security & Privacy', desc: 'Security policies and privacy settings' },
];

const roles = [
  { role: 'Hospital Admin', perms: ['All Access', 'User Mgmt', 'Reports', 'Settings', 'Analytics'], color: '#0EA5E9' },
  { role: 'Doctor', perms: ['Patient Records', 'Appointments', 'Prescriptions', 'Lab Reports', 'Teleconsultation'], color: '#0D9488' },
  { role: 'Nurse', perms: ['Patient Records', 'Appointments', 'Lab Requests', 'Vitals Entry'], color: '#6366F1' },
  { role: 'Receptionist', perms: ['Appointments', 'Patient Reg.', 'Basic Records'], color: '#F59E0B' },
  { role: 'Lab Staff', perms: ['Lab Tests', 'Report Upload', 'Sample Mgmt'], color: '#10B981' },
  { role: 'Pharmacy Staff', perms: ['Medicine Inventory', 'Dispensing', 'Prescription View'], color: '#EF4444' },
];

export default function SettingsPage() {
  const toast = useToast();
  const { t, setLanguage, language, languages } = useLanguage();
  const [activeSection, setActiveSection] = useState('hospital');
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="page-content page-transition">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <div className="page-subtitle">Configure system preferences and access controls</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Settings Nav */}
        <div className="card" style={{ padding: 8 }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 14px', border: 'none', borderRadius: 'var(--radius)', background: activeSection === s.id ? 'var(--primary-light)' : 'transparent', color: activeSection === s.id ? 'var(--primary-dark)' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', transition: 'var(--transition)', textAlign: 'left', marginBottom: 2 }}>
              <s.icon size={16} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: activeSection === s.id ? 600 : 400 }}>{s.label}</div>
              </div>
              <ChevronRight size={14} />
            </button>
          ))}

          {/* Dark Mode Toggle */}
          <div style={{ margin: '12px 8px 4px', padding: '14px 12px', background: darkMode ? '#1E293B' : 'var(--bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: darkMode ? 'white' : 'var(--text-primary)' }}>
                {darkMode ? <Moon size={16} /> : <Sun size={16} color="#F59E0B" />}
                {darkMode ? 'Dark Mode' : 'Light Mode'}
              </div>
              <div style={{ width: 44, height: 24, borderRadius: 12, background: darkMode ? 'var(--primary)' : 'var(--border)', cursor: 'pointer', position: 'relative', transition: 'var(--transition)' }} onClick={() => { setDarkMode(!darkMode); toast(`Switched to ${!darkMode ? 'dark' : 'light'} mode!`, 'info'); }}>
                <div style={{ position: 'absolute', top: 3, left: darkMode ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'var(--transition)', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div>
          {activeSection === 'hospital' && (
            <div className="card">
              <div className="section-title">Hospital Profile</div>
              <div style={{ display: 'grid', gap: 14 }}>
                <div className="form-group"><label className="form-label">Hospital Name</label><input className="form-input" defaultValue="CareConnect District Hospital" /></div>
                <div className="form-group"><label className="form-label">Hospital Type</label><select className="form-select"><option>District Hospital</option><option>Rural Hospital</option><option>PHC</option></select></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group"><label className="form-label">District</label><input className="form-input" defaultValue="Ludhiana" /></div>
                  <div className="form-group"><label className="form-label">State</label><input className="form-input" defaultValue="Punjab" /></div>
                </div>
                <div className="form-group"><label className="form-label">Contact Number</label><input className="form-input" defaultValue="+91 1800-CARE-CONNECT" /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" defaultValue="care@careconnect.in" /></div>
                <div className="form-group"><label className="form-label">Address</label><textarea className="form-input" rows={3} defaultValue="District Hospital Campus, Ludhiana, Punjab – 141001" /></div>
                <button className="btn btn-primary" style={{ width: 'fit-content' }} onClick={() => toast('Hospital profile updated!', 'success')}>Save Changes</button>
              </div>
            </div>
          )}

          {activeSection === 'roles' && (
            <div className="card">
              <div className="section-title">Role Permissions Matrix</div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Define what each role can access within the CareConnect system.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {roles.map((r, i) => (
                  <div key={i} style={{ padding: '14px 16px', background: 'var(--bg)', borderRadius: 'var(--radius)', border: `1px solid ${r.color}20`, borderLeft: `4px solid ${r.color}` }}>
                    <div style={{ fontWeight: 700, color: r.color, marginBottom: 8 }}>{r.role}</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {r.perms.map(p => (
                        <span key={p} style={{ padding: '3px 10px', background: r.color + '15', color: r.color, borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 600 }}>{p}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {activeSection === 'security' && (
            <div className="card" style={{ maxWidth: 500 }}>
              <div className="section-title">Security & Privacy</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Session Timeout', desc: 'Auto logout after inactivity', value: '30 minutes' },
                  { label: 'Login History', desc: 'Track login activity across devices', action: 'View History' },
                  { label: 'IP Restriction', desc: 'Restrict access to specific IPs', action: 'Configure' },
                  { label: 'Audit Log', desc: 'Full activity audit trail', action: 'View Logs' },
                  { label: 'Data Backup', desc: 'Automatic daily data backup', value: 'Enabled' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.desc}</div>
                    </div>
                    {item.action ? (
                      <button className="btn btn-ghost btn-sm" onClick={() => toast(`Opening ${item.label}...`, 'info')}>{item.action}</button>
                    ) : (
                      <span className="badge badge-success">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeSection === 'users' || activeSection === 'notifications') && (
            <div className="card">
              <div className="section-title">{sections.find(s => s.id === activeSection)?.label}</div>
              <div className="empty-state">
                <div style={{ fontSize: 48, marginBottom: 12 }}>⚙️</div>
                <h3>{sections.find(s => s.id === activeSection)?.label}</h3>
                <p>{sections.find(s => s.id === activeSection)?.desc}</p>
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => toast('Settings panel opened!', 'info')}>Configure</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .settings-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
