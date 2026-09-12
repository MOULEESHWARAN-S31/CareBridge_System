import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Stethoscope, 
  BedDouble, AlertTriangle, Activity, ShieldAlert,
  TrendingUp, ArrowUpRight, Zap
} from 'lucide-react';
import { 
  AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { useHealthData } from '../context/HealthDataContext';

export default function Overview() {
  const navigate = useNavigate();
  const { 
    currentDistrict, 
    ruleAlerts,
    resolveRuleAlert
  } = useHealthData();

  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('week');

  // Active Critical/Warning Alerts
  const activeAlerts = ruleAlerts.filter(a => a.status === 'Active');

  // Chart Data for Patient Registrations
  const registrationTrends = [
    { period: 'Mon', rural: 1240, urban: 890, tribal: 320 },
    { period: 'Tue', rural: 1380, urban: 940, tribal: 360 },
    { period: 'Wed', rural: 1420, urban: 1020, tribal: 390 },
    { period: 'Thu', rural: 1290, urban: 880, tribal: 340 },
    { period: 'Fri', rural: 1560, urban: 1110, tribal: 410 },
    { period: 'Sat', rural: 1480, urban: 990, tribal: 380 },
    { period: 'Sun', rural: 980, urban: 650, tribal: 240 },
  ];

  // Demographics Breakdown
  const patientDemographicsData = [
    { name: 'Rural Population', value: 58, color: '#007682' },
    { name: 'Urban Pockets', value: 27, color: '#0f4679' },
    { name: 'Tribal Settlement', value: 12, color: '#f59e0b' },
    { name: 'Others', value: 3, color: '#8b5cf6' },
  ];

  // Primary Clickable KPI Cards
  const kpiCards = [
    {
      title: 'Total Patients',
      value: currentDistrict.registeredPatients.toLocaleString(),
      change: '+4.2% this month',
      isPositive: true,
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      onClick: () => navigate('/dashboard/patients'),
      subtext: 'Across all registered government health facilities'
    },
    {
      title: 'Doctors Available',
      value: currentDistrict.doctorsCount.toLocaleString(),
      change: 'Specialists on active roster',
      isPositive: true,
      icon: Stethoscope,
      color: 'from-teal-600 to-emerald-600',
      textColor: 'text-teal-700',
      borderColor: 'border-teal-200',
      onClick: () => navigate('/dashboard/doctors'),
      subtext: 'Active on duty & emergency rotation'
    },
    {
      title: 'Available Beds',
      value: `${currentDistrict.availableBeds.toLocaleString()} / ${currentDistrict.totalBeds.toLocaleString()}`,
      change: `${Math.round(((currentDistrict.totalBeds - currentDistrict.availableBeds) / currentDistrict.totalBeds) * 100)}% Occupancy`,
      isPositive: currentDistrict.availableBeds > 500,
      icon: BedDouble,
      color: 'from-rose-600 to-pink-600',
      textColor: 'text-rose-700',
      borderColor: 'border-rose-200',
      onClick: () => navigate('/dashboard/beds-resources'),
      subtext: 'Including ICU, Oxygen & Pediatric'
    },
    {
      title: 'Medicine Stock Alerts',
      value: currentDistrict.medicineStockAlerts.toString(),
      change: 'Action requisition required',
      isPositive: false,
      icon: AlertTriangle,
      color: 'from-amber-600 to-rose-600',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
      onClick: () => navigate('/dashboard/medicine'),
      subtext: 'Items below minimum buffer threshold'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* LEVEL 1: CRITICAL ACTION BANNER */}
      {activeAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 shadow-xs animate-fadeIn">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-red-600 text-white rounded-xl flex-shrink-0 animate-pulse shadow-sm">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest bg-red-700 text-white px-2 py-0.5 rounded">
                    Level 1 — Immediate Decision Required ({activeAlerts.length} Active)
                  </span>
                  <span className="text-xs text-red-900 font-semibold">• Real-Time Health Intelligence Trigger</span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                  {activeAlerts[0].title}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  <strong className="text-red-700">Action Protocol:</strong> {activeAlerts[0].actionNeeded}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
              <button
                onClick={() => resolveRuleAlert(activeAlerts[0].id)}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Approve & Execute Protocol
              </button>
              <button
                onClick={() => navigate('/dashboard/alerts')}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold transition-all border border-slate-300 cursor-pointer shadow-xs"
              >
                View All Alerts ({activeAlerts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 2: PRIMARY KPI CARDS */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-700" />
              <span>Public Healthcare Command Overview</span>
            </h2>
            <p className="text-xs text-slate-500">
              District Jurisdiction: <strong>{currentDistrict.name} District</strong> • Population: {currentDistrict.population.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-xs">
            {(['today', 'week', 'month', 'year'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  timeRange === t 
                    ? 'bg-teal-700 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Primary KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {kpiCards.map((card, idx) => (
            <div
              key={idx}
              onClick={card.onClick}
              className={`bg-white border ${card.borderColor} p-4 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{card.title}</span>
                  <div className={`p-2 rounded-xl bg-slate-100 group-hover:bg-teal-50 transition-colors`}>
                    <card.icon className={`w-4 h-4 ${card.textColor}`} />
                  </div>
                </div>
                <div className="text-xl font-black text-slate-900 tracking-tight">{card.value}</div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100">
                <span className={`text-[11px] font-bold ${card.isPositive ? 'text-emerald-700' : 'text-rose-700'} flex items-center gap-1`}>
                  {card.change}
                </span>
                <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{card.subtext}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LEVEL 3: PATIENT REGISTRATION & DEMOGRAPHICS CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Registration Trends Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-700" />
                <span>Patient Registration Trends (By Settlement Category)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Daily outpatient registrations across Rural PHCs, Urban Taluk Hospitals, and Tribal Centers
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={registrationTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Area type="monotone" dataKey="rural" name="Rural Patients" stackId="1" stroke="#007682" fill="#007682" fillOpacity={0.6} />
                <Area type="monotone" dataKey="urban" name="Urban Patients" stackId="1" stroke="#0f4679" fill="#0f4679" fillOpacity={0.5} />
                <Area type="monotone" dataKey="tribal" name="Tribal Settlement" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demographics Donut & Breakdown (1 col) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-sm font-black text-slate-900">Demographic Distribution</h3>
            <p className="text-xs text-slate-500">Population coverage across geographical classifications</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={patientDemographicsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {patientDemographicsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '10px', fontSize: '11px', color: '#0f172a' }}
                  formatter={(value: any) => [`${value}%`, 'Coverage']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
            {patientDemographicsData.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 font-medium truncate">{item.name}:</span>
                <span className="font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* QUICK DECISION NAVIGATION BAR */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-teal-700" />
          <span>High-Priority Decision Hub (Instant Action Shortcuts)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div 
            onClick={() => navigate('/dashboard/district-map')}
            className="p-3 bg-slate-50 hover:bg-teal-50/60 border border-slate-200 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] text-teal-800 font-bold uppercase tracking-wider block">Geographic Gaps</span>
              <span className="text-xs font-bold text-slate-900">Which districts need attention?</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 transition-colors" />
          </div>

          <div 
            onClick={() => navigate('/dashboard/beds-resources')}
            className="p-3 bg-slate-50 hover:bg-teal-50/60 border border-slate-200 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider block">Overcrowding</span>
              <span className="text-xs font-bold text-slate-900">Which hospitals are near capacity?</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 transition-colors" />
          </div>

          <div 
            onClick={() => navigate('/dashboard/doctors')}
            className="p-3 bg-slate-50 hover:bg-teal-50/60 border border-slate-200 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider block">Specialists</span>
              <span className="text-xs font-bold text-slate-900">Where are doctor shortages?</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 transition-colors" />
          </div>

          <div 
            onClick={() => navigate('/dashboard/surveillance')}
            className="p-3 bg-slate-50 hover:bg-teal-50/60 border border-slate-200 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider block">Epidemic Watch</span>
              <span className="text-xs font-bold text-slate-900">Where are active outbreak clusters?</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 transition-colors" />
          </div>
        </div>
      </div>

    </div>
  );
}
