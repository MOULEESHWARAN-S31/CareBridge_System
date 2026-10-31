import { useState, useMemo } from 'react';
import { 
  Pill, AlertTriangle, ShieldCheck, 
  ArrowRightLeft, Download, Filter, CheckCircle2
} from 'lucide-react';
import { useHealthData } from '../../context/HealthDataContext';

interface StateMedicineShortage {
  id: string;
  medicineName: string;
  category: string;
  districtsAffectedCount: number;
  totalBufferQuantity: number;
  criticalThreshold: number;
  stockStatus: 'Critical Stockout' | 'Low Buffer' | 'Adequate';
  leadDistricts: string[];
  daysRemainingEstimate: number;
  procurementAgency: string;
}

const STATEWIDE_MEDICINES: StateMedicineShortage[] = [
  { id: 'MED-01', medicineName: 'Paracetamol 500mg Tablets', category: 'Analgesics / Antipyretics', districtsAffectedCount: 0, totalBufferQuantity: 450000, criticalThreshold: 100000, stockStatus: 'Adequate', leadDistricts: ['Statewide Adequate'], daysRemainingEstimate: 45, procurementAgency: 'TNMSC' },
  { id: 'MED-02', medicineName: 'Amoxicillin 500mg Capsules', category: 'Antibiotics', districtsAffectedCount: 4, totalBufferQuantity: 18500, criticalThreshold: 30000, stockStatus: 'Low Buffer', leadDistricts: ['Salem', 'Dharmapuri', 'Erode'], daysRemainingEstimate: 9, procurementAgency: 'TNMSC' },
  { id: 'MED-03', medicineName: 'Metformin 500mg Tablets', category: 'Anti-Diabetic', districtsAffectedCount: 1, totalBufferQuantity: 82000, criticalThreshold: 40000, stockStatus: 'Adequate', leadDistricts: ['Salem'], daysRemainingEstimate: 28, procurementAgency: 'TNMSC' },
  { id: 'MED-04', medicineName: 'Amlodipine 5mg Tablets', category: 'Antihypertensives', districtsAffectedCount: 6, totalBufferQuantity: 9200, criticalThreshold: 25000, stockStatus: 'Critical Stockout', leadDistricts: ['Salem', 'Madurai', 'Coimbatore', 'Vellore'], daysRemainingEstimate: 4, procurementAgency: 'TNMSC' },
  { id: 'MED-05', medicineName: 'Oral Rehydration Salts (ORS) Sachets', category: 'Electrolytes / GI', districtsAffectedCount: 2, totalBufferQuantity: 34000, criticalThreshold: 20000, stockStatus: 'Adequate', leadDistricts: ['Trichy', 'Perambalur'], daysRemainingEstimate: 21, procurementAgency: 'TNMSC' },
  { id: 'MED-06', medicineName: 'Rabies Immunoglobulin (RIG)', category: 'Biologicals / Emergency', districtsAffectedCount: 8, totalBufferQuantity: 420, criticalThreshold: 1500, stockStatus: 'Critical Stockout', leadDistricts: ['Salem', 'Tirunelveli', 'Dindigul', 'Theni'], daysRemainingEstimate: 3, procurementAgency: 'TNMSC' },
  { id: 'MED-07', medicineName: 'Anti-Snake Venom (Polyvalent)', category: 'Antidotes / Critical', districtsAffectedCount: 3, totalBufferQuantity: 1100, criticalThreshold: 2000, stockStatus: 'Low Buffer', leadDistricts: ['Yercaud Tribal', 'Nilgiris', 'Salem'], daysRemainingEstimate: 7, procurementAgency: 'TNMSC' },
];

