import { useState } from 'react';
import { 
  ShieldAlert, AlertTriangle, Info, CheckCircle2, Clock, Building2, Search
} from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';

export default function DiseaseAlerts() {
  const { ruleAlerts, resolveRuleAlert } = useHealthData();
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'Critical' | 'Warning' | 'Information'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Active' | 'Resolved'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredAlerts = ruleAlerts.filter(a => {
    if (categoryFilter !== 'ALL' && a.category !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.facility.toLowerCase().includes(q) ||
        a.district.toLowerCase().includes(q) ||
        a.actionNeeded.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleResolve = (id: string, title: string) => {
    resolveRuleAlert(id);
    setActionSuccess(`Action initiated for "${title}". Status marked as Resolved.`);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <span>Centralized Alert Intelligence & Action Protocol Hub</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated rule-based alarms detecting capacity overloads, medicine stockouts, specialist shortages & disease outbreak surges
          </p>
        </div>

        <div className="text-xs bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl text-red-700 font-medium">
          Active Alarms: <strong className="text-red-700 font-mono">{ruleAlerts.filter(a => a.status === 'Active').length} Active Triggers</strong>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* 3 Alert Category Filter Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setCategoryFilter(categoryFilter === 'Critical' ? 'ALL' : 'Critical')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm ${
            categoryFilter === 'Critical' ? 'bg-red-50 border-red-300 ring-2 ring-red-400/30' : 'bg-white border-slate-200 hover:border-red-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-700 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Critical Incidents</span>
            </span>
            <span className="text-lg font-black text-slate-900 font-mono">
              {ruleAlerts.filter(a => a.category === 'Critical').length}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Bed overcapacity, drug stockout, outbreak surge</p>
        </div>

        <div 
          onClick={() => setCategoryFilter(categoryFilter === 'Warning' ? 'ALL' : 'Warning')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm ${
            categoryFilter === 'Warning' ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/30' : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Operational Warnings</span>
            </span>
            <span className="text-lg font-black text-slate-900 font-mono">
              {ruleAlerts.filter(a => a.category === 'Warning').length}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Specialist shortages, low buffer stocks, diagnostic delays</p>
        </div>

        <div 
          onClick={() => setCategoryFilter(categoryFilter === 'Information' ? 'ALL' : 'Information')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm ${
            categoryFilter === 'Information' ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400/30' : 'bg-white border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600" />
              <span>System Notifications</span>
            </span>
            <span className="text-lg font-black text-slate-900 font-mono">
              {ruleAlerts.filter(a => a.category === 'Information').length}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">New doctor on-boarded, batch sync completion</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 font-semibold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-white border border-slate-300 text-xs text-slate-800 px-3 py-1.5 rounded-xl font-medium outline-none cursor-pointer shadow-sm"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active Triggers</option>
            <option value="Resolved">Resolved Protocol</option>
          </select>
        </div>

        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by alert title, facility, action required or district..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Alert Feed Cards */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.category === 'Critical';
          const isWarning = alert.category === 'Warning';
          const isResolved = alert.status === 'Resolved';

          return (
            <div 
              key={alert.id}
              className={`bg-white border rounded-2xl p-5 shadow-sm transition-all ${
                isResolved
                  ? 'border-slate-200 opacity-70'
                  : isCritical
                  ? 'border-red-300 ring-1 ring-red-400/20 bg-gradient-to-r from-red-50/50 via-white to-white'
                  : isWarning
                  ? 'border-amber-300 bg-gradient-to-r from-amber-50/40 via-white to-white'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2.5 rounded-2xl flex-shrink-0 shadow-sm ${
                    isResolved
                      ? 'bg-slate-100 text-slate-500'
                      : isCritical
                      ? 'bg-red-600 text-white animate-pulse'
                      : isWarning
                      ? 'bg-amber-500 text-white'
                      : 'bg-blue-600 text-white'
                  }`}>
                    {isCritical ? <ShieldAlert className="w-5 h-5" /> : isWarning ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                        isCritical 
                          ? 'bg-red-50 text-red-700 border-red-200' 
                          : isWarning 
                          ? 'bg-amber-50 text-amber-700 border-amber-200' 
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {alert.category} • {alert.ruleType.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" /> {alert.timestamp}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{alert.title}</h3>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{alert.facility} ({alert.district} District)</span>
                    </div>

                    <div className="pt-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                        Government Action Protocol:
                      </span>
                      <p className="text-xs text-slate-700 font-medium">{alert.actionNeeded}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                  {isResolved ? (
                    <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-emerald-700 font-bold text-xs rounded-xl flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Action Resolved
                    </span>
                  ) : (
                    <button
                      onClick={() => handleResolve(alert.id, alert.title)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer whitespace-nowrap"
                    >
                      Execute & Resolve Protocol
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
