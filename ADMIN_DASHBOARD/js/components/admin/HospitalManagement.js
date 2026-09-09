/**
 * CareBridge Admin Dashboard — HospitalManagement Component
 * Implements Requirements 11, 12, 16, 26:
 * - Hospital List Data Table (Hospital ID, Hospital Name, Type, District, Contact, Beds, Status, Actions)
 * - Search by Hospital ID, Name, District, Type, Status
 * - Status actions: View Profile, Edit, Activate/Deactivate, Manage Users, Approve/Reject verification
 * - "+ Add Hospital" action button
 */

import { adminStore } from '../../store/adminStore.js';
import { createBulkImportHospitalsView } from './BulkImportHospitalsView.js';

export function createHospitalManagementView() {
  if (adminStore.activeSubFilter === 'bulk-import') {
    return createBulkImportHospitalsView();
  }

  const container = document.createElement('section');
  container.className = 'module-view-container';
  container.setAttribute('aria-label', 'Hospital Management Section');

  let currentPage = 1;
  const pageSize = 6;
  let selectedTypeFilter = 'ALL';
  let selectedStatusFilter = 'ALL';

  function render() {
    let list = [...adminStore.hospitals];

    // Filter by Sub-filter from sidebar
    if (adminStore.activeSubFilter === 'pending') {
      list = list.filter(h => h.status === 'Pending Verification');
    }

    if (selectedTypeFilter !== 'ALL') {
      list = list.filter(h => h.type === selectedTypeFilter);
    }

    if (selectedStatusFilter !== 'ALL') {
      list = list.filter(h => h.status === selectedStatusFilter);
    }

    const q = adminStore.searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(h => 
        h.hospitalId.toLowerCase().includes(q) ||
        h.name.toLowerCase().includes(q) ||
        h.type.toLowerCase().includes(q) ||
        h.district.toLowerCase().includes(q) ||
        h.status.toLowerCase().includes(q) ||
        h.phone.toLowerCase().includes(q)
      );
    }

    const totalRecords = list.length;
    const totalPages = Math.ceil(totalRecords / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const startIndex = (currentPage - 1) * pageSize;
    const pageRecords = list.slice(startIndex, startIndex + pageSize);

    const hospitalTypes = [
      'District Hospital',
      'Government Hospital',
      'Taluk Hospital',
      'Community Health Centre',
      'Primary Health Centre',
      'Specialty Hospital'
    ];

    container.innerHTML = `
      <div class="module-header-container">
        <div class="module-title-group">
          <h2 class="module-main-title">Hospital Management</h2>
          <span class="module-subtitle">Accredit, configure, and monitor regional hospital nodes, bed inventories, and facility administrators.</span>
        </div>
        <div style="display: flex; gap: 0.6rem; align-items: center;">
          <button type="button" class="btn-secondary-action" id="btn-bulk-import-hosp-top">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Bulk Import Hospitals</span>
          </button>
          <button type="button" class="btn-primary-action" id="btn-add-hospital-top">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>+ Add Hospital</span>
          </button>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="table-toolbar-card">
        <div class="toolbar-search-box">
          <svg class="toolbar-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            type="text" 
            class="toolbar-search-input" 
            id="hosp-search-input" 
            placeholder="Search by Hospital ID, Name, District, Type..." 
            value="${adminStore.searchQuery}"
          />
        </div>

        <div class="toolbar-filters">
          <select class="toolbar-select" id="hosp-type-filter">
            <option value="ALL">All Hospital Types</option>
            ${hospitalTypes.map(t => `<option value="${t}" ${selectedTypeFilter === t ? 'selected' : ''}>${t}</option>`).join('')}
          </select>

          <select class="toolbar-select" id="hosp-status-filter">
            <option value="ALL">All Statuses</option>
            <option value="Active" ${selectedStatusFilter === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Pending Verification" ${selectedStatusFilter === 'Pending Verification' ? 'selected' : ''}>Pending Verification</option>
            <option value="Under Maintenance" ${selectedStatusFilter === 'Under Maintenance' ? 'selected' : ''}>Under Maintenance</option>
            <option value="Inactive" ${selectedStatusFilter === 'Inactive' ? 'selected' : ''}>Inactive</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="data-table-wrapper">
        <table class="cb-table" id="hospitals-data-table">
          <thead>
            <tr>
              <th>Hospital ID</th>
              <th>Hospital Name</th>
              <th>Type</th>
              <th>District</th>
              <th>Contact</th>
              <th style="text-align: right;">Beds (Total / Avail)</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${pageRecords.length === 0 ? `
              <tr>
                <td colspan="8" style="text-align: center; padding: 2.5rem; color: var(--cb-text-muted);">
                  No hospital facilities found matching criteria.
                </td>
              </tr>
            ` : pageRecords.map(h => `
              <tr>
                <td><span class="code-tag">${h.hospitalId}</span></td>
                <td>
                  <strong style="color: var(--cb-navy-900); display: block; max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${h.name}">
                    ${h.name}
                  </strong>
                  <div style="font-size: 0.72rem; color: var(--cb-text-muted);">
                    Admin: ${h.assignedAdminName || 'Unassigned'}
                  </div>
                </td>
                <td><span style="font-weight: 600; color: var(--cb-text-secondary);">${h.type}</span></td>
                <td>${h.district} (${h.taluk})</td>
                <td>
                  <div>${h.phone}</div>
                  <div style="font-size: 0.72rem; color: var(--cb-text-muted);">${h.email}</div>
                </td>
                <td style="text-align: right;">
                  <strong style="color: var(--cb-navy-900); font-size: 0.95rem;">${h.capacity.totalBeds}</strong>
                  <span style="font-size: 0.75rem; color: var(--cb-success-base); font-weight: 600;">(${h.capacity.availableBeds} free)</span>
                </td>
                <td>
                  <span class="status-pill ${getStatusClass(h.status)}">${h.status}</span>
                </td>
                <td style="text-align: right;">
                  <div class="table-actions">
                    <button type="button" class="btn-table-action" data-action="view-hosp" data-id="${h.hospitalId}" title="View hospital profile and bed analytics">View</button>

                    ${h.status === 'Pending Verification' ? `
                      <button type="button" class="btn-table-action primary" data-action="approve-hosp" data-id="${h.hospitalId}" title="Approve and activate hospital node">Approve</button>
                    ` : `
                      <button 
                        type="button" 
                        class="btn-table-action ${h.status === 'Active' ? 'danger' : 'primary'}" 
                        data-action="toggle-hosp-status" 
                        data-id="${h.hospitalId}"
                        title="${h.status === 'Active' ? 'Deactivate hospital (preserves records)' : 'Activate hospital'}"
                      >
                        ${h.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    `}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="table-pagination-bar">
          <span>Showing <strong>${totalRecords === 0 ? 0 : startIndex + 1}</strong> to <strong>${Math.min(startIndex + pageSize, totalRecords)}</strong> of <strong>${totalRecords}</strong> hospital facilities</span>
          <div class="pagination-controls">
            <button type="button" class="pagination-btn" id="btn-hosp-prev" ${currentPage <= 1 ? 'disabled' : ''}>Previous</button>
            <span style="padding: 0 0.5rem; font-weight: 700;">Page ${currentPage} of ${totalPages}</span>
            <button type="button" class="pagination-btn" id="btn-hosp-next" ${currentPage >= totalPages ? 'disabled' : ''}>Next</button>
          </div>
        </div>
      </div>
    `;

    // Bind listeners
    const searchInput = container.querySelector('#hosp-search-input');
    searchInput.addEventListener('input', (e) => adminStore.setSearchQuery(e.target.value));

    const typeFilter = container.querySelector('#hosp-type-filter');
    typeFilter.addEventListener('change', (e) => {
      selectedTypeFilter = e.target.value;
      currentPage = 1;
      render();
    });

    const statusFilter = container.querySelector('#hosp-status-filter');
    statusFilter.addEventListener('change', (e) => {
      selectedStatusFilter = e.target.value;
      currentPage = 1;
      render();
    });

    const addBtn = container.querySelector('#btn-add-hospital-top');
    if (addBtn) addBtn.addEventListener('click', () => adminStore.openModal('add-hospital'));

    const bulkBtn = container.querySelector('#btn-bulk-import-hosp-top');
    if (bulkBtn) bulkBtn.addEventListener('click', () => adminStore.setNavigation('hospitals', 'bulk-import'));

    const prevBtn = container.querySelector('#btn-hosp-prev');
    const nextBtn = container.querySelector('#btn-hosp-next');
    if (prevBtn) prevBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; render(); } });
    if (nextBtn) nextBtn.addEventListener('click', () => { if (currentPage < totalPages) { currentPage++; render(); } });

    // Actions
    container.querySelectorAll('[data-action="view-hosp"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const hid = btn.getAttribute('data-id');
        const hosp = adminStore.hospitals.find(h => h.hospitalId === hid);
        if (hosp) adminStore.openDrawer('hospital-profile', hosp);
      });
    });

    container.querySelectorAll('[data-action="toggle-hosp-status"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const hid = btn.getAttribute('data-id');
        adminStore.toggleHospitalStatus(hid);
      });
    });

    container.querySelectorAll('[data-action="approve-hosp"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const hid = btn.getAttribute('data-id');
        adminStore.verifyHospital(hid, true);
      });
    });
  }

  function getStatusClass(status) {
    if (status === 'Active') return 'active';
    if (status === 'Pending Verification') return 'pending';
    if (status === 'Under Maintenance') return 'maintenance';
    return 'inactive';
  }

  render();
  adminStore.subscribe(render);

  return container;
}
