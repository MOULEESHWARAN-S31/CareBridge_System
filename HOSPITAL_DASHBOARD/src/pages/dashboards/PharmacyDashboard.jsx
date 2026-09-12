import { useState, useMemo, useEffect } from 'react';
import {
  Pill, PackageOpen, AlertTriangle, Archive, Plus,
  Search, Calendar, RefreshCw, Eye, Edit2, Trash2, CheckCircle2,
  TrendingDown, ShieldAlert, Clock, ArrowUpDown, Filter, ChevronRight,
  AlertCircle, Check, X, ShieldX, ShoppingCart, Layers, ExternalLink,
  Activity, ArrowUpRight, BarChart3, CheckCircle, Flame
} from 'lucide-react';
import { useToast } from '../../components/Toast';
import PatientSearchGateway from '../../components/PatientSearchGateway';
import '../../styles/pharmacy.css';

// Reference date for clinical tracking: 2026-09-07
const REFERENCE_DATE = new Date('2026-09-07');

function getDaysRemaining(expiryStr) {
  try {
    const exp = new Date(expiryStr);
    const diff = Math.round((exp - REFERENCE_DATE) / (1000 * 60 * 60 * 24));
    return diff;
  } catch {
    return 365;
  }
}

function getExpiryCategory(days) {
  if (days <= 0) return 'Expired';
  if (days <= 30) return 'Expiring Within 30 Days';
  if (days <= 90) return 'Expiring Within 90 Days';
  return 'Valid';
}

// Master Pharmacy Medicines Dataset with full 10 fields
const INITIAL_MEDICINES = [
  {
    name: 'Paracetamol 500 mg',
    id: 'MED-PCM-500',
    category: 'Analgesic',
    batch: 'PCM-2510',
    availableQty: 12,
    reorderLevel: 30,
    unitPrice: 1.50,
    supplier: 'Apex Healthcare Labs',
    expiryDate: '2027-12-15',
    stockStatus: 'Low Stock',
    lastUpdated: 'Today, 09:30 AM'
  },
  {
    name: 'Amoxicillin 500 mg',
    id: 'MED-AMX-500',
    category: 'Antibiotic',
    batch: 'AMX-2405',
    availableQty: 18,
    reorderLevel: 30,
    unitPrice: 4.20,
    supplier: 'Biochem Remedies Ltd',
    expiryDate: '2026-09-25', // 18 days left -> Expiring within 30 days
    stockStatus: 'Low Stock',
    lastUpdated: 'Today, 10:15 AM'
  },
  {
    name: 'Metformin 500 mg',
    id: 'MED-MET-500',
    category: 'Antidiabetic',
    batch: 'MET-2401',
    availableQty: 120,
    reorderLevel: 40,
    unitPrice: 2.80,
    supplier: 'Sun Pharma Lifesciences',
    expiryDate: '2026-10-15', // 38 days left -> Expiring within 90 days
    stockStatus: 'In Stock',
    lastUpdated: 'Yesterday, 04:20 PM'
  },
  {
    name: 'Amlodipine 5 mg',
    id: 'MED-AML-005',
    category: 'Cardiovascular',
    batch: 'AML-2503',
    availableQty: 320,
    reorderLevel: 50,
    unitPrice: 3.10,
    supplier: 'Cipla Therapeutics',
    expiryDate: '2027-04-18',
    stockStatus: 'In Stock',
    lastUpdated: 'Today, 08:45 AM'
  },
  {
    name: 'Omeprazole 20 mg',
    id: 'MED-OME-020',
    category: 'Gastrointestinal',
    batch: 'OME-2408',
    availableQty: 85,
    reorderLevel: 40,
    unitPrice: 3.50,
    supplier: 'Dr. Reddy Labs',
    expiryDate: '2026-11-20', // 74 days left -> Expiring within 90 days
    stockStatus: 'In Stock',
    lastUpdated: '2 days ago'
  },
  {
    name: 'Atorvastatin 40 mg',
    id: 'MED-ATV-040',
    category: 'Cardiovascular',
    batch: 'ATV-2508',
    availableQty: 180,
    reorderLevel: 45,
    unitPrice: 5.75,
    supplier: 'Zydus Cadila Corp',
    expiryDate: '2027-06-30',
    stockStatus: 'In Stock',
    lastUpdated: 'Today, 11:10 AM'
  },
  {
    name: 'Aspirin 75 mg',
    id: 'MED-ASP-075',
    category: 'Cardiovascular',
    batch: 'ASP-2502',
    availableQty: 200,
    reorderLevel: 60,
    unitPrice: 1.20,
    supplier: 'Bayer Healthcare',
    expiryDate: '2027-08-20',
    stockStatus: 'In Stock',
    lastUpdated: 'Yesterday'
  },
  {
    name: 'Folic Acid 5 mg',
    id: 'MED-FOL-005',
    category: 'Vitamins',
    batch: 'FOL-2509',
    availableQty: 260,
    reorderLevel: 50,
    unitPrice: 0.85,
    supplier: 'Mankind Pharma',
    expiryDate: '2027-10-10',
    stockStatus: 'In Stock',
    lastUpdated: 'Today, 09:00 AM'
  },
  {
    name: 'Furosemide 40 mg',
    id: 'MED-FUR-040',
    category: 'Diuretic',
    batch: 'FUR-2409',
    availableQty: 14,
    reorderLevel: 35,
    unitPrice: 2.15,
    supplier: 'Sanofi Healthcare',
    expiryDate: '2026-10-05', // 28 days left -> Expiring within 30 days
    stockStatus: 'Low Stock',
    lastUpdated: 'Today, 07:30 AM'
  },
  {
    name: 'Metoprolol 25 mg',
    id: 'MED-MET-025',
    category: 'Cardiovascular',
    batch: 'MET-2512',
    availableQty: 0,
    reorderLevel: 40,
    unitPrice: 3.40,
    supplier: 'AstraZeneca Pharma',
    expiryDate: '2026-11-15',
    stockStatus: 'Out of Stock',
    lastUpdated: 'Today, 06:15 AM'
  },
  {
    name: 'Cefixime 200 mg',
    id: 'MED-CEF-200',
    category: 'Antibiotic',
    batch: 'CEF-2408',
    availableQty: 140,
    reorderLevel: 40,
    unitPrice: 6.50,
    supplier: 'Lupin Pharmaceuticals',
    expiryDate: '2026-08-30', // -8 days -> Expired!
    stockStatus: 'In Stock',
    lastUpdated: '3 days ago'
  },
  {
    name: 'Azithromycin 500 mg',
    id: 'MED-AZI-500',
    category: 'Antibiotic',
    batch: 'AZI-2404',
    availableQty: 5,
    reorderLevel: 30,
    unitPrice: 8.90,
    supplier: 'Alkem Laboratories',
    expiryDate: '2026-09-18', // 11 days left -> Expiring within 30 days
    stockStatus: 'Low Stock',
    lastUpdated: 'Today, 10:45 AM'
  },
];

// Initial Alert Notifications (NOT a table, but alert feeds)
const INITIAL_ALERTS = [
  {
    id: 'ALT-101',
    severity: 'Critical Stock',
    medicine: 'Metoprolol 25 mg',
    currentQty: 0,
    reorderLevel: 40,
    time: '15 mins ago',
    resolved: false,
    message: 'Zero stock units remaining in dispensary. Critical for ICU and cardiology admissions. Reorder immediately.'
  },
  {
    id: 'ALT-102',
    severity: 'Critical Stock',
    medicine: 'Azithromycin 500 mg',
    currentQty: 5,
    reorderLevel: 30,
    time: '45 mins ago',
    resolved: false,
    message: 'Only 5 units remaining (buffer critical). Dispensing restricted to STAT respiratory emergencies.'
  },
  {
    id: 'ALT-103',
    severity: 'Low Stock',
    medicine: 'Paracetamol 500 mg',
    currentQty: 12,
    reorderLevel: 30,
    time: '2 hours ago',
    resolved: false,
    message: '12 units remaining. Reorder level: 30. Standard OPD volume will deplete supply within 6 hours.'
  },
  {
    id: 'ALT-104',
    severity: 'Low Stock',
    medicine: 'Amoxicillin 500 mg',
    currentQty: 18,
    reorderLevel: 30,
    time: '3 hours ago',
    resolved: false,
    message: '18 units remaining. Reorder level: 30. High outpatient antibiotic prescription volume.'
  },
  {
    id: 'ALT-105',
    severity: 'Low Stock',
    medicine: 'Furosemide 40 mg',
    currentQty: 14,
    reorderLevel: 35,
    time: 'Yesterday, 06:30 PM',
    resolved: true,
    message: 'Stock fell to 14 units. PO #8821 dispatched to Sanofi Healthcare.'
  }
];

