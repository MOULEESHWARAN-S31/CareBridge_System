import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Plus, Download, FileText, DollarSign, CreditCard, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import { BILLS } from '../data/mockData';
import { useToast } from '../components/Toast';

// Extended billing data beyond BILLS constant
const INSURANCE_CLAIMS = [
  { id: 'INS001', patient: 'Kavitha Raj',    billId: 'BILL002', insurer: 'Star Health',   claimAmt: 75000, status: 'Pending',  submitted: '2026-09-04', policy: 'SH-2024-PKG112' },
  { id: 'INS002', patient: 'Suresh Kumar',   billId: 'BILL005', insurer: 'HDFC Ergo',     claimAmt: 40000, status: 'Approved', submitted: '2026-09-03', policy: 'HE-2023-PKG089' },
  { id: 'INS003', patient: 'Ravi Kumar',     billId: 'BILL001', insurer: 'New India',     claimAmt: 10000, status: 'Rejected', submitted: '2026-09-02', policy: 'NI-2024-PKG234' },
  { id: 'INS004', patient: 'Deepak Sharma',  billId: 'BILL006', insurer: 'Bajaj Allianz', claimAmt: 55000, status: 'In Review',submitted: '2026-09-05', policy: 'BA-2024-PKG561' },
];

const REFUNDS = [
  { id: 'REF001', patient: 'Meena Devi',   billId: 'BILL004', amount: 1500, reason: 'Duplicate payment',      status: 'Approved', date: '2026-09-05' },
  { id: 'REF002', patient: 'Arun Prakash', billId: 'BILL003', amount: 3200, reason: 'Cancelled procedure',    status: 'Pending',  date: '2026-09-04' },
];

const statusBadge = {
  Paid:       'badge-success',
  Partial:    'badge-warning',
  Pending:    'badge-danger',
  Insurance:  'badge-info',
};

const insStatusBadge = {
  Approved:   'badge-success',
  Pending:    'badge-warning',
  Rejected:   'badge-danger',
  'In Review':'badge-info',
};

