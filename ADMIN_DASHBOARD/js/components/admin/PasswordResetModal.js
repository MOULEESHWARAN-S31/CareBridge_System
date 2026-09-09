/**
 * CareBridge Admin Dashboard — PasswordResetModal Component
 * Implements Requirement 7:
 * - Admin resets password without revealing existing password
 * - Generates secure temporary password
 * - Option to force user password change on next login
 * - Option to disable/suspend account
 */

import { adminStore } from '../../store/adminStore.js';

export function createPasswordResetModal(user) {
  const overlay = document.createElement('div');
  overlay.className = 'admin-modal-overlay';
  overlay.id = 'modal-password-reset';

  let tempPassword = adminStore.generateTemporaryPassword();

  overlay.innerHTML = `
    <div class="admin-modal-card">
      <div class="admin-modal-header">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--cb-teal-600);"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <h3 class="admin-modal-title">Administrative Password Reset</h3>
        </div>
        <button type="button" class="admin-modal-close-btn" id="btn-close-pwd-reset" aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <form id="form-password-reset">
        <div class="admin-modal-body">
          <div style="background-color: var(--cb-navy-50); border: 1px solid #bfdbfe; border-radius: var(--cb-radius-md); padding: 1rem;">
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--cb-navy-800); text-transform: uppercase;">Selected Account</div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.25rem;">
              <strong style="color: var(--cb-navy-900); font-size: 0.95rem;">${user.fullName}</strong>
              <span class="code-tag">${user.userId}</span>
            </div>
            <div style="font-size: 0.78rem; color: var(--cb-text-muted); margin-top: 0.2rem;">
              Role: ${user.role} • ${user.email}
            </div>
          </div>

          <!-- Notice on existing password -->
          <div style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.8rem; color: var(--cb-text-secondary); background: #f8fafc; padding: 0.75rem; border-radius: var(--cb-radius-md); border: 1px solid var(--cb-border-subtle);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--cb-teal-600); margin-top: 2px; flex-shrink: 0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span>Under healthcare security compliance, existing user passwords are encrypted with one-way salted hashing and cannot be viewed. Generating a reset issues a one-time temporary token.</span>
          </div>

          <!-- Temporary Password Field -->
          <div class="form-field">
            <label class="field-label" for="inp-temp-pwd">
              <span>Generated Temporary Password</span>
              <button type="button" id="btn-regen-temp" style="background: none; border: none; color: var(--cb-teal-600); font-weight: 700; cursor: pointer; font-size: 0.75rem;">Regenerate</button>
            </label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="text" class="field-input" id="inp-temp-pwd" readonly value="${tempPassword}" style="font-family: monospace; font-weight: 700; background-color: #f1f5f9; letter-spacing: 0.05em;" />
              <button type="button" class="btn-secondary" id="btn-copy-temp-pwd" style="white-space: nowrap;">Copy</button>
            </div>
          </div>

          <!-- Options -->
          <div style="display: flex; flex-direction: column; gap: 0.65rem; margin-top: 0.5rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; cursor: pointer; color: var(--cb-text-secondary);">
              <input type="checkbox" id="chk-force-pwd-change" checked style="accent-color: var(--cb-teal-600); width: 16px; height: 16px;" />
              <span>Force user to set a new password upon their next login (Recommended)</span>
            </label>

            <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; cursor: pointer; color: var(--cb-error-text);">
              <input type="checkbox" id="chk-disable-account" style="accent-color: var(--cb-error-base); width: 16px; height: 16px;" />
              <span>Disable / Suspend account credentials immediately</span>
            </label>
          </div>
        </div>

        <div class="admin-modal-footer">
          <button type="button" class="btn-secondary" id="btn-cancel-pwd-reset">Cancel</button>
          <button type="submit" class="btn-primary-action" id="btn-confirm-pwd-reset">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Confirm Password Reset</span>
          </button>
        </div>
      </form>
    </div>
  `;

  const close = () => adminStore.closeModal();
  overlay.querySelector('#btn-close-pwd-reset').addEventListener('click', close);
  overlay.querySelector('#btn-cancel-pwd-reset').addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  const tempPwdInput = overlay.querySelector('#inp-temp-pwd');
  const regenBtn = overlay.querySelector('#btn-regen-temp');
  regenBtn.addEventListener('click', () => {
    tempPassword = adminStore.generateTemporaryPassword();
    tempPwdInput.value = tempPassword;
  });

  const copyBtn = overlay.querySelector('#btn-copy-temp-pwd');
  copyBtn.addEventListener('click', () => {
    navigator.clipboard?.writeText(tempPwdInput.value);
    copyBtn.textContent = 'Copied!';
    setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
  });

  const form = overlay.querySelector('#form-password-reset');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const forceChange = overlay.querySelector('#chk-force-pwd-change').checked;
    const disableAcct = overlay.querySelector('#chk-disable-account').checked;

    adminStore.resetUserPassword(user.userId, {
      temporaryPassword: tempPwdInput.value,
      forceChange
    });

    if (disableAcct && user.status === 'Active') {
      adminStore.toggleUserStatus(user.userId);
    }

    close();
  });

  return overlay;
}
