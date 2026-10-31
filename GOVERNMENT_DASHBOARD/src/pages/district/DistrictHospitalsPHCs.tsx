import { useState, useMemo } from 'react';
import { 
  Building2, Stethoscope, BedDouble, 
  Phone, ShieldCheck, Filter
} from 'lucide-react';
import { useHealthData } from '../../context/HealthDataContext';

export default function DistrictHospitalsPHCs() {
  const { facilities, districtName, isOfflineMock } = useHealthData();
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return facilities.filter(f => {
      if (selectedType !== 'ALL' && f.type !== selectedType) return false;
      if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase()) && !f.taluk.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [facilities, selectedType, searchQuery]);

  const totalBeds = filtered.reduce((sum, f) => sum + f.totalBeds, 0);
  const totalOccupied = filtered.reduce((sum, f) => sum + f.occupiedBeds, 0);
  const totalDoctors = filtered.reduce((sum, f) => sum + f.doctorsCount, 0);
  const totalNurses = filtered.reduce((sum, f) => sum + f.nursesCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-teal-600" />
              District Admin Workspace • Facility Directory
            </span>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {districtName} District
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              isOfflineMock ? 'bg-amber-50 text-amber-700 border border-amber-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
            }`}>
              ● Live PostgreSQL Facility Registry
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-700" />
            <span>District Hospitals & Primary Health Centres (PHCs)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Directory of government health institutions, bed occupancy, doctor roster, and frontline clinical capacity within {districtName} district.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">District Facilities</span>
            <Building2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{filtered.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Hospitals & PHCs in {districtName}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bed Occupancy</span>
            <BedDouble className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-600">
            {totalOccupied} / {totalBeds}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {totalBeds > 0 ? Math.round((totalOccupied / totalBeds) * 100) : 0}% Occupancy
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Medical Officers</span>
            <Stethoscope className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{totalDoctors}</div>
          <p className="text-[11px] text-slate-500 mt-1">Doctors deployed</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Staff Nurses</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-600">{totalNurses}</div>
          <p className="text-[11px] text-slate-500 mt-1">Nurses on active duty</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <Filter className="w-4 h-4 text-slate-400" />
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search facility name, taluk or block..."
            className="w-full text-xs font-semibold p-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
        <div>
          <select 
            value={selectedType} 
            onChange={e => setSelectedType(e.target.value)}
            className="text-xs font-semibold px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="ALL">All Types</option>
            <option value="Government Hospital">Government Hospital (GH)</option>
            <option value="Primary Health Centre">Primary Health Centre (PHC)</option>
            <option value="Community Health Centre">Community Health Centre (CHC)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <th className="p-3">Facility Name</th>
                <th className="p-3">Taluk / Block</th>
                <th className="p-3">Type</th>
                <th className="p-3 text-right">Doctors</th>
                <th className="p-3 text-right">Nurses</th>
                <th className="p-3 text-right">Beds (Avail / Total)</th>
                <th className="p-3">Medicine Status</th>
                <th className="p-3">Operational Status</th>
                <th className="p-3">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map(f => (
                <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-900">{f.name}</td>
                  <td className="p-3 font-semibold text-slate-700">{f.taluk}</td>
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

