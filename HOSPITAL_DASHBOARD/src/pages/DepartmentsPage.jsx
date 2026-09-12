import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Users, Stethoscope, Bed, FlaskConical,
  Activity, ArrowRight, Search, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { DEPARTMENTS } from '../data/mockData';
import { useRoleNav } from '../hooks/useRoleNav';

export default function DepartmentsPage() {
  const navigate = useNavigate();
  const { path } = useRoleNav();
  const [search, setSearch] = useState('');

  const filtered = DEPARTMENTS.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.head.toLowerCase().includes(search.toLowerCase())
  );

  const totalPatients = DEPARTMENTS.reduce((sum, d) => sum + d.patients, 0);
  const totalDoctors = DEPARTMENTS.reduce((sum, d) => sum + d.doctors, 0);
  const totalBeds = DEPARTMENTS.reduce((sum, d) => sum + d.beds, 0);

  return (
    <div className="fade-in" style={{ paddingBottom: 32 }}>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
            Clinical & Operational Department Management
          </div>
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            Workload distribution, doctor allocation, bed status, and diagnostic queues across all 13 hospital departments
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '11px', background: '#E0F2FE', color: '#0369A1', padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}>
            13 Official Departments
          </span>
        </div>
      </div>

      {/* ── Summary Stats ────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 18 }}>
        <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Active Clinical Nodes</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginTop: 2 }}>13</div>
          <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>100% Operational Today</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Department Patients</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0EA5E9', marginTop: 2 }}>{totalPatients.toLocaleString()}</div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>Inpatient + Outpatient</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Clinical Staff on Duty</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#10B981', marginTop: 2 }}>{totalDoctors}</div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>Specialists & Residents</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Dedicated Beds</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#8B5CF6', marginTop: 2 }}>{totalBeds}</div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>Allocated across wards</div>
        </div>
      </div>

      {/* ── Search Bar ───────────────────────────────────────────── */}
      <div style={{ background: '#FFFFFF', padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Search size={15} color="#94A3B8" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter departments by name or head of department..."
          style={{ border: 'none', outline: 'none', fontSize: '12.5px', background: 'transparent', width: '100%', color: '#0F172A' }}
        />
      </div>

      {/* ── 13 Departments Grid (Section 14) ─────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 14 }}>
        {filtered.map(dept => (
          <div
            key={dept.id}
            style={{
              background: '#FFFFFF',
              borderRadius: 12,
              padding: '18px 20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.12s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                    {dept.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: 1 }}>
                    Head: <strong>{dept.head}</strong>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 4,
                    background: dept.workload > 85 ? '#FEE2E2' : '#DCFCE7',
                    color: dept.workload > 85 ? '#991B1B' : '#166534'
                  }}
                >
                  {dept.workload}% Load
                </span>
              </div>

              {/* Workload Progress Bar */}
              <div style={{ width: '100%', height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden', margin: '8px 0 12px' }}>
                <div
                  style={{
                    width: `${dept.workload}%`,
                    height: '100%',
                    background: dept.workload > 85 ? '#DC2626' : dept.color || '#0EA5E9',
                    borderRadius: 3
                  }}
                />
              </div>

              {/* Key Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, background: '#F8FAFC', padding: '10px', borderRadius: 8, fontSize: '11.5px', marginBottom: 12 }}>
                <div>
                  <span style={{ color: '#64748B' }}>Doctors on Duty:</span>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>{dept.doctors} Specialists</div>
                </div>
                <div>
                  <span style={{ color: '#64748B' }}>Active Patients:</span>
                  <div style={{ fontWeight: 700, color: '#0EA5E9' }}>{dept.patients} Patients</div>
                </div>
                <div>
                  <span style={{ color: '#64748B' }}>Waiting Queue:</span>
                  <div style={{ fontWeight: 700, color: dept.waiting > 15 ? '#DC2626' : '#D97706' }}>
                    {dept.waiting} in Queue
                  </div>
                </div>
                <div>
                  <span style={{ color: '#64748B' }}>Available Beds:</span>
                  <div style={{ fontWeight: 700, color: '#16A34A' }}>
                    {dept.beds > 0 ? `${dept.beds} Beds` : 'Outpatient Only'}
                  </div>
                </div>
              </div>

              {dept.pendingLab > 0 && (
                <div style={{ fontSize: '11px', color: '#B45309', background: '#FEF3C7', padding: '4px 8px', borderRadius: 4, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FlaskConical size={12} />
                  <span>{dept.pendingLab} pending diagnostic/imaging requests</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              <button
                onClick={() => navigate(path('patients'))}
                style={{
                  flex: 1,
                  padding: '7px',
                  borderRadius: 6,
                  background: '#F0F9FF',
                  border: '1px solid #BAE6FD',
                  color: '#0284C7',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                View Patients
              </button>
              <button
                onClick={() => navigate(path('doctors'))}
                style={{
                  padding: '7px 12px',
                  borderRadius: 6,
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  color: '#334155',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Roster
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
