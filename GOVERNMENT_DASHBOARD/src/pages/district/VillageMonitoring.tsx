import { useState, useMemo } from 'react';
import { 
  MapPin, AlertTriangle, ShieldCheck, 
  Activity, Filter, CheckCircle2
} from 'lucide-react';
import { useHealthData } from '../../context/HealthDataContext';

interface VillageHealthIndicator {
  villageId: string;
  villageName: string;
  block: string;
  population: number;
  activeSyndromicCases: number;
  dominantCondition: string;
  anmInCharge: string;
  ashaWorkersCount: number;
  waterQualityIndex: 'Safe' | 'Attention' | 'Contaminated';
  vaccinationCoveragePercent: number;
  lastHealthCampDate: string;
  riskCategory: 'High Risk' | 'Moderate' | 'Low Risk';
}

const DISTRICT_VILLAGES_MONITORING: VillageHealthIndicator[] = [
  { villageId: 'VIL-SLM-01', villageName: 'Edappadi Town East', block: 'Edappadi', population: 4200, activeSyndromicCases: 28, dominantCondition: 'Dengue / Vector Borne', anmInCharge: 'K. Saradha', ashaWorkersCount: 4, waterQualityIndex: 'Attention', vaccinationCoveragePercent: 91, lastHealthCampDate: '2026-09-12', riskCategory: 'High Risk' },
  { villageId: 'VIL-SLM-02', villageName: 'Mettur Dam Colony', block: 'Mettur', population: 5800, activeSyndromicCases: 14, dominantCondition: 'Acute Gastroenteritis', anmInCharge: 'R. Revathi', ashaWorkersCount: 6, waterQualityIndex: 'Safe', vaccinationCoveragePercent: 96, lastHealthCampDate: '2026-10-04', riskCategory: 'Moderate' },
  { villageId: 'VIL-SLM-03', villageName: 'Omalur North Hamlet', block: 'Omalur', population: 3100, activeSyndromicCases: 8, dominantCondition: 'Fever of Unknown Origin', anmInCharge: 'M. Kavitha', ashaWorkersCount: 3, waterQualityIndex: 'Safe', vaccinationCoveragePercent: 94, lastHealthCampDate: '2026-08-20', riskCategory: 'Low Risk' },
  { villageId: 'VIL-SLM-04', villageName: 'Yercaud Tribal Settlement', block: 'Yercaud', population: 1850, activeSyndromicCases: 19, dominantCondition: 'Respiratory / Scrub Typhus', anmInCharge: 'S. Selvi', ashaWorkersCount: 2, waterQualityIndex: 'Safe', vaccinationCoveragePercent: 88, lastHealthCampDate: '2026-07-15', riskCategory: 'High Risk' },
  { villageId: 'VIL-SLM-05', villageName: 'Attur Rural South', block: 'Attur', population: 4900, activeSyndromicCases: 12, dominantCondition: 'Viral Fever', anmInCharge: 'P. Uma', ashaWorkersCount: 5, waterQualityIndex: 'Safe', vaccinationCoveragePercent: 97, lastHealthCampDate: '2026-09-28', riskCategory: 'Low Risk' },
  { villageId: 'VIL-SLM-06', villageName: 'Gangavalli Panchayat', block: 'Gangavalli', population: 3600, activeSyndromicCases: 9, dominantCondition: 'Hypertension Screening', anmInCharge: 'A. Malathi', ashaWorkersCount: 4, waterQualityIndex: 'Safe', vaccinationCoveragePercent: 95, lastHealthCampDate: '2026-10-24', riskCategory: 'Low Risk' },
  { villageId: 'VIL-SLM-07', villageName: 'Sankari West', block: 'Sankari', population: 4100, activeSyndromicCases: 16, dominantCondition: 'Acute Diarrheal', anmInCharge: 'N. Chitra', ashaWorkersCount: 4, waterQualityIndex: 'Attention', vaccinationCoveragePercent: 93, lastHealthCampDate: '2026-08-30', riskCategory: 'Moderate' }
];

