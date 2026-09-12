import { useState } from 'react';
import { Search, Plus, ArrowLeftRight, Eye, CheckCircle2, Calendar, MapPin, Building } from 'lucide-react';
import { useToast } from '../components/Toast';

const DUMMY_REFERRALS = [
  { id: 'REF-101', patientId: 'P1001', from: 'PHC A', to: 'District Hospital', specialist: 'Cardiology', status: 'Accepted', date: 'Today, 08:30 AM', priority: 'High', reason: 'Abnormal ECG & chest discomfort' },
  { id: 'REF-102', patientId: 'P1002', from: 'PHC B', to: 'Government Hospital', specialist: 'General Medicine', status: 'Scheduled', date: 'Today, 09:15 AM', priority: 'Medium', reason: 'Uncontrolled Type 2 Diabetes' },
  { id: 'REF-103', patientId: 'P1003', from: 'District Hospital', to: 'Specialist Centre', specialist: 'Dermatology', status: 'Completed', date: 'Yesterday', priority: 'Low', reason: 'Chronic psoriasis specialist evaluation' },
  { id: 'REF-104', patientId: 'P1004', from: 'PHC C', to: 'District Hospital', specialist: 'Orthopedics', status: 'Accepted', date: 'Yesterday', priority: 'High', reason: 'Suspected femoral hairline fracture' },
  { id: 'REF-105', patientId: 'P1005', from: 'Sub-centre 4', to: 'District Hospital', specialist: 'Obstetrics', status: 'Scheduled', date: 'Today, 11:00 AM', priority: 'High', reason: 'High-risk 3rd trimester pregnancy' },
  { id: 'REF-106', patientId: 'P1006', from: 'PHC A', to: 'Government Hospital', specialist: 'Pediatrics', status: 'Completed', date: '2 days ago', priority: 'Medium', reason: 'Recurrent febrile convulsions' },
  { id: 'REF-107', patientId: 'P1007', from: 'PHC D', to: 'District Hospital', specialist: 'Neurology', status: 'Accepted', date: 'Today, 07:45 AM', priority: 'Critical', reason: 'Transient ischemic attack symptoms' },
  { id: 'REF-108', patientId: 'P1008', from: 'Rural Hospital', to: 'Specialist Centre', specialist: 'Oncology', status: 'Scheduled', date: 'Yesterday', priority: 'Medium', reason: 'Biopsy tissue pathology consultation' },
];

const statusBadgeColor = {
  'Accepted': 'badge-info',
  'Scheduled': 'badge-warning',
  'Completed': 'badge-success',
};

