import { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../components/common/Toast';
import {
  Users, Stethoscope, UserCheck, Building2, Calendar, BarChart3,
  Search, Plus, Filter, Clock, CheckCircle2, XCircle, AlertTriangle,
  Mail, Phone, Award, Shield, FileText, ChevronRight, Edit2, Download
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

// Initial Employee Roster spanning all hospital wings
const INITIAL_STAFF = [
  { id: 'CB-DOC-001', name: 'Dr. Priya Sharma', role: 'Doctor', roleId: 'DOCTOR', dept: 'Cardiology', qualification: 'MBBS, MD (Cardio)', phone: '+91 98451 22301', email: 'doctor@carebridge.local', shift: 'Morning', status: 'On Duty', room: 'Consultation Room 4', experience: '12 yrs' },
  { id: 'CB-DOC-002', name: 'Dr. Rajesh Kumar', role: 'Doctor', roleId: 'DOCTOR', dept: 'General Medicine', qualification: 'MBBS, MD (Gen Med)', phone: '+91 98451 22302', email: 'rajesh.kumar@carebridge.local', shift: 'Evening', status: 'On Call', room: 'Consultation Room 2', experience: '15 yrs' },
  { id: 'CB-DOC-003', name: 'Dr. Sunita Rao', role: 'Doctor', roleId: 'DOCTOR', dept: 'Pediatrics', qualification: 'MBBS, DCH', phone: '+91 98451 22303', email: 'sunita.rao@carebridge.local', shift: 'Morning', status: 'On Duty', room: 'Pediatric OPD', experience: '9 yrs' },
  { id: 'CB-DOC-004', name: 'Dr. Ananya Roy', role: 'Doctor', roleId: 'DOCTOR', dept: 'Obstetrics & Gynecology', qualification: 'MBBS, MS (OBG)', phone: '+91 98451 22304', email: 'ananya.roy@carebridge.local', shift: 'Night', status: 'Off Duty', room: 'Maternity Wing', experience: '8 yrs' },
  { id: 'CB-DOC-005', name: 'Dr. Vikram Patel', role: 'Doctor', roleId: 'DOCTOR', dept: 'Orthopedics', qualification: 'MBBS, MS (Ortho)', phone: '+91 98451 22305', email: 'vikram.patel@carebridge.local', shift: 'Morning', status: 'On Leave', room: 'Ortho Suite 1', experience: '14 yrs' },

  { id: 'CB-NUR-001', name: 'Sister Anitha Ravi', role: 'Nurse', roleId: 'NURSE', dept: 'Inpatient & General Ward', qualification: 'B.Sc. Nursing, RN', phone: '+91 98451 33401', email: 'nurse@carebridge.local', shift: 'Morning', status: 'On Duty', room: 'Ward Station B', experience: '7 yrs' },
  { id: 'CB-NUR-002', name: 'Sister Deepa Mary', role: 'Nurse', roleId: 'NURSE', dept: 'ICU / Critical Care', qualification: 'M.Sc. Nursing (Critical Care)', phone: '+91 98451 33402', email: 'deepa.mary@carebridge.local', shift: 'Evening', status: 'On Duty', room: 'ICU Ward 2', experience: '10 yrs' },
  { id: 'CB-NUR-003', name: 'Sister Kavitha S.', role: 'Nurse', roleId: 'NURSE', dept: 'Pediatrics', qualification: 'GNM, RN', phone: '+91 98451 33403', email: 'kavitha.s@carebridge.local', shift: 'Morning', status: 'On Duty', room: 'Ward Station A', experience: '5 yrs' },
  { id: 'CB-NUR-004', name: 'Sister Mary Joseph', role: 'Nurse', roleId: 'NURSE', dept: 'Emergency & Trauma', qualification: 'B.Sc. Nursing', phone: '+91 98451 33404', email: 'mary.j@carebridge.local', shift: 'Night', status: 'On Duty', room: 'Emergency Triage', experience: '6 yrs' },

  { id: 'CB-REC-001', name: 'Senthil Nathan', role: 'Receptionist', roleId: 'RECEPTIONIST', dept: 'OPD Registration', qualification: 'B.Com, PGDHM', phone: '+91 98451 44501', email: 'receptionist@carebridge.local', shift: 'Morning', status: 'On Duty', room: 'Desk 1 (OPD Entry)', experience: '4 yrs' },
  { id: 'CB-LAB-001', name: 'Ravi Shankar', role: 'Laboratory Staff', roleId: 'LAB_STAFF', dept: 'Pathology & Biochemistry', qualification: 'M.Sc. MLT, DMLT', phone: '+91 98451 55601', email: 'lab@carebridge.local', shift: 'Morning', status: 'On Duty', room: 'Central Pathology Lab', experience: '11 yrs' },
  { id: 'CB-PHM-001', name: 'Karthik Raman', role: 'Pharmacist', roleId: 'PHARMACIST', dept: 'Central Pharmacy', qualification: 'B.Pharm, R.Ph', phone: '+91 98451 66701', email: 'pharmacist@carebridge.local', shift: 'Morning', status: 'On Duty', room: 'Counter #1 & Dispensing', experience: '8 yrs' },
  { id: 'CB-BIL-001', name: 'Ramesh Krishnan', role: 'Billing Staff', roleId: 'BILLING_STAFF', dept: 'Finance & Accounts', qualification: 'B.Com, M.Com (Fin)', phone: '+91 98451 77801', email: 'billing@carebridge.local', shift: 'General', status: 'On Duty', room: 'Billing Counter #2', experience: '6 yrs' },
  { id: 'CB-REC-002', name: 'Pooja Sundaram', role: 'Medical Records Staff', roleId: 'RECORDS_STAFF', dept: 'Medical Records Department', qualification: 'B.Sc. Health Info Admin', phone: '+91 98451 88901', email: 'records@carebridge.local', shift: 'General', status: 'On Duty', room: 'MRD Archives Room 102', experience: '5 yrs' },
  { id: 'CB-EMG-001', name: 'Manoj Kumar', role: 'Emergency Staff', roleId: 'EMERGENCY_STAFF', dept: 'Casualty & Emergency Wing', qualification: 'EMT-Paramedic, Dip. EM', phone: '+91 98451 99001', email: 'emergency@carebridge.local', shift: 'Morning', status: 'On Duty', room: 'Red Triage Bay', experience: '7 yrs' },
  { id: 'CB-HR-001', name: 'Divya Menon', role: 'HR Manager', roleId: 'HR_MANAGER', dept: 'Human Resources', qualification: 'MBA (HRM), SHRM-CP', phone: '+91 98451 11201', email: 'hr@carebridge.local', shift: 'General', status: 'On Duty', room: 'Admin Block Room 204', experience: '13 yrs' },
  { id: 'CB-HADM-001', name: 'Dr. A. K. Sundaram', role: 'Hospital Administrator', roleId: 'HOSPITAL_ADMIN', dept: 'Hospital Administration', qualification: 'MBBS, MHA (AIIMS)', phone: '+91 98451 00101', email: 'hospital.admin@carebridge.local', shift: 'General', status: 'On Duty', room: 'Directorate Office', experience: '22 yrs' }
];

// Initial Leave Requests
const INITIAL_LEAVE_REQUESTS = [
  { id: 'LR-101', empId: 'CB-DOC-005', name: 'Dr. Vikram Patel', role: 'Doctor', dept: 'Orthopedics', type: 'Annual Leave', from: '2026-09-08', to: '2026-09-12', days: 5, reason: 'Family medical emergency', status: 'Pending', appliedOn: '2026-09-06' },
  { id: 'LR-102', empId: 'CB-NUR-003', name: 'Sister Kavitha S.', role: 'Nurse', dept: 'Pediatrics', type: 'Casual Leave', from: '2026-09-10', to: '2026-09-11', days: 2, reason: 'Personal commitments', status: 'Pending', appliedOn: '2026-09-07' },
  { id: 'LR-103', empId: 'CB-REC-001', name: 'Senthil Nathan', role: 'Receptionist', dept: 'OPD Registration', type: 'Sick Leave', from: '2026-09-05', to: '2026-09-06', days: 2, reason: 'Viral fever & throat infection', status: 'Approved', appliedOn: '2026-09-04' },
  { id: 'LR-104', empId: 'CB-LAB-001', name: 'Ravi Shankar', role: 'Laboratory Staff', dept: 'Pathology & Biochemistry', type: 'Conference Leave', from: '2026-09-15', to: '2026-09-17', days: 3, reason: 'National Hematology Symposium, Chennai', status: 'Pending', appliedOn: '2026-09-05' },
];

const DEPARTMENTS = [
  'All Departments',
  'Cardiology',
  'General Medicine',
  'Pediatrics',
  'Obstetrics & Gynecology',
  'Orthopedics',
  'Inpatient & General Ward',
  'ICU / Critical Care',
  'Emergency & Trauma',
  'OPD Registration',
  'Pathology & Biochemistry',
  'Central Pharmacy',
  'Finance & Accounts',
  'Medical Records Department',
  'Casualty & Emergency Wing',
  'Human Resources',
  'Hospital Administration'
];

const ROLES = [
  'All Roles',
  'Doctor',
  'Nurse',
  'Receptionist',
  'Laboratory Staff',
  'Pharmacist',
  'Billing Staff',
  'Medical Records Staff',
  'Emergency Staff',
  'HR Manager',
  'Hospital Administrator'
];

const SHIFTS = [
  { id: 'Morning', label: 'Morning Shift', hours: '07:00 AM – 03:00 PM', color: '#0EA5E9' },
  { id: 'Evening', label: 'Evening Shift', hours: '03:00 PM – 11:00 PM', color: '#F59E0B' },
  { id: 'Night', label: 'Night Shift', hours: '11:00 PM – 07:00 AM', color: '#8B5CF6' },
  { id: 'General', label: 'General Admin', hours: '09:00 AM – 05:00 PM', color: '#10B981' }
];

const DEPT_CHART = [
  { dept: 'Medicine', doctors: 8, nurses: 24, support: 6 },
  { dept: 'Surgery', doctors: 6, nurses: 18, support: 5 },
  { dept: 'Cardio', doctors: 5, nurses: 12, support: 4 },
  { dept: 'Pediatrics', doctors: 4, nurses: 14, support: 3 },
  { dept: 'Emergency', doctors: 7, nurses: 20, support: 12 },
  { dept: 'ICU / CCU', doctors: 4, nurses: 16, support: 4 },
  { dept: 'Diagnostics', doctors: 3, nurses: 6, support: 18 },
  { dept: 'Pharmacy', doctors: 0, nurses: 2, support: 14 },
];

export default function HRDashboard() {
  const { t } = useLanguage();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('directory'); // 'directory', 'roster', 'availability', 'leaves', 'analytics'
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [leaveRequests, setLeaveRequests] = useState(INITIAL_LEAVE_REQUESTS);

  // Search & Filter state for directory
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  // Modals state
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [selectedStaffForRoster, setSelectedStaffForRoster] = useState(null);
  const [newShift, setNewShift] = useState('Morning');

  // Add staff form state
  const [addForm, setAddForm] = useState({
    name: '',
    role: 'Doctor',
    roleId: 'DOCTOR',
    dept: 'General Medicine',
    qualification: '',
    phone: '',
    email: '',
    shift: 'Morning',
    status: 'On Duty',
    room: '',
    experience: ''
  });

  // KPI Calculations
  const totalStaff = staffList.length;
  const onDutyCount = staffList.filter(s => s.status === 'On Duty').length;
  const onCallCount = staffList.filter(s => s.status === 'On Call').length;
  const onLeaveCount = staffList.filter(s => s.status === 'On Leave').length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;

  const statCards = [
    { label: 'Total Hospital Staff', value: '248', subtext: `${totalStaff} active records`, icon: Users, color: '#6366F1', bg: '#EDE9FE' },
    { label: 'Staff On Duty Now', value: `${onDutyCount}`, subtext: 'Across all 14 wards', icon: Building2, color: '#10B981', bg: '#D1FAE5' },
    { label: 'Staff On Call / Standby', value: `${onCallCount}`, subtext: 'Ready for emergency alert', icon: Phone, color: '#0EA5E9', bg: '#E0F2FE' },
    { label: 'Staff On Approved Leave', value: `${onLeaveCount}`, subtext: `${pendingLeaves} requests pending`, icon: Calendar, color: '#F59E0B', bg: '#FEF3C7' },
    { label: 'Clinical Staff (Docs & Nurses)', value: '160', subtext: '64.5% clinical ratio', icon: Stethoscope, color: '#8B5CF6', bg: '#EDE9FE' },
    { label: 'Pending HR Authorizations', value: `${pendingLeaves}`, subtext: 'Leave & shift approvals', icon: AlertTriangle, color: '#EF4444', bg: '#FEE2E2' },
  ];

  // Filtered staff list
  const filteredStaff = useMemo(() => {
    return staffList.filter(s => {
      const matchSearch = searchTerm === '' ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phone.includes(searchTerm);

      const matchDept = deptFilter === 'All Departments' || s.dept === deptFilter;
      const matchRole = roleFilter === 'All Roles' || s.role === roleFilter;
      const matchStatus = statusFilter === 'All Statuses' || s.status === statusFilter;

      return matchSearch && matchDept && matchRole && matchStatus;
    });
  }, [staffList, searchTerm, deptFilter, roleFilter, statusFilter]);

  // Handlers
  function handleAddStaffSubmit(e) {
    e.preventDefault();
    if (!addForm.name.trim()) {
      toast('Please enter staff name', 'error');
      return;
    }

    const idPrefix = addForm.role === 'Doctor' ? 'CB-DOC' :
      addForm.role === 'Nurse' ? 'CB-NUR' :
      addForm.role === 'Receptionist' ? 'CB-REC' :
      addForm.role === 'Laboratory Staff' ? 'CB-LAB' :
      addForm.role === 'Pharmacist' ? 'CB-PHM' :
      addForm.role === 'Billing Staff' ? 'CB-BIL' :
      addForm.role === 'Emergency Staff' ? 'CB-EMG' : 'CB-EMP';

    const newEmp = {
      ...addForm,
      id: `${idPrefix}-${Math.floor(100 + Math.random() * 900)}`,
      email: addForm.email || `${addForm.name.toLowerCase().replace(/\s+/g, '.')}@carebridge.local`
    };

    setStaffList(prev => [newEmp, ...prev]);
    setShowAddStaffModal(false);
    toast(`Successfully onboarded ${newEmp.name} (${newEmp.id}) to ${newEmp.dept}`, 'success');

    // Reset
    setAddForm({
      name: '',
      role: 'Doctor',
      roleId: 'DOCTOR',
      dept: 'General Medicine',
      qualification: '',
      phone: '',
      email: '',
      shift: 'Morning',
      status: 'On Duty',
      room: '',
      experience: ''
    });
  }

  function handleOpenRosterModal(staff) {
    setSelectedStaffForRoster(staff);
    setNewShift(staff.shift);
    setShowRosterModal(true);
  }

  function handleSaveRosterUpdate(e) {
    e.preventDefault();
    if (!selectedStaffForRoster) return;

    setStaffList(prev => prev.map(s => {
      if (s.id === selectedStaffForRoster.id) {
        return { ...s, shift: newShift };
      }
      return s;
    }));

    setShowRosterModal(false);
    toast(`Updated shift for ${selectedStaffForRoster.name} to ${newShift}`, 'success');
  }

  function handleToggleStaffStatus(staffId, currentStatus) {
    const nextStatus = currentStatus === 'On Duty' ? 'On Call' :
      currentStatus === 'On Call' ? 'Off Duty' :
      currentStatus === 'Off Duty' ? 'On Duty' : 'On Duty';

    setStaffList(prev => prev.map(s => {
      if (s.id === staffId) {
        return { ...s, status: nextStatus };
      }
      return s;
    }));

    toast(`Status for ${staffId} updated to ${nextStatus}`, 'info');
  }

  function handleApproveLeave(leaveId) {
    setLeaveRequests(prev => prev.map(l => {
      if (l.id === leaveId) {
        return { ...l, status: 'Approved' };
      }
      return l;
    }));
    toast(`Leave application ${leaveId} has been approved`, 'success');
  }

  function handleRejectLeave(leaveId) {
    setLeaveRequests(prev => prev.map(l => {
      if (l.id === leaveId) {
        return { ...l, status: 'Rejected' };
      }
      return l;
    }));
    toast(`Leave application ${leaveId} has been rejected`, 'error');
  }

  return (
    <div className="fade-in" style={{ paddingBottom: 32 }}>
      {/* ── 1. Header Banner ────────────────────────────────────────── */}
      <div className="dashboard-header" style={{ marginBottom: 16 }}>
        <div>
          <div className="dashboard-title">👥 Human Resources & Workforce Operations</div>
          <div className="dashboard-subtitle">Divya Menon · HR Management Division · Salem District Hospital</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('roster')}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Calendar size={14} /> Manage Rosters
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddStaffModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={14} /> Add New Employee
          </button>
        </div>
      </div>

      {/* ── 2. Top KPI Cards ────────────────────────────────────────── */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {statCards.map((c, i) => (
          <div key={i} className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="stat-label">{c.label}</div>
              <div className="stat-icon" style={{ background: c.bg }}><c.icon size={18} color={c.color} /></div>
            </div>
            <div>
              <div className="stat-value" style={{ margin: '6px 0 2px' }}>{c.value}</div>
              <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>{c.subtext}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. HR Operations Navigation Tabs ───────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          background: '#FFFFFF',
          padding: 6,
          borderRadius: 10,
          border: '1px solid #E2E8F0',
          marginBottom: 16,
          overflowX: 'auto'
        }}
      >
        {[
          { id: 'directory', label: 'Staff Directory & Management', icon: Users, count: staffList.length },
          { id: 'roster', label: 'Shift Rosters & Scheduling', icon: Calendar },
          { id: 'availability', label: 'Live Staff Availability Matrix', icon: UserCheck, count: onDutyCount },
          { id: 'leaves', label: 'Leave Approvals & Attendance', icon: Clock, count: pendingLeaves, badgeDanger: pendingLeaves > 0 },
          { id: 'analytics', label: 'Workforce Analytics & Reports', icon: BarChart3 },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderRadius: 8,
                border: 'none',
                background: isActive ? '#061E38' : 'transparent',
                color: isActive ? '#FFFFFF' : '#475569',
                fontSize: 12.5,
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <tab.icon size={15} color={isActive ? '#38BDF8' : '#64748B'} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  style={{
                    fontSize: 10.5,
                    padding: '1px 6px',
                    borderRadius: 999,
                    fontWeight: 700,
                    background: tab.badgeDanger ? '#EF4444' : isActive ? 'rgba(255,255,255,0.2)' : '#F1F5F9',
                    color: tab.badgeDanger ? '#FFFFFF' : isActive ? '#FFFFFF' : '#475569'
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── 4. TAB 1: STAFF DIRECTORY & MANAGEMENT ─────────────────── */}
      {activeTab === 'directory' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Filter Bar */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#F8FAFC'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 260 }}>
              <div className="search-bar" style={{ flex: 1, maxWidth: 360, background: '#FFFFFF' }}>
                <Search size={15} color="#94A3B8" />
                <input
                  placeholder="Search staff name, ID (e.g. CB-DOC-001), email, phone..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <select
                className="form-select"
                style={{ fontSize: 12, padding: '6px 10px', height: 34, background: '#FFFFFF' }}
                value={deptFilter}
                onChange={e => setDeptFilter(e.target.value)}
              >
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <select
                className="form-select"
                style={{ fontSize: 12, padding: '6px 10px', height: 34, background: '#FFFFFF' }}
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>

              <select
                className="form-select"
                style={{ fontSize: 12, padding: '6px 10px', height: 34, background: '#FFFFFF' }}
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option>All Statuses</option>
                <option>On Duty</option>
                <option>On Call</option>
                <option>On Leave</option>
                <option>Off Duty</option>
              </select>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSearchTerm('');
                  setDeptFilter('All Departments');
                  setRoleFilter('All Roles');
                  setStatusFilter('All Statuses');
                }}
                style={{ fontSize: 11 }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Directory Table */}
          <div className="table-container">
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '12px 14px' }}>Employee</th>
                  <th style={{ padding: '12px 14px' }}>Employee ID</th>
                  <th style={{ padding: '12px 14px' }}>Role & Department</th>
                  <th style={{ padding: '12px 14px' }}>Qualifications</th>
                  <th style={{ padding: '12px 14px' }}>Current Shift</th>
                  <th style={{ padding: '12px 14px' }}>Duty Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#64748B' }}>
                      No staff records match the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map(emp => (
                    <tr key={emp.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: '50%',
                              background: emp.role === 'Doctor' ? '#E0F2FE' : emp.role === 'Nurse' ? '#D1FAE5' : '#EDE9FE',
                              color: emp.role === 'Doctor' ? '#0369A1' : emp.role === 'Nurse' ? '#047857' : '#6D28D9',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: 13
                            }}
                          >
                            {emp.name.replace(/^(Dr\.|Sister)\s*/, '').charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{emp.name}</div>
                            <div style={{ fontSize: 11, color: '#64748B' }}>{emp.email} · {emp.phone}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0284C7', background: '#E0F2FE', padding: '3px 8px', borderRadius: 4, fontSize: 11.5 }}>
                          {emp.id}
                        </span>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600, color: '#0F172A' }}>{emp.role}</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>{emp.dept}</div>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ color: '#334155', fontWeight: 500 }}>{emp.qualification}</div>
                        {emp.experience && <div style={{ fontSize: 11, color: '#64748B' }}>Exp: {emp.experience}</div>}
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            padding: '3px 9px',
                            borderRadius: 6,
                            background: emp.shift === 'Morning' ? '#E0F2FE' : emp.shift === 'Evening' ? '#FEF3C7' : emp.shift === 'Night' ? '#EDE9FE' : '#F1F5F9',
                            color: emp.shift === 'Morning' ? '#0369A1' : emp.shift === 'Evening' ? '#B45309' : emp.shift === 'Night' ? '#6D28D9' : '#334155'
                          }}
                        >
                          {emp.shift}
                        </span>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <button
                          onClick={() => handleToggleStaffStatus(emp.id, emp.status)}
                          style={{
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 6,
                            background: emp.status === 'On Duty' ? '#DCFCE7' : emp.status === 'On Call' ? '#E0F2FE' : emp.status === 'On Leave' ? '#FEF3C7' : '#F1F5F9',
                            color: emp.status === 'On Duty' ? '#15803D' : emp.status === 'On Call' ? '#0369A1' : emp.status === 'On Leave' ? '#B45309' : '#475569'
                          }}
                          title="Click to cycle status: On Duty -> On Call -> Off Duty"
                        >
                          ● {emp.status}
                        </button>
                      </td>

                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button
                            className="btn btn-ghost btn-xs"
                            onClick={() => handleOpenRosterModal(emp)}
                            title="Assign / Change Shift"
                          >
                            <Calendar size={13} /> Shift
                          </button>
                          <button
                            className="btn btn-ghost btn-xs"
                            onClick={() => toast(`Opening full HR personnel dossier for ${emp.name}`, 'info')}
                            title="View HR File"
                          >
                            <FileText size={13} /> File
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

      {/* ── 5. TAB 2: SHIFT ROSTER & SCHEDULING ─────────────────────── */}
      {activeTab === 'roster' && (
        <div style={{ display: 'grid', gap: 16 }}>
          {/* Shift definitions banner */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {SHIFTS.map(shift => {
              const count = staffList.filter(s => s.shift === shift.id).length;
              return (
                <div key={shift.id} className="card" style={{ padding: 14, borderLeft: `4px solid ${shift.color}` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{shift.label}</div>
                  <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>{shift.hours}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                    <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>Staff Assigned:</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: shift.color }}>{count}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Roster matrix by department */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>Department Shift Roster Schedule</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>Current active roster for today: 07-September-2026</div>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => toast('Exported current roster schedule as PDF', 'success')}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Download size={14} /> Export Schedule
              </button>
            </div>

            <div className="table-container">
              <table className="table" style={{ width: '100%', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569', fontSize: 11, textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 14px' }}>Staff Member</th>
                    <th style={{ padding: '12px 14px' }}>Role</th>
                    <th style={{ padding: '12px 14px' }}>Department</th>
                    <th style={{ padding: '12px 14px' }}>Assigned Station</th>
                    <th style={{ padding: '12px 14px' }}>Shift Window</th>
                    <th style={{ padding: '12px 14px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0F172A' }}>
                        <div>{s.name}</div>
                        <div style={{ fontSize: 10.5, color: '#64748B', fontFamily: 'monospace' }}>{s.id}</div>
                      </td>
                      <td style={{ padding: '10px 14px' }}>{s.role}</td>
                      <td style={{ padding: '10px 14px', color: '#334155' }}>{s.dept}</td>
                      <td style={{ padding: '10px 14px', color: '#475569' }}>{s.room || 'General Station'}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 4,
                            background: s.shift === 'Morning' ? '#E0F2FE' : s.shift === 'Evening' ? '#FEF3C7' : s.shift === 'Night' ? '#EDE9FE' : '#F1F5F9',
                            color: s.shift === 'Morning' ? '#0369A1' : s.shift === 'Evening' ? '#B45309' : s.shift === 'Night' ? '#6D28D9' : '#334155'
                          }}
                        >
                          {s.shift} (
                            {s.shift === 'Morning' ? '07:00-15:00' :
                             s.shift === 'Evening' ? '15:00-23:00' :
                             s.shift === 'Night' ? '23:00-07:00' : '09:00-17:00'}
                          )
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={() => handleOpenRosterModal(s)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                        >
                          <Edit2 size={12} /> Change
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. TAB 3: LIVE STAFF AVAILABILITY MATRIX ────────────────── */}
      {activeTab === 'availability' && (
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {/* On Duty Card */}
            <div className="card" style={{ borderTop: '4px solid #10B981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                  <span>On Duty ({onDutyCount})</span>
                </div>
                <span className="badge badge-success">Actively Stationed</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 380, overflowY: 'auto' }}>
                {staffList.filter(s => s.status === 'On Duty').map(s => (
                  <div key={s.id} style={{ padding: 10, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 12.5 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>{s.role} · {s.dept}</div>
                      <div style={{ fontSize: 10.5, color: '#0284C7', marginTop: 2 }}>📍 {s.room}</div>
                    </div>
                    <span className="tag" style={{ fontSize: 10.5 }}>{s.shift}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* On Call Card */}
            <div className="card" style={{ borderTop: '4px solid #0EA5E9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#0EA5E9', display: 'inline-block' }} />
                  <span>On Call / Standby ({onCallCount})</span>
                </div>
                <span className="badge badge-info">15m Response Window</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 380, overflowY: 'auto' }}>
                {staffList.filter(s => s.status === 'On Call').map(s => (
                  <div key={s.id} style={{ padding: 10, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 12.5 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>{s.role} · {s.dept}</div>
                      <div style={{ fontSize: 10.5, color: '#0284C7', marginTop: 2 }}>📞 {s.phone}</div>
                    </div>
                    <button
                      className="btn btn-primary btn-xs"
                      onClick={() => toast(`Emergency page dispatched to ${s.name}`, 'success')}
                    >
                      Page STAT
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* On Leave / Off Duty Card */}
            <div className="card" style={{ borderTop: '4px solid #F59E0B' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
                  <span>On Leave / Off Duty ({onLeaveCount + staffList.filter(s => s.status === 'Off Duty').length})</span>
                </div>
                <span className="badge badge-warning">Unavailable</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 380, overflowY: 'auto' }}>
                {staffList.filter(s => s.status === 'On Leave' || s.status === 'Off Duty').map(s => (
                  <div key={s.id} style={{ padding: 10, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 12.5 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>{s.role} · {s.dept}</div>
                    </div>
                    <span className={`badge ${s.status === 'On Leave' ? 'badge-warning' : 'badge-muted'}`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. TAB 4: LEAVE APPROVALS & ATTENDANCE ──────────────────── */}
      {activeTab === 'leaves' && (
        <div style={{ display: 'grid', gap: 16 }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>Staff Leave Applications & Authorizations</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>Review and approve requested absences with shift coverage validation</div>
              </div>
              <span className="badge badge-warning" style={{ fontWeight: 700 }}>
                {pendingLeaves} Pending Review
              </span>
            </div>

            <div className="table-container">
              <table className="table" style={{ width: '100%', fontSize: 12.5 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569', fontSize: 11, textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 14px' }}>Request ID</th>
                    <th style={{ padding: '12px 14px' }}>Applicant</th>
                    <th style={{ padding: '12px 14px' }}>Department</th>
                    <th style={{ padding: '12px 14px' }}>Leave Type</th>
                    <th style={{ padding: '12px 14px' }}>Duration & Dates</th>
                    <th style={{ padding: '12px 14px' }}>Reason</th>
                    <th style={{ padding: '12px 14px' }}>Status</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Authorization</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map(req => (
                    <tr key={req.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#0284C7' }}>
                        {req.id}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{req.name}</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>{req.role} ({req.empId})</div>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#334155' }}>{req.dept}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className="tag">{req.type}</span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600, color: '#0F172A' }}>{req.days} Day(s)</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>{req.from} to {req.to}</div>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#475569', maxWidth: 200 }}>
                        {req.reason}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className={`badge ${req.status === 'Approved' ? 'badge-success' : req.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        {req.status === 'Pending' ? (
                          <div style={{ display: 'inline-flex', gap: 6 }}>
                            <button
                              className="btn btn-primary btn-xs"
                              onClick={() => handleApproveLeave(req.id)}
                              style={{ background: '#10B981', borderColor: '#10B981' }}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-secondary btn-xs"
                              onClick={() => handleRejectLeave(req.id)}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: 11, color: '#64748B', fontStyle: 'italic' }}>Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── 8. TAB 5: WORKFORCE ANALYTICS & REPORTS ────────────────── */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'grid', gap: 16 }}>
          <div className="grid-2" style={{ gap: 16 }}>
            {/* Department Headcounts Bar Chart */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">📊 Workforce Allocation by Clinical Department</div>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={DEPT_CHART} barSize={16}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="dept" tick={{ fill: '#64748B', fontSize: 10.5 }} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 10.5 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                    <Bar dataKey="doctors" fill="#0EA5E9" name="Doctors" radius={[4,4,0,0]} />
                    <Bar dataKey="nurses" fill="#10B981" name="Nurses" radius={[4,4,0,0]} />
                    <Bar dataKey="support" fill="#8B5CF6" name="Technicians / Support" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Shift Distribution Summary */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">🕒 Active Staff Distribution by Shift Roster</div>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {SHIFTS.map(s => {
                    const count = staffList.filter(st => st.shift === s.id).length;
                    const pct = Math.round((count / staffList.length) * 100);
                    return (
                      <div key={s.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                          <span>{s.label} ({s.hours})</span>
                          <span>{count} staff ({pct}%)</span>
                        </div>
                        <div style={{ width: '100%', height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: s.color, borderRadius: 4 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 12, color: '#64748B' }}>
                    NABH Compliance Roster Ratio: <strong>1.4 Nurse-to-Bed (Exceeds Standard)</strong>
                  </div>
                  <button
                    className="btn btn-secondary btn-xs"
                    onClick={() => toast('Downloaded institutional workforce report', 'success')}
                  >
                    Download Audit Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 9. MODAL: ADD NEW EMPLOYEE ─────────────────────────────── */}
      {showAddStaffModal && (
        <div className="modal-overlay" onClick={() => setShowAddStaffModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0 }}>Onboard New Hospital Employee</h3>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  Register employee details, role permissions, and initial shift assignment
                </div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAddStaffModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddStaffSubmit}>
              <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g. Dr. Ramesh Gupta or Sister Latha Mohan"
                      value={addForm.name}
                      onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="form-group">
                      <label className="form-label">Hospital Role *</label>
                      <select
                        className="form-select"
                        value={addForm.role}
                        onChange={e => {
                          const r = e.target.value;
                          const roleId = r === 'Doctor' ? 'DOCTOR' :
                            r === 'Nurse' ? 'NURSE' :
                            r === 'Receptionist' ? 'RECEPTIONIST' :
                            r === 'Laboratory Staff' ? 'LAB_STAFF' :
                            r === 'Pharmacist' ? 'PHARMACIST' :
                            r === 'Billing Staff' ? 'BILLING_STAFF' :
                            r === 'Emergency Staff' ? 'EMERGENCY_STAFF' :
                            r === 'Medical Records Staff' ? 'RECORDS_STAFF' : 'HR_MANAGER';
                          setAddForm({ ...addForm, role: r, roleId });
                        }}
                      >
                        {ROLES.filter(r => r !== 'All Roles').map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Department *</label>
                      <select
                        className="form-select"
                        value={addForm.dept}
                        onChange={e => setAddForm({ ...addForm, dept: e.target.value })}
                      >
                        {DEPARTMENTS.filter(d => d !== 'All Departments').map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="form-group">
                      <label className="form-label">Qualifications & Degrees</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. MBBS, MD, B.Sc. Nursing"
                        value={addForm.qualification}
                        onChange={e => setAddForm({ ...addForm, qualification: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Years of Experience</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 8 yrs"
                        value={addForm.experience}
                        onChange={e => setAddForm({ ...addForm, experience: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="form-group">
                      <label className="form-label">Contact Phone</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="+91 98451 XXXXX"
                        value={addForm.phone}
                        onChange={e => setAddForm({ ...addForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Official CareBridge Email</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="name@carebridge.local"
                        value={addForm.email}
                        onChange={e => setAddForm({ ...addForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="form-group">
                      <label className="form-label">Initial Shift Assignment</label>
                      <select
                        className="form-select"
                        value={addForm.shift}
                        onChange={e => setAddForm({ ...addForm, shift: e.target.value })}
                      >
                        <option>Morning</option>
                        <option>Evening</option>
                        <option>Night</option>
                        <option>General</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Station / Room / Desk</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Room 4, Ward B, Desk 2"
                        value={addForm.room}
                        onChange={e => setAddForm({ ...addForm, room: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddStaffModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save & Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 10. MODAL: ASSIGN / UPDATE SHIFT ────────────────────────── */}
      {showRosterModal && selectedStaffForRoster && (
        <div className="modal-overlay" onClick={() => setShowRosterModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0 }}>Assign Shift Roster</h3>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  {selectedStaffForRoster.name} ({selectedStaffForRoster.id})
                </div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowRosterModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveRosterUpdate}>
              <div className="modal-body">
                <div style={{ padding: 12, background: '#F8FAFC', borderRadius: 8, marginBottom: 14, fontSize: 12, border: '1px solid #E2E8F0' }}>
                  <div><strong>Department:</strong> {selectedStaffForRoster.dept}</div>
                  <div><strong>Current Shift:</strong> {selectedStaffForRoster.shift}</div>
                  <div><strong>Station:</strong> {selectedStaffForRoster.room || 'General'}</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Select New Shift *</label>
                  <select
                    className="form-select"
                    value={newShift}
                    onChange={e => setNewShift(e.target.value)}
                  >
                    {SHIFTS.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.label} ({s.hours})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowRosterModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Shift Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