export default function StateMedicine() {
  const { isOfflineMock } = useHealthData();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filtered = useMemo(() => {
    return STATEWIDE_MEDICINES.filter(m => {
      if (filterCategory !== 'ALL' && m.category !== filterCategory) return false;
      if (filterStatus !== 'ALL' && m.stockStatus !== filterStatus) return false;
      return true;
    });
  }, [filterCategory, filterStatus]);

  const criticalCount = filtered.filter(m => m.stockStatus === 'Critical Stockout').length;
  const lowBufferCount = filtered.filter(m => m.stockStatus === 'Low Buffer').length;
  const adequateCount = filtered.filter(m => m.stockStatus === 'Adequate').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              State Admin Workspace • TNMSC Drug Logistics
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              isOfflineMock ? 'bg-amber-50 text-amber-700 border border-amber-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
            }`}>
              ● Real-time TNMSC Warehouse Buffer Link
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-700" />
            <span>Statewide Essential Medicines & Diagnostics Intelligence (Non-AI)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Macro pharmaceutical inventory, district stockout tracking, and Tamil Nadu Medical Services Corporation (TNMSC) pipeline coordination.
          </p>
        </div>

        <button 
          onClick={() => window.print()}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Stockout Audit</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Critical Shortages</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">{criticalCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">&lt; 5 Days buffer remaining</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Low Buffer Stock</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">{lowBufferCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">5–14 Days buffer remaining</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Adequate Stock</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{adequateCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">&gt; 15 Days buffer confirmed</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Procurement Pipeline</span>
            <ArrowRightLeft className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-600">32 Indents</div>
          <p className="text-[11px] text-slate-500 mt-1">Active TNMSC deliveries</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <Filter className="w-4 h-4 text-slate-400" />
        <div>
          <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Therapeutic Category</label>
          <select 
            value={filterCategory} 
            onChange={e => setFilterCategory(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="ALL">All Therapeutic Classes</option>
            <option value="Antibiotics">Antibiotics</option>
            <option value="Antihypertensives">Antihypertensives</option>
            <option value="Biologicals / Emergency">Biologicals / Emergency</option>
            <option value="Antidotes / Critical">Antidotes / Critical</option>
            <option value="Analgesics / Antipyretics">Analgesics / Antipyretics</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Buffer Status</label>
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="ALL">All Buffer Levels</option>
            <option value="Critical Stockout">Critical Stockout (&lt;5d)</option>
            <option value="Low Buffer">Low Buffer (5-14d)</option>
            <option value="Adequate">Adequate Stock (&gt;15d)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Pill className="w-4 h-4 text-teal-700" />
            <span>State Essential Drug Buffer & Depletion Ledger</span>
          </h2>
          <span className="text-xs font-bold text-slate-500">
            {filtered.length} formulations monitored
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <th className="p-3">Drug Code</th>
                <th className="p-3">Formulation & Strength</th>
                <th className="p-3">Therapeutic Class</th>
                <th className="p-3 text-right">State Buffer</th>
                <th className="p-3 text-right">Min Threshold</th>
                <th className="p-3">Buffer Status</th>
                <th className="p-3">Est. Days</th>
                <th className="p-3">Lead Deficit Districts</th>
                <th className="p-3">Supplier Agency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-teal-800">{item.id}</td>
                  <td className="p-3 font-bold text-slate-900">{item.medicineName}</td>
                  <td className="p-3 font-semibold text-slate-600">{item.category}</td>
                  <td className="p-3 text-right font-black text-slate-800">{item.totalBufferQuantity.toLocaleString()}</td>
                  <td className="p-3 text-right font-semibold text-slate-500">{item.criticalThreshold.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.stockStatus === 'Critical Stockout' ? 'bg-rose-100 text-rose-800' :
                      item.stockStatus === 'Low Buffer' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.stockStatus}
                    </span>
                  </td>
                  <td className="p-3 font-black text-slate-800">
                    <span className={item.daysRemainingEstimate <= 4 ? 'text-rose-600' : 'text-slate-800'}>
                      {item.daysRemainingEstimate} d
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-700">{item.leadDistricts.join(', ')}</td>
                  <td className="p-3 font-mono font-bold text-teal-800">{item.procurementAgency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

