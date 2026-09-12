import { useState } from 'react';
import { Search, Plus, AlertTriangle, Pill, PackageOpen, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { useToast } from '../components/Toast';

// Realistic mock data as explicitly requested
const INITIAL_MEDICINES = [
  { id: 'MED-01', name: 'Paracetamol 500 mg', stock: 450, required: 500, status: 'In Stock', lastUpdated: 'Today', category: 'Analgesic', movement: '+100 restocked', alertLevel: 'normal' },
  { id: 'MED-02', name: 'Amoxicillin 500 mg', stock: 85, required: 200, status: 'Low Stock', lastUpdated: 'Today', category: 'Antibiotic', movement: '-35 dispensed today', alertLevel: 'warning' },
  { id: 'MED-03', name: 'Pantoprazole 40 mg', stock: 210, required: 250, status: 'In Stock', lastUpdated: 'Yesterday', category: 'Antacid', movement: 'Stable buffer', alertLevel: 'normal' },
  { id: 'MED-04', name: 'Insulin', stock: 25, required: 100, status: 'Critical', lastUpdated: 'Today', category: 'Antidiabetic', movement: '-15 dispensed today', alertLevel: 'critical' },
  { id: 'MED-05', name: 'Metformin 500 mg', stock: 320, required: 400, status: 'In Stock', lastUpdated: 'Yesterday', category: 'Antidiabetic', movement: '+80 received', alertLevel: 'normal' },
  { id: 'MED-06', name: 'Azithromycin 500 mg', stock: 65, required: 150, status: 'Low Stock', lastUpdated: 'Today', category: 'Antibiotic', movement: '-20 dispensed today', alertLevel: 'warning' },
  { id: 'MED-07', name: 'Cetirizine 10 mg', stock: 410, required: 400, status: 'In Stock', lastUpdated: '2 days ago', category: 'Antihistamine', movement: 'Adequate stock', alertLevel: 'normal' },
  { id: 'MED-08', name: 'Atorvastatin 20 mg', stock: 180, required: 200, status: 'In Stock', lastUpdated: 'Yesterday', category: 'Cardiovascular', movement: 'Stable', alertLevel: 'normal' },
];

const statusBadgeColor = {
  'In Stock': 'badge-success',
  'Low Stock': 'badge-warning',
  'Critical': 'badge-danger',
};

export default function PharmacyPage() {
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [medicinesList, setMedicinesList] = useState(INITIAL_MEDICINES);

  const filteredMedicines = medicinesList.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || m.status === filter;
    return matchSearch && matchFilter;
  });

  const lowStockCount = medicinesList.filter(m => m.status === 'Low Stock').length;
  const criticalCount = medicinesList.filter(m => m.status === 'Critical').length;
  const inStockCount = medicinesList.filter(m => m.status === 'In Stock').length;
  const totalStockUnits = medicinesList.reduce((sum, m) => sum + m.stock, 0);

  function handleRestock(medId) {
    setMedicinesList(prev => prev.map(m => {
      if (m.id === medId) {
        const added = m.status === 'Critical' ? 100 : 50;
        return {
          ...m,
          stock: m.stock + added,
          status: 'In Stock',
          lastUpdated: 'Today',
          movement: `+${added} restocked just now`
        };
      }
      return m;
    }));
    toast('Stock updated successfully!', 'success');
  }

  return (
    <div className="page-content page-transition">
      <div className="page-header">
        <div>
          <h1 className="page-title">Medicine Inventory</h1>
          <div className="page-subtitle">
            Hospital Medicine Inventory · Salem District Hospital
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-ghost"
            onClick={() => toast('Exported current inventory audit', 'info')}
          >
            <RefreshCw size={15} /> Refresh Data
          </button>
          <button
            className="btn btn-primary"
            onClick={() => toast('Stock replenishment order initiated!', 'success')}
          >
            <Plus size={16} /> Add Stock Order
          </button>
        </div>
      </div>

      {/* Stock Tracking Summary Cards */}
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#E0F2FE' }}>
            <Pill size={22} color="#0EA5E9" />
          </div>
          <div className="stat-card-value" style={{ color: '#0EA5E9' }}>{totalStockUnits.toLocaleString()}</div>
          <div className="stat-card-label">Current Total Stock Units</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#D1FAE5' }}>
            <PackageOpen size={22} color="#10B981" />
          </div>
          <div className="stat-card-value" style={{ color: '#10B981' }}>{inStockCount}</div>
          <div className="stat-card-label">Adequately In Stock</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#FEF3C7' }}>
            <AlertTriangle size={22} color="#F59E0B" />
          </div>
          <div className="stat-card-value" style={{ color: '#F59E0B' }}>{lowStockCount}</div>
          <div className="stat-card-label">Low Stock Medicines</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#FEE2E2' }}>
            <AlertTriangle size={22} color="#EF4444" />
          </div>
          <div className="stat-card-value" style={{ color: '#EF4444' }}>{criticalCount}</div>
          <div className="stat-card-label">Critical Stock Medicines</div>
        </div>
      </div>

      {/* Medicine Inventory Table */}
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
            <div className="search-bar" style={{ flex: 1, minWidth: 220, maxWidth: 400 }}>
              <Search size={16} color="var(--text-muted)" />
              <input
                placeholder="Search medicine or category..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-tabs">
              {['All', 'In Stock', 'Low Stock', 'Critical'].map(f => (
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
                  <th>Medicine</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th>Stock Level</th>
                  <th>Stock Movement</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map(m => {
                  const pct = Math.round((m.stock / m.required) * 100);
                  return (
                    <tr key={m.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 10,
                              background:
                                m.status === 'Critical' ? '#FEE2E2' :
                                m.status === 'Low Stock' ? '#FEF3C7' : '#D1FAE5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Pill
                              size={16}
                              color={
                                m.status === 'Critical' ? '#EF4444' :
                                m.status === 'Low Stock' ? '#F59E0B' : '#10B981'
                              }
                            />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{m.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.category}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: 14,
                            color:
                              m.status === 'Critical' ? '#EF4444' :
                              m.status === 'Low Stock' ? '#F59E0B' : 'var(--text-primary)'
                          }}
                        >
                          {m.stock}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>
                          / {m.required}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${statusBadgeColor[m.status] || 'badge-muted'}`}>
                          {m.status}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#475569' }}>
                          {m.lastUpdated}
                        </span>
                      </td>
                      <td style={{ minWidth: 120 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress-bar" style={{ flex: 1 }}>
                            <div
                              className={`progress-fill ${m.status === 'Critical' ? 'danger' : m.status === 'Low Stock' ? '' : 'success'}`}
                              style={{
                                width: `${Math.min(pct, 100)}%`,
                                background: m.status === 'Critical' ? '#EF4444' : m.status === 'Low Stock' ? '#F59E0B' : '#10B981'
                              }}
                            />
                          </div>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', minWidth: 32 }}>{pct}%</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: 11.5, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                          {m.movement.startsWith('+') ? (
                            <ArrowUpRight size={13} color="#16A34A" />
                          ) : m.movement.startsWith('-') ? (
                            <ArrowDownRight size={13} color="#DC2626" />
                          ) : null}
                          {m.movement}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`btn btn-sm ${m.status === 'In Stock' ? 'btn-ghost' : 'btn-primary'}`}
                          onClick={() => handleRestock(m.id)}
                        >
                          {m.status === 'In Stock' ? 'Update' : 'Restock'}
                        </button>
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
