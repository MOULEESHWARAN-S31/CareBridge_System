import { useState, useMemo } from 'react';
import { 
  Activity, ShieldCheck, 
  CheckCircle2, AlertTriangle, Filter, Download
} from 'lucide-react';
import { useHealthData } from '../../context/HealthDataContext';

interface DiagnosticEquipmentItem {
  id: string;
  facilityName: string;
  testCategory: 'Radiology / Imaging' | 'Pathology / Biochemistry' | 'Cardiology / ECG' | 'Point-of-Care (POCT)';
  testName: string;
  equipmentModel: string;
  equipmentStatus: 'Operational' | 'Degraded' | 'Offline / Under Repair';
  reagentStockDays: number;
  dailyCapacity: number;
  testsCompletedToday: number;
  pendingQueue: number;
  turnaroundTimeHours: number;
}

const DISTRICT_DIAGNOSTICS_DATA: DiagnosticEquipmentItem[] = [
  { id: 'DIAG-01', facilityName: 'Salem Govt Mohan Kumaramangalam MCH', testCategory: 'Radiology / Imaging', testName: '128-Slice CT Scan (Brain & Abdomen)', equipmentModel: 'Siemens SOMATOM Definition', equipmentStatus: 'Operational', reagentStockDays: 45, dailyCapacity: 60, testsCompletedToday: 38, pendingQueue: 6, turnaroundTimeHours: 2 },
  { id: 'DIAG-02', facilityName: 'Salem Govt Mohan Kumaramangalam MCH', testCategory: 'Radiology / Imaging', testName: 'Digital X-Ray (Chest / Ortho)', equipmentModel: 'GE Definium 646 HD', equipmentStatus: 'Operational', reagentStockDays: 60, dailyCapacity: 150, testsCompletedToday: 112, pendingQueue: 14, turnaroundTimeHours: 1 },
  { id: 'DIAG-03', facilityName: 'Mettur Taluk Headquarters Hospital', testCategory: 'Radiology / Imaging', testName: 'Ultrasound with Color Doppler', equipmentModel: 'Mindray DC-70', equipmentStatus: 'Operational', reagentStockDays: 30, dailyCapacity: 45, testsCompletedToday: 29, pendingQueue: 4, turnaroundTimeHours: 1 },
  { id: 'DIAG-04', facilityName: 'Edappadi Taluk Hospital', testCategory: 'Pathology / Biochemistry', testName: 'Automated Hematology 5-Part Cell Counter', equipmentModel: 'Sysmex XN-350', equipmentStatus: 'Operational', reagentStockDays: 18, dailyCapacity: 120, testsCompletedToday: 84, pendingQueue: 8, turnaroundTimeHours: 1 },
  { id: 'DIAG-05', facilityName: 'Omalur Community Health Centre', testCategory: 'Cardiology / ECG', testName: '12-Lead Portable Diagnostic ECG', equipmentModel: 'Philips PageWriter TC20', equipmentStatus: 'Operational', reagentStockDays: 90, dailyCapacity: 50, testsCompletedToday: 31, pendingQueue: 2, turnaroundTimeHours: 0.5 },
  { id: 'DIAG-06', facilityName: 'Yercaud Tribal Primary Health Centre', testCategory: 'Point-of-Care (POCT)', testName: 'HbA1c & Blood Glucose POCT Analyzer', equipmentModel: 'Alere Afinion AS100', equipmentStatus: 'Degraded', reagentStockDays: 4, dailyCapacity: 30, testsCompletedToday: 14, pendingQueue: 9, turnaroundTimeHours: 0.5 },
  { id: 'DIAG-07', facilityName: 'Attur Govt Hospital', testCategory: 'Pathology / Biochemistry', testName: 'Fully Automated Clinical Chemistry Analyzer', equipmentModel: 'Roche Cobas c311', equipmentStatus: 'Offline / Under Repair', reagentStockDays: 22, dailyCapacity: 200, testsCompletedToday: 0, pendingQueue: 35, turnaroundTimeHours: 24 }
];

