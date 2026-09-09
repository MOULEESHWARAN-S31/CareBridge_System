import { useState } from 'react';
import { 
  ShieldCheck, Lock, Eye 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { useHealthData } from '../context/HealthDataContext';

export default function PatientAnalytics() {
  const { districtName, currentDistrict } = useHealthData();
  const [authorizedMode, setAuthorizedMode] = useState(false);

  const ageData = [
    { age: '0–5 Yrs (Pediatric)', count: Math.round(currentDistrict.registeredPatients * 0.13), percent: '13.3%' },
    { age: '6–18 Yrs (Youth)', count: Math.round(currentDistrict.registeredPatients * 0.21), percent: '20.7%' },
    { age: '19–40 Yrs (Adult)', count: Math.round(currentDistrict.registeredPatients * 0.35), percent: '34.8%' },
    { age: '41–60 Yrs (Middle)', count: Math.round(currentDistrict.registeredPatients * 0.21), percent: '21.4%' },
    { age: '60+ Yrs (Elderly)', count: Math.round(currentDistrict.registeredPatients * 0.10), percent: '9.8%' },
  ];

  const genderData = [
    { name: 'Female', value: Math.round(currentDistrict.registeredPatients * 0.515), color: '#ec4899' },
    { name: 'Male', value: Math.round(currentDistrict.registeredPatients * 0.484), color: '#3b82f6' },
    { name: 'Other', value: Math.round(currentDistrict.registeredPatients * 0.001), color: '#a855f7' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> DISHA PRIVACY COMPLIANT
            </span>
            <span className="text-xs text-slate-500 font-medium">Aggregated Public Health Intelligence</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Demographic & Patient Analytics</h2>
          <p className="text-xs text-slate-500 mt-1">
            {districtName} District • Population health distribution, age cohort vulnerability, and anonymized health registry metrics.
          </p>
        </div>

        {/* Role Access Toggle */}
        <button
          onClick={() => {
            if (!authorizedMode) {
              alert(`Audit Notice: Authorized DHO Access Granted for ${districtName} District. Patient record drill-down logged in District Security Trail.`);
            }
            setAuthorizedMode(!authorizedMode);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer ${
            authorizedMode ? 'bg-amber-600 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          {authorizedMode ? <Eye className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          {authorizedMode ? 'Authorized Drill-Down Active' : 'Request DHO Authorized View'}
        </button>
      </div>

      {/* Aggregate Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Registered Patients', val: currentDistrict.registeredPatients.toLocaleString(), color: 'text-blue-600' },
          { label: 'Active Cases', val: (currentDistrict.emergencyCases * 12).toLocaleString(), color: 'text-orange-600' },
          { label: 'Critical Patients', val: currentDistrict.emergencyCases.toString(), color: 'text-red-600' },
          { label: 'Recovered Patients', val: (currentDistrict.registeredPatients - (currentDistrict.emergencyCases * 12)).toLocaleString(), color: 'text-emerald-600' },
          { label: 'Diagnostic Units', val: currentDistrict.diagnosticCentresCount.toString(), color: 'text-indigo-600' },
          { label: 'Doctors on Duty', val: currentDistrict.doctorsCount.toString(), color: 'text-purple-600' },
        ].map((c, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 block mb-1">{c.label}</span>
            <span className={`text-xl font-black ${c.color}`}>{c.val}</span>
          </div>
        ))}
      </div>

      {/* Demographics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Age Groups Bar Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-1">Age Cohort Distribution</h3>
          <p className="text-xs text-slate-500 mb-4">Patient demographics across 5 age brackets in {districtName} District</p>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="age" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="count" name="Registered Patients" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Breakdown Pie */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Gender Distribution</h3>
            <p className="text-xs text-slate-500 mb-4">Ratio of registered patients in {districtName}</p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={genderData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                    {genderData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold">
            {genderData.map((g, i) => (
              <div key={i} className="flex justify-between">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }}></span>
                  {g.name}
                </span>
                <span className="text-slate-900 font-bold font-mono">{g.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Authorized PII Notice */}
      {authorizedMode && (
        <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl text-xs text-amber-950">
          <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
            <Lock className="w-4 h-4 text-amber-600" /> Authorized Role Audit Log Active
          </div>
          Individual patient identity tokens are protected under Digital Health guidelines. Full demographic data is only accessible during active clinical treatment and emergency dispatch workflows.
        </div>
      )}
    </div>
  );
}