export default function BillingPage() {
  const toast = useToast();
  const location = useLocation();
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('All');

  // Determine which sub-view based on route
  const path = location.pathname;
  const isInsurance = path.endsWith('/insurance');
  const isRefunds   = path.endsWith('/refunds');
  const isPending   = path.endsWith('/pending');
  const isPayments  = path.endsWith('/payments');

  // Title and subtitle
  let title = 'All Bills';
  let subtitle = `${BILLS.length} total bills`;
  if (isInsurance) { title = 'Insurance Claims'; subtitle = `${INSURANCE_CLAIMS.length} insurance claims`; }
  if (isRefunds)   { title = 'Refund Requests';  subtitle = `${REFUNDS.length} refund requests`; }
  if (isPending)   { title = 'Pending Payments'; subtitle = `${BILLS.filter(b => b.status === 'Pending' || b.status === 'Partial').length} pending bills`; }
  if (isPayments)  { title = 'Payment Records';  subtitle = `${BILLS.filter(b => b.status === 'Paid').length} completed payments`; }

  const totalRevenue  = BILLS.reduce((s, b) => s + b.paid, 0);
  const totalPending  = BILLS.reduce((s, b) => s + b.balance, 0);
  const totalBilled   = BILLS.reduce((s, b) => s + b.amount, 0);

  const filteredBills = BILLS.filter(b => {
    const matchSearch = b.patient.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || b.status === filter;
    const matchRoute  = isPending  ? (b.status === 'Pending' || b.status === 'Partial')
                      : isPayments ? b.status === 'Paid'
                      : true;
    return matchSearch && matchFilter && matchRoute;
  });

  // Insurance view
  if (isInsurance) {
    return (
      <div className="page-content page-transition">
        <div className="page-header">
          <div>
            <div className="page-title">Insurance Claims</div>
            <div className="page-subtitle">{INSURANCE_CLAIMS.length} claims · Manage insurance submissions</div>
          </div>
          <button className="btn btn-primary" onClick={() => toast('New claim form opened.', 'info')}><Plus size={15} /> New Claim</button>
        </div>

        <div className="grid grid-4" style={{ marginBottom: 24 }}>
          {[
            { label: 'Total Claims',    value: INSURANCE_CLAIMS.length,                          color: '#0EA5E9', bg: '#E0F2FE' },
            { label: 'Approved',        value: INSURANCE_CLAIMS.filter(c=>c.status==='Approved').length, color: '#10B981', bg: '#D1FAE5' },
            { label: 'Pending Review',  value: INSURANCE_CLAIMS.filter(c=>c.status==='Pending'||c.status==='In Review').length, color: '#F59E0B', bg: '#FEF3C7' },
            { label: 'Rejected',        value: INSURANCE_CLAIMS.filter(c=>c.status==='Rejected').length,  color: '#EF4444', bg: '#FEE2E2' },
          ].map((s,i) => (
            <div key={i} className="stat-card">
              <div className="stat-card-icon" style={{ background: s.bg }}><CreditCard size={20} color={s.color} /></div>
              <div className="stat-card-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr><th>Claim ID</th><th>Patient</th><th>Bill ID</th><th>Insurer</th><th>Policy No.</th><th>Claim Amount</th><th>Submitted</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {INSURANCE_CLAIMS.map(c => (
                  <tr key={c.id}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 11, background: 'var(--bg)', padding: '2px 6px', borderRadius: 4, color: 'var(--primary-dark)' }}>{c.id}</span></td>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{c.patient}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{c.billId}</td>
                    <td style={{ fontSize: 13 }}>{c.insurer}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{c.policy}</td>
                    <td style={{ fontWeight: 700, color: '#0EA5E9' }}>₹{c.claimAmt.toLocaleString()}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.submitted}</td>
                    <td><span className={`badge ${insStatusBadge[c.status]}`}>{c.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => toast('Viewing claim details...', 'info')}>View</button>
                        {c.status === 'Pending' && <button className="btn btn-primary btn-sm" onClick={() => toast('Claim followed up!', 'success')}>Follow Up</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Refunds view
  if (isRefunds) {
    return (
      <div className="page-content page-transition">
        <div className="page-header">
          <div>
            <div className="page-title">Refund Requests</div>
            <div className="page-subtitle">{REFUNDS.length} refund requests pending review</div>
          </div>
          <button className="btn btn-primary" onClick={() => toast('Refund form opened.', 'info')}><Plus size={15} /> New Refund</button>
        </div>

        <div className="grid grid-3" style={{ marginBottom: 24 }}>
          {[
            { label: 'Total Requests', value: REFUNDS.length,                                   color: '#6366F1', bg: '#EDE9FE' },
            { label: 'Approved',       value: REFUNDS.filter(r=>r.status==='Approved').length,   color: '#10B981', bg: '#D1FAE5' },
            { label: 'Pending',        value: REFUNDS.filter(r=>r.status==='Pending').length,    color: '#F59E0B', bg: '#FEF3C7' },
          ].map((s,i) => (
            <div key={i} className="stat-card">
              <div className="stat-card-icon" style={{ background: s.bg }}><RefreshCw size={20} color={s.color} /></div>
              <div className="stat-card-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr><th>Refund ID</th><th>Patient</th><th>Bill ID</th><th>Amount</th><th>Reason</th><th>Date</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {REFUNDS.map(r => (
                  <tr key={r.id}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 11, background: 'var(--bg)', padding: '2px 6px', borderRadius: 4, color: '#6366F1' }}>{r.id}</span></td>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>{r.patient}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{r.billId}</td>
                    <td style={{ fontWeight: 700, color: '#EF4444' }}>₹{r.amount.toLocaleString()}</td>
                    <td style={{ fontSize: 12 }}>{r.reason}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.date}</td>
                    <td><span className={`badge ${r.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>{r.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {r.status === 'Pending' && (
                          <>
                            <button className="btn btn-primary btn-sm" onClick={() => toast('Refund approved!', 'success')}><CheckCircle size={12} /> Approve</button>
                            <button className="btn btn-ghost btn-sm" onClick={() => toast('Refund rejected.', 'error')}>Reject</button>
                          </>
                        )}
                        {r.status === 'Approved' && <button className="btn btn-ghost btn-sm" onClick={() => toast('Processing refund...', 'info')}>Process</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Default: bills / payments / pending view
  return (
    <div className="page-content page-transition">
      <div className="page-header">
        <div>
          <div className="page-title">{title}</div>
          <div className="page-subtitle">{subtitle}</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => toast('Downloading report...', 'success')}><Download size={15} /> Export</button>
          <button className="btn btn-primary" onClick={() => toast('New bill form opened.', 'info')}><Plus size={15} /> New Bill</button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Billed',    value: `₹${(totalBilled/1000).toFixed(0)}K`,  color: '#0EA5E9', bg: '#E0F2FE', icon: FileText },
          { label: 'Collected',       value: `₹${(totalRevenue/1000).toFixed(0)}K`, color: '#10B981', bg: '#D1FAE5', icon: CheckCircle },
          { label: 'Outstanding',     value: `₹${(totalPending/1000).toFixed(0)}K`, color: '#EF4444', bg: '#FEE2E2', icon: AlertCircle },
          { label: 'Bills Raised',    value: BILLS.length,                           color: '#6366F1', bg: '#EDE9FE', icon: DollarSign },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-icon" style={{ background: s.bg }}><s.icon size={20} color={s.color} /></div>
            <div className="stat-card-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
            <Search size={15} color="var(--text-muted)" />
            <input placeholder="Search patient or bill ID..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="filter-tabs">
            {['All', 'Paid', 'Partial', 'Pending'].map(f => (
              <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Bill ID</th><th>Patient</th><th>Date</th><th>Type</th>
                <th>Total Amount</th><th>Paid</th><th>Balance</th><th>Pay Mode</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map(b => (
                <tr key={b.id}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 11, background: 'var(--bg)', padding: '2px 6px', borderRadius: 4, color: 'var(--primary-dark)' }}>{b.id}</span></td>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{b.patient}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.date}</td>
                  <td><span className="tag">{b.type}</span></td>
                  <td style={{ fontWeight: 700 }}>₹{b.amount.toLocaleString()}</td>
                  <td style={{ fontWeight: 600, color: '#10B981' }}>₹{b.paid.toLocaleString()}</td>
                  <td style={{ fontWeight: 600, color: b.balance > 0 ? '#EF4444' : '#10B981' }}>
                    {b.balance > 0 ? `₹${b.balance.toLocaleString()}` : '—'}
                  </td>
                  <td style={{ fontSize: 12 }}>{b.payMode}</td>
                  <td><span className={`badge ${statusBadge[b.status] || 'badge-grey'}`}>{b.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => toast(`Viewing ${b.id}...`, 'info')}>View</button>
                      {b.balance > 0 && <button className="btn btn-primary btn-sm" onClick={() => toast('Payment recorded!', 'success')}>Pay</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
