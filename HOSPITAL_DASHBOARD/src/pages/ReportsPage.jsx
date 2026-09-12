import { useState } from 'react';
import {
  FileText, Download, Filter, Calendar, Building2,
  CheckCircle2, Sparkles, Printer, FileSpreadsheet, ArrowRight
} from 'lucide-react';
import { REPORTS_CATALOG, DEPARTMENTS, HOSPITAL_INFO } from '../data/mockData';
import { useToast } from '../components/Toast';

export default function ReportsPage() {
  const toast = useToast();
  const [selectedReport, setSelectedReport] = useState(REPORTS_CATALOG[0]);
  const [dateRange, setDateRange] = useState('today');
  const [deptFilter, setDeptFilter] = useState('All');
  const [exporting, setExporting] = useState(false);

  function handleExport(format) {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      // Client-side CSV generation & download
      const csvContent = `data:text/csv;charset=utf-8,CareBridge Hospital Report - ${selectedReport.title}\nHospital,${HOSPITAL_INFO.name}\nDate,${new Date().toLocaleDateString()}\nDepartment,${deptFilter}\nFormat,${format}\n\nMetric,Value,Benchmark,Status\nTotal Patients,1248,1100,Normal\nOPD Queue,186,150,Elevated\nBed Occupancy,74.4%,85%,Optimal\nPerformance Score,86/100,80/100,Grade A\nDiagnostic Turnaround,45 min,20 min,Bottleneck\n`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${selectedReport.id}_${selectedReport.title.replace(/\s+/g, '_')}_${Date.now()}.${format.toLowerCase() === 'pdf' ? 'txt' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast?.success?.(`${selectedReport.title} downloaded as ${format.toUpperCase()}`);
    }, 500);
  }

  return (
    <div className="fade-in" style={{ paddingBottom: 32 }}>
      {/* ── Page Header ────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
            Hospital Reports & Analytics Export Center
          </div>
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            Official government health intelligence reports for district administrators, NABH audits, and state monitoring
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => handleExport('csv')}
            disabled={exporting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              background: '#0EA5E9',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(14,165,233,0.35)'
            }}
          >
            <Download size={14} />
            <span>{exporting ? 'Generating...' : 'Export Selected Report (CSV)'}</span>
          </button>
        </div>
      </div>

      {/* ── Filters Bar (Section 32) ────────────────────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          padding: '14px 18px',
          border: '1px solid #E2E8F0',
          marginBottom: 18,
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Calendar size={15} color="#64748B" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Period:</span>
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 600, outline: 'none' }}
          >
            <option value="today">Today (Monday, Sep 7, 2026)</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Past 7 Days</option>
            <option value="month">Current Month (September 2026)</option>
            <option value="quarter">Q3 2026</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Building2 size={15} color="#64748B" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Department:</span>
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 600, outline: 'none' }}
          >
            <option value="All">All Departments (Consolidated)</option>
            {DEPARTMENTS.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Status:</span>
          <select
            style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 600, outline: 'none' }}
          >
            <option>All Statuses</option>
            <option>Approved / Finalized</option>
            <option>Draft Audit Record</option>
          </select>
        </div>
      </div>

      {/* ── 10 Reports Catalog (Section 32) ──────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {REPORTS_CATALOG.map(rep => {
          const isSelected = selectedReport.id === rep.id;

          return (
            <div
              key={rep.id}
              onClick={() => setSelectedReport(rep)}
              style={{
                background: '#FFFFFF',
                borderRadius: 12,
                padding: '18px',
                border: isSelected ? '2px solid #0EA5E9' : '1px solid #E2E8F0',
                boxShadow: isSelected ? '0 4px 14px rgba(14, 165, 233, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.12s ease-in-out'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#0EA5E9', background: '#E0F2FE', padding: '2px 7px', borderRadius: 4, textTransform: 'uppercase' }}>
                    {rep.category}
                  </span>
                  <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>{rep.id}</span>
                </div>

                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
                  {rep.title}
                </div>

                <div style={{ fontSize: '11.5px', color: '#64748B', lineHeight: 1.4, marginBottom: 14 }}>
                  {rep.desc}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
                <span style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>
                  Formats: <strong>{rep.format}</strong>
                </span>

                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedReport(rep);
                      handleExport('csv');
                    }}
                    style={{
                      padding: '5px 9px',
                      borderRadius: 6,
                      background: '#F0F9FF',
                      border: '1px solid #BAE6FD',
                      color: '#0284C7',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <Download size={12} />
                    <span>CSV</span>
                  </button>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedReport(rep);
                      handleExport('pdf');
                    }}
                    style={{
                      padding: '5px 9px',
                      borderRadius: 6,
                      background: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      color: '#334155',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
