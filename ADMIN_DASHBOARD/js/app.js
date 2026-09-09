import { createBrandingPanel } from './components/BrandingPanel.js';
import { createLoginCard } from './components/LoginCard.js';
import { createLogo } from './components/Logo.js';
import { createFooter } from './components/Footer.js';
import { createAdminDashboard } from './components/admin/AdminDashboard.js';
import { DEMO_CREDENTIALS } from './auth.js';
import { adminStore } from './store/adminStore.js';

/**
 * CareBridge Platform — Main Application Router & Orchestrator
 * Routes between Staff Login Page and Master Admin Dashboard seamlessly.
 */

// Check and ingest authentication from query parameters or local storage
function checkAuthFromUrlOrStorage() {
  const params = new URLSearchParams(window.location.search);
  const urlToken = params.get('token');
  const urlUserStr = params.get('user');

  if (urlToken) {
    try {
      localStorage.setItem('cb_auth_token', urlToken);
      sessionStorage.setItem('cb_auth_token', urlToken);

      if (urlUserStr) {
        localStorage.setItem('cb_auth_user', urlUserStr);
        sessionStorage.setItem('cb_auth_user', urlUserStr);
        const parsed = JSON.parse(urlUserStr);
        adminStore.setCurrentUser({
          userId: parsed.employee_id || parsed.employeeId || parsed.username || 'CB-ADM-000001',
          employeeId: parsed.employee_id || parsed.employeeId || 'ADM-001',
          fullName: parsed.full_name || parsed.name || parsed.username || 'Master Administrator',
          role: 'Master Admin',
          email: parsed.email || 'admin@carebridge.local',
          district: parsed.district || 'State Level',
          status: 'Active'
        });
      }

      const cleanUrl = window.location.pathname + (window.location.hash || '#admin');
      window.history.replaceState({}, document.title, cleanUrl);
    } catch (e) {
      console.warn('Failed parsing auth params from URL:', e);
    }
  } else {
    const storedUserStr = localStorage.getItem('cb_auth_user') || sessionStorage.getItem('cb_auth_user');
    if (storedUserStr) {
      try {
        const parsed = JSON.parse(storedUserStr);
        adminStore.setCurrentUser({
          userId: parsed.employee_id || parsed.employeeId || parsed.username || 'CB-ADM-000001',
          employeeId: parsed.employee_id || parsed.employeeId || 'ADM-001',
          fullName: parsed.full_name || parsed.name || parsed.username || 'Master Administrator',
          role: 'Master Admin',
          email: parsed.email || 'admin@carebridge.local',
          district: parsed.district || 'State Level',
          status: 'Active'
        });
      } catch (e) {
        console.warn('Failed parsing stored user:', e);
      }
    }
  }

  // Fetch live backend datasets if token exists or on initial load
  adminStore.initFromBackend();
}

checkAuthFromUrlOrStorage();

function getRouteFromHash() {
  const hash = window.location.hash;
  const token = localStorage.getItem('cb_auth_token') || sessionStorage.getItem('cb_auth_token');

  if (hash === '#admin/hospitals/bulk-import') {
    adminStore.setNavigation('hospitals', 'bulk-import');
    return 'admin';
  }
  if (hash === '#admin/stores/bulk-import') {
    adminStore.setNavigation('stores', 'bulk-import');
    return 'admin';
  }
  if (hash.startsWith('#admin')) {
    return 'admin';
  }
  if (hash === '#login') {
    return 'login';
  }
  // Default to admin if authenticated
  if (token) {
    return 'admin';
  }
  return 'login';
}

let currentRoute = getRouteFromHash();

