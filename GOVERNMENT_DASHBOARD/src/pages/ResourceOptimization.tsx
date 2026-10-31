import { useState } from 'react';
import { 
  Cpu, ArrowRightLeft, Stethoscope, 
  BedDouble, Pill, CheckCircle2, 
  Zap, Building2
} from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';

interface OptimizationRecommendation {
  id: string;
  category: 'STAFF' | 'BEDS' | 'MEDICINE' | 'DIAGNOSTICS';
  title: string;
  sourceFacility: string;
  targetFacility: string;
  impactDescription: string;
  resourceQuantity: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MODERATE';
  status: 'PENDING' | 'EXECUTED';
}

export default function ResourceOptimization() {
  const { districtName, facilities, addAuditLog } = useHealthData();

  const [notification, setNotification] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([
    {
      id: 'opt-01',
      category: 'BEDS',
      title: 'Inpatient Load Rebalancing & Ambulance Diversion',
      sourceFacility: 'Salem Government District Hospital (94% Full)',
      targetFacility: 'Omalur Taluk Hospital (52% Full)',
      impactDescription: 'Diverts 15 non-critical sub-acute admissions away from Salem GDH to alleviate emergency ward bottleneck.',
      resourceQuantity: '15 General Beds Divert',
      urgency: 'CRITICAL',
      status: 'PENDING'
    },
    {
      id: 'opt-02',
      category: 'STAFF',
      title: 'Pediatric Specialist Rotation Deployment',
      sourceFacility: 'Mohan Kumaramangalam Medical College',
      targetFacility: 'Yercaud Tribal Primary Health Centre',
      impactDescription: 'Deploys 1 Senior Pediatrician on bi-weekly rotation to address high infant seasonal fever incidence in tribal pockets.',
      resourceQuantity: '1 Specialist (Bi-Weekly)',
      urgency: 'HIGH',
      status: 'PENDING'
    },
    {
      id: 'opt-03',
      category: 'MEDICINE',
      title: 'Emergency Amoxicillin & IV Fluid Buffer Transfer',
      sourceFacility: 'Central District Healthcare Warehouse — Salem',
      targetFacility: 'Mecheri Primary Health Centre',
      impactDescription: 'Transfers 1,500 units of broad-spectrum antibiotics to clear red stockout alert.',
      resourceQuantity: '1,500 Units Buffer',
      urgency: 'HIGH',
      status: 'PENDING'
    },
    {
      id: 'opt-04',
      category: 'DIAGNOSTICS',
      title: 'Radiology Ultrasound Sample Rerouting',
      sourceFacility: 'Attur Sub-District Hospital (Scanner Servicing)',
      targetFacility: 'Thammampatti Diagnostic Hub',
      impactDescription: 'Routes daily outpatient antenatal scans to neighboring operational hub with free capacity.',
      resourceQuantity: '30 Daily Scans Rerouted',
      urgency: 'MODERATE',
      status: 'PENDING'
    }
  ]);

  // Execute optimization action
  const handleExecuteAction = (id: string, title: string, category: string) => {
    setRecommendations(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'EXECUTED' } : r)
    );

    addAuditLog(
      `Authorized Resource Optimization: ${title}`,
      'Resource Planning',
      `Category: ${category} • Execution order dispatched to respective Medical Superintendents.`
    );

    setNotification(`Optimization protocol "${title}" approved and dispatched to facilities.`);
    setTimeout(() => setNotification(null), 5000);
  };

  // Facility capacity calculations
  const highLoadFacilities = facilities.filter(f => f.totalBeds > 0 && Math.round((f.occupiedBeds / f.totalBeds) * 100) >= 80);
  const lowLoadFacilities = facilities.filter(f => f.totalBeds > 0 && Math.round((f.occupiedBeds / f.totalBeds) * 100) < 65);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Cpu className="w-3 h-3 text-teal-600" />
              Public Health Command • Algorithmic Load Balancing
            </span>
            <span className="text-xs text-slate-500 font-medium">District: {districtName}</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-teal-700" />
            <span>Resource & Clinical Staffing Optimization Command</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry identifying inter-facility bed overloads, doctor shortages, and drug stock disparities with one-click rebalancing workflows.
          </p>
        </div>

        <div className="text-xs bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700 font-bold">
          Pending Directives: <span className="text-teal-700 font-mono">{recommendations.filter(r => r.status === 'PENDING').length} Actionable</span>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-xs text-emerald-900 font-semibold animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Capacity Imbalance</span>
          <div className="text-2xl font-black text-amber-600 mt-1">18.4%</div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Occupancy Variance Across Facilities</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Critical Staff Gaps</span>
          <div className="text-2xl font-black text-rose-600 mt-1">3 PHCs</div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Pediatric/Gynecology Deficit</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Recommended Rebalances</span>
          <div className="text-2xl font-black text-teal-700 mt-1">
            {recommendations.filter(r => r.status === 'PENDING').length} Directives
          </div>
          <span className="text-[10px] text-teal-600 block mt-0.5">Ready for DHO Authorization</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Optimized Turnaround</span>
          <div className="text-2xl font-black text-blue-700 mt-1">+340 Beds/Day</div>
          <span className="text-[10px] text-blue-600 block mt-0.5">District Throughput Gain</span>
        </div>
      </div>

      {/* ACTIONABLE OPTIMIZATION RECOMMENDATIONS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-teal-700" />
              <span>Prioritized Administrative Resource Optimization Orders</span>
            </h2>
            <p className="text-xs text-slate-500">
              Review and authorize cross-facility transfers to eliminate clinical bottlenecks.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {recommendations.map(rec => (
            <div 
              key={rec.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                rec.status === 'EXECUTED'
                  ? 'bg-slate-50/70 border-slate-200 opacity-75'
                  : 'bg-white border-slate-200 shadow-xs hover:border-teal-300'
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <div className={`p-2.5 rounded-xl flex-shrink-0 mt-0.5 ${
                  rec.category === 'BEDS' ? 'bg-rose-50 text-rose-600' :
                  rec.category === 'STAFF' ? 'bg-teal-50 text-teal-700' :
                  rec.category === 'MEDICINE' ? 'bg-amber-50 text-amber-700' :
                  'bg-blue-50 text-blue-700'
                }`}>
                  {rec.category === 'BEDS' && <BedDouble className="w-5 h-5" />}
                  {rec.category === 'STAFF' && <Stethoscope className="w-5 h-5" />}
                  {rec.category === 'MEDICINE' && <Pill className="w-5 h-5" />}
                  {rec.category === 'DIAGNOSTICS' && <Building2 className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {rec.category} REBALANCE
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      rec.urgency === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                      rec.urgency === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {rec.urgency}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{rec.title}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">{rec.impactDescription}</p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2">
                    <span><strong>From:</strong> {rec.sourceFacility}</span>
                    <span>→</span>
                    <span><strong>To:</strong> {rec.targetFacility}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Scale</span>
                  <span className="text-xs font-mono font-bold text-teal-800">{rec.resourceQuantity}</span>
                </div>

                {rec.status === 'EXECUTED' ? (
                  <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Authorized & Dispatched
                  </span>
                ) : (
                  <button
                    onClick={() => handleExecuteAction(rec.id, rec.title, rec.category)}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Authorize Transfer</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FACILITY CAPACITY IMBALANCE AUDIT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Overloaded Facilities */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
              Overloaded Health Facilities (&gt;80% Capacity)
            </h3>
            <span className="text-xs text-slate-400 font-mono">{highLoadFacilities.length} Units</span>
          </div>

          <div className="space-y-2">
            {highLoadFacilities.map((f, i) => {
              const occ = Math.round((f.occupiedBeds / f.totalBeds) * 100);
              return (
                <div key={i} className="p-2.5 bg-red-50/50 rounded-xl border border-red-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{f.name}</div>
                    <div className="text-[10px] text-slate-500">{f.taluk} Taluk • {f.doctorsCount} Doctors</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-rose-700">{occ}% Full</span>
                    <span className="block text-[10px] text-slate-400">{f.availableBeds} beds free</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Available Buffer Facilities */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Available Capacity Buffer Units (&lt;65% Capacity)
            </h3>
            <span className="text-xs text-slate-400 font-mono">{lowLoadFacilities.length} Units</span>
          </div>

          <div className="space-y-2">
            {lowLoadFacilities.map((f, i) => {
              const occ = Math.round((f.occupiedBeds / f.totalBeds) * 100);
              return (
                <div key={i} className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{f.name}</div>
                    <div className="text-[10px] text-slate-500">{f.taluk} Taluk • {f.doctorsCount} Doctors</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-emerald-700">{occ}% Full</span>
                    <span className="block text-[10px] text-slate-400">{f.availableBeds} beds free</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
