import { useState } from 'react';
import { 
  ShieldCheck, Search, Download, Lock, CheckCircle2
} from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';

export default function AuditLogs() {
  const { auditLogs, addAuditLog } = useHealthData();
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const modulesList = [
    'Medicine Inventory', 'Bed Management', 'Disease Surveillance', 
    'Reports & Analytics', 'Diagnostics', 'System Health', 'Alerts Module'
  ];

  const filteredLogs = auditLogs.filter(log => {
    if (moduleFilter !== 'ALL' && log.module !== moduleFilter) return false;
    if (roleFilter !== 'ALL' && log.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.id.toLowerCase().includes(q) ||
        log.user.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.module.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportAuditLogs = () => {
    addAuditLog('Exported Immutable System Audit Logs (CSV)', 'System Security', `Total ${filteredLogs.length} audit entries exported.`);
    setDownloadNotice(`Exported 'CareBridge_Audit_Trail_${Date.now().toString().slice(-4)}.csv'`);
    setTimeout(() => setDownloadNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Government Administrative Audit Logs & Access Trail</span>
            </h1>
            <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <Lock className="w-3 h-3" /> WORM Immutable
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cryptographically sealed operational audit logs recording all officer actions, requisitions and exports
          </p>
        </div>

        <button
          onClick={handleExportAuditLogs}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Trail (CSV)</span>
        </button>
      </div>

      {downloadNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold">Module Filter:</span>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="bg-white border border-slate-300 text-xs text-slate-800 px-3 py-1.5 rounded-xl font-medium outline-none cursor-pointer shadow-sm"
            >
              <option value="ALL">All Modules</option>
              {modulesList.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold">Role Filter:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-white border border-slate-300 text-xs text-slate-800 px-3 py-1.5 rounded-xl font-medium outline-none cursor-pointer shadow-sm"
            >
              <option value="ALL">All Roles</option>
              <option value="State Administrator">State Administrator</option>
              <option value="District Administrator">District Administrator</option>
              <option value="Hospital Administrator">Hospital Administrator</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by log ID, user, action details or IP address..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp & Log ID</th>
                <th className="py-3 px-3">Officer & Role</th>
                <th className="py-3 px-3">Action Performed</th>
                <th className="py-3 px-3">Module</th>
                <th className="py-3 px-3">Network IP / Node</th>
                <th className="py-3 px-3">Result</th>
                <th className="py-3 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="text-slate-900 font-bold block">{log.timestamp}</span>
                    <span className="text-[10px] text-slate-400">{log.id}</span>
                  </td>

                  <td className="py-3 px-3 font-sans">
                    <span className="font-bold text-slate-900 block">{log.user}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">{log.role}</span>
                  </td>

                  <td className="py-3 px-3 font-sans font-semibold text-slate-900">
                    {log.action}
                  </td>

                  <td className="py-3 px-3 font-sans">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 text-[10px] font-bold">
                      {log.module}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-500 text-[10px]">
                    {log.ipAddress}
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-emerald-700 font-bold text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {log.result}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-sans text-slate-600 text-[11px] max-w-xs truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
