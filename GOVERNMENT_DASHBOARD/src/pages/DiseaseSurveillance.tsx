import { useState, useMemo } from 'react';
import { 
  Filter, AlertTriangle, Download, Plus, Search, 
  CheckCircle2, X, ChevronRight, Activity, 
  UserCheck, FileText, BarChart3
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell 
} from 'recharts';
import { useHealthData } from '../context/HealthDataContext';
import { type SurveillanceCase, MOCK_SURVEILLANCE_TRENDS } from '../data/mockData';

export default function DiseaseSurveillance() {
  const { 
    stateName, 
    districtName, 
    villages, 
    surveillanceCases, 
    addSurveillanceCase, 
    updateSurveillanceCaseStatus, 
    flagEpidemiologist,
    addAuditLog 
  } = useHealthData();
  
  // Available Taluks for Current District
  const availableTaluks = useMemo(() => {
    const list = Array.from(new Set(surveillanceCases.map(c => c.taluk).concat(villages.map(v => v.taluk)))).filter(Boolean);
    return list.length > 0 ? list : ['Central', 'North', 'South', 'Rural'];
  }, [surveillanceCases, villages]);

  // Filter States
  const [selectedTaluk, setSelectedTaluk] = useState('ALL');
  const [selectedVillage, setSelectedVillage] = useState('ALL');
  const [selectedDisease, setSelectedDisease] = useState('ALL');
  const [dateRange, setDateRange] = useState<'7-day' | '30-day' | '6-month' | '1-year'>('7-day');
  const [ageGroup, setAgeGroup] = useState('ALL');
  const [gender, setGender] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'Critical Outbreak' | 'Active Cluster' | 'Watchlist' | 'Controlled'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & UI States
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<SurveillanceCase | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // New Case Form State
  const [formData, setFormData] = useState({
    disease: 'Dengue Fever',
    taluk: availableTaluks[0] || 'Taluk Centre',
    village: villages[0]?.name || 'Primary Village',
    facility: 'Primary Health Centre (PHC)',
    suspectedCases: 15,
    confirmedCases: 8,
    hospitalized: 4,
    recovered: 4,
    deathCount: 0,
    growthRate: '+45%',
    attackRate: 3.5,
    severity: 'Active Cluster' as SurveillanceCase['severity'],
    status: 'Active' as SurveillanceCase['status'],
    actionProtocol: 'Vector control team alerted. Initial NS1 screening active.',
    larvalBreteauIndex: 25,
    symptoms: 'High Fever, Headache, Joint Pain'
  });

  // Filtered Surveillance Cases
  const filteredCases = useMemo(() => {
    return surveillanceCases.filter(c => {
      if (selectedTaluk !== 'ALL' && c.taluk !== selectedTaluk) return false;
      if (selectedVillage !== 'ALL' && c.village !== selectedVillage) return false;
      if (selectedDisease !== 'ALL' && !c.disease.toLowerCase().includes(selectedDisease.toLowerCase())) return false;
      if (severityFilter !== 'ALL' && c.severity !== severityFilter) return false;
      
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.id.toLowerCase().includes(q) ||
          c.disease.toLowerCase().includes(q) ||
          c.village.toLowerCase().includes(q) ||
          c.taluk.toLowerCase().includes(q) ||
          c.facility.toLowerCase().includes(q) ||
          c.actionProtocol.toLowerCase().includes(q) ||
          c.symptoms.some(s => s.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [surveillanceCases, selectedTaluk, selectedVillage, selectedDisease, severityFilter, searchQuery]);

  // Dynamic Surveillance Calculations
  const totalConfirmed = useMemo(() => filteredCases.reduce((sum, c) => sum + c.confirmedCases, 0), [filteredCases]);
  const totalSuspected = useMemo(() => filteredCases.reduce((sum, c) => sum + c.suspectedCases, 0), [filteredCases]);
  const totalHospitalized = useMemo(() => filteredCases.reduce((sum, c) => sum + c.hospitalized, 0), [filteredCases]);
  const totalRecovered = useMemo(() => filteredCases.reduce((sum, c) => sum + c.recovered, 0), [filteredCases]);
  const activeClustersCount = useMemo(() => filteredCases.filter(c => c.status === 'Active').length, [filteredCases]);
  const avgAttackRate = useMemo(() => {
    if (filteredCases.length === 0) return '0.0';
    return (filteredCases.reduce((sum, c) => sum + c.attackRate, 0) / filteredCases.length).toFixed(1);
  }, [filteredCases]);

  // Primary critical outbreak spike cluster
  const spikeCluster = useMemo(() => {
    return surveillanceCases.find(c => c.severity === 'Critical Outbreak' && c.status === 'Active') || surveillanceCases[0];
  }, [surveillanceCases]);

  // Dynamic Chart Data for Disease Category Share
  const diseaseDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    surveillanceCases.forEach(c => {
      counts[c.disease] = (counts[c.disease] || 0) + c.confirmedCases;
    });
    const palette = ['#ef4444', '#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#eab308'];
    return Object.entries(counts).map(([name, value], idx) => ({
      name,
      value,
      color: palette[idx % palette.length]
    }));
  }, [surveillanceCases]);

  // Time-horizon Trend Data
  const monthlyTrendData = [
    { month: 'Jan', dengue: 12, respiratory: 110, diarrhoea: 24, malaria: 4 },
    { month: 'Feb', dengue: 8, respiratory: 95, diarrhoea: 18, malaria: 2 },
    { month: 'Mar', dengue: 15, respiratory: 80, diarrhoea: 22, malaria: 5 },
    { month: 'Apr', dengue: 22, respiratory: 75, diarrhoea: 30, malaria: 6 },
    { month: 'May', dengue: 35, respiratory: 85, diarrhoea: 45, malaria: 9 },
    { month: 'Jun', dengue: 52, respiratory: 120, diarrhoea: 60, malaria: 14 },
    { month: 'Jul', dengue: 88, respiratory: 140, diarrhoea: 78, malaria: 18 },
    { month: 'Aug', dengue: 145, respiratory: 165, diarrhoea: 92, malaria: 24 },
    { month: 'Sep (Cur)', dengue: totalConfirmed > 0 ? totalConfirmed : 182, respiratory: 180, diarrhoea: 105, malaria: 28 },
  ];

  // Export Surveillance CSV
  const handleExportCSV = () => {
    const headers = ['Cluster ID', 'Disease', 'District', 'Taluk', 'Village', 'Facility', 'Suspected', 'Confirmed', 'Hospitalized', 'Recovered', 'Growth Rate', 'Attack Rate', 'Severity', 'Status', 'Reported Date', 'Action Protocol'];
    const rows = filteredCases.map(c => [
      c.id,
      `"${c.disease}"`,
      `"${c.district}"`,
      `"${c.taluk}"`,
      `"${c.village}"`,
      `"${c.facility}"`,
      c.suspectedCases,
      c.confirmedCases,
      c.hospitalized,
      c.recovered,
      `"${c.growthRate}"`,
      c.attackRate,
      `"${c.severity}"`,
      `"${c.status}"`,
      c.reportedDate,
      `"${c.actionProtocol.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TN_Epidemiological_Surveillance_${districtName}_${Date.now().toString().slice(-4)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog(`Exported Epidemiological Surveillance CSV (${filteredCases.length} records)`, 'Disease Surveillance', `Exported by DHO for ${districtName} District.`);
    setNotification({ message: `Successfully exported ${filteredCases.length} surveillance cluster records to CSV.`, type: 'success' });
    setTimeout(() => setNotification(null), 5000);
  };

  // Submit New Case Report Form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const symptomsArray = formData.symptoms.split(',').map(s => s.trim()).filter(Boolean);
    addSurveillanceCase({
      disease: formData.disease,
      district: districtName,
      taluk: formData.taluk,
      village: formData.village,
      facility: formData.facility,
      suspectedCases: Number(formData.suspectedCases) || 0,
      confirmedCases: Number(formData.confirmedCases) || 0,
      hospitalized: Number(formData.hospitalized) || 0,
      recovered: Number(formData.recovered) || 0,
      deathCount: Number(formData.deathCount) || 0,
      growthRate: formData.growthRate,
      attackRate: Number(formData.attackRate) || 1.0,
      severity: formData.severity,
      status: formData.status,
      actionProtocol: formData.actionProtocol,
      larvalBreteauIndex: Number(formData.larvalBreteauIndex) || 0,
      symptoms: symptomsArray.length > 0 ? symptomsArray : ['Fever', 'Malaise']
    });

    setReportModalOpen(false);
    setNotification({ message: `New surveillance cluster for ${formData.disease} in ${formData.village} successfully registered.`, type: 'success' });
    setTimeout(() => setNotification(null), 5000);
  };

  // Trigger Epidemiologist Flagging
  const handleFlagEpidemiologist = (clusterId: string) => {
    flagEpidemiologist(clusterId);
    setNotification({ message: `Alert successfully flagged to District Epidemiologist. Response team dispatched.`, type: 'warning' });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              <span>Epidemiological Disease Surveillance Command</span>
            </h1>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Live Vector & Disease Grid
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time infectious disease tracking, automated anomaly detection, and vector-borne outbreak surveillance across {districtName} District.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setReportModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Report Outbreak / Case
          </button>
          <button 
            onClick={handleExportCSV}
            className="bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" /> Export Dataset (CSV)
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-semibold animate-fadeIn ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
          notification.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* KPI Overview Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Confirmed</span>
          <span className="text-lg font-black text-slate-900 font-mono">{totalConfirmed.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{totalSuspected} suspected</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Active Clusters</span>
          <span className="text-lg font-black text-rose-600 font-mono">{activeClustersCount} Outbreaks</span>
          <span className="text-[10px] text-rose-700 block mt-0.5">High vigilance</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Hospitalized</span>
          <span className="text-lg font-black text-amber-600 font-mono">{totalHospitalized}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">In dedicated wards</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Recovered</span>
          <span className="text-lg font-black text-emerald-600 font-mono">{totalRecovered}</span>
          <span className="text-[10px] text-emerald-700 block mt-0.5">
            {totalConfirmed > 0 ? Math.round((totalRecovered / totalConfirmed) * 100) : 0}% recovery rate
          </span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Attack Rate</span>
          <span className="text-lg font-black text-cyan-600 font-mono">{avgAttackRate} ‰</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Per 1,000 population</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Larval Breteau Index</span>
          <span className="text-lg font-black text-purple-600 font-mono">38% Breached</span>
          <span className="text-[10px] text-purple-700 block mt-0.5">Threshold &gt;20%</span>
        </div>
      </div>

      {/* Multi-Dimensional Surveillance Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-600" /> 
            <span>Multi-Dimensional Surveillance Filters</span>
          </div>
          <button 
            onClick={() => {
              setSelectedTaluk('ALL');
              setSelectedVillage('ALL');
              setSelectedDisease('ALL');
              setSeverityFilter('ALL');
              setSearchQuery('');
            }}
            className="text-[10px] text-emerald-600 hover:underline cursor-pointer lowercase"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
          {/* State */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">State</label>
            <select disabled className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-700">
              <option>{stateName}</option>
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">District</label>
            <select disabled className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-700">
              <option>{districtName}</option>
            </select>
          </div>

          {/* Taluk */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Taluk</label>
            <select 
              value={selectedTaluk} 
              onChange={(e) => setSelectedTaluk(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-xs"
            >
              <option value="ALL">All Taluks</option>
              {availableTaluks.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Village */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Village</label>
            <select 
              value={selectedVillage} 
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-xs"
            >
              <option value="ALL">All Villages</option>
              {villages.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
            </select>
          </div>

          {/* Disease */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Disease</label>
            <select 
              value={selectedDisease} 
              onChange={(e) => setSelectedDisease(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-2 font-bold text-red-600 focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-xs"
            >
              <option value="ALL">All Diseases</option>
              <option value="Dengue">Dengue Fever</option>
              <option value="Respiratory Infection">Respiratory Infection</option>
              <option value="Diarrhoeal">Diarrhoea</option>
              <option value="Malaria">Malaria</option>
              <option value="Typhoid">Typhoid</option>
            </select>
          </div>

          {/* Time Horizon */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Time Horizon</label>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full bg-white border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-xs"
            >
              <option value="7-day">7-Day Trend</option>
              <option value="30-day">30-Day Trend</option>
              <option value="6-month">6-Month Trend</option>
              <option value="1-year">1-Year Trend</option>
            </select>
          </div>

          {/* Age Group */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Age Group</label>
            <select 
              value={ageGroup} 
              onChange={(e) => setAgeGroup(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-xs"
            >
              <option value="ALL">All Ages</option>
              <option value="0-5">0–5 years</option>
              <option value="6-18">6–18 years</option>
              <option value="19-40">19–40 years</option>
              <option value="41-60">41–60 years</option>
              <option value="60+">60+ years</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Gender</label>
            <select 
              value={gender} 
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-xs"
            >
              <option value="ALL">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="relative pt-2">
          <div className="absolute inset-y-0 left-0 pl-3.5 pt-2 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search surveillance grid by disease, village, taluk, clinical symptoms, or protocol..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Automated Spike Highlight Alert Banner */}
      {spikeCluster && (
        <div className="bg-gradient-to-r from-red-50 via-rose-50 to-red-50 border border-red-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-2xl bg-red-600 text-white flex-shrink-0 shadow-sm animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold bg-red-600 text-white px-2 py-0.5 rounded">
                  AUTOMATED EPIDEMIOLOGICAL SPIKE DETECTED
                </span>
                <span className="text-xs text-red-900 font-bold">{spikeCluster.village} Cluster ({spikeCluster.taluk} Taluk)</span>
              </div>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {spikeCluster.disease} progression spike: <span className="font-mono underline text-red-600">3 → 4 → 5 → 8 → 14 → 27 cases ({spikeCluster.growthRate})</span>
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                <strong className="text-red-700">Statistical threshold breached:</strong> {spikeCluster.actionProtocol}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {spikeCluster.status === 'Dispatched' ? (
              <span className="px-4 py-2 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" /> Response Team Dispatched
              </span>
            ) : (
              <button
                onClick={() => handleFlagEpidemiologist(spikeCluster.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm whitespace-nowrap cursor-pointer"
              >
                Flag Alert to Epidemiologist
              </button>
            )}
          </div>
        </div>
      )}

      {/* Trend Visualizations & Disease Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Horizon Trend Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <span>{selectedDisease === 'ALL' ? 'Multi-Disease' : selectedDisease} Progression ({dateRange.toUpperCase()})</span>
              </h3>
              <p className="text-xs text-slate-500">Epidemiological surveillance telemetry for {districtName} rural blocks</p>
            </div>
            <span className="text-xs font-bold text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              +{dateRange === '7-day' ? '238% Surge' : '340% YTD Trend'}
            </span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {dateRange === '7-day' ? (
                <LineChart data={MOCK_SURVEILLANCE_TRENDS} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="dengue" name="Dengue Cases" stroke="#ef4444" strokeWidth={3} dot={{ r: 5 }} />
                  <Line type="monotone" dataKey="fever" name="Acute Fever" stroke="#f97316" strokeWidth={2} />
                  <Line type="monotone" dataKey="respiratory" name="Respiratory Infection" stroke="#6366f1" strokeWidth={2} />
                </LineChart>
              ) : (
                <BarChart data={monthlyTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="dengue" name="Dengue Cases" fill="#ef4444" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="respiratory" name="Respiratory Cases" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="diarrhoea" name="Diarrhoea Cases" fill="#eab308" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Overall Disease Category Share */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Disease Distribution Share</h3>
            <p className="text-xs text-slate-500 mb-4">Proportion of active cases in {districtName} District</p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diseaseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {diseaseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {diseaseDistribution.map((d, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                  {d.name}
                </span>
                <span className="font-bold text-slate-900 font-mono">{d.value} cases</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Surveillance Clusters & Case Registry Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm space-y-4 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Active Epidemiological Clusters & Case Registry ({filteredCases.length})</span>
            </h3>
            <p className="text-xs text-slate-500">Real-time case reporting, containment status & clinical response protocols</p>
          </div>
          
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
            Showing {filteredCases.length} clusters
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Cluster ID & Disease</th>
                <th className="py-3 px-3">Location / Taluk</th>
                <th className="py-3 px-3">Suspected / Confirmed</th>
                <th className="py-3 px-3">Hospitalized</th>
                <th className="py-3 px-3">Attack Rate</th>
                <th className="py-3 px-3">Growth Rate</th>
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.map((cluster) => {
                const severityBadge = cluster.severity === 'Critical Outbreak'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : cluster.severity === 'Active Cluster'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : cluster.severity === 'Watchlist'
                  ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200';

                const statusBadge = cluster.status === 'Active'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : cluster.status === 'Dispatched'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : cluster.status === 'Contained'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : cluster.status === 'Resolved'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200';

                return (
                  <tr 
                    key={cluster.id}
                    onClick={() => setSelectedCluster(cluster)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 group-hover:text-emerald-700 block">{cluster.id}</span>
                      <span className="text-[11px] text-red-600 font-semibold">{cluster.disease}</span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-900">{cluster.village}</span>
                      <span className="text-[10px] text-slate-500 block">{cluster.taluk} Taluk</span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 font-mono">{cluster.confirmedCases} Confirmed</span>
                      <span className="text-[10px] text-slate-500 block font-mono">{cluster.suspectedCases} Suspected</span>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-amber-600">
                      {cluster.hospitalized} Cases
                    </td>

                    <td className="py-3 px-3 font-mono text-cyan-600 font-semibold">
                      {cluster.attackRate} ‰
                    </td>

                    <td className="py-3 px-3">
                      <span className={`font-mono font-bold ${cluster.growthRate.startsWith('+') ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {cluster.growthRate}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${severityBadge}`}>
                        {cluster.severity}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusBadge}`}>
                        {cluster.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {cluster.status === 'Active' && (
                          <button
                            onClick={() => handleFlagEpidemiologist(cluster.id)}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold transition-all shadow-xs cursor-pointer"
                            title="Flag Alert to District Epidemiologist"
                          >
                            Flag
                          </button>
                        )}
                        {cluster.status !== 'Resolved' && (
                          <button
                            onClick={() => updateSurveillanceCaseStatus(cluster.id, 'Resolved', 'Containment complete. No new cases in 72h.')}
                            className="px-2 py-1 bg-slate-100 hover:bg-emerald-600 hover:text-white rounded-lg text-[10px] font-bold transition-all text-slate-700 border border-slate-200 cursor-pointer"
                            title="Mark Cluster as Resolved"
                          >
                            Resolve
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedCluster(cluster)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer border border-slate-200"
                          title="View Cluster Details"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cluster Details Drawer Modal */}
      {selectedCluster && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl p-6 shadow-2xl relative text-slate-900 space-y-4">
            
            <button
              onClick={() => setSelectedCluster(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3">
              <div className="p-3 bg-red-600 text-white rounded-2xl shadow-sm">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest block">
                  Epidemiological Outbreak Cluster #{selectedCluster.id}
                </span>
                <h2 className="text-lg font-black text-slate-900">{selectedCluster.disease} — {selectedCluster.village}</h2>
                <p className="text-xs text-slate-500">{selectedCluster.taluk} Taluk, {selectedCluster.district} District • {selectedCluster.facility}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Confirmed</span>
                <span className="font-bold text-slate-900 text-base font-mono">{selectedCluster.confirmedCases}</span>
                <span className="text-[10px] text-slate-500 block">{selectedCluster.suspectedCases} Suspected</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Hospitalized</span>
                <span className="font-bold text-amber-600 text-base font-mono">{selectedCluster.hospitalized}</span>
                <span className="text-[10px] text-slate-500 block">{selectedCluster.recovered} Recovered</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Attack Rate</span>
                <span className="font-bold text-cyan-600 text-base font-mono">{selectedCluster.attackRate} ‰</span>
                <span className="text-[10px] text-slate-500 block">Per 1,000</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Growth Surge</span>
                <span className="font-bold text-rose-600 text-base font-mono">{selectedCluster.growthRate}</span>
                <span className="text-[10px] text-slate-500 block">7-Day trend</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Clinical Symptoms Observed</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCluster.symptoms.map((s, idx) => (
                  <span key={idx} className="bg-white border border-slate-200 text-slate-700 text-[11px] px-2.5 py-0.5 rounded-lg font-medium shadow-xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Government Response Protocol</span>
              <p className="text-xs text-slate-700 font-medium">{selectedCluster.actionProtocol}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-mono">Reported on: {selectedCluster.reportedDate}</span>
              <div className="flex items-center gap-2">
                {selectedCluster.status !== 'Resolved' && (
                  <button
                    onClick={() => {
                      updateSurveillanceCaseStatus(selectedCluster.id, 'Resolved', 'Cluster contained and zero new transmissions.');
                      setSelectedCluster(null);
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Mark Resolved
                  </button>
                )}
                {selectedCluster.status === 'Active' && (
                  <button
                    onClick={() => {
                      handleFlagEpidemiologist(selectedCluster.id);
                      setSelectedCluster(null);
                    }}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Flag Epidemiologist
                  </button>
                )}
                <button
                  onClick={() => setSelectedCluster(null)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer border border-slate-200"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Report New Outbreak / Case Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative text-slate-900 space-y-4">
            
            <button
              onClick={() => setReportModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3">
              <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-sm">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest block">
                  Official Epidemiological Event Logging
                </span>
                <h2 className="text-lg font-black text-slate-900">Log Disease Case / Cluster</h2>
                <p className="text-xs text-slate-500">Register field surveillance cases directly to Tamil Nadu Public Health Grid</p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs pt-2">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Infectious Disease</label>
                  <select
                    value={formData.disease}
                    onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="Dengue Fever">Dengue Fever</option>
                    <option value="Acute Respiratory Infection">Acute Respiratory Infection</option>
                    <option value="Acute Diarrhoeal Disease">Acute Diarrhoeal Disease</option>
                    <option value="Malaria (P. vivax)">Malaria (P. vivax)</option>
                    <option value="Typhoid / Enteric Fever">Typhoid / Enteric Fever</option>
                    <option value="Chikungunya">Chikungunya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Taluk Jurisdiction</label>
                  <select
                    value={formData.taluk}
                    onChange={(e) => setFormData({ ...formData, taluk: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    {availableTaluks.map(t => <option key={t} value={t}>{t} Taluk</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Village / Ward Cluster</label>
                  <input
                    type="text"
                    required
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    placeholder="e.g. Ward 4"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Healthcare Facility</label>
                  <input
                    type="text"
                    required
                    value={formData.facility}
                    onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
                    placeholder="e.g. Primary Health Centre (PHC)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Suspected</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.suspectedCases}
                    onChange={(e) => setFormData({ ...formData, suspectedCases: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-mono outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Confirmed</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.confirmedCases}
                    onChange={(e) => setFormData({ ...formData, confirmedCases: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-mono outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Hospitalized</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.hospitalized}
                    onChange={(e) => setFormData({ ...formData, hospitalized: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-mono outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Severity Classification</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="Critical Outbreak">Critical Outbreak</option>
                    <option value="Active Cluster">Active Cluster</option>
                    <option value="Watchlist">Watchlist</option>
                    <option value="Controlled">Controlled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Larval Breteau Index (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.larvalBreteauIndex}
                    onChange={(e) => setFormData({ ...formData, larvalBreteauIndex: Number(e.target.value) })}
                    placeholder="e.g. 35"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-mono outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Observed Clinical Symptoms (comma separated)</label>
                <input
                  type="text"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  placeholder="e.g. High Fever, Headache, Joint Pain, Vomiting"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Action Protocol & Response Plan</label>
                <textarea
                  rows={2}
                  required
                  value={formData.actionProtocol}
                  onChange={(e) => setFormData({ ...formData, actionProtocol: e.target.value })}
                  placeholder="e.g. Vector control team alerted. Rapid NS1 screening booths setup."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  Submit Case Report
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
