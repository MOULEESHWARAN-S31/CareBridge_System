import { useHealthData } from '../context/HealthDataContext';

export default function MaternalChildHealth() {
  const { villages, districtName } = useHealthData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
              Mother & Child Welfare Module
            </span>
            <span className="text-xs text-slate-500 font-medium">RCH (Reproductive & Child Health) Portal</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Maternal & Child Health Tracking</h2>
          <p className="text-xs text-slate-500 mt-1">
            {districtName} District • High-risk pregnancy surveillance, ANC checkup compliance, institutional deliveries, and infant nutrition.
          </p>
        </div>

        <span className="text-xs font-bold text-rose-800 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
          Institutional Deliveries: 94.2%
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Pregnant Women Registered</span>
          <h3 className="text-2xl font-black text-slate-900">2,850</h3>
          <span className="text-[11px] text-emerald-700 font-bold mt-1 inline-block">100% Verified Registry</span>
        </div>

        <div className="bg-rose-50 rounded-2xl border border-rose-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-rose-700 block mb-1">High-Risk Pregnancies</span>
          <h3 className="text-2xl font-black text-rose-950">124</h3>
          <span className="text-[11px] text-rose-700 font-bold mt-1 inline-block">⚠️ Intensive Obstetric Care</span>
        </div>

        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-amber-700 block mb-1">ANC Checkups Pending</span>
          <h3 className="text-2xl font-black text-amber-950">348</h3>
          <span className="text-[11px] text-amber-800 font-bold mt-1 inline-block">3rd Trimester Priority</span>
        </div>

        <div className="bg-purple-50 rounded-2xl border border-purple-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-purple-700 block mb-1">Children 0–5 Monitored</span>
          <h3 className="text-2xl font-black text-purple-950">24,500</h3>
          <span className="text-[11px] text-purple-800 font-bold mt-1 inline-block">92.4% Immunized</span>
        </div>
      </div>

      {/* Village Maternal Health Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-1">Village-Wise Maternal Vulnerability Index</h3>
        <p className="text-xs text-slate-500 mb-4">High-risk pregnant women tracking by village block</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-3">Village Name</th>
                <th className="p-3">Total Pregnant Registered</th>
                <th className="p-3 text-rose-700">High-Risk Pregnancies</th>
                <th className="p-3 text-amber-700">ANC Pending</th>
                <th className="p-3">Health Unit In-Charge</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {villages.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-slate-900">{v.name}</td>
                  <td className="p-3 font-semibold">{v.maternalTotal} Women</td>
                  <td className="p-3 font-extrabold text-rose-700">{v.maternalHighRisk} Cases</td>
                  <td className="p-3 font-bold text-amber-700">{v.ancPending} Pending</td>
                  <td className="p-3 text-slate-600">{v.name} Health Unit</td>
                  <td className="p-3 text-right">
                    <button 
                      onClick={() => alert(`Maternal Health Camp Dispatched for ${v.name}`)}
                      className="text-xs font-bold text-rose-700 hover:text-rose-900 underline cursor-pointer"
                    >
                      Schedule ANC Camp
                    </button>
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
