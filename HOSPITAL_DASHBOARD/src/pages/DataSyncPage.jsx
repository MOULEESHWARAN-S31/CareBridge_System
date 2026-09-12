import { useState } from 'react';
import {
  Wifi, WifiOff, RefreshCw, CheckCircle2, AlertTriangle,
  Server, ShieldCheck, Database, HardDrive, Clock, ArrowRight
} from 'lucide-react';
import { OFFLINE_SYNC_STATE, HOSPITAL_INFO } from '../data/mockData';
import { useToast } from '../components/Toast';

export default function DataSyncPage() {
  const toast = useToast();
  const [syncState, setSyncState] = useState(OFFLINE_SYNC_STATE);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  function handleTriggerSync() {
    setIsSyncing(true);
    setSyncProgress(15);

    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            setIsSyncing(false);
            setSyncProgress(100);
            setSyncState(s => ({
              ...s,
              lastSyncTime: 'Just now',
              pendingRecords: 0,
              logs: [
                {
                  id: `SYNC-${Date.now().toString().slice(-3)}`,
                  timestamp: 'Just now',
                  records: s.pendingRecords || 18,
                  module: 'Batch Manual Cloud Synchronization',
                  status: 'Success',
                  gateway: 'Salem District Health Cloud'
                },
                ...s.logs
              ]
            }));
            toast?.success?.('All 18 pending records synchronized to State Health Cloud');
          }, 400);
          return 90;
        }
        return prev + 25;
      });
    }, 250);
  }

  function toggleNetworkSimulation() {
    setSyncState(prev => ({
      ...prev,
      isOnline: !prev.isOnline,
      syncStatus: !prev.isOnline ? 'Online' : 'Offline'
    }));
    toast?.info?.(
      !syncState.isOnline
        ? 'Network restored: Online mode active'
        : 'Simulating offline rural network mode'
    );
  }

  return (
    <div className="fade-in" style={{ paddingBottom: 32 }}>
      {/* ── Page Header ────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
            Low-Connectivity & Offline Data Synchronization
          </div>
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            Resilient store-and-forward engine for rural health centres, taluk hospitals, and district nodes
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={toggleNetworkSimulation}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              background: syncState.isOnline ? '#FEF2F2' : '#F0FDF4',
              border: syncState.isOnline ? '1px solid #FECACA' : '1px solid #BBF7D0',
              color: syncState.isOnline ? '#B91C1C' : '#15803D',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            {syncState.isOnline ? <WifiOff size={14} /> : <Wifi size={14} />}
            <span>{syncState.isOnline ? 'Simulate Offline Mode' : 'Restore Online Mode'}</span>
          </button>

          <button
            onClick={handleTriggerSync}
            disabled={isSyncing || !syncState.isOnline}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 18px',
              borderRadius: 8,
              background: '#0EA5E9',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: syncState.isOnline ? 'pointer' : 'not-allowed',
              opacity: syncState.isOnline ? 1 : 0.5,
              boxShadow: '0 2px 8px rgba(14,165,233,0.35)'
            }}
          >
            <RefreshCw size={14} className={isSyncing ? 'spin' : ''} />
            <span>{isSyncing ? 'Synchronizing...' : 'Sync Now with Cloud'}</span>
          </button>
        </div>
      </div>

      {/* ── Status Banner (Section 31) ───────────────────────────── */}
      <div
        style={{
          background: syncState.isOnline ? '#F0FDF4' : '#FFFBEB',
          borderRadius: 14,
          padding: '20px 24px',
          border: syncState.isOnline ? '1.5px solid #BBF7D0' : '1.5px solid #FDE68A',
          marginBottom: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: syncState.isOnline ? '#DCFCE7' : '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: syncState.isOnline ? '#16A34A' : '#D97706'
              }}
            >
              {syncState.isOnline ? <Wifi size={22} /> : <WifiOff size={22} />}
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: syncState.isOnline ? '#15803D' : '#92400E' }}>
                {syncState.isOnline ? 'Hospital Connection Status: Online' : 'Hospital Connection Status: Offline Mode Active'}
              </div>
              <div style={{ fontSize: '12.5px', color: syncState.isOnline ? '#166534' : '#B45309', marginTop: 2 }}>
                {syncState.isOnline ? (
                  <span>Last Sync: <strong>{syncState.lastSyncTime}</strong> · Central Tamil Nadu Health Cloud Node</span>
                ) : (
                  <span>Offline — <strong>{syncState.pendingRecords} records</strong> queued in local SQLite/IndexedDB encrypted cache</span>
                )}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: 20,
                background: syncState.pendingRecords > 0 ? '#FEF3C7' : '#DCFCE7',
                color: syncState.pendingRecords > 0 ? '#92400E' : '#15803D'
              }}
            >
              {syncState.pendingRecords > 0 ? `${syncState.pendingRecords} Records Pending Sync` : 'All Data Synced'}
            </span>
          </div>
        </div>

        {/* Sync progress bar */}
        {isSyncing && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#166534', fontWeight: 700, marginBottom: 4 }}>
              <span>Transmitting batch payload to Salem District Gateway...</span>
              <span>{syncProgress}%</span>
            </div>
            <div style={{ width: '100%', height: 6, background: '#DCFCE7', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${syncProgress}%`, height: '100%', background: '#16A34A', transition: 'width 0.2s ease-in-out' }} />
            </div>
          </div>
        )}
      </div>

      {/* ── Key Sync Metrics ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Local Storage Cache</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginTop: 3 }}>IndexedDB AES-256</div>
          <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>Zero-data-loss encryption</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Failed Sync Retries</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#16A34A', marginTop: 3 }}>0 Failures</div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>100% Success Rate Today</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Pending Sync Queue</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: syncState.pendingRecords > 0 ? '#D97706' : '#16A34A', marginTop: 3 }}>
            {syncState.pendingRecords} Records
          </div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>OPD + Lab + Pharmacy</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Sync Frequency</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0EA5E9', marginTop: 3 }}>Every 5 min</div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>Automatic background worker</div>
        </div>
      </div>

      {/* ── Synchronization Logs Table ───────────────────────────── */}
      <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
              Recent Synchronization Logs
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Detailed audit trail of packets exchanged between hospital node and state servers
            </div>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '10px 16px' }}>Batch ID</th>
              <th style={{ padding: '10px 16px' }}>Timestamp</th>
              <th style={{ padding: '10px 16px' }}>Data Module</th>
              <th style={{ padding: '10px 16px' }}>Records</th>
              <th style={{ padding: '10px 16px' }}>Gateway Destination</th>
              <th style={{ padding: '10px 16px', textAlign: 'right' }}>Sync Result</th>
            </tr>
          </thead>
          <tbody>
            {syncState.logs.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '10px 16px', fontWeight: 700, color: '#0EA5E9', fontFamily: 'monospace' }}>
                  {log.id}
                </td>
                <td style={{ padding: '10px 16px', color: '#475569' }}>{log.timestamp}</td>
                <td style={{ padding: '10px 16px', fontWeight: 600, color: '#0F172A' }}>{log.module}</td>
                <td style={{ padding: '10px 16px', fontWeight: 700, color: '#334155' }}>{log.records} items</td>
                <td style={{ padding: '10px 16px', color: '#64748B' }}>{log.gateway}</td>
                <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                  <span style={{ fontSize: '10.5px', background: '#DCFCE7', color: '#15803D', padding: '2px 7px', borderRadius: 4, fontWeight: 700 }}>
                    ✓ {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
