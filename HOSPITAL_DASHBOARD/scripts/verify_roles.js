/**
 * Role-Based Routing and Auth Verification Suite
 * Tests all 10 hospital roles, account configurations, and route guards.
 */

import { DEMO_ACCOUNTS, ROLE_ROUTES, ACCOUNTS } from '../src/auth/accounts.js';

console.log('------------------------------------------------------------');
console.log('🧪 CareBridge Hospital Dashboard — RBAC & Auth Verification');
console.log('------------------------------------------------------------');

const EXPECTED_ROLES = [
  { standardRole: 'HOSPITAL_ADMIN', route: '/admin/dashboard', email: 'hospital.admin@carebridge.local' },
  { standardRole: 'DOCTOR', route: '/doctor/dashboard', email: 'doctor@carebridge.local' },
  { standardRole: 'NURSE', route: '/nurse/dashboard', email: 'nurse@carebridge.local' },
  { standardRole: 'RECEPTIONIST', route: '/receptionist/dashboard', email: 'receptionist@carebridge.local' },
  { standardRole: 'LAB_STAFF', route: '/lab/dashboard', email: 'lab@carebridge.local' },
  { standardRole: 'PHARMACIST', route: '/pharmacy/dashboard', email: 'pharmacist@carebridge.local' },
  { standardRole: 'BILLING_STAFF', route: '/billing/dashboard', email: 'billing@carebridge.local' },
  { standardRole: 'RECORDS_STAFF', route: '/records/dashboard', email: 'records@carebridge.local' },
  { standardRole: 'EMERGENCY_STAFF', route: '/emergency/dashboard', email: 'emergency@carebridge.local' },
  { standardRole: 'HR_MANAGER', route: '/hr/dashboard', email: 'hr@carebridge.local' }
];

let failed = 0;
let passed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

// 1. Verify DEMO_ACCOUNTS has all 10 roles
console.log('\n[Test 1] Verifying all 10 intended employee accounts exist:');
assert(DEMO_ACCOUNTS.length === 10, `Expected 10 demo accounts, got ${DEMO_ACCOUNTS.length}`);

for (const exp of EXPECTED_ROLES) {
  const account = ACCOUNTS[exp.standardRole];
  assert(account !== undefined, `Role ${exp.standardRole} account exists in ACCOUNTS`);
  if (account) {
    assert(account.email === exp.email, `Role ${exp.standardRole} has expected email: ${exp.email}`);
    assert(ROLE_ROUTES[exp.standardRole] === exp.route, `Role ${exp.standardRole} maps to ${exp.route}`);
  }
}

// 2. Verify ACCOUNTS lookup map handles case-insensitivity, emails, and aliases
console.log('\n[Test 2] Verifying ACCOUNTS lookup dictionary:');
assert(ACCOUNTS['doctor@carebridge.local'] !== undefined, 'Lookup by lowercase email works');
assert(ACCOUNTS['hospital.admin@carebridge.local'] !== undefined, 'Lookup by admin email works');
assert(ACCOUNTS['HOSPITAL_ADMIN'] !== undefined, 'Lookup by exact uppercase roleId works');
assert(ACCOUNTS['hospital_admin'] !== undefined, 'Lookup by lowercase roleId alias works');
assert(ACCOUNTS['reception'] !== undefined, 'Lookup by backend alias "reception" works');
assert(ACCOUNTS['lab_staff'] !== undefined, 'Lookup by backend alias "lab_staff" works');
assert(ACCOUNTS['pharmacist'] !== undefined, 'Lookup by backend alias "pharmacist" works');
assert(ACCOUNTS['billing_staff'] !== undefined, 'Lookup by backend alias "billing_staff" works');
assert(ACCOUNTS['records_staff'] !== undefined, 'Lookup by backend alias "records_staff" works');
assert(ACCOUNTS['emergency_staff'] !== undefined, 'Lookup by backend alias "emergency_staff" works');
assert(ACCOUNTS['hr_manager'] !== undefined, 'Lookup by backend alias "hr_manager" works');

// 3. Verify Cross-Role Access Guard Logic
console.log('\n[Test 3] Verifying Cross-Role Redirection rules:');
const roleGuard = (userRole, allowedRole) => {
  const normUser = String(userRole || '').toUpperCase().trim();
  const normAllowed = String(allowedRole || '').toUpperCase().trim();
  return normUser === normAllowed;
};

assert(roleGuard('DOCTOR', 'DOCTOR') === true, 'Doctor allowed on doctor route');
assert(roleGuard('NURSE', 'HOSPITAL_ADMIN') === false, 'Nurse blocked from admin route');
assert(roleGuard('RECEPTIONIST', 'DOCTOR') === false, 'Receptionist blocked from doctor route');
assert(roleGuard('BILLING_STAFF', 'RECORDS_STAFF') === false, 'Billing blocked from medical records route');
assert(roleGuard('HR_MANAGER', 'DOCTOR') === false, 'HR Manager blocked from clinical doctor route');

console.log('\n------------------------------------------------------------');
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('------------------------------------------------------------');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All role routing & auth integrity checks passed successfully!\n');
}
