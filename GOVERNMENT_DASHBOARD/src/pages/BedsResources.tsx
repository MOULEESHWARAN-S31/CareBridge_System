import { useState } from 'react';
import { 
  BedDouble, Search, ShieldAlert, Activity, Baby
} from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';

export default function BedsResources() {
  const { facilities } = useHealthData();
  const [searchQuery, setSearchQuery] = useState('');
  const [occupancyFilter, setOccupancyFilter] = useState<'ALL' | 'Critical' | 'High' | 'Normal'>('ALL');

  const facilitiesWithBeds = facilities.filter(f => f.totalBeds > 0).filter(f => {
    const rate = Math.round((f.occupiedBeds / f.totalBeds) * 100);
    if (occupancyFilter === 'Critical' && rate < 90) return false;
    if (occupancyFilter === 'High' && (rate < 75 || rate >= 90)) return false;
    if (occupancyFilter === 'Normal' && rate >= 75) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return f.name.toLowerCase().includes(q) || f.taluk.toLowerCase().includes(q);
    }
    return true;
  });

  const totalBedsDistrict = facilities.reduce((acc, f) => acc + f.totalBeds, 0);
  const occupiedBedsDistrict = facilities.reduce((acc, f) => acc + f.occupiedBeds, 0);
  const availableBedsDistrict = facilities.reduce((acc, f) => acc + f.availableBeds, 0);
  const totalIcuBeds = facilities.reduce((acc, f) => acc + f.icuBeds.total, 0);
  const occupiedIcuBeds = facilities.reduce((acc, f) => acc + f.icuBeds.occupied, 0);

  const overallOccupancy = totalBedsDistrict > 0 ? Math.round((occupiedBedsDistrict / totalBedsDistrict) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-emerald-600" />
            <span>Live Bed Availability & Critical ICU Matrix</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry across General Wards, ICUs, High Dependency Units (HDU) & Pediatric Beds
          </p>
        </div>

        <div className="text-xs bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-emerald-800 font-medium">
          District Total: <strong className="text-emerald-700 font-mono">{availableBedsDistrict} Beds Available</strong> ({overallOccupancy}% Full)
        </div>
      </div>

      {/* Critical Occupancy Warning Banner */}
      {facilities.some(f => f.totalBeds > 0 && Math.round((f.occupiedBeds / f.totalBeds) * 100) >= 90) && (
        <div className="p-4 bg-gradient-to-r from-red-50 via-rose-50 to-red-50 border border-red-200 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 text-white rounded-xl flex-shrink-0 animate-pulse shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-red-900 block">
                Hospital High Load Threshold Exceeded in Selected Facilities
              </span>
              <p className="text-[11px] text-red-700">
                ICU beds reaching high occupancy. Automatic patient diversion protocol to neighboring facilities activated.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-red-100 text-red-800 border border-red-200 px-2.5 py-1 rounded-lg">
            Admissions Diverted
          </span>
        </div>
      )}

      {/* 4 Bed Matrix Primary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">Total District Beds</span>
          <div className="text-xl font-black text-slate-900 mt-1">{totalBedsDistrict.toLocaleString()}</div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Across all government facilities</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">Available Regular Beds</span>
          <div className="text-xl font-black text-emerald-600 mt-1">{availableBedsDistrict.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Ready for immediate admission</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">ICU Bed Availability</span>
          <div className="text-xl font-black text-amber-600 mt-1">
            {totalIcuBeds - occupiedIcuBeds} / {totalIcuBeds} Available
          </div>
          <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">
            {totalIcuBeds > 0 ? Math.round((occupiedIcuBeds / totalIcuBeds) * 100) : 0}% ICU Occupied
          </span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">Pediatric & Neonatal Beds</span>
          <div className="text-xl font-black text-cyan-600 mt-1">210 Total</div>
          <span className="text-[10px] text-cyan-700 font-semibold block mt-0.5">48 Available in district</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {(['ALL', 'Critical', 'High', 'Normal'] as const).map(f => (
              <button
                key={f}
                onClick={() => setOccupancyFilter(f)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  occupancyFilter === f 
                    ? f === 'Critical' 
                      ? 'bg-rose-600 text-white' 
                      : f === 'High'
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f === 'ALL' ? 'All Occupancies' : f === 'Critical' ? 'Critical (>90%)' : f === 'High' ? 'High Load (75-90%)' : 'Normal (<75%)'}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospital or taluk..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Hospital Bed Availability Grid Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facilitiesWithBeds.map((fac) => {
          const occupancy = Math.round((fac.occupiedBeds / fac.totalBeds) * 100);
          const isCritical = occupancy >= 90;
          const isHigh = occupancy >= 75 && occupancy < 90;

          return (
            <div 
              key={fac.id}
              className={`bg-white border rounded-2xl p-5 shadow-sm transition-all ${
                isCritical ? 'border-rose-300 ring-1 ring-rose-400/30' : isHigh ? 'border-amber-300' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{fac.name}</h3>
                  <span className="text-[11px] text-slate-500 block">{fac.taluk} Taluk • {fac.type}</span>
                </div>
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-xl border ${
                  isCritical 
                    ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' 
                    : isHigh
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {occupancy}% Occupancy {isCritical && '• Critical'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Total Regular Beds:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {fac.occupiedBeds} Occupied / {fac.totalBeds} Total (<strong className="text-emerald-600">{fac.availableBeds} Available</strong>)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${isCritical ? 'bg-rose-500' : isHigh ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${occupancy}%` }}
                  />
                </div>
              </div>

              {/* Specific Bed Categories Breakdown */}
              <div className="grid grid-cols-3 gap-2 text-xs pt-3 border-t border-slate-100">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase">
                    <Activity className="w-3 h-3 text-rose-500" />
                    <span>ICU Beds</span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm mt-1">
                    {fac.icuBeds.total - fac.icuBeds.occupied} <span className="text-xs text-slate-500 font-normal">/ {fac.icuBeds.total}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase">
                    <ShieldAlert className="w-3 h-3 text-amber-500" />
                    <span>Emergency</span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm mt-1">
                    {fac.emergencyBeds.total - fac.emergencyBeds.occupied} <span className="text-xs text-slate-500 font-normal">/ {fac.emergencyBeds.total}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase">
                    <Baby className="w-3 h-3 text-cyan-500" />
                    <span>Pediatric</span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm mt-1">
                    {fac.pediatricBeds.total - fac.pediatricBeds.occupied} <span className="text-xs text-slate-500 font-normal">/ {fac.pediatricBeds.total}</span>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