// Activity Audit Log
const RECENT_ACTIVITIES = [
  {
    id: 'ACT-1',
    type: 'reorder',
    title: 'PO #8821 Dispatched',
    desc: 'Purchase order for 100 units Paracetamol 500mg sent to Apex Healthcare Labs',
    time: '12m ago',
    icon: ShoppingCart,
    color: '#0284C7',
    bg: '#E0F2FE'
  },
  {
    id: 'ACT-2',
    type: 'quarantine',
    title: 'Batch Quarantined for Disposal',
    desc: 'Cefixime 200mg (Batch CEF-2408) removed from dispensary rack to Bio-Hazard Bin',
    time: '45m ago',
    icon: ShieldAlert,
    color: '#DC2626',
    bg: '#FEE2E2'
  },
  {
    id: 'ACT-3',
    type: 'dispense',
    title: 'Outpatient Prescription Dispensed',
    desc: '10 units Metformin 500mg verified & issued to Patient OP2026001 (Arun Kumar)',
    time: '1h 10m ago',
    icon: CheckCircle2,
    color: '#10B981',
    bg: '#D1FAE5'
  },
  {
    id: 'ACT-4',
    type: 'alert',
    title: 'Critical Stock Alert Triggered',
    desc: 'Metoprolol 25mg hit 0 available units — flagged for immediate emergency refill',
    time: '2h ago',
    icon: AlertTriangle,
    color: '#D97706',
    bg: '#FEF3C7'
  }
];

