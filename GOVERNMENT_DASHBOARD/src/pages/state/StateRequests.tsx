import { useState } from 'react';
import { 
  FileText, CheckCircle2, Filter, ShieldCheck, Stethoscope, 
  Pill, BedDouble, Building2
} from 'lucide-react';
import { useHealthData } from '../../context/HealthDataContext';
import { MOCK_DISTRICT_REQUESTS, type DistrictResourceRequest } from '../../data/mockData';

export default function StateRequests() {
  const { addAuditLog } = useHealthData();
  const [requests, setRequests] = useState<DistrictResourceRequest[]>(MOCK_DISTRICT_REQUESTS);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [notification, setNotification] = useState<string | null>(null);
  const [activeModalRequest, setActiveModalRequest] = useState<DistrictResourceRequest | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  const handleUpdateStatus = (id: string, newStatus: DistrictResourceRequest['status'], note: string) => {
    setRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: newStatus, reviewNotes: note || r.reviewNotes } : r)
    );

    const targetReq = requests.find(r => r.id === id);
    addAuditLog(
      `State Admin Decision on ${targetReq?.requestNumber || id}: Marked as ${newStatus}`,
      'District Requests Queue',
      `Title: ${targetReq?.title} • Notes: ${note || 'Standard protocol decision.'}`
    );

    setNotification(`Request ${targetReq?.requestNumber || id} updated to ${newStatus}. Action recorded in State Audit Ledger.`);
    setActiveModalRequest(null);
    setReviewNote('');
    setTimeout(() => setNotification(null), 5000);
  };

  const filteredRequests = requests.filter(r => {
    if (filterType !== 'ALL' && r.requestType !== filterType) return false;
    if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              State Secretariat Review Authority
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-700" />
            <span>District Healthcare Escalation & Support Requests Queue</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official queue of district-submitted requisitions for specialist doctor deputations, bulk pharmaceuticals, blood supply & diagnostics.
          </p>
        </div>

        <div className="text-xs bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700 font-bold">
          Pending Review: <span className="text-blue-700 font-mono">{requests.filter(r => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW').length} Requests</span>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-xs text-emerald-900 font-semibold shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Category:
          </span>
          {['ALL', 'STAFF', 'MEDICINE', 'BLOOD', 'DIAGNOSTICS'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === cat ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Status:</span>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="p-1 rounded-lg border border-slate-300 text-xs bg-white font-medium outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="FULFILLED">Fulfilled</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* REQUESTS LIST */}
      <div className="space-y-3">
        {filteredRequests.map(req => (
          <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-teal-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className={`p-2.5 rounded-xl flex-shrink-0 mt-0.5 ${
                req.requestType === 'STAFF' ? 'bg-teal-50 text-teal-700' :
                req.requestType === 'MEDICINE' ? 'bg-amber-50 text-amber-700' :
                req.requestType === 'BLOOD' ? 'bg-rose-50 text-rose-600' :
                'bg-blue-50 text-blue-700'
              }`}>
                {req.requestType === 'STAFF' && <Stethoscope className="w-5 h-5" />}
                {req.requestType === 'MEDICINE' && <Pill className="w-5 h-5" />}
                {req.requestType === 'BLOOD' && <BedDouble className="w-5 h-5" />}
                {req.requestType === 'DIAGNOSTICS' && <Building2 className="w-5 h-5" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {req.district} District
                  </span>
                  <span className="font-mono text-[10px] font-bold text-slate-400">{req.requestNumber}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    req.urgency === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {req.urgency}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-1">{req.title}</h3>
                <p className="text-xs text-slate-600 mt-0.5">{req.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 mt-2">
                  <span><strong>Scale Needed:</strong> {req.quantityNeeded}</span>
                  <span>•</span>
                  <span><strong>Submitted:</strong> {req.submittedAt}</span>
                  {req.assignedTo && (
                    <>
                      <span>•</span>
                      <span><strong>Assigned Directorate:</strong> {req.assignedTo}</span>
                    </>
                  )}
                </div>

                {req.reviewNotes && (
                  <div className="mt-2 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200 text-slate-700">
                    <strong>State Reviewer Notes:</strong> {req.reviewNotes}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                req.status === 'FULFILLED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' :
                req.status === 'APPROVED' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                req.status === 'REJECTED' ? 'bg-red-50 text-red-700 border border-red-200' :
                'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {req.status}
              </span>

              {req.status !== 'FULFILLED' && req.status !== 'REJECTED' && (
                <button
                  onClick={() => {
                    setActiveModalRequest(req);
                    setReviewNote(req.reviewNotes || '');
                  }}
                  className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Review Directive
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* STATE DECISION MODAL */}
      {activeModalRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4 animate-fadeIn">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official State Directive Review</span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">{activeModalRequest.title}</h3>
              <p className="text-xs text-slate-500">{activeModalRequest.requestNumber} • {activeModalRequest.district} District</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">State Administrative Directive / Review Notes</label>
              <textarea
                rows={3}
                value={reviewNote}
                onChange={e => setReviewNote(e.target.value)}
                placeholder="Specify allocation details, medical store depot instructions, or reason for decision..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setActiveModalRequest(null)}
                className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(activeModalRequest.id, 'REJECTED', reviewNote)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleUpdateStatus(activeModalRequest.id, 'APPROVED', reviewNote)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Approve State Support
                </button>
                <button
                  onClick={() => handleUpdateStatus(activeModalRequest.id, 'FULFILLED', reviewNote)}
                  className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Mark as Fulfilled
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