export default function DiagnosticAvailability() {
  const { districtName, isOfflineMock } = useHealthData();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filtered = useMemo(() => {
    return DISTRICT_DIAGNOSTICS_DATA.filter(d => {
      if (selectedCategory !== 'ALL' && d.testCategory !== selectedCategory) return false;
      if (selectedStatus !== 'ALL' && d.equipmentStatus !== selectedStatus) return false;
      return true;
    });
  }, [selectedCategory, selectedStatus]);

  const totalOperational = filtered.filter(d => d.equipmentStatus === 'Operational').length;
  const totalDegradedOrOffline = filtered.filter(d => d.equipmentStatus !== 'Operational').length;
  const totalTestsCompleted = filtered.reduce((sum, d) => sum + d.testsCompletedToday, 0);
  const totalPendingQueue = filtered.reduce((sum, d) => sum + d.pendingQueue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-teal-600" />
              District Admin Workspace • Diagnostics & Laboratory
            </span>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {districtName} District
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              isOfflineMock ? 'bg-amber-50 text-amber-700 border border-amber-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
            }`}>
              ● Live Facility Equipment Status
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-700" />
            <span>District Diagnostic Equipment & Laboratory Availability</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitoring uptime, reagent buffer stocks, pending patient queues, and service availability for CT, X-Ray, ECG, and pathology laboratories in {districtName}.
          </p>
        </div>

        <button 
          onClick={() => window.print()}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Diagnostic Digest</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Operational Equipment</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{totalOperational} Units</div>
          <p className="text-[11px] text-slate-500 mt-1">Full service availability</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Service Outages</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">{totalDegradedOrOffline} Units</div>
          <p className="text-[11px] text-slate-500 mt-1">Require biomedical engineer</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tests Done Today</span>
            <Activity className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalTestsCompleted}</div>
          <p className="text-[11px] text-slate-500 mt-1">Completed scans / reports</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Test Queue</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">{totalPendingQueue}</div>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting specimen / scan</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <Filter className="w-4 h-4 text-slate-400" />
        <div>
          <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Modality Category</label>
          <select 
            value={selectedCategory} 
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="ALL">All Diagnostic Modalities</option>
            <option value="Radiology / Imaging">Radiology / Imaging (CT & X-Ray)</option>
            <option value="Pathology / Biochemistry">Pathology / Clinical Chemistry</option>
            <option value="Cardiology / ECG">Cardiology / ECG</option>
            <option value="Point-of-Care (POCT)">Point-of-Care (POCT)</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Uptime Status</label>
          <select 
            value={selectedStatus} 
            onChange={e => setSelectedStatus(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="ALL">All Equipment Statuses</option>
            <option value="Operational">Operational</option>
            <option value="Degraded">Degraded (Low Reagent)</option>
            <option value="Offline / Under Repair">Offline / Breakdown</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-700" />
            <span>District Diagnostic Modality Status Ledger</span>
          </h2>
          <span className="text-xs font-bold text-slate-500">
            {filtered.length} equipment units in monitoring
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <th className="p-3">Facility & Test</th>
                <th className="p-3">Equipment Model</th>
                <th className="p-3">Category</th>
                <th className="p-3">Equipment Status</th>
                <th className="p-3 text-right">Reagent Buffer</th>
                <th className="p-3 text-right">Daily Cap</th>
                <th className="p-3 text-right">Done Today</th>
                <th className="p-3 text-right">Pending Queue</th>
                <th className="p-3">Avg Turnaround</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{item.testName}</div>
                    <div className="text-[11px] text-slate-500">{item.facilityName}</div>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-600">{item.equipmentModel}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {item.testCategory}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.equipmentStatus === 'Operational' ? 'bg-emerald-100 text-emerald-800' :
                      item.equipmentStatus === 'Degraded' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {item.equipmentStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right font-black text-slate-800">
                    <span className={item.reagentStockDays < 7 ? 'text-rose-600' : 'text-slate-800'}>
                      {item.reagentStockDays} d
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono text-slate-600">{item.dailyCapacity}</td>
                  <td className="p-3 text-right font-black text-emerald-700">{item.testsCompletedToday}</td>
                  <td className="p-3 text-right font-black text-amber-700">{item.pendingQueue}</td>
                  <td className="p-3 font-mono text-slate-700">{item.turnaroundTimeHours} h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