export default function ReferralsPage() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedRef, setSelectedRef] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [referralsList, setReferralsList] = useState(DUMMY_REFERRALS);

  const filtered = referralsList.filter(r => {
    const matchSearch =
      r.patientId.toLowerCase().includes(search.toLowerCase()) ||
      r.from.toLowerCase().includes(search.toLowerCase()) ||
      r.to.toLowerCase().includes(search.toLowerCase()) ||
      r.specialist.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || r.status === filter;
    return matchSearch && matchFilter;
  });

  const totalReferrals = 42; // Prompt requirement: "Total Referrals: 42"

  return (
    <div className="page-content page-transition">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Referrals</h1>
          <div className="page-subtitle">
            Centralized Hospital Referral Management
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={16} /> New Referral
          </button>
        </div>
      </div>

      {/* Single Referrals Summary Banner */}
      <div
        className="card"
        style={{
          marginBottom: 20,
          background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
          border: '1px solid #BAE6FD',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: '#0EA5E9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
            }}
          >
            <ArrowLeftRight size={24} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0369A1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Referral Overview
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
              Total Referrals: <span style={{ color: '#0284C7' }}>{totalReferrals}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ padding: '8px 16px', background: 'white', borderRadius: 8, border: '1px solid #BAE6FD', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Accepted</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#0284C7' }}>18</div>
          </div>
          <div style={{ padding: '8px 16px', background: 'white', borderRadius: 8, border: '1px solid #BAE6FD', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Scheduled</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#D97706' }}>14</div>
          </div>
          <div style={{ padding: '8px 16px', background: 'white', borderRadius: 8, border: '1px solid #BAE6FD', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Completed</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#16A34A' }}>10</div>
          </div>
        </div>
      </div>

      {/* Referrals Section Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div className="search-bar" style={{ flex: 1, minWidth: 220, maxWidth: 420 }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              placeholder="Search by Patient ID, Facility, or Specialist..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-tabs">
            {['All', 'Accepted', 'Scheduled', 'Completed'].map(f => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>From</th>
                <th>To</th>
                <th>Specialist</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td>
                    <span
                      style={{
                        padding: '4px 10px',
                        background: '#F1F5F9',
                        borderRadius: 6,
                        fontWeight: 700,
                        fontSize: 13,
                        color: '#0F172A'
                      }}
                    >
                      {r.patientId}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Building size={14} color="#64748B" />
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{r.from}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MapPin size={14} color="#0EA5E9" />
                      <span style={{ fontWeight: 600, fontSize: 13, color: '#0F172A' }}>{r.to}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, fontSize: 13, color: '#0284C7' }}>
                      {r.specialist}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${statusBadgeColor[r.status] || 'badge-muted'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setSelectedRef(r)}
                    >
                      <Eye size={13} /> View
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No referrals found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Referral Details Modal */}
      {selectedRef && (
        <div className="modal-overlay" onClick={() => setSelectedRef(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3>Referral Case — {selectedRef.patientId}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelectedRef(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#F8FAFC', borderRadius: 8 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Patient ID</div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{selectedRef.patientId}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Status</div>
                    <span className={`badge ${statusBadgeColor[selectedRef.status] || 'badge-muted'}`}>
                      {selectedRef.status}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ padding: '10px 12px', background: '#F1F5F9', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Originating Facility</div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{selectedRef.from}</div>
                  </div>
                  <div style={{ padding: '10px 12px', background: '#F1F5F9', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Receiving Facility</div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{selectedRef.to}</div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Specialist / Department</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0284C7' }}>{selectedRef.specialist}</div>
                </div>

                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Clinical Reason for Referral</div>
                  <div style={{ fontSize: 13, color: '#1E293B', background: '#F8FAFC', padding: '10px 12px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                    {selectedRef.reason}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelectedRef(null)}>Close</button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  toast(`Status updated for referral ${selectedRef.id}`, 'success');
                  setSelectedRef(null);
                }}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Referral Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3>Create New Referral</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Patient ID</label>
                  <input className="form-input" placeholder="e.g. P1009" defaultValue="P1009" id="new-ref-pid" />
                </div>
                <div className="form-group">
                  <label className="form-label">From (Referring Facility)</label>
                  <input className="form-input" placeholder="e.g. PHC A" defaultValue="PHC A" id="new-ref-from" />
                </div>
                <div className="form-group">
                  <label className="form-label">To (Receiving Facility)</label>
                  <input className="form-input" placeholder="e.g. District Hospital" defaultValue="District Hospital" id="new-ref-to" />
                </div>
                <div className="form-group">
                  <label className="form-label">Specialist Required</label>
                  <select className="form-select" id="new-ref-spec">
                    <option>Cardiology</option>
                    <option>General Medicine</option>
                    <option>Dermatology</option>
                    <option>Orthopedics</option>
                    <option>Pediatrics</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Clinical Indication</label>
                  <textarea className="form-input" rows={3} placeholder="Describe clinical symptoms or urgency..." defaultValue="Specialist clinical review required" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const pid = document.getElementById('new-ref-pid')?.value || 'P1009';
                  const from = document.getElementById('new-ref-from')?.value || 'PHC A';
                  const to = document.getElementById('new-ref-to')?.value || 'District Hospital';
                  const spec = document.getElementById('new-ref-spec')?.value || 'Cardiology';
                  setReferralsList(prev => [
                    {
                      id: `REF-${Date.now().toString().slice(-3)}`,
                      patientId: pid,
                      from,
                      to,
                      specialist: spec,
                      status: 'Accepted',
                      date: 'Just now',
                      priority: 'Medium',
                      reason: 'New clinical referral created'
                    },
                    ...prev
                  ]);
                  setShowCreateModal(false);
                  toast('Referral created successfully!', 'success');
                }}
              >
                Create Referral
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
