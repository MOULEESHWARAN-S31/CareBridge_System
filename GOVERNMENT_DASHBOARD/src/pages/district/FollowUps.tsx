import { useState, useMemo } from 'react';
import { CheckCircle2, Send, Home, UserCheck, Download } from 'lucide-react';
import { useHealthData } from '../../context/HealthDataContext';
import { MOCK_FOLLOW_UP_PROGRAMS, type FollowUpProgramItem } from '../../data/mockData';

export default function FollowUps() {
  const { districtName, addAuditLog } = useHealthData();
  const [programs, setPrograms] = useState<FollowUpProgramItem[]>(MOCK_FOLLOW_UP_PROGRAMS);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [notification, setNotification] = useState<string | null>(null);

  // Scoped programs
  const districtPrograms = useMemo(() => {
    return programs.filter(p => {
      const matchDistrict = !districtName || districtName === 'ALL' || p.district === districtName;
      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
      return matchDistrict && matchStatus;
    });
  }, [programs, districtName, statusFilter]);

  // Aggregates
  const totalEnrolled = useMemo(() => districtPrograms.reduce((a, c) => a + c.totalEnrolled, 0), [districtPrograms]);
  const totalDue = useMemo(() => districtPrograms.reduce((a, c) => a + c.dueThisWeek, 0), [districtPrograms]);
  const totalMissed = useMemo(() => districtPrograms.reduce((a, c) => a + c.missedCount, 0), [districtPrograms]);
  const avgCompliance = useMemo(() => {
    if (districtPrograms.length === 0) return 0;
    return (districtPrograms.reduce((a, c) => a + c.complianceRate, 0) / districtPrograms.length).toFixed(1);
  }, [districtPrograms]);

  const handleDispatchReminders = (prog: FollowUpProgramItem) => {
    addAuditLog(
      `Dispatched Bulk Follow-Up Reminders for ${prog.programName}`,
      'High-Risk Follow-Ups',
      `Sent to ${prog.dueThisWeek} patients via ${prog.reminderChannel}. Supervisor: ${prog.assignedWorker}.`
    );
    setNotification(`Dispatched ${prog.dueThisWeek} automated reminders via ${prog.reminderChannel} for "${prog.programName}".`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAssignAshaVisit = (prog: FollowUpProgramItem) => {
    // Optimistically update missed count as traced
    setPrograms(prev =>
      prev.map(p => p.id === prog.id ? { ...p, missedCount: Math.max(0, p.missedCount - 1), complianceRate: Math.min(100, Number((p.complianceRate + 0.8).toFixed(1))) } : p)
    );
    addAuditLog(
      `ASHA Physical Tracing Task Created: ${prog.programName}`,
      'High-Risk Follow-Ups',
      `Assigned to ${prog.assignedWorker} for home visits to ${prog.missedCount} defaulting patients.`
    );
    setNotification(`Physical verification work order generated for ${prog.assignedWorker}.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleExportCSV = () => {
    const headers = ['Program Name', 'Target Facility', 'Enrolled Patients', 'Due This Week', 'Missed Visits', 'Compliance Rate (%)', 'Assigned Supervisor', 'Reminder Channel', 'Status'];
    const rows = districtPrograms.map(p => [
      `"${p.programName}"`,
      `"${p.targetFacility}"`,
      p.totalEnrolled,
      p.dueThisWeek,
      p.missedCount,
      p.complianceRate,
      `"${p.assignedWorker}"`,
      `"${p.reminderChannel}"`,
      `"${p.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `District_${districtName || 'Salem'}_FollowUp_Programs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog('Exported High-Risk Follow-Up Register', 'High-Risk Follow-Ups', 'CSV Download');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                DISTRICT CHRONIC & HIGH-RISK CARE
              </span>
              <span className="text-xs text-slate-300">
                {districtName || 'Salem'} Health Jurisdiction
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              High-Risk Patient Follow-Up & Adherence Tracking
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Monitor treatment compliance for vulnerable populations including Antenatal Care (ANC), infant immunization schedules, Tuberculosis DOTS, and NCD regimens across Village Health Nurse clusters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur border border-white/10 transition-colors"
            >
              <Download className="w-4 h-4 text-purple-300" />
              Export Register
            </button>
          </div>
        </div>

        {/* Aggregated KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-slate-400">Total Enrolled Cohort</span>
            <p className="text-xl font-bold text-white mt-0.5">{totalEnrolled.toLocaleString()} patients</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-purple-300">Follow-Ups Due This Week</span>
            <p className="text-xl font-bold text-purple-300 mt-0.5">{totalDue} visits</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-rose-300">Missed Visits / Defaulters</span>
            <p className="text-xl font-bold text-rose-400 mt-0.5">{totalMissed} unvisited</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-emerald-300">Cohort Compliance Rate</span>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">{avgCompliance}%</p>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Status Filter:</span>
          {['ALL', 'OPTIMAL', 'ATTENTION', 'CRITICAL'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === f
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-400">
          Showing {districtPrograms.length} clinical cohorts in {districtName || 'Salem'}
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {districtPrograms.map((prog) => (
          <div
            key={prog.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 hover:border-purple-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    prog.status === 'OPTIMAL' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                    prog.status === 'ATTENTION' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {prog.status}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {prog.targetFacility}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1.5">
                  {prog.programName}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">Compliance Rate</span>
                <p className={`text-xl font-bold mt-0.5 ${
                  prog.complianceRate >= 90 ? 'text-emerald-600 dark:text-emerald-400' :
                  prog.complianceRate >= 80 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {prog.complianceRate}%
                </p>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div>
                <span className="text-[11px] text-slate-400">Total Enrolled</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{prog.totalEnrolled}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Due This Week</span>
                <p className="text-sm font-bold text-purple-600 dark:text-purple-400 mt-0.5">{prog.dueThisWeek}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Missed / Defaulters</span>
                <p className={`text-sm font-bold mt-0.5 ${
                  prog.missedCount > 10 ? 'text-rose-600 dark:text-rose-400 font-extrabold' : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {prog.missedCount} unvisited
                </p>
              </div>
            </div>

            {/* Supervisor Info */}
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-3">
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-purple-500" />
                <span>{prog.assignedWorker}</span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">Channel: {prog.reminderChannel}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => handleAssignAshaVisit(prog)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-xs font-semibold transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                Assign ASHA Visit ({prog.missedCount})
              </button>
              <button
                onClick={() => handleDispatchReminders(prog)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch {prog.reminderChannel} ({prog.dueThisWeek})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
