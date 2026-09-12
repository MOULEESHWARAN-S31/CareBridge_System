import { useState } from 'react';
import {
  Bed, Users, AlertTriangle, CheckCircle, Clock, Sparkles,
  ShieldCheck, ArrowRight, UserPlus, RefreshCw, X, ArrowLeftRight
} from 'lucide-react';
import { BED_STATISTICS, WARD_BED_MAP, PATIENTS } from '../data/mockData';
import { useToast } from '../components/Toast';

const STATUS_CONFIG = {
  Available:   { color: '#16A34A', bg: '#DCFCE7', border: '#86EFAC', label: 'Available' },
  Occupied:    { color: '#0284C7', bg: '#E0F2FE', border: '#7DD3FC', label: 'Occupied' },
  Reserved:    { color: '#D97706', bg: '#FEF3C7', border: '#FCD34D', label: 'Reserved' },
  Cleaning:    { color: '#CA8A04', bg: '#FEF9C3', border: '#FDE047', label: 'Cleaning' },
  Maintenance: { color: '#E11D48', bg: '#FFE4E6', border: '#FDA4AF', label: 'Maintenance' },
};

export default function WardsPage() {
  const toast = useToast();
  const [selectedWard, setSelectedWard] = useState('All');
  const [selectedBed, setSelectedBed] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [bedMapData, setBedMapData] = useState(WARD_BED_MAP);

  // Filtered beds
  const displayedBeds = bedMapData.filter(b => {
    const matchWard = selectedWard === 'All' || b.ward === selectedWard;
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchWard && matchStatus;
  });

  function handleBedStatusUpdate(bedId, newStatus) {
    setBedMapData(prev => prev.map(b => b.id === bedId ? { ...b, status: newStatus } : b));
    if (selectedBed?.id === bedId) {
      setSelectedBed(prev => ({ ...prev, status: newStatus }));
    }
    toast?.success?.(`Bed ${bedId} status updated to ${newStatus}`);
  }

  return (
    <div className="fade-in" style={{ paddingBottom: 32 }}>
      {/* ── Page Header ────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
            Bed Management & Ward Operations
          </div>
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            Live occupancy tracking, bed allocations, and ward cleaning status across Salem District Hospital
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => toast?.info?.('Bed grid refreshed with live telemetry data')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 8,
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              color: '#334155',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={13} />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* ── KPI Cards (Section 15: Exact Counts) ────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
          marginBottom: 18
        }}
      >
        <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Hospital Beds</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginTop: 3 }}>328</div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>Approved Bed Capacity</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: 12, border: '1.5px solid #FCD34D' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#B45309', textTransform: 'uppercase' }}>Occupied Beds</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#D97706', marginTop: 3 }}>244</div>
          <div style={{ fontSize: '11px', color: '#B45309' }}>74.4% Current Occupancy</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: 12, border: '1.5px solid #86EFAC' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#15803D', textTransform: 'uppercase' }}>Available Beds</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#16A34A', marginTop: 3 }}>84</div>
          <div style={{ fontSize: '11px', color: '#15803D' }}>Ready for Admission</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: 12, border: '1px solid #FECACA' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase' }}>ICU Beds Available</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#DC2626', marginTop: 3 }}>12</div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>18 Occupied of 30 Total</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: 12, border: '1px solid #FED7AA' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#EA580C', textTransform: 'uppercase' }}>Emergency Available</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#EA580C', marginTop: 3 }}>8</div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>17 Occupied of 25 Total</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: 12, border: '1px solid #BAE6FD' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase' }}>General Ward Free</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0284C7', marginTop: 3 }}>48</div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>172 Occupied of 220 Total</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: 12, border: '1px solid #FBCFE8' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#DB2777', textTransform: 'uppercase' }}>Pediatric Available</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#DB2777', marginTop: 3 }}>10</div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>25 Occupied of 35 Total</div>
        </div>
      </div>

      {/* ── Status Color Legend ─────────────────────────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          padding: '12px 18px',
          borderRadius: 10,
          border: '1px solid #E2E8F0',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Status Indicators:</span>
          {Object.entries(STATUS_CONFIG).map(([statusKey, cfg]) => (
            <div
              key={statusKey}
              onClick={() => setStatusFilter(statusFilter === statusKey ? 'All' : statusKey)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                opacity: statusFilter === 'All' || statusFilter === statusKey ? 1 : 0.4
              }}
            >
              <span style={{ width: 12, height: 12, borderRadius: 3, background: cfg.bg, border: `1.5px solid ${cfg.border}` }} />
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#334155' }}>{cfg.label}</span>
            </div>
          ))}
        </div>

        {/* Ward filter selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>Ward:</span>
          <select
            value={selectedWard}
            onChange={e => setSelectedWard(e.target.value)}
            style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 600, outline: 'none' }}
          >
            <option value="All">All Wards</option>
            <option value="ICU">ICU (Intensive Care)</option>
            <option value="Emergency">Emergency Resuscitation</option>
            <option value="General Ward">General Ward</option>
            <option value="Pediatric Ward">Pediatric Ward</option>
          </select>
        </div>
      </div>

      {/* ── Ward-Level Visual Bed Map (Section 15) ───────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          padding: '20px',
          border: '1px solid #E2E8F0',
          marginBottom: 20
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bed size={18} color="#0EA5E9" />
              <span>Ward-Level Interactive Bed Map</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B' }}>
              Click any bed unit to view occupant details, request patient transfer, or change maintenance/cleaning status
            </div>
          </div>
          <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
            Showing {displayedBeds.length} units
          </span>
        </div>

        {/* Visual Bed Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 10
          }}
        >
          {displayedBeds.map(b => {
            const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.Available;
            const isSelected = selectedBed?.id === b.id;

            return (
              <div
                key={b.id}
                onClick={() => setSelectedBed(b)}
                style={{
                  background: isSelected ? '#EFF6FF' : cfg.bg,
                  border: isSelected ? '2px solid #0EA5E9' : `1.5px solid ${cfg.border}`,
                  borderRadius: 10,
                  padding: '12px 10px',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease-in-out',
                  boxShadow: isSelected ? '0 4px 12px rgba(14, 165, 233, 0.25)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 90
                }}
                onMouseEnter={e => {
                  if (!isSelected) e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseLeave={e => {
                  if (!isSelected) e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>
                    {b.bedNo}
                  </span>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: 800,
                      color: cfg.color,
                      textTransform: 'uppercase'
                    }}
                  >
                    {b.status}
                  </span>
                </div>

                <div style={{ margin: '6px 0', fontSize: '11px', color: '#334155', lineHeight: 1.2 }}>
                  {b.patient ? (
                    <strong>{b.patient}</strong>
                  ) : (
                    <span style={{ color: '#64748B', fontStyle: 'italic' }}>Unoccupied</span>
                  )}
                </div>

                <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 600 }}>
                  {b.ward}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bed Action / Inspection Drawer / Modal ────────────────── */}
      {selectedBed && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            maxWidth: 420,
            width: '100%',
            background: '#FFFFFF',
            borderRadius: 16,
            padding: '20px',
            border: '2px solid #0EA5E9',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            zIndex: 900
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#0EA5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                <Bed size={18} />
              </div>
              <div>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                  Bed {selectedBed.bedNo}
                </span>
                <div style={{ fontSize: '11px', color: '#64748B' }}>{selectedBed.ward} ({selectedBed.type})</div>
              </div>
            </div>
            <button
              onClick={() => setSelectedBed(null)}
              style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: 26, height: 26, cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 12 }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>OCCUPANT STATUS</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: 2 }}>
              {selectedBed.patient || 'Bed currently unoccupied'}
            </div>
            {selectedBed.diagnosis && (
              <div style={{ fontSize: '11px', color: '#0284C7', marginTop: 2 }}>
                Diagnosis: {selectedBed.diagnosis}
              </div>
            )}
            {selectedBed.vitals && (
              <div style={{ fontSize: '11px', color: '#15803D', marginTop: 2, fontWeight: 600 }}>
                Live Vitals: {selectedBed.vitals}
              </div>
            )}
          </div>

          <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 6 }}>
            Quick Status Update:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 12 }}>
            {['Available', 'Occupied', 'Cleaning', 'Reserved', 'Maintenance'].map(st => (
              <button
                key={st}
                onClick={() => handleBedStatusUpdate(selectedBed.id, st)}
                style={{
                  padding: '6px',
                  borderRadius: 6,
                  border: selectedBed.status === st ? '1.5px solid #0EA5E9' : '1px solid #E2E8F0',
                  background: selectedBed.status === st ? '#E0F2FE' : '#FFFFFF',
                  color: selectedBed.status === st ? '#0284C7' : '#334155',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {st}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                toast?.success?.(`Transfer request initiated for Bed ${selectedBed.bedNo}`);
                setSelectedBed(null);
              }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 6,
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4
              }}
            >
              <ArrowLeftRight size={13} />
              <span>Transfer Bed</span>
            </button>
            <button
              onClick={() => {
                handleBedStatusUpdate(selectedBed.id, 'Cleaning');
                setSelectedBed(null);
              }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 6,
                background: '#FEF9C3',
                border: '1px solid #FDE047',
                color: '#854D0E',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Sanitize & Clean
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
