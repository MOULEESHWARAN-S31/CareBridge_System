import { useState } from 'react';
import { 
  Users, Search, ShieldCheck, Eye, Lock, X
} from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';
import { type MaskedPatient } from '../data/mockData';

export default function PatientMonitoring() {
  const { patients, currentDistrict, addAuditLog } = useHealthData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'Rural' | 'Urban' | 'Tribal'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'Active' | 'Treatment Completed' | 'Follow-up Required'>('ALL');
  const [selectedPatient, setSelectedPatient] = useState<MaskedPatient | null>(null);

  const filteredPatients = patients.filter(p => {
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
    if (selectedStatus !== 'ALL' && p.patientStatus !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.id.toLowerCase().includes(q) ||
        p.patientCode.toLowerCase().includes(q) ||
        p.facilityName.toLowerCase().includes(q) ||
        p.primaryDiagnosis.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenPatientRecord = (patient: MaskedPatient) => {
    addAuditLog(`Accessed Masked Patient Record ${patient.id}`, 'Patient Monitoring', `Viewed record for ${patient.patientCode} by authorized officer.`);
    setSelectedPatient(patient);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>Patient Registrations & Demographics</span>
            </h1>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> PII Masked
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Privacy-preserving registry with masked health identifiers across {currentDistrict.name} District
          </p>
        </div>

        <div className="text-xs bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-emerald-800 font-medium">
          Total Registered: <strong className="text-slate-900 font-mono">{currentDistrict.registeredPatients.toLocaleString()}</strong>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {(['ALL', 'Rural', 'Urban', 'Tribal'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-emerald-600 text-white shadow' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'ALL' ? 'All Populations' : `${cat} Population`}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="bg-white border border-slate-300 text-xs text-slate-800 px-3 py-1.5 rounded-xl font-medium outline-none cursor-pointer shadow-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Follow-up Required">Follow-up Required</option>
              <option value="Treatment Completed">Treatment Completed</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Patient ID, Masked Code, Facility or Primary Diagnosis..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Patient Directory Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Patient Identifier</th>
                <th className="py-3 px-3">Masked Code</th>
                <th className="py-3 px-3">Demographics</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Healthcare Facility</th>
                <th className="py-3 px-3">Primary Diagnosis</th>
                <th className="py-3 px-3">Registration Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map((p) => {
                const statusBadge = p.patientStatus === 'Active'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : p.patientStatus === 'Follow-up Required'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200';

                return (
                  <tr 
                    key={p.id}
                    onClick={() => handleOpenPatientRecord(p)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 group-hover:text-emerald-700">{p.id}</span>
                      <span className="text-[10px] text-slate-400 block">{p.patientNameMasked}</span>
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-cyan-700 font-semibold">
                      {p.patientCode}
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800">{p.age} Yrs</span>
                      <span className="text-[10px] text-slate-500 block">{p.gender}</span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        p.category === 'Tribal' 
                          ? 'bg-amber-50 text-amber-700 border-amber-200' 
                          : p.category === 'Rural'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {p.category}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-900 truncate max-w-[180px] block">{p.facilityName}</span>
                      <span className="text-[10px] text-slate-500">{p.taluk} Taluk</span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-slate-700 line-clamp-1 max-w-[200px]">{p.primaryDiagnosis}</span>
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                      {p.registrationDate}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusBadge}`}>
                        {p.patientStatus}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenPatientRecord(p);
                        }}
                        className="p-1.5 bg-slate-100 hover:bg-emerald-600 hover:text-white rounded-lg text-slate-600 transition-colors border border-slate-200"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Secure Patient Record Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl p-6 shadow-2xl relative text-slate-900 space-y-4">
            
            <button
              onClick={() => setSelectedPatient(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3">
              <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest block">
                  Authorized Patient Telemetry File
                </span>
                <h2 className="text-lg font-black text-slate-900">{selectedPatient.id} • {selectedPatient.patientNameMasked}</h2>
                <p className="text-xs text-slate-500 font-mono">Masked Code: {selectedPatient.patientCode}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Age & Gender</span>
                <span className="font-bold text-slate-900 text-sm">{selectedPatient.age} Years • {selectedPatient.gender}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Demographic Cluster</span>
                <span className="font-bold text-emerald-700 text-sm">{selectedPatient.category} ({selectedPatient.taluk} Taluk)</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Registered Facility</span>
                <span className="font-bold text-slate-900 text-sm">{selectedPatient.facilityName}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Status</span>
                <span className="font-bold text-emerald-700 text-sm">{selectedPatient.patientStatus}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Clinical Impression</span>
              <p className="text-xs font-semibold text-slate-800">{selectedPatient.primaryDiagnosis}</p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" /> Masked Contact: {selectedPatient.contactMasked}
              </span>
              <span className="font-mono">{selectedPatient.registrationDate}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer border border-slate-200 transition-colors"
              >
                Dismiss
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
