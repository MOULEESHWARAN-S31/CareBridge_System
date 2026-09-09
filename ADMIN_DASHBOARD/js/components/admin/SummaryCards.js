/**
 * CareBridge Admin Dashboard — SummaryCards Component
 * Implements Requirement 25:
 * Top summary cards showing Total & Active counts for Users, Hospitals, and Medical Stores,
 * plus alert pills for pending verification and inactive accounts.
 */

import { adminStore } from '../../store/adminStore.js';

export function createSummaryCards() {
  const container = document.createElement('section');
  container.className = 'summary-cards-container';
  container.setAttribute('aria-label', 'Healthcare Network Summary Indicators');

  function render() {
    const stats = adminStore.getSummaryStats();

    container.innerHTML = `
      <div class="summary-cards-grid">
        <!-- Card 1: Users -->
        <div class="summary-card users-card">
          <div class="summary-card-header">
            <span class="summary-card-title">Total Users</span>
            <div class="summary-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
          </div>
          <div class="summary-card-numbers">
            <span class="summary-main-val">${stats.totalUsers.toLocaleString()}</span>
            <span class="summary-sub-stat">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              ${stats.activeUsers.toLocaleString()} Active
            </span>
          </div>
        </div>

        <!-- Card 2: Hospitals -->
        <div class="summary-card hospitals-card">
          <div class="summary-card-header">
            <span class="summary-card-title">Hospitals</span>
            <div class="summary-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9h1"/><path d="M9 13h1"/><path d="M9 17h1"/></svg>
            </div>
          </div>
          <div class="summary-card-numbers">
            <span class="summary-main-val">${stats.totalHospitals.toLocaleString()}</span>
            <span class="summary-sub-stat">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              ${stats.activeHospitals.toLocaleString()} Active
            </span>
          </div>
        </div>

        <!-- Card 3: Medical Stores -->
        <div class="summary-card stores-card">
          <div class="summary-card-header">
            <span class="summary-card-title">Medical Stores</span>
            <div class="summary-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>
            </div>
          </div>
          <div class="summary-card-numbers">
            <span class="summary-main-val">${stats.totalStores.toLocaleString()}</span>
            <span class="summary-sub-stat">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              ${stats.activeStores.toLocaleString()} Active
            </span>
          </div>
        </div>
      </div>

      <!-- Actionable Verification & Status Alerts -->
      <div class="summary-alerts-strip">
        ${stats.pendingUsers > 0 ? `
          <button type="button" class="summary-alert-pill warning" id="pill-pending-users">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>Pending User Accounts:</span>
            <span class="alert-badge-count">${stats.pendingUsers}</span>
          </button>
        ` : ''}

        ${stats.pendingHospitals > 0 ? `
          <button type="button" class="summary-alert-pill warning" id="pill-pending-hospitals">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>Hospitals Requiring Verification:</span>
            <span class="alert-badge-count">${stats.pendingHospitals}</span>
          </button>
        ` : ''}

        ${stats.pendingStores > 0 ? `
          <button type="button" class="summary-alert-pill warning" id="pill-pending-stores">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>Stores Requiring Verification:</span>
            <span class="alert-badge-count">${stats.pendingStores}</span>
          </button>
        ` : ''}

        <button type="button" class="summary-alert-pill info" id="pill-inactive-accounts">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          <span>Inactive / Suspended Accounts:</span>
          <span class="alert-badge-count">${stats.inactiveUsers}</span>
        </button>
      </div>
    `;

    // Click handlers to jump to the filtered views
    const pUsers = container.querySelector('#pill-pending-users');
    if (pUsers) pUsers.addEventListener('click', () => adminStore.setNavigation('users', 'pending'));

    const pHosps = container.querySelector('#pill-pending-hospitals');
    if (pHosps) pHosps.addEventListener('click', () => adminStore.setNavigation('hospitals', 'pending'));

    const pStores = container.querySelector('#pill-pending-stores');
    if (pStores) pStores.addEventListener('click', () => adminStore.setNavigation('stores', 'pending'));

    const pInact = container.querySelector('#pill-inactive-accounts');
    if (pInact) pInact.addEventListener('click', () => adminStore.setNavigation('users', 'inactive'));
  }

  render();
  adminStore.subscribe(render);

  return container;
}
