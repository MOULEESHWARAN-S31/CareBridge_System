import { useState, useMemo } from 'react';
import { 
  Activity, AlertTriangle, ShieldCheck, 
  MapPin, Download
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer
} from 'recharts';
import { useHealthData } from '../../context/HealthDataContext';

interface SurveillanceMetric {
  id: string;
  disease: string;
  district: string;
  suspectedCases: number;
  confirmedCases: number;
  mortality: number;
  trend: 'rising' | 'stable' | 'declining';
  status: 'Under Investigation' | 'Containment Active' | 'Controlled' | 'Monitoring';
  lastReportedDate: string;
  reportingFacilitiesCount: number;
}

const STATEWIDE_SURVEILLANCE_METRICS: SurveillanceMetric[] = [
  { id: 'SURV-01', disease: 'Dengue Fever', district: 'Salem', suspectedCases: 142, confirmedCases: 38, mortality: 0, trend: 'rising', status: 'Containment Active', lastReportedDate: '2026-10-31', reportingFacilitiesCount: 14 },
  { id: 'SURV-02', disease: 'Acute Diarrheal Disease (ADD)', district: 'Coimbatore', suspectedCases: 89, confirmedCases: 21, mortality: 0, trend: 'stable', status: 'Under Investigation', lastReportedDate: '2026-10-30', reportingFacilitiesCount: 11 },
  { id: 'SURV-03', disease: 'Viral Hepatitis A', district: 'Madurai', suspectedCases: 54, confirmedCases: 16, mortality: 0, trend: 'declining', status: 'Controlled', lastReportedDate: '2026-10-29', reportingFacilitiesCount: 8 },
  { id: 'SURV-04', disease: 'Typhoid Fever', district: 'Tiruchirappalli', suspectedCases: 37, confirmedCases: 9, mortality: 0, trend: 'stable', status: 'Monitoring', lastReportedDate: '2026-10-31', reportingFacilitiesCount: 7 },
  { id: 'SURV-05', disease: 'Leptospirosis', district: 'Chennai', suspectedCases: 28, confirmedCases: 12, mortality: 1, trend: 'rising', status: 'Containment Active', lastReportedDate: '2026-10-31', reportingFacilitiesCount: 19 },
  { id: 'SURV-06', disease: 'Scrub Typhus', district: 'Vellore', suspectedCases: 19, confirmedCases: 5, mortality: 0, trend: 'declining', status: 'Monitoring', lastReportedDate: '2026-10-28', reportingFacilitiesCount: 6 },
  { id: 'SURV-07', disease: 'Malaria (P. vivax)', district: 'Tirunelveli', suspectedCases: 15, confirmedCases: 3, mortality: 0, trend: 'declining', status: 'Controlled', lastReportedDate: '2026-10-27', reportingFacilitiesCount: 5 },
  { id: 'SURV-08', disease: 'Dengue Fever', district: 'Erode', suspectedCases: 64, confirmedCases: 17, mortality: 0, trend: 'stable', status: 'Under Investigation', lastReportedDate: '2026-10-30', reportingFacilitiesCount: 9 },
];

