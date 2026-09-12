import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Map, AlertTriangle, Activity, Building2, 
  Pill, BedDouble, Users, BrainCircuit, FileBarChart, LogOut,
  Menu, X, Stethoscope, Bell,
  PhoneCall, Zap, Award, FileText, ChevronDown,
  Globe, Sparkles, ShieldCheck
} from 'lucide-react';
import { useHealthData, type LanguageCode } from '../context/HealthDataContext';
import { GlobalSearchModal } from '../components/GlobalSearchModal';
import { NotificationsModal } from '../components/NotificationsModal';
import { ActionWorkflowModal } from '../components/ActionWorkflowModal';
import { type UserRole } from '../data/mockData';
import logoImg from '../assets/logo.png';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const { 
    stateName,
    districtName, setDistrictName, 
    districts,
    userRole, setUserRole,
    officerName,
    demoMode, setDemoMode,
    language, setLanguage,
    t,
    notificationsOpen, setNotificationsOpen, 
    notifications,
    ruleAlerts,
    isOfflineMock,
    logout
  } = useHealthData();

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeCriticalAlerts = ruleAlerts.filter(a => a.status === 'Active' && a.category === 'Critical').length;

  // Sidebar Navigation Structure
  const navSections = [
    {
      title: 'Dashboard',
      items: [
        { path: '/dashboard', icon: LayoutDashboard, label: t('overview'), exact: true },
        { path: '/dashboard/district-map', icon: Map, label: 'District Monitoring Map' },
      ]
    },
    {
      title: 'Healthcare Network',
      items: [
        { path: '/dashboard/hospitals', icon: Building2, label: 'Government Hospitals & PHCs' },
      ]
    },
    {
      title: 'People',
      items: [
        { path: '/dashboard/patients', icon: Users, label: t('patients') },
        { path: '/dashboard/doctors', icon: Stethoscope, label: t('doctors') },
      ]
    },
    {
      title: 'Services & Logistics',
      items: [
        { path: '/dashboard/telemedicine', icon: PhoneCall, label: t('telemedicine') },
        { path: '/dashboard/diagnostics', icon: Zap, label: t('diagnostics') },
        { path: '/dashboard/medicine', icon: Pill, label: t('medicines') },
        { path: '/dashboard/beds-resources', icon: BedDouble, label: t('beds') },
      ]
    },
    {
      title: 'Analytics & Surveillance',
      items: [
        { path: '/dashboard/surveillance', icon: Activity, label: 'Disease Surveillance' },
        { path: '/dashboard/ai-prediction', icon: BrainCircuit, label: 'Outbreak Prediction' },
        { path: '/dashboard/accessibility', icon: Award, label: t('analytics') },
      ]
    },
    {
      title: 'Reports & Audits',
      items: [
        { path: '/dashboard/reports', icon: FileBarChart, label: t('reports') },
        { path: '/dashboard/audit-logs', icon: FileText, label: t('auditLogs') },
      ]
    },
    {
      title: 'Alerts & Governance',
      items: [
        { path: '/dashboard/alerts', icon: AlertTriangle, label: `${t('alerts')} (${activeCriticalAlerts})` },
        { path: '/dashboard/administration', icon: ShieldCheck, label: 'System Administration' },
      ]
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-slate-900 font-sans">
      
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden animate-fadeIn"
        />
      )}

      {/* Sidebar Navigation (Clean White / Login Style) */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 text-slate-800 flex flex-col h-full shadow-lg transition-transform duration-300 ease-in-out flex-shrink-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header: CareBridge Emblem */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <img 
              src={logoImg} 
              alt="CareBridge Logo" 
              className="w-10 h-10 object-contain rounded-xl shadow-xs flex-shrink-0" 
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-extrabold tracking-widest text-teal-800 uppercase block">Govt of Tamil Nadu</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              </div>
              <h1 className="font-black text-sm leading-tight tracking-tight text-slate-900">
                CareBridge Portal
              </h1>
            </div>
          </div>
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

        {/* Sidebar Footer: Logout */}
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <button 
            onClick={logout}
            className="flex items-center justify-between px-3 py-2 w-full rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span>{t('logout')}</span>
            </span>
            <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">Exit</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-[#f8fafc]">
        
        {/* Top Header (Clean White / Login Style) */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 z-20 shadow-sm flex-shrink-0 gap-3">
          
          {/* Left: Mobile Toggle, Portal Branding with Logo & Location Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Government of Tamil Nadu – CareBridge Portal Branding with CareBridge Logo */}
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

            {/* Location Breadcrumb: State → District */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <Map className="w-3.5 h-3.5 text-teal-700 flex-shrink-0" />
              <span className="font-semibold text-slate-600 hidden sm:inline">{stateName}</span>
              <span className="text-slate-400 hidden sm:inline">→</span>
              <select 
                value={districtName} 
                onChange={(e) => setDistrictName(e.target.value)} 
                className="border-none bg-transparent font-bold text-teal-800 focus:ring-0 cursor-pointer outline-none"
              >
                {districts.map(d => (
                  <option key={d.id} value={d.name} className="bg-white text-slate-900">
                    {d.name} District {d.status === 'Critical' ? '🔴' : d.status === 'Attention' ? '🟡' : '🟢'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Header Controls: Demo Toggle, Language, Notifications, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">

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
              <span>{t('demoMode')}</span>
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

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 transition-colors"
                title="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 animate-fadeIn text-xs">
                  {[
                    { code: 'en' as LanguageCode, label: 'English' },
                    { code: 'ta' as LanguageCode, label: 'தமிழ்' },
                    { code: 'hi' as LanguageCode, label: 'हिन्दी' },
                  ].map(l => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 font-medium transition-colors flex items-center justify-between ${
                        language === l.code ? 'text-teal-700 font-bold bg-teal-50' : 'text-slate-700'
                      }`}
                    >
                      <span>{l.label}</span>
                      {language === l.code && <span className="text-teal-700 text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs transition-colors"
                title="Active Government Role"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></div>
                <div className="text-left hidden sm:block">
                  <span className="font-extrabold text-slate-900 block leading-tight">{officerName}</span>
                  <span className="text-[10px] text-slate-500 block leading-tight">{userRole}</span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-fadeIn text-xs space-y-1">
                  <div className="px-2 py-1 text-[10px] font-extrabold uppercase text-slate-400 border-b border-slate-100">
                    Switch Active Jurisdiction
                  </div>
                  {(['State Administrator', 'District Administrator', 'Hospital Administrator', 'Doctor'] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setUserRole(role);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                        userRole === role 
                          ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200' 
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <span className="block font-bold">{role}</span>
                        <span className="text-[10px] text-slate-500">
                          {role === 'State Administrator' ? 'Statewide Supervision' : `${districtName} Scope`}
                        </span>
                      </div>
                      {userRole === role && <span className="text-teal-700 font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
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
