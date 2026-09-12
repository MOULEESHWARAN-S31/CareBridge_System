import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, CheckCheck, Trash2, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { notifications as initialNotifs } from '../data/mockData';
import { useToast } from '../components/Toast';

const typeIcons = {
  success: { icon: CheckCircle, color: '#10B981', bg: '#D1FAE5' },
  warning: { icon: AlertTriangle, color: '#F59E0B', bg: '#FEF3C7' },
  danger:  { icon: AlertTriangle, color: '#EF4444', bg: '#FEE2E2' },
  info:    { icon: Info,          color: '#3B82F6', bg: '#DBEAFE' },
};

export default function NotificationsPage() {
  const toast = useToast();
  const location = useLocation();
  const { user } = useAuth();
  const [notifs, setNotifs] = useState(initialNotifs);
  const [filter, setFilter] = useState('All');

  const role = user?.roleId || '';
  const path = location.pathname.toLowerCase();

  let pageHeading = 'Notification Center';
  if (role === 'nurse' || path.includes('/nurse')) {
    pageHeading = 'Alerts';
  } else if (role === 'lab' || path.includes('/lab')) {
    pageHeading = 'Notifications';
  } else if (role === 'pharmacy' || path.includes('/pharmacy')) {
    pageHeading = 'Notifications Center';
  } else {
    pageHeading = 'Notification Center';
  }

  const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => { setNotifs(prev => prev.map(n => ({ ...n, read: true }))); toast('All notifications marked as read.', 'success'); };
  const clearAll = () => { setNotifs([]); toast('All notifications cleared.', 'info'); };
  const remove = (id) => setNotifs(prev => prev.filter(n => n.id !== id));

  const filtered = notifs.filter(n => {
    if (filter === 'Unread') return !n.read;
    if (filter === 'Read') return n.read;
    return true;
  });

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="page-content page-transition">
      <div className="page-header">
        <div>
          <h1 className="page-title">{pageHeading}</h1>
          <div className="page-subtitle">{unreadCount} unread · {notifs.length} total</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={markAllRead}><CheckCheck size={16} /> Mark All Read</button>
          <button className="btn btn-danger" onClick={clearAll}><Trash2 size={16} /> Clear All</button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs" style={{ marginBottom: 24 }}>
        {['All', 'Unread', 'Read'].map(f => (
          <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f} {f === 'Unread' && unreadCount > 0 && <span style={{ marginLeft: 4, background: 'var(--danger)', color: 'white', borderRadius: 10, fontSize: 10, padding: '1px 5px', fontWeight: 700 }}>{unreadCount}</span>}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div className="card">
            <div className="empty-state" style={{ padding: '60px 20px' }}>
              <Bell size={64} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: 16 }} />
              <h3>No Notifications</h3>
              <p>You're all caught up! No {filter.toLowerCase()} notifications.</p>
            </div>
          </div>
        ) : filtered.map(n => {
          const ti = typeIcons[n.type] || typeIcons.info;
          return (
            <div key={n.id} className="notification-item" style={{ background: n.read ? 'white' : 'var(--primary-light)', border: `1px solid ${n.read ? 'var(--border-light)' : 'rgba(14,165,233,0.15)'}` }}
              onClick={() => markRead(n.id)}>
              {/* Icon */}
              <div style={{ width: 44, height: 44, borderRadius: 14, background: ti.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ti.icon size={20} color={ti.color} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{n.title}</div>
                  {!n.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 6 }}>{n.message}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  🕐 {n.time}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {!n.read && (
                  <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); markRead(n.id); }} title="Mark as read">
                    <CheckCheck size={14} />
                  </button>
                )}
                <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); remove(n.id); }} title="Remove">
                  <X size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px 20px;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }
        .notification-item:hover {
          box-shadow: var(--shadow);
          transform: translateX(2px);
        }
      `}</style>
    </div>
  );
}
