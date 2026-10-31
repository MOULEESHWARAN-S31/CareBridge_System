/**
 * CareBridge Admin Dashboard — AdminHeader Component
 * Top app bar displaying administration context, search, and Admin session controls.
 */

import { adminStore } from '../../store/adminStore.js';

export function createAdminHeader(onSwitchToLogin) {
  const header = document.createElement('header');
  header.className = 'admin-top-header';

  function getInitials(name) {
    if (!name) return 'AD';
    return name
      .split(' ')
      .filter(w => !w.startsWith('Dr.') && !w.startsWith('Thiru.') && !w.startsWith('Sister'))
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'AD';
  }

  function render() {
    const user = adminStore.currentUser || {
      fullName: 'Master Admin',
      role: 'Government Administrator',
      userId: 'CB-ADM-000001'
    };

    header.innerHTML = `
      <div class="admin-header-left">
        <button type="button" class="admin-mobile-menu" aria-label="Open administration navigation" aria-expanded="${adminStore.mobileMenuOpen ? 'true' : 'false'}">
          <span></span><span></span><span></span>
        </button>
        <div class="admin-header-title-group">
          <strong>System Administration</strong>
        </div>
      </div>

      <div class="admin-header-center">
        <label class="admin-global-search">
          <span class="sr-only">Search current administration module</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="search" value="${adminStore.searchQuery.replace(/"/g, '&quot;')}" placeholder="Search current module..." aria-label="Search current administration module" />
        </label>
      </div>

      <div class="admin-header-right">
        <div class="admin-profile-pill" title="Current Authenticated User: ${user.fullName} (${user.userId})">
          <div class="admin-avatar">${getInitials(user.fullName)}</div>
          <div class="admin-profile-meta">
            <span class="admin-profile-name">${user.fullName}</span>
            <span class="admin-profile-role">${user.role}</span>
          </div>
        </div>

        <button type="button" class="btn-header-action" id="btn-admin-logout" title="Sign out and return to Staff Login">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span>Sign out</span>
        </button>
      </div>
    `;

    const logoutBtn = header.querySelector('#btn-admin-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        adminStore.logAudit('LOGOUT', 'Authentication', user.userId, `User ${user.fullName} logged out`);
        adminStore.logout();
        if (typeof onSwitchToLogin === 'function') {
          onSwitchToLogin();
        }
      });
    }

    const mobileMenuBtn = header.querySelector('.admin-mobile-menu');
    mobileMenuBtn.addEventListener('click', () => adminStore.setMobileMenuOpen(!adminStore.mobileMenuOpen));

    const searchInput = header.querySelector('.admin-global-search input');
    searchInput.addEventListener('change', (event) => adminStore.setSearchQuery(event.target.value));
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        adminStore.setSearchQuery(event.target.value);
      }
    });
  }

  render();
  adminStore.subscribe(render);

  return header;
}
