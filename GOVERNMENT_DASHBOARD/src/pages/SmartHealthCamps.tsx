import { useState, useEffect, type FormEvent } from 'react';
import { 
  Tent, MapPin, Calendar, 
  CheckCircle2, Plus, Sparkles, Filter, 
  ArrowRight, ShieldCheck
} from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';
import api from '../services/api';

interface HealthCampRecord {
  id: number | string;
  camp_id?: string;
  location: string;
  district: string;
  camp_type: string;
  camp_date: string;
  doctors_count: number;
  nurses_count: number;
  expected_patients: number;
  status: 'Scheduled' | 'Published' | 'Completed' | 'In Progress';
}

interface UnderservedPocket {
  id: string;
  villageName: string;
  taluk: string;
  district: string;
  population: number;
  distanceToNearestHospitalKm: number;
  accessibilityScore: number;
  vulnerabilityReason: string;
  priorityLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  recommendedCampType: string;
  recommendedDoctors: number;
  recommendedNurses: number;
  targetDate: string;
}

export default function SmartHealthCamps() {
  const { districtName, addAuditLog } = useHealthData();

  const [activeTab, setActiveTab] = useState<'suggestions' | 'scheduled' | 'create'>('suggestions');
  const [campsList, setCampsList] = useState<HealthCampRecord[]>([]);
  const [loadingCamps, setLoadingCamps] = useState(true);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Scheduled' | 'Published' | 'Completed'>('ALL');
  const [notification, setNotification] = useState<string | null>(null);

  // New Camp Form State
  const [formData, setFormData] = useState({
    location: '',
    district: districtName,
    campType: 'General Medical + Diagnostics',
    campDate: '2026-11-05',
    doctorsCount: 3,
    nursesCount: 4,
    expectedPatients: 150,
    status: 'Scheduled' as HealthCampRecord['status']
  });

  // High-Priority Underserved Pockets Database
  const underservedPockets: UnderservedPocket[] = [
    {
      id: 'usp-01',
      villageName: 'Nagaram Tribal Settlement',
      taluk: 'Yercaud Hills',
      district: 'Salem',
      population: 4200,
      distanceToNearestHospitalKm: 26,
      accessibilityScore: 38,
      vulnerabilityReason: 'Steep hill terrain, zero functional pharmacy within 20km, seasonal fever outbreak history.',
      priorityLevel: 'CRITICAL',
      recommendedCampType: 'Tribal Outreach & Fever Diagnostics',
      recommendedDoctors: 4,
      recommendedNurses: 6,
      targetDate: '2026-11-05'
    },
    {
      id: 'usp-02',
      villageName: 'Mulluvadi Hamlet',
      taluk: 'Attur',
      district: 'Salem',
      population: 3100,
      distanceToNearestHospitalKm: 18,
      accessibilityScore: 49,
      vulnerabilityReason: 'High antenatal drop-out rate, lack of pediatric ultrasound screening facilities.',
      priorityLevel: 'HIGH',
      recommendedCampType: 'Maternal & Child Nutrition Screening',
      recommendedDoctors: 3,
      recommendedNurses: 5,
      targetDate: '2026-11-08'
    },
    {
      id: 'usp-03',
      villageName: 'Pappireddipatti East',
      taluk: 'Dharmapuri Rural',
      district: 'Dharmapuri',
      population: 5800,
      distanceToNearestHospitalKm: 22,
      accessibilityScore: 42,
      vulnerabilityReason: 'Fluorosis endemic pocket, elevated chronic hypertension & arthritis prevalence.',
      priorityLevel: 'HIGH',
      recommendedCampType: 'NCD & Orthopedic Specialty Camp',
      recommendedDoctors: 3,
      recommendedNurses: 4,
      targetDate: '2026-11-12'
    },
    {
      id: 'usp-04',
      villageName: 'Chithode Weavers Colony',
      taluk: 'Erode North',
      district: 'Erode',
      population: 3900,
      distanceToNearestHospitalKm: 14,
      accessibilityScore: 56,
      vulnerabilityReason: 'Occupational respiratory disorders, low adult vaccination coverage.',
      priorityLevel: 'MEDIUM',
      recommendedCampType: 'Pulmonology & Occupational Health Camp',
      recommendedDoctors: 2,
      recommendedNurses: 3,
      targetDate: '2026-11-15'
    }
  ];

  // Fetch Health Camps from live PostgreSQL backend
  useEffect(() => {
    let isMounted = true;
    const fetchCamps = async () => {
      setLoadingCamps(true);
      try {
        const queryParam = districtName && districtName !== 'ALL' ? `?district=${districtName}` : '';
        const res = await api.get<HealthCampRecord[]>(`/health-camps${queryParam}`);
        if (isMounted) {
          if (Array.isArray(res) && res.length > 0) {
            setCampsList(res);
            setIsLiveBackend(true);
          } else {
            // Fallback seed
            setCampsList([
              {
                id: 1,
                camp_id: 'HC-001',
                location: 'Mettur Community Hall',
                district: districtName,
                camp_type: 'General Medical + Diagnostics',
                camp_date: '2026-11-04',
                doctors_count: 4,
                nurses_count: 6,
                expected_patients: 200,
                status: 'Scheduled'
              },
              {
                id: 2,
                camp_id: 'HC-002',
                location: 'Gangavalli Govt Higher Secondary School',
                district: districtName,
                camp_type: 'General Medical & Eye Checkup',
                camp_date: '2026-10-24',
                doctors_count: 2,
                nurses_count: 3,
                expected_patients: 120,
                status: 'Completed'
              },
              {
                id: 3,
                camp_id: 'HC-003',
                location: 'Omalur Block Development Office',
                district: districtName,
                camp_type: 'Fever & Dengue Rapid Screening',
                camp_date: '2026-11-09',
                doctors_count: 3,
                nurses_count: 4,
                expected_patients: 150,
                status: 'Published'
              }
            ]);
            setIsLiveBackend(false);
          }
        }
      } catch (err) {
        console.warn('Backend /health-camps offline, using local camp records:', err);
        if (isMounted) {
          setCampsList([
            {
              id: 1,
              camp_id: 'HC-001',
              location: 'Mettur Community Hall',
              district: districtName,
              camp_type: 'General Medical + Diagnostics',
              camp_date: '2026-11-04',
              doctors_count: 4,
              nurses_count: 6,
              expected_patients: 200,
              status: 'Scheduled'
            },
            {
              id: 2,
              camp_id: 'HC-002',
              location: 'Omalur Block Development Office',
              district: districtName,
              camp_type: 'Fever & Dengue Rapid Screening',
              camp_date: '2026-11-09',
              doctors_count: 3,
              nurses_count: 4,
              expected_patients: 150,
              status: 'Published'
            }
          ]);
          setIsLiveBackend(false);
        }
      } finally {
        if (isMounted) setLoadingCamps(false);
      }
    };

    fetchCamps();
    return () => { isMounted = false; };
  }, [districtName]);

  // Quick Adopt Suggestion
  const handleAdoptSuggestion = (pocket: UnderservedPocket) => {
    setFormData({
      location: `${pocket.villageName} Primary School`,
      district: pocket.district,
      campType: pocket.recommendedCampType,
      campDate: pocket.targetDate,
      doctorsCount: pocket.recommendedDoctors,
      nursesCount: pocket.recommendedNurses,
      expectedPatients: Math.round(pocket.population * 0.08),
      status: 'Scheduled'
    });
    setActiveTab('create');
  };

  // Submit New Camp
  const handleCreateCamp = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.location || !formData.district) {
      alert('Please fill out all required camp details.');
      return;
    }

    try {
      const payload = {
        location: formData.location,
        district: formData.district,
        campType: formData.campType,
        campDate: formData.campDate,
        doctorsCount: Number(formData.doctorsCount),
        nursesCount: Number(formData.nursesCount),
        expectedPatients: Number(formData.expectedPatients),
        status: formData.status
      };

      const res: any = await api.post('/health-camps', payload);
      const createdCamp = res?.camp || {
        id: Date.now(),
        camp_id: `HC-${Math.floor(100 + Math.random() * 900)}`,
        ...payload
      };

      setCampsList(prev => [createdCamp, ...prev]);
      addAuditLog(
        `Scheduled Smart Health Camp at ${formData.location}`,
        'Smart Health Camps',
        `Type: ${formData.campType} • Expected Turnout: ${formData.expectedPatients} citizens • Date: ${formData.campDate}`
      );

      setNotification(`Smart Health Camp successfully scheduled at ${formData.location}`);
      setActiveTab('scheduled');
      setTimeout(() => setNotification(null), 5000);
    } catch (err: any) {
      console.warn('Failed to publish camp to backend API, using local fallback:', err);
      // Local graceful fallback
      const localCamp: HealthCampRecord = {
        id: Date.now(),
        camp_id: `HC-${Math.floor(100 + Math.random() * 900)}`,
        location: formData.location,
        district: formData.district,
        camp_type: formData.campType,
        camp_date: formData.campDate,
        doctors_count: Number(formData.doctorsCount),
        nurses_count: Number(formData.nursesCount),
        expected_patients: Number(formData.expectedPatients),
        status: formData.status
      };
      setCampsList(prev => [localCamp, ...prev]);
      addAuditLog(
        `Scheduled Smart Health Camp (Offline Local) at ${formData.location}`,
        'Smart Health Camps',
        `Type: ${formData.campType} • Expected Turnout: ${formData.expectedPatients}`
      );
      setNotification(`Camp scheduled locally in offline demonstration mode.`);
      setActiveTab('scheduled');
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const filteredCamps = campsList.filter(c => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-600" />
              Smart India Hackathon • Outreach Optimization
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              isLiveBackend ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-amber-50 text-amber-700 border border-amber-300'
            }`}>
              {isLiveBackend ? '● PostgreSQL Live Connected' : '○ Local Development Engine'}
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Tent className="w-5 h-5 text-teal-700" />
            <span>Smart Health Camp Planning & Outreach Command</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Autonomous detection of underserved rural/tribal settlements, AI-guided mobile health camp scheduling & medical specialist deployments.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'suggestions' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Underserved Pockets ({underservedPockets.length})
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'scheduled' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Scheduled Camps ({campsList.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'create' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Plan New Camp
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-xs text-emerald-900 font-semibold animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 4 Primary Health Camp Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Underserved Pockets</span>
          <div className="text-2xl font-black text-rose-600 mt-1">4 Pockets</div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Accessibility Score &lt; 60</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Active Outreach Camps</span>
          <div className="text-2xl font-black text-teal-700 mt-1">{campsList.length} Camps</div>
          <span className="text-[10px] text-teal-600 block mt-0.5">Across {districtName} District</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Estimated Citizen Reach</span>
          <div className="text-2xl font-black text-blue-700 mt-1">
            {campsList.reduce((acc, c) => acc + (c.expected_patients || 0), 0).toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Registered Beneficiaries</span>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Mobile Units Allocated</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">3 Units</div>
          <span className="text-[10px] text-emerald-700 block mt-0.5">Equipped with Diagnostic Kits</span>
        </div>
      </div>

      {/* TAB 1: UNDERSERVED POCKETS & AI RECOMMENDATIONS */}
      {activeTab === 'suggestions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Identified Underserved Settlements Requiring Immediate Outreach
            </h2>
            <span className="text-xs text-slate-500">Prioritized by Healthcare Deprivation Score</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {underservedPockets.map(pocket => (
              <div 
                key={pocket.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        pocket.priorityLevel === 'CRITICAL' ? 'bg-red-100 text-red-700 border border-red-200' :
                        pocket.priorityLevel === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        {pocket.priorityLevel} PRIORITY
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{pocket.villageName}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {pocket.taluk}, {pocket.district} District
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Access Score</span>
                      <span className="text-lg font-black text-slate-800">{pocket.accessibilityScore}/100</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                    <strong>Vulnerability Flag:</strong> {pocket.vulnerabilityReason}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Population</span>
                      <span className="text-xs font-bold text-slate-800">{pocket.population.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Nearest Hospital</span>
                      <span className="text-xs font-bold text-rose-600">{pocket.distanceToNearestHospitalKm} km</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Target Turnout</span>
                      <span className="text-xs font-bold text-teal-700">{Math.round(pocket.population * 0.08)} citizens</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400 block text-[10px]">Suggested Deployment:</span>
                    <strong className="text-slate-700">{pocket.recommendedDoctors} Doctors • {pocket.recommendedNurses} Nurses</strong>
                  </div>

                  <button
                    onClick={() => handleAdoptSuggestion(pocket)}
                    className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Schedule Camp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE & SCHEDULED CAMPS LIST */}
      {activeTab === 'scheduled' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-700" />
                <span>Government Health Outreach Schedule & Deployment Directory</span>
              </h2>
              <p className="text-xs text-slate-500">
                Official district camps roster coordinated with Primary Health Centres and Mobile Diagnostic Units.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
              {(['ALL', 'Scheduled', 'Published', 'Completed'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    statusFilter === status ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {loadingCamps ? (
            <div className="py-12 text-center text-xs text-slate-400 font-medium">Loading health camp records from database...</div>
          ) : filteredCamps.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-medium">No health camps found matching current filter.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Camp ID / Venue</th>
                    <th className="py-3 px-3">District</th>
                    <th className="py-3 px-3">Service Focus</th>
                    <th className="py-3 px-3">Scheduled Date</th>
                    <th className="py-3 px-3">Staffing</th>
                    <th className="py-3 px-3">Target Patients</th>
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
                      <td className="py-3 px-3">{camp.district}</td>
                      <td className="py-3 px-3">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                          {camp.camp_type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        {camp.camp_date ? String(camp.camp_date).substring(0, 10) : 'TBD'}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-teal-700 font-bold">{camp.doctors_count || 2} Docs</span>
                        <span className="text-slate-400 mx-1">•</span>
                        <span className="text-blue-700 font-bold">{camp.nurses_count || 4} Nurses</span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800">
                        {(camp.expected_patients || 100).toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          camp.status === 'Completed' ? 'bg-slate-100 text-slate-600' :
                          camp.status === 'Published' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
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

      {/* TAB 3: SCHEDULE NEW CAMP FORM */}
      {activeTab === 'create' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs max-w-3xl mx-auto">
          <div className="border-b border-slate-100 pb-4 mb-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Tent className="w-5 h-5 text-teal-700" />
              <span>Official Health Camp Authorization & Dispatch Form</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit administrative camp dispatch order to be recorded in the State Public Health Registry.
            </p>
          </div>

          <form onSubmit={handleCreateCamp} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Camp Location / Venue *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yercaud Tribal Community Hall"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">District Jurisdiction *</label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Camp Program Focus *</label>
                <select
                  value={formData.campType}
                  onChange={e => setFormData({ ...formData, campType: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                >
                  <option value="General Medical + Diagnostics">General Medical + Diagnostics</option>
                  <option value="Fever & Dengue Rapid Screening">Fever & Dengue Rapid Screening</option>
                  <option value="Maternal & Child Nutrition Screening">Maternal & Child Nutrition Screening</option>
                  <option value="NCD & Hypertension Outreach">NCD & Hypertension Outreach</option>
                  <option value="Geriatric & Eye Checkup">Geriatric & Eye Checkup</option>
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
                  max="20"
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
                  max="30"
                  value={formData.nursesCount}
                  onChange={e => setFormData({ ...formData, nursesCount: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Expected Turnout</label>
                <input
                  type="number"
                  min="20"
                  max="2000"
                  value={formData.expectedPatients}
                  onChange={e => setFormData({ ...formData, expectedPatients: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('suggestions')}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                Authorize & Publish Camp Schedule
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
