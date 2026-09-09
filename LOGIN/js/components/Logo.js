/**
 * CareBridge Hospital Dashboard — Logo Component
 * Loads the official logo.png from assets without altering, cropping, or modifying it.
 */
export function createLogo(options = {}) {
  const { className = 'official-logo', isMobile = false } = options;

  const img = document.createElement('img');
  img.src = './assets/logo.png';
  img.alt = 'CareBridge Official Emblem';
  img.className = isMobile ? 'mobile-brand-logo' : className;
  img.width = isMobile ? 72 : 130;
  img.height = isMobile ? 72 : 130;
  img.loading = 'eager';

  return img;
}
