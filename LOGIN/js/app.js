import { createBrandingPanel } from './components/BrandingPanel.js';
import { createLoginCard } from './components/LoginCard.js';
import { createLogo } from './components/Logo.js';
import { createFooter } from './components/Footer.js';
import { DEMO_CREDENTIALS } from './auth.js';

/**
 * CareBridge Hospital Dashboard — Main Application Orchestrator
 * Assembles modular components into the full Login Page experience.
 */
export function initLoginPage() {
  const root = document.getElementById('app');
  root.innerHTML = '';

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
  const loginCardObj = createLoginCard(() => {
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
  });

  // Demo Credentials Helper Pill (Discreet, helpful for prototype evaluation)
  const demoHelper = document.createElement('aside');
  demoHelper.className = 'demo-helper-wrapper';
  demoHelper.setAttribute('aria-label', 'Evaluation Demo Credentials');
  demoHelper.innerHTML = `
    <div class="demo-helper-title">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
      <span>Development Accounts (Real Backend Auth):</span>
    </div>
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.25rem;">
      <button type="button" class="demo-fill-btn" id="demo-fill-admin" title="Autofill System Admin">
        Admin (Admin@123)
      </button>
      <button type="button" class="demo-fill-btn" id="demo-fill-gov" title="Autofill Government Officer">
        Government (Gov@123)
      </button>
      <button type="button" class="demo-fill-btn" id="demo-fill-doc" title="Autofill Doctor">
        EMP-8820 (Password@123)
      </button>
    </div>
  `;

  demoHelper.querySelector('#demo-fill-admin').addEventListener('click', () => {
    loginCardObj.fillDemoCredentials('admin');
  });
  demoHelper.querySelector('#demo-fill-gov').addEventListener('click', () => {
    loginCardObj.fillDemoCredentials('government');
  });
  demoHelper.querySelector('#demo-fill-doc').addEventListener('click', () => {
    loginCardObj.fillDemoCredentials('clinicalOfficer');
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
          <p>CareBridge operates in compliance with National Health Data Security Regulations. Patient health information (PHI) and clinical records accessed through this portal are protected under 256-bit encryption standards.</p>
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
  root.appendChild(pageWrapper);
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

// Bootstrap once DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLoginPage);
} else {
  initLoginPage();
}
