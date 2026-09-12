import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Globe, ChevronDown, Search, Menu, LogOut, User,
  Settings, Wifi, RefreshCw, ShieldCheck, Check, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { NOTIFICATIONS, HOSPITAL_INFO, CRITICAL_LAB_RESULTS } from '../data/mockData';
import { ROLE_ROUTES, ACCOUNTS } from '../auth/accounts';
import GlobalSearchModal from './GlobalSearchModal';

export default function Header({ onMenuToggle, sidebarCollapsed }) {
  const { user, logout, login } = useAuth();
  const { t, language, setLanguage, languages } = useLanguage();
  const navigate = useNavigate();

  const [showLang, setShowLang] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [notifFilter, setNotifFilter] = useState('all');
  const [demoMode, setDemoMode] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncText, setLastSyncText] = useState('2m ago');

  const langRef = useRef();
  const notifRef = useRef();
  const userRef = useRef();

  const base = ROLE_ROUTES[user?.roleId] || '/admin/dashboard';
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length + CRITICAL_LAB_RESULTS.filter(c => !c.acknowledged).length;

  useEffect(() => {
    function handleClick(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setShowLang(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleQuickSync() {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncText('Just now');
    }, 900);
  }

  function handleRoleSwitch(roleKey) {
    const acc = ACCOUNTS[roleKey];
    if (acc) {
      login(acc);
      setShowUser(false);
      const targetPath = ROLE_ROUTES[roleKey] || '/admin/dashboard';
      navigate(targetPath);
    }
  }

  const filteredNotifs = NOTIFICATIONS.filter(n => {
    if (notifFilter === 'critical') return n.type === 'critical';
    if (notifFilter === 'warning') return n.type === 'warning';
    return true;
  });

  return (
    <>
      <header className={`header${sidebarCollapsed ? ' collapsed' : ''}`}>
        {/* Header Left: Menu & Hospital Branding */}
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="menu-btn" onClick={onMenuToggle} title="Toggle Sidebar">
            <Menu size={18} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="header-title" style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                {HOSPITAL_INFO.name}
              </span>
              <span style={{ fontSize: '10px', background: '#E0F2FE', color: '#0284C7', padding: '2px 6px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase' }}>
                District Hospital
              </span>
            </div>
            <div className="header-subtitle" style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>{HOSPITAL_INFO.todayDate}</span>
              <span>·</span>
              <span style={{ color: '#059669', fontWeight: 600 }}>CareBridge Node #42</span>
            </div>
          </div>
        </div>

        {/* Header Right: Global Search, Sync, Demo Mode, Lang, Notif, Profile */}
        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Universal Global Search Bar */}
          <button
            onClick={() => setShowSearchModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 9,
              border: '1.5px solid #CBD5E1',
              background: '#F8FAFC',
              cursor: 'pointer',
              color: '#64748B',
              fontSize: '12px',
              width: '240px',
              textAlign: 'left'
            }}
            title="Global Search (Ctrl + K)"
          >
            <Search size={14} color="#0EA5E9" />
            <span style={{ flex: 1 }}>Search patients, beds, Rx...</span>
            <kbd style={{ fontSize: '10px', background: '#E2E8F0', padding: '2px 5px', borderRadius: 4, color: '#475569', fontWeight: 600 }}>Ctrl+K</kbd>
          </button>

          {/* Low Connectivity & Offline Sync Status Pill */}
          <div
            onClick={handleQuickSync}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 8,
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              cursor: 'pointer',
              fontSize: '11px',
              color: '#166534',
              fontWeight: 600
            }}
            title="Click to trigger manual cloud sync"
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E' }} />
            <span>Sync: {lastSyncText}</span>
            <RefreshCw size={11} className={isSyncing ? 'spin' : ''} style={{ color: '#166534' }} />
          </div>

          {/* Development / Offline Mock Data Indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 8px',
              borderRadius: 6,
              background: '#FEF3C7',
              border: '1px solid #FCD34D',
              fontSize: '11px',
              fontWeight: 700,
              color: '#92400E'
            }}
            title="Hospital operational view operates with simulated clinical dataset"
          >
            <Sparkles size={11} color="#D97706" />
            <span>Development / Offline Mock Data</span>
          </div>


          {/* Notifications Popover */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              className="header-btn"
              onClick={() => { setShowNotif(!showNotif); setShowLang(false); setShowUser(false); }}
              title="Hospital Alerts & Notifications"
            >
              <Bell size={17} />
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>
            {showNotif && (
              <div className="notif-panel" style={{ width: 340 }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Operational Alerts</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {['all', 'critical', 'warning'].map(f => (
                      <button
                        key={f}
                        onClick={() => setNotifFilter(f)}
                        style={{
                          fontSize: '10px',
                          padding: '2px 7px',
                          borderRadius: 4,
                          border: 'none',
                          cursor: 'pointer',
                          background: notifFilter === f ? '#0EA5E9' : '#F1F5F9',
                          color: notifFilter === f ? '#FFFFFF' : '#64748B',
                          fontWeight: 600,
                          textTransform: 'capitalize'
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Critical Lab Alert callouts inside Notifications */}
                {CRITICAL_LAB_RESULTS.map(crit => (
                  <div
                    key={crit.id}
                    style={{
                      padding: '10px 14px',
                      background: '#FEF2F2',
                      borderBottom: '1px solid #FEE2E2',
                      display: 'flex',
                      gap: 8,
                      alignItems: 'flex-start'
                    }}
                  >
                    <span style={{ fontSize: 16 }}>🚨</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#991B1B' }}>
                        CRITICAL LAB: {crit.patientName} ({crit.patientId})
                      </div>
                      <div style={{ fontSize: '11px', color: '#B91C1C' }}>
                        {crit.test}: <strong>{crit.value}</strong> (Ref: {crit.normal})
                      </div>
                      <div style={{ fontSize: '10px', color: '#7F1D1D', marginTop: 2 }}>
                        Ordered by {crit.doctor} · {crit.time}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Standard Notification items */}
                <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                  {filteredNotifs.map(n => (
                    <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 15 }}>
                          {n.type === 'critical' ? '🚨' : n.type === 'warning' ? '⚠️' : 'ℹ️'}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div className="notif-title">{n.title}</div>
                          <div className="notif-message">{n.message}</div>
                          <div className="notif-time">{n.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '8px 14px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', textAlign: 'center' }}>
                  <button
                    onClick={() => { setShowNotif(false); navigate(`${base}/notifications`); }}
                    style={{ background: 'none', border: 'none', color: '#0EA5E9', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    View All Centralized Alerts & Rules →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Demo Role Switcher */}
          <div style={{ position: 'relative' }} ref={userRef}>
            <button
              className="user-avatar"
              onClick={() => { setShowUser(!showUser); setShowLang(false); setShowNotif(false); }}
              title={`${user?.name} (${user?.roleLabel || user?.roleId})`}
              style={{
                background: '#0EA5E9',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '12px',
                width: 34,
                height: 34,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #BAE6FD',
                cursor: 'pointer'
              }}
            >
              {user?.avatar || 'U'}
            </button>

            {showUser && (
              <div className="dropdown" style={{ right: 0, minWidth: 240, padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{user?.name}</div>
                  <div style={{ fontSize: '11px', color: '#0EA5E9', fontWeight: 600 }}>{user?.roleLabel || user?.roleId}</div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Emp ID: {user?.empId || 'EMP-001'} · GDH Salem</div>
                </div>

                {/* Authenticated Role & Server Authority */}
                <div style={{ padding: '8px 12px', borderBottom: '1px solid #E2E8F0', background: '#FFFFFF' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>
                    Role Authority
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#0369A1' }}>
                    {user?.roleName || user?.role}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B', marginTop: 2 }}>
                    Validated via Common Login (:3000)
                  </div>
                </div>

                <div style={{ padding: 4 }}>
                  <button className="dropdown-item" onClick={() => { setShowUser(false); navigate(`${base}/profile`); }}>
                    <User size={13} /> My Profile
                  </button>
                  <button className="dropdown-item" onClick={() => { setShowUser(false); navigate(`${base}/settings`); }}>
                    <Settings size={13} /> Portal Settings
                  </button>
                  <div className="dropdown-divider" />
                  <button
                    className="dropdown-item"
                    style={{ color: '#EF4444' }}
                    onClick={() => logout()}
                  >
                    <LogOut size={13} /> {t('auth.logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Universal Categorized Global Search Modal */}
      <GlobalSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />
    </>
  );
}
