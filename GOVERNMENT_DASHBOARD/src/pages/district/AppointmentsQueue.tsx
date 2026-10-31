import { useState, useMemo } from 'react';
import { 
  AlertTriangle, CheckCircle2, 
  RefreshCw, Stethoscope
} from 'lucide-react';
import { useHealthData } from '../../context/HealthDataContext';
import { MOCK_APPOINTMENTS_QUEUE } from '../../data/mockData';

export default function AppointmentsQueue() {
  const { districtName, addAuditLog } = useHealthData();
  const [queueData, setQueueData] = useState(MOCK_APPOINTMENTS_QUEUE);
  const [congestionFilter, setCongestionFilter] = useState<string>('ALL');
  const [notification, setNotification] = useState<string | null>(null);

  // Scoped district queues
  const filteredQueues = useMemo(() => {
    return queueData.filter(q => {
      const matchesDistrict = !districtName || districtName === 'ALL' || q.district === districtName;
      const matchesCongestion = congestionFilter === 'ALL' || q.congestionLevel === congestionFilter;
      return matchesDistrict && matchesCongestion;
    });
  }, [queueData, districtName, congestionFilter]);

  // Totals
  const totalAppointments = useMemo(() => filteredQueues.reduce((a, c) => a + c.todayAppointments, 0), [filteredQueues]);
  const totalWaiting = useMemo(() => filteredQueues.reduce((a, c) => a + c.activeWaitingQueue, 0), [filteredQueues]);
  const avgWait = useMemo(() => {
    if (filteredQueues.length === 0) return 0;
    return Math.round(filteredQueues.reduce((a, c) => a + c.avgWaitingTimeMinutes, 0) / filteredQueues.length);
  }, [filteredQueues]);
  const congestedFacilities = useMemo(() => filteredQueues.filter(q => q.congestionLevel === 'CONGESTED').length, [filteredQueues]);

  const handleMitigateCongestion = (facilityName: string) => {
    addAuditLog(
      `Queue Overflow Advisory Sent for ${facilityName}`,
      'Appointments & Queue',
      `Auto-redirecting non-emergency walk-ins to nearby upgraded PHC. Average wait: ${avgWait}m.`
    );
    setNotification(`Congestion Protocol Activated: Advisory dispatched for ${facilityName}. Nearby PHC notified of overflow triage.`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                DISTRICT OPD & QUEUE INTELLIGENCE
              </span>
              <span className="text-xs text-slate-300">
                {districtName || 'Salem'} Health Facilities
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Hospital OPD Appointments & Patient Queue Monitoring
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Real-time monitoring of outpatient department registrations, active waiting queues, average doctor consultation times, and congestion bottlenecks across primary and secondary hospitals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setQueueData([...MOCK_APPOINTMENTS_QUEUE]);
                setNotification('Queue telemetry refreshed with live OPD biometric tokens.');
                setTimeout(() => setNotification(null), 3000);
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur border border-white/10 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-blue-300" />
              Refresh Telemetry
            </button>
          </div>
        </div>

        {/* Aggregated OPD Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-slate-400">Total Booked Today</span>
            <p className="text-xl font-bold text-white mt-0.5">{totalAppointments.toLocaleString()} OPD</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-amber-300">Currently in Waiting Room</span>
            <p className="text-xl font-bold text-amber-300 mt-0.5">{totalWaiting} patients</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-blue-300">District Avg Wait Time</span>
            <p className="text-xl font-bold text-blue-300 mt-0.5">{avgWait} mins</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-rose-300">Congested Facilities</span>
            <p className="text-xl font-bold text-rose-400 mt-0.5">{congestedFacilities} sites</p>
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
          <span className="text-xs font-semibold text-slate-500">Congestion Filter:</span>
          {['ALL', 'NORMAL', 'HIGH', 'CONGESTED'].map((filter) => (
            <button
              key={filter}
              onClick={() => setCongestionFilter(filter)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                congestionFilter === filter
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-400">
          Showing {filteredQueues.length} facilities in {districtName || 'Salem'}
        </div>
      </div>

      {/* Facility Queues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQueues.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 hover:border-blue-400 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                    {item.facilityId}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    item.congestionLevel === 'NORMAL' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                    item.congestionLevel === 'HIGH' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                  }`}>
                    {item.congestionLevel}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1.5">
                  {item.facilityName}
                </h3>
                <span className="text-xs text-slate-400">{item.type}</span>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">Avg Wait Time</span>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {item.avgWaitingTimeMinutes} <span className="text-xs font-normal text-slate-500">mins</span>
                </p>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div>
                <span className="text-[11px] text-slate-400">Today Booked</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{item.todayAppointments}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Completed OPD</span>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{item.completedAppointments}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Active Queue</span>
                <p className={`text-sm font-bold mt-0.5 ${
                  item.activeWaitingQueue > 50 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
                }`}>
                  {item.activeWaitingQueue} waiting
                </p>
              </div>
            </div>

            {/* Doctors on Duty & Actions */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
                <span>{item.availableDoctorsCount} Doctors active in OPD</span>
              </div>

              {item.congestionLevel === 'CONGESTED' ? (
                <button
                  onClick={() => handleMitigateCongestion(item.facilityName)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Activate Divert Protocol
                </button>
              ) : (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Queue Flow Normal
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
