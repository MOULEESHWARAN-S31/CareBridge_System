import { useState } from 'react';
import { 
  PhoneCall, Signal, Video
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useHealthData } from '../context/HealthDataContext';

export default function Telemedicine() {
  const { telemedicineSessions } = useHealthData();
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Active' | 'Waiting' | 'Completed' | 'Cancelled'>('ALL');

  // Chart: Teleconsultations by Specialty
  const specialtyTeleconsultData = [
    { specialty: 'General Medicine', count: 1240, color: '#10b981' },
    { specialty: 'Cardiology', count: 480, color: '#3b82f6' },
    { specialty: 'Gynecology', count: 620, color: '#ec4899' },
    { specialty: 'Pediatrics', count: 540, color: '#06b6d4' },
    { specialty: 'Dermatology', count: 310, color: '#f59e0b' },
    { specialty: 'Psychiatry', count: 180, color: '#8b5cf6' }
  ];

  const filteredSessions = telemedicineSessions.filter(s => {
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-emerald-600" />
            <span>Telemedicine & Remote Specialist Command Center</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            e-Sanjeevani & State Teleconsultation network connecting regional health units with tertiary medical specialists
          </p>
        </div>

        <div className="text-xs bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-emerald-800 font-medium">
          District Total Today: <strong className="text-emerald-700 font-mono">2,845 Consultations</strong>
        </div>
      </div>

      {/* 4 Telemedicine Primary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">Active Video Sessions</span>
          <div className="text-xl font-black text-emerald-600 mt-1 flex items-center gap-2">
            <span>24 Active</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Live physician consults</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">Waiting Queue</span>
          <div className="text-xl font-black text-amber-600 mt-1">18 Patients</div>
          <span className="text-[10px] text-amber-700 block mt-0.5">Avg Wait Time: 4.2 mins</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">Completed Today</span>
          <div className="text-xl font-black text-slate-900 mt-1">2,845</div>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">97.8% completion rate</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">Available Specialists</span>
          <div className="text-xl font-black text-cyan-600 mt-1">42 Online</div>
          <span className="text-[10px] text-cyan-700 font-semibold block mt-0.5">Across 10 specialties</span>
        </div>
      </div>

      {/* Teleconsultation by Specialty Chart & Live Session Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Specialty Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Consultations by Clinical Specialty</h3>
              <p className="text-[11px] text-slate-500">Demand distribution across tele-clinics</p>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-bold">
              Today
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={specialtyTeleconsultData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" fontSize={10} />
                <YAxis dataKey="specialty" type="category" stroke="#64748b" fontSize={10} width={90} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {specialtyTeleconsultData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Active Sessions & Queue Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Live Remote Consultation Feeds</h3>
                <p className="text-[11px] text-slate-500">Real-time tele-booth telemetry from health centres</p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                {(['ALL', 'Active', 'Waiting', 'Completed', 'Cancelled'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      statusFilter === st ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st === 'ALL' ? 'All Feeds' : st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredSessions.map((ses) => {
                const statusBadge = ses.status === 'Active'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse'
                  : ses.status === 'Waiting'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : ses.status === 'Cancelled'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200';

                return (
                  <div 
                    key={ses.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{ses.patientName}</span>
                        <span className="text-[10px] font-mono text-cyan-700 font-semibold">{ses.patientRef}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusBadge}`}>
                          {ses.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Attending Doctor: <strong className="text-slate-800">{ses.doctorName}</strong> ({ses.specialty}) • {ses.facility}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Scheduled Time</span>
                        <span className="font-mono text-slate-700 font-bold">{ses.scheduledTime}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-white px-2 py-1 rounded-xl border border-slate-200 shadow-xs">
                        <Signal className={`w-3.5 h-3.5 text-emerald-600`} />
                        <span>Connected</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Video className="w-4 h-4 text-emerald-600" />
              National e-Sanjeevani 2.0 WebRTC Integrated
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              End-to-End Encrypted Live Stream
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
