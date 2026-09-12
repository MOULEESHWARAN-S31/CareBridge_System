import { useLanguage } from '../../context/LanguageContext';
import { STATS, PATIENTS } from '../../data/mockData';
import { FileText, Archive, ClipboardList, Activity, Upload, Search } from 'lucide-react';

export default function RecordsDashboard() {
  const { t } = useLanguage();
  const s = STATS.records;
  const statCards = [
    { label: t('records.totalRecords'),      value: s.totalRecords.toLocaleString(), icon: FileText,      color: '#64748B', bg: '#F1F5F9' },
    { label: t('records.recentlyUpdated'),   value: s.recentlyUpdated,               icon: Activity,      color: '#0EA5E9', bg: '#E0F2FE' },
    { label: t('records.pendingRequests'),   value: s.pendingRequests,               icon: ClipboardList, color: '#F59E0B', bg: '#FEF3C7' },
    { label: t('records.documentsUploaded'), value: s.documentsUploaded,             icon: Upload,        color: '#10B981', bg: '#D1FAE5' },
    { label: t('records.accessedToday'),     value: s.accessedToday,                 icon: Archive,       color: '#8B5CF6', bg: '#EDE9FE' },
  ];
  return (
    <div className="fade-in">
      <div className="dashboard-header">
        <div>
          <div className="dashboard-title">📋 {t('records.title')}</div>
          <div className="dashboard-subtitle">Lakshmi Nair · Medical Records Department</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm">{t('records.uploadDoc')}</button>
          <button className="btn btn-primary btn-sm">{t('records.createRecord')}</button>
        </div>
      </div>
      <div className="stats-grid">
        {statCards.map((c, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: c.bg }}><c.icon size={20} color={c.color} /></div>
            <div className="stat-label">{c.label}</div>
            <div className="stat-value">{c.value}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <div className="card-title">🔍 {t('records.patientRecords')}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="search-bar" style={{ width: 220 }}>
              <Search size={14} color="#94A3B8" />
              <input placeholder={`${t('records.searchRecord')}...`} style={{ border: 'none', outline: 'none', fontSize: 13, color: '#0F172A', background: 'transparent', width: '100%' }} />
            </div>
            <button className="btn btn-secondary btn-sm">{t('common.filter')}</button>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr><th>{t('patients.id')}</th><th>{t('patients.name')}</th><th>{t('common.age')}/{t('common.gender')}</th><th>{t('common.department')}</th><th>Diagnosis</th><th>{t('common.status')}</th><th>{t('records.lastUpdated')}</th><th>{t('common.actions')}</th></tr>
              </thead>
              <tbody>
                {PATIENTS.slice(0, 15).map(p => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#6B7280' }}>{p.id}</td>
                    <td className="table-patient-name">{p.name}</td>
                    <td style={{ color: '#374151', fontSize: 12 }}>{p.age}y / {p.gender}</td>
                    <td style={{ color: '#374151', fontSize: 12 }}>{p.dept}</td>
                    <td style={{ color: '#374151', fontSize: 12 }}>{p.diagnosis}</td>
                    <td><span className={`badge ${p.status === 'Admitted' ? 'badge-info' : p.status === 'OPD' ? 'badge-success' : p.status === 'Critical' ? 'badge-critical' : p.status === 'Emergency' ? 'badge-danger' : 'badge-grey'}`}>{p.status}</span></td>
                    <td style={{ color: '#6B7280', fontSize: 12 }}>2026-09-05</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-secondary btn-xs">{t('common.view')}</button>
                        <button className="btn btn-primary btn-xs">{t('records.updateRecord')}</button>
                      </div>
                    </td>
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
