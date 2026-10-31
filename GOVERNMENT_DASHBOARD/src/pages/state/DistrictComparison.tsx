import { useState } from 'react';
import { 
  Download, Filter, 
  ArrowUpDown, CheckCircle2, TrendingUp, Info
} from 'lucide-react';
import { useHealthData } from '../../context/HealthDataContext';
import { MOCK_DISTRICT_PERFORMANCE, type DistrictPerformanceMetric } from '../../data/mockData';

export default function DistrictComparison() {
  const { addAuditLog } = useHealthData();
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPTIMAL' | 'ATTENTION' | 'CRITICAL'>('ALL');
  const [sortField, setSortField] = useState<keyof DistrictPerformanceMetric>('compositeScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [notification, setNotification] = useState<string | null>(null);

  const handleSort = (field: keyof DistrictPerformanceMetric) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredData = MOCK_DISTRICT_PERFORMANCE.filter(d => {
    if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;
    return true;
  }).sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    }
    return String(valA).localeCompare(String(valB)) * (sortOrder === 'asc' ? 1 : -1);
  });

  const handleExportCSV = () => {
    const headers = [
      'District', 'Status', 'Composite Score', 'Avg Wait Time (min)', 
      'Referral Rate (%)', 'Medicine Availability (%)', 'Diagnostics (%)', 
      'Teleconsults', 'Follow-up Rate (%)', 'Camp Attendance', 'Staffing Gaps', 'Bed Occupancy (%)'
    ];
    const rows = filteredData.map(d => [
      d.districtName, d.status, d.compositeScore, d.avgWaitingTimeMinutes,
      `${d.referralCompletionRate}%`, `${d.medicineAvailabilityPercent}%`, `${d.diagnosticAvailabilityPercent}%`,
      d.teleconsultCount, `${d.followUpCompletionRate}%`, d.healthCampAttendance, d.facilityStaffingGapsCount, `${d.bedOccupancyPercent}%`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TN_District_Performance_Benchmark_${Date.now().toString().slice(-4)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog(
      'Exported District Healthcare Performance Benchmark CSV',
      'District Comparison',
      `Exported comparative records for ${filteredData.length} districts.`
    );
    setNotification('Successfully generated & downloaded District Performance Benchmark CSV.');
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-700" />
            <span>Statewide District Performance & Healthcare Accessibility Benchmark</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Standardized comparative indicators across all 8 major health districts of Tamil Nadu for equity in public healthcare delivery.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Benchmark CSV</span>
        </button>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-xs text-emerald-900 font-semibold shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* FILTER & STATS BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-bold text-slate-700">Filter by Tier:</span>
          {(['ALL', 'OPTIMAL', 'ATTENTION', 'CRITICAL'] as const).map(tier => (
            <button
              key={tier}
              onClick={() => setStatusFilter(tier)}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === tier 
                  ? tier === 'CRITICAL' ? 'bg-red-600 text-white' :
                    tier === 'ATTENTION' ? 'bg-amber-600 text-white' :
                    tier === 'OPTIMAL' ? 'bg-emerald-600 text-white' :
                    'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        <div className="text-slate-500 text-[11px]">
          Showing <strong>{filteredData.length}</strong> of 8 Major Healthcare Districts
        </div>
      </div>

      {/* COMPARISON TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="py-3 px-3 cursor-pointer" onClick={() => handleSort('districtName')}>
                <div className="flex items-center gap-1">
                  <span>District</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer text-center" onClick={() => handleSort('compositeScore')}>
                <div className="flex items-center justify-center gap-1">
                  <span>Composite Score</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer text-center" onClick={() => handleSort('avgWaitingTimeMinutes')}>
                <div className="flex items-center justify-center gap-1">
                  <span>Avg Wait</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer text-center" onClick={() => handleSort('referralCompletionRate')}>
                <div className="flex items-center justify-center gap-1">
                  <span>Referral %</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer text-center" onClick={() => handleSort('medicineAvailabilityPercent')}>
                <div className="flex items-center justify-center gap-1">
                  <span>Med Stock %</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer text-center" onClick={() => handleSort('diagnosticAvailabilityPercent')}>
                <div className="flex items-center justify-center gap-1">
                  <span>Diagnostics %</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer text-center" onClick={() => handleSort('teleconsultCount')}>
                <div className="flex items-center justify-center gap-1">
                  <span>Teleconsults</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer text-center" onClick={() => handleSort('followUpCompletionRate')}>
                <div className="flex items-center justify-center gap-1">
                  <span>Follow-up %</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer text-center" onClick={() => handleSort('facilityStaffingGapsCount')}>
                <div className="flex items-center justify-center gap-1">
                  <span>Staff Gaps</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer text-center" onClick={() => handleSort('bedOccupancyPercent')}>
                <div className="flex items-center justify-center gap-1">
                  <span>Bed Occ %</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredData.map((d, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-3 font-bold text-slate-900">{d.districtName} District</td>
                <td className="py-3 px-3 text-center">
                  <span className="font-mono font-black text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                    {d.compositeScore}/100
                  </span>
                </td>
                <td className="py-3 px-3 text-center font-mono">
                  <span className={d.avgWaitingTimeMinutes > 30 ? 'text-red-600 font-bold' : 'text-slate-700'}>
                    {d.avgWaitingTimeMinutes} mins
                  </span>
                </td>
                <td className="py-3 px-3 text-center font-mono font-bold text-emerald-700">
                  {d.referralCompletionRate}%
                </td>
                <td className="py-3 px-3 text-center font-mono">
                  <span className={d.medicineAvailabilityPercent < 75 ? 'text-red-600 font-bold' : 'text-slate-800'}>
                    {d.medicineAvailabilityPercent}%
                  </span>
                </td>
                <td className="py-3 px-3 text-center font-mono text-slate-800">{d.diagnosticAvailabilityPercent}%</td>
                <td className="py-3 px-3 text-center font-mono font-bold text-teal-800">{d.teleconsultCount.toLocaleString()}</td>
                <td className="py-3 px-3 text-center font-mono text-emerald-700">{d.followUpCompletionRate}%</td>
                <td className="py-3 px-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    d.facilityStaffingGapsCount > 8 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {d.facilityStaffingGapsCount} Posts
                  </span>
                </td>
                <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">{d.bedOccupancyPercent}%</td>
                <td className="py-3 px-3 text-right">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    d.status === 'CRITICAL' ? 'bg-red-50 text-red-700 border border-red-200' :
                    d.status === 'ATTENTION' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* METRIC DEFINITIONS GUIDANCE */}
      <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-3 text-xs text-blue-900">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold">Public Health Governance Note:</strong>
          <p className="text-[11px] text-blue-800 leading-relaxed">
            Districts scoring in the <em>Critical</em> tier (Composite Score &lt; 65) trigger mandatory administrative review at the State Health Secretariat. Priority actions include deployment of rotational specialists, emergency replenishment from TNMSC medical warehouses, and scheduling of targeted mobile health camps.
          </p>
        </div>
      </div>
    </div>
  );
}
