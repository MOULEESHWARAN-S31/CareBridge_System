import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Map, AlertTriangle, Activity, Building2, 
  Pill, Users, BrainCircuit, FileBarChart, LogOut,
  Menu, X, Stethoscope, Bell,
  FileText,
  Sparkles, ShieldCheck, Siren, Heart, ArrowRightLeft, Tent,
  BarChart3, MapPin
} from 'lucide-react';
import { useHealthData } from '../context/HealthDataContext';
import { GlobalSearchModal } from '../components/GlobalSearchModal';
import { NotificationsModal } from '../components/NotificationsModal';
import { ActionWorkflowModal } from '../components/ActionWorkflowModal';
import logoImg from '../assets/logo.png';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    const handleViewportChange = (event: MediaQueryListEvent) => setIsMobileViewport(event.matches);
    mediaQuery.addEventListener('change', handleViewportChange);
    return () => mediaQuery.removeEventListener('change', handleViewportChange);
  }, []);

  // Handler for CareBridge Logo Sidebar Toggle (Unified on desktop & mobile)
  const handleToggleSidebar = () => {
    if (isMobileViewport) {
      setMobileMenuOpen(open => !open);
    } else {
      setSidebarCollapsed(collapsed => !collapsed);
    }
  };

  const { 
    stateName,
    userDistrict,
    districtName, setDistrictName, 
    districts,
    userRole,
    userWorkspace, setUserWorkspace,
    canAccessStateWorkspace,
    officerName,
    demoMode, setDemoMode,
    notificationsOpen, setNotificationsOpen, 
    notifications,
    ruleAlerts,
    isOfflineMock,
    logout
  } = useHealthData();
  const location = useLocation();

  useEffect(() => {
    if (!canAccessStateWorkspace && location.pathname.startsWith('/dashboard/state')) {
      setUserWorkspace('DISTRICT_ADMIN');
      navigate('/dashboard/district/overview', { replace: true });
    }
    if (canAccessStateWorkspace && location.pathname.startsWith('/dashboard/district')) {
      setUserWorkspace('STATE_ADMIN');
      navigate('/dashboard/state/overview', { replace: true });
    }
  }, [canAccessStateWorkspace, location.pathname, navigate, setUserWorkspace]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeCriticalAlerts = ruleAlerts.filter(a => a.status === 'Active' && a.category === 'Critical').length;

  // Workspace-Specific Sidebar Navigation
  const stateAdminSection = {
    title: 'State Administration (Tamil Nadu)',
    items: [
      { path: '/dashboard/state/overview', icon: LayoutDashboard, label: 'S01: State Overview', exact: true },
      { path: '/dashboard/state/districts', icon: BarChart3, label: 'S02: District Comparison' },
      { path: '/dashboard/state/surveillance', icon: Activity, label: 'S03: Disease Surveillance' },
      { path: '/dashboard/state/facilities', icon: Building2, label: 'S04: Facility Monitoring' },
      { path: '/dashboard/state/medicines', icon: Pill, label: 'S05: Medicine & Diagnostics' },
      { path: '/dashboard/state/blood', icon: Siren, label: 'S06: Blood Service Monitoring' },
      { path: '/dashboard/state/camps', icon: Tent, label: 'S07: Health Camp Oversight' },
      { path: '/dashboard/state/resources', icon: ArrowRightLeft, label: 'S08: Resource Coordination' },
      { path: '/dashboard/state/requests', icon: AlertTriangle, label: 'S10: Escalations & Approvals' },
      { path: '/dashboard/state/announcements', icon: Bell, label: 'S11: State Announcements' },
      { path: '/dashboard/state/reports', icon: FileBarChart, label: 'S12: State Reports & Audit' },
    ]
  };

  const districtAdminSection = {
    title: `District Administration (${districtName || 'Salem'})`,
    items: [
      { path: '/dashboard/district/overview', icon: LayoutDashboard, label: 'D01: District Overview', exact: true },
      { path: '/dashboard/district/hospitals', icon: Building2, label: 'D02: Hospitals & PHCs' },
      { path: '/dashboard/district/villages', icon: MapPin, label: 'D03: Village/Block Health' },
      { path: '/dashboard/district/camps', icon: Tent, label: 'D04: Health Camp Management' },
      { path: '/dashboard/district/community-requests', icon: Users, label: 'D05: Community Requests' },
      { path: '/dashboard/district/medicines', icon: Pill, label: 'D06: Medicine Inventory' },
      { path: '/dashboard/district/diagnostics', icon: Activity, label: 'D07: Diagnostic Availability' },
      { path: '/dashboard/district/blood', icon: Siren, label: 'D08: Blood Bank Network' },
      { path: '/dashboard/district/queue', icon: Activity, label: 'D09: Appointments & Queue' },
      { path: '/dashboard/district/referrals', icon: ArrowRightLeft, label: 'D10: Referral Monitoring' },
      { path: '/dashboard/district/follow-ups', icon: Heart, label: 'D11: Follow-Up Monitoring' },
      { path: '/dashboard/district/notifications', icon: Bell, label: 'D12: District Notifications' },
      { path: '/dashboard/district/reports', icon: FileText, label: 'D14/D15: Reports & Audit' },
    ]
  };

  const commonSection = {
    title: 'Statewide Health Network',
    items: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Command Overview', exact: true },
      { path: '/dashboard/district-map', icon: Map, label: 'District Monitoring Map' },
      { path: '/dashboard/hospitals', icon: Building2, label: 'Government Hospitals & PHCs' },
      { path: '/dashboard/village-map', icon: MapPin, label: 'Village Health Map' },
      { path: '/dashboard/patients', icon: Users, label: 'Patient Monitoring' },
      { path: '/dashboard/doctors', icon: Stethoscope, label: 'Doctors & Specialists' },
      { path: '/dashboard/surveillance', icon: Activity, label: 'Disease Surveillance' },
      { path: '/dashboard/ai-prediction', icon: BrainCircuit, label: 'Outbreak Prediction' },
      { path: '/dashboard/alerts', icon: AlertTriangle, label: `Disease Alerts (${activeCriticalAlerts})` },
      { path: '/dashboard/administration', icon: ShieldCheck, label: 'System Administration' },
    ]
  };

  const navSections = userWorkspace === 'STATE_ADMIN'
    ? [stateAdminSection, districtAdminSection, commonSection]
    : [districtAdminSection, stateAdminSection, commonSection];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-slate-900 font-sans">
      
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden animate-fadeIn"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 ${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-slate-200 text-slate-800 flex flex-col h-full shadow-lg transition-transform duration-300 ease-in-out flex-shrink-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header: CareBridge Emblem */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <button
            type="button"
            onClick={handleToggleSidebar}
            aria-label={isMobileViewport
              ? (mobileMenuOpen ? 'Close sidebar' : 'Open sidebar')
              : (sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar')}
            aria-expanded={isMobileViewport ? mobileMenuOpen : !sidebarCollapsed}
            title={isMobileViewport
              ? (mobileMenuOpen ? 'Close sidebar' : 'Open sidebar')
              : (sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar')}
            className="flex items-center gap-2.5 cursor-pointer text-left focus:outline-none"
          >
            <img
              src={logoImg}
              alt="CareBridge Logo"
              className="w-10 h-10 object-contain rounded-xl shadow-xs flex-shrink-0 hover:scale-105 transition-transform"
            />
            {!sidebarCollapsed && (
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-extrabold tracking-widest text-teal-800 uppercase block">Govt of Tamil Nadu</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                </div>
                <h1 className="font-black text-sm leading-tight tracking-tight text-slate-900">
                  CareBridge Portal
                </h1>
              </div>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4 custom-scrollbar">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                {section.title}
              </span>
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.exact}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          isActive 
                            ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20 font-extrabold' 
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer: Officer & Logout */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex flex-col gap-2">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-[11px] font-semibold text-slate-500">Connected to NIC Portal</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">v2.6</span>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 hover:text-rose-800 transition-colors border border-rose-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 z-20 shadow-xs flex-shrink-0">

          {/* Left: Mobile Toggle & Location Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Government of Tamil Nadu — CareBridge Portal Branding with CareBridge Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <img 
                src={logoImg} 
                alt="CareBridge Logo" 
                className="w-9 h-9 object-contain rounded-xl flex-shrink-0 shadow-xs" 
              />
              <div className="hidden sm:block leading-tight">
                <span className="text-[10px] font-extrabold tracking-wider text-teal-800 uppercase block">Government of Tamil Nadu</span>
                <span className="font-extrabold text-xs text-slate-900 block">CareBridge Portal</span>
              </div>
            </div>

            <div className="hidden md:block h-6 w-px bg-slate-200" />

            {/* Location Breadcrumb: State -> District */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <Map className="w-3.5 h-3.5 text-teal-700 flex-shrink-0" />
              <span className="font-semibold text-slate-600 hidden sm:inline">{stateName}</span>
              <span className="text-slate-400 hidden sm:inline">→</span>
              <select 
                value={districtName} 
                onChange={(e) => setDistrictName(e.target.value)} 
                className="border-none bg-transparent font-bold text-teal-800 focus:ring-0 cursor-pointer outline-none"
              >
                {(canAccessStateWorkspace ? districts : districts.filter(d => d.name === userDistrict)).map(d => (
                  <option key={d.id} value={d.name} className="bg-white text-slate-900">
                    {d.name} District {d.status === 'Critical' ? '⚠️' : d.status === 'Attention' ? '⚡' : '✅'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Header Controls: Workspace Switcher, Demo, Notifications, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* State Admin / District Admin Workspace Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1">
              <button
                type="button"
                onClick={() => setUserWorkspace('STATE_ADMIN')}
                disabled={!canAccessStateWorkspace}
                title={!canAccessStateWorkspace ? 'State workspace is not assigned to this account' : 'State Admin'}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  userWorkspace === 'STATE_ADMIN' && canAccessStateWorkspace
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 cursor-not-allowed'
                }`}
              >
                State Admin
              </button>
              <button
                type="button"
                onClick={() => setUserWorkspace('DISTRICT_ADMIN')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  userWorkspace === 'DISTRICT_ADMIN'
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                District Admin
              </button>
            </div>

            {/* Demo Data Toggle */}
            <div 
              onClick={() => setDemoMode(!demoMode)}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                demoMode 
                  ? 'bg-teal-50 border-teal-200 text-teal-800' 
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
              title="Toggle Simulated Demonstration Data"
            >
              <Sparkles className="w-3 h-3 text-teal-600" />
              <span>Demo Mode</span>
            </div>

            {/* Notifications Button */}
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white font-bold text-[9px] rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Server-authoritative Government role */}
            <div
              className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
              title="Server-authoritative Government role"
            >
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></div>
                <div className="text-left hidden sm:block">
                  <span className="font-extrabold text-slate-900 block leading-tight">{officerName}</span>
                  <span className="text-[10px] text-slate-500 block leading-tight">{userRole}</span>
                </div>
            </div>

          </div>
        </header>

        {/* Development / Offline Mock Data Indicator */}
        {isOfflineMock && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs text-amber-900 font-semibold shadow-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>
                <strong>Development / Offline Mock Data:</strong> PostgreSQL backend at <code>http://localhost:5000</code> is offline or unreachable. Using simulated government records.
              </span>
            </div>
            <span className="text-[10px] bg-amber-200 text-amber-950 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Offline Mode
            </span>
          </div>
        )}

        {/* Scrollable Main View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Modals */}
      <GlobalSearchModal />
      <NotificationsModal />
      <ActionWorkflowModal />

    </div>
  );
}
