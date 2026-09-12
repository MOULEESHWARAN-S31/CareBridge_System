import { useState } from 'react';
import {
  Truck, MapPin, Phone, User, Navigation, Wrench,
  CheckCircle, AlertCircle, Compass, Radio, ExternalLink
} from 'lucide-react';
import { AMBULANCE_FLEET } from '../data/mockData';
import { useToast } from '../components/Toast';

const STATUS_MAP = {
  'Available':   { color: '#16A34A', bg: '#DCFCE7', border: '#86EFAC' },
  'Assigned':    { color: '#D97706', bg: '#FEF3C7', border: '#FCD34D' },
  'En Route':    { color: '#0284C7', bg: '#E0F2FE', border: '#7DD3FC' },
  'At Hospital': { color: '#7C3AED', bg: '#EDE9FE', border: '#C4B5FD' },
  'Maintenance': { color: '#E11D48', bg: '#FFE4E6', border: '#FDA4AF' },
};

export default function AmbulancePage() {
  const toast = useToast();
  const [fleet, setFleet] = useState(AMBULANCE_FLEET);
  const [filter, setFilter] = useState('All');
  const [selectedAmbulance, setSelectedAmbulance] = useState(fleet[1]); // AMB-02 default (En Route)

  const filtered = filter === 'All' ? fleet : fleet.filter(a => a.status === filter);

  function handleDispatch(ambId) {
    setFleet(prev => prev.map(a => a.id === ambId ? { ...a, status: 'En Route', destination: 'Emergency Trauma Care' } : a));
    toast?.success?.(`Ambulance ${ambId} dispatched to emergency site`);
  }

  return (
    <div className="fade-in" style={{ paddingBottom: 32 }}>
      {/* ── Page Header ────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
            Ambulance Fleet GPS Tracking & Dispatch
          </div>
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            Real-time GPS coordinates, vehicle telemetry, and emergency dispatch for Salem District Emergency Response (108)
          </div>
        </div>

        <button
          onClick={() => handleDispatch('AMB-01')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '9px 16px',
            borderRadius: 8,
            background: '#0EA5E9',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(14, 165, 233, 0.35)'
          }}
        >
          <Truck size={15} />
          <span>+ Dispatch Available Ambulance</span>
        </button>
      </div>

      {/* ── Fleet Status KPI Bar ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
        {Object.entries(STATUS_MAP).map(([statusKey, cfg]) => {
          const count = fleet.filter(a => a.status === statusKey).length;
          return (
            <div
              key={statusKey}
              onClick={() => setFilter(filter === statusKey ? 'All' : statusKey)}
              style={{
                background: '#FFFFFF',
                padding: '12px 16px',
                borderRadius: 10,
                border: filter === statusKey ? `2px solid ${cfg.color}` : '1px solid #E2E8F0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>{statusKey}</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: cfg.color, marginTop: 2 }}>{count}</div>
              </div>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: cfg.color }} />
            </div>
          );
        })}
      </div>

      {/* ── Interactive GPS Fleet Map (Section 24) ───────────────── */}
      <div
        style={{
          background: '#0F172A',
          borderRadius: 14,
          padding: '20px',
          color: '#FFFFFF',
          marginBottom: 20,
          border: '1px solid #1E293B',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Radio size={18} color="#22C55E" className="pulse" />
            <div>
              <span style={{ fontSize: '15px', fontWeight: 800 }}>
                Live GPS Tactical Map — Salem District Fleet
              </span>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                Center Node: Government District Hospital Salem (11.6643° N, 78.1460° E)
              </div>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 600 }}>
            🛰️ GPS Satellites Connected: 9 · Update Rate: 1s
          </div>
        </div>

        {/* Tactical Map Visual Canvas */}
        <div
          style={{
            height: '240px',
            background: 'radial-gradient(circle at 50% 50%, #1E293B 0%, #0F172A 100%)',
            borderRadius: 10,
            position: 'relative',
            border: '1px solid #334155',
            overflow: 'hidden'
          }}
        >
          {/* Grid lines overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.15,
              backgroundImage: 'linear-gradient(#38BDF8 1px, transparent 1px), linear-gradient(90deg, #38BDF8 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />

          {/* Hospital Center Marker */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0284C7', border: '3px solid #38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 0 20px rgba(14,165,233,0.8)' }}>
              🏥
            </div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#BAE6FD', marginTop: 4 }}>
              GDH Salem Base
            </div>
          </div>

          {/* Real-time Fleet GPS Markers */}
          {fleet.map(amb => {
            const isSelected = selectedAmbulance?.id === amb.id;
            // Coordinate mapping to relative offset
            const offsetX = (amb.lng - 78.1460) * 2000 + 50;
            const offsetY = (11.6643 - amb.lat) * 2000 + 50;

            return (
              <div
                key={amb.id}
                onClick={() => setSelectedAmbulance(amb)}
                style={{
                  position: 'absolute',
                  top: `${Math.min(Math.max(offsetY, 15), 85)}%`,
                  left: `${Math.min(Math.max(offsetX, 15), 85)}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s'
                }}
              >
                <div
                  style={{
                    padding: '4px 8px',
                    borderRadius: 6,
                    background: isSelected ? '#38BDF8' : '#1E293B',
                    border: isSelected ? '2px solid #FFF' : `1.5px solid ${STATUS_MAP[amb.status].color}`,
                    color: isSelected ? '#0F172A' : '#FFF',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    boxShadow: isSelected ? '0 0 15px rgba(56,189,248,0.9)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <span>🚑</span>
                  <span>{amb.id}</span>
                </div>
                <div style={{ fontSize: '9px', color: '#94A3B8', marginTop: 2 }}>{amb.speed}</div>
              </div>
            );
          })}
        </div>

        {/* Selected Ambulance GPS Telemetry Details */}
        {selectedAmbulance && (
          <div style={{ marginTop: 14, background: '#1E293B', padding: '12px 16px', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#F8FAFC' }}>
                {selectedAmbulance.id} · {selectedAmbulance.vehicleNo} ({selectedAmbulance.type})
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: 2 }}>
                Driver: <strong>{selectedAmbulance.driver}</strong> ({selectedAmbulance.phone}) · Speed: <strong>{selectedAmbulance.speed}</strong>
              </div>
              <div style={{ fontSize: '11px', color: '#38BDF8', marginTop: 2 }}>
                Current Location: {selectedAmbulance.location} → Destination: {selectedAmbulance.destination}
              </div>
            </div>

            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 6,
                background: STATUS_MAP[selectedAmbulance.status].bg,
                color: STATUS_MAP[selectedAmbulance.status].color
              }}
            >
              {selectedAmbulance.status}
            </span>
          </div>
        )}
      </div>

      {/* ── Ambulance List Table (Section 24) ────────────────────── */}
      <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Ambulance ID</th>
              <th style={{ padding: '12px 16px' }}>Vehicle & Type</th>
              <th style={{ padding: '12px 16px' }}>Driver Contact</th>
              <th style={{ padding: '12px 16px' }}>Current Location</th>
              <th style={{ padding: '12px 16px' }}>Assigned Patient & Destination</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(amb => (
              <tr key={amb.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '12px 16px', fontWeight: 800, color: '#0EA5E9' }}>
                  {amb.id}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>{amb.vehicleNo}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{amb.type}</div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, color: '#0F172A' }}>{amb.driver}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{amb.phone}</div>
                </td>
                <td style={{ padding: '12px 16px', color: '#334155' }}>
                  <div style={{ fontWeight: 600 }}>{amb.location}</div>
                  <div style={{ fontSize: '10.5px', color: '#64748B' }}>Speed: {amb.speed}</div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, color: '#0F172A' }}>
                    {amb.patient || 'None'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    Dest: {amb.destination}
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: STATUS_MAP[amb.status].bg,
                      color: STATUS_MAP[amb.status].color
                    }}
                  >
                    {amb.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  {amb.status === 'Available' ? (
                    <button
                      onClick={() => handleDispatch(amb.id)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: 6,
                        background: '#0EA5E9',
                        color: '#FFF',
                        border: 'none',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Dispatch
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedAmbulance(amb)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: 6,
                        background: '#F1F5F9',
                        color: '#334155',
                        border: '1px solid #CBD5E1',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Track GPS
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
