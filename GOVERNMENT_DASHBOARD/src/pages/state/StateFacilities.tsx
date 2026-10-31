import { useState, useMemo } from 'react';
import { 
  Building2, ShieldCheck, Stethoscope, 
  BedDouble, Phone,
  Filter
} from 'lucide-react';
import { useHealthData } from '../../context/HealthDataContext';

export default function StateFacilities() {
  const { allFacilities, districts, isOfflineMock } = useHealthData();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filteredFacilities = useMemo(() => {
    return allFacilities.filter(f => {
      if (selectedDistrict !== 'ALL' && (f.district || '').toLowerCase() !== selectedDistrict.toLowerCase()) return false;
      if (selectedType !== 'ALL' && f.type !== selectedType) return false;
      return true;
    });
  }, [allFacilities, selectedDistrict, selectedType]);

  const totalBeds = filteredFacilities.reduce((sum, f) => sum + f.totalBeds, 0);
  const totalOccupied = filteredFacilities.reduce((sum, f) => sum + f.occupiedBeds, 0);
  const totalDoctors = filteredFacilities.reduce((sum, f) => sum + f.doctorsCount, 0);
  const totalNurses = filteredFacilities.reduce((sum, f) => sum + f.nursesCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              State Admin Workspace • Infrastructure Directorate
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              isOfflineMock ? 'bg-amber-50 text-amber-700 border border-amber-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
            }`}>
              ● Live PostgreSQL Facility Inventory
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-700" />
            <span>Statewide Healthcare Facility Monitoring (Hospitals & PHCs)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time bed utilization, clinical staff allocations, and operational capacity across all government hospitals and primary health centres.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Facilities</span>
            <Building2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{filteredFacilities.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Government Hospitals & PHCs</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bed Capacity</span>
            <BedDouble className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-600">
            {totalOccupied} / {totalBeds}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {totalBeds > 0 ? Math.round((totalOccupied / totalBeds) * 100) : 0}% Statewide Occupancy
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Doctors</span>
            <Stethoscope className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{totalDoctors}</div>
          <p className="text-[11px] text-slate-500 mt-1">Clinical Specialists & MOs</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nursing Staff</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-600">{totalNurses}</div>
          <p className="text-[11px] text-slate-500 mt-1">Staff Nurses & Inpatient Ward</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <Filter className="w-4 h-4 text-slate-400" />
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
          <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Facility Type</label>
          <select 
            value={selectedType} 
            onChange={e => setSelectedType(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="ALL">All Facility Types</option>
            <option value="Government Hospital">Government Hospital (GH)</option>
            <option value="Primary Health Centre">Primary Health Centre (PHC)</option>
            <option value="Community Health Centre">Community Health Centre (CHC)</option>
            <option value="District Headquarters Hospital">District Headquarters Hospital</option>
          </select>
        </div>
      </div>

      {/* Facility Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-700" />
            <span>Government Facility Registry & Readiness Directory</span>
          </h2>
          <span className="text-xs font-bold text-slate-500">
            {filteredFacilities.length} facilities listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <th className="p-3">Facility Name</th>
                <th className="p-3">District / Taluk</th>
                <th className="p-3">Type</th>
                <th className="p-3 text-right">Doctors</th>
                <th className="p-3 text-right">Nurses</th>
                <th className="p-3 text-right">Beds (Avail/Total)</th>
                <th className="p-3">Medicine Status</th>
                <th className="p-3">Operational Status</th>
                <th className="p-3">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredFacilities.map(f => (
                <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-900">{f.name}</td>
                  <td className="p-3 font-semibold text-slate-700">{f.district} • {f.taluk}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {f.type}
                    </span>
                  </td>
                  <td className="p-3 text-right font-black text-teal-800">{f.doctorsCount}</td>
                  <td className="p-3 text-right font-black text-slate-800">{f.nursesCount}</td>
                  <td className="p-3 text-right font-bold">
                    <span className="text-emerald-700">{f.availableBeds}</span>
                    <span className="text-slate-400"> / {f.totalBeds}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      f.medicineStatus === 'Optimal' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      f.medicineStatus === 'Low' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {f.medicineStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {f.facilityStatus || 'Operational'}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-600 text-[11px] flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{f.contactNumber}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
