import { useState, useEffect, useMemo, type FormEvent } from 'react';
import { 
  Bell, Send, CheckCircle2, Smartphone, Users, PlusCircle, 
  Download, } from 'lucide-react';
import { useHealthData } from '../../context/HealthDataContext';
import api from '../../services/api';
import { MOCK_PUBLIC_HEALTH_NOTICES, type PublicHealthNotice } from '../../data/mockData';

export default function Notifications() {
  const { districtName, addAuditLog } = useHealthData();
  const [notices, setNotices] = useState<PublicHealthNotice[]>(MOCK_PUBLIC_HEALTH_NOTICES);
  const [, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'compose'>('history');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [notification, setNotification] = useState<string | null>(null);

  // New Notice Composer State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<PublicHealthNotice['category']>('HEALTH_CAMP');
  const [targetScope] = useState<'STATEWIDE' | 'DISTRICT_SPECIFIC'>('DISTRICT_SPECIFIC');
  const [targetArea, setTargetArea] = useState('All Taluks — Salem District');
  const [appChannel, setAppChannel] = useState(true);
  const [smsChannel, setSmsChannel] = useState(true);
  const [ivrChannel, setIvrChannel] = useState(false);

  // Scoped notices
  const districtNotices = useMemo(() => {
    return notices.filter(n => {
      const matchDistrict = n.district === 'ALL' || !districtName || districtName === 'ALL' || n.district === districtName;
      const matchCategory = categoryFilter === 'ALL' || n.category === categoryFilter;
      return matchDistrict && matchCategory;
    });
  }, [notices, districtName, categoryFilter]);

  // Aggregated reach
  const totalRecipients = useMemo(() => {
    return districtNotices.reduce((acc, curr) => acc + curr.recipientCount, 0);
  }, [districtNotices]);

  // Fetch real notifications from backend if available
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await api.get<any[]>('/notifications');
      if (Array.isArray(res) && res.length > 0) {
        const mapped: PublicHealthNotice[] = res.map((r, idx) => ({
          id: String(r.id || `not-${idx}`),
          noticeId: r.notification_id || `NOTIF-${idx + 101}`,
          title: r.title,
          message: r.message,
          category: (r.type === 'Health Camp' ? 'HEALTH_CAMP' : 'DISEASE_ADVISORY') as any,
          district: r.district || 'Salem',
          targetScope: 'DISTRICT_SPECIFIC',
          targetArea: r.area || 'District Taluks',
          channels: Array.isArray(r.channels) ? r.channels : ['App', 'SMS'],
          recipientCount: r.recipients_count || 12500,
          status: 'DELIVERED',
          publishedAt: r.sent_at ? new Date(r.sent_at).toLocaleString() : '2026-10-30',
          deliverySuccessRate: 97.4
        }));
        setNotices([...mapped, ...MOCK_PUBLIC_HEALTH_NOTICES.filter(m => !mapped.some(x => x.title === m.title))]);
      }
    } catch {
      // Keep bundled mock notices
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleBroadcastNotice = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    const selectedChannels: ('App' | 'SMS' | 'IVR')[] = [];
    if (appChannel) selectedChannels.push('App');
    if (smsChannel) selectedChannels.push('SMS');
    if (ivrChannel) selectedChannels.push('IVR');

    const estRecipients = selectedChannels.includes('SMS') ? 24500 : 11200;

    const newNotice: PublicHealthNotice = {
      id: `not-${Date.now()}`,
      noticeId: `NOT-${(districtName || 'SLM').substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      title,
      message,
      category,
      district: districtName || 'Salem',
      targetScope,
      targetArea,
      channels: selectedChannels.length > 0 ? selectedChannels : ['App'],
      recipientCount: estRecipients,
      status: 'DELIVERED',
      publishedAt: new Date().toLocaleString(),
      deliverySuccessRate: 98.2
    };

    setNotices(prev => [newNotice, ...prev]);

    addAuditLog(
      `Public Health Broadcast Dispatched: "${title}"`,
      'District Notifications',
      `Target: ${targetArea} (${selectedChannels.join(', ')}). Delivered to ${estRecipients.toLocaleString()} citizens.`
    );

    setNotification(`Public Health Notice "${title}" broadcasted to ${estRecipients.toLocaleString()} residents.`);
    setTitle('');
    setMessage('');
    setActiveTab('history');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleExportCSV = () => {
    const headers = ['Notice ID', 'Title', 'Category', 'Target Area', 'Channels', 'Recipients', 'Status', 'Published At', 'Success Rate (%)'];
    const rows = districtNotices.map(n => [
      `"${n.noticeId}"`,
      `"${n.title}"`,
      `"${n.category}"`,
      `"${n.targetArea}"`,
      `"${n.channels.join('+')}"`,
      n.recipientCount,
      `"${n.status}"`,
      `"${n.publishedAt}"`,
      n.deliverySuccessRate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `District_${districtName || 'Salem'}_Notices_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog('Exported Public Health Notices Register', 'District Notifications', 'CSV Download');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                DISTRICT PUBLIC HEALTH BROADCAST
              </span>
              <span className="text-xs text-slate-300">
                {districtName || 'Salem'} Communication Network
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Public Health Notices & Citizen Advisories
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Dispatch targeted public health announcements, outbreak advisories, health camp notices, and voluntary blood donation appeals via CareBridge Patient App, SMS, and Voice IVR.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur border border-white/10 transition-colors"
            >
              <Download className="w-4 h-4 text-sky-300" />
              Export Register
            </button>
            <button
              onClick={() => setActiveTab('compose')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/30 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Compose Advisory
            </button>
          </div>
        </div>

        {/* Aggregate Reach Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-slate-400">Total Advisories Issued</span>
            <p className="text-xl font-bold text-white mt-0.5">{districtNotices.length}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-sky-300">Citizen Touchpoints Reached</span>
            <p className="text-xl font-bold text-sky-300 mt-0.5">{totalRecipients.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-emerald-300">Delivery Success Rate</span>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">97.6%</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-amber-300">Active Delivery Channels</span>
            <p className="text-xl font-bold text-amber-300 mt-0.5">App, SMS, IVR</p>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            Broadcast History ({districtNotices.length})
          </button>
          <button
            onClick={() => setActiveTab('compose')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'compose'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Send className="w-4 h-4" />
            Compose New Advisory
          </button>
        </div>

        {activeTab === 'history' && (
          <div className="flex items-center gap-2 pb-2">
            <span className="text-xs font-semibold text-slate-500">Filter Category:</span>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-slate-700 dark:text-slate-300"
            >
              <option value="ALL">All Categories</option>
              <option value="HEALTH_CAMP">Health Camp</option>
              <option value="DISEASE_ADVISORY">Disease Advisory</option>
              <option value="SERVICE_UPDATE">Service Update</option>
              <option value="VACCINATION">Vaccination</option>
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: Notice History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {districtNotices.map((n) => (
            <div
              key={n.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3 hover:border-sky-300 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                    {n.noticeId}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                    {n.category.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Target: {n.targetArea}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{n.publishedAt}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {n.status}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {n.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {n.message}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-sky-600" />
                    Channels: <strong className="text-slate-700 dark:text-slate-200">{n.channels.join(', ')}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    Delivered: <strong className="text-slate-700 dark:text-slate-200">{n.recipientCount.toLocaleString()}</strong>
                  </span>
                </div>
                <div>
                  Success Rate: <strong className="text-emerald-600 font-semibold">{n.deliverySuccessRate}%</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Compose Form */}
      {activeTab === 'compose' && (
        <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Send className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Broadcast Advisory to District Residents & CareBridge App
            </h3>
          </div>

          <form onSubmit={handleBroadcastNotice} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Advisory Category *
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                >
                  <option value="HEALTH_CAMP">Health Camp Announcement</option>
                  <option value="DISEASE_ADVISORY">Seasonal Disease / Epidemic Advisory</option>
                  <option value="SERVICE_UPDATE">Hospital / Blood Bank Emergency Update</option>
                  <option value="VACCINATION">Immunization / Pulse Polio Campaign</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Target Geographic Area *
                </label>
                <select
                  value={targetArea}
                  onChange={e => setTargetArea(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
                >
                  <option value="All Taluks — Salem District">All Taluks — Entire District</option>
                  <option value="Salem Urban Taluk">Salem Urban Taluk</option>
                  <option value="Omalur Taluk & Rural Blocks">Omalur Taluk & Rural Blocks</option>
                  <option value="Mettur Taluk & Industrial Belt">Mettur Taluk & Industrial Belt</option>
                  <option value="Attur Sub-Division">Attur Sub-Division</option>
                  <option value="Yercaud Tribal Hills">Yercaud Tribal Hills</option>
                  <option value="Sankari & Edappadi Blocks">Sankari & Edappadi Blocks</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Advisory Headline / Subject *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Free Eye & Diabetes Screening Camp at Omalur on Sunday"
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Notice Body / Advisory Message *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Details of the camp, preventive measures, dates, venues, or instructions for patients..."
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                Multi-Channel Delivery Options
              </label>
              <div className="flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={appChannel}
                    onChange={e => setAppChannel(e.target.checked)}
                    className="rounded text-sky-600"
                  />
                  <span>CareBridge Patient App Notification</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsChannel}
                    onChange={e => setSmsChannel(e.target.checked)}
                    className="rounded text-sky-600"
                  />
                  <span>Telco SMS Gateway Broadcast</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ivrChannel}
                    onChange={e => setIvrChannel(e.target.checked)}
                    className="rounded text-sky-600"
                  />
                  <span>Automated Voice Call (IVR)</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition-all"
              >
                <Send className="w-4 h-4" />
                Broadcast Notice Now
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
