/**
 * CareBridge Admin Dashboard — Central Reactive State Store
 * Manages master data collections, CRUD operations, filters, audit events, and notifications.
 */

import { 
  DISTRICTS_DATA, 
  ROLES_LIST, 
  ORGANIZATION_TYPES, 
  INITIAL_HOSPITALS, 
  INITIAL_MEDICAL_STORES, 
  INITIAL_USERS, 
  INITIAL_AUDIT_LOGS,
  ROLE_PERMISSIONS_CONFIG 
} from '../data/masterData.js';

class AdminStore {
  constructor() {
    this.districts = [...DISTRICTS_DATA];
    this.roles = [...ROLES_LIST];
    this.organizationTypes = [...ORGANIZATION_TYPES];
    this.hospitals = [...INITIAL_HOSPITALS];
    this.medicalStores = [...INITIAL_MEDICAL_STORES];
    this.users = [...INITIAL_USERS];
    this.auditLogs = [...INITIAL_AUDIT_LOGS];
    this.rolePermissions = JSON.parse(JSON.stringify(ROLE_PERMISSIONS_CONFIG));
    this.departments = [
      { id: 'DEP-001', name: 'Cardiology', block: 'Block A, 3rd Floor', head: 'Dr. Ramesh Sundaram', ext: '3101', status: 'Active' },
      { id: 'DEP-002', name: 'Neurology', block: 'Block B, 2nd Floor', head: 'Dr. Priya Balaji', ext: '3102', status: 'Active' },
      { id: 'DEP-003', name: 'Pediatrics', block: 'Block C, 1st Floor', head: 'Dr. Anand Kumar', ext: '3103', status: 'Active' },
      { id: 'DEP-004', name: 'Orthopedics', block: 'Block A, Ground Floor', head: 'Dr. S. Karthikeyan', ext: '3104', status: 'Active' },
      { id: 'DEP-005', name: 'Emergency & Trauma', block: 'Emergency Wing', head: 'Dr. Meenakshi Raman', ext: '3100', status: 'Active' },
      { id: 'DEP-006', name: 'General Medicine', block: 'Block B, 1st Floor', head: 'Dr. V. Natarajan', ext: '3106', status: 'Active' },
      { id: 'DEP-007', name: 'Radiology', block: 'Basement Wing', head: 'Dr. Divya Krishnan', ext: '3107', status: 'Active' },
      { id: 'DEP-008', name: 'Pharmacy', block: 'Main Concourse', head: 'S. Shanmugam', ext: '3108', status: 'Active' }
    ];
    this.medicines = [];
    this.patients = [];
    this.appointments = [];

    // Active UI navigation
    this.activeSection = 'users'; // 'users' | 'hospitals' | 'stores' | 'roles' | 'audit' | 'bulk-import'
    this.activeSubFilter = 'all';  // 'all' | 'active' | 'inactive' | 'pending' | 'roles' | etc.
    this.searchQuery = '';
    
    // Modals and Drawers
    this.activeModal = null; // null | 'create-user' | 'password-reset' | 'add-hospital' | 'add-store'
    this.modalPayload = null;
    this.activeDrawer = null; // null | 'user-profile' | 'hospital-profile' | 'store-profile'
    this.drawerPayload = null;

    // Active session user
    this.currentUser = this.users[0];

    // Toast notification
    this.toast = null;

    // Feature-level offline mock data indicator
    this.isOfflineMockData = false;

    this.listeners = new Set();
  }

  setCurrentUser(user) {
    this.currentUser = user;
    this.notify();
  }

