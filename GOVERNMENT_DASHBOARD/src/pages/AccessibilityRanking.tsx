import { useState } from 'react';
import { 
  Award, TrendingUp, BarChart2, ShieldCheck
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useHealthData } from '../context/HealthDataContext';

export default function AccessibilityRanking() {
  const { districts, schemes } = useHealthData();
  const [selectedDistrictTab, setSelectedDistrictTab] = useState<string>('Salem');

  // Sorted Leaderboard Ranking
  const rankedDistricts = [...districts].sort((a, b) => b.accessibilityScore - a.accessibilityScore);
  const selectedDistrictData = districts.find(d => d.name === selectedDistrictTab) || districts[0];

  const pillarChartData = [
    { pillar: 'Hospital Coverage', score: selectedDistrictData.scoreBreakdown.facility, color: '#10b981' },
    { pillar: 'Doctor Availability', score: selectedDistrictData.scoreBreakdown.doctor, color: '#3b82f6' },
    { pillar: 'Medicine Stock', score: selectedDistrictData.scoreBreakdown.medicine, color: '#06b6d4' },
    { pillar: 'Diagnostics Suite', score: selectedDistrictData.scoreBreakdown.diagnostics, color: '#8b5cf6' },
    { pillar: 'Bed Matrix', score: selectedDistrictData.scoreBreakdown.beds || 82, color: '#f59e0b' },
    { pillar: 'Emergency Readiness', score: selectedDistrictData.scoreBreakdown.emergency || 88, color: '#ec4899' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span>Healthcare Accessibility & District Performance Ranking</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Composite 0–100 Accessibility Index focusing on hospital capacities and underserved health delivery gaps across all 8 districts
          </p>
        </div>

        <div className="text-xs bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-emerald-800 font-medium">
          Statewide Average Score: <strong className="text-emerald-700 font-mono">81.5 / 100</strong>
        </div>
      </div>

      {/* District Performance Leaderboard Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Statewide District Performance Leaderboard</span>
            </h3>
            <p className="text-[11px] text-slate-500">Rankings determined by core healthcare infrastructure pillars</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
            Tamil Nadu Health Index 2026
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-3">District</th>
                <th className="py-3 px-3">Accessibility Score</th>
                <th className="py-3 px-3">Active Hospitals / PHCs</th>
                <th className="py-3 px-3">Doctor Coverage</th>
                <th className="py-3 px-3">Medicine Stock Health</th>
                <th className="py-3 px-3">Status Tier</th>
                <th className="py-3 px-3 text-right">Drilldown</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rankedDistricts.map((dist, idx) => {
                const rankNum = idx + 1;
                const statusBadge = dist.accessibilityScore >= 90
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : dist.accessibilityScore >= 75
                  ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                  : dist.accessibilityScore >= 70
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200';

                const tierName = dist.accessibilityScore >= 90
                  ? 'Excellent'
                  : dist.accessibilityScore >= 75
                  ? 'Good'
                  : dist.accessibilityScore >= 70
                  ? 'Attention Required'
                  : 'Critical Action';

                return (
                  <tr 
                    key={dist.id}
                    onClick={() => setSelectedDistrictTab(dist.name)}
                    className={`hover:bg-slate-50 transition-colors cursor-pointer group ${
                      selectedDistrictTab === dist.name ? 'bg-slate-50/80' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        rankNum === 1 
                          ? 'bg-amber-500 text-white' 
                          : rankNum === 2
                          ? 'bg-slate-400 text-white'
                          : rankNum === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {rankNum}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 group-hover:text-emerald-700 block">{dist.name}</span>
                      <span className="text-[10px] text-slate-500">{(dist.population / 100000).toFixed(1)} Lakh Citizen Base</span>
                    </td>

                    <td className="py-3 px-3 font-mono font-black text-sm text-emerald-700">
                      {dist.accessibilityScore} / 100
                    </td>

                    <td className="py-3 px-3 text-slate-700 font-semibold">
                      {dist.activeHospitals} Facilities
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-slate-900 font-mono font-bold">{dist.doctorsCount} Doctors</span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`font-semibold ${dist.medicineStockAlerts > 50 ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {dist.medicineStockAlerts} Shortage Alerts
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${statusBadge}`}>
                        {tierName}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDistrictTab(dist.name);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-600 hover:text-white rounded-lg text-slate-700 text-xs font-semibold transition-colors border border-slate-200 cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pillar Score Breakdown & Scheme Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pillar Breakdown Chart for Selected District */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-emerald-600" />
                  <span>Accessibility Score Pillar Breakdown: {selectedDistrictData.name}</span>
                </h3>
                <p className="text-[11px] text-slate-500">Component analysis of the 0–100 accessibility score</p>
              </div>
              <span className="text-base font-black text-emerald-700 font-mono bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                {selectedDistrictData.accessibilityScore}/100
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pillarChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" fontSize={10} domain={[0, 100]} />
                  <YAxis dataKey="pillar" type="category" stroke="#64748b" fontSize={10} width={130} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(val: any) => [`${val} / 100`, 'Score']}
                  />
                  <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                    {pillarChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-[11px] text-slate-600 mt-2">
            <span>Primary Strength: <strong>Hospital Coverage ({selectedDistrictData.scoreBreakdown.facility}%)</strong></span>
            <span>Doctor Coverage: <strong className="text-emerald-700">{selectedDistrictData.scoreBreakdown.doctor}%</strong></span>
          </div>
        </div>

        {/* Government Healthcare Schemes Monitoring */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Government Scheme Delivery Monitor</span>
              </h3>
              <p className="text-[11px] text-slate-500">PM-JAY, CMCHIS, JSSK Maternal & Mission Indradhanush</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
              Direct Beneficiary Stack
            </span>
          </div>

          <div className="space-y-3">
            {schemes.map((sch) => (
              <div key={sch.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 block">{sch.schemeCode} • {sch.category}</span>
                    <h4 className="text-xs font-bold text-slate-900">{sch.name}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                    {sch.districtCoveragePercentage}% Coverage
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Beneficiaries:</span>
                    <strong className="text-slate-900 font-mono">{sch.beneficiariesCount.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Budget Utilized:</span>
                    <strong className="text-emerald-700 font-mono">₹{sch.spentBudgetCr} Cr / ₹{sch.allocatedBudgetCr} Cr</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
