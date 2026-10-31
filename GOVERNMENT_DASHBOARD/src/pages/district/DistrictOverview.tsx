import { useNavigate } from 'react-router-dom';
import { 
  Building2, Users, AlertTriangle, 
  ShieldCheck, 
  Heart, Clock, ArrowRightLeft,
  Tent
} from 'lucide-react';
import { useHealthData } from '../../context/HealthDataContext';
import { MOCK_APPOINTMENTS_QUEUE, MOCK_FOLLOW_UP_PROGRAMS, MOCK_CITIZEN_CAMP_REQUESTS } from '../../data/mockData';

export default function DistrictOverview() {
  const navigate = useNavigate();
  const { currentDistrict, districtName, facilities, ruleAlerts, isOfflineMock } = useHealthData();

  // District-specific facility calculations
  const districtFacilities = facilities.filter(f => f.district === districtName || districtName === 'ALL');
  const totalBeds = districtFacilities.reduce((acc, f) => acc + f.totalBeds, 0);
  const availableBeds = districtFacilities.reduce((acc, f) => acc + f.availableBeds, 0);
  const totalDoctors = districtFacilities.reduce((acc, f) => acc + f.doctorsCount, 0);

  // Total appointments today across district facilities
  const todayAppointmentsTotal = MOCK_APPOINTMENTS_QUEUE.reduce((acc, q) => acc + q.todayAppointments, 0);
  const activeQueueWaitingTotal = MOCK_APPOINTMENTS_QUEUE.reduce((acc, q) => acc + q.activeWaitingQueue, 0);

  // Citizen camp requests for this district
  const pendingCitizenRequests = MOCK_CITIZEN_CAMP_REQUESTS.filter(r => r.district === districtName && r.status === 'PENDING_EVALUATION');

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-teal-600" />
              District Administration Authority
            </span>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {districtName} District Jurisdiction
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              isOfflineMock ? 'bg-amber-50 text-amber-700 border border-amber-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
            }`}>
              ● Live District Operational Feed
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-700" />
            <span>{districtName} District Healthcare Operations Command</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Local healthcare administration, Primary Health Centres, outpatient token queues, patient referrals & community health outreach.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/dashboard/district/camps')}
            className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Tent className="w-4 h-4" />
            <span>Manage Health Camps</span>
          </button>
        </div>
      </div>

      {/* 4 PRIMARY DISTRICT KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => navigate('/dashboard/patients')}
          className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs hover:border-teal-400 transition-all cursor-pointer"
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Registered Patients</span>
          <div className="text-2xl font-black text-teal-800 mt-1">{currentDistrict.registeredPatients.toLocaleString()}</div>
          <span className="text-[10px] text-teal-600 block mt-0.5">District Population: {currentDistrict.population.toLocaleString()}</span>
        </div>

        <div 
          onClick={() => navigate('/dashboard/hospitals')}
          className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs hover:border-blue-400 transition-all cursor-pointer"
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Active Health Units</span>
          <div className="text-2xl font-black text-blue-700 mt-1">{districtFacilities.length} Units</div>
          <span className="text-[10px] text-slate-400 block mt-0.5">District GH, CHCs & Rural PHCs</span>
        </div>

        <div 
          onClick={() => navigate('/dashboard/doctors')}
          className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs hover:border-emerald-400 transition-all cursor-pointer"
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Specialists & MOs</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{totalDoctors} Clinicians</div>
          <span className="text-[10px] text-emerald-700 block mt-0.5">Active on Shift Roster Today</span>
        </div>

        <div 
          onClick={() => navigate('/dashboard/beds-resources')}
          className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs hover:border-rose-400 transition-all cursor-pointer"
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Available Beds</span>
          <div className="text-2xl font-black text-rose-600 mt-1">{availableBeds} / {totalBeds}</div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {totalBeds > 0 ? Math.round(((totalBeds - availableBeds) / totalBeds) * 100) : 0}% Occupancy in District
          </span>
        </div>
      </div>

      {/* SECONDARY OPERATIONAL ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => navigate('/dashboard/district/appointments-queue')}
          className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs cursor-pointer hover:bg-slate-50"
        >
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Today's OPD Queue</span>
          </div>
          <div className="text-lg font-black text-slate-900 mt-1">{todayAppointmentsTotal} Patients</div>
          <span className="text-[10px] text-blue-600">{activeQueueWaitingTotal} currently in waiting lounge</span>
        </div>

        <div 
          onClick={() => navigate('/dashboard/district/referrals')}
          className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs cursor-pointer hover:bg-slate-50"
        >
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <ArrowRightLeft className="w-4 h-4 text-teal-700" />
            <span>Active Referrals</span>
          </div>
          <div className="text-lg font-black text-teal-700 mt-1">4 Active Referrals</div>
          <span className="text-[10px] text-teal-600">1 Delayed • 2 In Transit</span>
        </div>

        <div 
          onClick={() => navigate('/dashboard/district/community-requests')}
          className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs cursor-pointer hover:bg-slate-50"
        >
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <Users className="w-4 h-4 text-purple-600" />
            <span>Citizen Camp Demands</span>
          </div>
          <div className="text-lg font-black text-purple-700 mt-1">{pendingCitizenRequests.length} Village Demands</div>
          <span className="text-[10px] text-purple-600">Submitted via Flutter App</span>
        </div>

        <div 
          onClick={() => navigate('/dashboard/district/follow-ups')}
          className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs cursor-pointer hover:bg-slate-50"
        >
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
            <Heart className="w-4 h-4 text-rose-600" />
            <span>High-Risk Follow-ups</span>
          </div>
          <div className="text-lg font-black text-rose-700 mt-1">
            {MOCK_FOLLOW_UP_PROGRAMS.reduce((acc, f) => acc + f.dueThisWeek, 0)} Due This Week
          </div>
          <span className="text-[10px] text-rose-600">ANC, Immunization, NCD</span>
        </div>
      </div>

      {/* DISTRICT QUICK WORKSPACE LINKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Local Healthcare Units */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-teal-700" />
              District Operational Healthcare Facilities
            </h3>
            <button
              onClick={() => navigate('/dashboard/hospitals')}
              className="text-[11px] font-bold text-teal-700 hover:text-teal-800"
            >
              View All
            </button>
          </div>

          <div className="space-y-2">
            {districtFacilities.slice(0, 4).map((f, i) => (
              <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{f.name}</div>
                  <div className="text-[10px] text-slate-500">{f.taluk} Taluk • {f.doctorsCount} Doctors</div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-800">{f.availableBeds} beds free</span>
                  <span className="block text-[10px] text-teal-700 font-medium">{f.facilityStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Local Alarms & Active Protocols */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Active Local Health Alarms & Triggers
            </h3>
            <button
              onClick={() => navigate('/dashboard/alerts')}
              className="text-[11px] font-bold text-red-700 hover:text-red-800"
            >
              All Alerts
            </button>
          </div>

          <div className="space-y-2">
            {ruleAlerts.slice(0, 3).map((a, i) => (
              <div key={i} className="p-2.5 bg-red-50/50 rounded-xl border border-red-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{a.title}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-800">{a.category}</span>
                </div>
                <div className="text-[11px] text-slate-600"><strong>Action:</strong> {a.actionNeeded}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
