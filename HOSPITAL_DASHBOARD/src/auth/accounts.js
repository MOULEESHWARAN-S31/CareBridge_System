// ============================================================
// DEMO ACCOUNTS — single source of truth for Hospital Dashboard
// Matches CareBridge Development Seed Accounts & Role Specifications
// ============================================================
export const DEMO_ACCOUNTS = [
  {
    roleId: 'admin', roleName: 'Hospital Administrator',
    roleDesc: 'Complete hospital-wide management, departments, and operations',
    icon: '🏥', color: '#6366F1',
    email: 'hospital.admin@carebridge.local', password: 'Hospital@123',
    name: 'Dr. Rajesh Kumar', avatar: 'RK',
    dept: 'Hospital Administration', empId: 'CB-HADM-001',
    dashboardPath: '/admin/dashboard',
  },
  {
    roleId: 'doctor', roleName: 'Doctor',
    roleDesc: 'Clinical care, consultations, prescriptions, and diagnostics',
    icon: '👨‍⚕️', color: '#0EA5E9',
    email: 'doctor@carebridge.local', password: 'Doctor@123',
    name: 'Dr. Priya Sharma', avatar: 'PS',
    dept: 'General Medicine', empId: 'CB-DOC-001',
    dashboardPath: '/doctor/dashboard',
  },
  {
    roleId: 'nurse', roleName: 'Nurse',
    roleDesc: 'Patient monitoring, vitals, medication schedules, and ward care',
    icon: '👩‍⚕️', color: '#10B981',
    email: 'nurse@carebridge.local', password: 'Nurse@123',
    name: 'Anitha Ravi', avatar: 'AR',
    dept: 'Inpatient & Wards', empId: 'CB-NUR-001',
    dashboardPath: '/nurse/dashboard',
  },
  {
    roleId: 'receptionist', roleName: 'Receptionist',
    roleDesc: 'Patient registration, OP cards, appointments, and front desk',
    icon: '💼', color: '#F59E0B',
    email: 'receptionist@carebridge.local', password: 'Reception@123',
    name: 'Meena Krishnan', avatar: 'MK',
    dept: 'Front Desk & Reception', empId: 'CB-REC-001',
    dashboardPath: '/receptionist/dashboard',
  },
  {
    roleId: 'lab', roleName: 'Laboratory Staff',
    roleDesc: 'Diagnostic tests, specimen collection, results, and pathology',
    icon: '🔬', color: '#8B5CF6',
    email: 'lab@carebridge.local', password: 'Lab@123',
    name: 'Ravi Shankar', avatar: 'RS',
    dept: 'Diagnostics & Pathology', empId: 'CB-LAB-001',
    dashboardPath: '/lab/dashboard',
  },
  {
    roleId: 'pharmacy', roleName: 'Pharmacist',
    roleDesc: 'Medicine inventory, dispensing, low-stock reorders, and expiry',
    icon: '💊', color: '#EC4899',
    email: 'pharmacist@carebridge.local', password: 'Pharmacy@123',
    name: 'Kumar Pillai', avatar: 'KP',
    dept: 'Pharmacy & Dispensary', empId: 'CB-PHM-001',
    dashboardPath: '/pharmacy/dashboard',
  },
  {
    roleId: 'billing', roleName: 'Billing Staff',
    roleDesc: 'Invoices, payment receipts, insurance claims, and finance',
    icon: '💳', color: '#14B8A6',
    email: 'billing@carebridge.local', password: 'Billing@123',
    name: 'Sunita Verma', avatar: 'SV',
    dept: 'Accounts & Billing', empId: 'CB-BIL-001',
    dashboardPath: '/billing/dashboard',
  },
  {
    roleId: 'records', roleName: 'Medical Records Staff',
    roleDesc: 'Digital health records, documents, consent, and audit logs',
    icon: '📋', color: '#64748B',
    email: 'records@carebridge.local', password: 'Records@123',
    name: 'Lakshmi Nair', avatar: 'LN',
    dept: 'Medical Records & EHR', empId: 'CB-REC-002',
    dashboardPath: '/records/dashboard',
  },
  {
    roleId: 'emergency', roleName: 'Emergency Staff',
    roleDesc: 'Trauma triage, resuscitation, ambulances, and acute care',
    icon: '🚨', color: '#EF4444',
    email: 'emergency@carebridge.local', password: 'Emergency@123',
    name: 'Arjun Singh', avatar: 'AS',
    dept: 'Emergency & Casualty', empId: 'CB-EMG-001',
    dashboardPath: '/emergency/dashboard',
  },
  {
    roleId: 'hr', roleName: 'HR Manager',
    roleDesc: 'Hospital workforce, shift rosters, employee directory, and duty',
    icon: '👥', color: '#F97316',
    email: 'hr@carebridge.local', password: 'HR@123',
    name: 'Divya Menon', avatar: 'DM',
    dept: 'Human Resources', empId: 'CB-HR-001',
    dashboardPath: '/hr/dashboard',
  },
];

