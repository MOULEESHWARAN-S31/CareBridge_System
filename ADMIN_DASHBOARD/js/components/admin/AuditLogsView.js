/**
 * CareBridge Admin Dashboard — AuditLogsView Component
 * Implements Requirement 27:
 * Chronological immutable audit trail of administrative operations across:
 * - Admin ID
 * - Action
 * - Module
 * - Record ID
 * - Timestamp
 * - Result (SUCCESS / WARNING / FAILED)
 */

import { adminStore } from '../../store/adminStore.js';

export function createAuditLogsView() {
  const container = document.createElement('section');
  container.className = 'module-view-container';
  container.setAttribute('aria-label', 'System Activity and Audit Logs');

  let selectedModuleFilter = 'ALL';

  function render() {
    let logs = [...adminStore.auditLogs];

    if (selectedModuleFilter !== 'ALL') {
      logs = logs.filter(l => l.module === selectedModuleFilter);
    }

    const q = adminStore.searchQuery.trim().toLowerCase();
    if (q) {
      logs = logs.filter(l => 
        l.action.toLowerCase().includes(q) ||
        l.module.toLowerCase().includes(q) ||
        l.recordId.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q) ||
        l.adminId.toLowerCase().includes(q)
      );
    }

    container.innerHTML = `
      <div class="module-header-container">
        <div class="module-title-group">
          <h2 class="module-main-title">Activity & Audit Logs</h2>
          <span class="module-subtitle">Chronological, tamper-evident audit history of all master record modifications, account provisions, and security changes.</span>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="table-toolbar-card">
        <div class="toolbar-search-box">
          <svg class="toolbar-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            type="text" 
            class="toolbar-search-input" 
            id="audit-search-input" 
            placeholder="Search by action, record ID, or details..." 
            value="${adminStore.searchQuery}"
          />
        </div>

        <div class="toolbar-filters">
          <select class="toolbar-select" id="audit-module-filter">
            <option value="ALL">All Modules</option>
            <option value="User Management" ${selectedModuleFilter === 'User Management' ? 'selected' : ''}>User Management</option>
            <option value="Hospital Management" ${selectedModuleFilter === 'Hospital Management' ? 'selected' : ''}>Hospital Management</option>
            <option value="Medical Store Management" ${selectedModuleFilter === 'Medical Store Management' ? 'selected' : ''}>Medical Store Management</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="data-table-wrapper">
        <table class="cb-table" id="audit-logs-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Admin ID</th>
              <th>Module</th>
              <th>Action</th>
              <th>Record ID</th>
              <th>Operational Details</th>
              <th style="text-align: right;">Result</th>
            </tr>
          </thead>
          <tbody>
            ${logs.length === 0 ? `
              <tr>
                <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--cb-text-muted);">
                  No audit trail events found matching criteria.
                </td>
              </tr>
            ` : logs.map(l => `
              <tr>
                <td style="white-space: nowrap; font-variant-numeric: tabular-nums;">
                  <strong>${l.timestamp}</strong>
                </td>
                <td><code>${l.adminId}</code></td>
                <td><span style="font-weight: 600; color: var(--cb-navy-800);">${l.module}</span></td>
                <td><span class="code-tag">${l.action}</span></td>
                <td><strong>${l.recordId}</strong></td>
                <td><span style="font-size: 0.8rem; color: var(--cb-text-secondary);">${l.details}</span></td>
                <td style="text-align: right;">
                  <span class="audit-pill ${l.result.toLowerCase()}">${l.result}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="table-pagination-bar">
          <span>Displaying <strong>${logs.length}</strong> logged administrative compliance events</span>
        </div>
      </div>
    `;

    const searchInput = container.querySelector('#audit-search-input');
    searchInput.addEventListener('input', (e) => adminStore.setSearchQuery(e.target.value));

    const modFilter = container.querySelector('#audit-module-filter');
    modFilter.addEventListener('change', (e) => {
      selectedModuleFilter = e.target.value;
      render();
    });
  }

  render();
  adminStore.subscribe(render);

  return container;
}
