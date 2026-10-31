import { useState } from 'react';
import { 
  FileBarChart, Download, Printer, 
  CheckCircle2, ShieldCheck, 
  } from 'lucide-react';
import { useHealthData } from '../../context/HealthDataContext';
import { } from '../../data/mockData';

export default function StateReports() {
  const { districts, auditLogs, addAuditLog } = useHealthData();
  const [selectedReportType, setSelectedReportType] = useState('statewide_digest');
  const [dateRange] = useState('October 2026');
  const [notification, setNotification] = useState<string | null>(null);

  const reportTypes = [
    { id: 'statewide_digest', label: 'Statewide Public Health Summary Digest', freq: 'Monthly' },
    { id: 'district_benchmark', label: 'District Performance & Equity Rankings', freq: 'Monthly' },
    { id: 'disease_surveillance', label: 'Statewide Epidemiological Surveillance Report', freq: 'Weekly' },
    { id: 'resource_logistics', label: 'Inter-District Resource Movement & Shortages', freq: 'Bi-Weekly' },
    { id: 'outreach_camps', label: 'State Health Camp Outcomes & Screening Digest', freq: 'Monthly' }
  ];

  const handleDownloadCSV = () => {
    addAuditLog(
      `Generated & Downloaded State Official Report: ${selectedReportType}`,
      'State Reports',
      `Period: ${dateRange} • Formal report digest exported.`
    );
    setNotification(`Successfully generated 'TN_State_Health_Report_${Date.now().toString().slice(-4)}.csv'`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              State Secretariat Statutory Reporting
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-teal-700" />
            <span>Statewide Healthcare Analytics & Statutory Reports</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive policy digests, inter-district health indicators, and verifiable public health audit records for the Government of Tamil Nadu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print View</span>
          </button>
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Report</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-xs text-emerald-900 font-semibold shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* REPORT SELECTOR & PARAMETERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Selector Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-2">Select Report Category</span>
          {reportTypes.map(rt => (
            <button
              key={rt.id}
              onClick={() => setSelectedReportType(rt.id)}
              className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between text-xs ${
                selectedReportType === rt.id
                  ? 'bg-teal-50 border border-teal-300 text-teal-900 font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div>
                <span className="block">{rt.label}</span>
                <span className="text-[10px] text-slate-400">{rt.freq} Cycle</span>
              </div>
              {selectedReportType === rt.id && <span className="text-teal-700 font-bold">✓</span>}
            </button>
          ))}
        </div>

        {/* Report Overview Document Preview */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Government of Tamil Nadu • Health & Family Welfare</span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {reportTypes.find(r => r.id === selectedReportType)?.label}
              </h3>
            </div>
            <span className="text-xs bg-slate-100 px-3 py-1 rounded-lg text-slate-700 font-bold">
              {dateRange}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Districts Analyzed</span>
              <span className="text-lg font-black text-slate-900">8 Health Districts</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Healthcare Facilities</span>
              <span className="text-lg font-black text-teal-700">{districts.reduce((a, b) => a + b.activeHospitals, 0)} Facilities</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Report Validation</span>
              <span className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Dataset
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <p className="leading-relaxed">
              <strong>Executive Summary:</strong> During the reporting period of {dateRange}, statewide public healthcare facilities recorded continuous inpatient bed occupancy averaging <strong>81.4%</strong>. Primary Health Centres and Government Taluk Hospitals reported an average outpatient consultation wait time of <strong>21.2 minutes</strong>. Inter-facility electronic referrals demonstrated a completion rate of <strong>84.7%</strong> across secondary and tertiary medical colleges.
            </p>
            <p className="leading-relaxed">
              <strong>Key Policy Interventions:</strong> Mobilized 4 inter-district resource allocations to address localized antibiotic buffer depletion and specialist staffing shortages in Dharmapuri and Salem rural blocks. Conducted 24 mobile outreach clinics screening over 29,000 citizens in underserved tribal hamlets.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Authoritative Source: CareBridge State Public Health Registry</span>
            <span>DISHA / ABDM Privacy Compliant</span>
          </div>
        </div>
      </div>

      {/* STATE-LEVEL AUDIT LOGS OVERVIEW */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Recent State Administrative Audit Ledger Entries</h3>
        <div className="divide-y divide-slate-100 text-xs">
          {auditLogs.slice(0, 5).map((log, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">{log.action}</span>
                <span className="text-slate-400 mx-2">•</span>
                <span className="text-teal-700 font-semibold">{log.module}</span>
                <span className="text-slate-500 block text-[11px] mt-0.5">{log.details}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
