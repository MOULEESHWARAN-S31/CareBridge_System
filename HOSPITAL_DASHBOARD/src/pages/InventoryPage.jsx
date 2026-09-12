import { useState } from 'react';
import { PackageOpen, AlertTriangle, Search, Plus, RefreshCw, TrendingDown } from 'lucide-react';
import { inventory } from '../data/mockData';
import { useToast } from '../components/Toast';

const statusStyle = {
  'Available':    { color: '#10B981', bg: '#D1FAE5', badge: 'badge-success' },
  'Low Stock':    { color: '#F59E0B', bg: '#FEF3C7', badge: 'badge-warning' },
  'Out of Stock': { color: '#EF4444', bg: '#FEE2E2', badge: 'badge-danger' },
};

const categoryColors = {
  'Consumables': '#0EA5E9',
  'IV Supplies': '#6366F1',
  'Syringes': '#0D9488',
  'Medical Equipment': '#8B5CF6',
  'Diagnostics': '#F59E0B',
};

export default function InventoryPage() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', ...new Set(inventory.map(i => i.category))];
  const statuses = ['All', 'Available', 'Low Stock', 'Out of Stock'];

  const filtered = inventory.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || item.status === filterStatus;
    const matchCat = filterCategory === 'All' || item.category === filterCategory;
    return matchSearch && matchStatus && matchCat;
  });

  const lowStock = inventory.filter(i => i.status === 'Low Stock').length;
  const outOfStock = inventory.filter(i => i.status === 'Out of Stock').length;
  const available = inventory.filter(i => i.status === 'Available').length;

  return (
    <div className="page-content page-transition">
      <div className="page-header">
        <div>
          <div className="page-title">Inventory Management</div>
          <div className="page-subtitle">Hospital supplies, equipment and consumables tracking</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => toast('Inventory synced!', 'success')}><RefreshCw size={15} /> Sync</button>
          <button className="btn btn-primary" onClick={() => toast('Add item dialog opened.', 'info')}><Plus size={15} /> Add Item</button>
        </div>
      </div>

      {/* Alert Banner */}
      {(lowStock > 0 || outOfStock > 0) && (
        <div style={{ padding: '14px 20px', background: 'linear-gradient(135deg, #FEF3C7, #FEE2E2)', borderRadius: 'var(--radius-md)', border: '1px solid #F59E0B30', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <AlertTriangle size={20} color="#F59E0B" />
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#92400E' }}>Stock Alert</div>
            <div style={{ fontSize: 12, color: '#78350F' }}>{outOfStock} items out of stock · {lowStock} items running low. Please initiate procurement immediately.</div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-3" style={{ marginBottom: 20 }}>
        {[
          { label: 'Available Items', value: available, color: '#10B981', bg: '#D1FAE5' },
          { label: 'Low Stock', value: lowStock, color: '#F59E0B', bg: '#FEF3C7' },
          { label: 'Out of Stock', value: outOfStock, color: '#EF4444', bg: '#FEE2E2' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ borderTop: `3px solid ${s.color}` }}>
            <div className="stat-card-icon" style={{ background: s.bg }}><PackageOpen size={20} color={s.color} /></div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-box" style={{ flex: 1, minWidth: 200 }}>
          <Search size={15} className="search-icon" />
          <input className="search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..." />
        </div>
        <div className="filter-tabs">
          {statuses.map(s => (
            <button key={s} className={`filter-tab ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>{s}</button>
          ))}
        </div>
        <select className="form-select" style={{ width: 'auto', fontSize: 12, padding: '8px 12px' }} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Min Level</th>
                <th>Unit</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Stock Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const ss = statusStyle[item.status];
                const cc = categoryColors[item.category] || '#0EA5E9';
                const pct = item.minLevel > 0 ? Math.min(100, Math.round((item.stock / (item.minLevel * 1.5)) * 100)) : 100;
                return (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{item.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.id}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: 11, color: cc, fontWeight: 600, background: cc + '15', padding: '3px 8px', borderRadius: 'var(--radius-full)' }}>{item.category}</span>
                    </td>
                    <td style={{ fontWeight: 700, fontSize: 14, color: item.stock === 0 ? '#EF4444' : item.stock < item.minLevel ? '#F59E0B' : 'var(--text-primary)' }}>
                      {item.stock.toLocaleString()}
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.minLevel}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.unit}</td>
                    <td style={{ fontSize: 12, color: item.expiry && new Date(item.expiry) < new Date(Date.now() + 90*24*60*60*1000) ? '#F59E0B' : 'var(--text-secondary)' }}>
                      {item.expiry || 'N/A'}
                    </td>
                    <td>
                      <span className={`badge ${ss.badge}`}>{item.status}</span>
                    </td>
                    <td style={{ minWidth: 100 }}>
                      <div className="progress-bar">
                        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 'var(--radius-full)', background: item.status === 'Out of Stock' ? '#EF4444' : item.status === 'Low Stock' ? '#F59E0B' : '#10B981', transition: 'width 0.5s' }} />
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => toast(`Updating ${item.name}...`, 'info')}>Update</button>
                        <button className="btn btn-primary btn-sm" onClick={() => toast(`Reorder placed for ${item.name}!`, 'success')}>Reorder</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
