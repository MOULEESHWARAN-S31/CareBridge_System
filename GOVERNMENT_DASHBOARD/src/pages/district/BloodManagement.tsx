import { useState, useMemo } from 'react';
import { 
  Droplet, AlertTriangle, CheckCircle2, 
  Send, Download, Heart, BellRing
} from 'lucide-react';
import { useHealthData } from '../../context/HealthDataContext';

interface BloodBankInventory {
  id: string;
  facilityName: string;
  facilityType: string;
  taluk: string;
  contactNumber: string;
  aPositive: number;
  aNegative: number;
  bPositive: number;
  bNegative: number;
  abPositive: number;
  abNegative: number;
  oPositive: number;
  oNegative: number;
  platelets: number;
  plasma: number;
  lastUpdated: string;
}

const MOCK_DISTRICT_BLOOD_BANKS: BloodBankInventory[] = [
  {
    id: 'bb-01',
    facilityName: 'Mohan Kumaramangalam MCH Regional Blood Centre',
    facilityType: 'Government Medical College Hospital',
    taluk: 'Salem Urban',
    contactNumber: '0427-2416001',
    aPositive: 48,
    aNegative: 6,
    bPositive: 52,
    bNegative: 2, // Critical shortage
    abPositive: 18,
    abNegative: 3,
    oPositive: 64,
    oNegative: 4,
    platelets: 38,
    plasma: 72,
    lastUpdated: '10 mins ago'
  },
  {
    id: 'bb-02',
    facilityName: 'Government District Headquarter Hospital Blood Bank',
    facilityType: 'District HQ Hospital',
    taluk: 'Salem Urban',
    contactNumber: '0427-2453000',
    aPositive: 22,
    aNegative: 4,
    bPositive: 30,
    bNegative: 1, // Critical
    abPositive: 9,
    abNegative: 2,
    oPositive: 35,
    oNegative: 3,
    platelets: 14,
    plasma: 40,
    lastUpdated: '25 mins ago'
  },
  {
    id: 'bb-03',
    facilityName: 'Attur Sub-District Hospital Blood Storage Center',
    facilityType: 'Sub-District Hospital',
    taluk: 'Attur',
    contactNumber: '04282-240100',
    aPositive: 12,
    aNegative: 2,
    bPositive: 16,
    bNegative: 3,
    abPositive: 4,
    abNegative: 1,
    oPositive: 19,
    oNegative: 2,
    platelets: 6,
    plasma: 18,
    lastUpdated: '1 hour ago'
  },
  {
    id: 'bb-04',
    facilityName: 'Mettur Dam Government Hospital Blood Unit',
    facilityType: 'Taluk Hospital',
    taluk: 'Mettur',
    contactNumber: '04298-242200',
    aPositive: 8,
    aNegative: 1,
    bPositive: 11,
    bNegative: 0, // Stockout
    abPositive: 3,
    abNegative: 0,
    oPositive: 14,
    oNegative: 1,
    platelets: 4,
    plasma: 12,
    lastUpdated: '40 mins ago'
  }
];

