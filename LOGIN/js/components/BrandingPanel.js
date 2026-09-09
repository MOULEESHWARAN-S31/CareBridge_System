import { createLogo } from './Logo.js';

/**
 * CareBridge Hospital Dashboard — BrandingPanel Component
 * Left 50% Section communicating authorized government healthcare portal.
 */
export function createBrandingPanel() {
  const panel = document.createElement('section');
  panel.className = 'branding-section';
  panel.setAttribute('aria-label', 'CareBridge Branding and Information');

  const content = document.createElement('div');
  content.className = 'branding-content';

  // Government Verification Pill
  const govBadge = document.createElement('div');
  govBadge.className = 'gov-badge';
  govBadge.innerHTML = `
    <svg class="gov-badge-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fill-rule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clip-rule="evenodd" />
    </svg>
    <span>National Healthcare Network • Authorized Portal</span>
  `;

  // Logo Wrapper
  const logoWrapper = document.createElement('div');
  logoWrapper.className = 'branding-logo-wrapper';
  const logo = createLogo();
  logoWrapper.appendChild(logo);

  // Title & Names
  const titleGroup = document.createElement('div');
  titleGroup.className = 'branding-title-group';
  
  const brandName = document.createElement('h1');
  brandName.className = 'branding-name';
  brandName.textContent = 'CareBridge';

  titleGroup.appendChild(brandName);

  // Healthcare-focused Tagline
  const tagline = document.createElement('p');
  tagline.className = 'branding-tagline';
  tagline.textContent = '“Smarter Hospital Management, Better Patient Care”';

  // Supporting Text
  const supportingText = document.createElement('p');
  supportingText.className = 'branding-supporting-text';
  supportingText.textContent = 'Secure access to hospital healthcare services and operations';

  // Subtle Healthcare Trust Signals
  const trustPoints = document.createElement('div');
  trustPoints.className = 'branding-trust-points';
  trustPoints.innerHTML = `
    <span class="trust-chip">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      Gov-Certified Protocol
    </span>
    <span class="trust-chip">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
      Role-Based Access
    </span>
  `;

  content.appendChild(govBadge);
  content.appendChild(logoWrapper);
  content.appendChild(titleGroup);
  content.appendChild(tagline);
  content.appendChild(supportingText);
  content.appendChild(trustPoints);

  panel.appendChild(content);
  return panel;
}
