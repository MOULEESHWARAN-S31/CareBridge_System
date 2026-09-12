import { createAdminDashboard } from './components/admin/AdminDashboard.js';
import { adminStore } from './store/adminStore.js';

/**
 * CareBridge Admin Dashboard — Main Application Orchestrator
 * Strictly requires ADMIN role from server-authoritative JWT.
 * Any unauthenticated access or logout redirects to CareBridge Common Login (http://localhost:3000).
 */

// Helper to decode JWT payload claims
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

let accessDeniedInfo = null;

function checkAuthFromUrlOrStorage() {
  accessDeniedInfo = null;
  const params = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.startsWith('#?') ? window.location.hash.substring(2) : '');
  const urlToken = params.get('token') || hashParams.get('token');
  const urlUserStr = params.get('user') || hashParams.get('user');

  // Ingest URL token handoff
  if (urlToken) {
    try {
      localStorage.setItem('cb_auth_token', urlToken);
      sessionStorage.setItem('cb_auth_token', urlToken);

      if (urlUserStr) {
        localStorage.setItem('cb_auth_user', urlUserStr);
        sessionStorage.setItem('cb_auth_user', urlUserStr);
      }
    } catch (e) {
      console.warn('Failed storing auth params from URL:', e);
    }
  }

  // Requirement 5: Immediately remove token/user parameters from browser URL
  if (urlToken || urlUserStr || window.location.search.includes('token=')) {
    const cleanHash = window.location.hash.startsWith('#admin') ? window.location.hash : '#admin';
    window.history.replaceState({}, document.title, window.location.pathname + cleanHash);
  }

  const token = localStorage.getItem('cb_auth_token') || sessionStorage.getItem('cb_auth_token');
  const storedUserStr = localStorage.getItem('cb_auth_user') || sessionStorage.getItem('cb_auth_user');

  // Requirement 9: Unauthenticated access must redirect to http://localhost:3000
  if (!token) {
    return false;
  }

  // Requirement 3: Role must be server-authoritative (from backend-signed JWT)
  const jwtPayload = parseJwt(token);
  const serverRole = (jwtPayload?.role || '').toUpperCase();

  let user = null;
  try {
    user = storedUserStr ? JSON.parse(storedUserStr) : jwtPayload;
  } catch (e) {
    user = jwtPayload;
  }

  // Requirement 4 & 9: Authenticated GOVERNMENT users must receive Access Denied. Strictly require ADMIN.
  if (serverRole !== 'ADMIN') {
    accessDeniedInfo = {
      role: serverRole || user?.role || 'UNKNOWN',
      message: `Access Denied: Admin Dashboard requires the ADMIN role. Your current server-authenticated role is "${serverRole || user?.role || 'UNKNOWN'}". Government health officers must use the Government Dashboard.`
    };
    return false;
  }

  adminStore.setCurrentUser({
    userId: jwtPayload?.employeeId || user?.employee_id || user?.employeeId || user?.username || 'CB-ADM-000001',
    employeeId: jwtPayload?.employeeId || user?.employee_id || user?.employeeId || 'ADM-001',
    fullName: jwtPayload?.name || user?.full_name || user?.name || user?.username || 'Master Administrator',
    role: 'Master Admin',
    email: jwtPayload?.email || user?.email || 'admin@carebridge.local',
    district: jwtPayload?.district || user?.district || 'State Level',
    status: 'Active'
  });

  // Fetch live backend datasets
  adminStore.initFromBackend();
  return true;
}

function getRouteFromHash() {
  const hash = window.location.hash;
  if (hash === '#admin/hospitals/bulk-import') {
    adminStore.setNavigation('hospitals', 'bulk-import');
  } else if (hash === '#admin/stores/bulk-import') {
    adminStore.setNavigation('stores', 'bulk-import');
  }
  return 'admin';
}

export function navigateTo(route) {
  window.location.hash = '#admin';
  renderApp();
}

function handleLogout() {
  localStorage.removeItem('cb_auth_token');
  localStorage.removeItem('cb_auth_user');
  sessionStorage.removeItem('cb_auth_token');
  sessionStorage.removeItem('cb_auth_user');
  adminStore.logout();
  window.location.href = 'http://localhost:3000';
}

function createAccessDeniedElement(info) {
  const wrapper = document.createElement('div');
  wrapper.className = 'admin-access-denied';
  wrapper.style.cssText = 'min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0b1329; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 1.5rem;';
  
  wrapper.innerHTML = `
    <div style="background: #131e3a; border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 1rem; max-width: 440px; width: 100%; text-align: center; padding: 2rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
      <div style="width: 4rem; height: 4rem; background: rgba(239, 68, 68, 0.15); color: #f87171; border-radius: 1rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; font-size: 2rem; font-weight: 900;">✕</div>
      <h2 style="font-size: 1.4rem; font-weight: 800; color: #f87171; margin-bottom: 0.75rem;">Access Denied</h2>
      <p style="font-size: 0.875rem; color: #cbd5e1; line-height: 1.6; margin-bottom: 1.5rem;">${info.message}</p>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <a href="http://localhost:5174/dashboard" style="display: block; width: 100%; padding: 0.75rem; background: #0d9488; color: #ffffff; font-weight: 700; border-radius: 0.75rem; text-decoration: none; font-size: 0.875rem; transition: background 0.2s;">Go to Government Dashboard (:5174)</a>
        <a href="http://localhost:3000" style="display: block; width: 100%; padding: 0.75rem; background: #334155; color: #e2e8f0; font-weight: 700; border-radius: 0.75rem; text-decoration: none; font-size: 0.875rem; transition: background 0.2s;">Return to Common Login (:3000)</a>
      </div>
    </div>
  `;
  return wrapper;
}

function renderApp() {
  const root = document.getElementById('app');
  if (!root) return;
  root.innerHTML = '';

  const isAuth = checkAuthFromUrlOrStorage();

  if (accessDeniedInfo) {
    root.appendChild(createAccessDeniedElement(accessDeniedInfo));
    return;
  }

  if (!isAuth) {
    window.location.href = 'http://localhost:3000';
    return;
  }

  getRouteFromHash();
  const adminDashboard = createAdminDashboard(handleLogout);
  root.appendChild(adminDashboard);
}

// Respond to hash changes
window.addEventListener('hashchange', () => {
  renderApp();
});

// Bootstrap on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
