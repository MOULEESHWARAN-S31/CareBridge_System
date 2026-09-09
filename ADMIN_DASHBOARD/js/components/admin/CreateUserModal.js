/**
 * CareBridge Admin Dashboard — CreateUserModal Component
 * Implements Requirements 4, 5, 6:
 * - Full Name, Employee ID, Mobile, Email, Role, District
 * - Dynamic cascading Organization Type -> Organization selector
 * - Dual User ID options: Custom entry OR 1-click "Generate User ID" (ensures uniqueness)
 * - Password Management: Temporary password generation, strength meter, show/hide, confirm password
 */

import { adminStore } from '../../store/adminStore.js';

export function createCreateUserModal() {
  const overlay = document.createElement('div');
  overlay.className = 'admin-modal-overlay';
  overlay.id = 'modal-create-user';

  let currentRole = adminStore.roles[0];
  let currentOrgType = 'Hospital';
  let generatedUserId = adminStore.generateUserId(currentRole);

  overlay.innerHTML = `
    <div class="admin-modal-card wide">
      <div class="admin-modal-header">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--cb-teal-600);"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          <h3 class="admin-modal-title">Create Healthcare User Account</h3>
        </div>
        <button type="button" class="admin-modal-close-btn" id="btn-close-create-user" aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <form id="form-create-user">
        <div class="admin-modal-body">
          <!-- Section 1: Personal & Role Identity -->
          <div class="form-section-heading">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <span>Personal Details & Role Category</span>
          </div>

          <div class="form-grid-2">
            <div class="form-field">
              <label class="field-label" for="inp-user-fullname">Full Name *</label>
              <input type="text" class="field-input" id="inp-user-fullname" required placeholder="e.g. Dr. K. Meenakshi Sundaram" />
            </div>

            <div class="form-field">
              <label class="field-label" for="inp-user-empid">Employee ID *</label>
              <input type="text" class="field-input" id="inp-user-empid" required placeholder="e.g. EMP-DOC-512" />
            </div>

            <div class="form-field">
              <label class="field-label" for="inp-user-mobile">Mobile Number *</label>
              <input type="tel" class="field-input" id="inp-user-mobile" required placeholder="e.g. +91 98420 12345" />
            </div>

            <div class="form-field">
              <label class="field-label" for="inp-user-email">Email Address *</label>
              <input type="email" class="field-input" id="inp-user-email" required placeholder="e.g. meenakshi.s@carebridge.tn.gov" />
            </div>

            <div class="form-field">
              <label class="field-label" for="sel-user-role">Role *</label>
              <select class="field-select" id="sel-user-role">
                ${adminStore.roles.map(r => `<option value="${r}">${r}</option>`).join('')}
              </select>
            </div>

            <div class="form-field">
              <label class="field-label" for="sel-user-district">District *</label>
              <select class="field-select" id="sel-user-district">
                ${adminStore.districts.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
              </select>
            </div>
          </div>

          <!-- Section 2: Dynamic Cascading Organization Assignment -->
          <div class="form-section-heading">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>
            <span>Institutional Association (Cascading)</span>
          </div>

          <div class="form-grid-2">
            <div class="form-field">
              <label class="field-label" for="sel-user-org-type">Organization Type *</label>
              <select class="field-select" id="sel-user-org-type">
                ${adminStore.organizationTypes.map(ot => `<option value="${ot}" ${ot === 'Hospital' ? 'selected' : ''}>${ot}</option>`).join('')}
              </select>
            </div>

            <div class="form-field">
              <label class="field-label" for="sel-user-org" id="lbl-org-select">Select Organization *</label>
              <select class="field-select" id="sel-user-org">
                <!-- Dynamically populated -->
              </select>
            </div>
          </div>

          <!-- Section 3: Credentials & Password Management -->
          <div class="form-section-heading">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>User ID & Secure Password Credentials</span>
          </div>

          <div class="form-grid-2">
            <div class="form-field full-width">
              <label class="field-label" for="inp-user-id">
                <span>Username / User ID * (Unique Identifier)</span>
                <span style="font-weight: 400; color: var(--cb-text-muted);">Custom or Generated</span>
              </label>
              <div class="user-id-generator-row">
                <input type="text" class="field-input" id="inp-user-id" required value="${generatedUserId}" placeholder="e.g. HOS-SLM-001 or CB-HOS-000245" />
                <button type="button" class="btn-generate-id" id="btn-trigger-gen-id">Generate User ID</button>
              </div>
            </div>

            <div class="form-field">
              <label class="field-label" for="inp-user-pwd">
                <span>Password *</span>
                <button type="button" id="btn-gen-temp-pwd" style="background: none; border: none; color: var(--cb-teal-600); font-weight: 700; cursor: pointer; font-size: 0.75rem;">Generate Temp Password</button>
              </label>
              <div style="position: relative;">
                <input type="password" class="field-input" id="inp-user-pwd" required placeholder="Minimum 8 characters" />
                <button type="button" id="btn-toggle-create-pwd" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #64748b;">
                  👁
                </button>
              </div>

              <!-- Password Strength Meter (Section 6) -->
              <div class="password-strength-box">
                <div class="strength-bar-track">
                  <div class="strength-bar-fill" id="pwd-strength-bar"></div>
                </div>
                <div class="strength-meta-text">
                  <span id="pwd-strength-label">Strength: None</span>
                  <span id="pwd-req-hint">Req: 8+ chars, upper, lower, num, special</span>
                </div>
              </div>
            </div>

            <div class="form-field">
              <label class="field-label" for="inp-user-confirm-pwd">Confirm Password *</label>
              <input type="password" class="field-input" id="inp-user-confirm-pwd" required placeholder="Confirm password" />
              <div id="pwd-match-error" style="color: var(--cb-error-base); font-size: 0.72rem; font-weight: 600; display: none; margin-top: 0.2rem;">
                Passwords do not match!
              </div>
            </div>
          </div>
        </div>

        <div class="admin-modal-footer">
          <button type="button" class="btn-secondary" id="btn-cancel-create-user">Cancel</button>
          <button type="submit" class="btn-primary-action" id="btn-submit-create-user">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Create User Account</span>
          </button>
        </div>
      </form>
    </div>
  `;

  // Organization Cascading Logic
  const orgTypeSelect = overlay.querySelector('#sel-user-org-type');
  const orgSelect = overlay.querySelector('#sel-user-org');
  const orgLabel = overlay.querySelector('#lbl-org-select');

  function updateOrgOptions(orgType) {
    orgSelect.innerHTML = '';
    orgLabel.textContent = `Select ${orgType} *`;

    if (orgType === 'Hospital') {
      adminStore.hospitals.forEach(h => {
        const opt = document.createElement('option');
        opt.value = h.id;
        opt.textContent = `${h.name} (${h.type})`;
        opt.setAttribute('data-name', h.name);
        orgSelect.appendChild(opt);
      });
    } else if (orgType === 'Medical Store') {
      adminStore.medicalStores.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = `${s.name} (${s.type})`;
        opt.setAttribute('data-name', s.name);
        orgSelect.appendChild(opt);
      });
    } else if (orgType === 'PHC') {
      const phcs = [
        'Suramangalam Urban Primary Health Centre, Salem',
        'Kandhampatty PHC, Salem',
        'Kannankurichi Rural PHC, Salem',
        'Mecheri Block PHC, Mettur'
      ];
      phcs.forEach((p, i) => {
        const opt = document.createElement('option');
        opt.value = `phc-${i + 1}`;
        opt.textContent = p;
        opt.setAttribute('data-name', p);
        orgSelect.appendChild(opt);
      });
    } else if (orgType === 'Diagnostic Centre') {
      const diags = [
        'Salem District Clinical Diagnostic Center',
        'GMKMC Advanced Radiology & Pathology Core',
        'Mettur Taluk Community Diagnostic Lab'
      ];
      diags.forEach((d, i) => {
        const opt = document.createElement('option');
        opt.value = `diag-${i + 1}`;
        opt.textContent = d;
        opt.setAttribute('data-name', d);
        orgSelect.appendChild(opt);
      });
    } else {
      // Government Office
      const offices = [
        'Directorate of Health Services, Tamil Nadu',
        'Salem District Collectorate - Health Cell',
        'National Health Mission State Office'
      ];
      offices.forEach((o, i) => {
        const opt = document.createElement('option');
        opt.value = `gov-${i + 1}`;
        opt.textContent = o;
        opt.setAttribute('data-name', o);
        orgSelect.appendChild(opt);
      });
    }
  }

  updateOrgOptions('Hospital');

  orgTypeSelect.addEventListener('change', (e) => {
    updateOrgOptions(e.target.value);
  });

  // User ID Generation Button
  const userIdInput = overlay.querySelector('#inp-user-id');
  const roleSelect = overlay.querySelector('#sel-user-role');
  const genIdBtn = overlay.querySelector('#btn-trigger-gen-id');

  genIdBtn.addEventListener('click', () => {
    userIdInput.value = adminStore.generateUserId(roleSelect.value);
  });

  roleSelect.addEventListener('change', () => {
    // Proactively suggest prefix matching role
    userIdInput.value = adminStore.generateUserId(roleSelect.value);
  });

  // Password Strength & Generator
  const pwdInput = overlay.querySelector('#inp-user-pwd');
  const confirmPwdInput = overlay.querySelector('#inp-user-confirm-pwd');
  const strengthBar = overlay.querySelector('#pwd-strength-bar');
  const strengthLabel = overlay.querySelector('#pwd-strength-label');
  const togglePwdBtn = overlay.querySelector('#btn-toggle-create-pwd');
  const genTempPwdBtn = overlay.querySelector('#btn-gen-temp-pwd');
  const matchError = overlay.querySelector('#pwd-match-error');

  function updateStrength() {
    const analysis = adminStore.checkPasswordStrength(pwdInput.value);
    strengthBar.className = `strength-bar-fill ${analysis.label.toLowerCase()}`;
    strengthLabel.textContent = `Strength: ${analysis.label}`;
  }

  pwdInput.addEventListener('input', updateStrength);

  genTempPwdBtn.addEventListener('click', () => {
    const temp = adminStore.generateTemporaryPassword();
    pwdInput.value = temp;
    confirmPwdInput.value = temp;
    pwdInput.setAttribute('type', 'text');
    confirmPwdInput.setAttribute('type', 'text');
    updateStrength();
  });

  togglePwdBtn.addEventListener('click', () => {
    const isPass = pwdInput.getAttribute('type') === 'password';
    pwdInput.setAttribute('type', isPass ? 'text' : 'password');
    confirmPwdInput.setAttribute('type', isPass ? 'text' : 'password');
  });

  // Close handlers
  const close = () => adminStore.closeModal();
  overlay.querySelector('#btn-close-create-user').addEventListener('click', close);
  overlay.querySelector('#btn-cancel-create-user').addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  // Form Submit
  const form = overlay.querySelector('#form-create-user');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (pwdInput.value !== confirmPwdInput.value) {
      matchError.style.display = 'block';
      confirmPwdInput.focus();
      return;
    }
    matchError.style.display = 'none';

    const strength = adminStore.checkPasswordStrength(pwdInput.value);
    if (!strength.isValid) {
      alert(`Password does not meet requirements:\n- ${strength.issues.join('\n- ')}`);
      pwdInput.focus();
      return;
    }

    const selectedOrgOpt = orgSelect.options[orgSelect.selectedIndex];
    const userData = {
      fullName: overlay.querySelector('#inp-user-fullname').value,
      employeeId: overlay.querySelector('#inp-user-empid').value,
      mobileNumber: overlay.querySelector('#inp-user-mobile').value,
      email: overlay.querySelector('#inp-user-email').value,
      role: roleSelect.value,
      district: overlay.querySelector('#sel-user-district').value,
      orgType: orgTypeSelect.value,
      assignedOrgId: orgSelect.value,
      assignedOrgName: selectedOrgOpt ? selectedOrgOpt.getAttribute('data-name') : '',
      userId: userIdInput.value,
      password: pwdInput.value,
      status: 'Active',
      forcePasswordChange: true
    };

    adminStore.createUser(userData);
    close();
  });

  return overlay;
}
