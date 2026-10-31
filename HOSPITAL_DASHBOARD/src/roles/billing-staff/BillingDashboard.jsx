import { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { STATS, BILLS as INITIAL_BILLS, PATIENTS } from '../../data/mockData';
import {
  DollarSign, FileText, AlertTriangle, ArrowLeftRight, Search, Plus,
  Printer, CheckCircle2, Clock, ShieldCheck, Download, Eye, X, Filter,
  CreditCard, RefreshCw, ChevronRight, Check
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '../../components/common/Toast';

const REVENUE_DATA = [
  { day: 'Mon', revenue: 38000 },
  { day: 'Tue', revenue: 52000 },
  { day: 'Wed', revenue: 41000 },
  { day: 'Thu', revenue: 67000 },
  { day: 'Fri', revenue: 58000 },
  { day: 'Sat', revenue: 29000 },
  { day: 'Today', revenue: 24500 },
];

const INITIAL_INSURANCE_CLAIMS = [
  { id: 'CLM-2026-081', patient: 'Ravi Kumar', billId: 'BILL001', insurer: 'Chief Minister Comprehensive Health Insurance Scheme (CMCHIS)', claimAmt: 12500, status: 'Approved', policy: 'TN-CMCHIS-99214', date: '2026-09-06' },
  { id: 'CLM-2026-082', patient: 'Meena Devi', billId: 'BILL002', insurer: 'Ayushman Bharat PM-JAY', claimAmt: 4200, status: 'Approved', policy: 'PMJAY-636001-098', date: '2026-09-06' },
  { id: 'CLM-2026-083', patient: 'Kavitha Raj', billId: 'BILL004', insurer: 'Star Health & Allied Insurance', claimAmt: 28000, status: 'In Review', policy: 'SH-2025-MED-841', date: '2026-09-07' },
  { id: 'CLM-2026-084', patient: 'Deepak Sharma', billId: 'BILL006', insurer: 'United India Insurance TPA', claimAmt: 16500, status: 'Pending', policy: 'UII-GOVT-EMP-102', date: '2026-09-07' },
];

export default function BillingDashboard() {
  const { t } = useLanguage();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'bills' | 'insurance' | 'refunds'
  const [bills, setBills] = useState(INITIAL_BILLS);
  const [insuranceClaims, setInsuranceClaims] = useState(INITIAL_INSURANCE_CLAIMS);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(null); // bill object
  const [showClaimModal, setShowClaimModal] = useState(false);

  // Bill Generation Form State
  const [newBill, setNewBill] = useState({
    patientName: 'Ravi Kumar',
    patientId: 'PAT001',
    opId: 'TN-OP-10245',
    dept: 'General Medicine',
    type: 'OPD Consultation',
    items: [
      { desc: 'Outpatient Consultation Fee', amount: 50 },
      { desc: 'Complete Blood Count (CBC)', amount: 200 },
      { desc: 'Medications Dispensing (Pharmacy)', amount: 350 },
    ],
    subsidy: 100, // Government Subsidy discount
    payMode: 'UPI / QR Code',
    notes: 'Government Subsidized Scheme applied'
  });

  // Payment Recording State
  const [paymentTarget, setPaymentTarget] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Cash');

  // Calculate stats
  const totalRevenue = useMemo(() => bills.reduce((sum, b) => sum + (b.paid || 0), 0), [bills]);
  const totalPending = useMemo(() => bills.reduce((sum, b) => sum + (b.balance || 0), 0), [bills]);
  const paidCount = useMemo(() => bills.filter(b => b.status === 'Paid').length, [bills]);
  const pendingCount = useMemo(() => bills.filter(b => b.status === 'Pending' || b.status === 'Partial').length, [bills]);

  // Filtered bills
  const filteredBills = useMemo(() => {
    return bills.filter(b => {
      const matchSearch = b.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.payMode && b.payMode.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchStatus = statusFilter === 'All' || b.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [bills, searchTerm, statusFilter]);

  // Handle Bill Generation Submit
  function handleCreateBill(e) {
    e.preventDefault();
    const itemsTotal = newBill.items.reduce((s, it) => s + Number(it.amount || 0), 0);
    const finalAmount = Math.max(0, itemsTotal - Number(newBill.subsidy || 0));
    const billId = `BILL${String(bills.length + 1).padStart(3, '0')}`;

    const created = {
      id: billId,
      patient: newBill.patientName,
      date: new Date().toISOString().slice(0, 10),
      amount: finalAmount,
      paid: finalAmount, // marked as paid on spot
      balance: 0,
      type: newBill.type,
      payMode: newBill.payMode,
      status: 'Paid',
      items: newBill.items,
      subsidy: newBill.subsidy
    };

    setBills([created, ...bills]);
    setShowGenerateModal(false);
    toast(`Invoice ${billId} generated successfully for ${newBill.patientName}!`, 'success');
    setShowReceiptModal(created);
  }

  // Handle Add Item to new bill
  function handleAddItem() {
    setNewBill(prev => ({
      ...prev,
      items: [...prev.items, { desc: 'Diagnostic / Procedure Fee', amount: 150 }]
    }));
  }

  // Handle Remove Item
  function handleRemoveItem(idx) {
    setNewBill(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx)
    }));
  }

  // Handle Payment Submit
  function handleRecordPayment(e) {
    e.preventDefault();
    if (!paymentTarget || !payAmount) return;

    const amt = parseFloat(payAmount);
    if (isNaN(amt) || amt <= 0) {
      toast('Please enter a valid payment amount.', 'warning');
      return;
    }

    setBills(prev => prev.map(b => {
      if (b.id === paymentTarget.id) {
        const newPaid = b.paid + amt;
        const newBal = Math.max(0, b.amount - newPaid);
        return {
          ...b,
          paid: newPaid,
          balance: newBal,
          payMode: payMethod,
          status: newBal === 0 ? 'Paid' : 'Partial'
        };
      }
      return b;
    }));

    setShowPaymentModal(false);
    toast(`Payment of ₹${amt.toLocaleString()} recorded for ${paymentTarget.id}!`, 'success');
  }

  return (
    <div className="fade-in" style={{ paddingBottom: 32 }}>
      {/* Header Banner */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          padding: '20px 24px',
          border: '1px solid #E2E8F0',
          marginBottom: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              💳 {t('billing.title')} & Financial Management
            </span>
            <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
              NABH COMPLIANT CASHIER
            </span>
          </div>
          <div style={{ fontSize: '13px', color: '#64748B', marginTop: 4 }}>
            Sunita Verma · Accounts & Billing Desk · Government District Hospital — Salem
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setShowClaimModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              color: '#334155',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <ShieldCheck size={15} color="#0284C7" />
            <span>New Insurance Claim</span>
          </button>

          <button
            onClick={() => setShowGenerateModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              background: '#0EA5E9',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(14,165,233,0.3)'
            }}
          >
            <Plus size={15} />
            <span>Generate New Bill</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card" style={{ borderLeft: '4px solid #10B981' }}>
          <div className="stat-icon" style={{ background: '#D1FAE5' }}><DollarSign size={20} color="#10B981" /></div>
          <div className="stat-label">Total Realized Revenue</div>
          <div className="stat-value" style={{ fontSize: 22, color: '#10B981' }}>₹{totalRevenue.toLocaleString()}</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #0EA5E9' }}>
          <div className="stat-icon" style={{ background: '#E0F2FE' }}><FileText size={20} color="#0EA5E9" /></div>
          <div className="stat-label">Paid Invoices</div>
          <div className="stat-value" style={{ fontSize: 22 }}>{paidCount}</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #F59E0B' }}>
          <div className="stat-icon" style={{ background: '#FEF3C7' }}><Clock size={20} color="#F59E0B" /></div>
          <div className="stat-label">Pending / Partial Dues</div>
          <div className="stat-value" style={{ fontSize: 22, color: '#D97706' }}>₹{totalPending.toLocaleString()}</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #8B5CF6' }}>
          <div className="stat-icon" style={{ background: '#EDE9FE' }}><ShieldCheck size={20} color="#8B5CF6" /></div>
          <div className="stat-label">Insurance Claims Active</div>
          <div className="stat-value" style={{ fontSize: 22 }}>{insuranceClaims.length}</div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #06B6D4' }}>
          <div className="stat-icon" style={{ background: '#CFFAFE' }}><CheckCircle2 size={20} color="#06B6D4" /></div>
          <div className="stat-label">Govt Subsidized Rate</div>
          <div className="stat-value" style={{ fontSize: 22 }}>100% Free / Subsidized</div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #E2E8F0', marginBottom: 20 }}>
        {[
          { id: 'overview', label: 'Billing Overview & Revenue' },
          { id: 'bills', label: `Invoices & Receipts (${bills.length})` },
          { id: 'insurance', label: `Insurance & TPA Claims (${insuranceClaims.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === tab.id ? '3px solid #0EA5E9' : '3px solid transparent',
              color: activeTab === tab.id ? '#0284C7' : '#64748B',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <>
          <div className="grid-2" style={{ gap: 16, marginBottom: 20 }}>
            {/* Revenue Chart */}
            <div className="card" style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>📈 Weekly Cashier Collection</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>Daily breakdown of collection at Government District Hospital — Salem</div>
                </div>
                <span style={{ fontSize: 11, background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>
                  ₹2.76 Lakhs This Week
                </span>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={REVENUE_DATA} barSize={26}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={v => `₹${v/1000}K`} />
                  <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Collection']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="revenue" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Actions & Common Hospital Schemes */}
            <div className="card" style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>
                ⚡ Quick Financial Actions
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
                <button
                  onClick={() => setShowGenerateModal(true)}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    border: '1px solid #BAE6FD',
                    background: '#F0F9FF',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 6
                  }}
                >
                  <FileText size={18} color="#0284C7" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0369A1' }}>Generate Bill</span>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Create OP/IP Invoice</span>
                </button>

                <button
                  onClick={() => {
                    const firstPending = bills.find(b => b.balance > 0) || bills[0];
                    setPaymentTarget(firstPending);
                    setPayAmount(String(firstPending.balance || 50));
                    setShowPaymentModal(true);
                  }}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    border: '1px solid #BBF7D0',
                    background: '#F0FDF4',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 6
                  }}
                >
                  <DollarSign size={18} color="#16A34A" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#15803D' }}>Record Payment</span>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Cash, UPI, Card, Net</span>
                </button>

                <button
                  onClick={() => setShowClaimModal(true)}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    border: '1px solid #DDD6FE',
                    background: '#F5F3FF',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 6
                  }}
                >
                  <ShieldCheck size={18} color="#7C3AED" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#6D28D9' }}>Insurance Claim</span>
                  <span style={{ fontSize: 11, color: '#64748B' }}>CMCHIS / PM-JAY TPA</span>
                </button>

                <button
                  onClick={() => {
                    if (bills[0]) setShowReceiptModal(bills[0]);
                  }}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    border: '1px solid #FED7AA',
                    background: '#FFF7ED',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 6
                  }}
                >
                  <Printer size={18} color="#EA580C" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#C2410C' }}>Print Last Receipt</span>
                  <span style={{ fontSize: 11, color: '#64748B' }}>Official hospital copy</span>
                </button>
              </div>

              {/* Government Subsidized Coverage Alert */}
              <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '10px 14px', border: '1px solid #E2E8F0', fontSize: '11.5px', color: '#475569' }}>
                🛡️ <strong>Ayushman Bharat & CMCHIS Guidelines:</strong> All emergency triage, generic dispensary medicines, and basic laboratory investigations are 100% covered under Tamil Nadu State Health Mission.
              </div>
            </div>
          </div>
        </>
      )}

      {/* TAB 2 & OVERVIEW: INVOICES & BILLS TABLE */}
      {(activeTab === 'overview' || activeTab === 'bills') && (
        <div className="card" style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>📄 Hospital Invoices & Dues</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>Showing {filteredBills.length} patient bills</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: 10, top: 10 }} />
                <input
                  type="text"
                  placeholder="Search patient, bill ID, payment..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    padding: '7px 12px 7px 32px',
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    fontSize: '12.5px',
                    color: '#0F172A',
                    outline: 'none',
                    width: 220
                  }}
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  fontSize: '12.5px',
                  color: '#334155',
                  background: '#FFFFFF',
                  outline: 'none'
                }}
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bill ID</th>
                  <th>Patient Name</th>
                  <th>Date</th>
                  <th>Total Billed</th>
                  <th>Paid</th>
                  <th>Balance</th>
                  <th>Type</th>
                  <th>Payment Mode</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map(b => (
                  <tr key={b.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: '#0284C7' }}>{b.id}</td>
                    <td className="table-patient-name" style={{ fontWeight: 700 }}>{b.patient}</td>
                    <td style={{ color: '#475569', fontSize: 12 }}>{b.date}</td>
                    <td style={{ fontWeight: 700, color: '#0F172A' }}>₹{b.amount.toLocaleString()}</td>
                    <td style={{ color: '#16A34A', fontWeight: 600 }}>₹{b.paid.toLocaleString()}</td>
                    <td style={{ color: b.balance > 0 ? '#DC2626' : '#16A34A', fontWeight: 700 }}>
                      ₹{b.balance.toLocaleString()}
                    </td>
                    <td><span className="tag">{b.type}</span></td>
                    <td style={{ color: '#475569', fontSize: 12 }}>{b.payMode || 'UPI / Cash'}</td>
                    <td>
                      <span className={`badge ${b.status === 'Paid' ? 'badge-success' : b.status === 'Partial' ? 'badge-warning' : 'badge-danger'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => setShowReceiptModal(b)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 6,
                            border: '1px solid #CBD5E1',
                            background: '#FFFFFF',
                            color: '#334155',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                          title="View Digital Receipt"
                        >
                          <Eye size={12} /> Receipt
                        </button>

                        {b.balance > 0 && (
                          <button
                            onClick={() => {
                              setPaymentTarget(b);
                              setPayAmount(String(b.balance));
                              setShowPaymentModal(true);
                            }}
                            style={{
                              padding: '4px 8px',
                              borderRadius: 6,
                              border: 'none',
                              background: '#10B981',
                              color: '#FFFFFF',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Pay Due
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
      )}

      {/* TAB 3: INSURANCE CLAIMS */}
      {activeTab === 'insurance' && (
        <div className="card" style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>🛡️ Government & Private Insurance Claims</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>Direct cashless settlements via Ayushman Bharat, CMCHIS & Private TPAs</div>
            </div>
            <button
              onClick={() => setShowClaimModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 8,
                background: '#0EA5E9',
                color: '#fff',
                border: 'none',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Plus size={14} /> Submit New Claim
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Patient Name</th>
                  <th>Linked Bill</th>
                  <th>Insurance Provider / Scheme</th>
                  <th>Policy / Card No.</th>
                  <th>Claim Amount</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {insuranceClaims.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: '#7C3AED' }}>{c.id}</td>
                    <td style={{ fontWeight: 700 }}>{c.patient}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{c.billId}</td>
                    <td style={{ color: '#0F172A', fontWeight: 600, fontSize: 12 }}>{c.insurer}</td>
                    <td style={{ color: '#64748B', fontFamily: 'monospace', fontSize: 11 }}>{c.policy}</td>
                    <td style={{ fontWeight: 700, color: '#0F172A' }}>₹{c.claimAmt.toLocaleString()}</td>
                    <td style={{ color: '#64748B', fontSize: 12 }}>{c.date}</td>
                    <td>
                      <span className={`badge ${c.status === 'Approved' ? 'badge-success' : c.status === 'In Review' ? 'badge-info' : 'badge-warning'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toast(`Claim document status refreshed for ${c.id}`, 'info')}
                        style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #CBD5E1', background: '#F8FAFC', fontSize: 11, cursor: 'pointer' }}
                      >
                        Track TPA
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL: GENERATE NEW BILL ────────────────────────────── */}
      {showGenerateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: 16
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 14,
              maxWidth: 580,
              width: '100%',
              padding: '24px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 48px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #E2E8F0', paddingBottom: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>💳 Generate Hospital Invoice / Bill</div>
              <button onClick={() => setShowGenerateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateBill}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={newBill.patientName}
                    onChange={e => setNewBill({ ...newBill, patientName: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    OP Number / ABHA ID
                  </label>
                  <input
                    type="text"
                    value={newBill.opId}
                    onChange={e => setNewBill({ ...newBill, opId: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Department
                  </label>
                  <select
                    value={newBill.dept}
                    onChange={e => setNewBill({ ...newBill, dept: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  >
                    <option>General Medicine</option>
                    <option>Cardiology</option>
                    <option>Orthopedics</option>
                    <option>Gynecology</option>
                    <option>Pediatrics</option>
                    <option>Casualty / Emergency</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Billing Classification
                  </label>
                  <select
                    value={newBill.type}
                    onChange={e => setNewBill({ ...newBill, type: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  >
                    <option>OPD Consultation</option>
                    <option>IP Admission</option>
                    <option>Pharmacy Dispensation</option>
                    <option>Diagnostics / Lab</option>
                    <option>Emergency Trauma Care</option>
                  </select>
                </div>
              </div>

              {/* Line Items */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>Invoice Items & Fees</label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    style={{ background: 'none', border: 'none', color: '#0284C7', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                  >
                    + Add Item
                  </button>
                </div>

                <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
                  {newBill.items.map((it, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 8, padding: '8px 10px', borderBottom: idx < newBill.items.length - 1 ? '1px solid #F1F5F9' : 'none', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={it.desc}
                        onChange={e => {
                          const updated = [...newBill.items];
                          updated[idx].desc = e.target.value;
                          setNewBill({ ...newBill, items: updated });
                        }}
                        style={{ flex: 1, padding: '6px 8px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12 }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 12, color: '#64748B' }}>₹</span>
                        <input
                          type="number"
                          value={it.amount}
                          onChange={e => {
                            const updated = [...newBill.items];
                            updated[idx].amount = Number(e.target.value);
                            setNewBill({ ...newBill, items: updated });
                          }}
                          style={{ width: 80, padding: '6px 8px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12, textAlign: 'right' }}
                        />
                      </div>
                      {newBill.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: 14 }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Subsidies & Payment Method */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Govt Subsidy / Concession (₹)
                  </label>
                  <input
                    type="number"
                    value={newBill.subsidy}
                    onChange={e => setNewBill({ ...newBill, subsidy: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Payment Mode
                  </label>
                  <select
                    value={newBill.payMode}
                    onChange={e => setNewBill({ ...newBill, payMode: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                  >
                    <option>UPI / QR Code</option>
                    <option>Cash</option>
                    <option>Credit / Debit Card</option>
                    <option>CMCHIS Health Card</option>
                    <option>PM-JAY Golden Card</option>
                  </select>
                </div>
              </div>

              {/* Total Summary */}
              <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, border: '1px solid #E2E8F0', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748B', marginBottom: 4 }}>
                  <span>Gross Total:</span>
                  <span>₹{newBill.items.reduce((s, it) => s + Number(it.amount || 0), 0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#16A34A', marginBottom: 4 }}>
                  <span>Government Subsidy:</span>
                  <span>- ₹{newBill.subsidy}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 800, color: '#0F172A', borderTop: '1px dashed #CBD5E1', paddingTop: 6 }}>
                  <span>Net Payable Amount:</span>
                  <span>₹{Math.max(0, newBill.items.reduce((s, it) => s + Number(it.amount || 0), 0) - newBill.subsidy)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer', fontSize: 13 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#0EA5E9', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}
                >
                  Confirm & Issue Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: RECORD PAYMENT ───────────────────────────────── */}
      {showPaymentModal && paymentTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: 16
          }}
        >
          <div style={{ background: '#FFFFFF', borderRadius: 14, maxWidth: 440, width: '100%', padding: 24, boxShadow: '0 20px 48px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>💵 Record Payment</div>
              <button onClick={() => setShowPaymentModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: 14, background: '#F8FAFC', padding: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{paymentTarget.patient}</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>Bill ID: {paymentTarget.id} · Total: ₹{paymentTarget.amount}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#DC2626', marginTop: 4 }}>
                Current Balance Due: ₹{paymentTarget.balance}
              </div>
            </div>

            <form onSubmit={handleRecordPayment}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Payment Amount (₹)
                </label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={e => setPayAmount(e.target.value)}
                  max={paymentTarget.balance}
                  required
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, fontWeight: 700 }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Payment Method
                </label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}
                >
                  <option>Cash (Hospital Cashier)</option>
                  <option>UPI / BHIM QR Code</option>
                  <option>Debit / Credit POS Card</option>
                  <option>Net Banking / RTGS</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer', fontSize: 12 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#10B981', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: VIEW & PRINT DIGITAL RECEIPT ─────────────────── */}
      {showReceiptModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: 16
          }}
        >
          <div style={{ background: '#FFFFFF', borderRadius: 14, maxWidth: 480, width: '100%', padding: 24, boxShadow: '0 20px 48px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>🧾 Official Patient Bill & Receipt</div>
              <button onClick={() => setShowReceiptModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            {/* Printable Area */}
            <div style={{ border: '2px dashed #CBD5E1', borderRadius: 10, padding: 18, background: '#FAFAFA', marginBottom: 16, fontFamily: 'monospace' }}>
              <div style={{ textAlign: 'center', marginBottom: 12, borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#061E38' }}>GOVERNMENT DISTRICT HOSPITAL — SALEM</div>
                <div style={{ fontSize: 10, color: '#64748B' }}>Tamil Nadu Health & Family Welfare Department · Node #42</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0284C7', marginTop: 4 }}>TAX INVOICE & PAYMENT RECEIPT</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                <span>Receipt No: <strong>{showReceiptModal.id}</strong></span>
                <span>Date: {showReceiptModal.date}</span>
              </div>
              <div style={{ fontSize: 11, marginBottom: 4 }}>
                <span>Patient: <strong>{showReceiptModal.patient}</strong></span>
              </div>
              <div style={{ fontSize: 11, marginBottom: 10 }}>
                <span>Service Category: {showReceiptModal.type}</span>
              </div>

              <div style={{ borderTop: '1px solid #CBD5E1', borderBottom: '1px solid #CBD5E1', padding: '6px 0', margin: '8px 0', fontSize: 11 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Particulars</span>
                  <span>Amount</span>
                </div>
                {showReceiptModal.items ? (
                  showReceiptModal.items.map((it, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', marginTop: 2 }}>
                      <span>{it.desc}</span>
                      <span>₹{it.amount}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', marginTop: 2 }}>
                    <span>Hospital Consultation & Pharmacy Services</span>
                    <span>₹{showReceiptModal.amount}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, color: '#0F172A', marginTop: 6 }}>
                <span>TOTAL PAID:</span>
                <span>₹{showReceiptModal.paid || showReceiptModal.amount}</span>
              </div>
              <div style={{ fontSize: 10, color: '#16A34A', marginTop: 4 }}>
                Payment Mode: {showReceiptModal.payMode || 'UPI / Cash'} (Verified)
              </div>
              <div style={{ textAlign: 'center', marginTop: 14, fontSize: 9, color: '#94A3B8' }}>
                Computer generated receipt. Valid across ABDM & CMCHIS verification.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  toast(`Digital Receipt ${showReceiptModal.id} downloaded as PDF!`, 'success');
                  setShowReceiptModal(null);
                }}
                style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Download size={13} /> Save PDF
              </button>
              <button
                onClick={() => {
                  window.print();
                  setShowReceiptModal(null);
                }}
                style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#0EA5E9', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Printer size={13} /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: SUBMIT INSURANCE CLAIM ────────────────────────── */}
      {showClaimModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: 16
          }}
        >
          <div style={{ background: '#FFFFFF', borderRadius: 14, maxWidth: 500, width: '100%', padding: 24, boxShadow: '0 20px 48px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>🛡️ New Cashless Insurance Pre-Auth / Claim</div>
              <button onClick={() => setShowClaimModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={e => {
              e.preventDefault();
              const newClaim = {
                id: `CLM-2026-0${insuranceClaims.length + 85}`,
                patient: e.target.patientName.value,
                billId: e.target.billId.value,
                insurer: e.target.insurer.value,
                claimAmt: Number(e.target.claimAmt.value),
                status: 'In Review',
                policy: e.target.policy.value,
                date: new Date().toISOString().slice(0, 10)
              };
              setInsuranceClaims([newClaim, ...insuranceClaims]);
              setShowClaimModal(false);
              toast(`Insurance Pre-Auth submitted for ${newClaim.patient} under ${newClaim.insurer}!`, 'success');
            }}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Patient Name
                </label>
                <input name="patientName" defaultValue="Ravi Kumar" required style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Linked Bill ID
                  </label>
                  <input name="billId" defaultValue="BILL003" required style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                    Claim Amount (₹)
                  </label>
                  <input name="claimAmt" type="number" defaultValue="8500" required style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }} />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Health Insurance Scheme / TPA
                </label>
                <select name="insurer" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }}>
                  <option>Chief Minister Comprehensive Health Insurance Scheme (CMCHIS)</option>
                  <option>Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)</option>
                  <option>Star Health and Allied Insurance Co.</option>
                  <option>United India Insurance TPA</option>
                  <option>HDFC ERGO General Insurance</option>
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 4 }}>
                  Policy Number / PM-JAY ABHA Card Number
                </label>
                <input name="policy" defaultValue="TN-CMCHIS-98214" required style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 13 }} />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer', fontSize: 12 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#0EA5E9', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}
                >
                  Submit Pre-Authorization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
