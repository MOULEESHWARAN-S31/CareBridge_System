/**
 * CareBridge Admin Dashboard — AdminHeader Component
 * Top app bar displaying official branding emblem, real-time clock, system status, and Admin session controls.
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
      <div class="admin-header-brand">
        <img src="./assets/logo.png" alt="CareBridge Emblem" class="admin-header-logo" />
        <div class="admin-brand-text">
          <span class="admin-brand-title">CareBridge</span>
          <span class="admin-brand-subtitle">Master Administration</span>
        </div>
      </div>

      <div class="admin-header-center">
        <div class="admin-network-badge">
          <span class="status-dot-pulse"></span>
          <span>Tamil Nadu Healthcare Mesh • Operational (99.98%)</span>
        </div>
      </div>

      <div class="admin-header-right">
        <div class="admin-clock" id="admin-live-clock">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span id="live-time-str">--:--:--</span>
        </div>

        <div class="admin-profile-pill" title="Current Authenticated User: ${user.fullName} (${user.userId})">
          <div class="admin-avatar">${getInitials(user.fullName)}</div>
          <div class="admin-profile-meta">
            <span class="admin-profile-name">${user.fullName}</span>
            <span class="admin-profile-role">${user.role}</span>
          </div>
        </div>

        <button type="button" class="btn-header-action" id="btn-admin-logout" title="Sign out and return to Staff Login">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span>Sign Out / Login</span>
        </button>
      </div>
    `;

    // Live clock ticker
    const clockSpan = header.querySelector('#live-time-str');
    if (clockSpan) {
      const updateClock = () => {
        const now = new Date();
        clockSpan.textContent = now.toLocaleTimeString('en-IN', { hour12: false });
      };
      updateClock();
    }

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
  }

  render();
  const intervalId = setInterval(() => {
    const clockSpan = header.querySelector('#live-time-str');
    if (clockSpan) {
      const now = new Date();
      clockSpan.textContent = now.toLocaleTimeString('en-IN', { hour12: false });
    }
  }, 1000);

  adminStore.subscribe(render);

  return header;
}
