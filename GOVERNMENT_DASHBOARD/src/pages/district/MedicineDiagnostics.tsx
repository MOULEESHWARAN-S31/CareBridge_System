import { useState, useMemo, type FormEvent } from 'react';
import { 
  Pill, AlertTriangle, CheckCircle2, 
  ArrowUpRight, Download, Search, 
  Send, Layers, PlusCircle
} from 'lucide-react';
import { useHealthData } from '../../context/HealthDataContext';
import { MEDICINE_INVENTORY_DATA, DIAGNOSTICS_DATA } from '../../data/mockData';

export default function MedicineDiagnostics() {
  const { districtName, facilities, addAuditLog } = useHealthData();
  const [activeTab, setActiveTab] = useState<'medicines' | 'diagnostics' | 'requisition'>('medicines');
  const [facilityFilter, setFacilityFilter] = useState<string>('ALL');
  const [stockStatusFilter, setStockStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // New Requisition Form State
  const [targetFacility, setTargetFacility] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemType, setItemType] = useState<'MEDICINE' | 'DIAGNOSTIC_KIT'>('MEDICINE');
  const [requestedQty, setRequestedQty] = useState('');
  const [urgency, setUrgency] = useState<'ROUTINE' | 'URGENT' | 'CRITICAL'>('URGENT');
  const [justification, setJustification] = useState('');

  // Scoped district facilities
  const districtFacilities = useMemo(() => {
    return facilities.filter(f => !districtName || districtName === 'ALL' || f.district === districtName);
  }, [facilities, districtName]);

  // Medicines filtered by district facility
  const districtMedicines = useMemo(() => {
    return MEDICINE_INVENTORY_DATA.filter(med => {
      const matchesFacility = facilityFilter === 'ALL' || med.facility === facilityFilter;
      const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            med.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStock = stockStatusFilter === 'ALL' || 
                           (stockStatusFilter === 'LOW' && med.status === 'Low') ||
                           (stockStatusFilter === 'CRITICAL' && med.status === 'Critical') ||
                           (stockStatusFilter === 'OPTIMAL' && med.status === 'Adequate');
      return matchesFacility && matchesSearch && matchesStock;
    });
  }, [facilityFilter, searchQuery, stockStatusFilter]);

  // Diagnostics filtered by district facility
  const districtDiagnostics = useMemo(() => {
    return DIAGNOSTICS_DATA.filter(diag => {
      const matchesFacility = facilityFilter === 'ALL' || diag.facility === facilityFilter;
      const matchesSearch = diag.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            diag.centreName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFacility && matchesSearch;
    });
  }, [facilityFilter, searchQuery]);

  // KPI aggregates
  const lowStockCount = useMemo(() => {
    return MEDICINE_INVENTORY_DATA.filter(m => m.status === 'Low' || m.status === 'Critical').length;
  }, []);

  const pendingDiagnosticTests = useMemo(() => {
    return districtDiagnostics.reduce((acc, curr) => acc + curr.pendingTestsToday, 0);
  }, [districtDiagnostics]);

  const handleCreateRequisition = (e: FormEvent) => {
    e.preventDefault();
    if (!itemName || !requestedQty) return;

    addAuditLog(
      `Stock Indent Raised: ${requestedQty} units of ${itemName} for ${targetFacility || 'District HQ'} [Urgency: ${urgency}]`,
      'Medicine & Diagnostics',
      `Target: ${targetFacility || 'District Pool'}, Justification: ${justification || 'Routine buffer replenishment'}`
    );

    setNotification(`Stock Requisition REQ-${Math.floor(1000 + Math.random() * 9000)} successfully submitted to TNMSC / District Drug Warehouse.`);
    setItemName('');
    setRequestedQty('');
    setJustification('');
    setTimeout(() => {
      setNotification(null);
      setActiveTab('medicines');
    }, 3000);
  };

  const handleExportCSV = () => {
    const headers = ['Medicine Name', 'Category', 'Facility', 'Available Qty', 'Min Threshold', 'Status', 'Days Remaining', 'Batch Expiry'];
    const rows = districtMedicines.map(m => [
      `"${m.name}"`,
      `"${m.category}"`,
      `"${m.facility}"`,
      m.availableQuantity,
      m.minimumStockThreshold,
      `"${m.status}"`,
      m.daysRemaining,
      `"${m.expiryDate}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `District_${districtName || 'Salem'}_Medicine_Stock_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog(`Exported Medicine Stock Sheet for ${districtName || 'District'}`, 'Medicine & Diagnostics', 'CSV Download');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                DISTRICT SUPPLY CHAIN & LABS
              </span>
              <span className="text-xs text-slate-300">
                {districtName || 'Salem'} Health Jurisdiction
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Medicine Inventory & Diagnostic Tracking
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Monitor drug buffer stocks across primary health centers, taluk hospitals, and laboratory diagnostic availability. Raise indents to TNMSC central warehouse.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur border border-white/10 transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              Export Stock CSV
            </button>
            <button
              onClick={() => setActiveTab('requisition')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-lg shadow-emerald-500/25 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              New Requisition
            </button>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-slate-400">Total Tracked Drugs</span>
            <p className="text-xl font-bold text-white mt-0.5">{MEDICINE_INVENTORY_DATA.length}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-rose-300">Low / Critical Stocks</span>
            <p className="text-xl font-bold text-rose-400 mt-0.5">{lowStockCount} items</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-amber-300">Expiring in 60 Days</span>
            <p className="text-xl font-bold text-amber-400 mt-0.5">3 batches</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-emerald-300">Pending Lab Tests</span>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">{pendingDiagnosticTests} results</p>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center justify-between animate-fade-in shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('medicines')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'medicines'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Pill className="w-4 h-4" />
            Essential Medicines ({districtMedicines.length})
          </button>
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'diagnostics'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Diagnostic Kits & Labs ({districtDiagnostics.length})
          </button>
          <button
            onClick={() => setActiveTab('requisition')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'requisition'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Send className="w-4 h-4" />
            Raise Stock Indent
          </button>
        </div>

        {/* Filter / Search Bar */}
        {activeTab !== 'requisition' && (
          <div className="hidden lg:flex items-center gap-3 pb-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search drug or kit..."
                className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>
            <select
              value={facilityFilter}
              onChange={e => setFacilityFilter(e.target.value)}
              className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-slate-700 dark:text-slate-300"
            >
              <option value="ALL">All Facilities</option>
              {districtFacilities.map(f => (
                <option key={f.id} value={f.name}>{f.name}</option>
              ))}
            </select>
            {activeTab === 'medicines' && (
              <select
                value={stockStatusFilter}
                onChange={e => setStockStatusFilter(e.target.value)}
                className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">All Stock Levels</option>
                <option value="LOW">Low Stock</option>
                <option value="CRITICAL">Critical Stock</option>
                <option value="OPTIMAL">Adequate</option>
              </select>
            )}
          </div>
        )}
      </div>

      {/* Tab 1: Medicines Table */}
      {activeTab === 'medicines' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-4">Medicine & Formulation</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Facility</th>
                  <th className="py-3 px-4">Available Qty</th>
                  <th className="py-3 px-4">Min Buffer</th>
                  <th className="py-3 px-4">Days Left</th>
                  <th className="py-3 px-4">Batch Expiry</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Indent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {districtMedicines.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-500 text-sm">
                      No medicines match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  districtMedicines.map(med => (
                    <tr key={med.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{med.name}</div>
                        <div className="text-xs text-slate-400 font-mono">Batch: {med.batchNumber}</div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                          {med.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300">{med.facility}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {med.availableQuantity.toLocaleString()} {med.unit}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500">{med.minimumStockThreshold.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-semibold ${
                          med.daysRemaining <= 7 ? 'text-rose-600 dark:text-rose-400' :
                          med.daysRemaining <= 15 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'
                        }`}>
                          {med.daysRemaining} days
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500 font-mono">{med.expiryDate}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                          med.status === 'Adequate' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                          med.status === 'Low' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' :
                          'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}>
                          {med.status === 'Adequate' && <CheckCircle2 className="w-3 h-3" />}
                          {med.status !== 'Adequate' && <AlertTriangle className="w-3 h-3" />}
                          {med.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setItemName(med.name);
                            setTargetFacility(med.facility);
                            setRequestedQty('1000');
                            setActiveTab('requisition');
                          }}
                          className="px-2.5 py-1 text-xs rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 font-medium inline-flex items-center gap-1"
                        >
                          Indent <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Diagnostics Table */}
      {activeTab === 'diagnostics' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-4">Diagnostic Test / Equipment</th>
                  <th className="py-3 px-4">Facility / Center</th>
                  <th className="py-3 px-4">Equipment Status</th>
                  <th className="py-3 px-4">Daily Processing Cap</th>
                  <th className="py-3 px-4">Pending Tests Today</th>
                  <th className="py-3 px-4">Turnaround Time</th>
                  <th className="py-3 px-4">Queue Status</th>
                  <th className="py-3 px-4 text-right">Requisition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {districtDiagnostics.map(diag => (
                  <tr key={diag.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{diag.testName}</div>
                      <div className="text-xs text-slate-400 font-mono">ID: {diag.id}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-medium text-slate-900 dark:text-white">{diag.facility}</span>
                      <div className="text-[11px] text-slate-400">{diag.centreName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        diag.equipmentStatus === 'Operational' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                        'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {diag.equipmentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300">{diag.dailyCapacity} / day</td>
                    <td className="py-3 px-4 text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {diag.pendingTestsToday} tests
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300">{diag.turnaroundTimeHours} hrs</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                        diag.status === 'Available' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                        'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}>
                        {diag.status === 'Available' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {diag.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setItemName(`${diag.testName} Reagent Kits`);
                          setTargetFacility(diag.facility);
                          setItemType('DIAGNOSTIC_KIT');
                          setRequestedQty('250');
                          setActiveTab('requisition');
                        }}
                        className="px-2.5 py-1 text-xs rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-950/50 dark:text-teal-300 font-medium inline-flex items-center gap-1"
                      >
                        Requisition <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Requisition Form */}
      {activeTab === 'requisition' && (
        <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Send className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Raise District Medical Requisition to Central TNMSC Warehouse
            </h3>
          </div>

          <form onSubmit={handleCreateRequisition} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Requisition Type *
                </label>
                <select
                  value={itemType}
                  onChange={e => setItemType(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                >
                  <option value="MEDICINE">Essential Drug / Pharmaceutical</option>
                  <option value="DIAGNOSTIC_KIT">Diagnostic Reagent Kit / Consumable</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Target Facility *
                </label>
                <select
                  value={targetFacility}
                  onChange={e => setTargetFacility(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                >
                  <option value="">District Central Pool ({districtName || 'Salem'})</option>
                  {districtFacilities.map(f => (
                    <option key={f.id} value={f.name}>{f.name} ({f.taluk})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Item Description & Strength *
              </label>
              <input
                type="text"
                required
                value={itemName}
                onChange={e => setItemName(e.target.value)}
                placeholder="e.g. Paracetamol 500mg, Ceftriaxone 1g, Dengue NS1 Ag Rapid Kit"
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Requested Quantity (Units) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={requestedQty}
                  onChange={e => setRequestedQty(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Urgency Level *
                </label>
                <select
                  value={urgency}
                  onChange={e => setUrgency(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                >
                  <option value="ROUTINE">Routine Replenishment (10-14 days)</option>
                  <option value="URGENT">Urgent Stockout Mitigation (48-72 hours)</option>
                  <option value="CRITICAL">Critical Emergency (Immediate 24-hour dispatch)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Clinical / Epidemic Justification
              </label>
              <textarea
                rows={3}
                value={justification}
                onChange={e => setJustification(e.target.value)}
                placeholder="State the underlying cause for surge demand (e.g. Seasonal dengue fever cluster in Omalur block or buffer depletion)."
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setActiveTab('medicines')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all"
              >
                <Send className="w-4 h-4" />
                Submit Indent to TNMSC
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
