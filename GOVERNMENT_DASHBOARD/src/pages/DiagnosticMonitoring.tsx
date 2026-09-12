import { useState } from 'react';
import { 
  Zap, Search, CheckCircle2, Wrench, ShieldAlert
} from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';

export default function DiagnosticMonitoring() {
  const { diagnosticItems, currentDistrict } = useHealthData();
  const [selectedTest, setSelectedTest] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Available' | 'High Queue' | 'Critical Delay'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const testsList = [
    'CBC (Complete Blood Count)', 'Blood Sugar / HbA1c', 'Urine Routine',
    'X-Ray Digital', 'Ultrasound Sonography', 'ECG 12-Lead', 'CT Scan', 'MRI Scan'
  ];

  // Unserved diagnostic alerts
  const unavailableAlerts = [
    { service: 'Digital X-Ray', facilityCount: 8, locationNote: 'Mecheri PHC (Primary Health Centre) & 6 Rural Health Posts' },
    { service: 'Ultrasound Sonography', facilityCount: 4, locationNote: 'Yercaud Tribal Block & Kadayampatti PHCs' }
  ];

  const filteredItems = diagnosticItems.filter(d => {
    if (selectedTest !== 'ALL' && d.testName !== selectedTest) return false;
    if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.testName.toLowerCase().includes(q) ||
        d.facility.toLowerCase().includes(q) ||
        d.centreName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-600" />
            <span>Diagnostic Facilities & Equipment Uptime Command</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time tracking of Pathology, Digital X-Ray, Sonography, ECG, CT & MRI diagnostic capabilities
          </p>
        </div>

        <div className="text-xs bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-emerald-800 font-medium">
          District Diagnostic Centres: <strong className="text-emerald-700 font-mono">{currentDistrict.diagnosticCentresCount} Centres</strong>
        </div>
      </div>

      {/* Unavailable Diagnostics Alert Banner */}
      <div className="bg-gradient-to-r from-red-50 via-rose-50 to-red-50 border border-red-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-600 text-white rounded-xl flex-shrink-0 shadow-sm">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-red-900">
                Unavailable Diagnostic Services Detected in Rural Pockets
              </h3>
              <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded border border-red-200">
                Gaps Identified
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              {unavailableAlerts.map((u, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-xl border border-red-100 shadow-xs">
                  <span className="text-slate-900 font-bold block">{u.service} Unavailable in {u.facilityCount} Clinics</span>
                  <span className="text-[11px] text-red-700 block">{u.locationNote}</span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Mitigation: Mobile Diagnostic Van dispatched on 3-day weekly rotation.
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Diagnostics KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">Tests Performed Today</span>
          <div className="text-xl font-black text-slate-900 mt-1">1,083</div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">+14% volume</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">Pending In-Queue</span>
          <div className="text-xl font-black text-amber-600 mt-1">121 Tests</div>
          <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">Average TAT: 1.8 Hours</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">Equipment Uptime</span>
          <div className="text-xl font-black text-emerald-600 mt-1">94.8%</div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Optimal maintenance</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">Defective Equipment</span>
          <div className="text-xl font-black text-rose-600 mt-1">2 Machines</div>
          <span className="text-[10px] text-rose-700 font-bold block mt-0.5">Under engineer repair</span>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Test Name Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold">Test Stream:</span>
            <select
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
              className="bg-white border border-slate-300 text-xs text-emerald-700 font-bold px-3 py-1.5 rounded-xl outline-none cursor-pointer shadow-sm"
            >
              <option value="ALL">All Diagnostic Streams (8)</option>
              {testsList.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {(['ALL', 'Available', 'High Queue', 'Critical Delay'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  statusFilter === st 
                    ? st === 'Critical Delay' 
                      ? 'bg-rose-600 text-white' 
                      : st === 'High Queue'
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'ALL' ? 'All Statuses' : st}
              </button>
            ))}
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
            placeholder="Search by test name, hospital/centre name or diagnostic unit..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Diagnostic Equipment & Tests Grid Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Test Stream</th>
                <th className="py-3 px-3">Diagnostic Facility & Unit</th>
                <th className="py-3 px-3">Equipment Status</th>
                <th className="py-3 px-3">Daily Capacity</th>
                <th className="py-3 px-3">Tests Done Today</th>
                <th className="py-3 px-3">Pending Queue</th>
                <th className="py-3 px-3">Avg Turnaround</th>
                <th className="py-3 px-3">Service Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const statusBadge = item.status === 'Critical Delay'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : item.status === 'High Queue'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 group-hover:text-emerald-700 block">{item.testName}</span>
                      <span className="text-[10px] font-mono text-slate-400">{item.id}</span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-900 block">{item.facility}</span>
                      <span className="text-[10px] text-slate-500">{item.centreName}</span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${
                        item.equipmentStatus === 'Operational' 
                          ? 'text-emerald-700' 
                          : item.equipmentStatus === 'Degraded'
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}>
                        {item.equipmentStatus === 'Operational' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Wrench className="w-3.5 h-3.5" />}
                        {item.equipmentStatus}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {item.dailyCapacity} Tests/Day
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                      {item.testsPerformedToday} Tests
                    </td>

                    <td className="py-3 px-3 font-mono text-amber-700">
                      {item.pendingTestsToday} Pending
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-600">
                      {item.turnaroundTimeHours > 0 ? `${item.turnaroundTimeHours} Hours` : 'N/A'}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${statusBadge}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