export default function BloodManagement() {
  const { districtName, addAuditLog } = useHealthData();
  const [bloodBanks] = useState<BloodBankInventory[]>(MOCK_DISTRICT_BLOOD_BANKS);
  
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealBloodGroup, setAppealBloodGroup] = useState('B-');
  const [appealFacility, setAppealFacility] = useState('Mohan Kumaramangalam MCH Regional Blood Centre');
  const [appealUrgency, setAppealUrgency] = useState('CRITICAL');
  const [appealMessage, setAppealMessage] = useState('Urgent requirement for B-Negative voluntary blood donors for emergency surgical and thalassemia cases at Salem MCH Blood Bank.');
  const [notification, setNotification] = useState<string | null>(null);

  // Aggregated totals across all banks
  const totals = useMemo(() => {
    return bloodBanks.reduce(
      (acc, curr) => ({
        aPos: acc.aPos + curr.aPositive,
        aNeg: acc.aNeg + curr.aNegative,
        bPos: acc.bPos + curr.bPositive,
        bNeg: acc.bNeg + curr.bNegative,
        abPos: acc.abPos + curr.abPositive,
        abNeg: acc.abNeg + curr.abNegative,
        oPos: acc.oPos + curr.oPositive,
        oNeg: acc.oNeg + curr.oNegative,
        platelets: acc.platelets + curr.platelets,
        plasma: acc.plasma + curr.plasma,
        totalUnits: acc.totalUnits + (curr.aPositive + curr.aNegative + curr.bPositive + curr.bNegative + curr.abPositive + curr.abNegative + curr.oPositive + curr.oNegative)
      }),
      { aPos: 0, aNeg: 0, bPos: 0, bNeg: 0, abPos: 0, abNeg: 0, oPos: 0, oNeg: 0, platelets: 0, plasma: 0, totalUnits: 0 }
    );
  }, [bloodBanks]);

  const handleBroadcastAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    addAuditLog(
      `Voluntary Donor Appeal Broadcasted: ${appealBloodGroup} blood for ${appealFacility}`,
      'Blood Coordination',
      `Urgency: ${appealUrgency}, District: ${districtName || 'Salem'}`
    );

    setNotification(`Donor Appeal for ${appealBloodGroup} sent to 4,200 eligible voluntary donors via CareBridge Patient App.`);
    setShowAppealModal(false);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleExportCSV = () => {
    const headers = ['Facility Name', 'Taluk', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Platelets', 'Plasma', 'Total Units'];
    const rows = bloodBanks.map(b => [
      `"${b.facilityName}"`,
      `"${b.taluk}"`,
      b.aPositive,
      b.aNegative,
      b.bPositive,
      b.bNegative,
      b.abPositive,
      b.abNegative,
      b.oPositive,
      b.oNegative,
      b.platelets,
      b.plasma,
      b.aPositive + b.aNegative + b.bPositive + b.bNegative + b.abPositive + b.abNegative + b.oPositive + b.oNegative
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `District_${districtName || 'Salem'}_Blood_Inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog('Exported District Blood Bank Inventory', 'Blood Coordination', 'CSV Download');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-red-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                DISTRICT BLOOD BANK GRID
              </span>
              <span className="text-xs text-slate-300">
                {districtName || 'Salem'} Transfusion Network
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Blood Bank & Emergency Unit Coordination
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Track whole blood, platelets, and plasma inventories across all district government storage centers. Dispatch privacy-compliant voluntary donor appeals during acute shortages.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur border border-white/10 transition-colors"
            >
              <Download className="w-4 h-4 text-rose-300" />
              Export CSV
            </button>
            <button
              onClick={() => setShowAppealModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition-all"
            >
              <BellRing className="w-4 h-4" />
              Broadcast Donor Appeal
            </button>
          </div>
        </div>

        {/* Aggregated Blood Group Summary Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
            <span className="text-xs font-semibold text-slate-300">A+</span>
            <p className="text-lg font-bold text-white mt-0.5">{totals.aPos}</p>
            <span className="text-[10px] text-emerald-400">Stable</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
            <span className="text-xs font-semibold text-slate-300">A-</span>
            <p className="text-lg font-bold text-white mt-0.5">{totals.aNeg}</p>
            <span className="text-[10px] text-amber-400">Moderate</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
            <span className="text-xs font-semibold text-slate-300">B+</span>
            <p className="text-lg font-bold text-white mt-0.5">{totals.bPos}</p>
            <span className="text-[10px] text-emerald-400">Stable</span>
          </div>
          <div className="bg-rose-500/20 rounded-xl p-2.5 text-center border border-rose-500/40">
            <span className="text-xs font-semibold text-rose-300">B-</span>
            <p className="text-lg font-bold text-rose-300 mt-0.5">{totals.bNeg}</p>
            <span className="text-[10px] text-rose-400 font-bold">Critical (6)</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
            <span className="text-xs font-semibold text-slate-300">AB+</span>
            <p className="text-lg font-bold text-white mt-0.5">{totals.abPos}</p>
            <span className="text-[10px] text-emerald-400">Stable</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
            <span className="text-xs font-semibold text-slate-300">AB-</span>
            <p className="text-lg font-bold text-white mt-0.5">{totals.abNeg}</p>
            <span className="text-[10px] text-amber-400">Low (6)</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/10">
            <span className="text-xs font-semibold text-slate-300">O+</span>
            <p className="text-lg font-bold text-white mt-0.5">{totals.oPos}</p>
            <span className="text-[10px] text-emerald-400">Stable</span>
          </div>
          <div className="bg-amber-500/20 rounded-xl p-2.5 text-center border border-amber-500/40">
            <span className="text-xs font-semibold text-amber-300">O-</span>
            <p className="text-lg font-bold text-amber-300 mt-0.5">{totals.oNeg}</p>
            <span className="text-[10px] text-amber-400">Low (10)</span>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {/* Critical Shortage Warning Banner */}
      {totals.bNeg < 10 && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                Critical B-Negative Stock Shortage in {districtName || 'Salem'} ({totals.bNeg} units remaining)
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                Mettur GH has 0 units and Salem MCH has 2 units remaining. State Blood Transfusion Council emergency dispatch or voluntary donor broadcast recommended.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setAppealBloodGroup('B-');
              setShowAppealModal(true);
            }}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold whitespace-nowrap shadow-sm"
          >
            Appeal Donors
          </button>
        </div>
      )}

      {/* Inventory by Facility Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              District Blood Banks & Storage Facilities
            </h3>
          </div>
          <div className="text-xs text-slate-500">
            Total Whole Blood Available: <span className="font-bold text-slate-900 dark:text-white">{totals.totalUnits} units</span> | Platelets: <span className="font-bold">{totals.platelets}</span> | FFP: <span className="font-bold">{totals.plasma}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Blood Bank Facility</th>
                <th className="py-3 px-4">Taluk</th>
                <th className="py-3 px-3 text-center">A+</th>
                <th className="py-3 px-3 text-center">A-</th>
                <th className="py-3 px-3 text-center">B+</th>
                <th className="py-3 px-3 text-center text-rose-600 font-bold">B-</th>
                <th className="py-3 px-3 text-center">AB+</th>
                <th className="py-3 px-3 text-center">AB-</th>
                <th className="py-3 px-3 text-center">O+</th>
                <th className="py-3 px-3 text-center text-amber-600 font-bold">O-</th>
                <th className="py-3 px-3 text-center">Platelets</th>
                <th className="py-3 px-3 text-center">Plasma</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {bloodBanks.map(bank => (
                <tr key={bank.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{bank.facilityName}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{bank.facilityType}</span>
                      <span>?</span>
                      <span className="font-mono">{bank.contactNumber}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300">{bank.taluk}</td>
                  <td className="py-3 px-3 text-center font-semibold text-slate-900 dark:text-white">{bank.aPositive}</td>
                  <td className="py-3 px-3 text-center text-xs font-medium text-slate-700 dark:text-slate-300">{bank.aNegative}</td>
                  <td className="py-3 px-3 text-center font-semibold text-slate-900 dark:text-white">{bank.bPositive}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      bank.bNegative === 0 ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                      bank.bNegative <= 2 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      'text-slate-800 dark:text-slate-200'
                    }`}>
                      {bank.bNegative}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center text-xs font-medium text-slate-700 dark:text-slate-300">{bank.abPositive}</td>
                  <td className="py-3 px-3 text-center text-xs font-medium text-slate-700 dark:text-slate-300">{bank.abNegative}</td>
                  <td className="py-3 px-3 text-center font-semibold text-slate-900 dark:text-white">{bank.oPositive}</td>
                  <td className="py-3 px-3 text-center text-xs font-medium text-amber-600 dark:text-amber-400">{bank.oNegative}</td>
                  <td className="py-3 px-3 text-center text-xs font-medium text-slate-700 dark:text-slate-300">{bank.platelets} u</td>
                  <td className="py-3 px-3 text-center text-xs font-medium text-slate-700 dark:text-slate-300">{bank.plasma} u</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setAppealFacility(bank.facilityName);
                        setShowAppealModal(true);
                      }}
                      className="px-2.5 py-1 text-xs rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 font-medium inline-flex items-center gap-1"
                    >
                      <BellRing className="w-3 h-3" /> Appeal
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Broadcast Donor Appeal Modal */}
      {showAppealModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Broadcast Voluntary Donor Appeal
                </h3>
              </div>
              <button
                onClick={() => setShowAppealModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBroadcastAppeal} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Blood Group Required *
                  </label>
                  <select
                    value={appealBloodGroup}
                    onChange={e => setAppealBloodGroup(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  >
                    <option value="B-">B Negative (Critical)</option>
                    <option value="O-">O Negative (Universal Donor)</option>
                    <option value="A-">A Negative</option>
                    <option value="AB-">AB Negative</option>
                    <option value="O+">O Positive</option>
                    <option value="B+">B Positive</option>
                    <option value="A+">A Positive</option>
                    <option value="Platelets">Single Donor Platelets (SDP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Target Facility *
                  </label>
                  <select
                    value={appealFacility}
                    onChange={e => setAppealFacility(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                  >
                    {bloodBanks.map(b => (
                      <option key={b.id} value={b.facilityName}>{b.facilityName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Appeal Urgency Level *
                </label>
                <div className="flex gap-3">
                  {['ROUTINE', 'URGENT', 'CRITICAL'].map((lvl) => (
                    <label key={lvl} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="urgency"
                        checked={appealUrgency === lvl}
                        onChange={() => setAppealUrgency(lvl)}
                      />
                      <span>{lvl}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Citizen Advisory Message (CareBridge Patient App & SMS)
                </label>
                <textarea
                  rows={3}
                  value={appealMessage}
                  onChange={e => setAppealMessage(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  * All broadcasts preserve citizen donor privacy. Only registered voluntary donors who opted in for blood alerts in {districtName || 'Salem'} will receive push notifications.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAppealModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-all"
                >
                  <Send className="w-4 h-4" />
                  Broadcast Appeal to Donors
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