export const ROLE_ROUTES = {
  // Uppercase standard backend roles
  HOSPITAL_ADMIN: '/admin/dashboard',
  DOCTOR: '/doctor/dashboard',
  NURSE: '/nurse/dashboard',
  RECEPTIONIST: '/receptionist/dashboard',
  LAB_STAFF: '/lab/dashboard',
  PHARMACIST: '/pharmacy/dashboard',
  BILLING_STAFF: '/billing/dashboard',
  RECORDS_STAFF: '/records/dashboard',
  EMERGENCY_STAFF: '/emergency/dashboard',
  HR_MANAGER: '/hr/dashboard',

  // Lowercase & alias mappings
  admin: '/admin/dashboard',
  hospital_admin: '/admin/dashboard',
  doctor: '/doctor/dashboard',
  nurse: '/nurse/dashboard',
  receptionist: '/receptionist/dashboard',
  reception: '/receptionist/dashboard',
  lab: '/lab/dashboard',
  lab_staff: '/lab/dashboard',
  pharmacy: '/pharmacy/dashboard',
  pharmacist: '/pharmacy/dashboard',
  billing: '/billing/dashboard',
  billing_staff: '/billing/dashboard',
  records: '/records/dashboard',
  records_staff: '/records/dashboard',
  emergency: '/emergency/dashboard',
  emergency_staff: '/emergency/dashboard',
  hr: '/hr/dashboard',
  hr_manager: '/hr/dashboard',
};

export const ACCOUNTS = DEMO_ACCOUNTS.reduce((acc, a) => {
  // Direct lowercase roleId
  acc[a.roleId] = a;

  // By email
  if (a.email) {
    acc[a.email.toLowerCase()] = a;
  }

  // By empId
  if (a.empId) {
    acc[a.empId] = a;
  }

  // Common aliases & uppercase variants
  if (a.roleId === 'admin') {
    acc['hospital_admin'] = a;
    acc['HOSPITAL_ADMIN'] = a;
    acc['ADMIN'] = a;
  }
  if (a.roleId === 'doctor') {
    acc['DOCTOR'] = a;
  }
  if (a.roleId === 'nurse') {
    acc['NURSE'] = a;
  }
  if (a.roleId === 'receptionist') {
    acc['reception'] = a;
    acc['RECEPTIONIST'] = a;
    acc['RECEPTION'] = a;
  }
  if (a.roleId === 'pharmacy') {
    acc['pharmacist'] = a;
    acc['PHARMACY'] = a;
    acc['PHARMACIST'] = a;
  }
  if (a.roleId === 'lab') {
    acc['lab_staff'] = a;
    acc['LAB'] = a;
    acc['LAB_STAFF'] = a;
  }
  if (a.roleId === 'billing') {
    acc['billing_staff'] = a;
    acc['BILLING'] = a;
    acc['BILLING_STAFF'] = a;
  }
  if (a.roleId === 'records') {
    acc['records_staff'] = a;
    acc['RECORDS'] = a;
    acc['RECORDS_STAFF'] = a;
  }
  if (a.roleId === 'emergency') {
    acc['emergency_staff'] = a;
    acc['EMERGENCY'] = a;
    acc['EMERGENCY_STAFF'] = a;
  }
  if (a.roleId === 'hr') {
    acc['hr_manager'] = a;
    acc['HR'] = a;
    acc['HR_MANAGER'] = a;
  }
  return acc;
}, {});
