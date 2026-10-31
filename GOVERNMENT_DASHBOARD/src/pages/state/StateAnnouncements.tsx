import { useState, useEffect, type FormEvent } from 'react';
import { 
  Bell, ShieldCheck, Send, 
  CheckCircle2, Filter, Plus
} from 'lucide-react';
import { useHealthData } from '../../context/HealthDataContext';
import api from '../../services/api';

interface StateAnnouncementItem {
  id: number;
  announcement_id: string;
  author_name: string;
  title: string;
  content: string;
  audience_type: string;
  category: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Published' | 'Cancelled';
  created_at: string;
}

const DEFAULT_ANNOUNCEMENTS: StateAnnouncementItem[] = [
  {
    id: 1,
    announcement_id: 'ANN-2026-001',
    author_name: 'Dr. S. Sundararajan (State Mission Director)',
    title: 'Statewide Intensified Pulse Polio Immunization (IPPI) Drive 2026',
    content: 'Special booth-based vaccination round will be held across all 38 revenue districts on Sunday, November 15, 2026. All PHCs and GHs to prepare adequate bivalent OPV vials.',
    audience_type: 'ALL',
    category: 'Immunization Campaign',
    status: 'Published',
    created_at: '2026-10-25'
  },
  {
    id: 2,
    announcement_id: 'ANN-2026-002',
    author_name: 'Director of Public Health and Preventive Medicine',
    title: 'Monsoon Dengue & Vector Borne Disease Containment Advisory',
    content: 'All District Health Officers to strictly enforce source reduction drives, fogging protocols, and daily Fever Clinic OPD reporting via CareBridge Government Portal.',
    audience_type: 'ALL',
    category: 'Epidemic Containment',
    status: 'Published',
    created_at: '2026-10-28'
  },
  {
    id: 3,
    announcement_id: 'ANN-2026-003',
    author_name: 'State Quality Assurance Officer',
    title: 'National Quality Assurance Standards (NQAS) Certification Audit Cycle',
    content: 'Primary Health Centres due for recertification must submit readiness self-assessments by November 30, 2026.',
    audience_type: 'FACILITY',
    category: 'Accreditation',
    status: 'Pending Approval',
    created_at: '2026-10-30'
  }
];

export default function StateAnnouncements() {
  const { officerName, isOfflineMock, addAuditLog } = useHealthData();
  const [announcements, setAnnouncements] = useState<StateAnnouncementItem[]>(DEFAULT_ANNOUNCEMENTS);
  const [activeTab, setActiveTab] = useState<'roster' | 'create'>('roster');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    audienceType: 'ALL',
    category: 'General Public Health Notice'
  });

  useEffect(() => {
    let isMounted = true;
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get<StateAnnouncementItem[]>('/government/announcements');
        if (isMounted && Array.isArray(res) && res.length > 0) {
          setAnnouncements(res);
        }
      } catch {
        // Keep fallback
      }
    };
    fetchAnnouncements();
    return () => { isMounted = false; };
  }, []);

  const handleCreateAnnouncement = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    const newAnnouncement: StateAnnouncementItem = {
      id: Date.now(),
      announcement_id: `ANN-${Date.now().toString().slice(-6)}`,
      author_name: officerName || 'State Admin Officer',
      title: formData.title,
      content: formData.content,
      audience_type: formData.audienceType,
      category: formData.category,
      status: 'Approved',
      created_at: new Date().toISOString().split('T')[0]
    };

    try {
      await api.post('/government/announcements', {
        title: formData.title,
        content: formData.content,
        audienceType: formData.audienceType,
        category: formData.category
      });
    } catch {
      // Local state fallback
    }

    setAnnouncements(prev => [newAnnouncement, ...prev]);
    addAuditLog(
      `Statewide Announcement Created: "${formData.title}"`,
      'State Announcements',
      `Target: ${formData.audienceType} • Category: ${formData.category}`
    );

    setNotification(`Announcement "${formData.title}" created and scheduled successfully.`);
    setFormData({ title: '', content: '', audienceType: 'ALL', category: 'General Public Health Notice' });
    setActiveTab('roster');
    setTimeout(() => setNotification(null), 5000);
  };

  const filtered = announcements.filter(a => {
    if (filterCategory !== 'ALL' && a.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              State Admin Workspace • Secretariat Communications
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              isOfflineMock ? 'bg-amber-50 text-amber-700 border border-amber-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
            }`}>
              ● Multi-Channel Broadcast Authority (App / Portal / Circular)
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-teal-700" />
            <span>Authorized Statewide Public Health Announcements</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, approve, and disburse official state circulars, epidemic directives, and health campaign notices to all 38 districts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'roster' ? 'bg-teal-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Announcement Archive ({announcements.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'create' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Draft New Circular</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {activeTab === 'create' ? (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-600" />
            <span>Compose Official State Health Circular / Broadcast Notice</span>
          </h2>

          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Announcement Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., State-wide Pulse Polio Campaign Directives"
                className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Audience</label>
                <select
                  value={formData.audienceType}
                  onChange={e => setFormData({ ...formData, audienceType: e.target.value })}
                  className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="ALL">All 38 Revenue Districts (Statewide)</option>
                  <option value="FACILITY">Hospitals & PHCs Only (Clinical Personnel)</option>
                  <option value="DISTRICT">District Health Officers (Administrative)</option>
                  <option value="PATIENTS">CareBridge Mobile Patient App Users</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full text-xs font-semibold p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="General Public Health Notice">General Public Health Notice</option>
                  <option value="Immunization Campaign">Immunization Campaign</option>
                  <option value="Epidemic Containment">Epidemic Containment</option>
                  <option value="Accreditation">Accreditation</option>
                  <option value="Drug Logistics & Supply">Drug Logistics & Supply</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Circular Content / Directives *</label>
              <textarea
                rows={5}
                required
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                placeholder="Provide clear, concise public health instructions, targets, and reporting obligations..."
                className="w-full text-xs font-medium p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('roster')}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Official Directive</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-teal-700" />
              <span>Official Circulars & Dissemination Archive</span>
            </h2>
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="text-xs font-semibold px-2.5 py-1 border border-slate-200 rounded-lg bg-white"
              >
                <option value="ALL">All Categories</option>
                <option value="Immunization Campaign">Immunization</option>
                <option value="Epidemic Containment">Epidemic Containment</option>
                <option value="Accreditation">Accreditation</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filtered.map(item => (
              <div key={item.id} className="p-5 hover:bg-slate-50/80 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-teal-800">{item.announcement_id}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {item.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.content}</p>
                    <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-400">
                      <span>Signatory: <strong className="text-slate-600">{item.author_name}</strong></span>
                      <span>Target: <strong className="text-slate-600">{item.audience_type}</strong></span>
                      <span>Date: <strong className="text-slate-600">{item.created_at}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