export default function VillageMonitoring() {
  const { districtName, isOfflineMock } = useHealthData();
  const [selectedBlock, setSelectedBlock] = useState<string>('ALL');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');

  const filtered = useMemo(() => {
    return DISTRICT_VILLAGES_MONITORING.filter(v => {
      if (selectedBlock !== 'ALL' && v.block !== selectedBlock) return false;
      if (filterRisk !== 'ALL' && v.riskCategory !== filterRisk) return false;
      return true;
    });
  }, [selectedBlock, filterRisk]);

  const totalVillages = filtered.length;
  const highRiskCount = filtered.filter(v => v.riskCategory === 'High Risk').length;
  const totalCases = filtered.reduce((sum, v) => sum + v.activeSyndromicCases, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-teal-600" />
              District Admin Workspace • Grassroots Monitoring
            </span>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {districtName} District
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              isOfflineMock ? 'bg-amber-50 text-amber-700 border border-amber-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
            }`}>
              ● Grassroots ANM/ASHA Ground Telemetry (Non-AI)
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-700" />
            <span>Village & Block Public Health Monitoring (Non-AI)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ground-level surveillance metrics from village health sub-centres (HSC), ANM workers, and ASHA community health networks across {districtName} district.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monitored Villages</span>
            <MapPin className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalVillages}</div>
          <p className="text-[11px] text-slate-500 mt-1">Active rural revenue units</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">High Risk Clusters</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">{highRiskCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Require immediate health camp</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Syndromic Cases</span>
            <Activity className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">{totalCases}</div>
          <p className="text-[11px] text-slate-500 mt-1">Reported by ANM registers</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Vaccination Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">94.1%</div>
          <p className="text-[11px] text-slate-500 mt-1">UIP childhood coverage</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <Filter className="w-4 h-4 text-slate-400" />
        <div>
          <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Block Filter</label>
          <select 
            value={selectedBlock} 
            onChange={e => setSelectedBlock(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="ALL">All Blocks in {districtName}</option>
            <option value="Edappadi">Edappadi Block</option>
            <option value="Mettur">Mettur Block</option>
            <option value="Omalur">Omalur Block</option>
            <option value="Yercaud">Yercaud Block (Tribal)</option>
            <option value="Attur">Attur Block</option>
            <option value="Gangavalli">Gangavalli Block</option>
            <option value="Sankari">Sankari Block</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Risk Stratification</label>
          <select 
            value={filterRisk} 
            onChange={e => setFilterRisk(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="High Risk">High Risk (Immediate Camp Required)</option>
            <option value="Moderate">Moderate Risk</option>
            <option value="Low Risk">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Village Telemetry Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-700" />
            <span>Village Health Sub-Centre (HSC) Telemetry Register</span>
          </h2>
          <span className="text-xs font-bold text-slate-500">
            {filtered.length} village clusters reported
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <th className="p-3">Village / Cluster</th>
                <th className="p-3">Block</th>
                <th className="p-3 text-right">Population</th>
                <th className="p-3 text-right">Active Cases</th>
                <th className="p-3">Dominant Syndrome</th>
                <th className="p-3">ANM In-Charge</th>
                <th className="p-3 text-right">ASHAs</th>
                <th className="p-3">Water Index</th>
                <th className="p-3">Risk Level</th>
                <th className="p-3">Last Camp Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map(v => (
                <tr key={v.villageId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-900">{v.villageName}</td>
                  <td className="p-3 font-semibold text-slate-700">{v.block}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-800">{v.population.toLocaleString()}</td>
                  <td className="p-3 text-right font-black text-amber-700">{v.activeSyndromicCases}</td>
                  <td className="p-3 font-medium text-slate-800">{v.dominantCondition}</td>
                  <td className="p-3 font-semibold text-teal-800">{v.anmInCharge}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-700">{v.ashaWorkersCount}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      v.waterQualityIndex === 'Safe' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {v.waterQualityIndex}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      v.riskCategory === 'High Risk' ? 'bg-rose-100 text-rose-800' :
                      v.riskCategory === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {v.riskCategory}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-500 text-[11px]">{v.lastHealthCampDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
