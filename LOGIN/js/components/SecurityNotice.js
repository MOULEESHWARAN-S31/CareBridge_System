/**
 * CareBridge Hospital Dashboard — SecurityNotice Component
 * Subtle security indicator reinforcing government healthcare standards.
 */
export function createSecurityNotice() {
  const wrapper = document.createElement('div');
  wrapper.className = 'security-notice-wrapper';
  wrapper.setAttribute('role', 'note');
  wrapper.setAttribute('aria-label', 'Security Information');

  wrapper.innerHTML = `
    <svg class="security-lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
    <div class="security-text-group">
      <span class="security-title">Secure Government Healthcare Portal</span>
      <span class="security-subtitle">Your information is protected with secure authentication.</span>
    </div>
  `;

  return wrapper;
}
