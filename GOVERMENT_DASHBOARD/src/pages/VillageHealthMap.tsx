import { useState } from 'react';
import { 
  MapPin, AlertTriangle, Activity, PackageCheck, ArrowRight
} from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';
import { useNavigate } from 'react-router-dom';

export default function VillageHealthMap() {
  const { villages, selectedVillage, setSelectedVillage, createNewAlert, districtName } = useHealthData();
  const navigate = useNavigate();
  const [filterRisk, setFilterRisk] = useState<string>('ALL');

  const filteredVillages = filterRisk === 'ALL' 
    ? villages 
    : villages.filter(v => v.riskLevel === filterRisk);

  // Current active village for drawer (default to first if none selected)
  const activeVillage = selectedVillage || villages[0] || {
    id: 'v-fallback',
    name: 'District Central',
    taluk: 'Central Taluk',
    population: 15000,
    registeredPatients: 14200,
    healthScore: 88,
    riskLevel: 'NORMAL',
    coordinates: { x: 50, y: 50 },
    activeCases: 12,
    availableDoctors: 6,
    emergencyKitsStock: 80,
    medicineStockStatus: 'Adequate',
    vaccinationCoverage: 94,
    maternalHighRisk: 8,
    diseases: { dengue: 2, fever: 10, diabetes: 45, respiratory: 15 }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'Healthy', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
    if (score >= 60) return { label: 'Moderate Risk', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
    if (score >= 40) return { label: 'High Risk', color: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' };
    return { label: 'Critical Outbreak', color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500 animate-ping' };
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
              {districtName} Rural Matrix
            </span>
            <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-blue-200">
              🟢 Essential Supplies Readiness: 94.2%
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-2 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            Interactive Village Health & Vulnerability Map
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {districtName} District • Real-time health risk mapping, essential medicine supplies, and emergency vulnerability metrics.
          </p>
        </div>

        {/* Risk Legend Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'NORMAL'].map((risk) => (
            <button
              key={risk}
              onClick={() => setFilterRisk(risk)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterRisk === risk
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {risk === 'ALL' ? 'Show All Villages' : risk}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map & Drawer Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District Canvas Map (2 cols) */}
        <div className="lg:col-span-2 bg-slate-50 rounded-2xl border border-slate-200 p-6 shadow-sm relative min-h-[520px] flex flex-col justify-between overflow-hidden">
          {/* Topography Grid overlay */}
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px]"></div>

          {/* Map Title Overlay */}
          <div className="relative z-10 flex justify-between items-center bg-white p-3.5 rounded-xl border border-slate-200 text-slate-900 text-xs shadow-xs">
            <span className="font-extrabold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" /> {districtName} District Topographic Health & Vulnerability Matrix
            </span>
            <span className="text-slate-500">Click any village pin to inspect local health infrastructure & supplies</span>
          </div>

          {/* Canvas Interactive Pins */}
          <div className="relative flex-1 my-6 min-h-[380px]">
            {filteredVillages.map((v) => {
              const isSelected = activeVillage.id === v.id;
              const riskColor = 
                v.riskLevel === 'CRITICAL' ? 'bg-red-600 text-white shadow-red-500/50' :
                v.riskLevel === 'HIGH' ? 'bg-orange-500 text-white shadow-orange-500/50' :
                v.riskLevel === 'MEDIUM' ? 'bg-amber-500 text-white shadow-amber-500/50' :
                'bg-emerald-600 text-white shadow-emerald-500/50';

              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVillage(v)}
                  style={{ left: `${v.coordinates.x}%`, top: `${v.coordinates.y}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  {/* Ripple animation for Critical / High */}
                  {(v.riskLevel === 'CRITICAL' || v.riskLevel === 'HIGH') && (
                    <span className={`absolute -inset-3 rounded-full animate-ping opacity-50 ${
                      v.riskLevel === 'CRITICAL' ? 'bg-red-500' : 'bg-orange-500'
                    }`} />
                  )}

                  <div className={`relative px-3 py-1.5 rounded-full font-black text-xs flex items-center gap-1.5 shadow-md border border-white transition-transform duration-200 ${riskColor} ${
                    isSelected ? 'scale-125 ring-4 ring-emerald-500 z-30' : 'hover:scale-110'
                  }`}>
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{v.name}</span>
                    <span className="text-[10px] opacity-90 font-mono">({v.healthScore})</span>
                  </div>

                  {/* Tooltip on Hover */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-white text-slate-900 p-3 rounded-xl text-xs shadow-xl border border-slate-200 whitespace-nowrap z-40 pointer-events-none">
                    <div className="font-extrabold text-emerald-700">{v.name} Village</div>
                    <div>Active Cases: {v.activeCases} • Risk: {v.riskLevel}</div>
                    <div className="text-emerald-700 font-bold">📦 Emergency Kits: {v.emergencyKitsStock} Kits</div>
                    <div className="text-slate-500 text-[10px]">Medicine: {v.medicineStockStatus} • Score: {v.healthScore}/100</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Footer Legend */}
          <div className="relative z-10 bg-white p-3.5 rounded-xl border border-slate-200 text-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs shadow-xs">
            <div className="flex items-center gap-4">
              <span className="font-bold text-slate-500">Health Index:</span>
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 80–100 Healthy</span>
              <span className="flex items-center gap-1.5 text-amber-700 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 60–79 Moderate Risk</span>
              <span className="flex items-center gap-1.5 text-orange-700 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> 40–59 High Risk</span>
              <span className="flex items-center gap-1.5 text-red-700 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span> 0–39 Critical</span>
            </div>
            <span className="text-slate-400 text-[11px]">GIS Grid Telemetry</span>
          </div>
        </div>

        {/* Selected Village Drawer (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            {/* Drawer Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-emerald-700 uppercase">Selected Village Inspection</span>
                <h3 className="text-xl font-black text-slate-900">{activeVillage.name} Village</h3>
                <p className="text-xs text-slate-500">{activeVillage.taluk} Taluk • Pop: {activeVillage.population.toLocaleString()}</p>
              </div>
              <div className="text-right">
                {(() => {
                  const badge = getScoreBadge(activeVillage.healthScore);
                  return (
                    <div className={`px-3 py-1 rounded-xl text-xs font-black border ${badge.color} flex items-center gap-1.5`}>
                      <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
                      {activeVillage.healthScore}/100
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 block">Registered Population</span>
                <span className="text-base font-extrabold text-slate-900">{activeVillage.registeredPatients.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                <span className="text-[10px] font-bold text-red-700 block">Active Cases</span>
                <span className="text-base font-black text-red-950">{activeVillage.activeCases} Cases</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                <span className="text-[10px] font-bold text-blue-700 block">Available Doctors</span>
                <span className="text-base font-extrabold text-blue-950">{activeVillage.availableDoctors} Doctors</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-black text-emerald-800 block flex items-center gap-1">
                  <PackageCheck className="w-3 h-3 text-emerald-600" /> Emergency Kits On-Site
                </span>
                <span className="text-lg font-black text-emerald-950">{activeVillage.emergencyKitsStock} Kits</span>
              </div>
            </div>

            {/* Disease Prevalence */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" /> Active Disease Prevalence
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between p-2 rounded-lg bg-red-50 text-red-900 font-bold border border-red-200">
                  <span>Dengue</span>
                  <span className="font-black text-red-950">{activeVillage.diseases.dengue} cases</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-amber-50 text-amber-900 font-bold border border-amber-200">
                  <span>Acute Fever</span>
                  <span className="font-black text-amber-950">{activeVillage.diseases.fever} cases</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-blue-50 text-blue-900 font-bold border border-blue-200">
                  <span>Diabetes</span>
                  <span className="font-black text-blue-950">{activeVillage.diseases.diabetes} cases</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-indigo-50 text-indigo-900 font-bold border border-indigo-200">
                  <span>Respiratory</span>
                  <span className="font-black text-indigo-950">{activeVillage.diseases.respiratory} cases</span>
                </div>
              </div>
            </div>

            {/* Resource Levels */}
            <div className="mt-4 space-y-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Health Resources & Coverage</h4>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span>Vaccination Coverage</span>
                  <span className={`font-black ${activeVillage.vaccinationCoverage >= 80 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {activeVillage.vaccinationCoverage}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span>High-Risk Maternal Cases</span>
                  <span className="font-black text-rose-700">{activeVillage.maternalHighRisk} Women</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => createNewAlert(activeVillage.name, `${activeVillage.name} Outbreak Emergency Protocol`)}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" /> Trigger Emergency Action Protocol
            </button>

            <button
              onClick={() => navigate('/dashboard/emergency-supplies')}
              className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs border border-emerald-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <PackageCheck className="w-4 h-4 text-emerald-600" /> Dispatch Emergency Supplies to {activeVillage.name}
            </button>
          </div>
        </div>
      </div>

      {/* Village Health Score Ranking Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Village Health Score & Vulnerability Ranking Index</h3>
            <p className="text-xs text-slate-500">Calculated based on disease severity, doctor availability, local emergency kits, and vaccination coverage</p>
          </div>
          <span className="text-xs font-extrabold text-slate-500">{villages.length} Villages Listed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-extrabold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Village Name</th>
                <th className="p-3">Taluk</th>
                <th className="p-3">Population</th>
                <th className="p-3">Active Cases</th>
                <th className="p-3 text-emerald-700">Emergency Kits</th>
                <th className="p-3">Vaccination %</th>
                <th className="p-3">Health Index</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {villages
                .slice()
                .sort((a, b) => a.healthScore - b.healthScore)
                .map((v, idx) => {
                  const badge = getScoreBadge(v.healthScore);
                  return (
                    <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-slate-400">#{idx + 1}</td>
                      <td className="p-3 font-black text-slate-900">{v.name}</td>
                      <td className="p-3 text-slate-500">{v.taluk}</td>
                      <td className="p-3 font-mono">{v.population.toLocaleString()}</td>
                      <td className="p-3 font-black text-red-600 font-mono">{v.activeCases}</td>
                      <td className="p-3 font-black text-emerald-700 flex items-center gap-1 font-mono">
                        <PackageCheck className="w-3.5 h-3.5 text-emerald-600" /> {v.emergencyKitsStock} Kits
                      </td>
                      <td className="p-3 font-semibold font-mono">{v.vaccinationCoverage}%</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${badge.color}`}>
                          {v.healthScore}/100 • {badge.label}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setSelectedVillage(v)}
                          className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 justify-end cursor-pointer"
                        >
                          Inspect Map Pin <ArrowRight className="w-3 h-3" />
                        </button>
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
