import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Search, Download, Eye, CheckCircle2, X
} from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';
import { type Facility } from '../data/mockData';

export default function GovernmentHospitals() {
  const navigate = useNavigate();
  const { facilities, addAuditLog } = useHealthData();

  const [activeTab, setActiveTab] = useState<'ALL' | 'Hospitals' | 'PHCs' | 'Diagnostics' | 'Pharmacies'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Operational' | 'High Load' | 'Critical'>('ALL');
  const [exportNotification, setExportNotification] = useState<string | null>(null);

  // Filter facilities
  const filteredFacilities = facilities.filter(f => {
    // Tab filter
    if (activeTab === 'Hospitals' && !(f.type.includes('Hospital'))) return false;
    if (activeTab === 'PHCs' && f.type !== 'Primary Health Centre (PHC)') return false;
    if (activeTab === 'Diagnostics' && f.type !== 'Diagnostic Centre') return false;
    if (activeTab === 'Pharmacies' && f.type !== 'Pharmacy') return false;

    // Status filter
    if (statusFilter !== 'ALL' && f.facilityStatus !== statusFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.taluk.toLowerCase().includes(q) ||
        f.district.toLowerCase().includes(q) ||
        f.officerInCharge.toLowerCase().includes(q)
      );
    }
    return true;
  }).sort((a, b) => b.patientsToday - a.patientsToday);

  const handleExportCSV = () => {
    addAuditLog('Exported Healthcare Facilities Directory CSV', 'Hospital Monitoring', `Total ${filteredFacilities.length} facilities exported.`);
    setExportNotification(`Successfully generated 'TN_Facilities_Report_${Date.now().toString().slice(-4)}.csv'`);
    setTimeout(() => setExportNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-700" />
            <span>Government Hospitals & Healthcare Facilities</span>
          </h1>
          <p className="text-xs text-slate-500">
            Real-time monitoring of Government Hospitals, Medical Colleges, PHCs & Diagnostic Hubs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-teal-800 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-teal-700" />
            <span>Export Facilities (CSV)</span>
          </button>
        </div>
      </div>

      {exportNotification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{exportNotification}</span>
        </div>
      )}

      {/* Tabs & Search Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Facility Type Tabs (CHC -> PHC) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {(['ALL', 'Hospitals', 'PHCs', 'Diagnostics', 'Pharmacies'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-teal-700 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === 'ALL' ? 'All Types' : tab === 'PHCs' ? 'PHCs (Primary Health Centres)' : tab}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-white border border-slate-300 text-xs text-slate-800 px-3 py-1.5 rounded-xl font-medium outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="Operational">Operational</option>
              <option value="High Load">High Load</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Search Box */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by hospital name, taluk, district or officer in charge..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white placeholder-slate-400"
          />
        </div>
      </div>

      {/* Facilities Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Hospital Name & Type</th>
                <th className="py-3 px-3">Location / Taluk</th>
                <th className="py-3 px-3">Doctors</th>
                <th className="py-3 px-3">Beds & Occupancy</th>
                <th className="py-3 px-3">Patients Today</th>
                <th className="py-3 px-3">Medicines</th>
                <th className="py-3 px-3">Diagnostics</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFacilities.map((fac) => {
                const occupancyRate = fac.totalBeds > 0 ? Math.round((fac.occupiedBeds / fac.totalBeds) * 100) : 0;
                
                const statusBadge = fac.facilityStatus === 'Critical'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : fac.facilityStatus === 'High Load'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200';

                return (
                  <tr key={fac.id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* Facility Name & Type */}
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-extrabold text-slate-900 block">{fac.name}</span>
                        <span className="text-[11px] text-teal-700 font-semibold">{fac.type}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-700">{fac.taluk} Taluk</span>
                      <span className="text-[10px] text-slate-400 block">{fac.district} Dist.</span>
                    </td>

                    {/* Doctors */}
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900">{fac.doctorsCount}</span>
                      <span className="text-[10px] text-slate-500 block">{fac.nursesCount} Nurses</span>
                    </td>

                    {/* Beds */}
                    <td className="py-3 px-3">
                      {fac.totalBeds > 0 ? (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">{fac.availableBeds}</span>
                            <span className="text-[10px] text-slate-500">/ {fac.totalBeds} Free</span>
                          </div>
                          <div className="w-20 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                            <div 
                              className={`h-full ${occupancyRate > 90 ? 'bg-rose-500' : occupancyRate > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${occupancyRate}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Daycare Only</span>
                      )}
                    </td>

                    {/* Patients Today */}
                    <td className="py-3 px-3 font-extrabold text-slate-900">
                      {fac.patientsToday.toLocaleString()}
                    </td>

                    {/* Medicines */}
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        fac.medicineStatus === 'Optimal'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : fac.medicineStatus === 'Low'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {fac.medicineStatus}
                      </span>
                    </td>

                    {/* Diagnostics */}
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        fac.diagnosticStatus === 'Full Service'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : fac.diagnosticStatus === 'Partial'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {fac.diagnosticStatus}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadge}`}>
                        {fac.facilityStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedFacility(fac)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 text-teal-800 border border-slate-200 hover:border-teal-300 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Facility Detail Modal */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded uppercase tracking-wider border border-teal-200">
                  {selectedFacility.type}
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">{selectedFacility.name}</h2>
                <p className="text-xs text-slate-500">
                  {selectedFacility.taluk} Taluk • {selectedFacility.district} District • Officer: {selectedFacility.officerInCharge}
                </p>
              </div>
              <button
                onClick={() => setSelectedFacility(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bed Breakdown Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Beds</span>
                <span className="text-xl font-black text-slate-900">{selectedFacility.totalBeds}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Free Beds</span>
                <span className="text-xl font-black text-emerald-700">{selectedFacility.availableBeds}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">ICU Available</span>
                <span className="text-xl font-black text-blue-700">
                  {selectedFacility.icuBeds.total - selectedFacility.icuBeds.occupied} / {selectedFacility.icuBeds.total}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Emergency Free</span>
                <span className="text-xl font-black text-amber-700">
                  {selectedFacility.emergencyBeds.total - selectedFacility.emergencyBeds.occupied} / {selectedFacility.emergencyBeds.total}
                </span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Doctors on Duty:</span>
                  <span className="font-bold text-slate-900">{selectedFacility.doctorsCount} Specialists</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nursing Staff:</span>
                  <span className="font-bold text-slate-900">{selectedFacility.nursesCount} Staff</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patients Treated Today:</span>
                  <span className="font-bold text-slate-900">{selectedFacility.patientsToday}</span>
                </div>
              </div>

              <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Medicine Buffer:</span>
                  <span className="font-bold text-slate-900">{selectedFacility.medicineStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Diagnostics:</span>
                  <span className="font-bold text-slate-900">{selectedFacility.diagnosticStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Emergency Contact:</span>
                  <span className="font-bold text-slate-900 font-mono">{selectedFacility.contactNumber}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedFacility(null);
                  navigate('/dashboard/beds-resources');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Inspect Bed Allocation
              </button>
              <button
                onClick={() => setSelectedFacility(null)}
                className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