export default function PharmacyDashboard({ initialTab = 'overview' }) {
  const toast = useToast();

  // Navigation Tab: 'overview' | 'inventory' | 'low-stock' | 'stock-alerts' | 'expiry'
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Master Medicines State
  const [medicines, setMedicines] = useState(INITIAL_MEDICINES);

  // Alerts State
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [alertFilter, setAlertFilter] = useState('All');

  // Inventory Filters State
  const [invSearch, setInvSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockStatusFilter, setStockStatusFilter] = useState('All');

  // Expiry Category Filter
  const [expiryCategoryFilter, setExpiryCategoryFilter] = useState('All');

  // Modals State
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [showEditMedModal, setShowEditMedModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);

  // Add Medicine Form
  const [newMedForm, setNewMedForm] = useState({
    name: '',
    id: '',
    category: 'Analgesic',
    batch: '',
    availableQty: 100,
    reorderLevel: 30,
    unitPrice: 2.50,
    supplier: '',
    expiryDate: '2027-12-31',
    stockStatus: 'In Stock'
  });

  // Patient Identification Gateway
  const [activePatient, setActivePatient] = useState(null);

  // ─────────────────────────────────────────────────────────────────
  // TOP KPI METRICS
  // ─────────────────────────────────────────────────────────────────
  const totalMedicines = medicines.length;
  const totalStockUnits = medicines.reduce((sum, m) => sum + Number(m.availableQty), 0);
  const lowStockItemsCount = medicines.filter(m => Number(m.availableQty) <= Number(m.reorderLevel)).length;
  const criticalAlertsCount = alerts.filter(a => a.severity === 'Critical Stock' && !a.resolved).length;
  const expiringSoonCount = medicines.filter(m => {
    const days = getDaysRemaining(m.expiryDate);
    return days > 0 && days <= 90;
  }).length;
  const expiredMedicinesCount = medicines.filter(m => getDaysRemaining(m.expiryDate) <= 0).length;

  // Breakdown figures for charts
  const inStockCount = medicines.filter(m => m.stockStatus === 'In Stock').length;
  const outOfStockCount = medicines.filter(m => m.stockStatus === 'Out of Stock' || m.availableQty === 0).length;
  const lowStockCount = medicines.filter(m => m.stockStatus === 'Low Stock' && m.availableQty > 0).length;

  const totalInventoryValue = medicines.reduce((sum, m) => sum + (Number(m.availableQty) * Number(m.unitPrice)), 0);

  // Category counts
  const categorySummary = useMemo(() => {
    const map = {};
    medicines.forEach(m => {
      map[m.category] = (map[m.category] || 0) + Number(m.availableQty);
    });
    return Object.entries(map).map(([name, qty]) => ({
      name,
      qty,
      pct: Math.round((qty / (totalStockUnits || 1)) * 100)
    })).sort((a, b) => b.qty - a.qty);
  }, [medicines, totalStockUnits]);

  // ─────────────────────────────────────────────────────────────────
  // FEATURE 1: MEDICATION INVENTORY (Full Stock Management)
  // ─────────────────────────────────────────────────────────────────
  const categoriesList = ['All', ...new Set(medicines.map(m => m.category))];

  const filteredInventory = useMemo(() => {
    return medicines.filter(m => {
      const q = invSearch.toLowerCase().trim();
      const matchSearch = !q || (
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.batch.toLowerCase().includes(q) ||
        m.supplier.toLowerCase().includes(q)
      );
      const matchCat = categoryFilter === 'All' || m.category === categoryFilter;
      const matchStock = stockStatusFilter === 'All' || m.stockStatus === stockStatusFilter;
      return matchSearch && matchCat && matchStock;
    });
  }, [medicines, invSearch, categoryFilter, stockStatusFilter]);

  function handleSaveNewMedicine(e) {
    e.preventDefault();
    if (!newMedForm.name.trim() || !newMedForm.batch.trim()) {
      toast('Please provide a valid Medicine Name and Batch Number', 'error');
      return;
    }

    const autoId = newMedForm.id || `MED-${newMedForm.name.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const qty = Number(newMedForm.availableQty);
    const reorder = Number(newMedForm.reorderLevel);

    let status = 'In Stock';
    if (qty === 0) status = 'Out of Stock';
    else if (qty <= reorder) status = 'Low Stock';

    const entry = {
      ...newMedForm,
      id: autoId,
      availableQty: qty,
      reorderLevel: reorder,
      unitPrice: Number(newMedForm.unitPrice),
      stockStatus: status,
      lastUpdated: 'Just now'
    };

    setMedicines(prev => [entry, ...prev]);
    setShowAddMedModal(false);
    toast(`Added ${entry.name} to pharmacy inventory`, 'success');

    // Reset Form
    setNewMedForm({
      name: '',
      id: '',
      category: 'Analgesic',
      batch: '',
      availableQty: 100,
      reorderLevel: 30,
      unitPrice: 2.50,
      supplier: '',
      expiryDate: '2027-12-31',
      stockStatus: 'In Stock'
    });
  }

  function handleSaveEditMedicine(e) {
    e.preventDefault();
    if (!selectedMed) return;

    const qty = Number(selectedMed.availableQty);
    const reorder = Number(selectedMed.reorderLevel);

    let status = 'In Stock';
    if (qty === 0) status = 'Out of Stock';
    else if (qty <= reorder) status = 'Low Stock';

    setMedicines(prev => prev.map(m => {
      if (m.id === selectedMed.id) {
        return {
          ...selectedMed,
          availableQty: qty,
          reorderLevel: reorder,
          unitPrice: Number(selectedMed.unitPrice),
          stockStatus: status,
          lastUpdated: 'Just now'
        };
      }
      return m;
    }));

    setShowEditMedModal(false);
    toast(`Medicine ${selectedMed.name} updated successfully`, 'success');
  }

  function handleDeleteMedicine(medId, medName) {
    if (window.confirm(`Are you sure you want to delete ${medName} from the inventory?`)) {
      setMedicines(prev => prev.filter(m => m.id !== medId));
      toast(`Deleted ${medName} from inventory`, 'info');
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // FEATURE 2: LOW STOCK (ONLY MEDICINES BELOW REORDER LEVEL)
  // ─────────────────────────────────────────────────────────────────
  const lowStockOnlyList = useMemo(() => {
    return medicines.filter(m => Number(m.availableQty) <= Number(m.reorderLevel) || m.stockStatus === 'Out of Stock');
  }, [medicines]);

  function handleReorderItem(medId, medName, supplier) {
    const replenishAmount = 100;
    setMedicines(prev => prev.map(m => {
      if (m.id === medId) {
        const nextQty = m.availableQty + replenishAmount;
        return {
          ...m,
          availableQty: nextQty,
          stockStatus: nextQty > m.reorderLevel ? 'In Stock' : 'Low Stock',
          lastUpdated: 'Just now'
        };
      }
      return m;
    }));

    // Update alerts too
    setAlerts(prev => prev.map(a => {
      if (a.medicine.toLowerCase().includes(medName.toLowerCase())) {
        return { ...a, resolved: true };
      }
      return a;
    }));

    toast(`Purchase Order (+${replenishAmount} units) issued for ${medName} to ${supplier}`, 'success');
  }

  // ─────────────────────────────────────────────────────────────────
  // FEATURE 3: LOW STOCK ALERTS (ALERT / NOTIFICATION FEED)
  // ─────────────────────────────────────────────────────────────────
  const filteredAlerts = useMemo(() => {
    if (alertFilter === 'Critical') return alerts.filter(a => a.severity === 'Critical Stock' && !a.resolved);
    if (alertFilter === 'Low Stock') return alerts.filter(a => a.severity === 'Low Stock' && !a.resolved);
    if (alertFilter === 'Resolved') return alerts.filter(a => a.resolved);
    return alerts;
  }, [alerts, alertFilter]);

  function handleMarkAlertResolved(alertId) {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, resolved: true } : a));
    toast('Alert marked as resolved', 'info');
  }

  // ─────────────────────────────────────────────────────────────────
  // FEATURE 4: EXPIRY TRACKING (EXPIRATION MANAGEMENT ONLY)
  // ─────────────────────────────────────────────────────────────────
  const expiryTrackingList = useMemo(() => {
    return medicines.map(m => {
      const days = getDaysRemaining(m.expiryDate);
      const cat = getExpiryCategory(days);
      return {
        ...m,
        daysRemaining: days,
        expiryCategory: cat
      };
    });
  }, [medicines]);

  const filteredExpiryList = useMemo(() => {
    if (expiryCategoryFilter === 'All') return expiryTrackingList;
    return expiryTrackingList.filter(m => m.expiryCategory === expiryCategoryFilter);
  }, [expiryTrackingList, expiryCategoryFilter]);

  function handleRemoveExpired(medId, medName, batch) {
    setMedicines(prev => prev.filter(m => m.id !== medId));
    toast(`Quarantined and removed expired batch ${batch} (${medName})`, 'success');
  }

  function handleMarkForDisposal(batch, medName) {
    toast(`Batch ${batch} (${medName}) flagged for hazardous medical waste incineration`, 'info');
  }

  return (
    <div className="pharmacy-container fade-in">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER (Requirement 11)
          Layout:
          Pharmacy
          Manage medicines, inventory, stock alerts and expiry tracking
                                               + Add Medicine
      ───────────────────────────────────────────────────────────── */}
      <div className="pharmacy-header">
        <div className="pharmacy-header-left">
          <h1 className="pharmacy-page-title">
            <Pill size={26} color="#0EA5E9" />
            <span>Pharmacy</span>
          </h1>
          <p className="pharmacy-page-subtitle">
            Manage medicines, inventory, stock alerts and expiry tracking
          </p>
        </div>

        <div className="pharmacy-header-actions">
          <button
            className="pharmacy-btn-secondary"
            onClick={() => toast('Dispensary inventory count synchronized with central warehouse', 'info')}
            title="Synchronize Inventory"
          >
            <RefreshCw size={15} />
            <span>Sync Stock</span>
          </button>
          <button
            className="pharmacy-btn-primary"
            onClick={() => {
              setActiveTab('inventory');
              setShowAddMedModal(true);
            }}
          >
            <Plus size={16} />
            <span>Add Medicine</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. TOP 6 KPI CARDS (Requirement 4)
          Cards:
          1. Total Medicines
          2. Total Stock Units
          3. Low Stock Items
          4. Critical Alerts
          5. Expiring Soon
          6. Expired Medicines
      ───────────────────────────────────────────────────────────── */}
      <div className="pharmacy-kpi-grid">
        {/* 1. Total Medicines */}
        <div
          className={`pharmacy-kpi-card ${activeTab === 'inventory' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('inventory')}
          title="Open Medication Inventory"
        >
          <div className="pharmacy-kpi-card-top">
            <div className="pharmacy-kpi-icon" style={{ background: '#E0F2FE' }}>
              <PackageOpen size={20} color="#0284C7" />
            </div>
            <span className="pharmacy-kpi-badge" style={{ background: '#F0FDF4', color: '#16A34A' }}>Active</span>
          </div>
          <div>
            <div className="pharmacy-kpi-label">Total Medicines</div>
            <div className="pharmacy-kpi-value">{totalMedicines}</div>
          </div>
          <div className="pharmacy-kpi-action" style={{ color: '#0284C7' }}>
            <span>Inventory</span>
            <ChevronRight size={12} />
          </div>
        </div>

        {/* 2. Total Stock Units */}
        <div
          className="pharmacy-kpi-card"
          onClick={() => setActiveTab('inventory')}
          title="View Total Units in Inventory"
        >
          <div className="pharmacy-kpi-card-top">
            <div className="pharmacy-kpi-icon" style={{ background: '#D1FAE5' }}>
              <CheckCircle2 size={20} color="#10B981" />
            </div>
            <span className="pharmacy-kpi-badge" style={{ background: '#F8FAFC', color: '#475569' }}>Units</span>
          </div>
          <div>
            <div className="pharmacy-kpi-label">Total Stock Units</div>
            <div className="pharmacy-kpi-value">{totalStockUnits.toLocaleString()}</div>
          </div>
          <div className="pharmacy-kpi-action" style={{ color: '#059669' }}>
            <span>Available</span>
            <ChevronRight size={12} />
          </div>
        </div>

        {/* 3. Low Stock Items */}
        <div
          className={`pharmacy-kpi-card ${activeTab === 'low-stock' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('low-stock')}
          title="View Medicines Below Reorder Level"
        >
          <div className="pharmacy-kpi-card-top">
            <div className="pharmacy-kpi-icon" style={{ background: '#FEF3C7' }}>
              <TrendingDown size={20} color="#D97706" />
            </div>
            <span className="pharmacy-kpi-badge" style={{ background: '#FEF3C7', color: '#B45309' }}>Reorder</span>
          </div>
          <div>
            <div className="pharmacy-kpi-label">Low Stock Items</div>
            <div className="pharmacy-kpi-value" style={{ color: '#D97706' }}>{lowStockItemsCount}</div>
          </div>
          <div className="pharmacy-kpi-action" style={{ color: '#B45309' }}>
            <span>Shortfall List</span>
            <ChevronRight size={12} />
          </div>
        </div>

        {/* 4. Critical Alerts */}
        <div
          className={`pharmacy-kpi-card ${activeTab === 'stock-alerts' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('stock-alerts')}
          title="View Live Alert Feeds"
        >
          <div className="pharmacy-kpi-card-top">
            <div className="pharmacy-kpi-icon" style={{ background: '#FEE2E2' }}>
              <AlertTriangle size={20} color="#DC2626" />
            </div>
            <span className="pharmacy-kpi-badge" style={{ background: '#FEE2E2', color: '#DC2626' }}>Urgent</span>
          </div>
          <div>
            <div className="pharmacy-kpi-label">Critical Alerts</div>
            <div className="pharmacy-kpi-value" style={{ color: '#DC2626' }}>{criticalAlertsCount}</div>
          </div>
          <div className="pharmacy-kpi-action" style={{ color: '#B91C1C' }}>
            <span>Action Required</span>
            <ChevronRight size={12} />
          </div>
        </div>

        {/* 5. Expiring Soon */}
        <div
          className={`pharmacy-kpi-card ${activeTab === 'expiry' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('expiry')}
          title="View Shelf-Life Expiry Tracking"
        >
          <div className="pharmacy-kpi-card-top">
            <div className="pharmacy-kpi-icon" style={{ background: '#FFEDD5' }}>
              <Clock size={20} color="#EA580C" />
            </div>
            <span className="pharmacy-kpi-badge" style={{ background: '#FFEDD5', color: '#EA580C' }}>&lt; 90d</span>
          </div>
          <div>
            <div className="pharmacy-kpi-label">Expiring Soon</div>
            <div className="pharmacy-kpi-value" style={{ color: '#EA580C' }}>{expiringSoonCount}</div>
          </div>
          <div className="pharmacy-kpi-action" style={{ color: '#C2410C' }}>
            <span>Shelf Life</span>
            <ChevronRight size={12} />
          </div>
        </div>

        {/* 6. Expired Medicines */}
        <div
          className="pharmacy-kpi-card"
          onClick={() => {
            setActiveTab('expiry');
            setExpiryCategoryFilter('Expired');
          }}
          title="View Expired Stock for Disposal"
        >
          <div className="pharmacy-kpi-card-top">
            <div className="pharmacy-kpi-icon" style={{ background: '#FEE2E2' }}>
              <ShieldAlert size={20} color="#991B1B" />
            </div>
            <span className="pharmacy-kpi-badge" style={{ background: '#FEE2E2', color: '#991B1B' }}>Hazard</span>
          </div>
          <div>
            <div className="pharmacy-kpi-label">Expired Medicines</div>
            <div className="pharmacy-kpi-value" style={{ color: '#991B1B' }}>{expiredMedicinesCount}</div>
          </div>
          <div className="pharmacy-kpi-action" style={{ color: '#991B1B' }}>
            <span>Quarantine</span>
            <ChevronRight size={12} />
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. FEATURE NAVIGATION BAR
      ───────────────────────────────────────────────────────────── */}
      <div className="pharmacy-nav-bar">
        <button
          className={`pharmacy-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Layers size={15} />
          <span>Overview</span>
        </button>

        <button
          className={`pharmacy-nav-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <PackageOpen size={15} />
          <span>Medication Inventory</span>
          <span className="pharmacy-nav-pill">{totalMedicines}</span>
        </button>

        <button
          className={`pharmacy-nav-btn ${activeTab === 'low-stock' ? 'active' : ''}`}
          onClick={() => setActiveTab('low-stock')}
        >
          <TrendingDown size={15} />
          <span>Low Stock</span>
          <span
            className="pharmacy-nav-pill"
            style={{
              background: activeTab === 'low-stock' ? '#FFFFFF' : '#FEF3C7',
              color: activeTab === 'low-stock' ? '#B45309' : '#92400E'
            }}
          >
            {lowStockItemsCount}
          </span>
        </button>

        <button
          className={`pharmacy-nav-btn ${activeTab === 'stock-alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('stock-alerts')}
        >
          <AlertTriangle size={15} />
          <span>Low Stock Alerts</span>
          <span
            className="pharmacy-nav-pill"
            style={{
              background: activeTab === 'stock-alerts' ? '#FFFFFF' : '#FEE2E2',
              color: activeTab === 'stock-alerts' ? '#DC2626' : '#991B1B'
            }}
          >
            {criticalAlertsCount}
          </span>
        </button>

        <button
          className={`pharmacy-nav-btn ${activeTab === 'expiry' ? 'active' : ''}`}
          onClick={() => setActiveTab('expiry')}
        >
          <Archive size={15} />
          <span>Expiry Tracking</span>
          <span
            className="pharmacy-nav-pill"
            style={{
              background: activeTab === 'expiry' ? '#FFFFFF' : '#FFEDD5',
              color: activeTab === 'expiry' ? '#EA580C' : '#9A3412'
            }}
          >
            {expiringSoonCount + expiredMedicinesCount}
          </span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 0: OVERVIEW (Requirement 5)
          Structure:
          Dashboard
          ├── Header
          ├── KPI Cards
          ├── Stock Overview
          │   ├── Stock Status Chart
          │   └── Inventory Summary
          ├── Alerts & Expiry
          │   ├── Low Stock Alerts
          │   └── Expiring Medicines
          └── Recent Inventory Activity & Patient ID Gateway
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* 1. STOCK OVERVIEW SECTION */}
          <div>
            <div className="pharmacy-section-header">
              <h2 className="pharmacy-section-title">
                <BarChart3 size={20} color="#0284C7" />
                <span>Stock Overview</span>
              </h2>
              <span style={{ fontSize: 13, color: '#64748B' }}>
                Dispensary Valuation: <strong style={{ color: '#0F172A' }}>₹{totalInventoryValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong>
              </span>
            </div>

            <div className="pharmacy-grid-2col">
              {/* Card A: Stock Status Chart */}
              <div className="pharmacy-card">
                <div className="pharmacy-card-header">
                  <div className="pharmacy-card-title">
                    <Activity size={16} color="#0EA5E9" />
                    <span>Stock Status Distribution</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>{totalMedicines} Catalogue Lines</span>
                </div>

                <div className="pharmacy-card-body">
                  <div className="pharmacy-chart-container">
                    {/* Visual Segmented Bar Chart */}
                    <div className="pharmacy-progress-bar-stack">
                      <div
                        style={{
                          width: `${(inStockCount / totalMedicines) * 100}%`,
                          background: '#10B981',
                          transition: 'width 0.4s'
                        }}
                        title={`In Stock: ${inStockCount}`}
                      />
                      <div
                        style={{
                          width: `${(lowStockCount / totalMedicines) * 100}%`,
                          background: '#F59E0B',
                          transition: 'width 0.4s'
                        }}
                        title={`Low Stock: ${lowStockCount}`}
                      />
                      <div
                        style={{
                          width: `${(outOfStockCount / totalMedicines) * 100}%`,
                          background: '#EF4444',
                          transition: 'width 0.4s'
                        }}
                        title={`Out of Stock: ${outOfStockCount}`}
                      />
                    </div>

                    {/* Chart Legends */}
                    <div className="pharmacy-legend-grid">
                      <div className="pharmacy-legend-item">
                        <div className="pharmacy-legend-header">
                          <span className="pharmacy-legend-dot" style={{ background: '#10B981' }} />
                          <span>In Stock</span>
                        </div>
                        <div className="pharmacy-legend-value" style={{ color: '#059669' }}>{inStockCount}</div>
                        <div className="pharmacy-legend-pct">{Math.round((inStockCount / totalMedicines) * 100)}% of stock</div>
                      </div>

                      <div className="pharmacy-legend-item">
                        <div className="pharmacy-legend-header">
                          <span className="pharmacy-legend-dot" style={{ background: '#F59E0B' }} />
                          <span>Low Stock</span>
                        </div>
                        <div className="pharmacy-legend-value" style={{ color: '#D97706' }}>{lowStockCount}</div>
                        <div className="pharmacy-legend-pct">{Math.round((lowStockCount / totalMedicines) * 100)}% below reorder</div>
                      </div>

                      <div className="pharmacy-legend-item">
                        <div className="pharmacy-legend-header">
                          <span className="pharmacy-legend-dot" style={{ background: '#EF4444' }} />
                          <span>Out of Stock</span>
                        </div>
                        <div className="pharmacy-legend-value" style={{ color: '#DC2626' }}>{outOfStockCount}</div>
                        <div className="pharmacy-legend-pct">{Math.round((outOfStockCount / totalMedicines) * 100)}% depleted</div>
                      </div>
                    </div>

                    <div style={{ fontSize: 12.5, color: '#64748B', lineHeight: 1.4, marginTop: 4 }}>
                      Dispensary stock availability rate is currently at <strong>{Math.round((inStockCount / totalMedicines) * 100)}%</strong>. Immediate purchase orders required for depleted lines.
                    </div>
                  </div>
                </div>

                <div className="pharmacy-card-footer">
                  <span style={{ color: '#64748B' }}>Audit baseline: Real-time</span>
                  <button
                    className="pharmacy-btn-action primary"
                    onClick={() => setActiveTab('inventory')}
                  >
                    <span>View All Inventory</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>

              {/* Card B: Inventory Summary by Therapeutic Category */}
              <div className="pharmacy-card">
                <div className="pharmacy-card-header">
                  <div className="pharmacy-card-title">
                    <PackageOpen size={16} color="#0EA5E9" />
                    <span>Inventory Summary by Category</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>{totalStockUnits} Total Units</span>
                </div>

                <div className="pharmacy-card-body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {categorySummary.slice(0, 5).map(cat => (
                      <div key={cat.name} className="pharmacy-category-row">
                        <div className="pharmacy-category-name" title={cat.name}>
                          {cat.name}
                        </div>
                        <div className="pharmacy-category-track">
                          <div
                            className="pharmacy-category-fill"
                            style={{
                              width: `${cat.pct}%`,
                              background:
                                cat.name === 'Cardiovascular' ? '#0EA5E9' :
                                cat.name === 'Vitamins' ? '#10B981' :
                                cat.name === 'Antibiotic' ? '#F59E0B' :
                                cat.name === 'Analgesic' ? '#6366F1' : '#8B5CF6'
                            }}
                          />
                        </div>
                        <div className="pharmacy-category-stats">
                          {cat.qty} <span style={{ fontSize: 11, color: '#94A3B8' }}>({cat.pct}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pharmacy-card-footer">
                  <span style={{ color: '#64748B' }}>{categorySummary.length} therapeutic classes</span>
                  <button
                    className="pharmacy-btn-action"
                    onClick={() => setActiveTab('inventory')}
                  >
                    <span>Filter by Category</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. ALERTS & EXPIRY SECTION */}
          <div>
            <div className="pharmacy-section-header">
              <h2 className="pharmacy-section-title">
                <AlertCircle size={20} color="#DC2626" />
                <span>Alerts & Expiry Spotlight</span>
              </h2>
              <span style={{ fontSize: 13, color: '#64748B' }}>
                Immediate clinical attention required for {criticalAlertsCount + expiredMedicinesCount} items
              </span>
            </div>

            <div className="pharmacy-grid-2col">
              {/* Card C: Low Stock Alerts */}
              <div className="pharmacy-card">
                <div className="pharmacy-card-header">
                  <div className="pharmacy-card-title">
                    <TrendingDown size={16} color="#D97706" />
                    <span>Urgent Low Stock Procurement</span>
                  </div>
                  <span className="badge badge-warning">{lowStockOnlyList.length} below reorder</span>
                </div>

                <div className="pharmacy-card-body" style={{ padding: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {lowStockOnlyList.slice(0, 3).map((item, idx) => (
                      <div
                        key={item.id}
                        style={{
                          padding: '14px 20px',
                          borderBottom: idx === 2 ? 'none' : '1px solid #F1F5F9',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 12
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13.5, color: '#0F172A' }}>{item.name}</div>
                          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2, display: 'flex', gap: 10 }}>
                            <span>Available: <strong style={{ color: item.availableQty === 0 ? '#DC2626' : '#D97706' }}>{item.availableQty}</strong> / {item.reorderLevel} units</span>
                            <span>· {item.supplier}</span>
                          </div>
                        </div>

                        <button
                          className="pharmacy-btn-action primary"
                          onClick={() => handleReorderItem(item.id, item.name, item.supplier)}
                        >
                          <ShoppingCart size={12} />
                          <span>Reorder</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pharmacy-card-footer">
                  <span style={{ color: '#64748B' }}>Need PO dispatch</span>
                  <button
                    className="pharmacy-btn-action warning"
                    onClick={() => setActiveTab('low-stock')}
                  >
                    <span>View Reorder List ({lowStockOnlyList.length})</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>

              {/* Card D: Expiring Medicines */}
              <div className="pharmacy-card">
                <div className="pharmacy-card-header">
                  <div className="pharmacy-card-title">
                    <Clock size={16} color="#EA580C" />
                    <span>Expiring & Overdue Medicines</span>
                  </div>
                  <span className="badge badge-danger">{expiringSoonCount + expiredMedicinesCount} flagged</span>
                </div>

                <div className="pharmacy-card-body" style={{ padding: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {expiryTrackingList
                      .filter(m => m.daysRemaining <= 90)
                      .slice(0, 3)
                      .map((item, idx) => {
                        const isExpired = item.daysRemaining <= 0;
                        return (
                          <div
                            key={item.id}
                            style={{
                              padding: '14px 20px',
                              borderBottom: idx === 2 ? 'none' : '1px solid #F1F5F9',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: 12,
                              background: isExpired ? '#FFF5F5' : undefined
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13.5, color: '#0F172A' }}>{item.name}</div>
                              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2, display: 'flex', gap: 10 }}>
                                <span>Batch: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{item.batch}</span></span>
                                <span style={{ fontWeight: 600, color: isExpired ? '#DC2626' : '#EA580C' }}>
                                  {isExpired ? 'EXPIRED' : `${item.daysRemaining} days left`}
                                </span>
                              </div>
                            </div>

                            {isExpired ? (
                              <button
                                className="pharmacy-btn-action danger"
                                onClick={() => handleRemoveExpired(item.id, item.name, item.batch)}
                              >
                                <span>Quarantine</span>
                              </button>
                            ) : (
                              <button
                                className="pharmacy-btn-action warning"
                                onClick={() => toast(`Fast-track dispensing scheduled for ${item.name}`, 'info')}
                              >
                                <span>Fast-Track</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div className="pharmacy-card-footer">
                  <span style={{ color: '#64748B' }}>Shelf-life surveillance active</span>
                  <button
                    className="pharmacy-btn-action"
                    onClick={() => setActiveTab('expiry')}
                  >
                    <span>Manage Expiry Tracking</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. PATIENT IDENTIFICATION & RECENT ACTIVITY SECTION */}
          <div className="pharmacy-grid-2col">
            {/* Card E: Patient Prescription Search Gateway */}
            <div className="pharmacy-card">
              <div className="pharmacy-card-header">
                <div className="pharmacy-card-title">
                  <Search size={16} color="#0EA5E9" />
                  <span>Outpatient Prescription Verification</span>
                </div>
                <span className="badge badge-info">Counter Gate</span>
              </div>
              <div className="pharmacy-card-body" style={{ padding: '16px 20px' }}>
                <PatientSearchGateway
                  title="Prescription & Allocation Verification"
                  subtitle="Search patient by OP ID (e.g. OP2026001) or ABHA ID (e.g. ABHA10001)"
                  actionLabel="Verify Stock Allocation"
                  selectedPatient={activePatient}
                  onPatientSelect={(patient) => {
                    setActivePatient(patient);
                    toast(`Patient ${patient.name} (${patient.opId}) identified at pharmacy`, 'success');
                  }}
                  onAction={(patient) => {
                    setActivePatient(patient);
                  }}
                  onClear={() => {
                    setActivePatient(null);
                  }}
                />
              </div>
            </div>

            {/* Card F: Recent Inventory Activity */}
            <div className="pharmacy-card">
              <div className="pharmacy-card-header">
                <div className="pharmacy-card-title">
                  <Clock size={16} color="#0EA5E9" />
                  <span>Recent Inventory Activity & Audit Trail</span>
                </div>
                <span style={{ fontSize: 12, color: '#64748B' }}>Live Event Log</span>
              </div>

              <div className="pharmacy-card-body">
                <div className="pharmacy-activity-list">
                  {RECENT_ACTIVITIES.map(act => {
                    const IconComponent = act.icon;
                    return (
                      <div key={act.id} className="pharmacy-activity-item">
                        <div className="pharmacy-activity-left">
                          <div className="pharmacy-activity-icon" style={{ background: act.bg }}>
                            <IconComponent size={16} color={act.color} />
                          </div>
                          <div>
                            <div className="pharmacy-activity-title">{act.title}</div>
                            <div className="pharmacy-activity-sub">{act.desc}</div>
                          </div>
                        </div>
                        <div className="pharmacy-activity-time">{act.time}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pharmacy-card-footer">
                <span style={{ color: '#64748B' }}>All actions audited</span>
                <span style={{ fontSize: 12, color: '#0EA5E9', fontWeight: 600 }}>System Protected</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          FEATURE 1: MEDICATION INVENTORY (Full Stock Management)
          Fields: Medicine Name, Medicine ID, Category, Batch Number,
                  Available Quantity, Reorder Level, Unit Price, Supplier,
                  Expiry Date, Stock Status
          Actions: Search, Filter Category, Filter Stock, Add, Edit, Delete, View Details
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'inventory' && (
        <div className="pharmacy-table-card">
          <div className="pharmacy-table-toolbar">
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                <PackageOpen size={18} color="#0284C7" />
                <span>Medication Inventory (Complete Stock Management)</span>
                <span className="badge badge-primary">{filteredInventory.length} Items</span>
              </div>
              <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 2 }}>
                Complete pharmacy dispensary stock catalogue with unit prices, batch identifiers, and stock controls
              </div>
            </div>

            <div className="pharmacy-table-controls">
              <div className="search-bar" style={{ minWidth: 230, height: 38 }}>
                <Search size={15} color="var(--text-muted)" />
                <input
                  placeholder="Search name, ID, batch, supplier..."
                  value={invSearch}
                  onChange={e => setInvSearch(e.target.value)}
                />
              </div>

              <select
                className="form-select"
                style={{ width: 150, height: 38, fontSize: 12.5, padding: '0 12px' }}
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                {categoriesList.map(c => (
                  <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
                ))}
              </select>

              <select
                className="form-select"
                style={{ width: 140, height: 38, fontSize: 12.5, padding: '0 12px' }}
                value={stockStatusFilter}
                onChange={e => setStockStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>

              <button
                className="pharmacy-btn-primary"
                onClick={() => setShowAddMedModal(true)}
              >
                <Plus size={15} />
                <span>Add Medicine</span>
              </button>
            </div>
          </div>

          <div className="pharmacy-table-scroll">
            <table className="pharmacy-table">
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Medicine ID</th>
                  <th>Category</th>
                  <th>Batch #</th>
                  <th style={{ textAlign: 'right' }}>Available Qty</th>
                  <th style={{ textAlign: 'right' }}>Reorder Level</th>
                  <th style={{ textAlign: 'right' }}>Unit Price</th>
                  <th>Supplier</th>
                  <th>Expiry Date</th>
                  <th>Stock Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ textAlign: 'center', padding: 40, color: '#64748B' }}>
                      No medicines match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map(med => (
                    <tr key={med.id}>
                      <td style={{ fontWeight: 600, color: '#0F172A' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Pill size={15} color="#0EA5E9" />
                          <span>{med.name}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: 11.5, padding: '2px 7px', background: '#F1F5F9', borderRadius: 4, color: '#475569', fontWeight: 600 }}>
                          {med.id}
                        </span>
                      </td>
                      <td><span className="tag">{med.category}</span></td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{med.batch}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: med.availableQty === 0 ? '#DC2626' : med.availableQty <= med.reorderLevel ? '#D97706' : '#0F172A' }}>
                        {med.availableQty}
                      </td>
                      <td style={{ textAlign: 'right', color: '#64748B', fontVariantNumeric: 'tabular-nums' }}>
                        {med.reorderLevel}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: '#334155', fontVariantNumeric: 'tabular-nums' }}>
                        ₹{med.unitPrice.toFixed(2)}
                      </td>
                      <td style={{ fontSize: 12.5, color: '#475569', maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {med.supplier}
                      </td>
                      <td style={{ fontSize: 12, color: '#334155' }}>{med.expiryDate}</td>
                      <td>
                        <span className={`badge ${
                          med.stockStatus === 'In Stock' ? 'badge-success' :
                          med.stockStatus === 'Low Stock' ? 'badge-warning' : 'badge-danger'
                        }`}>
                          {med.stockStatus}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button
                            className="pharmacy-btn-action"
                            onClick={() => {
                              setSelectedMed(med);
                              setShowDetailsModal(true);
                            }}
                            title="View Details"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            className="pharmacy-btn-action"
                            onClick={() => {
                              setSelectedMed({ ...med });
                              setShowEditMedModal(true);
                            }}
                            title="Edit Medicine"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            className="pharmacy-btn-action danger"
                            onClick={() => handleDeleteMedicine(med.id, med.name)}
                            title="Delete Medicine"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          FEATURE 2: LOW STOCK (ONLY MEDICINES BELOW REORDER LEVEL)
          Columns: Medicine Name, Current Quantity, Reorder Level,
                   Quantity Needed, Supplier, Last Updated, Reorder Button
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'low-stock' && (
        <div>
          {/* Procurement Shortfall Notice Banner */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 12,
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              marginBottom: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#92400E', display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingDown size={18} color="#D97706" />
                <span>Procurement Shortfall: {lowStockOnlyList.length} Medicines Below Safety Threshold</span>
              </div>
              <div style={{ fontSize: 12.5, color: '#B45309', marginTop: 3 }}>
                This table exclusively shows inventory lines whose available quantity has breached safety reorder thresholds.
              </div>
            </div>
            <button
              className="pharmacy-btn-primary"
              style={{ background: '#D97706' }}
              onClick={() => {
                lowStockOnlyList.forEach(m => handleReorderItem(m.id, m.name, m.supplier));
                toast('Bulk purchase orders placed for all low stock items', 'success');
              }}
            >
              <ShoppingCart size={15} />
              <span>Reorder All ({lowStockOnlyList.length})</span>
            </button>
          </div>

          <div className="pharmacy-table-card">
            <div className="pharmacy-table-scroll">
              <table className="pharmacy-table">
                <thead>
                  <tr>
                    <th>Medicine Name</th>
                    <th style={{ textAlign: 'right' }}>Current Quantity</th>
                    <th style={{ textAlign: 'right' }}>Reorder Level</th>
                    <th style={{ textAlign: 'right' }}>Quantity Needed</th>
                    <th>Supplier</th>
                    <th>Last Updated</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockOnlyList.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: 48, color: '#16A34A', fontWeight: 600 }}>
                        <CheckCircle2 size={28} style={{ display: 'block', margin: '0 auto 10px', color: '#16A34A' }} />
                        All pharmacy medicines are adequately stocked above their safety reorder thresholds!
                      </td>
                    </tr>
                  ) : (
                    lowStockOnlyList.map(item => {
                      const qtyNeeded = Math.max(item.reorderLevel - item.availableQty + 50, 50);
                      return (
                        <tr key={item.id}>
                          <td style={{ fontWeight: 700, color: '#0F172A' }}>
                            <div>{item.name}</div>
                            <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#64748B' }}>{item.id}</span>
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 800, fontSize: 14, color: item.availableQty === 0 ? '#DC2626' : '#D97706', fontVariantNumeric: 'tabular-nums' }}>
                            {item.availableQty}
                          </td>
                          <td style={{ textAlign: 'right', color: '#64748B', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                            {item.reorderLevel}
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 800, color: '#0284C7', fontVariantNumeric: 'tabular-nums' }}>
                            +{qtyNeeded} units
                          </td>
                          <td style={{ color: '#475569', fontSize: 13 }}>
                            {item.supplier}
                          </td>
                          <td style={{ fontSize: 12, color: '#64748B' }}>
                            {item.lastUpdated}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="pharmacy-btn-action primary"
                              onClick={() => handleReorderItem(item.id, item.name, item.supplier)}
                            >
                              <ShoppingCart size={13} />
                              <span>Reorder</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          FEATURE 3: LOW STOCK ALERTS (ALERT / NOTIFICATION FEED)
          NOT an inventory table! Shows alert feeds with urgency tags
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'stock-alerts' && (
        <div>
          {/* Summary Cards */}
          <div className="stats-grid" style={{ marginBottom: 20, gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="stat-card" style={{ borderLeft: '4px solid #DC2626' }}>
              <div className="stat-icon" style={{ background: '#FEE2E2' }}><AlertCircle size={20} color="#DC2626" /></div>
              <div className="stat-label">Critical Stock Alerts</div>
              <div className="stat-value" style={{ color: '#DC2626' }}>
                {alerts.filter(a => a.severity === 'Critical Stock' && !a.resolved).length}
              </div>
            </div>
            <div className="stat-card" style={{ borderLeft: '4px solid #D97706' }}>
              <div className="stat-icon" style={{ background: '#FEF3C7' }}><AlertTriangle size={20} color="#D97706" /></div>
              <div className="stat-label">Low Stock Alerts</div>
              <div className="stat-value" style={{ color: '#D97706' }}>
                {alerts.filter(a => a.severity === 'Low Stock' && !a.resolved).length}
              </div>
            </div>
            <div className="stat-card" style={{ borderLeft: '4px solid #16A34A' }}>
              <div className="stat-icon" style={{ background: '#DCFCE7' }}><CheckCircle2 size={20} color="#16A34A" /></div>
              <div className="stat-label">Resolved Alerts</div>
              <div className="stat-value" style={{ color: '#16A34A' }}>
                {alerts.filter(a => a.resolved).length}
              </div>
            </div>
          </div>

          {/* Filter Bar for Alerts */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1E293B' }}>
              Live Clinical Supply Alerts & Incident Feed
            </div>
            <div className="filter-tabs">
              {['All', 'Critical', 'Low Stock', 'Resolved'].map(f => (
                <button
                  key={f}
                  className={`filter-tab ${alertFilter === f ? 'active' : ''}`}
                  onClick={() => setAlertFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Alert Notification Cards List (NOT a table!) */}
          <div className="pharmacy-alert-feed">
            {filteredAlerts.length === 0 ? (
              <div className="pharmacy-card" style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>
                No supply notifications matching this filter.
              </div>
            ) : (
              filteredAlerts.map(alert => {
                const isCritical = alert.severity === 'Critical Stock';
                return (
                  <div
                    key={alert.id}
                    className={`pharmacy-alert-card ${alert.resolved ? 'resolved' : isCritical ? 'critical' : 'warning'}`}
                  >
                    <div className="pharmacy-alert-left">
                      <div
                        className="pharmacy-alert-icon-wrap"
                        style={{
                          background: alert.resolved ? '#E2E8F0' : isCritical ? '#FEE2E2' : '#FEF3C7'
                        }}
                      >
                        {alert.resolved ? (
                          <CheckCircle2 size={20} color="#64748B" />
                        ) : isCritical ? (
                          <ShieldAlert size={20} color="#DC2626" />
                        ) : (
                          <AlertTriangle size={20} color="#D97706" />
                        )}
                      </div>

                      <div className="pharmacy-alert-body">
                        <div className="pharmacy-alert-meta">
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              padding: '2px 8px',
                              borderRadius: 4,
                              background: alert.resolved ? '#E2E8F0' : isCritical ? '#DC2626' : '#D97706',
                              color: alert.resolved ? '#475569' : 'white'
                            }}
                          >
                            {alert.resolved ? 'Resolved' : alert.severity === 'Critical Stock' ? '🔴 Critical Stock' : '🟠 Low Stock'}
                          </span>
                          <span style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>
                            {alert.medicine}
                          </span>
                          <span style={{ fontSize: 12, color: '#64748B' }}>· {alert.time}</span>
                        </div>

                        <div className="pharmacy-alert-desc">
                          {alert.message}
                        </div>

                        <div className="pharmacy-alert-footer-stats">
                          <div><strong>Current Quantity:</strong> <span style={{ color: isCritical ? '#DC2626' : '#D97706', fontWeight: 800 }}>{alert.currentQty} units</span></div>
                          <div><strong>Reorder Level:</strong> {alert.reorderLevel} units</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                      {!alert.resolved && (
                        <>
                          <button
                            className="pharmacy-btn-action"
                            onClick={() => handleMarkAlertResolved(alert.id)}
                          >
                            <Check size={13} />
                            <span>Mark Resolved</span>
                          </button>
                          <button
                            className="pharmacy-btn-action primary"
                            onClick={() => {
                              handleReorderItem(alert.id, alert.medicine, 'Approved Supplier');
                              handleMarkAlertResolved(alert.id);
                            }}
                          >
                            <ShoppingCart size={13} />
                            <span>Reorder Now</span>
                          </button>
                        </>
                      )}
                      {alert.resolved && (
                        <span className="badge badge-success">Resolution Confirmed</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          FEATURE 4: EXPIRY TRACKING (EXPIRATION MANAGEMENT ONLY)
          Shows: Medicine Name, Batch Number, Quantity, Expiry Date,
                 Days Remaining, Supplier, Expiry Category, Actions
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'expiry' && (
        <div>
          {/* Expiry Risk Distribution / Shelf-Life Timeline Bar */}
          <div className="pharmacy-timeline-bar-wrapper">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>
                Shelf-Life Risk Distribution Timeline
              </div>
              <span style={{ fontSize: 12.5, color: '#64748B' }}>Reference Date: September 07, 2026</span>
            </div>

            {/* Visual Timeline Bar */}
            <div className="pharmacy-timeline-bar">
              <div style={{ flex: expiredMedicinesCount || 0.5, background: '#DC2626' }} title="Expired" />
              <div style={{ flex: medicines.filter(m => getExpiryCategory(getDaysRemaining(m.expiryDate)) === 'Expiring Within 30 Days').length || 0.5, background: '#EA580C' }} title="Within 30 Days" />
              <div style={{ flex: medicines.filter(m => getExpiryCategory(getDaysRemaining(m.expiryDate)) === 'Expiring Within 90 Days').length || 0.5, background: '#EAB308' }} title="Within 90 Days" />
              <div style={{ flex: medicines.filter(m => getExpiryCategory(getDaysRemaining(m.expiryDate)) === 'Valid').length || 1, background: '#16A34A' }} title="Valid" />
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                className={`btn btn-xs ${expiryCategoryFilter === 'All' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setExpiryCategoryFilter('All')}
              >
                All Batches ({expiryTrackingList.length})
              </button>
              <button
                className={`btn btn-xs ${expiryCategoryFilter === 'Expired' ? 'btn-danger' : 'btn-ghost'}`}
                onClick={() => setExpiryCategoryFilter('Expired')}
              >
                🔴 Expired ({expiredMedicinesCount})
              </button>
              <button
                className={`btn btn-xs ${expiryCategoryFilter === 'Expiring Within 30 Days' ? 'btn-warning' : 'btn-ghost'}`}
                onClick={() => setExpiryCategoryFilter('Expiring Within 30 Days')}
              >
                🟠 Expiring Within 30 Days ({medicines.filter(m => getExpiryCategory(getDaysRemaining(m.expiryDate)) === 'Expiring Within 30 Days').length})
              </button>
              <button
                className={`btn btn-xs ${expiryCategoryFilter === 'Expiring Within 90 Days' ? 'btn-secondary' : 'btn-ghost'}`}
                onClick={() => setExpiryCategoryFilter('Expiring Within 90 Days')}
              >
                🟡 Expiring Within 90 Days ({medicines.filter(m => getExpiryCategory(getDaysRemaining(m.expiryDate)) === 'Expiring Within 90 Days').length})
              </button>
              <button
                className={`btn btn-xs ${expiryCategoryFilter === 'Valid' ? 'btn-success' : 'btn-ghost'}`}
                onClick={() => setExpiryCategoryFilter('Valid')}
              >
                🟢 Valid ({medicines.filter(m => getExpiryCategory(getDaysRemaining(m.expiryDate)) === 'Valid').length})
              </button>
            </div>
          </div>

          {/* Expiry Tracking Table */}
          <div className="pharmacy-table-card">
            <div className="pharmacy-table-scroll">
              <table className="pharmacy-table">
                <thead>
                  <tr>
                    <th>Medicine Name</th>
                    <th>Batch Number</th>
                    <th style={{ textAlign: 'right' }}>Quantity</th>
                    <th>Expiry Date</th>
                    <th style={{ textAlign: 'right' }}>Days Remaining</th>
                    <th>Supplier</th>
                    <th>Expiry Category</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpiryList.map(item => {
                    const isExp = item.daysRemaining <= 0;
                    return (
                      <tr key={item.id} style={{ background: isExp ? '#FEF2F2' : undefined }}>
                        <td style={{ fontWeight: 600, color: '#0F172A' }}>
                          <div>{item.name}</div>
                          <span style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>{item.id}</span>
                        </td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{item.batch}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                          {item.availableQty}
                        </td>
                        <td style={{ fontWeight: 600, color: isExp ? '#DC2626' : '#0F172A' }}>{item.expiryDate}</td>
                        <td style={{ textAlign: 'right', fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: isExp ? '#DC2626' : item.daysRemaining <= 30 ? '#EA580C' : item.daysRemaining <= 90 ? '#CA8A04' : '#16A34A' }}>
                          {isExp ? `${Math.abs(item.daysRemaining)}d OVERDUE` : `${item.daysRemaining} days`}
                        </td>
                        <td style={{ fontSize: 12.5, color: '#475569' }}>{item.supplier}</td>
                        <td>
                          <span className={`badge ${
                            item.expiryCategory === 'Expired' ? 'badge-danger' :
                            item.expiryCategory === 'Expiring Within 30 Days' ? 'badge-warning' :
                            item.expiryCategory === 'Expiring Within 90 Days' ? 'badge-info' : 'badge-success'
                          }`}>
                            {item.expiryCategory === 'Expired' ? '🔴 Expired' :
                             item.expiryCategory === 'Expiring Within 30 Days' ? '🟠 < 30 Days' :
                             item.expiryCategory === 'Expiring Within 90 Days' ? '🟡 < 90 Days' : '🟢 Valid'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: 6 }}>
                            {isExp ? (
                              <>
                                <button
                                  className="pharmacy-btn-action danger"
                                  onClick={() => handleRemoveExpired(item.id, item.name, item.batch)}
                                  title="Remove from shelves immediately"
                                >
                                  Quarantine
                                </button>
                                <button
                                  className="pharmacy-btn-action"
                                  onClick={() => handleMarkForDisposal(item.batch, item.name)}
                                >
                                  Disposal
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="pharmacy-btn-action"
                                  onClick={() => {
                                    setSelectedMed(item);
                                    setShowDetailsModal(true);
                                  }}
                                >
                                  View Batch
                                </button>
                                {item.daysRemaining <= 30 && (
                                  <button
                                    className="pharmacy-btn-action warning"
                                    onClick={() => toast(`Fast-track dispensing order logged for ${item.name}`, 'info')}
                                  >
                                    Fast-Track
                                  </button>
                                )}
                              </>
                            )}
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
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: ADD MEDICINE (All 10 fields)
      ───────────────────────────────────────────────────────────── */}
      {showAddMedModal && (
        <div className="modal-overlay" onClick={() => setShowAddMedModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Add New Medicine to Inventory</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAddMedModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveNewMedicine}>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12 }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Medicine Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        placeholder="e.g. Paracetamol 500 mg"
                        value={newMedForm.name}
                        onChange={e => setNewMedForm({ ...newMedForm, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Category *</label>
                      <select
                        className="form-select"
                        value={newMedForm.category}
                        onChange={e => setNewMedForm({ ...newMedForm, category: e.target.value })}
                      >
                        <option>Analgesic</option>
                        <option>Antibiotic</option>
                        <option>Antidiabetic</option>
                        <option>Cardiovascular</option>
                        <option>Gastrointestinal</option>
                        <option>Vitamins</option>
                        <option>Diuretic</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Batch Number *</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        placeholder="e.g. PCM-2510"
                        value={newMedForm.batch}
                        onChange={e => setNewMedForm({ ...newMedForm, batch: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Medicine ID (Optional)</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Auto-generated if blank"
                        value={newMedForm.id}
                        onChange={e => setNewMedForm({ ...newMedForm, id: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Available Qty *</label>
                      <input
                        type="number"
                        className="form-input"
                        required
                        value={newMedForm.availableQty}
                        onChange={e => setNewMedForm({ ...newMedForm, availableQty: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Reorder Level *</label>
                      <input
                        type="number"
                        className="form-input"
                        required
                        value={newMedForm.reorderLevel}
                        onChange={e => setNewMedForm({ ...newMedForm, reorderLevel: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Unit Price (₹) *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-input"
                        required
                        value={newMedForm.unitPrice}
                        onChange={e => setNewMedForm({ ...newMedForm, unitPrice: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Supplier *</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        placeholder="e.g. Apex Healthcare Labs"
                        value={newMedForm.supplier}
                        onChange={e => setNewMedForm({ ...newMedForm, supplier: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Expiry Date *</label>
                      <input
                        type="date"
                        className="form-input"
                        required
                        value={newMedForm.expiryDate}
                        onChange={e => setNewMedForm({ ...newMedForm, expiryDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="pharmacy-btn-secondary" onClick={() => setShowAddMedModal(false)}>Cancel</button>
                <button type="submit" className="pharmacy-btn-primary">Save to Inventory</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: EDIT MEDICINE
      ───────────────────────────────────────────────────────────── */}
      {showEditMedModal && selectedMed && (
        <div className="modal-overlay" onClick={() => setShowEditMedModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Edit Medicine — {selectedMed.name}</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowEditMedModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveEditMedicine}>
              <div className="modal-body">
                <div style={{ display: 'grid', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Available Quantity *</label>
                      <input
                        type="number"
                        className="form-input"
                        required
                        value={selectedMed.availableQty}
                        onChange={e => setSelectedMed({ ...selectedMed, availableQty: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Reorder Level *</label>
                      <input
                        type="number"
                        className="form-input"
                        required
                        value={selectedMed.reorderLevel}
                        onChange={e => setSelectedMed({ ...selectedMed, reorderLevel: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Unit Price (₹) *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-input"
                        required
                        value={selectedMed.unitPrice}
                        onChange={e => setSelectedMed({ ...selectedMed, unitPrice: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Batch Number *</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        value={selectedMed.batch}
                        onChange={e => setSelectedMed({ ...selectedMed, batch: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Supplier</label>
                      <input
                        type="text"
                        className="form-input"
                        value={selectedMed.supplier}
                        onChange={e => setSelectedMed({ ...selectedMed, supplier: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Expiry Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={selectedMed.expiryDate}
                        onChange={e => setSelectedMed({ ...selectedMed, expiryDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="pharmacy-btn-secondary" onClick={() => setShowEditMedModal(false)}>Cancel</button>
                <button type="submit" className="pharmacy-btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: VIEW DETAILS
      ───────────────────────────────────────────────────────────── */}
      {showDetailsModal && selectedMed && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Medicine Specifications</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowDetailsModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gap: 10, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Medicine Name:</span>
                  <strong style={{ color: '#0F172A' }}>{selectedMed.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Medicine ID:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{selectedMed.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Therapeutic Category:</span>
                  <span className="tag">{selectedMed.category}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Batch Number:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{selectedMed.batch}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Available Stock:</span>
                  <strong style={{ color: selectedMed.availableQty <= selectedMed.reorderLevel ? '#D97706' : '#16A34A' }}>
                    {selectedMed.availableQty} units
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Reorder Level:</span>
                  <span>{selectedMed.reorderLevel} units</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Unit Dispensing Price:</span>
                  <strong>₹{selectedMed.unitPrice?.toFixed(2)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Authorized Supplier:</span>
                  <span>{selectedMed.supplier}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Expiry Date:</span>
                  <span>{selectedMed.expiryDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B' }}>Stock Status:</span>
                  <span className={`badge ${
                    selectedMed.stockStatus === 'In Stock' ? 'badge-success' :
                    selectedMed.stockStatus === 'Low Stock' ? 'badge-warning' : 'badge-danger'
                  }`}>
                    {selectedMed.stockStatus}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="pharmacy-btn-secondary" onClick={() => setShowDetailsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
