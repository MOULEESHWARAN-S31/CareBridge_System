import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, Activity, 
  ArrowRight, ShieldCheck, FileText, Calendar, PhoneCall, TrendingUp
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { useHealthData } from '../../context/HealthDataContext';
import { MOCK_DISTRICT_PERFORMANCE, MOCK_DISTRICT_REQUESTS } from '../../data/mockData';

export default function StateOverview() {
  const navigate = useNavigate();
  const { districts, setDistrictName, ruleAlerts, isOfflineMock } = useHealthData();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month'>('week');

  // Aggregated Statewide KPIs
  const totalStatewidePopulation = districts.reduce((acc, d) => acc + d.population, 0);
  const totalRegisteredPatients = districts.reduce((acc, d) => acc + d.registeredPatients, 0);
  const totalActiveHospitals = districts.reduce((acc, d) => acc + d.activeHospitals, 0);
  const totalDoctorsReported = districts.reduce((acc, d) => acc + d.doctorsCount, 0);
  const totalAvailableBeds = districts.reduce((acc, d) => acc + d.availableBeds, 0);
  const totalBedsStatewide = districts.reduce((acc, d) => acc + d.totalBeds, 0);
  const totalTeleconsultsToday = districts.reduce((acc, d) => acc + d.teleconsultationsToday, 0);
  const pendingStateRequests = MOCK_DISTRICT_REQUESTS.filter(r => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW');

  // Chart data: District utilization ranking
  const districtUtilizationData = MOCK_DISTRICT_PERFORMANCE.map(d => ({
    name: d.districtName,
    score: d.compositeScore,
    waitingTime: d.avgWaitingTimeMinutes,
    referralRate: d.referralCompletionRate,
    color: d.status === 'OPTIMAL' ? '#0d9488' : d.status === 'ATTENTION' ? '#f59e0b' : '#e11d48'
  }));

  const handleDrilldownDistrict = (distName: string) => {
    setDistrictName(distName);
    navigate('/dashboard/district/overview');
  };

  return (
    <div className="space-y-6">
      
      {/* State Admin Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              State Admin Workspace • Tamil Nadu Health Secretariat
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              isOfflineMock ? 'bg-amber-50 text-amber-700 border border-amber-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
            }`}>
              ● Statewide Aggregate Telemetry
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-700" />
            <span>Statewide Public Healthcare Command Overview</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Macro-level health intelligence, district service utilization, cross-district resource logistics & public health escalations.
          </p>
        </div>

        {/* Timeframe & Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {(['today', 'week', 'month'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  selectedTimeframe === tf ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate('/dashboard/state/requests')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>District Requests</span>
            {pendingStateRequests.length > 0 && (
              <span className="px-1.5 py-0.2 bg-white text-blue-700 rounded-full font-black text-[10px]">
                {pendingStateRequests.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* STATE OVERVIEW 4 PRIMARY KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => navigate('/dashboard/state/districts')}
          className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs hover:border-teal-400 transition-all cursor-pointer"
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Statewide Patients</span>
          <div className="text-2xl font-black text-teal-800 mt-1">{totalRegisteredPatients.toLocaleString()}</div>
          <span className="text-[10px] text-teal-600 block mt-0.5">Across {districts.length} Districts • Pop: {(totalStatewidePopulation / 1000000).toFixed(1)}M</span>
        </div>

        <div 
          onClick={() => navigate('/dashboard/hospitals')}
          className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs hover:border-blue-400 transition-all cursor-pointer"
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Health Facilities</span>
          <div className="text-2xl font-black text-blue-700 mt-1">{totalActiveHospitals} Facilities</div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Hospitals, GHs & Upgraded PHCs</span>
        </div>

        <div 
          onClick={() => navigate('/dashboard/doctors')}
          className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs hover:border-emerald-400 transition-all cursor-pointer"
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Clinical Staff on Duty</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{totalDoctorsReported.toLocaleString()} Docs</div>
          <span className="text-[10px] text-emerald-700 block mt-0.5">Specialists, MOs & Residents</span>
        </div>

        <div 
          onClick={() => navigate('/dashboard/beds-resources')}
          className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs hover:border-rose-400 transition-all cursor-pointer"
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Available Beds</span>
          <div className="text-2xl font-black text-rose-600 mt-1">{totalAvailableBeds.toLocaleString()} Beds</div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Total Capacity: {totalBedsStatewide.toLocaleString()} ({Math.round(((totalBedsStatewide - totalAvailableBeds) / totalBedsStatewide) * 100)}% Occupancy)</span>
        </div>
      </div>

      {/* SECONDARY STATEWIDE METRICS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <PhoneCall className="w-4 h-4 text-emerald-600" />
            <span>Teleconsultations Today</span>
          </div>
          <div className="text-lg font-black text-slate-900 mt-1">{totalTeleconsultsToday.toLocaleString()} Sessions</div>
          <span className="text-[10px] text-slate-400">e-Sanjeevani Active Network</span>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Active State Health Alerts</span>
          </div>
          <div className="text-lg font-black text-red-700 mt-1">{ruleAlerts.filter(a => a.status === 'Active').length} Active Triggers</div>
          <span className="text-[10px] text-red-600">Surveillance & Logistics Warnings</span>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <Calendar className="w-4 h-4 text-teal-700" />
            <span>Outreach Camps Scheduled</span>
          </div>
          <div className="text-lg font-black text-teal-700 mt-1">24 Scheduled</div>
          <span className="text-[10px] text-slate-400">Across 8 Health Districts</span>
        </div>

        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>District Escalations</span>
          </div>
          <div className="text-lg font-black text-blue-700 mt-1">{pendingStateRequests.length} Pending Review</div>
          <span className="text-[10px] text-blue-600">Staffing & Drug Requests</span>
        </div>
      </div>

      {/* DISTRICT PERFORMANCE UTILIZATION COMPARISON CHART */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-700" />
              <span>Statewide District Healthcare Performance Comparison (0–100 Composite Score)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Evaluates appointment waiting times, referral continuity, medicine buffer reliability & diagnostic capacity.
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/state/districts')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View Full District Comparison Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={districtUtilizationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                formatter={(val: any) => [`${val}/100 Composite Score`, 'Performance']}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {districtUtilizationData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* QUICK JUMP TO DISTRICTS DIRECTORY */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">District Administration Portals (Click to Inspect Local District Workspace)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {districts.map(d => (
            <div
              key={d.id}
              onClick={() => handleDrilldownDistrict(d.name)}
              className="p-3 bg-slate-50 hover:bg-teal-50/60 border border-slate-200 hover:border-teal-300 rounded-xl cursor-pointer transition-all flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-xs text-slate-800 block">{d.name}</span>
                <span className="text-[10px] text-slate-500">{d.activeHospitals} Facilities • {d.doctorsCount} Docs</span>
              </div>
              <span className={`w-2.5 h-2.5 rounded-full ${
                d.status === 'Critical' ? 'bg-red-500 animate-ping' : d.status === 'Attention' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
