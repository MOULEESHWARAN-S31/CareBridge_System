import React from 'react';
import { Bell, X, AlertTriangle, ChevronRight } from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';
import { useNavigate } from 'react-router-dom';

export const NotificationsModal: React.FC = () => {
  const { notificationsOpen, setNotificationsOpen, notifications, markNotificationAsRead, setActiveActionAlert, alerts, districtName } = useHealthData();
  const navigate = useNavigate();

  if (!notificationsOpen) return null;

  return (
    <div className="absolute right-4 top-16 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn text-slate-800">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-600 animate-pulse" />
          <h3 className="font-extrabold text-sm text-slate-900">{districtName} Health Notifications</h3>
        </div>
        <button
          onClick={() => setNotificationsOpen(false)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markNotificationAsRead(n.id)}
            className={`p-4 transition-all cursor-pointer flex gap-3 hover:bg-slate-50 ${n.read ? 'opacity-60 bg-slate-50/50' : 'bg-white'}`}
          >
            <div className={`p-2 rounded-xl flex-shrink-0 h-fit border ${
              n.type === 'critical' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-amber-50 text-amber-600 border-amber-200'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-bold text-slate-900 truncate">{n.title}</h4>
                <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">{n.desc}</p>

              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotificationsOpen(false);
                    if (n.title.includes('Dengue')) {
                      const alt = alerts.find(a => a.villageName === 'Mecheri') || alerts[0];
                      if (alt) setActiveActionAlert(alt);
                      navigate('/dashboard/alerts');
                    } else if (n.title.includes('Anti-Venom') || n.title.includes('Supplies')) {
                      navigate('/dashboard/emergency-supplies');
                    } else if (n.title.includes('Hospital') || n.title.includes('PHC')) {
                      navigate('/dashboard/hospitals');
                    } else if (n.title.includes('Vaccination')) {
                      navigate('/dashboard/vaccination');
                    } else {
                      navigate('/dashboard/alerts');
                    }
                  }}
                  className="text-[11px] font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 group cursor-pointer"
                >
                  View Command Action <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-500 font-mono uppercase tracking-wider">
        Active Command Centre Feed • {districtName} District
      </div>
    </div>
  );
};
