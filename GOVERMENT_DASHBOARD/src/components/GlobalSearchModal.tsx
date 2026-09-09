import React from 'react';
import { Search, X, MapPin, Building2, AlertTriangle, Pill } from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';
import { useNavigate } from 'react-router-dom';

export const GlobalSearchModal: React.FC = () => {
  const { globalSearchOpen, setGlobalSearchOpen, searchQuery, setSearchQuery, villages, hospitals, alerts, medicines, setSelectedVillage, setActiveActionAlert, districtName } = useHealthData();
  const navigate = useNavigate();

  if (!globalSearchOpen) return null;

  const query = searchQuery.toLowerCase().trim();

  const matchedVillages = query ? villages.filter(v => v.name.toLowerCase().includes(query) || v.taluk.toLowerCase().includes(query)) : [];
  const matchedHospitals = query ? hospitals.filter(h => h.name.toLowerCase().includes(query) || h.type.toLowerCase().includes(query)) : [];
  const matchedAlerts = query ? alerts.filter(a => a.disease.toLowerCase().includes(query) || a.villageName.toLowerCase().includes(query)) : [];
  const matchedMedicines = query ? medicines.filter(m => m.name.toLowerCase().includes(query) || m.category.toLowerCase().includes(query)) : [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-16 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] text-slate-800">
        
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-emerald-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search village, hospital, PHC, disease, officer, resource, alert..."
            className="flex-1 bg-transparent text-slate-900 font-semibold outline-none placeholder-slate-400 text-base"
            autoFocus
          />
          <button
            onClick={() => setGlobalSearchOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips when empty */}
        {!query && (
          <div className="p-6 text-center space-y-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quick searches across {districtName} District Command System:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Health Centre', 'Government Hospital', 'Dengue Outbreak', 'Insulin', 'Anti-Venom', 'Specialist Doctor'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setSearchQuery(chip)}
                  className="px-3 py-1.5 rounded-full bg-slate-100 text-emerald-800 text-xs font-bold hover:bg-emerald-50 hover:text-emerald-900 transition-colors border border-slate-200 cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Container */}
        {query && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {matchedVillages.length === 0 && matchedHospitals.length === 0 && matchedAlerts.length === 0 && matchedMedicines.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No matching records found for "<span className="text-slate-900 font-bold">{searchQuery}</span>". Try searching for <strong className="text-emerald-700">Hospital</strong>, <strong className="text-emerald-700">PHC</strong>, <strong className="text-emerald-700">Dengue</strong>, or <strong className="text-emerald-700">Insulin</strong>.
              </div>
            ) : (
              <>
                {/* Villages */}
                {matchedVillages.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 mb-2 px-2">Villages</h4>
                    <div className="space-y-1.5">
                      {matchedVillages.map(v => (
                        <button
                          key={v.id}
                          onClick={() => {
                            setSelectedVillage(v);
                            setGlobalSearchOpen(false);
                            navigate('/dashboard/village-map');
                          }}
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all text-left group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">{v.name} Village ({v.taluk} Taluk)</div>
                              <div className="text-xs text-slate-500">Pop: {v.population.toLocaleString()} • Active Cases: {v.activeCases}</div>
                            </div>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            v.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-800 border border-red-200' :
                            v.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                            v.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            Score {v.healthScore}/100
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hospitals / PHCs */}
                {matchedHospitals.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-blue-700 mb-2 px-2">Government Hospitals & PHCs</h4>
                    <div className="space-y-1.5">
                      {matchedHospitals.map(h => (
                        <button
                          key={h.id}
                          onClick={() => {
                            setGlobalSearchOpen(false);
                            navigate('/dashboard/hospitals');
                          }}
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all text-left group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-700 border border-blue-200">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm group-hover:text-blue-800 transition-colors">{h.name}</div>
                              <div className="text-xs text-slate-500">{h.type} • Occupancy: {h.occupancyRate}%</div>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-slate-700 bg-white px-2 py-1 rounded border border-slate-200 shadow-xs">{h.beds.occupied}/{h.beds.total} Beds</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alerts */}
                {matchedAlerts.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-red-700 mb-2 px-2">Active Alerts</h4>
                    <div className="space-y-1.5">
                      {matchedAlerts.map(a => (
                        <button
                          key={a.id}
                          onClick={() => {
                            setActiveActionAlert(a);
                            setGlobalSearchOpen(false);
                            navigate('/dashboard/alerts');
                          }}
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 transition-all text-left group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-100 text-red-700 border border-red-200">
                              <AlertTriangle className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm group-hover:text-red-800 transition-colors">{a.disease} - {a.villageName}</div>
                              <div className="text-xs text-red-700 font-semibold">Cases: {a.currentCases} (+{a.increasePercentage}%)</div>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-600 text-white shadow-xs">
                            {a.status}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Medicines */}
                {matchedMedicines.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 mb-2 px-2">Medicine Inventory</h4>
                    <div className="space-y-1.5">
                      {matchedMedicines.map(m => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setGlobalSearchOpen(false);
                            navigate('/dashboard/medicine');
                          }}
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 transition-all text-left group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-100 text-amber-700 border border-amber-200">
                              <Pill className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm group-hover:text-amber-800 transition-colors">{m.name}</div>
                              <div className="text-xs text-slate-500">{m.category} • Stock: {m.availableQuantity} {m.unit}</div>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${m.status === 'Critical' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                            {m.status}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center px-4 font-mono">
          <span>Scope: <strong className="text-emerald-700">Tamil Nadu → {districtName} District</strong></span>
          <span>Press ESC or click outside to dismiss</span>
        </div>
      </div>
    </div>
  );
};
