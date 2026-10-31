import { useState, useMemo } from 'react';
import { 
  Siren, ShieldCheck, Download, 
  Phone, AlertTriangle, CheckCircle2, Filter
} from 'lucide-react';
import { useHealthData } from '../../context/HealthDataContext';

interface StateBloodBankItem {
  id: string;
  bankName: string;
  facility: string;
  district: string;
  category: 'Government Medical College' | 'District Headquarters Hospital' | 'Red Cross Blood Centre';
  totalUnitsAvailable: number;
  criticalGroupShortages: string[];
  contactNumber: string;
  licenseValidUntil: string;
  operationalStatus: '24x7 Active' | 'Component Facility Only';
  inventoryBreakdown: {
    'A+': number;
    'A-': number;
    'B+': number;
    'B-': number;
    'O+': number;
    'O-': number;
    'AB+': number;
    'AB-': number;
  };
}

const STATEWIDE_BLOOD_BANKS: StateBloodBankItem[] = [
  {
    id: 'BB-SLM-01',
    bankName: 'Salem Govt Mohan Kumaramangalam MC Blood Bank',
    facility: 'Govt Medical College Hospital, Salem',
    district: 'Salem',
    category: 'Government Medical College',
    totalUnitsAvailable: 184,
    criticalGroupShortages: ['O-', 'AB-'],
    contactNumber: '0427-2453120',
    licenseValidUntil: '2028-12-31',
    operationalStatus: '24x7 Active',
    inventoryBreakdown: { 'A+': 34, 'A-': 8, 'B+': 42, 'B-': 6, 'O+': 72, 'O-': 2, 'AB+': 18, 'AB-': 2 }
  },
  {
    id: 'BB-CBE-01',
    bankName: 'Coimbatore Medical College Hospital Blood Centre',
    facility: 'Coimbatore MCH',
    district: 'Coimbatore',
    category: 'Government Medical College',
    totalUnitsAvailable: 240,
    criticalGroupShortages: ['B-'],
    contactNumber: '0422-2301393',
    licenseValidUntil: '2027-10-15',
    operationalStatus: '24x7 Active',
    inventoryBreakdown: { 'A+': 48, 'A-': 12, 'B+': 62, 'B-': 3, 'O+': 88, 'O-': 11, 'AB+': 22, 'AB-': 4 }
  },
  {
    id: 'BB-MDU-01',
    bankName: 'Madurai Govt Rajaji Hospital Blood Bank',
    facility: 'Govt Rajaji Hospital, Madurai',
    district: 'Madurai',
    category: 'Government Medical College',
    totalUnitsAvailable: 198,
    criticalGroupShortages: ['O-'],
    contactNumber: '0452-2532535',
    licenseValidUntil: '2028-04-20',
    operationalStatus: '24x7 Active',
    inventoryBreakdown: { 'A+': 38, 'A-': 10, 'B+': 55, 'B-': 7, 'O+': 74, 'O-': 1, 'AB+': 18, 'AB-': 5 }
  },
  {
    id: 'BB-CHN-01',
    bankName: 'Chennai Rajiv Gandhi Govt General Hospital Blood Centre',
    facility: 'RGGGH, Chennai',
    district: 'Chennai',
    category: 'Government Medical College',
    totalUnitsAvailable: 310,
    criticalGroupShortages: [],
    contactNumber: '044-25305000',
    licenseValidUntil: '2029-01-30',
    operationalStatus: '24x7 Active',
    inventoryBreakdown: { 'A+': 65, 'A-': 18, 'B+': 78, 'B-': 14, 'O+': 110, 'O-': 16, 'AB+': 32, 'AB-': 7 }
  },
  {
    id: 'BB-TRY-01',
    bankName: 'Tiruchirappalli Mahatma Gandhi Memorial GH Blood Bank',
    facility: 'MGM Govt Hospital, Trichy',
    district: 'Tiruchirappalli',
    category: 'District Headquarters Hospital',
    totalUnitsAvailable: 112,
    criticalGroupShortages: ['A-', 'AB-'],
    contactNumber: '0431-2412521',
    licenseValidUntil: '2027-06-18',
    operationalStatus: '24x7 Active',
    inventoryBreakdown: { 'A+': 22, 'A-': 1, 'B+': 34, 'B-': 5, 'O+': 44, 'O-': 4, 'AB+': 8, 'AB-': 0 }
  },
  {
    id: 'BB-VEL-01',
    bankName: 'Vellore Govt District Headquarters Hospital Blood Bank',
    facility: 'Govt Headquarters Hospital, Vellore',
    district: 'Vellore',
    category: 'District Headquarters Hospital',
    totalUnitsAvailable: 86,
    criticalGroupShortages: ['O-', 'B-'],
    contactNumber: '0416-2220450',
    licenseValidUntil: '2026-11-30',
    operationalStatus: '24x7 Active',
    inventoryBreakdown: { 'A+': 18, 'A-': 4, 'B+': 28, 'B-': 1, 'O+': 32, 'O-': 0, 'AB+': 7, 'AB-': 1 }
  }
];

