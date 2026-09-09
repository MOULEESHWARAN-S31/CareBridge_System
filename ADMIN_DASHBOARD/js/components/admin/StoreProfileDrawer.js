/**
 * CareBridge Admin Dashboard — StoreProfileDrawer Component
 * Implements Requirement 21:
 * Displays slide-out drawer showing:
 * - Store Information (Name, ID, Type, Reg/License #, Status)
 * - Location (Address, District, Taluk, Map Coordinates)
 * - Contact (Phone, Email, Contact Person)
 * - Assigned Users (Store admin, Pharmacists, Staff)
 * - Inventory Summary (Total, Available, Low Stock, Out of Stock)
 */

import { adminStore } from '../../store/adminStore.js';

export function createStoreProfileDrawer(store) {
  const overlay = document.createElement('div');
  overlay.className = 'admin-drawer-overlay';
  overlay.id = 'drawer-store-profile';

  const associatedUsers = adminStore.users.filter(u => 
    u.assignedOrgId === store.id || 
    (u.assignedOrgName && u.assignedOrgName.toLowerCase() === store.name.toLowerCase())
  );

  overlay.innerHTML = `
    <div class="admin-drawer-card">
      <div class="drawer-header">
        <div class="drawer-header-meta">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="status-pill ${store.status === 'Active' ? 'active' : (store.status === 'Pending Verification' ? 'pending' : 'inactive')}">${store.status}</span>
            <span class="code-tag" style="background: rgba(255,255,255,0.15); color: #ffffff; border-color: rgba(255,255,255,0.3);">${store.storeId}</span>
          </div>
          <h3 class="drawer-title" style="font-size: 1.15rem;">${store.name}</h3>
          <span class="drawer-subtitle">${store.type} • Lic: ${store.licenseNumber}</span>
        </div>
        <button type="button" class="drawer-close-btn" id="btn-close-store-drawer" aria-label="Close drawer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="drawer-body">
        <!-- 1. Store Information -->
        <div class="drawer-section">
          <h4 class="drawer-section-title">1. Store Information & Licensing</h4>
          <div class="detail-row-grid">
            <div class="detail-item">
              <span class="detail-label">Store ID</span>
              <span class="detail-value"><code>${store.storeId}</code></span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Store Type</span>
              <span class="detail-value">${store.type}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Drug License Number</span>
              <span class="detail-value"><code>${store.licenseNumber}</code></span>
            </div>
            <div class="detail-item">
              <span class="detail-label">District & Taluk</span>
              <span class="detail-value">${store.district} (${store.taluk})</span>
            </div>
          </div>
        </div>

        <!-- 2. Inventory Summary (Requirement 21) -->
        <div class="drawer-section">
          <h4 class="drawer-section-title">2. Real-Time Inventory Summary</h4>
          <div class="detail-row-grid" style="background-color: #f8fafc; padding: 1rem; border-radius: var(--cb-radius-md); border: 1px solid var(--cb-border-subtle);">
            <div class="detail-item">
              <span class="detail-label">Total SKUs / Medicines</span>
              <span class="detail-value" style="font-size: 1.25rem; font-weight: 800; color: var(--cb-navy-900);">${store.inventorySummary.totalMedicines}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Available In-Stock</span>
              <span class="detail-value" style="font-size: 1.25rem; font-weight: 800; color: var(--cb-success-base);">${store.inventorySummary.available}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Low Stock Threshold</span>
              <span class="detail-value" style="font-size: 1.1rem; font-weight: 700; color: #d97706;">${store.inventorySummary.lowStock} items</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Out of Stock Alert</span>
              <span class="detail-value" style="font-size: 1.1rem; font-weight: 700; color: var(--cb-error-base);">${store.inventorySummary.outOfStock} items</span>
            </div>
          </div>
        </div>

        <!-- 3. Contact & Location -->
        <div class="drawer-section">
          <h4 class="drawer-section-title">3. Contact & Physical Location</h4>
          <div class="detail-row-grid">
            <div class="detail-item">
              <span class="detail-label">Telephone</span>
              <span class="detail-value">${store.phone}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Official Email</span>
              <span class="detail-value">${store.email}</span>
            </div>
            <div class="detail-item full-span">
              <span class="detail-label">Contact Person / In-Charge</span>
              <span class="detail-value" style="color: var(--cb-navy-900); font-weight: 700;">${store.contactPerson}</span>
            </div>
            <div class="detail-item full-span">
              <span class="detail-label">Premises Address</span>
              <span class="detail-value">${store.address}</span>
            </div>
          </div>
        </div>

        <!-- 4. Services -->
        <div class="drawer-section">
          <h4 class="drawer-section-title">4. Approved Services</h4>
          <div class="badge-cloud">
            ${store.services.map(s => `<span class="badge-chip">✓ ${s}</span>`).join('')}
          </div>
        </div>

        <!-- 5. Assigned Users -->
        <div class="drawer-section">
          <h4 class="drawer-section-title">5. Store Staff & Pharmacist Accounts (${associatedUsers.length})</h4>
          ${associatedUsers.length === 0 ? `
            <div style="font-size: 0.8rem; color: var(--cb-text-muted); padding: 0.5rem; background: #f8fafc; border-radius: var(--cb-radius-sm);">
              No pharmacist accounts directly tied to this store yet. Use <strong>+ Create User</strong> to assign pharmacy personnel.
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.4rem;">
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

        <!-- Store Actions -->
        <div style="display: flex; gap: 0.75rem; margin-top: 1rem; border-top: 1px solid var(--cb-border-subtle); padding-top: 1rem;">
          ${store.status === 'Pending Verification' ? `
            <button type="button" class="btn-primary-action" id="btn-drawer-approve-store" style="flex: 1; justify-content: center;">
              Approve Medical Store
            </button>
          ` : `
            <button type="button" class="btn-table-action ${store.status === 'Active' ? 'danger' : 'primary'}" id="btn-drawer-toggle-store" style="flex: 1; padding: 0.5rem; font-size: 0.82rem;">
              ${store.status === 'Active' ? 'Deactivate Store' : 'Activate Store'}
            </button>
          `}
        </div>
      </div>
    </div>
  `;

  const close = () => adminStore.closeDrawer();
  overlay.querySelector('#btn-close-store-drawer').addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  const approveBtn = overlay.querySelector('#btn-drawer-approve-store');
  if (approveBtn) {
    approveBtn.addEventListener('click', () => {
      adminStore.verifyMedicalStore(store.storeId, true);
      close();
    });
  }

  const toggleBtn = overlay.querySelector('#btn-drawer-toggle-store');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      adminStore.toggleMedicalStoreStatus(store.storeId);
      close();
    });
  }

  return overlay;
}
