import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, MapPin, CheckCircle2, 
  ArrowRight, Filter, 
  Tent, } from 'lucide-react';
import { useHealthData } from '../../context/HealthDataContext';
import { MOCK_CITIZEN_CAMP_REQUESTS, type CitizenCampRequest } from '../../data/mockData';

export default function CommunityRequests() {
  const navigate = useNavigate();
  const { districtName, addAuditLog } = useHealthData();
  const [requests, setRequests] = useState<CitizenCampRequest[]>(MOCK_CITIZEN_CAMP_REQUESTS);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [notification, setNotification] = useState<string | null>(null);

  const handleUpdateStatus = (id: string, newStatus: CitizenCampRequest['status'], village: string) => {
    setRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
    );
    addAuditLog(
      `District Admin Updated Citizen Demand Status: ${village} -> ${newStatus}`,
      'Citizen Camp Requests',
      `Community request #${id} marked as ${newStatus}.`
    );
    setNotification(`Demand status for ${village} updated to "${newStatus}".`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleConvertToProposal = (req: CitizenCampRequest) => {
    handleUpdateStatus(req.id, 'CAMP_PROPOSED', req.village);
    navigate('/dashboard/district/camps');
  };

  const filteredRequests = requests.filter(r => {
    if (r.district !== districtName && districtName !== 'ALL') return false;
    if (categoryFilter !== 'ALL' && r.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Users className="w-3 h-3 text-purple-600" />
              Citizen Demand Driven Outreach
            </span>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {districtName} District
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Tent className="w-5 h-5 text-teal-700" />
            <span>Citizen Health Camp Requests & Community Demand Triage</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated, privacy-compliant service requests submitted by rural & tribal citizens through the CareBridge Patient Mobile App.
          </p>
        </div>

        <div className="text-xs bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl text-purple-800 font-bold">
          Pending Evaluation: <span className="font-mono text-purple-900">{filteredRequests.filter(r => r.status === 'PENDING_EVALUATION').length} Demands</span>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-xs text-emerald-900 font-semibold shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-4 rounded-xl border border-slate-200 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Specialty:
          </span>
          {['ALL', 'Maternal & Child', 'Eye Care', 'Diabetes & Hypertension', 'General Medical'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                categoryFilter === cat ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-[11px] text-slate-400">DISHA Privacy Protected • Individual health secrets redacted</span>
      </div>

      {/* REQUESTS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequests.map(req => (
          <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {req.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      req.urgencyLevel === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {req.urgencyLevel} PRIORITY
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">{req.requestId}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{req.village}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {req.block}, {req.district} District
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Citizens Signed</span>
                  <span className="text-xl font-black text-purple-700">{req.requestCount}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                <strong>Community Justification:</strong> {req.leadReason}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                <span>First Reported: {req.firstReportedDate}</span>
                <span className={`font-bold px-2 py-0.5 rounded-md ${
                  req.status === 'CAMP_PROPOSED' ? 'bg-teal-50 text-teal-800' :
                  req.status === 'MERGED' ? 'bg-blue-50 text-blue-700' :
                  'bg-amber-50 text-amber-800'
                }`}>
                  {req.status}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleUpdateStatus(req.id, 'MERGED', req.village)}
                className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Merge with Existing
              </button>

              <button
                onClick={() => handleConvertToProposal(req)}
                className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Convert to Camp Proposal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