export default function StateBlood() {
  const { districts, isOfflineMock } = useHealthData();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');

  const filtered = useMemo(() => {
    return STATEWIDE_BLOOD_BANKS.filter(b => {
      if (selectedDistrict !== 'ALL' && b.district !== selectedDistrict) return false;
      return true;
    });
  }, [selectedDistrict]);

  const totalUnits = filtered.reduce((sum, b) => sum + b.totalUnitsAvailable, 0);
  const totalBanks = filtered.length;
  const criticalDeficitCount = filtered.filter(b => b.criticalGroupShortages.length > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              State Admin Workspace • Blood Transfusion Council (TNSBTC)
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              isOfflineMock ? 'bg-amber-50 text-amber-700 border border-amber-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
            }`}>
              ● e-RaktKosh Verified Real-time Interface
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Siren className="w-5 h-5 text-teal-700" />
            <span>Statewide Blood Service & Rare Group Emergency Logistics</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Central monitoring of Tamil Nadu State Blood Transfusion Council bank networks, rare blood group shortages, and inter-district transfer logistics.
          </p>
        </div>

        <button 
          onClick={() => window.print()}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Transfusion Audit</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Units in Network</span>
            <Siren className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">{totalUnits} Units</div>
          <p className="text-[11px] text-slate-500 mt-1">Whole blood & components</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monitored Blood Centres</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalBanks} Centres</div>
          <p className="text-[11px] text-slate-500 mt-1">24x7 Government licensed</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deficit Blood Centres</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">{criticalDeficitCount} Centres</div>
          <p className="text-[11px] text-slate-500 mt-1">Rare group stockout active</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">State Red Cross Buffer</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">Optimal</div>
          <p className="text-[11px] text-slate-500 mt-1">Emergency reserves intact</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <Filter className="w-4 h-4 text-slate-400" />
        <div>
          <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Filter by District</label>
          <select 
            value={selectedDistrict} 
            onChange={e => setSelectedDistrict(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="ALL">All Revenue Districts</option>
            {districts.map(d => (
              <option key={d.name} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Blood Bank Registry Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Siren className="w-4 h-4 text-rose-700" />
            <span>State Blood Bank Directory & Real-time Group Inventory</span>
          </h2>
          <span className="text-xs font-bold text-slate-500">
            {filtered.length} licensed centres in view
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <th className="p-3">Centre & Facility</th>
                <th className="p-3">District</th>
                <th className="p-3 text-right">Total Units</th>
                <th className="p-3">A+</th>
                <th className="p-3">B+</th>
                <th className="p-3">O+</th>
                <th className="p-3">AB+</th>
                <th className="p-3">Rare Groups (A-, B-, O-, AB-)</th>
                <th className="p-3">Active Shortages</th>
                <th className="p-3">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{b.bankName}</div>
                    <div className="text-[11px] text-slate-500">{b.facility}</div>
                  </td>
                  <td className="p-3 font-semibold text-slate-700">{b.district}</td>
                  <td className="p-3 text-right font-black text-slate-900">{b.totalUnitsAvailable}</td>
                  <td className="p-3 font-mono font-bold text-slate-800">{b.inventoryBreakdown['A+']}</td>
                  <td className="p-3 font-mono font-bold text-slate-800">{b.inventoryBreakdown['B+']}</td>
                  <td className="p-3 font-mono font-bold text-slate-800">{b.inventoryBreakdown['O+']}</td>
                  <td className="p-3 font-mono font-bold text-slate-800">{b.inventoryBreakdown['AB+']}</td>
                  <td className="p-3 font-mono text-[11px] text-slate-600">
                    <span className={b.inventoryBreakdown['O-'] < 2 ? 'font-bold text-rose-600' : ''}>
                      O-({b.inventoryBreakdown['O-']})
                    </span>{' '}
                    <span>B-({b.inventoryBreakdown['B-']})</span>{' '}
                    <span>A-({b.inventoryBreakdown['A-']})</span>{' '}
                    <span>AB-({b.inventoryBreakdown['AB-']})</span>
                  </td>
                  <td className="p-3">
                    {b.criticalGroupShortages.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {b.criticalGroupShortages.map(g => (
                          <span key={g} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                            {g} Shortage
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Adequate
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-mono text-slate-600 text-[11px] flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{b.contactNumber}</span>
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