export function navigateTo(route) {
  currentRoute = route;
  window.location.hash = route === 'admin' ? '#admin' : '#login';
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

function renderApp() {
  const root = document.getElementById('app');
  root.innerHTML = '';

  if (currentRoute === 'admin') {
    // Render Admin Dashboard with connected sign out
    const adminDashboard = createAdminDashboard(handleLogout);
    root.appendChild(adminDashboard);
  } else {
    // Render Staff Login Page
    const loginPage = createLoginPageElement();
    root.appendChild(loginPage);
  }
}

function createLoginPageElement() {
  const pageWrapper = document.createElement('div');
  pageWrapper.className = 'login-page-wrapper';

  const mainContainer = document.createElement('main');
  mainContainer.className = 'login-main-container';

  // 1. Left Section — Branding (50%)
  const brandingPanel = createBrandingPanel();

  // 2. Right Section — Login Form (50%)
  const formSection = document.createElement('section');
  formSection.className = 'form-section';
  formSection.setAttribute('aria-label', 'Hospital Staff Sign In Form');

  // Mobile-only Brand Header (visible when screen < 840px)
  const mobileHeader = document.createElement('div');
  mobileHeader.className = 'mobile-brand-header';
  const mobileLogo = createLogo({ isMobile: true });
  mobileHeader.appendChild(mobileLogo);
  const mobileName = document.createElement('h1');
  mobileName.className = 'mobile-brand-name';
  mobileName.textContent = 'CareBridge';
  mobileHeader.appendChild(mobileName);

  // Modal handler for dialogs (Forgot Password, Privacy, Terms, Help)
  const modal = createModalDialog();
  document.body.appendChild(modal.element);

  const openInfoModal = (title, bodyHtml) => {
    modal.open(title, bodyHtml);
  };

  // Login Card
  const loginCardObj = createLoginCard(
    () => {
      openInfoModal(
        'Account Password Recovery',
        `
          <p>For security compliance across the national healthcare network, password resets must be verified through your registered identity coordinator.</p>
          <br/>
          <p><strong>Option 1:</strong> Contact your Internal IT Helpdesk at extension <strong>#4400</strong>.</p>
          <p><strong>Option 2:</strong> Submit an authorization request through your departmental clinical administrator.</p>
          <br/>
          <p style="font-size: 0.8rem; color: #64748b;">Reference ID: AUTH-SEC-${Math.floor(100000 + Math.random() * 900000)}</p>
        `
      );
    },
    (formData) => {
      // Transition to Master Admin Dashboard
      navigateTo('admin');
    }
  );

  // Demo Credentials Helper Pill (with instant jump to Master Admin)
  const demoHelper = document.createElement('aside');
  demoHelper.className = 'demo-helper-wrapper';
  demoHelper.setAttribute('aria-label', 'Evaluation Demo Credentials');
  demoHelper.innerHTML = `
    <div class="demo-helper-title">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
      <span>Demo: <code>${DEMO_CREDENTIALS.employeeId}</code> / <code>${DEMO_CREDENTIALS.password}</code></span>
    </div>
    <div style="display: flex; gap: 0.4rem; align-items: center;">
      <button type="button" class="demo-fill-btn" id="demo-fill-btn" title="Autofill test credentials">
        Autofill
      </button>
      <button type="button" class="demo-fill-btn" id="btn-admin-direct-launch" style="background: var(--cb-navy-800); color: #ffffff; border-color: var(--cb-navy-900);" title="Directly launch Master Administration Dashboard">
        Master Admin →
      </button>
    </div>
  `;

  demoHelper.querySelector('#demo-fill-btn').addEventListener('click', () => {
    loginCardObj.fillDemoCredentials();
  });

  demoHelper.querySelector('#btn-admin-direct-launch').addEventListener('click', () => {
    navigateTo('admin');
  });

  formSection.appendChild(mobileHeader);
  formSection.appendChild(loginCardObj.element);
  formSection.appendChild(demoHelper);

  // Assemble Main Split
  mainContainer.appendChild(brandingPanel);
  mainContainer.appendChild(formSection);

  // 3. Footer
  const footer = createFooter((id, label) => {
    if (id === 'privacy') {
      openInfoModal(
        'Privacy Policy — Government Healthcare Platform',
        `
          <p>CareBridge operates in compliance with National Health Data Security Regulations. Patient health information (PHI) and clinical records accessed through this portal are protected under strict cryptographic standards.</p>
          <br/>
          <p>All staff login events, credential verifications, and operational sessions are logged and audited in accordance with federal healthcare cybersecurity guidelines.</p>
        `
      );
    } else if (id === 'terms') {
      openInfoModal(
        'Terms of Authorized Use',
        `
          <p>Access to this portal is strictly restricted to verified personnel of authorized hospital networks. Unauthorized access attempts are monitored and subject to disciplinary action and statutory penalties.</p>
          <br/>
          <p>Hospital staff must safeguard session credentials and ensure logout after concluding clinical and administrative duties.</p>
        `
      );
    } else if (id === 'support') {
      openInfoModal(
        'CareBridge Hospital Staff Help & Support',
        `
          <p>Need assistance accessing your hospital department portal?</p>
          <br/>
          <p><strong>National Healthcare Helpdesk:</strong> 1800-419-CARE (24/7)</p>
          <p><strong>Technical Support Email:</strong> support@carebridge.gov.health</p>
          <p><strong>System Status:</strong> All regional healthcare nodes operational (99.98% uptime)</p>
        `
      );
    }
  });

  pageWrapper.appendChild(mainContainer);
  pageWrapper.appendChild(footer);
  return pageWrapper;
}

/**
 * Reusable accessible modal dialog
 */
function createModalDialog() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-hidden', 'true');

  overlay.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <h3 class="modal-title" id="modal-title">Notice</h3>
        <button type="button" class="modal-close-btn" id="modal-close-btn" aria-label="Close dialog">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" id="modal-body-content"></div>
    </div>
  `;

  const closeBtn = overlay.querySelector('#modal-close-btn');
  const titleEl = overlay.querySelector('#modal-title');
  const bodyEl = overlay.querySelector('#modal-body-content');

  function close() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      close();
    }
  });

  return {
    element: overlay,
    open: (title, htmlContent) => {
      titleEl.textContent = title;
      bodyEl.innerHTML = htmlContent;
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
      closeBtn.focus();
    },
    close
  };
}

// Respond to hash changes
window.addEventListener('hashchange', () => {
  const route = getRouteFromHash();
  if (route !== currentRoute) {
    currentRoute = route;
    renderApp();
  }
});

// Bootstrap on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