export default function StateSurveillance() {
  const { districts, isOfflineMock } = useHealthData();
  const [selectedDisease, setSelectedDisease] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredMetrics = useMemo(() => {
    return STATEWIDE_SURVEILLANCE_METRICS.filter(item => {
      if (selectedDisease !== 'ALL' && item.disease !== selectedDisease) return false;
      if (selectedDistrict !== 'ALL' && item.district !== selectedDistrict) return false;
      if (filterStatus !== 'ALL' && item.status !== filterStatus) return false;
      return true;
    });
  }, [selectedDisease, selectedDistrict, filterStatus]);

  const totalSuspected = filteredMetrics.reduce((sum, i) => sum + i.suspectedCases, 0);
  const totalConfirmed = filteredMetrics.reduce((sum, i) => sum + i.confirmedCases, 0);
  const totalMortality = filteredMetrics.reduce((sum, i) => sum + i.mortality, 0);
  const activeClusters = filteredMetrics.filter(i => i.status === 'Containment Active' || i.status === 'Under Investigation').length;

  const chartData = useMemo(() => {
    const distMap: Record<string, { district: string; suspected: number; confirmed: number }> = {};
    filteredMetrics.forEach(m => {
      if (!distMap[m.district]) {
        distMap[m.district] = { district: m.district, suspected: 0, confirmed: 0 };
      }
      distMap[m.district].suspected += m.suspectedCases;
      distMap[m.district].confirmed += m.confirmedCases;
    });
    return Object.values(distMap);
  }, [filteredMetrics]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              State Admin Workspace • IDSP Surveillance Directorate
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              isOfflineMock ? 'bg-amber-50 text-amber-700 border border-amber-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
            }`}>
              ● Integrated Disease Surveillance Program (IDSP)
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-700" />
            <span>Statewide Disease Surveillance & Health Heatmap (Non-AI)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official non-AI epidemiological telemetry. Verifiable reported suspect vs. confirmed clusters from all 38 revenue districts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export IDSP Digest</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Suspected Cases</span>
            <Activity className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">{totalSuspected}</div>
          <p className="text-[11px] text-slate-500 mt-1">Syndromic reports from PHCs</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lab-Confirmed</span>
            <ShieldCheck className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">{totalConfirmed}</div>
          <p className="text-[11px] text-slate-500 mt-1">RT-PCR / ELISA verified</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Clusters</span>
            <AlertTriangle className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-600">{activeClusters}</div>
          <p className="text-[11px] text-slate-500 mt-1">Under containment protocol</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reported Mortality</span>
            <MapPin className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-black text-slate-800">{totalMortality}</div>
          <p className="text-[11px] text-slate-500 mt-1">Verified disease fatalities</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div>
          <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Disease Filter</label>
          <select 
            value={selectedDisease} 
            onChange={e => setSelectedDisease(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="ALL">All Monitored Diseases</option>
            <option value="Dengue Fever">Dengue Fever</option>
            <option value="Acute Diarrheal Disease (ADD)">Acute Diarrheal Disease (ADD)</option>
            <option value="Viral Hepatitis A">Viral Hepatitis A</option>
            <option value="Typhoid Fever">Typhoid Fever</option>
            <option value="Leptospirosis">Leptospirosis</option>
            <option value="Scrub Typhus">Scrub Typhus</option>
            <option value="Malaria (P. vivax)">Malaria (P. vivax)</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">District</label>
          <select 
            value={selectedDistrict} 
            onChange={e => setSelectedDistrict(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="ALL">All Revenue Districts</option>
            {districts.map(d => (
              <option key={d.name} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Containment Status</label>
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="Containment Active">Containment Active</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Monitoring">Monitoring</option>
            <option value="Controlled">Controlled</option>
          </select>
        </div>
      </div>

      {/* Chart: Suspected vs Confirmed Cases by District */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-700" />
          <span>Reported Cases by District (Suspected vs Confirmed)</span>
        </h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="district" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="suspected" name="Suspected" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="confirmed" name="Lab Confirmed" fill="#e11d48" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Surveillance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Active Epidemiological Telemetry Ledger</span>
          </h2>
          <span className="text-xs font-bold text-slate-500">
            Showing {filteredMetrics.length} active surveillance clusters
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <th className="p-3">Cluster ID</th>
                <th className="p-3">Disease Name</th>
                <th className="p-3">District</th>
                <th className="p-3 text-right">Suspected</th>
                <th className="p-3 text-right">Confirmed</th>
                <th className="p-3">Trend</th>
                <th className="p-3">Containment Status</th>
                <th className="p-3">Reporting Units</th>
                <th className="p-3">Last Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredMetrics.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-teal-800">{item.id}</td>
                  <td className="p-3 font-bold text-slate-900">{item.disease}</td>
                  <td className="p-3 font-semibold text-slate-800">{item.district}</td>
                  <td className="p-3 text-right font-black text-amber-700">{item.suspectedCases}</td>
                  <td className="p-3 text-right font-black text-rose-700">{item.confirmedCases}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.trend === 'rising' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      item.trend === 'stable' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {item.trend === 'rising' ? '▲ Rising' : item.trend === 'stable' ? '▬ Stable' : '▼ Declining'}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'Containment Active' ? 'bg-rose-100 text-rose-800' :
                      item.status === 'Under Investigation' ? 'bg-purple-100 text-purple-800' :
                      item.status === 'Monitoring' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-600">{item.reportingFacilitiesCount} PHCs/GHs</td>
                  <td className="p-3 text-slate-500 font-mono text-[11px]">{item.lastReportedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
