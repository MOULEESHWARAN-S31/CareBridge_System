/**
 * CareBridge Admin Dashboard — RolesPermissions Component
 * Implements Requirement 8:
 * Configurable matrix of roles & operational permissions across the 10 CareBridge healthcare tiers.
 */

import { adminStore } from '../../store/adminStore.js';

export function createRolesPermissionsView() {
  const container = document.createElement('section');
  container.className = 'module-view-container';
  container.setAttribute('aria-label', 'Roles and Permissions Configuration');

  function render() {
    const roles = Object.keys(adminStore.rolePermissions);

    container.innerHTML = `
      <div class="module-header-container">
        <div class="module-title-group">
          <h2 class="module-main-title">Roles & Access Permissions Matrix</h2>
          <span class="module-subtitle">Authoritative role-based access control (RBAC) definitions governing clinical, operational, and administrative scopes.</span>
        </div>
      </div>

      <div class="permissions-matrix-container">
        <div style="background-color: var(--cb-navy-50); border: 1px solid #bfdbfe; border-radius: var(--cb-radius-md); padding: 1rem; display: flex; align-items: flex-start; gap: 0.75rem;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--cb-navy-800); margin-top: 2px; flex-shrink: 0;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <div style="font-size: 0.83rem; color: var(--cb-navy-900);">
            <strong>Zero-Trust Government Healthcare Security Policy:</strong>
            User permissions are strictly enforced based on organizational tier (Hospital, PHC, Pharmacy, or State Agency). An account assigned to a specific hospital or pharmacy can only access records pertinent to their designated facility.
          </div>
        </div>

        <div class="role-card-grid">
          ${roles.map(roleName => {
            const perms = adminStore.rolePermissions[roleName];
            return `
              <div class="role-permission-card">
                <div class="role-card-header">
                  <span class="role-card-title">${roleName}</span>
                  <span class="code-tag">${perms.length} Permissions</span>
                </div>
                <ul class="permission-bullet-list">
                  ${perms.map(p => `
                    <li class="permission-bullet-item">
                      <svg class="permission-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>${p}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  render();
  adminStore.subscribe(render);

  return container;
}
