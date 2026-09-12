import { useLanguage } from '../../context/LanguageContext';
import { STATS, BILLS } from '../../data/mockData';
import { DollarSign, FileText, AlertTriangle, ArrowLeftRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const REVENUE_DATA = [
  { day: 'Mon', revenue: 38000 }, { day: 'Tue', revenue: 52000 },
  { day: 'Wed', revenue: 41000 }, { day: 'Thu', revenue: 67000 },
  { day: 'Fri', revenue: 58000 }, { day: 'Sat', revenue: 29000 },
  { day: 'Today', revenue: 24500 },
];

export default function BillingDashboard() {
  const { t } = useLanguage();
  const s = STATS.billing;
  const statCards = [
    { label: t('billing.todayRevenue'),   value: `₹${(s.todayRevenue/1000).toFixed(0)}K`, icon: DollarSign,    color: '#10B981', bg: '#D1FAE5' },
    { label: t('billing.paidBills'),      value: s.paidBills,      icon: FileText,      color: '#0EA5E9', bg: '#E0F2FE' },
    { label: t('billing.pendingPayments'),value: s.pendingPayments, icon: AlertTriangle, color: '#F59E0B', bg: '#FEF3C7' },
    { label: t('billing.outstanding'),    value: `₹${(s.outstanding/1000).toFixed(0)}K`,icon: DollarSign, color: '#EF4444', bg: '#FEE2E2' },
    { label: t('billing.refundRequests'), value: s.refundRequests, icon: ArrowLeftRight, color: '#8B5CF6', bg: '#EDE9FE' },
  ];

  return (
    <div className="fade-in">
      <div className="dashboard-header">
        <div>
          <div className="dashboard-title">💳 {t('billing.title')}</div>
          <div className="dashboard-subtitle">Sunita Verma · Accounts & Billing Department</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm">{t('billing.processRefund')}</button>
          <button className="btn btn-primary btn-sm">{t('billing.generateBill')}</button>
        </div>
      </div>
      <div className="stats-grid">
        {statCards.map((c, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: c.bg }}><c.icon size={20} color={c.color} /></div>
            <div className="stat-label">{c.label}</div>
            <div className="stat-value" style={{ fontSize: 22 }}>{c.value}</div>
          </div>
        ))}
      </div>
      <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="card-header"><div className="card-title">📈 Weekly Revenue</div></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={REVENUE_DATA} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} tickFormatter={v => `₹${v/1000}K`} />
                <Tooltip formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="revenue" fill="#10B981" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">⚡ {t('common.quickActions')}</div></div>
          <div className="card-body">
            <div className="quick-actions-grid">
              {[
                { label: t('billing.generateBill'), icon: FileText, color: '#0EA5E9' },
                { label: t('billing.recordPayment'), icon: DollarSign, color: '#10B981' },
                { label: t('billing.viewBill'), icon: FileText, color: '#8B5CF6' },
                { label: t('billing.processRefund'), icon: ArrowLeftRight, color: '#F59E0B' },
              ].map((a, i) => (
                <button key={i} className="quick-action-btn">
                  <div className="qa-icon" style={{ background: `${a.color}18` }}><a.icon size={18} color={a.color} /></div>
                  <span>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">📄 Recent Bills</div>
          <button className="btn btn-secondary btn-sm">{t('common.view')} {t('common.all')}</button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr><th>{t('billing.billId')}</th><th>Patient</th><th>{t('common.date')}</th><th>Total</th><th>Paid</th><th>Balance</th><th>Type</th><th>{t('billing.paymentMode')}</th><th>{t('common.status')}</th></tr>
              </thead>
              <tbody>
                {BILLS.map(b => (
                  <tr key={b.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#6B7280' }}>{b.id}</td>
                    <td className="table-patient-name">{b.patient}</td>
                    <td style={{ color: '#374151', fontSize: 12 }}>{b.date}</td>
                    <td style={{ fontWeight: 700, color: '#0F172A' }}>₹{b.amount.toLocaleString()}</td>
                    <td style={{ color: '#10B981', fontWeight: 600 }}>₹{b.paid.toLocaleString()}</td>
                    <td style={{ color: b.balance > 0 ? '#EF4444' : '#10B981', fontWeight: 700 }}>₹{b.balance.toLocaleString()}</td>
                    <td><span className="tag">{b.type}</span></td>
                    <td style={{ color: '#374151', fontSize: 12 }}>{b.payMode}</td>
                    <td><span className={`badge ${b.status === 'Paid' ? 'badge-success' : b.status === 'Partial' ? 'badge-warning' : 'badge-danger'}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
