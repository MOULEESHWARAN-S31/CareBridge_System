import { useState } from 'react';
import { 
  FileBarChart, Download, FileText, CheckCircle2, Clock, Sparkles, RefreshCw, Printer
} from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';

export default function Reports() {
  const { districts, facilities, addAuditLog, userRole, officerName } = useHealthData();

  const [reportType, setReportType] = useState('Comprehensive District Healthcare Summary');
  const [selectedDistrict, setSelectedDistrict] = useState('Salem');
  const [selectedFacility, setSelectedFacility] = useState('ALL');
  const [dateRange, setDateRange] = useState('September 2026 (Monthly)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSuccess, setGeneratedSuccess] = useState<string | null>(null);

  const reportOptions = [
    'Comprehensive District Healthcare Summary',
    'Epidemiological Disease Surveillance & Outbreak Dossier',
    'Hospital Bed & Critical ICU Occupancy Audit',
    'Doctor & Specialist Clinical Roster Allocation',
    'Essential Medicine Buffer & Stockout Forecast',
    'Diagnostic Test Capacities & Turnaround Report',
    'Patient Registrations & Demographics Dossier',
    'Government Healthcare Scheme Utilization (PM-JAY)',
    'Healthcare Accessibility & District Ranking Dossier'
  ];

  const handleGenerateReport = (format: 'PDF' | 'CSV' | 'Excel') => {
    setIsGenerating(true);
    setGeneratedSuccess(null);

    setTimeout(() => {
      setIsGenerating(false);
      const filename = `TN_Govt_${reportType.replace(/\s+/g, '_')}_${Date.now().toString().slice(-4)}.${format.toLowerCase() === 'excel' ? 'xlsx' : format.toLowerCase()}`;
      addAuditLog(`Generated & Exported ${format} Report: ${reportType}`, 'Reports Module', `Downloaded by ${officerName} for ${selectedDistrict} District.`);
      setGeneratedSuccess(`Successfully created and downloaded '${filename}' (${format} format). Ready for administrative review.`);
      setTimeout(() => setGeneratedSuccess(null), 6000);
    }, 700);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-emerald-600" />
            <span>Government Healthcare Reports & Export Engine</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate official executive summaries, SLA audits & telemetry exports across all administrative levels
          </p>
        </div>

        <div className="text-xs bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-emerald-800 font-medium">
          Authorized Officer: <strong className="text-emerald-700">{officerName} ({userRole})</strong>
        </div>
      </div>

      {generatedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{generatedSuccess}</span>
        </div>
      )}

      {/* Report Generator Controls Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Configurable Administrative Report Builder</span>
            </h3>
            <p className="text-[11px] text-slate-500">Select parameters, geographic scope and output export format</p>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
            Official Govt Format
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Report Type */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Select Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {reportOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* District Scope */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Geographical District Scope</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Districts (Statewide Consolidated)</option>
              {districts.map(d => (
                <option key={d.id} value={d.name}>{d.name} District</option>
              ))}
            </select>
          </div>

          {/* Facility Scope */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Facility Filter (Optional)</label>
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Facilities in Selected District</option>
              {facilities.map(f => (
                <option key={f.id} value={f.name}>{f.name}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Audit Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="Today (Live Telemetry)">Today (Live 24h Telemetry)</option>
              <option value="Past 7 Days (Weekly Review)">Past 7 Days (Weekly Review)</option>
              <option value="September 2026 (Monthly)">September 2026 (Monthly Dossier)</option>
              <option value="Q3 2026 (Quarterly Performance)">Q3 2026 (Quarterly Performance)</option>
            </select>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500">
            Selected: <strong className="text-slate-800">{reportType}</strong> ({selectedDistrict})
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleGenerateReport('PDF')}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
            >
              {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>Download Official PDF</span>
            </button>

            <button
              onClick={() => handleGenerateReport('CSV')}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => handleGenerateReport('Excel')}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scheduled Reports & Download History */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span>Recently Dispatched & Scheduled Automated Government Reports</span>
        </h3>

        <div className="space-y-2.5 text-xs">
          {[
            { name: 'Monthly Healthcare Accessibility Score Dossier', district: 'Salem', time: 'Today 08:30 AM', officer: 'Dr. S. Kumar', size: '2.4 MB PDF' },
            { name: 'Weekly Medicine Buffer & Stockout Forecast', district: 'Tamil Nadu Statewide', time: 'Yesterday 17:00 PM', officer: 'TNMSC State Depot', size: '1.8 MB CSV' },
            { name: 'Epidemiological Disease Surveillance & Outbreak Analysis', district: 'Salem & Dharmapuri', time: 'Sept 5, 2026', officer: 'DHO Command Hub', size: '3.1 MB PDF' },
            { name: 'Universal Immunization & Maternal Care Log', district: 'Yercaud Tribal Block', time: 'Sept 4, 2026', officer: 'MCH Coordinator', size: '1.2 MB PDF' }
          ].map((rep, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
              <div>
                <span className="font-bold text-slate-900 block">{rep.name}</span>
                <span className="text-[11px] text-slate-500">{rep.district} • Generated by {rep.officer}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-[11px] font-mono">{rep.time}</span>
                <span className="text-[10px] font-mono font-bold bg-white text-emerald-700 px-2 py-1 rounded border border-slate-200 shadow-xs">
                  {rep.size}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
