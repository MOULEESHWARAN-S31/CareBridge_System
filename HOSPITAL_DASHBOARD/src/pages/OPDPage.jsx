import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ClipboardList, Clock, CheckCircle, ArrowLeftRight, Search,
  Plus, RefreshCw, Volume2, UserCheck, Stethoscope, Play
} from 'lucide-react';
import { APPOINTMENTS, DEPARTMENTS, DOCTORS } from '../data/mockData';
import { useRoleNav } from '../hooks/useRoleNav';
import { useToast } from '../components/Toast';

export default function OPDPage() {
  const navigate = useNavigate();
  const { path } = useRoleNav();
  const toast = useToast();

  const [currentToken, setCurrentToken] = useState('A102');
  const [tokenNotice, setTokenNotice] = useState('');
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Initial OPD Queue
  const [queue, setQueue] = useState([
    { token: 'A101', patient: 'Patient 001 (Ravi Kumar)', dept: 'General Medicine', doctor: 'Dr. Priya Sharma', status: 'In Consultation', waitTime: '12 min', room: 'Room 1' },
    { token: 'A102', patient: 'Patient 002 (Meena Devi)', dept: 'Cardiology', doctor: 'Dr. Suresh Iyer', status: 'Consultation', waitTime: '18 min', room: 'Room 4' },
    { token: 'A103', patient: 'Patient 003 (Arun Prakash)', dept: 'Pediatrics', doctor: 'Dr. Kavitha Menon', status: 'Waiting', waitTime: '24 min', room: 'Room 2' },
    { token: 'A104', patient: 'Patient 004 (Kavitha Raj)', dept: 'General Medicine', doctor: 'Dr. Priya Sharma', status: 'Waiting', waitTime: '30 min', room: 'Room 1' },
    { token: 'A105', patient: 'Patient 005 (Deepak Sharma)', dept: 'Cardiology', doctor: 'Dr. Suresh Iyer', status: 'Waiting', waitTime: '36 min', room: 'Room 4' },
    { token: 'A106', patient: 'Patient 006 (Lakshmi Bai)', dept: 'Gynecology', doctor: 'Dr. Sunita Rao', status: 'Waiting', waitTime: '42 min', room: 'Room 3' },
    { token: 'A107', patient: 'Patient 007 (Radha Nair)', dept: 'Orthopedics', doctor: 'Dr. Mohan Das', status: 'Waiting', waitTime: '45 min', room: 'Room 5' },
    { token: 'A108', patient: 'Patient 008 (Arjun Menon)', dept: 'Pediatrics', doctor: 'Dr. Kavitha Menon', status: 'Waiting', waitTime: '48 min', room: 'Room 2' },
  ]);

  function handleCallNextPatient() {
    const nextWait = queue.find(q => q.status === 'Waiting');
    if (nextWait) {
      setCurrentToken(nextWait.token);
      setQueue(prev => prev.map(item =>
        item.token === nextWait.token ? { ...item, status: 'In Consultation' } : item
      ));
      setTokenNotice(`Calling Token ${nextWait.token} — ${nextWait.patient} to ${nextWait.room} (${nextWait.doctor})`);
      toast?.success?.(`Token ${nextWait.token} announced`);
      setTimeout(() => setTokenNotice(''), 5000);
    } else {
      toast?.info?.('All waiting patients have been called.');
    }
  }

  function handleStatusChange(token, newStatus) {
    setQueue(prev => prev.map(item =>
      item.token === token ? { ...item, status: newStatus } : item
    ));
    toast?.success?.(`Token ${token} marked as ${newStatus}`);
  }

  const filteredQueue = queue.filter(item => {
    const matchSearch =
      item.patient.toLowerCase().includes(search.toLowerCase()) ||
      item.token.toLowerCase().includes(search.toLowerCase()) ||
      item.doctor.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'All' || item.dept === deptFilter;
    const matchStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  return (
    <div className="fade-in" style={{ paddingBottom: 32 }}>
      {/* ── Page Header ────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
            OPD Queue Management & Token Calling
          </div>
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            Live outpatient dispensary queue for Government District Hospital Salem
          </div>
        </div>

        <button
          onClick={handleCallNextPatient}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 8,
            background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(14, 165, 233, 0.35)'
          }}
        >
          <Volume2 size={16} />
          <span>Call Next Patient</span>
        </button>
      </div>

      {/* ── Section 9 Live Stats Banner ──────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
          marginBottom: 16
        }}
      >
        <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: 12, border: '1.5px solid #BAE6FD', boxShadow: '0 2px 8px rgba(14,165,233,0.08)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Current Calling Token</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#0EA5E9', marginTop: 2, letterSpacing: '-0.03em' }}>{currentToken}</div>
          <div style={{ fontSize: '11px', color: '#0284C7', fontWeight: 600 }}>Active in Consultation</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Waiting Patients</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#D97706', marginTop: 2, letterSpacing: '-0.03em' }}>186</div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>Across 13 OPD Departments</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Average Waiting Time</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', marginTop: 2, letterSpacing: '-0.03em' }}>32 min</div>
          <div style={{ fontSize: '11px', color: '#EA580C', fontWeight: 600 }}>Target: &lt; 20 min</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Average Consultation Time</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#16A34A', marginTop: 2, letterSpacing: '-0.03em' }}>14 min</div>
          <div style={{ fontSize: '11px', color: '#15803D', fontWeight: 600 }}>Optimal Clinical Depth</div>
        </div>
      </div>

      {/* Announcement Notification Banner */}
      {tokenNotice && (
        <div
          style={{
            padding: '12px 18px',
            background: '#DCFCE7',
            border: '1.5px solid #86EFAC',
            borderRadius: 10,
            color: '#15803D',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            animation: 'fadeIn 0.2s'
          }}
        >
          <Volume2 size={18} />
          <span>{tokenNotice}</span>
        </div>
      )}

      {/* ── Search & Filter Controls ────────────────────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          padding: '14px 18px',
          border: '1px solid #E2E8F0',
          marginBottom: 16,
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
        <div style={{ flex: 1, minWidth: 220, display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 8, border: '1.5px solid #CBD5E1', background: '#F8FAFC' }}>
          <Search size={14} color="#94A3B8" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search queue by token, patient name, doctor..."
            style={{ border: 'none', outline: 'none', fontSize: '12.5px', background: 'transparent', width: '100%', color: '#0F172A' }}
          />
        </div>

        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          style={{ padding: '7px 10px', borderRadius: 8, border: '1.5px solid #CBD5E1', fontSize: '12px', fontWeight: 600, outline: 'none' }}
        >
          <option value="All">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '7px 10px', borderRadius: 8, border: '1.5px solid #CBD5E1', fontSize: '12px', fontWeight: 600, outline: 'none' }}
        >
          <option value="All">All Statuses</option>
          <option value="Waiting">Waiting</option>
          <option value="In Consultation">In Consultation</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* ── Live OPD Queue Table (Section 9) ─────────────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <th style={{ padding: '12px 16px' }}>Token</th>
              <th style={{ padding: '12px 16px' }}>Patient</th>
              <th style={{ padding: '12px 16px' }}>Department</th>
              <th style={{ padding: '12px 16px' }}>Doctor & Room</th>
              <th style={{ padding: '12px 16px' }}>Wait Duration</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQueue.map((row, idx) => (
              <tr
                key={row.token}
                style={{
                  borderBottom: '1px solid #F1F5F9',
                  background: row.token === currentToken ? '#EFF6FF' : idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA'
                }}
              >
                <td style={{ padding: '12px 16px' }}>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      fontWeight: 800,
                      color: row.token === currentToken ? '#0284C7' : '#0F172A',
                      background: row.token === currentToken ? '#DBEAFE' : '#F1F5F9',
                      padding: '3px 8px',
                      borderRadius: 6
                    }}
                  >
                    {row.token}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0F172A' }}>
                  {row.patient}
                </td>
                <td style={{ padding: '12px 16px', color: '#334155', fontWeight: 600 }}>
                  {row.dept}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, color: '#0F172A' }}>{row.doctor}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{row.room}</div>
                </td>
                <td style={{ padding: '12px 16px', color: '#64748B', fontWeight: 600 }}>
                  {row.waitTime}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background:
                        row.status === 'In Consultation' || row.status === 'Consultation' ? '#E0F2FE' :
                        row.status === 'Completed' ? '#DCFCE7' : '#FEF3C7',
                      color:
                        row.status === 'In Consultation' || row.status === 'Consultation' ? '#0369A1' :
                        row.status === 'Completed' ? '#15803D' : '#92400E'
                    }}
                  >
                    {row.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    {row.status === 'Waiting' && (
                      <button
                        onClick={() => handleStatusChange(row.token, 'In Consultation')}
                        style={{
                          padding: '4px 8px',
                          borderRadius: 6,
                          background: '#0EA5E9',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Start Consult
                      </button>
                    )}
                    {row.status === 'In Consultation' && (
                      <button
                        onClick={() => handleStatusChange(row.token, 'Completed')}
                        style={{
                          padding: '4px 8px',
                          borderRadius: 6,
                          background: '#16A34A',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
