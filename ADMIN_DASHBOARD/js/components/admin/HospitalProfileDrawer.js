/**
 * CareBridge Admin Dashboard — HospitalProfileDrawer Component
 * Implements Requirement 15:
 * Comprehensive hospital profile slide-out drawer showing:
 * - Overview (Name, ID, Type, District, Status)
 * - Contact (Phone, Email, Address)
 * - Capacity (Total beds, Occupied, Available, ICU, Emergency, General)
 * - Services (Active badges)
 * - Staff breakdown & Associated CareBridge Accounts list
 */

import { adminStore } from '../../store/adminStore.js';

export function createHospitalProfileDrawer(hospital) {
  const overlay = document.createElement('div');
  overlay.className = 'admin-drawer-overlay';
  overlay.id = 'drawer-hosp-profile';

  const associatedUsers = adminStore.users.filter(u => 
    u.assignedOrgId === hospital.id || 
    (u.assignedOrgName && u.assignedOrgName.toLowerCase() === hospital.name.toLowerCase())
  );

  const docCount = associatedUsers.filter(u => u.role === 'Doctor').length;
  const nurseCount = associatedUsers.filter(u => u.role === 'Nurse').length;
  const pharmCount = associatedUsers.filter(u => u.role === 'Pharmacist').length;
  const otherCount = associatedUsers.length - (docCount + nurseCount + pharmCount);

  overlay.innerHTML = `
    <div class="admin-drawer-card">
      <div class="drawer-header">
        <div class="drawer-header-meta">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="status-pill ${hospital.status === 'Active' ? 'active' : (hospital.status === 'Pending Verification' ? 'pending' : 'inactive')}">${hospital.status}</span>
            <span class="code-tag" style="background: rgba(255,255,255,0.15); color: #ffffff; border-color: rgba(255,255,255,0.3);">${hospital.hospitalId}</span>
          </div>
          <h3 class="drawer-title" style="font-size: 1.15rem;">${hospital.name}</h3>
          <span class="drawer-subtitle">${hospital.type} • Reg: ${hospital.registrationNumber}</span>
        </div>
        <button type="button" class="drawer-close-btn" id="btn-close-hosp-drawer" aria-label="Close drawer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="drawer-body">
        <!-- 1. Overview -->
        <div class="drawer-section">
          <h4 class="drawer-section-title">1. Facility Overview & Administrator</h4>
          <div class="detail-row-grid">
            <div class="detail-item">
              <span class="detail-label">Hospital ID</span>
              <span class="detail-value"><code>${hospital.hospitalId}</code></span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Hospital Type</span>
              <span class="detail-value">${hospital.type}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">District & Taluk</span>
              <span class="detail-value">${hospital.district} (${hospital.taluk})</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Sector</span>
              <span class="detail-value">${hospital.ownership}</span>
            </div>
            <div class="detail-item full-span">
              <span class="detail-label">Assigned Hospital Administrator</span>
              <span class="detail-value" style="color: var(--cb-navy-900); font-weight: 700;">
                ${hospital.assignedAdminName || 'Unassigned'}
              </span>
            </div>
          </div>
        </div>

        <!-- 2. Contact Information -->
        <div class="drawer-section">
          <h4 class="drawer-section-title">2. Contact & Location</h4>
          <div class="detail-row-grid">
            <div class="detail-item">
              <span class="detail-label">Phone</span>
              <span class="detail-value">${hospital.phone}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Email</span>
              <span class="detail-value">${hospital.email}</span>
            </div>
            <div class="detail-item full-span">
              <span class="detail-label">Emergency Desk</span>
              <span class="detail-value" style="color: var(--cb-error-base); font-weight: 700;">${hospital.emergencyContact || '108'}</span>
            </div>
            <div class="detail-item full-span">
              <span class="detail-label">Physical Address</span>
              <span class="detail-value">${hospital.address}</span>
            </div>
          </div>
        </div>

        <!-- 3. Bed Capacity & Specialized Units -->
        <div class="drawer-section">
          <h4 class="drawer-section-title">3. Bed Inventory & Availability</h4>
          <div class="detail-row-grid">
            <div class="detail-item">
              <span class="detail-label">Total Beds</span>
              <span class="detail-value" style="font-size: 1.1rem; color: var(--cb-navy-900);">${hospital.capacity.totalBeds}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Available Free Beds</span>
              <span class="detail-value" style="font-size: 1.1rem; color: var(--cb-success-base);">${hospital.capacity.availableBeds}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">ICU Beds</span>
              <span class="detail-value">${hospital.capacity.icuBeds}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Emergency Beds</span>
              <span class="detail-value">${hospital.capacity.emergencyBeds}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">General Wards</span>
              <span class="detail-value">${hospital.capacity.generalBeds}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Occupied Beds</span>
              <span class="detail-value">${hospital.capacity.occupiedBeds}</span>
            </div>
          </div>
        </div>

        <!-- 4. Clinical Services -->
        <div class="drawer-section">
          <h4 class="drawer-section-title">4. Approved Services</h4>
          <div class="badge-cloud">
            ${hospital.services.map(s => `<span class="badge-chip">✓ ${s}</span>`).join('')}
          </div>
        </div>

        <!-- 5. Staff & Associated CareBridge Accounts -->
        <div class="drawer-section">
          <h4 class="drawer-section-title">5. Associated CareBridge Users (${associatedUsers.length})</h4>
          <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
            <span class="badge-chip">Doctors: ${docCount}</span>
            <span class="badge-chip">Nurses: ${nurseCount}</span>
            <span class="badge-chip">Pharmacists: ${pharmCount}</span>
            <span class="badge-chip">Support: ${otherCount}</span>
          </div>

          ${associatedUsers.length === 0 ? `
            <div style="font-size: 0.8rem; color: var(--cb-text-muted); padding: 0.5rem; background: #f8fafc; border-radius: var(--cb-radius-sm);">
              No user accounts currently assigned to this facility. Use <strong>+ Create User</strong> to provision credentials.
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.4rem; max-height: 200px; overflow-y: auto;">
              ${associatedUsers.map(u => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.65rem; background: #f8fafc; border-radius: var(--cb-radius-sm); border: 1px solid #e2e8f0; font-size: 0.8rem;">
                  <div>
                    <strong style="color: var(--cb-navy-900);">${u.fullName}</strong>
                    <div style="font-size: 0.72rem; color: var(--cb-text-muted);">${u.role} • <code>${u.userId}</code></div>
                  </div>
                  <span class="status-pill ${u.status.toLowerCase()}">${u.status}</span>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Facility Actions -->
        <div style="display: flex; gap: 0.75rem; margin-top: 1rem; border-top: 1px solid var(--cb-border-subtle); padding-top: 1rem;">
          ${hospital.status === 'Pending Verification' ? `
            <button type="button" class="btn-primary-action" id="btn-drawer-approve-hosp" style="flex: 1; justify-content: center;">
              Approve Facility
            </button>
          ` : `
            <button type="button" class="btn-table-action ${hospital.status === 'Active' ? 'danger' : 'primary'}" id="btn-drawer-toggle-hosp" style="flex: 1; padding: 0.5rem; font-size: 0.82rem;">
              ${hospital.status === 'Active' ? 'Deactivate Hospital (Preserve History)' : 'Activate Hospital'}
            </button>
          `}
        </div>
      </div>
    </div>
  `;

  const close = () => adminStore.closeDrawer();
  overlay.querySelector('#btn-close-hosp-drawer').addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  const approveBtn = overlay.querySelector('#btn-drawer-approve-hosp');
  if (approveBtn) {
    approveBtn.addEventListener('click', () => {
      adminStore.verifyHospital(hospital.hospitalId, true);
      close();
    });
  }

  const toggleBtn = overlay.querySelector('#btn-drawer-toggle-hosp');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      adminStore.toggleHospitalStatus(hospital.hospitalId);
      close();
    });
  }

  return overlay;
}
