import { useState } from 'react';
import { 
  Syringe, AlertTriangle 
} from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';

export default function Vaccination() {
  const { districtName, villages } = useHealthData();
  const [selectedVaccine, setSelectedVaccine] = useState('ALL');

  const vaccineList = villages.length > 0 ? villages.map((v, i) => {
    const coverage = v.vaccinationCoverage || (95 - (i * 7));
    const status = coverage >= 90 ? 'Healthy' : coverage >= 75 ? 'Moderate' : 'Low Coverage Alert';
    const badge = coverage >= 90 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : coverage >= 75 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-red-50 text-red-700 border border-red-200 animate-pulse';
    return {
      village: `${v.name} Block`,
      coverage,
      status,
      badge
    };
  }) : [
    { village: 'Central Health Block', coverage: 96, status: 'Healthy', badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    { village: 'North Health Block', coverage: 82, status: 'Moderate', badge: 'bg-amber-50 text-amber-700 border border-amber-200' },
    { village: 'Rural Health Block', coverage: 58, status: 'Low Coverage Alert', badge: 'bg-red-50 text-red-700 border border-red-200 animate-pulse' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">District Immunization & Vaccination Command</h2>
          <p className="text-xs text-slate-500 mt-1">
            {districtName} District • Routine UIP coverage, booster campaigns, and rural cold-chain inventory monitoring.
          </p>
        </div>

        <button 
          onClick={() => alert(`Mobile Immunization Drive Dispatched for ${districtName} District.`)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow flex items-center gap-2 cursor-pointer"
        >
          <Syringe className="w-4 h-4" /> Deploy Mobile Immunization Van
        </button>
      </div>

      {/* LOW VACCINATION COVERAGE ALERT BANNER */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-600 text-white rounded-xl flex-shrink-0 shadow-sm">
            <AlertTriangle className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <span className="text-xs font-extrabold bg-red-600 text-white px-2 py-0.5 rounded uppercase">
              LOW IMMUNIZATION ALERT
            </span>
            <h3 className="text-base font-extrabold text-red-950 mt-1">
              Rural Pockets with Low Vaccination Coverage (&lt;70%)
            </h3>
            <p className="text-xs text-red-800 mt-0.5">
              Pentavalent & Measles-Rubella (MR) booster backlog detected in infants. Immediate door-to-door drive recommended.
            </p>
          </div>
        </div>

        <button 
          onClick={() => alert(`Special Vaccination Campaign scheduled for ${districtName} tomorrow 09:00 AM.`)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow cursor-pointer"
        >
          Schedule Special Campaign
        </button>
      </div>

      {/* Village Ranking Chart / List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Village-Wise UIP Immunization Ranking</h3>
            <p className="text-xs text-slate-500">Target coverage benchmark: &gt; 90%</p>
          </div>
          <select 
            value={selectedVaccine} 
            onChange={(e) => setSelectedVaccine(e.target.value)}
            className="text-xs border border-slate-300 rounded-xl p-2 font-bold bg-white text-slate-800 shadow-sm"
          >
            <option value="ALL">All Vaccines Combined</option>
            <option value="BCG">BCG & Hepatitis B</option>
            <option value="Pentavalent">Pentavalent (DPT+HepB+Hib)</option>
            <option value="MR">Measles-Rubella (MR)</option>
          </select>
        </div>

        <div className="space-y-4">
          {vaccineList.map((v, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-[200px]">
                <span className="font-bold text-xs text-slate-400">#{idx + 1}</span>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{v.village}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${v.badge}`}>
                    {v.status}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex-1 w-full sm:w-auto flex items-center gap-3">
                <div className="flex-1 bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      v.coverage >= 90 ? 'bg-emerald-500' : v.coverage >= 75 ? 'bg-amber-500' : 'bg-red-600'
                    }`}
                    style={{ width: `${v.coverage}%` }}
                  />
                </div>
                <span className="text-sm font-black text-slate-900 w-12 text-right font-mono">{v.coverage}%</span>
              </div>

              <button 
                onClick={() => alert(`Showing immunization registry for ${v.village}`)}
                className="text-xs font-bold text-emerald-700 hover:underline whitespace-nowrap cursor-pointer"
              >
                Inspect Registry
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
