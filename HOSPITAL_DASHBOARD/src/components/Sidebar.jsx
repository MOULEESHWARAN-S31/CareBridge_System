import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Stethoscope, Calendar, ClipboardList, Video,
  Activity, ArrowLeftRight, FlaskConical, Pill, PackageOpen, FileText,
  Bed, AlertTriangle, Truck, Building2, BarChart3, Bell, UserCog, User,
  Settings, LogOut, ChevronLeft, ChevronRight, Heart, TestTube,
  DollarSign, Archive, Siren, UserCheck, Clipboard, ShieldCheck,
  RefreshCw, Clock, CheckCircle2, Hospital, Search, TrendingDown,
  Layers, Shield, FolderArchive
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ROLE_ROUTES } from '../auth/accounts';

function getNavSections(roleId) {
  const base = ROLE_ROUTES[roleId] || '/admin/dashboard';

  const configs = {
    // 1. Hospital Administrator
    admin: [
      {
        label: 'Main Command',
        items: [
          { path: base, label: 'Overview', icon: LayoutDashboard, end: true },
        ]
      },
      {
        label: 'Patient Care & OPD',
        items: [
          { path: `${base}/patients`, label: 'All Patients', icon: Users },
          { path: `${base}/appointments`, label: 'Appointments', icon: Calendar },
          { path: `${base}/opd`, label: 'OPD Queue', icon: ClipboardList },
        ]
      },
      {
        label: 'Clinical & Emergency',
        items: [
          { path: `${base}/doctors`, label: 'Doctors Directory', icon: Stethoscope },
          { path: `${base}/departments`, label: 'Departments', icon: Building2 },
          { path: `${base}/emergency`, label: 'Emergency Care', icon: Siren, danger: true },
          { path: `${base}/lab`, label: 'Diagnostics & Lab', icon: FlaskConical },
          { path: `${base}/telemedicine`, label: 'Telemedicine', icon: Video },
        ]
      },
      {
        label: 'Hospital Operations',
        items: [
          { path: `${base}/wards`, label: 'Beds & Ward Map', icon: Bed },
          { path: `${base}/ambulance`, label: 'Ambulances Fleet', icon: Truck },
          { path: `${base}/staff`, label: 'Staff Directory', icon: UserCog },
          { path: `${base}/shifts`, label: 'Shift Roster', icon: Clock },
        ]
      },
      {
        label: 'Pharmacy & Supplies',
        items: [
          { path: `${base}/pharmacy`, label: 'Medicine Inventory', icon: PackageOpen },
          { path: `${base}/prescriptions`, label: 'Prescriptions', icon: FileText },
          { path: `${base}/referrals`, label: 'Patient Referrals', icon: ArrowLeftRight },
        ]
      },
      {
        label: 'Intelligence & Reports',
        items: [
          { path: `${base}/analytics`, label: 'Hospital Analytics', icon: BarChart3 },
          { path: `${base}/reports`, label: 'Generate Reports', icon: FileText },
        ]
      },
      {
        label: 'System & Security',
        items: [
          { path: `${base}/notifications`, label: 'Alerts & Notices', icon: Bell },
          { path: `${base}/sync`, label: 'Data Sync (Offline)', icon: RefreshCw },
          { path: `${base}/audit`, label: 'Audit Logs', icon: Archive },
          { path: `${base}/settings`, label: 'Settings', icon: Settings },
        ]
      }
    ],

    // 2. Doctor
    doctor: [
      {
        label: 'Clinical Command',
        items: [
          { path: base, label: 'Doctor Overview', icon: LayoutDashboard, end: true },
          { path: `${base}/search`, label: 'Patient Search (OP/ABHA)', icon: Search },
          { path: `${base}/patients`, label: 'My Patients', icon: Users },
          { path: `${base}/appointments`, label: 'Appointments Roster', icon: Calendar },
        ]
      },
      {
        label: 'Consultation & Rx',
        items: [
          { path: `${base}/consultations`, label: 'Clinical Consultations', icon: Stethoscope },
          { path: `${base}/telemedicine`, label: 'Telemedicine OPD', icon: Video },
          { path: `${base}/medicines`, label: 'Prescriptions & Rx', icon: Pill },
        ]
      },
      {
        label: 'Investigations & Records',
        items: [
          { path: `${base}/lab-orders`, label: 'Lab Orders & Results', icon: FlaskConical },
          { path: `${base}/referrals`, label: 'Patient Referrals', icon: ArrowLeftRight },
          { path: `${base}/records`, label: 'Medical Records', icon: FileText },
        ]
      },
      {
        label: 'Account & Settings',
        items: [
          { path: `${base}/notifications`, label: 'Alerts & Notices', icon: Bell },
          { path: `${base}/profile`, label: 'Doctor Profile', icon: User },
          { path: `${base}/settings`, label: 'Settings', icon: Settings },
        ]
      }
    ],

    // 3. Nurse
    nurse: [
      {
        label: 'Nursing Station',
        items: [
          { path: base, label: 'Station Overview', icon: LayoutDashboard, end: true },
          { path: `${base}/patients`, label: 'All Patients', icon: Users },
          { path: `${base}/ward`, label: 'Ward & Bed Allocation', icon: Bed },
        ]
      },
      {
        label: 'Inpatient Care',
        items: [
          { path: `${base}/medications`, label: 'Medication Schedule', icon: Pill },
          { path: `${base}/orders`, label: 'Doctor Orders', icon: Clipboard },
          { path: `${base}/procedures`, label: 'Nursing Tasks & Vitals', icon: ClipboardList },
          { path: `${base}/notes`, label: 'Nursing Notes', icon: FileText },
          { path: `${base}/emergency`, label: 'Emergency & Triage', icon: Siren, danger: true },
        ]
      },
      {
        label: 'Account & Settings',
        items: [
          { path: `${base}/notifications`, label: 'Shift Alerts', icon: Bell },
          { path: `${base}/profile`, label: 'Nurse Profile', icon: User },
          { path: `${base}/settings`, label: 'Settings', icon: Settings },
        ]
      }
    ],

    // 4. Pharmacist
    pharmacy: [
      {
        label: 'Dispensary Command',
        items: [
          { path: base, label: 'Dispensary Overview', icon: LayoutDashboard, end: true },
        ]
      },
      {
        label: 'Inventory & Stock Control',
        items: [
          { path: `${base}/inventory`, label: 'Medication Inventory', icon: PackageOpen },
          { path: `${base}/low-stock`, label: 'Low Stock Reorder', icon: TrendingDown },
          { path: `${base}/stock-alerts`, label: 'Low Stock Alerts', icon: AlertTriangle, danger: true },
          { path: `${base}/expiry`, label: 'Expiry Tracking', icon: Archive },
        ]
      },
      {
        label: 'Account & Settings',
        items: [
          { path: `${base}/notifications`, label: 'Dispense Alerts', icon: Bell },
          { path: `${base}/profile`, label: 'Pharmacist Profile', icon: User },
          { path: `${base}/settings`, label: 'Settings', icon: Settings },
        ]
      }
    ],

    // 5. Laboratory Staff
    lab: [
      {
        label: 'Diagnostic Command',
        items: [
          { path: base, label: 'Laboratory Overview', icon: LayoutDashboard, end: true },
        ]
      },
      {
        label: 'Specimens & Diagnostics',
        items: [
          { path: `${base}/orders`, label: 'Test Requests', icon: FlaskConical },
          { path: `${base}/samples`, label: 'Sample Phlebotomy', icon: TestTube },
          { path: `${base}/in-progress`, label: 'Tests in Progress', icon: Activity },
          { path: `${base}/results`, label: 'Results Verification', icon: FileText },
          { path: `${base}/critical`, label: 'Critical Callouts', icon: AlertTriangle, danger: true },
        ]
      },
      {
        label: 'Supplies & Account',
        items: [
          { path: `${base}/inventory`, label: 'Reagent Inventory', icon: Archive },
          { path: `${base}/notifications`, label: 'Lab Notifications', icon: Bell },
          { path: `${base}/profile`, label: 'Staff Profile', icon: User },
          { path: `${base}/settings`, label: 'Settings', icon: Settings },
        ]
      }
    ],

    // 6. Receptionist
    receptionist: [
      {
        label: 'Front Desk Menu',
        items: [
          { path: base, label: 'Dashboard', icon: LayoutDashboard, end: true },
          { path: `${base}/add-patient`, label: 'Add Patient', icon: UserCheck },
          { path: `${base}/patients`, label: 'Patients', icon: Users },
          { path: `${base}/op-card`, label: 'OP Card', icon: FileText },
          { path: `${base}/appointments`, label: 'Appointments', icon: Calendar },
        ]
      }
    ],
    reception: [
      {
        label: 'Front Desk Menu',
        items: [
          { path: base, label: 'Dashboard', icon: LayoutDashboard, end: true },
          { path: `${base}/add-patient`, label: 'Add Patient', icon: UserCheck },
          { path: `${base}/patients`, label: 'Patients', icon: Users },
          { path: `${base}/op-card`, label: 'OP Card', icon: FileText },
          { path: `${base}/appointments`, label: 'Appointments', icon: Calendar },
        ]
      }
    ],

    // 7. Billing Staff
    billing: [
      {
        label: 'Billing & Cashier',
        items: [
          { path: base, label: 'Accounts Overview', icon: LayoutDashboard, end: true },
          { path: `${base}/bills`, label: 'Patient Invoices', icon: DollarSign },
          { path: `${base}/payments`, label: 'Payment Receipts', icon: CheckCircle2 },
          { path: `${base}/pending`, label: 'Pending Dues', icon: Clock },
        ]
      },
      {
        label: 'Insurance & Claims',
        items: [
          { path: `${base}/insurance`, label: 'Insurance & TPA Claims', icon: ShieldCheck },
          { path: `${base}/refunds`, label: 'Refund Processing', icon: RefreshCw },
          { path: `${base}/reports`, label: 'Financial Reports', icon: BarChart3 },
        ]
      },
      {
        label: 'Account & Settings',
        items: [
          { path: `${base}/notifications`, label: 'Billing Alerts', icon: Bell },
          { path: `${base}/profile`, label: 'Staff Profile', icon: User },
          { path: `${base}/settings`, label: 'Settings', icon: Settings },
        ]
      }
    ],

    // 8. Medical Records Staff
    records: [
      {
        label: 'Medical Records Command',
        items: [
          { path: base, label: 'Records Overview', icon: LayoutDashboard, end: true },
          { path: `${base}/patients`, label: 'Master Patient Index', icon: Users },
          { path: `${base}/history`, label: 'Case History Archives', icon: Archive },
        ]
      },
      {
        label: 'Documents & Requests',
        items: [
          { path: `${base}/documents`, label: 'Document Archives', icon: FileText },
          { path: `${base}/requests`, label: 'Release Requests', icon: ClipboardList },
          { path: `${base}/access-log`, label: 'Access Audit Logs', icon: ShieldCheck },
        ]
      },
      {
        label: 'Account & Settings',
        items: [
          { path: `${base}/notifications`, label: 'System Notifications', icon: Bell },
          { path: `${base}/profile`, label: 'Staff Profile', icon: User },
          { path: `${base}/settings`, label: 'Settings', icon: Settings },
        ]
      }
    ],

    // 9. Emergency Staff
    emergency: [
      {
        label: 'Emergency Command',
        items: [
          { path: base, label: 'Trauma Overview', icon: LayoutDashboard, end: true },
          { path: `${base}/cases`, label: 'Active Emergency Cases', icon: Siren, danger: true },
          { path: `${base}/triage`, label: 'Triage Assessment', icon: Activity },
          { path: `${base}/critical`, label: 'Critical Resuscitation', icon: AlertTriangle, danger: true },
        ]
      },
      {
        label: 'Beds & Coordination',
        items: [
          { path: `${base}/beds`, label: 'ER Bed Capacity', icon: Bed },
          { path: `${base}/doctors`, label: 'On-Call Trauma Doctors', icon: Stethoscope },
          { path: `${base}/diagnostics`, label: 'STAT Diagnostics', icon: FlaskConical },
          { path: `${base}/transfers`, label: 'Ambulance Transfers', icon: Truck },
          { path: `${base}/discharge`, label: 'Emergency Discharge', icon: CheckCircle2 },
        ]
      },
      {
        label: 'Account & Settings',
        items: [
          { path: `${base}/notifications`, label: 'Emergency Sirens', icon: Bell },
          { path: `${base}/profile`, label: 'Staff Profile', icon: User },
          { path: `${base}/settings`, label: 'Settings', icon: Settings },
        ]
      }
    ],

    // 10. HR Manager
    hr: [
      {
        label: 'Workforce Command',
        items: [
          { path: base, label: 'HR Overview', icon: LayoutDashboard, end: true },
          { path: `${base}/employees`, label: 'Employee Directory', icon: Users },
          { path: `${base}/doctors`, label: 'Doctor Staffing', icon: Stethoscope },
          { path: `${base}/nurses`, label: 'Nursing Staffing', icon: UserCheck },
          { path: `${base}/departments`, label: 'Departments', icon: Building2 },
        ]
      },
      {
        label: 'Duty & Rostering',
        items: [
          { path: `${base}/shifts`, label: 'Shift Roster', icon: Clock },
          { path: `${base}/attendance`, label: 'Duty Attendance', icon: ClipboardList },
          { path: `${base}/leave`, label: 'Leave Requests', icon: Calendar },
          { path: `${base}/assignments`, label: 'Ward Assignments', icon: Bed },
          { path: `${base}/reports`, label: 'HR Analytics & Reports', icon: BarChart3 },
        ]
      },
      {
        label: 'Account & Settings',
        items: [
          { path: `${base}/notifications`, label: 'HR Notifications', icon: Bell },
          { path: `${base}/profile`, label: 'Manager Profile', icon: User },
          { path: `${base}/settings`, label: 'Settings', icon: Settings },
        ]
      }
    ]
  };

  return configs[roleId] || configs.admin;
}

