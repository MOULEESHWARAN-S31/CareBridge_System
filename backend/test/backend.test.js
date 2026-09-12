const http = require('http');
const app = require('../src/app');
const { isDbConnected } = require('../src/config/db');

let server;
let baseUrl;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(baseUrl + path);
    const reqOptions = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (_) { json = data; }
        resolve({ status: res.statusCode, headers: res.headers, body: json });
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`  [✗ FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`  [✓ PASS] ${message}`);
}

async function runTests() {
  console.log('====================================================');
  console.log(' CareBridge Backend & Integration Test Suite');
  console.log('====================================================');

  server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      console.log(`[TEST SERVER] Running on ${baseUrl}\n`);
      resolve();
    });
  });

  try {
    // 1. Health check
    console.log('1. Health Check Endpoint:');
    const health = await request('GET', '/health');
    assert(health.status === 200, 'GET /health returns HTTP 200');
    assert(health.body.status === 'UP', 'Health status is UP');

    // 2. Authentication: Invalid Login
    console.log('\n2. Authentication - Invalid Credentials:');
    const badLogin = await request('POST', '/api/auth/login', {
      username: 'admin@carebridge.local',
      password: 'WrongPassword123'
    });
    assert(badLogin.status === 401, 'Invalid password returns HTTP 401');
    assert(!badLogin.body.token, 'No token returned on failure');

    // 3. Authentication: Missing fields
    console.log('\n3. Authentication - Validation:');
    const emptyLogin = await request('POST', '/api/auth/login', {});
    assert(emptyLogin.status === 400, 'Empty login payload returns HTTP 400 Bad Request');

    // 4. Role Authorization: Unknown token or no token
    console.log('\n4. Protected Route - Unauthenticated Access:');
    const noAuth = await request('GET', '/api/users');
    assert(noAuth.status === 401, 'Unauthenticated request to /api/users returns HTTP 401');

    const invalidAuth = await request('GET', '/api/users', null, { Authorization: 'Bearer fake-jwt-token' });
    assert(invalidAuth.status === 401, 'Invalid token to /api/users returns HTTP 401');

    // Database-backed tests
    console.log('\n5. Database-Backed Operations (if DB connected):');
    if (!isDbConnected()) {
      console.log('  [!] Note: PostgreSQL database is not connected in this test environment.');
      console.log('  [!] Validated middleware, validation, routes, and security constraints.');
    } else {
      // 5A. ADMIN Login
      console.log('  Testing ADMIN Login:');
      const adminLogin = await request('POST', '/api/auth/login', {
        username: 'admin@carebridge.local',
        password: 'Admin@123'
      });
      assert(adminLogin.status === 200, 'ADMIN login returns HTTP 200');
      assert(adminLogin.body.token != null, 'ADMIN login returns JWT token');
      assert(adminLogin.body.user.role === 'ADMIN', 'User role is ADMIN');
      const adminToken = adminLogin.body.token;

      // 5B. GOVERNMENT Login
      console.log('  Testing GOVERNMENT Login:');
      const govLogin = await request('POST', '/api/auth/login', {
        username: 'government@carebridge.local',
        password: 'Gov@123'
      });
      assert(govLogin.status === 200, 'GOVERNMENT login returns HTTP 200');
      assert(govLogin.body.user.role === 'GOVERNMENT', 'User role is GOVERNMENT');
      const govToken = govLogin.body.token;

      // 5C. Role Enforcement (GOVERNMENT cannot access ADMIN-only /api/users)
      console.log('  Testing Role Enforcement (403 Forbidden):');
      const forbiddenUserAccess = await request('GET', '/api/users', null, {
        Authorization: `Bearer ${govToken}`
      });
      assert(forbiddenUserAccess.status === 403, 'GOVERNMENT user accessing /api/users returns HTTP 403 Forbidden');

      // 5D. Admin CAN access /api/users
      const adminUserAccess = await request('GET', '/api/users', null, {
        Authorization: `Bearer ${adminToken}`
      });
      assert(adminUserAccess.status === 200, 'ADMIN user accessing /api/users returns HTTP 200 OK');
      assert(Array.isArray(adminUserAccess.body), '/api/users returns array of users');

      // 5E. Mandatory ABHA Scenarios
      console.log('  Testing Mandatory ABHA Scenarios:');
      const abha0 = await request('GET', '/api/abha/profiles?mobileNumber=9876500000');
      assert(abha0.status === 200 && abha0.body.length === 0, 'Scenario 9876500000 returns 0 profiles');

      const abha1 = await request('GET', '/api/abha/profiles?mobileNumber=9876500001');
      assert(abha1.status === 200 && abha1.body.length === 1, 'Scenario 9876500001 returns 1 profile (Ramesh Kumar)');

      const abha2 = await request('GET', '/api/abha/profiles?mobileNumber=9876500002');
      assert(abha2.status === 200 && abha2.body.length === 2, 'Scenario 9876500002 returns 2 profiles');

      const abha3 = await request('GET', '/api/abha/profiles?mobileNumber=9876500003');
      assert(abha3.status === 200 && abha3.body.length === 3, 'Scenario 9876500003 returns 3 profiles');

      const abha4 = await request('GET', '/api/abha/profiles?mobileNumber=9876500004');
      assert(abha4.status === 200 && abha4.body.length === 4, 'Scenario 9876500004 returns 4 profiles');

      const abhaDemo = await request('GET', '/api/abha/profiles?mobileNumber=9876543210');
      assert(abhaDemo.status === 200 && abhaDemo.body.length === 2, 'Scenario 9876543210 returns 2 profiles');

      // 5F. Hospital CRUD & Cross-Module Visibility
      console.log('  Testing Hospital CRUD & Cross-Module flow:');
      const newHosp = await request('POST', '/api/hospitals', {
        name: 'Test GH Salem North',
        type: 'Hospital',
        district: 'Salem',
        city: 'Salem City',
        address: 'North Main Road, Salem 636004',
        contactPhone: '+91 427 250 9999'
      }, { Authorization: `Bearer ${adminToken}` });
      assert(newHosp.status === 201, 'Admin created hospital returns HTTP 201');
      const createdHospId = newHosp.body.hospital.hospital_id;

      // Check Government/CareBridge can discover it
      const listHosp = await request('GET', `/api/hospitals?search=North`);
      assert(listHosp.status === 200, 'Public /api/hospitals returns HTTP 200');
      assert(listHosp.body.some(h => h.hospital_id === createdHospId), 'Created hospital appears in discovery');

      // 5G. Appointment Creation Transaction
      console.log('  Testing Appointment Creation:');
      const newAppt = await request('POST', '/api/appointments', {
        patientProfileId: '12-3456-7890-1001',
        hospitalId: createdHospId,
        appointmentDate: new Date().toISOString().split('T')[0],
        slotTime: '02:00 PM - 02:30 PM',
        notes: 'Integration test appointment'
      });
      assert(newAppt.status === 201, 'Appointment creation returns HTTP 201');
      assert(newAppt.body.appointment.appointment_id.startsWith('APT-'), 'Appointment ID generated correctly');

      // 5H. Medical Store CRUD
      console.log('  Testing Medical Store CRUD:');
      const newStore = await request('POST', '/api/medical-stores', {
        name: 'Test Salem MedPlus',
        address: 'Town Hall Road, Salem',
        district: 'Salem',
        city: 'Salem City',
        contactPhone: '+91 427 222 3344'
      }, { Authorization: `Bearer ${adminToken}` });
      assert(newStore.status === 201, 'Medical store creation returns HTTP 201');

      // 5I. Medicine Order without prescription mutation
      console.log('  Testing Medicine Order:');
      const newOrder = await request('POST', '/api/medicine-orders', {
        patientProfileId: '12-3456-7890-1001',
        prescriptionId: 'RX-2026-001',
        storeId: 'med_slm_01',
        items: [
          { name: 'Paracetamol 650mg', quantity: 10, price: 20.00 }
        ]
      });
      assert(newOrder.status === 201, 'Medicine order placed returns HTTP 201');
      assert(newOrder.body.order.order_id.startsWith('CB-MED-'), 'Order ID generated with CB-MED- prefix');

      // 5J. Hospital Roles Authentication & Authorization Suite
      console.log('\n  Testing Hospital Roles Authentication (All 10 Roles):');
      const hospitalRolesToTest = [
        { username: 'hospital.admin@carebridge.local', password: 'Hospital@123', expectedRole: 'HOSPITAL_ADMIN' },
        { username: 'doctor@carebridge.local', password: 'Doctor@123', expectedRole: 'DOCTOR' },
        { username: 'nurse@carebridge.local', password: 'Nurse@123', expectedRole: 'NURSE' },
        { username: 'reception@carebridge.local', password: 'Reception@123', expectedRole: 'RECEPTIONIST' },
        { username: 'lab@carebridge.local', password: 'Lab@123', expectedRole: 'LAB_STAFF' },
        { username: 'pharmacy@carebridge.local', password: 'Pharmacy@123', expectedRole: 'PHARMACIST' },
        { username: 'billing@carebridge.local', password: 'Billing@123', expectedRole: 'BILLING_STAFF' },
        { username: 'records@carebridge.local', password: 'Records@123', expectedRole: 'RECORDS_STAFF' },
        { username: 'emergency@carebridge.local', password: 'Emergency@123', expectedRole: 'EMERGENCY_STAFF' },
        { username: 'hr@carebridge.local', password: 'HR@123', expectedRole: 'HR_MANAGER' },
      ];

      let doctorToken = null;
      for (const t of hospitalRolesToTest) {
        const res = await request('POST', '/api/auth/login', {
          username: t.username,
          password: t.password
        });
        assert(res.status === 200, `${t.expectedRole} login returns HTTP 200`);
        assert(res.body.token != null, `${t.expectedRole} login returns JWT token`);
        assert(res.body.user.role === t.expectedRole, `User role is ${t.expectedRole}`);
        assert(res.body.user.hospitalId === 'GDH-SALEM-01', `${t.expectedRole} hospitalId is GDH-SALEM-01`);
        if (t.expectedRole === 'DOCTOR') {
          doctorToken = res.body.token;
        }
      }

      // 5K. Cross-Role Backend Authorization Check (Hospital DOCTOR cannot access /api/users)
      console.log('  Testing Hospital Role Cross-Access Enforcement (403 Forbidden):');
      const docForbidden = await request('GET', '/api/users', null, {
        Authorization: `Bearer ${doctorToken}`
      });
      assert(docForbidden.status === 403, 'DOCTOR user accessing /api/users returns HTTP 403 Forbidden');

      // 5L. Hospital Clinical Endpoints Tests
      console.log('  Testing Hospital Clinical Operations Endpoints:');
      const hospOverview = await request('GET', '/api/hospital/overview?hospitalId=GDH-SALEM-01');
      assert(hospOverview.status === 200, 'GET /api/hospital/overview returns HTTP 200');
      assert(hospOverview.body.beds != null, 'Hospital overview contains beds data');

      const hospBeds = await request('GET', '/api/hospital/beds?hospitalId=GDH-SALEM-01');
      assert(hospBeds.status === 200, 'GET /api/hospital/beds returns HTTP 200');
      assert(Array.isArray(hospBeds.body.wards), 'Hospital beds returns wards array');

      const patientSearch = await request('GET', '/api/hospital/patients/search?query=Ramesh');
      assert(patientSearch.status === 200, 'GET /api/hospital/patients/search returns HTTP 200');
      assert(patientSearch.body.length >= 1, 'Patient search returns matching ABHA profile');

      const bedUpdate = await request('PUT', '/api/hospital/beds', {
        hospitalId: 'GDH-SALEM-01',
        generalBedsAvailable: 65,
        icuBedsAvailable: 9
      }, { Authorization: `Bearer ${doctorToken}` });
      assert(bedUpdate.status === 200, 'PUT /api/hospital/beds authorized returns HTTP 200');
    }

    console.log('\n====================================================');
    console.log(`[✓ ALL TESTS PASSED] (${passedTests}/${totalTests} tests successful)`);
    console.log('====================================================');
  } finally {
    server.close();
  }
}

runTests().catch(err => {
  console.error('\n[✗ TEST SUITE FAILED]', err);
  if (server) server.close();
  process.exit(1);
});
