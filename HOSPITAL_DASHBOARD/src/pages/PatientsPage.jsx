import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoleNav } from '../hooks/useRoleNav';
import { Search, Eye } from 'lucide-react';
import { PATIENTS, DEPARTMENTS } from '../data/mockData';
import PatientSearchGateway from '../components/PatientSearchGateway';

const STATUS_FILTERS = [
  'All', 'Waiting', 'Under Consultation', 'Admitted',
  'Diagnostic', 'Pharmacy', 'Referred'
];

export default function PatientsPage() {
  const navigate = useNavigate();
  const { path } = useRoleNav();

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [activePatient, setActivePatient] = useState(null);

  const filtered = PATIENTS.filter(p => {
    // If a patient was searched via the common gateway, strictly show that matching patient
    if (activePatient) {
      return p.id === activePatient.id;
    }

    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      (p.opId && p.opId.toLowerCase().includes(q)) ||
      (p.abhaId && p.abhaId.toLowerCase().includes(q)) ||
      p.id.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      (p.diagnosis && p.diagnosis.toLowerCase().includes(q));

    const matchStatus =
      activeFilter === 'All' ||
      (activeFilter === 'Admitted' && (p.status === 'Admitted' || p.ward !== 'OPD')) ||
      (activeFilter === 'Waiting' && p.status === 'Waiting') ||
      (activeFilter === 'Discharged' && p.status === 'Discharged') ||
      p.status === activeFilter;

    const matchDept = selectedDept === 'All' || p.dept === selectedDept;

    return matchSearch && matchStatus && matchDept;
  });

  return (
    <div className="fade-in" style={{ paddingBottom: 32 }}>
      {/* ── Page Header ────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
            All Patients
          </div>
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            Centralized patient management, OP ID, and ABHA ID record access
          </div>
        </div>
      </div>

      {/* ── Common Patient Identification Gateway ─────────────── */}
      <PatientSearchGateway
        title="Patient Identification & Access"
        subtitle="Search and retrieve patient record using either OP ID (e.g. OP2026001) or ABHA ID (e.g. ABHA10001)"
        actionLabel="View Full Profile"
        selectedPatient={activePatient}
        onPatientSelect={(patient) => {
          setActivePatient(patient);
        }}
        onAction={(patient) => {
          navigate(path(`patients/${patient.id}`));
        }}
        onClear={() => {
          setActivePatient(null);
        }}
      />

      {/* ── Search & Filters ─────────────────────────────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          padding: '14px 18px',
          border: '1px solid #E2E8F0',
          marginBottom: 16
        }}
      >
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
          {/* Quick Search bar */}
          <div style={{ flex: 1, minWidth: 240, display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 8, border: '1.5px solid #CBD5E1', background: '#F8FAFC' }}>
            <Search size={15} color="#94A3B8" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter list by OP ID, ABHA ID, Patient ID, or Name..."
              style={{ border: 'none', outline: 'none', fontSize: '12.5px', background: 'transparent', width: '100%', color: '#0F172A' }}
            />
          </div>

          {/* Department Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748B' }}>Department:</span>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              style={{ padding: '7px 10px', borderRadius: 8, border: '1.5px solid #CBD5E1', fontSize: '12px', fontWeight: 600, color: '#0F172A', outline: 'none' }}
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: '11.5px',
                fontWeight: activeFilter === f ? 700 : 500,
                border: activeFilter === f ? '1px solid #0284C7' : '1px solid #E2E8F0',
                background: activeFilter === f ? '#E0F2FE' : '#FFFFFF',
                color: activeFilter === f ? '#0284C7' : '#64748B',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Patient Records Table ─────────────────────────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 16px' }}>OP ID</th>
                <th style={{ padding: '12px 16px' }}>Patient ID</th>
                <th style={{ padding: '12px 16px' }}>Patient Name</th>
                <th style={{ padding: '12px 16px' }}>ABHA ID</th>
                <th style={{ padding: '12px 16px' }}>Reg Date</th>
                <th style={{ padding: '12px 16px' }}>Department & Care Team</th>
                <th style={{ padding: '12px 16px' }}>Diagnosis</th>
                <th style={{ padding: '12px 16px' }}>Current Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '36px', textAlign: 'center', color: '#64748B' }}>
                    <div style={{ fontSize: '28px', marginBottom: 6 }}>🔍</div>
                    <div style={{ fontWeight: 600 }}>No patients found matching your search.</div>
                    <div style={{ fontSize: '11.5px', marginTop: 4 }}>Try searching with OP ID (e.g. OP2026001), ABHA ID (e.g. ABHA10001), or Name.</div>
                  </td>
                </tr>
              ) : (
                filtered.map((p, idx) => (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      background: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                      transition: 'background 0.1s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F0F9FF'}
                    onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA'}
                  >
                    {/* OP ID */}
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 8px', background: '#E0F2FE', color: '#0369A1', borderRadius: 6, fontWeight: 800, fontSize: '12px', fontFamily: 'monospace', border: '1px solid #BAE6FD' }}>
                        {p.opId || 'OP2026001'}
                      </span>
                    </td>

                    {/* Patient ID */}
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0EA5E9', fontFamily: 'monospace' }}>
                      {p.id}
                    </td>

                    {/* Patient Name & Demographics */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '13px' }}>{p.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>
                        {p.age} yrs · {p.gender} · Blood: <strong>{p.blood}</strong>
                      </div>
                    </td>

                    {/* ABHA ID */}
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 8px', background: '#EDE9FE', color: '#5B21B6', borderRadius: 6, fontWeight: 700, fontSize: '11.5px', fontFamily: 'monospace', border: '1px solid #DDD6FE' }}>
                        {p.abhaId || 'ABHA10001'}
                      </span>
                    </td>

                    {/* Reg Date */}
                    <td style={{ padding: '12px 16px', color: '#475569', fontSize: '12px' }}>
                      {p.regDate || '2026-09-05'}
                    </td>

                    {/* Department & Doctor */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{p.dept}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>
                        {p.doctor ? `Doc: ${p.doctor}` : 'General Duty'}
                      </div>
                    </td>

                    {/* Diagnosis */}
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: '#F1F5F9', padding: '2px 8px', borderRadius: 4, fontSize: '11px', fontWeight: 600, color: '#334155' }}>
                        {p.diagnosis || 'Clinical evaluation'}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background:
                            p.status === 'Critical' ? '#FEE2E2' :
                            p.status === 'Admitted' ? '#E0F2FE' :
                            p.status === 'Discharged' ? '#DCFCE7' :
                            p.status === 'Emergency' ? '#FFEDD5' : '#F1F5F9',
                          color:
                            p.status === 'Critical' ? '#991B1B' :
                            p.status === 'Admitted' ? '#0369A1' :
                            p.status === 'Discharged' ? '#15803D' :
                            p.status === 'Emergency' ? '#C2410C' : '#475569'
                        }}
                      >
                        {p.status}
                      </span>
                    </td>

                    {/* Action: Open Profile */}
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => navigate(path(`patients/${p.id}`))}
                        style={{
                          padding: '5px 10px',
                          borderRadius: 6,
                          background: '#F0F9FF',
                          border: '1px solid #BAE6FD',
                          color: '#0284C7',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <Eye size={12} />
                        <span>View Profile</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
