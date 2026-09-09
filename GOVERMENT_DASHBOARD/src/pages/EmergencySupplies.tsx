import { useState } from 'react';
import { 
  AlertTriangle, ArrowRightLeft, ShieldCheck, Activity, Send,
  PackageCheck, Truck, Clock, CheckCircle2, Box, X
} from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';

export default function EmergencySupplies() {
  const { emergencySupplies, facilitySupplyBreakdown, districtName } = useHealthData();
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState('es1');
  const [sourceHospital, setSourceHospital] = useState(`${districtName} Government Medical College Hospital`);
  const [destHospital, setDestHospital] = useState('Mecheri Primary Health Centre (PHC)');
  const [transferUnits, setTransferUnits] = useState(6);
  const [priority, setPriority] = useState<'Emergency Cold-Chain' | 'Rapid Transit Ambulance' | 'Scheduled Buffer'>('Emergency Cold-Chain');
  const [transferSuccessMsg, setTransferSuccessMsg] = useState<string | null>(null);

  const totalStockSum = emergencySupplies.reduce((acc, curr) => acc + curr.totalStock, 0);
  const criticalItems = emergencySupplies.filter(s => s.status === 'Critical' || s.status === 'Low');

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const item = emergencySupplies.find(s => s.id === selectedSupply) || emergencySupplies[0];
    setTransferSuccessMsg(`✅ SUCCESS: Dispatched ${transferUnits} ${item?.unit || 'Units'} of ${item?.name || 'Supply'} from ${sourceHospital} to ${destHospital} via ${priority}. Dispatch Tracking ID: #TN-LOG-${Math.floor(1000 + Math.random() * 9000)}.`);
    setTimeout(() => {
      setShowTransferModal(false);
      setTransferSuccessMsg(null);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-teal-200">
              🟢 District Logistics Hub
            </span>
            <span className="text-[10px] font-extrabold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-blue-200">
              District Supplies Readiness: 95.4%
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-2 flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-teal-700" />
            Essential Medical Supplies & Emergency Logistics
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {districtName} District • Real-time emergency kits, anti-venom, oxygen, and cold-chain diagnostics across public health centers.
          </p>
        </div>

        <button 
          onClick={() => setShowTransferModal(true)}
          className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <ArrowRightLeft className="w-4 h-4" /> Initiate Supply Transfer
        </button>
      </div>

      {/* CRITICAL BUFFER SHORTAGE ALERT BANNER */}
      {criticalItems.length > 0 && (
        <div className="bg-amber-50 text-slate-900 p-5 rounded-2xl shadow-xs border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-amber-100 rounded-xl border border-amber-300">
              <AlertTriangle className="w-7 h-7 text-amber-700 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black bg-amber-600 text-white px-2 py-0.5 rounded uppercase tracking-wider">
                  BUFFER STOCK ALERT
                </span>
                <span className="text-[10px] text-amber-900 font-bold">Ref ID: LOG-{districtName.substring(0,3).toUpperCase()}-2026-BUF</span>
              </div>
              <h3 className="text-base sm:text-lg font-black mt-1 text-slate-900">
                Low Buffer: Essential Life-Saving Antidotes & Rapid Testing Kits
              </h3>
              <p className="text-xs text-slate-700 mt-0.5">
                Local Primary Health Centres (PHCs) require buffer replenishment from District Central Medical Store.
              </p>
            </div>
          </div>

          <button 
            onClick={() => setShowTransferModal(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow-xs cursor-pointer"
          >
            Dispatch Central Buffer Stock
          </button>
        </div>
      )}

      {/* Critical Life-Saving Supplies Cards Grid */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-700" />
            Live Essential Emergency Supplies & Buffer Tracking ({districtName} District)
          </h3>
          <span className="text-xs text-slate-500 font-mono">Total Items: {emergencySupplies.length}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {emergencySupplies.map((item) => {
            const stockPct = Math.min(100, Math.round((item.totalStock / item.bufferThreshold) * 100));
            return (
              <div 
                key={item.id}
                className={`p-4 rounded-2xl border transition-all bg-white shadow-xs ${
                  item.status === 'Critical' 
                    ? 'border-rose-300 ring-1 ring-rose-200' 
                    : item.status === 'Low'
                    ? 'border-amber-300'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide truncate max-w-[140px]">
                    {item.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                    item.status === 'Critical' 
                      ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                      : item.status === 'Low' 
                      ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="mt-3">
                  <h4 className="text-sm font-bold text-slate-900 leading-tight min-h-[36px]">{item.name}</h4>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-slate-900">
                      {item.totalStock} <span className="text-xs font-semibold text-slate-500">{item.unit}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Buffer: {item.bufferThreshold}
                    </span>
                  </div>

                  {/* Stock Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-2.5 overflow-hidden border border-slate-200">
                    <div 
                      className={`h-full transition-all ${
                        item.status === 'Critical' ? 'bg-rose-500' : item.status === 'Low' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, stockPct)}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1.5 font-medium">
                    <span>Readiness: {stockPct}%</span>
                    <button 
                      onClick={() => {
                        setSelectedSupply(item.id);
                        setShowTransferModal(true);
                      }}
                      className="text-teal-700 hover:text-teal-900 font-bold hover:underline cursor-pointer"
                    >
                      Dispatch →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Facility Allocation Breakdown & Emergency Couriers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Facility Distribution (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Box className="w-4 h-4 text-teal-700" />
                Facility-Wise Emergency Supply Depots
              </h3>
              <p className="text-xs text-slate-500">Stock readiness and critical kits availability across Hospitals & Primary Health Centres (PHCs)</p>
            </div>
            <span className="text-xs font-mono text-slate-600">District Total: {totalStockSum} items</span>
          </div>

          <div className="space-y-3">
            {facilitySupplyBreakdown.map((f, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-teal-200 transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{f.hospitalName}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">{f.hospitalType}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Critical Emergency Kits in Depot: <strong className="text-emerald-700">{f.criticalKits} / {f.maxKits} Kits</strong>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:w-64">
                  <div className="flex-1">
                    <div className="flex justify-between text-[11px] mb-1 font-bold">
                      <span className="text-slate-500">Readiness</span>
                      <span className={f.readinessPercentage >= 85 ? 'text-emerald-700' : f.readinessPercentage >= 60 ? 'text-amber-700' : 'text-red-700'}>
                        {f.readinessPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full ${
                          f.readinessPercentage >= 85 ? 'bg-emerald-500' : f.readinessPercentage >= 60 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${f.readinessPercentage}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setDestHospital(f.hospitalName);
                      setShowTransferModal(true);
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-teal-50 text-teal-800 border border-slate-200 text-xs font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer shadow-xs"
                  >
                    Send Stock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rapid Response Courier Logistics (1 col) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Truck className="w-4 h-4 text-teal-700" />
              Active Cold-Chain & Supply Couriers
            </h3>

            <div className="space-y-3 mt-4 text-xs">
              {[
                { id: 'LOG-TN-41', route: `${districtName} GMC → District PHC Network`, payload: '12 Anti-Venom Vials, 10 Rapid Kits', eta: '14 mins', status: 'En Route', priority: 'High Priority' },
                { id: 'LOG-TN-42', route: 'Taluk Hospital → Rural PHC Depot', payload: '4 Oxygen D-Cylinders', eta: '28 mins', status: 'En Route', priority: 'Urgent' },
                { id: 'LOG-TN-39', route: 'Regional Store → Central Depot', payload: 'Cold-Chain Vaccine Batch', eta: 'Completed', status: 'Delivered', priority: 'Standard' },
              ].map((c, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-teal-800 text-[11px]">{c.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 text-xs">{c.route}</div>
                  <div className="text-[11px] text-slate-500">{c.payload}</div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> ETA: {c.eta}</span>
                    <span className="font-semibold text-slate-600">{c.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-xs space-y-1 mt-4">
            <div className="font-bold text-teal-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-700" /> GPS & Temperature Monitored
            </div>
            <p className="text-[11px] text-teal-800">
              All supply dispatches adhere to TN Medical Services Corporation (TNMSC) standard cold-chain (2°C – 8°C) protocol.
            </p>
          </div>
        </div>
      </div>

      {/* INTER-HOSPITAL SUPPLY TRANSFER MODAL */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-teal-700" />
                  Inter-Facility Emergency Supply Dispatch Protocol
                </h3>
                <p className="text-xs text-slate-500">Authorized Logistics Jurisdiction: {districtName} District</p>
              </div>
              <button 
                onClick={() => setShowTransferModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {transferSuccessMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold space-y-2">
                <div>{transferSuccessMsg}</div>
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" /> Notification transmitted to Receiving Medical Officer.
                </div>
              </div>
            ) : (
              <form onSubmit={handleDispatch} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Essential Medical Supply</label>
                  <select 
                    value={selectedSupply} 
                    onChange={(e) => setSelectedSupply(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-bold outline-none focus:border-teal-600 cursor-pointer"
                  >
                    {emergencySupplies.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.category}) • Stock: {s.totalStock} {s.unit} [{s.status}]
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Source Hospital / Store</label>
                    <select 
                      value={sourceHospital} 
                      onChange={(e) => setSourceHospital(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium outline-none focus:border-teal-600 cursor-pointer"
                    >
                      <option value={`${districtName} Government Medical College Hospital`}>{districtName} Govt Medical College (Central HQ)</option>
                      <option value="District Central Medical Store">District Central Medical Store</option>
                      <option value="Taluk Headquarters Hospital">Taluk Headquarters Hospital</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Destination Facility</label>
                    <select 
                      value={destHospital} 
                      onChange={(e) => setDestHospital(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium outline-none focus:border-teal-600 cursor-pointer"
                    >
                      <option value="Primary Health Centre (PHC) North">Primary Health Centre (PHC) North (Priority Cluster)</option>
                      <option value="Primary Health Centre (PHC) South">Primary Health Centre (PHC) South (Buffer Replenishment)</option>
                      <option value="Taluk Headquarters Hospital">Taluk Headquarters Hospital</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Quantity to Dispatch</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="1000" 
                      value={transferUnits} 
                      onChange={(e) => setTransferUnits(Number(e.target.value))}
                      required 
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-black outline-none focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Logistics Transport Mode</label>
                    <select 
                      value={priority} 
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium outline-none focus:border-teal-600 cursor-pointer"
                    >
                      <option value="Emergency Cold-Chain">Emergency Cold-Chain Courier (Priority 1)</option>
                      <option value="Rapid Transit Ambulance">108 Rapid Transit Ambulance (Priority 2)</option>
                      <option value="Scheduled Buffer">Scheduled District Buffer Shuttle</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                  ⚠️ Authorizing this emergency transfer logs a digital dispatch manifest directly into the State TNMSC Health Portal.
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowTransferModal(false)}
                    className="px-4 py-2.5 text-slate-600 hover:text-slate-900 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Authorize & Dispatch Courier
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
