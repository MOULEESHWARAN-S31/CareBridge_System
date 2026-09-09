import { 
  createEmployeeIdField, 
  createRoleSelector, 
  createPasswordField 
} from './FormFields.js';
import { createRememberForgot } from './RememberForgot.js';
import { createLoginButton } from './LoginButton.js';
import { createSecurityNotice } from './SecurityNotice.js';
import { validateLoginForm, authenticateUser, DEMO_CREDENTIALS } from '../auth.js';

/**
 * CareBridge Hospital Dashboard — LoginCard Component
 * Houses the login form, fields, validation, error/success banners, and security notice.
 */
export function createLoginCard(onForgotPasswordClick, onLoginSuccess) {
  const card = document.createElement('div');
  card.className = 'login-card';
  card.id = 'login-card';

  // Card Header
  const header = document.createElement('div');
  header.className = 'login-card-header';
  header.innerHTML = `
    <h2 class="login-heading">Welcome Back</h2>
    <p class="login-subheading">Sign in to your CareBridge Portal</p>
  `;

  // General Alert Banner (for mock auth failure or success)
  const alertBanner = document.createElement('div');
  alertBanner.className = 'login-alert';
  alertBanner.id = 'login-alert-banner';
  alertBanner.setAttribute('role', 'alert');
  alertBanner.setAttribute('aria-live', 'polite');

  // Form Element
  const form = document.createElement('form');
  form.className = 'login-form';
  form.id = 'hospital-login-form';
  form.noValidate = true;

  // Form Fields
  const employeeIdGroup = createEmployeeIdField();
  const roleSelectorGroup = createRoleSelector();
  const passwordGroup = createPasswordField();

  // Remember Me & Forgot Password
  const rememberForgotRow = createRememberForgot(onForgotPasswordClick);

  // Login Button
  const loginButtonComp = createLoginButton();

  // Security Notice
  const securityNotice = createSecurityNotice();

  // Assemble form elements
  form.appendChild(employeeIdGroup);
  form.appendChild(roleSelectorGroup);
  form.appendChild(passwordGroup);
  form.appendChild(rememberForgotRow);
  form.appendChild(loginButtonComp.element);

  // Assemble card
  card.appendChild(header);
  card.appendChild(alertBanner);
  card.appendChild(form);
  card.appendChild(securityNotice);

  // Helper function to show alert banner
  function showAlert(message, type = 'error') {
    alertBanner.className = `login-alert show login-alert-${type}`;
    const iconSvg = type === 'error' 
      ? `<svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`
      : `<svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    
    alertBanner.innerHTML = `${iconSvg}<span>${message}</span>`;
  }

  function hideAlert() {
    alertBanner.className = 'login-alert';
    alertBanner.innerHTML = '';
  }

  // Clear specific field error
  function clearFieldError(groupElement) {
    groupElement.classList.remove('is-invalid');
  }

  // Show specific field error
  function setFieldError(groupElement, message) {
    groupElement.classList.add('is-invalid');
    const errSpan = groupElement.querySelector('.field-error-message');
    if (errSpan) errSpan.textContent = message;
  }

  // Attach live input events to clear errors on input
  const empInput = employeeIdGroup.querySelector('input');
  const passInput = passwordGroup.querySelector('input');

  empInput.addEventListener('input', () => {
    clearFieldError(employeeIdGroup);
    hideAlert();
  });

  passInput.addEventListener('input', () => {
    clearFieldError(passwordGroup);
    hideAlert();
  });

  // Handle Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();
    clearFieldError(employeeIdGroup);
    clearFieldError(passwordGroup);

    const formData = {
      employeeId: empInput.value,
      role: form.querySelector('#role-select').value,
      password: passInput.value,
      rememberMe: form.querySelector('#remember-me-checkbox').checked
    };

    // 1. Frontend Field Validation
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      if (validation.errors.employeeId) setFieldError(employeeIdGroup, validation.errors.employeeId);
      if (validation.errors.password) setFieldError(passwordGroup, validation.errors.password);
      
      // Focus first invalid field
      if (validation.errors.employeeId) empInput.focus();
      else if (validation.errors.password) passInput.focus();

      return;
    }

    // 2. Mock Authentication with Loading State
    loginButtonComp.setLoading(true);

    try {
      const result = await authenticateUser(formData);

      if (result.success) {
        showAlert(`Authentication successful as ${formData.role}. Directing to Administration...`, 'success');
        loginButtonComp.setDisabled(true);
        setTimeout(() => {
          if (typeof onLoginSuccess === 'function') {
            onLoginSuccess(formData);
          }
        }, 700);
      } else {
        showAlert(result.errorMessage, 'error');
        loginButtonComp.setLoading(false);
        passInput.focus();
      }
    } catch (err) {
      showAlert('An unexpected system error occurred. Please try again.', 'error');
      loginButtonComp.setLoading(false);
    }
  });

  return {
    element: card,
    fillDemoCredentials: () => {
      empInput.value = DEMO_CREDENTIALS.employeeId;
      passInput.value = DEMO_CREDENTIALS.password;
      const roleSelect = form.querySelector('#role-select');
      if (roleSelect) roleSelect.value = DEMO_CREDENTIALS.role;
      hideAlert();
      clearFieldError(employeeIdGroup);
      clearFieldError(passwordGroup);
    }
  };
}