function NavItem({ item, collapsed }) {
  return (
    <NavLink
      to={item.path}
      end={item.end}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `sidebar-link${isActive ? ' active' : ''}${item.danger ? ' sidebar-danger' : ''}`
      }
    >
      <item.icon size={16} className="link-icon" />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const roleId = user?.roleId || 'admin';
  const navSections = getNavSections(roleId);

  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={onMobileClose} />}
      <aside className={`sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}>
        {/* CareBridge Hospital Portal Header Branding */}
        <div className="sidebar-logo" style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div
            className="logo-icon"
            style={{
              background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
              width: 34,
              height: 34,
              borderRadius: 9,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)'
            }}
          >
            <Hospital size={19} color="#FFFFFF" />
          </div>
          {!collapsed && (
            <div className="logo-text" style={{ marginLeft: 10, overflow: 'hidden' }}>
              <div className="logo-name" style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                CareBridge
              </div>
              <div className="logo-sub" style={{ fontSize: '10px', color: '#38BDF8', fontWeight: 700, letterSpacing: '0.04em' }}>
                HOSPITAL PORTAL
              </div>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button className="sidebar-toggle" onClick={onToggle} title="Collapse Sidebar">
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Ecosystem Sub-label / Role Header */}
        {!collapsed && (
          <div
            style={{
              padding: '8px 16px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.04)'
            }}
          >
            <span style={{ fontSize: '9.5px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              {user?.roleLabel || 'Healthcare System'}
            </span>
            <span
              style={{
                fontSize: '9px',
                padding: '1px 6px',
                borderRadius: '4px',
                background: 'rgba(14, 165, 233, 0.15)',
                color: '#38BDF8',
                fontWeight: 700
              }}
            >
              LIVE
            </span>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="sidebar-nav">
          {navSections.map((sec, i) => (
            <div key={i} className="sidebar-group">
              {collapsed ? (
                i > 0 && <div className="sidebar-collapsed-divider" />
              ) : (
                <div className="sidebar-group-heading">
                  <span>{sec.label}</span>
                </div>
              )}
              {sec.items.map((item, j) => (
                <NavItem key={j} item={item} collapsed={collapsed} />
              ))}
            </div>
          ))}
        </div>

        {/* User Card at Bottom */}
        {!collapsed && (
          <div
            className="sidebar-user"
            style={{
              padding: '10px 14px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(15, 23, 42, 0.75)',
              margin: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, overflow: 'hidden' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
                  color: '#FFFFFF',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {user?.avatar || 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: '10px', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.roleLabel || roleId}
                </div>
              </div>
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#F87171',
                borderRadius: '6px',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
