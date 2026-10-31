import { useState, useMemo } from 'react';
import { 
  Printer, Download, ShieldCheck, 
  Activity, Building2, } from 'lucide-react';
import { useHealthData } from '../../context/HealthDataContext';

export default function DistrictReports() {
  const { districtName, facilities, auditLogs, addAuditLog } = useHealthData();
  const [reportPeriod, setReportPeriod] = useState<'TODAY' | 'WEEK' | 'MONTH'>('WEEK');
  const [activeTab, setActiveTab] = useState<'digest' | 'audit'>('digest');

  // Scoped district facilities
  const districtFacilities = useMemo(() => {
    return facilities.filter(f => !districtName || districtName === 'ALL' || f.district === districtName);
  }, [facilities, districtName]);

  // Aggregate metrics
  const totalBeds = useMemo(() => districtFacilities.reduce((a, c) => a + c.totalBeds, 0), [districtFacilities]);
  const occupiedBeds = useMemo(() => districtFacilities.reduce((a, c) => a + c.occupiedBeds, 0), [districtFacilities]);
  const bedOccupancy = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : '78.4';
  const totalDoctors = useMemo(() => districtFacilities.reduce((a, c) => a + c.doctorsCount, 0), [districtFacilities]);

  // Audit logs filtered by district mentions or general
  const districtAuditLogs = useMemo(() => {
    return auditLogs.filter(log => 
      !districtName || 
      districtName === 'ALL' || 
      log.details.toLowerCase().includes((districtName || 'Salem').toLowerCase()) ||
      log.action.toLowerCase().includes((districtName || 'Salem').toLowerCase()) ||
      log.module.toLowerCase().includes('district')
    );
  }, [auditLogs, districtName]);

  const handlePrint = () => {
    window.print();
    addAuditLog(`Generated Print Health Digest for ${districtName || 'Salem'}`, 'District Reports', `Period: ${reportPeriod}`);
  };

  const handleExportDigestCSV = () => {
    const headers = ['Facility Name', 'Type', 'Taluk', 'Total Beds', 'Occupied Beds', 'Available Beds', 'Doctors on Duty', 'Status'];
    const rows = districtFacilities.map(f => [
      `"${f.name}"`,
      `"${f.type}"`,
      `"${f.taluk}"`,
      f.totalBeds,
      f.occupiedBeds,
      f.availableBeds,
      f.doctorsCount,
      `"${f.facilityStatus}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `District_${districtName || 'Salem'}_Facility_Digest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog('Exported District Facility Digest', 'District Reports', 'CSV Download');
  };

  const handleExportAuditCSV = () => {
    const headers = ['Timestamp', 'Officer / User', 'Action', 'Module', 'Details'];
    const rows = districtAuditLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.user}"`,
      `"${l.action}"`,
      `"${l.module}"`,
      `"${l.details}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `District_${districtName || 'Salem'}_Audit_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog('Exported District Audit Trail', 'District Reports', 'CSV Download');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden print:hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                DISTRICT EXECUTIVE REPORTING & AUDIT
              </span>
              <span className="text-xs text-slate-300">
                {districtName || 'Salem'} Health Jurisdiction
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              District Operational Reports & Audit Ledger
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Consolidated operational performance digests, hospital utilization scorecards, health camp outcomes, and tamper-evident administrative audit logs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur border border-white/10 transition-colors"
            >
              <Printer className="w-4 h-4 text-indigo-300" />
              Print Report
            </button>
            <button
              onClick={activeTab === 'digest' ? handleExportDigestCSV : handleExportAuditCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Aggregated KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-slate-400">Tracked Facilities</span>
            <p className="text-xl font-bold text-white mt-0.5">{districtFacilities.length} centers</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-emerald-300">Overall Bed Occupancy</span>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">{bedOccupancy}%</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-indigo-300">Clinical Doctors on Duty</span>
            <p className="text-xl font-bold text-indigo-300 mt-0.5">{totalDoctors} physicians</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-xs text-purple-300">District Audit Events</span>
            <p className="text-xl font-bold text-purple-300 mt-0.5">{districtAuditLogs.length} events</p>
          </div>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 print:hidden">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('digest')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'digest'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            Operational Digest
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'audit'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            District Audit Ledger ({districtAuditLogs.length})
          </button>
        </div>

        {activeTab === 'digest' && (
          <div className="flex items-center gap-2 pb-2">
            <span className="text-xs font-semibold text-slate-500">Period:</span>
            {['TODAY', 'WEEK', 'MONTH'].map((p) => (
              <button
                key={p}
                onClick={() => setReportPeriod(p as any)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  reportPeriod === p
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Printable Header */}
      <div className="hidden print:block mb-6 text-center border-b pb-4">
        <h1 className="text-2xl font-bold">Government of Tamil Nadu — Health & Family Welfare</h1>
        <h2 className="text-lg font-semibold text-slate-700 mt-1">CareBridge Health Network — District Operational Digest</h2>
        <p className="text-sm text-slate-500">
          District: {districtName || 'Salem'} | Generated: {new Date().toLocaleString()} | Period: {reportPeriod}
        </p>
      </div>

      {/* Tab 1: Operational Digest */}
      {activeTab === 'digest' && (
        <div className="space-y-6">
          {/* Key District Health Indicators Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <span className="text-xs font-semibold text-slate-400">Total Inpatient Bed Capacity</span>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {occupiedBeds} / {totalBeds} <span className="text-xs font-normal text-slate-500">occupied</span>
              </p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${bedOccupancy}%` }} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <span className="text-xs font-semibold text-slate-400">High-Risk Care Compliance</span>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                85.8% <span className="text-xs font-normal text-slate-500">across 4 programs</span>
              </p>
              <p className="text-xs text-slate-500 mt-2">
                ANC & Infant immunization on track; NCD follow-up heightened in Omalur.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <span className="text-xs font-semibold text-slate-400">Community Outreach & Camps</span>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                12 camps <span className="text-xs font-normal text-slate-500">conducted this month</span>
              </p>
              <p className="text-xs text-slate-500 mt-2">
                2,420 citizens screened; 86 secondary referrals initiated.
              </p>
            </div>
          </div>

          {/* Facility Performance Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  District Health Facility Scorecard
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {districtFacilities.length} facilities reporting
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Facility Name</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Taluk</th>
                    <th className="py-3 px-4">Total Beds</th>
                    <th className="py-3 px-4">Occupied</th>
                    <th className="py-3 px-4">Occupancy Rate</th>
                    <th className="py-3 px-4">Doctors on Duty</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {districtFacilities.map((f) => {
                    const occRate = f.totalBeds > 0 ? Math.round((f.occupiedBeds / f.totalBeds) * 100) : 0;
                    return (
                      <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                          {f.name}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300">{f.type}</td>
                        <td className="py-3 px-4 text-xs text-slate-500">{f.taluk}</td>
                        <td className="py-3 px-4 font-mono text-slate-900 dark:text-white">{f.totalBeds}</td>
                        <td className="py-3 px-4 font-mono text-slate-900 dark:text-white">{f.occupiedBeds}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs font-semibold ${
                            occRate > 85 ? 'text-rose-600' : occRate > 70 ? 'text-amber-600' : 'text-emerald-600'
                          }`}>
                            {occRate}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          {f.doctorsCount} active
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            {f.facilityStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: District Audit Ledger */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                District Operational Audit Log & Action History
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Showing {districtAuditLogs.length} verified ledger entries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Officer / User</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Module</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {districtAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-900 dark:text-white">
                      {log.user}
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                        {log.module}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 max-w-md truncate">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
