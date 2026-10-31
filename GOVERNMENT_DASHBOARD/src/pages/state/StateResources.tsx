import { useState } from 'react';
import { 
  ArrowRightLeft, Stethoscope, 
  Pill, BedDouble, CheckCircle2, 
  Send, ShieldCheck, Building2
} from 'lucide-react';
import { useHealthData } from '../../context/HealthDataContext';

interface CrossDistrictTransfer {
  id: string;
  sourceDistrict: string;
  targetDistrict: string;
  category: 'STAFF' | 'MEDICINE' | 'DIAGNOSTICS' | 'BLOOD';
  title: string;
  details: string;
  quantity: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MODERATE';
  status: 'PENDING_APPROVAL' | 'IN_TRANSIT' | 'DELIVERED';
  initiatedDate: string;
}

export default function StateResources() {
  const { addAuditLog } = useHealthData();
  const [notification, setNotification] = useState<string | null>(null);

  const [transfers, setTransfers] = useState<CrossDistrictTransfer[]>([
    {
      id: 'TRF-TN-01',
      sourceDistrict: 'Salem (Regional Warehouse)',
      targetDistrict: 'Dharmapuri (Pennagaram PHC)',
      category: 'MEDICINE',
      title: 'Bulk Ciprofloxacin & Electrolyte Rehydration Buffer',
      details: 'Dispatched to contain localized diarrheal cluster in Pennagaram block.',
      quantity: '4,000 Strips + 2,500 ORS',
      urgency: 'CRITICAL',
      status: 'IN_TRANSIT',
      initiatedDate: '2026-10-30'
    },
    {
      id: 'TRF-TN-02',
      sourceDistrict: 'Coimbatore Medical College Hospital',
      targetDistrict: 'Erode (Perundurai Sanatorium GH)',
      category: 'STAFF',
      title: 'Senior Pulmonologist 15-Day Clinical Deputation',
      details: 'Support occupational respiratory clinic in weavers industrial corridor.',
      quantity: '1 Specialist Doctor',
      urgency: 'HIGH',
      status: 'DELIVERED',
      initiatedDate: '2026-10-26'
    },
    {
      id: 'TRF-TN-03',
      sourceDistrict: 'Tiruchirappalli Central Blood Centre',
      targetDistrict: 'Madurai (Government Rajaji Hospital)',
      category: 'BLOOD',
      title: 'Whole Blood B-Negative Emergency Units Courier',
      details: 'Cold-chain courier transfer for emergency cardiovascular surgery.',
      quantity: '10 Units Whole Blood',
      urgency: 'CRITICAL',
      status: 'DELIVERED',
      initiatedDate: '2026-10-28'
    },
    {
      id: 'TRF-TN-04',
      sourceDistrict: 'Chennai Central Medical Stores Depot',
      targetDistrict: 'Salem (Omalur Taluk Hospital)',
      category: 'DIAGNOSTICS',
      title: 'Automated CBC Hematology Reagent Packs',
      details: 'Restores continuous laboratory diagnostic capacity at taluk level.',
      quantity: '15 Reagent Cartridges',
      urgency: 'HIGH',
      status: 'PENDING_APPROVAL',
      initiatedDate: '2026-10-31'
    }
  ]);

  const handleApproveTransfer = (id: string, title: string) => {
    setTransfers(prev =>
      prev.map(t => t.id === id ? { ...t, status: 'IN_TRANSIT' } : t)
    );
    addAuditLog(
      `State Admin Authorized Cross-District Logistics Transfer: ${title}`,
      'State Resources',
      `Transfer Order #${id} approved for inter-district transit.`
    );
    setNotification(`Transfer #${id} approved. Dispatch order sent to state medical logistics depot.`);
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              State Admin Resource Authority
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-teal-700" />
            <span>Statewide Resource Coordination & Inter-District Logistics</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Authorized oversight of multi-district specialist deployments, pharmaceutical buffer rebalancing, and regional blood bank coordination.
          </p>
        </div>

        <div className="text-xs bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700 font-bold">
          Active Transfers: <span className="text-teal-700 font-mono">{transfers.length} Directives</span>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-xs text-emerald-900 font-semibold shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 4 SUMMARY STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Staff Deputations</span>
          <div className="text-2xl font-black text-teal-700 mt-1">1 Specialist</div>
          <span className="text-[10px] text-teal-600 block mt-0.5">Cross-District Rotation</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Medicine Transfers</span>
          <div className="text-2xl font-black text-amber-600 mt-1">6,500 Units</div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Antibiotics & ORS Buffer</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Emergency Blood Relays</span>
          <div className="text-2xl font-black text-rose-600 mt-1">10 Units</div>
          <span className="text-[10px] text-rose-700 block mt-0.5">Cold-Chain Inter-City Transit</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Diagnostic Reagents</span>
          <div className="text-2xl font-black text-blue-700 mt-1">15 Packs</div>
          <span className="text-[10px] text-blue-600 block mt-0.5">1,500 Lab Test Cycles</span>
        </div>
      </div>

      {/* CROSS-DISTRICT DIRECTIVES LIST */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Inter-District Resource Movement Directives</h2>
            <p className="text-xs text-slate-500">Track and approve cross-district supply and personnel transfers.</p>
          </div>
        </div>

        <div className="space-y-3">
          {transfers.map(t => (
            <div key={t.id} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-teal-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className={`p-2.5 rounded-xl flex-shrink-0 mt-0.5 ${
                  t.category === 'MEDICINE' ? 'bg-amber-50 text-amber-700' :
                  t.category === 'STAFF' ? 'bg-teal-50 text-teal-700' :
                  t.category === 'BLOOD' ? 'bg-rose-50 text-rose-600' :
                  'bg-blue-50 text-blue-700'
                }`}>
                  {t.category === 'MEDICINE' && <Pill className="w-5 h-5" />}
                  {t.category === 'STAFF' && <Stethoscope className="w-5 h-5" />}
                  {t.category === 'BLOOD' && <BedDouble className="w-5 h-5" />}
                  {t.category === 'DIAGNOSTICS' && <Building2 className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {t.category} LOGISTICS
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      t.urgency === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.urgency}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">#{t.id}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-1">{t.title}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">{t.details}</p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2">
                    <span><strong>Source:</strong> {t.sourceDistrict}</span>
                    <span>→</span>
                    <span><strong>Destination:</strong> {t.targetDistrict}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Scale</span>
                  <span className="text-xs font-mono font-bold text-teal-800">{t.quantity}</span>
                </div>

                {t.status === 'PENDING_APPROVAL' ? (
                  <button
                    onClick={() => handleApproveTransfer(t.id, t.title)}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Authorize Dispatch</span>
                  </button>
                ) : (
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                    t.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' :
                    'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t.status === 'DELIVERED' ? 'Delivered' : 'In Transit'}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

