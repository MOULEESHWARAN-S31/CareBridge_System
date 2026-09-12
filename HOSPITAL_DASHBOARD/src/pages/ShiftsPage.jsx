import { useState } from 'react';
import {
  Clock, Users, AlertTriangle, CheckCircle2, UserCheck,
  Calendar, ShieldAlert, Sparkles, Filter, RefreshCw
} from 'lucide-react';
import { SHIFTS_ROSTER, DEPARTMENTS } from '../data/mockData';
import { useToast } from '../components/Toast';

export default function ShiftsPage() {
  const toast = useToast();
  const [shifts, setShifts] = useState(SHIFTS_ROSTER);
  const [selectedShift, setSelectedShift] = useState('ALL');

  function handleAssignBackup(shiftId, deptName) {
    toast?.success?.(`Backup doctor dispatched to ${deptName} for ${shiftId}`);
    setShifts(prev => prev.map(s => {
      if (s.id === shiftId) {
        return {
          ...s,
          shortages: s.shortages.filter(sh => sh.dept !== deptName),
          status: s.shortages.length <= 1 ? 'Optimal' : s.status
        };
      }
      return s;
    }));
  }

  const allShortages = shifts.flatMap(s => s.shortages.map(sh => ({ ...sh, shiftName: s.name, shiftId: s.id })));

  return (
    <div className="fade-in" style={{ paddingBottom: 32 }}>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
            Hospital Staff Shift & Roster Management
          </div>
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            24/7 Multi-shift scheduling, duty allocation, attendance, and critical department shortage monitoring
          </div>
        </div>

        <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#15803D', padding: '4px 10px', borderRadius: 6, fontWeight: 700 }}>
          3 Shift Rotation Active
        </span>
      </div>

      {/* ── Understaffing Alert Banner (Section 26) ──────────────── */}
      {allShortages.length > 0 ? (
        <div
          style={{
            background: '#FEF2F2',
            borderRadius: 12,
            padding: '16px 20px',
            border: '1.5px solid #FECACA',
            marginBottom: 20,
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
              <AlertTriangle size={16} />
            </div>
            <div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#991B1B' }}>
                Critical Department Understaffing Detected ({allShortages.length} Shortage Warnings)
              </span>
              <div style={{ fontSize: '11px', color: '#B91C1C' }}>
                Staffing levels below mandatory clinical thresholds for government district hospital operations
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {allShortages.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #FCA5A5',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 10
                }}
              >
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#991B1B' }}>
                    {item.alert}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: 1 }}>
                    Shift: <strong>{item.shiftName}</strong> · Department: {item.dept} · Role: {item.role} (Required: {item.required}, Assigned: {item.assigned})
                  </div>
                </div>

                <button
                  onClick={() => handleAssignBackup(item.shiftId, item.dept)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    background: '#DC2626',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Deploy Emergency Backup Staff
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ background: '#F0FDF4', padding: '12px 16px', borderRadius: 10, border: '1px solid #BBF7D0', color: '#15803D', fontSize: '12.5px', fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={16} />
          <span>All clinical departments meeting full staffing quota across morning, afternoon, and night shifts.</span>
        </div>
      )}

      {/* ── 3 Main Shifts Cards (Section 26) ─────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 24 }}>
        {shifts.map(shift => (
          <div
            key={shift.id}
            style={{
              background: '#FFFFFF',
              borderRadius: 14,
              padding: '20px',
              border: shift.status === 'Understaffed' ? '1.5px solid #FCA5A5' : '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                  {shift.name}
                </span>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: shift.status === 'Understaffed' ? '#FEE2E2' : '#DCFCE7',
                    color: shift.status === 'Understaffed' ? '#991B1B' : '#15803D'
                  }}
                >
                  {shift.status}
                </span>
              </div>

              <div style={{ fontSize: '12px', color: '#0EA5E9', fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={13} />
                <span>Duty Hours: {shift.time}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, background: '#F8FAFC', padding: '12px 10px', borderRadius: 8, textAlign: 'center', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Assigned</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{shift.assignedStaff}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Present</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#16A34A', marginTop: 2 }}>{shift.presentStaff}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>On Leave</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#D97706', marginTop: 2 }}>{shift.onLeave}</div>
                </div>
              </div>

              {shift.shortages.length > 0 && (
                <div style={{ fontSize: '11px', color: '#DC2626', fontWeight: 600, marginBottom: 10 }}>
                  ⚠️ {shift.shortages.length} shortage alert active in this shift
                </div>
              )}
            </div>

            <button
              onClick={() => toast?.info?.(`Opening full attendance roster for ${shift.name}`)}
              style={{
                width: '100%',
                padding: '9px',
                borderRadius: 8,
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                fontSize: '12px',
                fontWeight: 700,
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              View Shift Roster & Staff List →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
