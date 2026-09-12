// ============================================================
// DEMO ACCOUNTS — single source of truth. Edit here only.
// ============================================================
export const DEMO_ACCOUNTS = [
  {
    roleId: 'admin', roleName: 'Hospital Administrator',
    roleDesc: 'Complete hospital-wide management',
    icon: '🏥', color: '#6366F1',
    email: 'admin@hospital.demo', password: 'Admin@123',
    name: 'Dr. Rajesh Kumar', avatar: 'RK',
    dept: 'Administration', empId: 'EMP-001',
    dashboardPath: '/admin/dashboard',
  },
  {
    roleId: 'doctor', roleName: 'Doctor',
    roleDesc: 'Clinical care and patient management',
    icon: '👨‍⚕️', color: '#0EA5E9',
    email: 'doctor@hospital.demo', password: 'Doctor@123',
    name: 'Dr. Priya Sharma', avatar: 'PS',
    dept: 'General Medicine', empId: 'EMP-002',
    dashboardPath: '/doctor/dashboard',
  },
  {
    roleId: 'nurse', roleName: 'Nurse',
    roleDesc: 'Patient monitoring and nursing care',
    icon: '👩‍⚕️', color: '#10B981',
    email: 'nurse@hospital.demo', password: 'Nurse@123',
    name: 'Anitha Ravi', avatar: 'AR',
    dept: 'General Ward', empId: 'EMP-003',
    dashboardPath: '/nurse/dashboard',
  },
  {
    roleId: 'receptionist', roleName: 'Receptionist',
    roleDesc: 'Patient registration, OP cards and appointments',
    icon: '💼', color: '#F59E0B',
    email: 'reception@hospital.demo', password: 'Reception@123',
    name: 'Meena Krishnan', avatar: 'MK',
    dept: 'Front Desk', empId: 'REC-1001',
    dashboardPath: '/receptionist/dashboard',
  },
  {
    roleId: 'lab', roleName: 'Laboratory Staff',
    roleDesc: 'Diagnostic tests and results',
    icon: '🔬', color: '#8B5CF6',
    email: 'lab@hospital.demo', password: 'Lab@123',
    name: 'Ravi Shankar', avatar: 'RS',
    dept: 'Laboratory', empId: 'EMP-005',
    dashboardPath: '/lab/dashboard',
  },
  {
    roleId: 'pharmacy', roleName: 'Pharmacist',
    roleDesc: 'Prescriptions and medicine inventory',
    icon: '💊', color: '#EC4899',
    email: 'pharmacy@hospital.demo', password: 'Pharmacy@123',
    name: 'Kumar Pillai', avatar: 'KP',
    dept: 'Pharmacy', empId: 'EMP-006',
    dashboardPath: '/pharmacy/dashboard',
  },
  {
    roleId: 'billing', roleName: 'Billing Staff',
    roleDesc: 'Billing, payments and insurance',
    icon: '💳', color: '#14B8A6',
    email: 'billing@hospital.demo', password: 'Billing@123',
    name: 'Sunita Verma', avatar: 'SV',
    dept: 'Accounts & Billing', empId: 'EMP-007',
    dashboardPath: '/billing/dashboard',
  },
  {
    roleId: 'records', roleName: 'Medical Records Staff',
    roleDesc: 'Medical records and document control',
    icon: '📋', color: '#64748B',
    email: 'records@hospital.demo', password: 'Records@123',
    name: 'Lakshmi Nair', avatar: 'LN',
    dept: 'Medical Records', empId: 'EMP-008',
    dashboardPath: '/records/dashboard',
  },
  {
    roleId: 'emergency', roleName: 'Emergency Staff',
    roleDesc: 'Emergency cases and triage coordination',
    icon: '🚨', color: '#EF4444',
    email: 'emergency@hospital.demo', password: 'Emergency@123',
    name: 'Arjun Singh', avatar: 'AS',
    dept: 'Emergency', empId: 'EMP-009',
    dashboardPath: '/emergency/dashboard',
  },
  {
    roleId: 'hr', roleName: 'HR Manager',
    roleDesc: 'Staff, shifts and workforce management',
    icon: '👥', color: '#F97316',
    email: 'hr@hospital.demo', password: 'HR@123',
    name: 'Divya Menon', avatar: 'DM',
    dept: 'Human Resources', empId: 'EMP-010',
    dashboardPath: '/hr/dashboard',
  },
];

export const ROLE_ROUTES = {
  admin: '/admin/dashboard', doctor: '/doctor/dashboard',
  nurse: '/nurse/dashboard', receptionist: '/receptionist/dashboard',
  reception: '/receptionist/dashboard',
  lab: '/lab/dashboard', pharmacy: '/pharmacy/dashboard',
  billing: '/billing/dashboard', records: '/records/dashboard',
  emergency: '/emergency/dashboard', hr: '/hr/dashboard',
};

export const ACCOUNTS = DEMO_ACCOUNTS.reduce((acc, a) => {
  acc[a.roleId] = a;
  return acc;
}, {});
