import { useState } from 'react';
import { Search, FileText, CheckCircle2, Clock, Eye, Filter } from 'lucide-react';
import { useToast } from '../components/Toast';

const DUMMY_PRESCRIPTIONS = [
  {
    id: 'RX1001',
    patientId: 'P1001',
    doctor: 'Dr. Kumar',
    department: 'General Medicine',
    date: 'Today, 09:30 AM',
    medicines: 'Paracetamol, Pantoprazole',
    dosage: 'Paracetamol 500mg (1-0-1), Pantoprazole 40mg (1-0-0)',
    status: 'Active'
  },
  {
    id: 'RX1002',
    patientId: 'P1002',
    doctor: 'Dr. Priya',
    department: 'Pediatrics',
    date: 'Today, 10:15 AM',
    medicines: 'Amoxicillin',
    dosage: 'Amoxicillin 500mg (1-1-1)',
    status: 'Active'
  },
  {
    id: 'RX1003',
    patientId: 'P1003',
    doctor: 'Dr. Arun',
    department: 'Endocrinology',
    date: 'Yesterday, 04:45 PM',
    medicines: 'Insulin',
    dosage: 'Insulin Glargine 10 IU at bedtime',
    status: 'Completed'
  },
  {
    id: 'RX1004',
    patientId: 'P1004',
    doctor: 'Dr. Rajesh',
    department: 'Cardiology',
    date: 'Yesterday, 11:20 AM',
    medicines: 'Atorvastatin, Aspirin',
    dosage: 'Atorvastatin 20mg (0-0-1), Aspirin 75mg (0-1-0)',
    status: 'Active'
  },
  {
    id: 'RX1005',
    patientId: 'P1005',
    doctor: 'Dr. Ananya',
    department: 'Dermatology',
    date: '2 days ago',
    medicines: 'Cetirizine, Calamine Lotion',
    dosage: 'Cetirizine 10mg (0-0-1)',
    status: 'Completed'
  },
  {
    id: 'RX1006',
    patientId: 'P1006',
    doctor: 'Dr. Kumar',
    department: 'General Medicine',
    date: '3 days ago',
    medicines: 'Azithromycin 500mg',
    dosage: 'Azithromycin 500mg (1-0-0) x 3 days',
    status: 'Completed'
  }
];

export default function PrescriptionsPage() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedRx, setSelectedRx] = useState(null);

  const filtered = DUMMY_PRESCRIPTIONS.filter(rx => {
    const matchSearch =
      rx.id.toLowerCase().includes(search.toLowerCase()) ||
      rx.patientId.toLowerCase().includes(search.toLowerCase()) ||
      rx.doctor.toLowerCase().includes(search.toLowerCase()) ||
      rx.medicines.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || rx.status === filter;
    return matchSearch && matchFilter;
  });

  const activeCount = DUMMY_PRESCRIPTIONS.filter(r => r.status === 'Active').length;
  const completedCount = DUMMY_PRESCRIPTIONS.filter(r => r.status === 'Completed').length;

  return (
    <div className="page-content page-transition">
      <div className="page-header">
        <div>
          <h1 className="page-title">Prescriptions</h1>
          <div className="page-subtitle">
            Administrator overview · {DUMMY_PRESCRIPTIONS.length} total prescriptions recorded
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-ghost"
            onClick={() => toast('Prescription log exported to PDF', 'info')}
          >
            <FileText size={16} /> Export Summary
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-3" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#E0F2FE' }}>
            <FileText size={22} color="#0EA5E9" />
          </div>
          <div className="stat-card-value" style={{ color: '#0EA5E9' }}>{DUMMY_PRESCRIPTIONS.length}</div>
          <div className="stat-card-label">Total Prescriptions</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#FEF3C7' }}>
            <Clock size={22} color="#F59E0B" />
          </div>
          <div className="stat-card-value" style={{ color: '#F59E0B' }}>{activeCount}</div>
          <div className="stat-card-label">Active Prescriptions</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#D1FAE5' }}>
            <CheckCircle2 size={22} color="#10B981" />
          </div>
          <div className="stat-card-value" style={{ color: '#10B981' }}>{completedCount}</div>
          <div className="stat-card-label">Completed Prescriptions</div>
        </div>
      </div>

      {/* Prescriptions Table Card */}
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
          <div className="search-bar" style={{ flex: 1, minWidth: 240, maxWidth: 420 }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              placeholder="Search by Rx ID, Patient ID, Doctor, or Medicine..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-tabs">
            {['All', 'Active', 'Completed'].map(f => (
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
                <th>Prescription ID</th>
                <th>Patient ID</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Medicines</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(rx => (
                <tr key={rx.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: '#E0F2FE',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#0284C7'
                        }}
                      >
                        <FileText size={15} />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                        {rx.id}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '3px 8px',
                        background: '#F1F5F9',
                        borderRadius: 6,
                        fontWeight: 600,
                        fontSize: 12,
                        color: '#334155'
                      }}
                    >
                      {rx.patientId}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{rx.doctor}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{rx.department}</div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{rx.date}</td>
                  <td>
                    <span style={{ fontWeight: 600, fontSize: 13, color: '#0F172A' }}>
                      {rx.medicines}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        rx.status === 'Active' ? 'badge-warning' : 'badge-success'
                      }`}
                    >
                      {rx.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setSelectedRx(rx)}
                    >
                      <Eye size={13} /> View Details
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No prescriptions found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prescription Details Modal */}
      {selectedRx && (
        <div className="modal-overlay" onClick={() => setSelectedRx(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3>Prescription Details — {selectedRx.id}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelectedRx(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#F8FAFC', borderRadius: 8 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Patient Identifier</div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{selectedRx.patientId}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Status</div>
                    <span className={`badge ${selectedRx.status === 'Active' ? 'badge-warning' : 'badge-success'}`}>
                      {selectedRx.status}
                    </span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Prescribing Doctor</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{selectedRx.doctor} ({selectedRx.department})</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Prescribed on: {selectedRx.date}</div>
                </div>

                <div style={{ padding: '12px', background: '#F1F5F9', borderRadius: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>Prescribed Medications</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>{selectedRx.medicines}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}><strong>Dosage Instructions:</strong> {selectedRx.dosage}</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelectedRx(null)}>Close</button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  toast(`Printed Prescription ${selectedRx.id}`, 'success');
                  setSelectedRx(null);
                }}
              >
                Print Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
