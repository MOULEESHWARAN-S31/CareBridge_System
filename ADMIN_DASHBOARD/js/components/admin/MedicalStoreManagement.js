/**
 * CareBridge Admin Dashboard — MedicalStoreManagement Component
 * Implements Requirements 17, 18, 22:
 * - Medical Store List Data Table (Store ID, Store Name, Type, District, Contact, Status, Actions)
 * - Filtering by Store Type, District, Status
 * - Search by Store ID, Name, District, Type
 * - Actions: View Store Profile, Activate/Deactivate, Approve Verification
 * - "+ Add Medical Store" action button
 */

import { adminStore } from '../../store/adminStore.js';
import { createBulkImportStoresView } from './BulkImportStoresView.js';

export function createMedicalStoreManagementView() {
  if (adminStore.activeSubFilter === 'bulk-import') {
    return createBulkImportStoresView();
  }

  const container = document.createElement('section');
  container.className = 'module-view-container';
  container.setAttribute('aria-label', 'Medical Store Management Section');

  let currentPage = 1;
  const pageSize = 6;
  let selectedTypeFilter = 'ALL';
  let selectedStatusFilter = 'ALL';

  function render() {
    let list = [...adminStore.medicalStores];

    if (adminStore.activeSubFilter === 'pending') {
      list = list.filter(s => s.status === 'Pending Verification');
    }

    if (selectedTypeFilter !== 'ALL') {
      list = list.filter(s => s.type === selectedTypeFilter);
    }

    if (selectedStatusFilter !== 'ALL') {
      list = list.filter(s => s.status === selectedStatusFilter);
    }

    const q = adminStore.searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(s => 
        s.storeId.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q) ||
        s.status.toLowerCase().includes(q) ||
        (s.contactPerson && s.contactPerson.toLowerCase().includes(q))
      );
    }

    const totalRecords = list.length;
    const totalPages = Math.ceil(totalRecords / pageSize) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const startIndex = (currentPage - 1) * pageSize;
    const pageRecords = list.slice(startIndex, startIndex + pageSize);

    const storeTypes = [
      'Government Medical Store',
      'Hospital Pharmacy',
      'Primary Health Centre Pharmacy',
      'Public Pharmacy',
      'Partner Pharmacy'
    ];

    container.innerHTML = `
      <div class="module-header-container">
        <div class="module-title-group">
          <h2 class="module-main-title">Medical Store Management</h2>
          <span class="module-subtitle">Maintain accredited pharmacies, supply warehouses, drug availability feeds, and assigned pharmacists.</span>
        </div>
        <div style="display: flex; gap: 0.6rem; align-items: center;">
          <button type="button" class="btn-secondary-action" id="btn-bulk-import-store-top">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Bulk Import Medical Stores</span>
          </button>
          <button type="button" class="btn-primary-action" id="btn-add-store-top">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>+ Add Medical Store</span>
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
            id="store-search-input" 
            placeholder="Search by Store ID, Name, District, Type..." 
            value="${adminStore.searchQuery}"
          />
        </div>

        <div class="toolbar-filters">
          <select class="toolbar-select" id="store-type-filter">
            <option value="ALL">All Store Types</option>
            ${storeTypes.map(t => `<option value="${t}" ${selectedTypeFilter === t ? 'selected' : ''}>${t}</option>`).join('')}
          </select>

          <select class="toolbar-select" id="store-status-filter">
            <option value="ALL">All Statuses</option>
            <option value="Active" ${selectedStatusFilter === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Pending Verification" ${selectedStatusFilter === 'Pending Verification' ? 'selected' : ''}>Pending Verification</option>
            <option value="Inactive" ${selectedStatusFilter === 'Inactive' ? 'selected' : ''}>Inactive</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="data-table-wrapper">
        <table class="cb-table" id="stores-data-table">
          <thead>
            <tr>
              <th>Store ID</th>
              <th>Store Name</th>
              <th>Type</th>
              <th>District</th>
              <th>Contact</th>
              <th>Stock Status (Avail / Low / Out)</th>
              <th>Status</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${pageRecords.length === 0 ? `
              <tr>
                <td colspan="8" style="text-align: center; padding: 2.5rem; color: var(--cb-text-muted);">
                  No medical stores found matching criteria.
                </td>
              </tr>
            ` : pageRecords.map(s => `
              <tr>
                <td><span class="code-tag">${s.storeId}</span></td>
                <td>
                  <strong style="color: var(--cb-navy-900); display: block; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${s.name}">
                    ${s.name}
                  </strong>
                  <div style="font-size: 0.72rem; color: var(--cb-text-muted);">
                    Mgr: ${s.assignedManagerName || s.contactPerson || 'Unassigned'}
                  </div>
                </td>
                <td><span style="font-weight: 600; color: var(--cb-text-secondary);">${s.type}</span></td>
                <td>${s.district}</td>
                <td>
                  <div>${s.phone}</div>
                  <div style="font-size: 0.72rem; color: var(--cb-text-muted);">${s.email}</div>
                </td>
                <td>
                  <div style="font-size: 0.8rem;">
                    <span style="color: var(--cb-success-base); font-weight: 700;">${s.inventorySummary.available}</span> / 
                    <span style="color: #d97706; font-weight: 700;">${s.inventorySummary.lowStock}</span> / 
                    <span style="color: var(--cb-error-base); font-weight: 700;">${s.inventorySummary.outOfStock}</span>
                  </div>
                </td>
                <td>
                  <span class="status-pill ${s.status === 'Active' ? 'active' : (s.status === 'Pending Verification' ? 'pending' : 'inactive')}">${s.status}</span>
                </td>
                <td style="text-align: right;">
                  <div class="table-actions">
                    <button type="button" class="btn-table-action" data-action="view-store" data-id="${s.storeId}" title="View store profile and inventory breakdown">View</button>

                    ${s.status === 'Pending Verification' ? `
                      <button type="button" class="btn-table-action primary" data-action="approve-store" data-id="${s.storeId}" title="Approve and activate medical store">Approve</button>
                    ` : `
                      <button 
                        type="button" 
                        class="btn-table-action ${s.status === 'Active' ? 'danger' : 'primary'}" 
                        data-action="toggle-store-status" 
                        data-id="${s.storeId}"
                        title="${s.status === 'Active' ? 'Deactivate store' : 'Activate store'}"
                      >
                        ${s.status === 'Active' ? 'Deactivate' : 'Activate'}
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
          <span>Showing <strong>${totalRecords === 0 ? 0 : startIndex + 1}</strong> to <strong>${Math.min(startIndex + pageSize, totalRecords)}</strong> of <strong>${totalRecords}</strong> pharmacy nodes</span>
          <div class="pagination-controls">
            <button type="button" class="pagination-btn" id="btn-store-prev" ${currentPage <= 1 ? 'disabled' : ''}>Previous</button>
            <span style="padding: 0 0.5rem; font-weight: 700;">Page ${currentPage} of ${totalPages}</span>
            <button type="button" class="pagination-btn" id="btn-store-next" ${currentPage >= totalPages ? 'disabled' : ''}>Next</button>
          </div>
        </div>
      </div>
    `;

    // Bind listeners
    const searchInput = container.querySelector('#store-search-input');
    searchInput.addEventListener('input', (e) => adminStore.setSearchQuery(e.target.value));

    const typeFilter = container.querySelector('#store-type-filter');
    typeFilter.addEventListener('change', (e) => {
      selectedTypeFilter = e.target.value;
      currentPage = 1;
      render();
    });

    const statusFilter = container.querySelector('#store-status-filter');
    statusFilter.addEventListener('change', (e) => {
      selectedStatusFilter = e.target.value;
      currentPage = 1;
      render();
    });

    const addBtn = container.querySelector('#btn-add-store-top');
    if (addBtn) addBtn.addEventListener('click', () => adminStore.openModal('add-store'));

    const bulkBtn = container.querySelector('#btn-bulk-import-store-top');
    if (bulkBtn) bulkBtn.addEventListener('click', () => adminStore.setNavigation('stores', 'bulk-import'));

    const prevBtn = container.querySelector('#btn-store-prev');
    const nextBtn = container.querySelector('#btn-store-next');
    if (prevBtn) prevBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; render(); } });
    if (nextBtn) nextBtn.addEventListener('click', () => { if (currentPage < totalPages) { currentPage++; render(); } });

    // Actions
    container.querySelectorAll('[data-action="view-store"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const sid = btn.getAttribute('data-id');
        const store = adminStore.medicalStores.find(s => s.storeId === sid);
        if (store) adminStore.openDrawer('store-profile', store);
      });
    });

    container.querySelectorAll('[data-action="toggle-store-status"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const sid = btn.getAttribute('data-id');
        adminStore.toggleMedicalStoreStatus(sid);
      });
    });

    container.querySelectorAll('[data-action="approve-store"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const sid = btn.getAttribute('data-id');
        adminStore.verifyMedicalStore(sid, true);
      });
    });
  }

  render();
  adminStore.subscribe(render);

  return container;
}
