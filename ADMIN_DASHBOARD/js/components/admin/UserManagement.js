/**
 * CareBridge Admin Dashboard — UserManagement Component
 * Implements Requirements 2, 3, 9:
 * User List Data Table with 11 columns, Search, Filter by Role/Status/District,
 * Sorting, Pagination, "+ Create User" action, and row actions (View, Reset Pwd, Deactivate/Activate).
 */

import { adminStore } from '../../store/adminStore.js';

export function createUserManagementView() {
  const container = document.createElement('section');
  container.className = 'module-view-container';
  container.setAttribute('aria-label', 'User Management Section');

  let currentPage = 1;
  const pageSize = 8;
  let currentSort = { column: 'createdDate', direction: 'desc' };
  let selectedRoleFilter = 'ALL';
  let selectedDistrictFilter = 'ALL';

  function render() {
    let list = [...adminStore.users];

    // Filter by Sub-filter from sidebar
    if (adminStore.activeSubFilter === 'active') {
      list = list.filter(u => u.status === 'Active');
    } else if (adminStore.activeSubFilter === 'inactive') {
      list = list.filter(u => u.status === 'Inactive' || u.status === 'Suspended');
    } else if (adminStore.activeSubFilter === 'pending') {
      list = list.filter(u => u.status === 'Pending');
    }

    // Role filter
    if (selectedRoleFilter !== 'ALL') {
      list = list.filter(u => u.role === selectedRoleFilter);
    }

    // District filter
    if (selectedDistrictFilter !== 'ALL') {
      list = list.filter(u => u.district === selectedDistrictFilter);
    }

    // Search query (User ID, Employee ID, Name, Role, Organization)
    const q = adminStore.searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(u => 
        u.userId.toLowerCase().includes(q) ||
        (u.employeeId && u.employeeId.toLowerCase().includes(q)) ||
        u.fullName.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        (u.assignedOrgName && u.assignedOrgName.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.mobileNumber && u.mobileNumber.toLowerCase().includes(q))
      );
    }

    // Sort
    list.sort((a, b) => {
      let valA = a[currentSort.column] || '';
      let valB = b[currentSort.column] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return currentSort.direction === 'asc' ? -1 : 1;
      if (valA > valB) return currentSort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    // Pagination
    const totalRecords = list.length;
    const totalPages = Math.ceil(totalRecords / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const startIndex = (currentPage - 1) * pageSize;
    const pageRecords = list.slice(startIndex, startIndex + pageSize);

    container.innerHTML = `
      <div class="module-header-container">
        <div class="module-title-group">
          <h2 class="module-main-title">User Management</h2>
          <span class="module-subtitle">Manage authorized healthcare practitioner IDs, institutional assignments, and security profiles.</span>
        </div>
        <button type="button" class="btn-primary-action" id="btn-create-user-top">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>+ Create User</span>
        </button>
      </div>

      <!-- Toolbar: Search & Filters -->
      <div class="table-toolbar-card">
        <div class="toolbar-search-box">
          <svg class="toolbar-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            type="text" 
            class="toolbar-search-input" 
            id="user-search-input" 
            placeholder="Search by User ID, Name, Role, Employee ID, or Org..." 
            value="${adminStore.searchQuery}"
          />
        </div>

        <div class="toolbar-filters">
          <select class="toolbar-select" id="user-role-filter">
            <option value="ALL">All Roles (${adminStore.roles.length})</option>
            ${adminStore.roles.map(r => `<option value="${r}" ${selectedRoleFilter === r ? 'selected' : ''}>${r}</option>`).join('')}
          </select>

          <select class="toolbar-select" id="user-district-filter">
            <option value="ALL">All Districts</option>
            ${adminStore.districts.map(d => `<option value="${d.name}" ${selectedDistrictFilter === d.name ? 'selected' : ''}>${d.name}</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="data-table-wrapper">
        <table class="cb-table" id="users-data-table">
          <thead>
            <tr>
              <th data-sort="userId" style="cursor: pointer;">User ID ${getSortArrow('userId')}</th>
              <th data-sort="fullName" style="cursor: pointer;">Full Name ${getSortArrow('fullName')}</th>
              <th data-sort="role" style="cursor: pointer;">Role ${getSortArrow('role')}</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Assigned Hospital / Store</th>
              <th>District</th>
              <th data-sort="status" style="cursor: pointer;">Status ${getSortArrow('status')}</th>
              <th data-sort="createdDate" style="cursor: pointer;">Created Date ${getSortArrow('createdDate')}</th>
              <th>Last Login</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${pageRecords.length === 0 ? `
              <tr>
                <td colspan="11" style="text-align: center; padding: 2.5rem; color: var(--cb-text-muted);">
                  No users found matching current filters.
                </td>
              </tr>
            ` : pageRecords.map(u => `
              <tr>
                <td><span class="code-tag">${u.userId}</span></td>
                <td>
                  <strong style="color: var(--cb-navy-900);">${u.fullName}</strong>
                  ${u.employeeId ? `<div style="font-size: 0.72rem; color: var(--cb-text-muted);">Emp: ${u.employeeId}</div>` : ''}
                </td>
                <td><span style="font-weight: 600; color: var(--cb-navy-800);">${u.role}</span></td>
                <td>${u.mobileNumber}</td>
                <td>${u.email}</td>
                <td>
                  <span title="${u.assignedOrgName}" style="display: block; max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    ${u.assignedOrgName || '—'}
                  </span>
                </td>
                <td>${u.district}</td>
                <td>
                  <span class="status-pill ${u.status.toLowerCase()}">${u.status}</span>
                </td>
                <td>${u.createdDate}</td>
                <td>${u.lastLogin}</td>
                <td style="text-align: right;">
                  <div class="table-actions">
                    <button type="button" class="btn-table-action" data-action="view-user" data-id="${u.userId}" title="View detailed profile">View</button>
                    <button type="button" class="btn-table-action" data-action="reset-pwd" data-id="${u.userId}" title="Reset password">Reset</button>
                    <button 
                      type="button" 
                      class="btn-table-action ${u.status === 'Active' ? 'danger' : 'primary'}" 
                      data-action="toggle-status" 
                      data-id="${u.userId}" 
                      title="${u.status === 'Active' ? 'Deactivate account without deleting records' : 'Reactivate account'}"
                    >
                      ${u.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="table-pagination-bar">
          <span>Showing <strong>${totalRecords === 0 ? 0 : startIndex + 1}</strong> to <strong>${Math.min(startIndex + pageSize, totalRecords)}</strong> of <strong>${totalRecords}</strong> registered accounts</span>
          <div class="pagination-controls">
            <button type="button" class="pagination-btn" id="btn-page-prev" ${currentPage <= 1 ? 'disabled' : ''}>Previous</button>
            <span style="padding: 0 0.5rem; font-weight: 700;">Page ${currentPage} of ${totalPages}</span>
            <button type="button" class="pagination-btn" id="btn-page-next" ${currentPage >= totalPages ? 'disabled' : ''}>Next</button>
          </div>
        </div>
      </div>
    `;

    // Bind listeners
    const searchInput = container.querySelector('#user-search-input');
    searchInput.addEventListener('input', (e) => {
      adminStore.setSearchQuery(e.target.value);
    });

    const roleFilter = container.querySelector('#user-role-filter');
    roleFilter.addEventListener('change', (e) => {
      selectedRoleFilter = e.target.value;
      currentPage = 1;
      render();
    });

    const distFilter = container.querySelector('#user-district-filter');
    distFilter.addEventListener('change', (e) => {
      selectedDistrictFilter = e.target.value;
      currentPage = 1;
      render();
    });

    const createBtn = container.querySelector('#btn-create-user-top');
    createBtn.addEventListener('click', () => adminStore.openModal('create-user'));

    // Sorting headers
    container.querySelectorAll('th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.getAttribute('data-sort');
        if (currentSort.column === col) {
          currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
          currentSort.column = col;
          currentSort.direction = 'asc';
        }
        render();
      });
    });

    // Pagination buttons
    const prevBtn = container.querySelector('#btn-page-prev');
    const nextBtn = container.querySelector('#btn-page-next');
    if (prevBtn) prevBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; render(); } });
    if (nextBtn) nextBtn.addEventListener('click', () => { if (currentPage < totalPages) { currentPage++; render(); } });

    // Row Action buttons
    container.querySelectorAll('[data-action="view-user"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid = btn.getAttribute('data-id');
        const user = adminStore.users.find(u => u.userId === uid);
        if (user) adminStore.openDrawer('user-profile', user);
      });
    });

    container.querySelectorAll('[data-action="reset-pwd"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid = btn.getAttribute('data-id');
        const user = adminStore.users.find(u => u.userId === uid);
        if (user) adminStore.openModal('password-reset', user);
      });
    });

    container.querySelectorAll('[data-action="toggle-status"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid = btn.getAttribute('data-id');
        adminStore.toggleUserStatus(uid);
      });
    });
  }

  function getSortArrow(col) {
    if (currentSort.column !== col) return '<span style="opacity: 0.3;">↕</span>';
    return currentSort.direction === 'asc' ? '↑' : '↓';
  }

  render();
  adminStore.subscribe(render);

  return container;
}
