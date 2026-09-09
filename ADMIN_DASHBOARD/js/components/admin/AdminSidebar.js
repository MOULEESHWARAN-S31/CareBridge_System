/**
 * CareBridge Admin Dashboard — AdminSidebar Component
 * Conforms strictly to Requirement 32:
 * Administration
 * ├── User Management (All Users, Create User, Active Users, Inactive Users, Roles & Permissions)
 * ├── Hospital Management (All Hospitals, Add Hospital, Pending Verification, Hospital Users)
 * ├── Medical Store Management (All Medical Stores, Add Medical Store, Pending Verification, Store Users)
 * └── Audit Logs
 */

import { adminStore } from '../../store/adminStore.js';

export function createAdminSidebar() {
  const sidebar = document.createElement('aside');
  sidebar.className = 'admin-sidebar';
  sidebar.setAttribute('aria-label', 'Administration Navigation');

  function render() {
    const stats = adminStore.getSummaryStats();
    const currSec = adminStore.activeSection;
    const currSub = adminStore.activeSubFilter;

    sidebar.innerHTML = `
      <div>
        <div class="sidebar-category-header">
          <span>Administration</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>
        </div>

        <!-- 1. User Management Group -->
        <div class="sidebar-nav-group">
          <button type="button" class="sidebar-group-title ${currSec === 'users' ? 'active' : ''}" data-nav-section="users" data-nav-sub="all">
            <svg class="sidebar-group-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>User Management</span>
          </button>
          <div class="sidebar-sub-list">
            <button type="button" class="sidebar-sub-item ${currSec === 'users' && currSub === 'all' ? 'active' : ''}" data-nav-section="users" data-nav-sub="all">
              <span>All Users</span>
              <span class="sidebar-badge">${stats.totalUsers}</span>
            </button>
            <button type="button" class="sidebar-sub-item ${currSec === 'users' && currSub === 'create' ? 'active' : ''}" data-action="create-user">
              <span style="color: var(--cb-teal-700); font-weight: 700;">+ Create User</span>
            </button>
            <button type="button" class="sidebar-sub-item ${currSec === 'users' && currSub === 'active' ? 'active' : ''}" data-nav-section="users" data-nav-sub="active">
              <span>Active Users</span>
              <span class="sidebar-badge">${stats.activeUsers}</span>
            </button>
            <button type="button" class="sidebar-sub-item ${currSec === 'users' && currSub === 'inactive' ? 'active' : ''}" data-nav-section="users" data-nav-sub="inactive">
              <span>Inactive Users</span>
              <span class="sidebar-badge">${stats.inactiveUsers}</span>
            </button>
            <button type="button" class="sidebar-sub-item ${currSec === 'roles' ? 'active' : ''}" data-nav-section="roles" data-nav-sub="all">
              <span>Roles & Permissions</span>
            </button>
          </div>
        </div>

        <!-- 2. Hospital Management Group -->
        <div class="sidebar-nav-group">
          <button type="button" class="sidebar-group-title ${currSec === 'hospitals' ? 'active' : ''}" data-nav-section="hospitals" data-nav-sub="all">
            <svg class="sidebar-group-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9h1"/><path d="M9 13h1"/><path d="M9 17h1"/></svg>
            <span>Hospital Management</span>
          </button>
          <div class="sidebar-sub-list">
            <button type="button" class="sidebar-sub-item ${currSec === 'hospitals' && currSub === 'all' ? 'active' : ''}" data-nav-section="hospitals" data-nav-sub="all">
              <span>All Hospitals</span>
              <span class="sidebar-badge">${stats.totalHospitals}</span>
            </button>
            <button type="button" class="sidebar-sub-item ${currSec === 'hospitals' && currSub === 'add-hospital' ? 'active' : ''}" data-action="add-hospital">
              <span style="color: var(--cb-teal-700); font-weight: 700;">+ Add Hospital</span>
            </button>
            <button type="button" class="sidebar-sub-item ${currSec === 'hospitals' && currSub === 'bulk-import' ? 'active' : ''}" data-nav-section="hospitals" data-nav-sub="bulk-import" id="sub-nav-bulk-import-hospitals">
              <span style="display: flex; align-items: center; gap: 0.45rem;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Bulk Import Hospitals
              </span>
            </button>
            <button type="button" class="sidebar-sub-item ${currSec === 'hospitals' && currSub === 'pending' ? 'active' : ''}" data-nav-section="hospitals" data-nav-sub="pending">
              <span>Pending Verification</span>
              ${stats.pendingHospitals > 0 ? `<span class="sidebar-badge alert">${stats.pendingHospitals}</span>` : `<span class="sidebar-badge">0</span>`}
            </button>
            <button type="button" class="sidebar-sub-item ${currSec === 'hospitals' && currSub === 'hospital-users' ? 'active' : ''}" data-nav-section="hospitals" data-nav-sub="hospital-users">
              <span>Hospital Users</span>
            </button>
          </div>
        </div>

        <!-- 3. Medical Store Management Group -->
        <div class="sidebar-nav-group">
          <button type="button" class="sidebar-group-title ${currSec === 'stores' ? 'active' : ''}" data-nav-section="stores" data-nav-sub="all">
            <svg class="sidebar-group-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>
            <span>Medical Store Management</span>
          </button>
          <div class="sidebar-sub-list">
            <button type="button" class="sidebar-sub-item ${currSec === 'stores' && currSub === 'all' ? 'active' : ''}" data-nav-section="stores" data-nav-sub="all">
              <span>All Medical Stores</span>
              <span class="sidebar-badge">${stats.totalStores}</span>
            </button>
            <button type="button" class="sidebar-sub-item ${currSec === 'stores' && currSub === 'add-store' ? 'active' : ''}" data-action="add-store">
              <span style="color: var(--cb-teal-700); font-weight: 700;">+ Add Medical Store</span>
            </button>
            <button type="button" class="sidebar-sub-item ${currSec === 'stores' && currSub === 'bulk-import' ? 'active' : ''}" data-nav-section="stores" data-nav-sub="bulk-import" id="sub-nav-bulk-import-stores">
              <span style="display: flex; align-items: center; gap: 0.45rem;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Bulk Import Medical Stores
              </span>
            </button>
            <button type="button" class="sidebar-sub-item ${currSec === 'stores' && currSub === 'pending' ? 'active' : ''}" data-nav-section="stores" data-nav-sub="pending">
              <span>Pending Verification</span>
              ${stats.pendingStores > 0 ? `<span class="sidebar-badge alert">${stats.pendingStores}</span>` : `<span class="sidebar-badge">0</span>`}
            </button>
            <button type="button" class="sidebar-sub-item ${currSec === 'stores' && currSub === 'store-users' ? 'active' : ''}" data-nav-section="stores" data-nav-sub="store-users">
              <span>Store Users</span>
            </button>
          </div>
        </div>

        <!-- 4. Audit Logs Group -->
        <div class="sidebar-nav-group">
          <button type="button" class="sidebar-group-title ${currSec === 'audit' ? 'active' : ''}" data-nav-section="audit" data-nav-sub="all">
            <svg class="sidebar-group-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            <span>Activity / Audit Logs</span>
          </button>
        </div>
      </div>
    `;

    // Attach navigation event handlers
    sidebar.querySelectorAll('[data-nav-section]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const sec = btn.getAttribute('data-nav-section');
        const sub = btn.getAttribute('data-nav-sub') || 'all';
        adminStore.setNavigation(sec, sub);
        if (sec === 'hospitals' && sub === 'bulk-import') {
          window.location.hash = '#admin/hospitals/bulk-import';
        } else if (sec === 'stores' && sub === 'bulk-import') {
          window.location.hash = '#admin/stores/bulk-import';
        } else {
          window.location.hash = '#admin';
        }
      });
    });

    sidebar.querySelectorAll('[data-action="create-user"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        adminStore.openModal('create-user');
      });
    });

    sidebar.querySelectorAll('[data-action="add-hospital"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        adminStore.openModal('add-hospital');
      });
    });

    sidebar.querySelectorAll('[data-action="add-store"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        adminStore.openModal('add-store');
      });
    });
  }

  render();
  adminStore.subscribe(render);

  return sidebar;
}
