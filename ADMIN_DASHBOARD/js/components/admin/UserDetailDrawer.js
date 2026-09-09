/**
 * CareBridge Admin Dashboard — UserDetailDrawer Component
 * Implements Requirement 10:
 * Detailed profile slide-out drawer displaying:
 * - Account Information (User ID, Name, Role, Status, Created date, Last login)
 * - Organization (Type, Name, District, Location)
 * - Assigned Permissions (dynamically loaded from role matrix)
 * - Security (Password last changed, Last login, Failed attempts, Account status)
 */

import { adminStore } from '../../store/adminStore.js';

export function createUserDetailDrawer(user) {
  const overlay = document.createElement('div');
  overlay.className = 'admin-drawer-overlay';
  overlay.id = 'drawer-user-detail';

  const permissions = adminStore.rolePermissions[user.role] || [
    'Standard authenticated healthcare portal access',
    'View authorized clinical patient directory'
  ];

  overlay.innerHTML = `
    <div class="admin-drawer-card">
      <div class="drawer-header">
        <div class="drawer-header-meta">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="status-pill ${user.status.toLowerCase()}">${user.status}</span>
            <span class="code-tag" style="background: rgba(255,255,255,0.15); color: #ffffff; border-color: rgba(255,255,255,0.3);">${user.userId}</span>
          </div>
          <h3 class="drawer-title">${user.fullName}</h3>
          <span class="drawer-subtitle">${user.role} • ${user.district} District</span>
        </div>
        <button type="button" class="drawer-close-btn" id="btn-close-user-drawer" aria-label="Close drawer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="drawer-body">
        <!-- 1. Account Information -->
        <div class="drawer-section">
          <h4 class="drawer-section-title">1. Account Information</h4>
          <div class="detail-row-grid">
            <div class="detail-item">
              <span class="detail-label">User ID</span>
              <span class="detail-value"><code>${user.userId}</code></span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Employee ID</span>
              <span class="detail-value">${user.employeeId || '—'}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Mobile Number</span>
              <span class="detail-value">${user.mobileNumber}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Email Address</span>
              <span class="detail-value">${user.email}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Account Created</span>
              <span class="detail-value">${user.createdDate}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Last Login Event</span>
              <span class="detail-value">${user.lastLogin}</span>
            </div>
          </div>
        </div>

        <!-- 2. Organization Details -->
        <div class="drawer-section">
          <h4 class="drawer-section-title">2. Organization & Facility Assignment</h4>
          <div class="detail-row-grid">
            <div class="detail-item">
              <span class="detail-label">Organization Type</span>
              <span class="detail-value">${user.orgType}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">District</span>
              <span class="detail-value">${user.district}</span>
            </div>
            <div class="detail-item full-span">
              <span class="detail-label">Assigned Healthcare Facility</span>
              <span class="detail-value" style="color: var(--cb-navy-800); font-weight: 700;">
                ${user.assignedOrgName || 'Independent Healthcare Operator'}
              </span>
            </div>
          </div>
        </div>

        <!-- 3. Assigned Permissions -->
        <div class="drawer-section">
          <h4 class="drawer-section-title">3. Assigned Role Permissions</h4>
          <ul class="permission-bullet-list">
            ${permissions.map(p => `
              <li class="permission-bullet-item">
                <svg class="permission-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span>${p}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- 4. Security & Audit -->
        <div class="drawer-section">
          <h4 class="drawer-section-title">4. Security & Compliance</h4>
          <div class="detail-row-grid">
            <div class="detail-item">
              <span class="detail-label">Password Last Changed</span>
              <span class="detail-value">${user.passwordLastChanged || 'Initial Setup'}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Failed Login Attempts</span>
              <span class="detail-value" style="color: ${user.failedAttempts > 0 ? 'var(--cb-error-base)' : 'inherit'};">
                ${user.failedAttempts} attempts
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Account Status</span>
              <span class="detail-value">
                <span class="status-pill ${user.status.toLowerCase()}">${user.status}</span>
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Enforce Pwd Change</span>
              <span class="detail-value">${user.forcePasswordChange ? 'Yes (Next Login)' : 'No'}</span>
            </div>
          </div>
        </div>

        <!-- Action Bar inside Drawer -->
        <div style="display: flex; gap: 0.75rem; margin-top: 1rem; border-top: 1px solid var(--cb-border-subtle); padding-top: 1rem;">
          <button type="button" class="btn-table-action" id="btn-drawer-reset-pwd" style="padding: 0.5rem 1rem; font-size: 0.82rem;">
            Reset Password
          </button>
          <button type="button" class="btn-table-action ${user.status === 'Active' ? 'danger' : 'primary'}" id="btn-drawer-toggle-status" style="padding: 0.5rem 1rem; font-size: 0.82rem;">
            ${user.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
          </button>
        </div>
      </div>
    </div>
  `;

  const close = () => adminStore.closeDrawer();
  overlay.querySelector('#btn-close-user-drawer').addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  overlay.querySelector('#btn-drawer-reset-pwd').addEventListener('click', () => {
    close();
    adminStore.openModal('password-reset', user);
  });

  overlay.querySelector('#btn-drawer-toggle-status').addEventListener('click', () => {
    adminStore.toggleUserStatus(user.userId);
    close();
  });

  return overlay;
}
