import { useState, useEffect, type FormEvent } from 'react';
import { 
  Tent, Calendar, 
  CheckCircle2, Plus, 
  ShieldCheck, } from 'lucide-react';
import { useHealthData } from '../../context/HealthDataContext';
import api from '../../services/api';

interface DistrictCampItem {
  id: number | string;
  camp_id?: string;
  location: string;
  district: string;
  camp_type: string;
  camp_date: string;
  doctors_count: number;
  nurses_count: number;
  expected_patients: number;
  status: 'Scheduled' | 'Published' | 'Completed' | 'Pending State Sanction';
}

export default function CampManagement() {
  const { districtName, addAuditLog } = useHealthData();
  const [camps, setCamps] = useState<DistrictCampItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'roster' | 'plan'>('roster');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [notification, setNotification] = useState<string | null>(null);

  // New Camp Proposal Form State
  const [formData, setFormData] = useState({
    location: '',
    block: 'Omalur Block',
    campType: 'General Medical + Diagnostics',
    campDate: '2026-11-12',
    doctorsCount: 3,
    nursesCount: 5,
    expectedPatients: 150,
    requiresStateFunding: false
  });

  useEffect(() => {
    let isMounted = true;
    const fetchDistrictCamps = async () => {
      setLoading(true);
      try {
        const res = await api.get<DistrictCampItem[]>(`/health-camps?district=${districtName}`);
        if (isMounted && Array.isArray(res) && res.length > 0) {
          setCamps(res);
        } else if (isMounted) {
          setCamps([
            { id: 1, camp_id: 'HC-001', location: 'Mettur Community Hall', district: districtName, camp_type: 'General Medical + Diagnostics', camp_date: '2026-11-04', doctors_count: 4, nurses_count: 6, expected_patients: 200, status: 'Scheduled' },
            { id: 2, camp_id: 'HC-002', location: 'Gangavalli Govt Higher Secondary School', district: districtName, camp_type: 'General Medical & Eye Checkup', camp_date: '2026-10-24', doctors_count: 2, nurses_count: 3, expected_patients: 120, status: 'Completed' },
            { id: 3, camp_id: 'HC-003', location: 'Omalur Block Development Office', district: districtName, camp_type: 'Fever & Dengue Rapid Screening', camp_date: '2026-11-09', doctors_count: 3, nurses_count: 4, expected_patients: 150, status: 'Published' }
          ]);
        }
      } catch {
        if (isMounted) {
          setCamps([
            { id: 1, camp_id: 'HC-001', location: 'Mettur Community Hall', district: districtName, camp_type: 'General Medical + Diagnostics', camp_date: '2026-11-04', doctors_count: 4, nurses_count: 6, expected_patients: 200, status: 'Scheduled' },
            { id: 3, camp_id: 'HC-003', location: 'Omalur Block Development Office', district: districtName, camp_type: 'Fever & Dengue Rapid Screening', camp_date: '2026-11-09', doctors_count: 3, nurses_count: 4, expected_patients: 150, status: 'Published' }
          ]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDistrictCamps();
    return () => { isMounted = false; };
  }, [districtName]);

  const handleCreateProposal = async (e: FormEvent) => {
    e.preventDefault();
    const finalStatus: DistrictCampItem['status'] = formData.requiresStateFunding 
      ? 'Pending State Sanction' 
      : 'Scheduled';

    const newCamp: DistrictCampItem = {
      id: Date.now(),
      camp_id: `HC-${Math.floor(100 + Math.random() * 900)}`,
      location: `${formData.location} (${formData.block})`,
      district: districtName,
      camp_type: formData.campType,
      camp_date: formData.campDate,
      doctors_count: Number(formData.doctorsCount),
      nurses_count: Number(formData.nursesCount),
      expected_patients: Number(formData.expectedPatients),
      status: finalStatus
    };

    try {
      await api.post('/health-camps', {
        location: newCamp.location,
        district: newCamp.district,
        campType: newCamp.camp_type,
        campDate: newCamp.camp_date,
        doctorsCount: newCamp.doctors_count,
        nursesCount: newCamp.nurses_count,
        expectedPatients: newCamp.expected_patients,
        status: newCamp.status
      });
    } catch (err) {
      console.warn('Backend camp post offline, saving locally:', err);
    }

    setCamps(prev => [newCamp, ...prev]);

    addAuditLog(
      `District Admin Created Camp Proposal: ${newCamp.location}`,
      'District Camp Management',
      `Type: ${newCamp.camp_type} • Status: ${finalStatus} • Expected: ${newCamp.expected_patients}`
    );

    setNotification(
      formData.requiresStateFunding
        ? `Camp proposal submitted and escalated to State Admin for budget & specialist sanction.`
        : `Health Camp authorized and scheduled locally. Citizens will be notified via Patient App.`
    );

    setActiveTab('roster');
    setTimeout(() => setNotification(null), 5000);
  };

  const filteredCamps = camps.filter(c => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Tent className="w-5 h-5 text-teal-700" />
            <span>District Health Camp Operations & Execution Command</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Plan, staff, authorize, and publish mobile medical outreach clinics across rural & underserved blocks in {districtName} District.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'roster' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            District Camps ({camps.length})
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'plan' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Camp Proposal</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-xs text-emerald-900 font-semibold shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* TAB 1: DISTRICT CAMPS ROSTER */}
      {activeTab === 'roster' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-700" />
                <span>{districtName} District Health Camps Roster</span>
              </h2>
              <p className="text-xs text-slate-500">Coordinated with Primary Health Centres and Mobile Diagnostic Vans.</p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-700">Status:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="p-1 rounded-lg border border-slate-300 text-xs bg-white font-medium outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Published">Published</option>
                <option value="Pending State Sanction">Pending State Sanction</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading camps...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Camp ID / Venue</th>
                    <th className="py-3 px-3">Service Focus</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Staffing</th>
                    <th className="py-3 px-3">Target Attendance</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredCamps.map((camp, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{camp.location}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{camp.camp_id || `HC-00${idx + 1}`}</div>
                      </td>
                      <td className="py-3 px-3">{camp.camp_type}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        {camp.camp_date ? String(camp.camp_date).substring(0, 10) : 'TBD'}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-teal-700 font-bold">{camp.doctors_count || 2} Docs</span>
                        <span className="text-slate-400 mx-1">•</span>
                        <span className="text-blue-700 font-bold">{camp.nurses_count || 4} Nurses</span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800">
                        {(camp.expected_patients || 100).toLocaleString()} Citizens
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          camp.status === 'Completed' ? 'bg-slate-100 text-slate-600' :
                          camp.status === 'Published' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          camp.status === 'Pending State Sanction' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {camp.status || 'Scheduled'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROPOSE NEW CAMP */}
      {activeTab === 'plan' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs max-w-3xl mx-auto space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Tent className="w-5 h-5 text-teal-700" />
              <span>District Health Outreach Authorization & Proposal Form</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure venue, clinical disciplines, staffing, and review readiness before publishing.
            </p>
          </div>

          <form onSubmit={handleCreateProposal} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Venue / Facility Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Government Higher Secondary School"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Administrative Block *</label>
                <select
                  value={formData.block}
                  onChange={e => setFormData({ ...formData, block: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                >
                  <option value="Omalur Block">Omalur Block</option>
                  <option value="Yercaud Tribal Block">Yercaud Tribal Block</option>
                  <option value="Attur Sub-Division">Attur Sub-Division</option>
                  <option value="Mettur Block">Mettur Block</option>
                  <option value="Gangavalli Block">Gangavalli Block</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Outreach Clinical Focus *</label>
                <select
                  value={formData.campType}
                  onChange={e => setFormData({ ...formData, campType: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                >
                  <option value="General Medical + Diagnostics">General Medical + Diagnostics</option>
                  <option value="Fever & Dengue Rapid Screening">Fever & Dengue Rapid Screening</option>
                  <option value="Maternal & Child Nutrition Screening">Maternal & Child Nutrition Screening</option>
                  <option value="Geriatric & Eye Checkup">Geriatric & Eye Checkup</option>
                  <option value="NCD & Hypertension Screening">NCD & Hypertension Screening</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Scheduled Date *</label>
                <input
                  type="date"
                  required
                  value={formData.campDate}
                  onChange={e => setFormData({ ...formData, campDate: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Doctors Count</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={formData.doctorsCount}
                  onChange={e => setFormData({ ...formData, doctorsCount: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nurses Count</label>
                <input
                  type="number"
                  min="1"
                  max="25"
                  value={formData.nursesCount}
                  onChange={e => setFormData({ ...formData, nursesCount: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Citizens</label>
                <input
                  type="number"
                  min="20"
                  max="1000"
                  value={formData.expectedPatients}
                  onChange={e => setFormData({ ...formData, expectedPatients: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            {/* State Escalation Toggle */}
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-amber-900 block">Requires State Budget / Specialist Sanction</span>
                <span className="text-[11px] text-amber-700 block">
                  Check this if the camp requires state funding, multi-district specialist deputation, or mobile diagnostic van allocation.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.requiresStateFunding}
                onChange={e => setFormData({ ...formData, requiresStateFunding: e.target.checked })}
                className="w-4 h-4 text-teal-600 rounded cursor-pointer"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('roster')}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{formData.requiresStateFunding ? 'Submit for State Sanction' : 'Authorize & Publish Camp'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
