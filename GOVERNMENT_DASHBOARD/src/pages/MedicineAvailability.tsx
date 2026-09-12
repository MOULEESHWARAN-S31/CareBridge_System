import { useState } from 'react';
import { 
  Pill, Search, CheckCircle2, X, ShieldAlert
} from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';
import { type MedicineInventoryItem } from '../data/mockData';

export default function MedicineAvailability() {
  const { medicines, triggerMedicineRequisition } = useHealthData();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Adequate' | 'Low' | 'Out of Stock' | 'Critical'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [requisitionModalOpen, setRequisitionModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineInventoryItem | null>(null);
  const [transferQty, setTransferQty] = useState(500);
  const [transferSource, setTransferSource] = useState('Central District Healthcare Warehouse');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const categoriesList = [
    'Essential Antibiotics', 'Cardiovascular', 'Maternal & Child', 
    'Anti-Diabetic', 'Analgesics', 'Emergency Fluids & Vaccines'
  ];

  const filteredMedicines = medicines.filter(m => {
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'Critical' && m.status !== 'Critical') return false;
      if (statusFilter !== 'Critical' && m.status !== statusFilter) return false;
    }
    if (categoryFilter !== 'ALL' && m.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.facility.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.batchNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const criticalShortageItems = medicines.filter(m => m.status === 'Critical' || m.status === 'Low');

  const handleExecuteRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedicine) return;

    triggerMedicineRequisition(selectedMedicine.id, Number(transferQty), selectedMedicine.facility);
    setSuccessNotice(`Successfully approved emergency transfer of ${transferQty} ${selectedMedicine.unit} of ${selectedMedicine.name} to ${selectedMedicine.facility}`);
    setRequisitionModalOpen(false);
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Pill className="w-5 h-5 text-emerald-600" />
            <span>Essential Medicine Inventory & Drug Buffer Command</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time stock monitoring, consumption forecasting, threshold alerts & inter-facility drug distribution across PHCs & Hospitals
          </p>
        </div>

        <div className="text-xs bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-emerald-800 font-medium">
          Stock Health: <strong className="text-emerald-700 font-mono">92.4% Adequacy Rate</strong>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Automated Stockout Warning Alert */}
      {criticalShortageItems.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-red-50 via-rose-50 to-red-50 border border-red-200 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 text-white rounded-xl shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-red-900 block">
                Automatic Buffer Alert: Paracetamol & Anti-Venom Below Threshold at Mecheri PHC (Primary Health Centre)
              </span>
              <p className="text-[11px] text-red-700">
                Predicted stockout in 2.0 days based on daily consumption rate. Emergency inter-facility transfer recommended.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedMedicine(criticalShortageItems[0]);
              setRequisitionModalOpen(true);
            }}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer whitespace-nowrap transition-colors"
          >
            Dispatch Requisition
          </button>
        </div>
      )}

      {/* 4 Inventory Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Monitored Drugs</span>
          <div className="text-xl font-black text-slate-900 mt-1">240 Formulations</div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Essential Drug List (EDL)</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">Adequate Stock</span>
          <div className="text-xl font-black text-emerald-600 mt-1">192 Items</div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">{'>'}15 days buffer safe</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">Low Buffer Warning</span>
          <div className="text-xl font-black text-amber-600 mt-1">36 Items</div>
          <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">Reorder point reached</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">Critical / Stockout</span>
          <div className="text-xl font-black text-rose-600 mt-1">12 Items</div>
          <span className="text-[10px] text-rose-700 font-bold block mt-0.5">Action requisition needed</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {(['ALL', 'Adequate', 'Low', 'Critical'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  statusFilter === st 
                    ? st === 'Critical' 
                      ? 'bg-rose-600 text-white' 
                      : st === 'Low'
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'ALL' ? 'All Stock Health' : st}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-semibold">Therapeutic Class:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border border-slate-300 text-xs text-slate-800 px-3 py-1.5 rounded-xl outline-none font-medium cursor-pointer shadow-sm"
            >
              <option value="ALL">All Therapeutic Classes</option>
              {categoriesList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
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
            placeholder="Search by drug formulation, hospital/health centre facility, category or batch number..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Medicine Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Medicine Name & EDL Code</th>
                <th className="py-3 px-3">Therapeutic Class</th>
                <th className="py-3 px-3">Healthcare Facility</th>
                <th className="py-3 px-3">Available Quantity</th>
                <th className="py-3 px-3">Buffer Threshold</th>
                <th className="py-3 px-3">Forecast Stockout</th>
                <th className="py-3 px-3">Expiry Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Requisition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMedicines.map((med) => {
                const statusBadge = med.status === 'Critical'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : med.status === 'Low'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200';

                return (
                  <tr key={med.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 group-hover:text-emerald-700 block">{med.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{med.id} • Batch: {med.batchNumber}</span>
                    </td>

                    <td className="py-3 px-3 text-slate-600">
                      {med.category}
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-900 truncate max-w-[180px] block">{med.facility}</span>
                      <span className="text-[10px] text-slate-500">{med.facilityType}</span>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {med.availableQuantity.toLocaleString()} {med.unit}
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-500">
                      Min {med.minimumStockThreshold.toLocaleString()} {med.unit}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`font-bold font-mono text-[11px] ${med.daysRemaining <= 3 ? 'text-rose-600' : med.daysRemaining <= 10 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {med.daysRemaining.toFixed(1)} Days
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                      {med.expiryDate}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${statusBadge}`}>
                        {med.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedMedicine(med);
                          setRequisitionModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-600 hover:text-white rounded-lg text-slate-700 text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
                      >
                        Re-Order
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Emergency Requisition Modal */}
      {requisitionModalOpen && selectedMedicine && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative text-slate-900 space-y-4">
            
            <button
              onClick={() => setRequisitionModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3">
              <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-sm">
                <Pill className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest block">
                  Inter-Facility Drug Transfer Order
                </span>
                <h3 className="text-base font-bold text-slate-900">{selectedMedicine.name}</h3>
                <p className="text-xs text-slate-500">Destination: {selectedMedicine.facility}</p>
              </div>
            </div>

            <form onSubmit={handleExecuteRequisition} className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block text-[10px]">Current Stock:</span>
                  <strong className="text-rose-600 font-mono text-sm">{selectedMedicine.availableQuantity} {selectedMedicine.unit}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Buffer Threshold:</span>
                  <strong className="text-slate-800 font-mono text-sm">{selectedMedicine.minimumStockThreshold} {selectedMedicine.unit}</strong>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Source Supply Warehouse</label>
                <select
                  value={transferSource}
                  onChange={(e) => setTransferSource(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none"
                >
                  <option value="Central District Healthcare Warehouse">Central District Healthcare Warehouse</option>
                  <option value="Government Taluk Headquarters Warehouse">Government Taluk Headquarters Warehouse</option>
                  <option value="Tamil Nadu Medical Services Corporation (TNMSC) District Depot">TNMSC District Depot</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Transfer Requisition Quantity ({selectedMedicine.unit})</label>
                <input
                  type="number"
                  required
                  min={10}
                  value={transferQty}
                  onChange={(e) => setTransferQty(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none font-mono focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRequisitionModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow cursor-pointer transition-colors"
                >
                  Approve & Dispatch Stock
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
