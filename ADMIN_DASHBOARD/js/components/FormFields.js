/**
 * CareBridge Dashboard — Form Fields Component
 * Contains Employee ID, Role Selector, and Password Field with toggle.
 */

// SVG Icons
const ICONS = {
  user: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  `,
  lock: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  `,
  userCheck: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <polyline points="16 11 18 13 22 9"/>
    </svg>
  `,
  chevronDown: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  `,
  eye: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  `,
  eyeOff: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
      <line x1="2" x2="22" y1="2" y2="22"/>
    </svg>
  `
};

/**
 * Employee ID Field Component
 */
export function createEmployeeIdField() {
  const group = document.createElement('div');
  group.className = 'form-group';
  group.id = 'group-employee-id';

  group.innerHTML = `
    <label class="form-label" for="employee-id-input">
      <span>Employee ID <span class="required-star" aria-hidden="true">*</span></span>
    </label>
    <div class="input-container">
      <span class="input-leading-icon" aria-hidden="true">${ICONS.user}</span>
      <input 
        type="text" 
        id="employee-id-input" 
        name="employeeId" 
        class="form-input" 
        placeholder="Enter your Employee ID" 
        autocomplete="username" 
        aria-required="true"
        aria-describedby="employee-id-error"
      />
    </div>
    <span class="field-error-message" id="employee-id-error" role="alert">Please enter your Employee ID.</span>
  `;

  return group;
}

/**
 * Role Selector Component
 * Placed cleanly between Employee ID and Password.
 */
export function createRoleSelector() {
  const group = document.createElement('div');
  group.className = 'form-group';
  group.id = 'group-role-select';

  group.innerHTML = `
    <label class="form-label" for="role-select">
      <span>Login as</span>
      <span class="role-badge-tag">Role-Based</span>
    </label>
    <div class="select-container">
      <span class="input-leading-icon" aria-hidden="true">${ICONS.userCheck}</span>
      <select id="role-select" name="role" class="form-select" aria-label="Select Role">
        <option value="Doctor" selected>Doctor</option>
        <option value="Nurse">Nurse</option>
        <option value="Pharmacist">Pharmacist</option>
        <option value="Out Patient">Out Patient</option>
      </select>
      <span class="select-arrow-icon" aria-hidden="true">${ICONS.chevronDown}</span>
    </div>
  `;

  return group;
}

/**
 * Password Field Component with Visibility Toggle
 */
export function createPasswordField() {
  const group = document.createElement('div');
  group.className = 'form-group';
  group.id = 'group-password';

  group.innerHTML = `
    <label class="form-label" for="password-input">
      <span>Password <span class="required-star" aria-hidden="true">*</span></span>
    </label>
    <div class="input-container">
      <span class="input-leading-icon" aria-hidden="true">${ICONS.lock}</span>
      <input 
        type="password" 
        id="password-input" 
        name="password" 
        class="form-input" 
        placeholder="Enter your password" 
        autocomplete="current-password" 
        aria-required="true"
        aria-describedby="password-error"
      />
      <button 
        type="button" 
        id="password-toggle-btn" 
        class="password-toggle-btn" 
        aria-label="Show password" 
        aria-pressed="false"
      >
        ${ICONS.eye}
      </button>
    </div>
    <span class="field-error-message" id="password-error" role="alert">Please enter your password.</span>
  `;

  // Attach toggle logic
  const input = group.querySelector('#password-input');
  const toggleBtn = group.querySelector('#password-toggle-btn');

  toggleBtn.addEventListener('click', () => {
    const isPassword = input.getAttribute('type') === 'password';
    if (isPassword) {
      input.setAttribute('type', 'text');
      toggleBtn.innerHTML = ICONS.eyeOff;
      toggleBtn.setAttribute('aria-label', 'Hide password');
      toggleBtn.setAttribute('aria-pressed', 'true');
    } else {
      input.setAttribute('type', 'password');
      toggleBtn.innerHTML = ICONS.eye;
      toggleBtn.setAttribute('aria-label', 'Show password');
      toggleBtn.setAttribute('aria-pressed', 'false');
    }
  });

  return group;
}