  logout() {
    this.currentUser = null;
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this);
      } catch (err) {
        console.error('Store notification error:', err);
      }
    });
  }

  showToast(message, type = 'success') {
    this.toast = { message, type, timestamp: Date.now() };
    this.notify();
    setTimeout(() => {
      if (this.toast && Date.now() - this.toast.timestamp >= 3800) {
        this.toast = null;
        this.notify();
      }
    }, 4000);
  }

  /**
   * Synchronize master datasets with unified backend REST API (Node.js + PostgreSQL)
   */
  async initFromBackend() {
    const token = localStorage.getItem('cb_auth_token') || sessionStorage.getItem('cb_auth_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      // 1. Fetch live facilities from PostgreSQL
      const facRes = await fetch('http://localhost:5000/api/facilities');
      if (facRes.ok) {
        const facData = await facRes.json();
        if (Array.isArray(facData) && facData.length > 0) {
          const mapped = facData.map((f, i) => ({
            id: `hosp-${f.id || i}`,
            hospitalId: f.hospital_id || `HOSP-${(f.district || 'SLM').substring(0,3).toUpperCase()}-${String(f.id || i).padStart(3, '0')}`,
            name: f.name,
            shortName: f.name,
            type: f.type || 'District Hospital',
            ownership: 'Government',
            registrationNumber: `TN-MED-${f.id || i}`,
            state: 'Tamil Nadu',
            district: f.district || 'Salem',
            taluk: f.district || 'Salem',
            cityVillage: f.city || f.district || 'Salem',
            address: f.address || `${f.name}, ${f.district || 'Salem'}`,
            pinCode: '636001',
            latitude: parseFloat(f.latitude) || 11.6643,
            longitude: parseFloat(f.longitude) || 78.1460,
            phone: f.contact_phone || f.contact_number || '+91 427 2415121',
            email: 'hospital@carebridge.local',
            capacity: {
              totalBeds: f.general_beds_total || f.total_beds || 100,
              occupiedBeds: Math.max(0, (f.general_beds_total || f.total_beds || 100) - (f.general_beds_available || f.available_beds || 20)),
              availableBeds: f.general_beds_available || f.available_beds || 20,
              icuBeds: f.icu_beds_total || 10,
              emergencyBeds: 10,
              generalBeds: f.general_beds_total || 80
            },
            status: f.status === 'Operational' ? 'Active' : (f.status || 'Active'),
            createdDate: f.created_at ? f.created_at.split('T')[0] : '2026-09-01'
          }));
          this.hospitals = mapped;
        }
      }

      // 2. Fetch live medical stores from PostgreSQL
      const storeRes = await fetch('http://localhost:5000/api/medical-stores');
      if (storeRes.ok) {
        const storeData = await storeRes.json();
        if (Array.isArray(storeData) && storeData.length > 0) {
          const mappedStores = storeData.map((s, i) => ({
            id: `store-${s.id || i}`,
            storeId: `STR-${(s.district || 'SLM').substring(0,3).toUpperCase()}-${String(s.id || i).padStart(3, '0')}`,
            name: s.name,
            type: s.type || 'Community Pharmacy',
            district: s.district || 'Salem',
            taluk: s.district || 'Salem',
            address: s.address || `${s.name}, ${s.district || 'Salem'}`,
            licenseNumber: s.license_number || `TN-DL-${s.id || i}`,
            contactPerson: s.contact_person || 'Store Manager',
            phone: s.phone || '9876543210',
            email: s.email || 'store@carebridge.local',
            status: s.status === 'Operational' ? 'Active' : (s.status || 'Active'),
            createdDate: s.created_at ? s.created_at.split('T')[0] : '2026-09-01'
          }));
          this.medicalStores = mappedStores;
        }
      }

      // 3. Fetch live users from PostgreSQL if token is available
      if (token) {
        const userRes = await fetch('http://localhost:5000/api/users', { headers });
        if (userRes.ok) {
          const userData = await userRes.json();
          if (Array.isArray(userData) && userData.length > 0) {
            const mappedUsers = userData.map((u, i) => ({
              id: `usr-${u.id || i}`,
              userId: u.employee_id || `CB-USR-${u.id}`,
              employeeId: u.employee_id || `EMP-${u.id}`,
              fullName: u.full_name || u.username,
              role: u.role_name === 'ADMIN' ? 'Government Administrator' : (u.role_name === 'GOVERNMENT' ? 'District Administrator' : 'Doctor'),
              email: u.email || `${u.username}@carebridge.local`,
              district: u.district || 'Salem',
              status: u.is_active ? 'Active' : 'Inactive',
              createdDate: u.created_at ? u.created_at.split('T')[0] : '2026-09-01',
              lastLogin: 'Recently'
            }));
            this.users = mappedUsers;
          }
        }
      }

      this.isOfflineMockData = false;
      this.notify();
    } catch (err) {
      console.warn('Backend API synchronization failed, using local masterData fallback:', err);
      this.isOfflineMockData = true;
      this.notify();
    }
  }

  // Navigation
  setNavigation(section, subFilter = 'all') {
    this.activeSection = section;
    this.activeSubFilter = subFilter;
    this.searchQuery = '';
    this.notify();
  }

  setSearchQuery(q) {
    this.searchQuery = q || '';
    this.notify();
  }

  openModal(modalName, payload = null) {
    this.activeModal = modalName;
    this.modalPayload = payload;
    this.notify();
  }

  closeModal() {
    this.activeModal = null;
    this.modalPayload = null;
    this.notify();
  }

  openDrawer(drawerType, payload) {
    this.activeDrawer = drawerType;
    this.drawerPayload = payload;
    this.notify();
  }

  closeDrawer() {
    this.activeDrawer = null;
    this.drawerPayload = null;
    this.notify();
  }

  // Audit Logging
  logAudit(action, module, recordId, details, result = 'SUCCESS') {
    const entry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      adminId: 'ADMIN-001',
      adminName: 'Master Healthcare Admin',
      action,
      module,
      recordId,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      result
    };
    this.auditLogs.unshift(entry);
  }

  // Summary Metrics
  getSummaryStats() {
    const userOffset = 2845 - INITIAL_USERS.length;
    const hospOffset = 342 - INITIAL_HOSPITALS.length;
    const storeOffset = 1284 - INITIAL_MEDICAL_STORES.length;

    const totalUsers = this.users.length + userOffset;
    const activeUsers = this.users.filter(u => u.status === 'Active').length + (2716 - INITIAL_USERS.filter(u => u.status === 'Active').length);
    const totalHospitals = this.hospitals.length + hospOffset;
    const activeHospitals = this.hospitals.filter(h => h.status === 'Active').length + (328 - INITIAL_HOSPITALS.filter(h => h.status === 'Active').length);
    const totalStores = this.medicalStores.length + storeOffset;
    const activeStores = this.medicalStores.filter(s => s.status === 'Active').length + (1245 - INITIAL_MEDICAL_STORES.filter(s => s.status === 'Active').length);

    const pendingUsers = this.users.filter(u => u.status === 'Pending').length;
    const inactiveUsers = this.users.filter(u => u.status === 'Inactive' || u.status === 'Suspended').length;
    const pendingHospitals = this.hospitals.filter(h => h.status === 'Pending Verification').length;
    const pendingStores = this.medicalStores.filter(s => s.status === 'Pending Verification').length;

    return {
      totalUsers,
      activeUsers,
      totalHospitals,
      activeHospitals,
      totalStores,
      activeStores,
      pendingUsers,
      inactiveUsers,
      pendingHospitals,
      pendingStores
    };
  }

  // User Management
  generateUserId(role) {
    const codeMap = {
      'Doctor': 'CB-DOC',
      'Nurse': 'CB-NUR',
      'Pharmacist': 'CB-PHM',
      'Hospital Administrator': 'CB-ADM',
      'Medical Store Staff': 'CB-STR',
      'Lab Technician': 'CB-LAB',
      'Reception Staff': 'CB-REC',
      'Health Worker': 'CB-HW',
      'District Administrator': 'CB-DST',
      'Government Administrator': 'CB-GOV'
    };
    const prefix = codeMap[role] || 'CB-HOS';
    const randNum = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${randNum}`;
  }

  generateTemporaryPassword() {
    const uppers = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowers = 'abcdefghjkmnpqrstuvwxyz';
    const numbers = '23456789';
    const specials = '@#$%&*';
    
    let pwd = '';
    pwd += uppers[Math.floor(Math.random() * uppers.length)];
    pwd += lowers[Math.floor(Math.random() * lowers.length)];
    pwd += numbers[Math.floor(Math.random() * numbers.length)];
    pwd += specials[Math.floor(Math.random() * specials.length)];
    
    const all = uppers + lowers + numbers + specials;
    for (let i = 0; i < 6; i++) {
      pwd += all[Math.floor(Math.random() * all.length)];
    }
    return pwd;
  }

  checkPasswordStrength(password) {
    if (!password) return { score: 0, label: 'None', isValid: false, issues: ['Password is required'] };
    
    const issues = [];
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const hasLength = password.length >= 8;

    if (!hasLength) issues.push('Minimum 8 characters required');
    if (!hasUpper) issues.push('At least one uppercase letter (A-Z)');
    if (!hasLower) issues.push('At least one lowercase letter (a-z)');
    if (!hasNumber) issues.push('At least one number (0-9)');
    if (!hasSpecial) issues.push('At least one special character (@, #, $, etc.)');

    let score = 0;
    if (hasLength) score += 20;
    if (hasUpper) score += 20;
    if (hasLower) score += 20;
    if (hasNumber) score += 20;
    if (hasSpecial) score += 20;

    let label = 'Weak';
    if (score >= 100) label = 'Strong';
    else if (score >= 60) label = 'Moderate';

    return {
      score,
      label,
      isValid: issues.length === 0,
      issues
    };
  }

  createUser(userData) {
    const newUser = {
      id: `usr-${Date.now()}`,
      userId: userData.userId.trim(),
      employeeId: userData.employeeId.trim(),
      fullName: userData.fullName.trim(),
      role: userData.role,
      mobileNumber: (userData.mobileNumber || '').trim(),
      email: userData.email.trim().toLowerCase(),
      orgType: userData.orgType,
      assignedOrgId: userData.assignedOrgId || '',
      assignedOrgName: userData.assignedOrgName || '',
      district: userData.district || 'Salem',
      status: userData.status || 'Active',
      createdDate: new Date().toISOString().split('T')[0],
      lastLogin: 'Never',
      failedAttempts: 0,
      passwordLastChanged: new Date().toISOString().split('T')[0],
      forcePasswordChange: userData.forcePasswordChange || false
    };

    this.users.unshift(newUser);
    this.logAudit('CREATE_USER', 'User Management', newUser.userId, `Created user account for ${newUser.fullName} (${newUser.role})`);
    this.showToast(`User ${newUser.userId} created successfully.`);
    this.notify();

    // Asynchronous backend persistence to PostgreSQL
    const token = localStorage.getItem('cb_auth_token') || sessionStorage.getItem('cb_auth_token');
    if (token) {
      let targetRole = 'GOVERNMENT';
      const roleUpper = (userData.role || '').toUpperCase();
      if (roleUpper.includes('ADMIN')) targetRole = 'ADMIN';
      else if (roleUpper.includes('DOCTOR')) targetRole = 'DOCTOR';
      else if (roleUpper.includes('STORE') || roleUpper.includes('PHARMAC')) targetRole = 'MEDICAL_STORE';

      const payload = {
        name: userData.fullName.trim(),
        username: (userData.userId || userData.employeeId || userData.email).trim().toLowerCase().replace(/[^a-z0-9]/g, '_'),
        email: userData.email.trim().toLowerCase(),
        employeeId: userData.employeeId.trim(),
        password: userData.password || 'Admin@123',
        role: targetRole,
        district: userData.district || 'Salem',
        isActive: (userData.status || 'Active') === 'Active'
      };

      fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.warn('Backend user creation response not ok:', err.error || res.statusText);
        }
      })
      .catch((err) => {
        console.warn('Backend user creation network error:', err);
      });
    }

    return newUser;
  }

  toggleUserStatus(userId) {
    const user = this.users.find(u => u.userId === userId || u.id === userId);
    if (!user) return;

    const oldStatus = user.status;
    user.status = (oldStatus === 'Active') ? 'Inactive' : 'Active';

    const action = user.status === 'Active' ? 'ACTIVATE_USER' : 'DEACTIVATE_USER';
    this.logAudit(action, 'User Management', user.userId, `Changed status from ${oldStatus} to ${user.status}`);
    this.showToast(`User ${user.userId} is now ${user.status}.`, user.status === 'Active' ? 'success' : 'warning');
    this.notify();
  }

  resetUserPassword(userId, { temporaryPassword, forceChange = true }) {
    const user = this.users.find(u => u.userId === userId || u.id === userId);
    if (!user) return;

    user.passwordLastChanged = new Date().toISOString().split('T')[0];
    user.forcePasswordChange = forceChange;
    user.failedAttempts = 0;

    this.logAudit('RESET_PASSWORD', 'User Management', user.userId, `Admin generated temporary password reset. Force change on login: ${forceChange}`);
    this.showToast(`Password for ${user.userId} has been reset.`);
    this.notify();
    return { success: true, temporaryPassword };
  }

  // Hospital Management
  addHospital(hospitalData) {
    const newHospital = {
      id: `hosp-${Date.now()}`,
      hospitalId: hospitalData.hospitalId.trim().toUpperCase(),
      name: hospitalData.name.trim(),
      shortName: hospitalData.shortName || hospitalData.name.trim(),
      type: hospitalData.type,
      ownership: hospitalData.ownership || 'Government',
      registrationNumber: hospitalData.registrationNumber.trim(),
      state: hospitalData.state || 'Tamil Nadu',
      district: hospitalData.district || 'Salem',
      taluk: hospitalData.taluk || 'Salem',
      cityVillage: hospitalData.cityVillage.trim(),
      address: hospitalData.address.trim(),
      pinCode: hospitalData.pinCode.trim(),
      latitude: parseFloat(hospitalData.latitude) || 11.6643,
      longitude: parseFloat(hospitalData.longitude) || 78.1460,
      phone: hospitalData.phone.trim(),
      email: hospitalData.email.trim(),
      emergencyContact: hospitalData.emergencyContact?.trim() || '108',
      capacity: {
        totalBeds: parseInt(hospitalData.totalBeds, 10) || 100,
        occupiedBeds: 0,
        availableBeds: parseInt(hospitalData.totalBeds, 10) || 100,
        icuBeds: parseInt(hospitalData.icuBeds, 10) || 10,
        emergencyBeds: parseInt(hospitalData.emergencyBeds, 10) || 10,
        generalBeds: parseInt(hospitalData.generalBeds, 10) || 80
      },
      services: hospitalData.services || ['OPD', 'Emergency', 'Pharmacy'],
      status: hospitalData.status || 'Pending Verification',
      assignedAdminId: hospitalData.assignedAdminId || null,
      assignedAdminName: hospitalData.assignedAdminName || 'Unassigned',
      createdDate: new Date().toISOString().split('T')[0]
    };

    this.hospitals.unshift(newHospital);
    this.logAudit('ADD_HOSPITAL', 'Hospital Management', newHospital.hospitalId, `Added facility: ${newHospital.name} (${newHospital.type})`);
    this.showToast(`Hospital ${newHospital.hospitalId} added successfully.`);
    this.notify();

    // Asynchronous backend persistence to PostgreSQL
    const token = localStorage.getItem('cb_auth_token') || sessionStorage.getItem('cb_auth_token');
    if (token) {
      const payload = {
        name: hospitalData.name.trim(),
        type: hospitalData.type || 'District Hospital',
        district: hospitalData.district || 'Salem',
        city: hospitalData.cityVillage?.trim() || hospitalData.district || 'Salem',
        address: hospitalData.address.trim(),
        contactPhone: hospitalData.phone?.trim() || '+91 427 2415121',
        latitude: parseFloat(hospitalData.latitude) || 11.6643,
        longitude: parseFloat(hospitalData.longitude) || 78.1460,
        generalBedsTotal: parseInt(hospitalData.totalBeds, 10) || 100,
        icuBedsTotal: parseInt(hospitalData.icuBeds, 10) || 10,
        is24x7: true,
        services: hospitalData.services || ['General OPD', 'Emergency', 'Pharmacy'],
        status: 'Operational'
      };

      fetch('http://localhost:5000/api/facilities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.warn('Backend hospital creation response not ok:', err.error || res.statusText);
        }
      })
      .catch((err) => {
        console.warn('Backend hospital creation network error:', err);
      });
    }

    return newHospital;
  }

  toggleHospitalStatus(hospitalId) {
    const hosp = this.hospitals.find(h => h.hospitalId === hospitalId || h.id === hospitalId);
    if (!hosp) return;

    const oldStatus = hosp.status;
    hosp.status = (oldStatus === 'Active') ? 'Inactive' : 'Active';

    const action = hosp.status === 'Active' ? 'ACTIVATE_HOSPITAL' : 'DEACTIVATE_HOSPITAL';
    this.logAudit(action, 'Hospital Management', hosp.hospitalId, `Hospital status changed from ${oldStatus} to ${hosp.status}`);
    this.showToast(`${hosp.name} is now ${hosp.status}.`, hosp.status === 'Active' ? 'success' : 'warning');
    this.notify();
  }

  verifyHospital(hospitalId, approved = true) {
    const hosp = this.hospitals.find(h => h.hospitalId === hospitalId || h.id === hospitalId);
    if (!hosp) return;

    hosp.status = approved ? 'Active' : 'Inactive';
    const action = approved ? 'APPROVE_HOSPITAL' : 'REJECT_HOSPITAL';
    this.logAudit(action, 'Hospital Management', hosp.hospitalId, `Admin verification: ${approved ? 'Approved & Activated' : 'Rejected'}`);
    this.showToast(`Hospital ${hosp.hospitalId} ${approved ? 'approved and activated' : 'rejected'}.`);
    this.notify();
  }

  // Medical Store Management
  addMedicalStore(storeData) {
    const newStore = {
      id: `store-${Date.now()}`,
      storeId: storeData.storeId.trim().toUpperCase(),
      name: storeData.name.trim(),
      shortName: storeData.shortName || storeData.name.trim(),
      type: storeData.type,
      licenseNumber: storeData.licenseNumber.trim(),
      state: storeData.state || 'Tamil Nadu',
      district: storeData.district || 'Salem',
      taluk: storeData.taluk || 'Salem',
      cityVillage: storeData.cityVillage.trim(),
      address: storeData.address.trim(),
      pinCode: storeData.pinCode.trim(),
      latitude: parseFloat(storeData.latitude) || 11.6650,
      longitude: parseFloat(storeData.longitude) || 78.1470,
      phone: storeData.phone.trim(),
      email: storeData.email.trim(),
      contactPerson: storeData.contactPerson.trim(),
      services: storeData.services || ['Prescription Medicines', 'Generic Medicines'],
      status: storeData.status || 'Pending Verification',
      assignedManagerId: storeData.assignedManagerId || null,
      assignedManagerName: storeData.assignedManagerName || 'Unassigned',
      inventorySummary: {
        totalMedicines: parseInt(storeData.totalMedicines, 10) || 500,
        available: parseInt(storeData.available, 10) || 450,
        lowStock: parseInt(storeData.lowStock, 10) || 40,
        outOfStock: parseInt(storeData.outOfStock, 10) || 10
      },
      createdDate: new Date().toISOString().split('T')[0]
    };

    this.medicalStores.unshift(newStore);
    this.logAudit('ADD_MEDICAL_STORE', 'Medical Store Management', newStore.storeId, `Added pharmacy: ${newStore.name} (${newStore.type})`);
    this.showToast(`Medical Store ${newStore.storeId} registered successfully.`);
    this.notify();

    // Asynchronous backend persistence to PostgreSQL
    const token = localStorage.getItem('cb_auth_token') || sessionStorage.getItem('cb_auth_token');
    if (token) {
      const payload = {
        name: storeData.name.trim(),
        address: storeData.address.trim(),
        district: storeData.district || 'Salem',
        city: storeData.cityVillage?.trim() || storeData.district || 'Salem',
        contactPhone: storeData.phone?.trim() || '9876543210',
        latitude: parseFloat(storeData.latitude) || 11.6650,
        longitude: parseFloat(storeData.longitude) || 78.1470,
        is24x7: false
      };

      fetch('http://localhost:5000/api/medical-stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.warn('Backend medical store creation response not ok:', err.error || res.statusText);
        }
      })
      .catch((err) => {
        console.warn('Backend medical store creation network error:', err);
      });
    }

    return newStore;
  }

  toggleMedicalStoreStatus(storeId) {
    const store = this.medicalStores.find(s => s.storeId === storeId || s.id === storeId);
    if (!store) return;

    const oldStatus = store.status;
    store.status = (oldStatus === 'Active') ? 'Inactive' : 'Active';

    const action = store.status === 'Active' ? 'ACTIVATE_STORE' : 'DEACTIVATE_STORE';
    this.logAudit(action, 'Medical Store Management', store.storeId, `Store status changed from ${oldStatus} to ${store.status}`);
    this.showToast(`${store.name} is now ${store.status}.`, store.status === 'Active' ? 'success' : 'warning');
    this.notify();
  }

  verifyMedicalStore(storeId, approved = true) {
    const store = this.medicalStores.find(s => s.storeId === storeId || s.id === storeId);
    if (!store) return;

    store.status = approved ? 'Active' : 'Inactive';
    const action = approved ? 'APPROVE_STORE' : 'REJECT_STORE';
    this.logAudit(action, 'Medical Store Management', store.storeId, `Admin verification: ${approved ? 'Approved & Activated' : 'Rejected'}`);
    this.showToast(`Medical Store ${store.storeId} ${approved ? 'approved and activated' : 'rejected'}.`);
    this.notify();
  }

  // Bulk Import Orchestration
  executeBulkImport(entityType, records) {
    let importedCount = 0;
    const nowStr = new Date().toISOString().split('T')[0];

    if (['Doctors', 'Nurses', 'Pharmacists', 'Reception Staff'].includes(entityType)) {
      const roleMap = {
        'Doctors': 'Doctor',
        'Nurses': 'Nurse',
        'Pharmacists': 'Pharmacist',
        'Reception Staff': 'Reception Staff'
      };
      const assignedRole = roleMap[entityType];

      records.forEach(rec => {
        const empId = rec['Employee ID'] || `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
        const firstName = rec['First Name'] || '';
        const lastName = rec['Last Name'] || '';
        const fullName = `${firstName} ${lastName}`.trim() || empId;
        const email = rec['Email'] || `${firstName.toLowerCase().replace(/\s+/g, '')}.${empId.toLowerCase()}@carebridge.org`;
        const phone = rec['Phone Number'] || '';
        const dept = rec['Department'] || 'General';

        const newUser = {
          id: `usr-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          userId: this.generateUserId(assignedRole),
          employeeId: empId,
          fullName,
          role: assignedRole,
          mobileNumber: phone,
          email,
          orgType: 'Hospital',
          assignedOrgId: this.hospitals[0]?.hospitalId || 'HOSP-SLM-001',
          assignedOrgName: this.hospitals[0]?.name || 'GMKMC Hospital',
          district: 'Salem',
          status: 'Active',
          createdDate: rec['Joining Date'] || nowStr,
          lastLogin: 'Never',
          failedAttempts: 0,
          passwordLastChanged: nowStr,
          forcePasswordChange: true,
          metadata: {
            specialization: rec['Specialization'] || '',
            licenseNumber: rec['License Number'] || '',
            shift: rec['Shift'] || 'Day',
            department: dept
          }
        };
        this.users.unshift(newUser);
        importedCount++;
      });
    } else if (entityType === 'Medicines') {
      records.forEach(rec => {
        const medItem = {
          id: rec['Medicine ID'] || `MED-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          medicineId: rec['Medicine ID'],
          name: rec['Medicine Name'],
          genericName: rec['Generic Name'] || '',
          category: rec['Category'] || 'General',
          manufacturer: rec['Manufacturer'] || '',
          batchNumber: rec['Batch Number'] || '',
          expiryDate: rec['Expiry Date'] || '',
          quantity: parseInt(rec['Quantity'], 10) || 0,
          unitPrice: parseFloat(rec['Unit Price']) || 0,
          importedDate: nowStr
        };
        this.medicines.unshift(medItem);
        importedCount++;
      });
      if (this.medicalStores.length > 0) {
        this.medicalStores[0].inventorySummary.totalMedicines += importedCount;
        this.medicalStores[0].inventorySummary.available += importedCount;
      }
    } else if (entityType === 'Patients') {
      records.forEach(rec => {
        const patient = {
          id: rec['Patient ID'] || `PAT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          patientId: rec['Patient ID'],
          firstName: rec['First Name'],
          lastName: rec['Last Name'],
          fullName: `${rec['First Name']} ${rec['Last Name']}`.trim(),
          dob: rec['Date of Birth'],
          gender: rec['Gender'],
          phone: rec['Phone Number'],
          email: rec['Email'] || '',
          address: rec['Address'] || '',
          bloodGroup: rec['Blood Group'] || '',
          emergencyContact: rec['Emergency Contact'] || '',
          department: rec['Department'] || '',
          doctor: rec['Doctor'] || '',
          registeredDate: nowStr,
          status: 'Active'
        };
        this.patients.unshift(patient);
        importedCount++;
      });
    } else if (entityType === 'Appointments') {
      records.forEach(rec => {
        const appointment = {
          id: rec['Appointment ID'] || `APT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          appointmentId: rec['Appointment ID'],
          patientId: rec['Patient ID'],
          doctorId: rec['Doctor ID'],
          date: rec['Appointment Date'],
          time: rec['Appointment Time'],
          department: rec['Department'] || '',
          type: rec['Appointment Type'] || 'Consultation',
          status: rec['Status'] || 'Scheduled',
          createdDate: nowStr
        };
        this.appointments.unshift(appointment);
        importedCount++;
      });
    } else if (entityType === 'Departments') {
      records.forEach(rec => {
        const department = {
          id: rec['Department ID'] || `DEP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: rec['Department Name'],
          block: rec['Block / Building'] || 'Main Building',
          head: rec['Head of Department'] || 'TBD',
          ext: rec['Contact Extension'] || '',
          status: rec['Status'] || 'Active'
        };
        this.departments.unshift(department);
        importedCount++;
      });
    }

    this.logAudit(
      'BULK_IMPORT',
      'Bulk Import',
      `${importedCount} records`,
      `Successfully imported ${importedCount} ${entityType} records via Excel workbook`
    );
    this.showToast(`Imported ${importedCount} ${entityType} records successfully!`, 'success');
    this.notify();
    return { success: true, count: importedCount };
  }
}

export const adminStore = new AdminStore();
