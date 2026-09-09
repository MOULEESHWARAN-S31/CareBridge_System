import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Building2, ArrowRight, Filter, Globe
} from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';
import { type DistrictInfo } from '../data/mockData';

export default function DistrictMonitoring() {
  const navigate = useNavigate();
  const { districts, setDistrictName, districtName } = useHealthData();

  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo>(
    districts.find(d => d.name === districtName) || districts[0]
  );
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Normal' | 'Attention' | 'Critical'>('ALL');

  const filteredDistricts = districts.filter(d => {
    if (filterStatus === 'ALL') return true;
    return d.status === filterStatus;
  });

  const handleSelectDistrict = (dist: DistrictInfo) => {
    setSelectedDistrict(dist);
    setDistrictName(dist.name);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600" />
            <span>Statewide District Healthcare Monitoring</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Interactive geographical command map & district operational health scores across all 8 districts of Tamil Nadu
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          {(['ALL', 'Normal', 'Attention', 'Critical'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                filterStatus === status
                  ? status === 'Critical' 
                    ? 'bg-rose-600 text-white'
                    : status === 'Attention'
                    ? 'bg-amber-600 text-white'
                    : status === 'Normal'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status === 'ALL' ? 'All Districts (8)' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Map Visual + District Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Map Visual & District Status Cards */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Visual Interactive Map Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>State Command Grid: Tamil Nadu</span>
                </h3>
                <p className="text-[11px] text-slate-500">Click any district node to inspect facility capacity and immediate shortages</p>
              </div>

              {/* Map Legend */}
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Normal
                </span>
                <span className="flex items-center gap-1 text-amber-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Attention
                </span>
                <span className="flex items-center gap-1 text-rose-700 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Critical
                </span>
              </div>
            </div>

            {/* Simulated Vector State Map Layout */}
            <div className="relative h-80 bg-slate-50 rounded-2xl border border-slate-200 p-4 flex items-center justify-center overflow-hidden">
              {/* Background Geographic Gridlines */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px]"></div>

              {/* SVG Connector Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-300" strokeWidth="1.5" strokeDasharray="4 4">
                <line x1="30%" y1="55%" x2="45%" y2="40%" />
                <line x1="45%" y1="40%" x2="80%" y2="20%" />
                <line x1="45%" y1="40%" x2="60%" y2="55%" />
                <line x1="60%" y1="55%" x2="50%" y2="75%" />
                <line x1="45%" y1="40%" x2="48%" y2="28%" />
                <line x1="45%" y1="40%" x2="38%" y2="48%" />
              </svg>

              {/* District Node Markers */}
              {districts.map((dist) => {
                const isSelected = selectedDistrict.name === dist.name;
                const statusColor = dist.status === 'Critical' 
                  ? 'bg-rose-500 border-rose-400 text-white shadow-rose-500/30' 
                  : dist.status === 'Attention'
                  ? 'bg-amber-500 border-amber-400 text-white shadow-amber-500/30'
                  : 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/30';

                return (
                  <div
                    key={dist.id}
                    onClick={() => handleSelectDistrict(dist)}
                    style={{ left: `${dist.coordinates.x}%`, top: `${dist.coordinates.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group z-10`}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`
                        w-9 h-9 rounded-2xl border-2 flex items-center justify-center shadow-md transition-transform group-hover:scale-125
                        ${isSelected ? 'ring-4 ring-emerald-500 scale-110' : ''}
                        ${statusColor}
                      `}>
                        <Building2 className="w-4 h-4 text-white font-bold" />
                      </div>
                      
                      <div className="mt-1 bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-900 whitespace-nowrap shadow-sm">
                        {dist.name} ({dist.accessibilityScore}/100)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* District Status Cards Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredDistricts.map((dist) => {
              const statusBadge = dist.status === 'Critical' 
                ? 'bg-rose-50 text-rose-700 border-rose-200' 
                : dist.status === 'Attention'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200';

              return (
                <div
                  key={dist.id}
                  onClick={() => handleSelectDistrict(dist)}
                  className={`bg-white border rounded-2xl p-4 transition-all hover:bg-slate-50 cursor-pointer shadow-sm ${
                    selectedDistrict.name === dist.name ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{dist.name} District</h4>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${statusBadge}`}>
                          {dist.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Pop: {(dist.population / 100000).toFixed(1)} Lakh • Reg Patients: {dist.registeredPatients.toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                        Score: {dist.accessibilityScore}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Active Facilities</span>
                      <span className="font-bold text-slate-800">{dist.activeHospitals} GH/PHC</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Beds Avail</span>
                      <span className="font-bold text-emerald-700">{dist.availableBeds.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Stock Alerts</span>
                      <span className={`font-bold ${dist.medicineStockAlerts > 50 ? 'text-rose-600' : 'text-slate-700'}`}>
                        {dist.medicineStockAlerts} items
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Col: Detailed District Profile Drilldown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">
                  District Profile Deep-Dive
                </span>
                <h3 className="text-lg font-black text-slate-900">{selectedDistrict.name} District Command</h3>
                <p className="text-xs text-slate-500">State of Tamil Nadu • Comprehensive Healthcare Infrastructure</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${
                selectedDistrict.status === 'Critical' 
                  ? 'bg-rose-50 text-rose-700 border-rose-200' 
                  : selectedDistrict.status === 'Attention'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {selectedDistrict.status}
              </span>
            </div>

            {/* Detailed District Indicators */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-600">Total Population</span>
                <span className="font-bold text-slate-900">{selectedDistrict.population.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-600">Registered Patients</span>
                <span className="font-bold text-slate-900">{selectedDistrict.registeredPatients.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-600">Active Government Facilities</span>
                <span className="font-bold text-slate-900">{selectedDistrict.activeHospitals} Facilities</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-600">Doctors on Active Roster</span>
                <span className="font-bold text-emerald-700">{selectedDistrict.doctorsCount.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-600">Available Beds (General & ICU)</span>
                <span className="font-bold text-emerald-700">{selectedDistrict.availableBeds.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-600">Total Bed Capacity</span>
                <span className="font-bold text-slate-800">{selectedDistrict.totalBeds.toLocaleString()} Beds</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-600">Diagnostic Facilities</span>
                <span className="font-bold text-slate-900">{selectedDistrict.diagnosticCentresCount} Centres</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-600">Medicine Shortage Alerts</span>
                <span className="font-bold text-rose-600">{selectedDistrict.medicineStockAlerts} items</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-600">Teleconsultations Today</span>
                <span className="font-bold text-cyan-700">{selectedDistrict.teleconsultationsToday.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-600">Emergency Cases Active</span>
                <span className="font-bold text-amber-700">{selectedDistrict.emergencyCases} Cases</span>
              </div>
            </div>

            {/* Accessibility Score Pillar Breakdown */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-800 block mb-2">
                Accessibility Pillars ({selectedDistrict.accessibilityScore}/100)
              </span>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Facilities:</span> <strong className="text-slate-900">{selectedDistrict.scoreBreakdown.facility}%</strong>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Doctors:</span> <strong className="text-slate-900">{selectedDistrict.scoreBreakdown.doctor}%</strong>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Medicines:</span> <strong className="text-slate-900">{selectedDistrict.scoreBreakdown.medicine}%</strong>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Diagnostics:</span> <strong className="text-slate-900">{selectedDistrict.scoreBreakdown.diagnostics}%</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100">
            <button
              onClick={() => {
                setDistrictName(selectedDistrict.name);
                navigate('/dashboard/hospitals');
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow cursor-pointer transition-all"
            >
              <span>Inspect {selectedDistrict.name} Healthcare Facilities</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
