/**
 * CareBridge Hospital Dashboard — Footer Component
 * Copyright and regulatory / support links.
 */
export function createFooter(onLinkClick) {
  const footer = document.createElement('footer');
  footer.className = 'login-footer';

  const copyright = document.createElement('span');
  copyright.className = 'footer-copyright';
  copyright.textContent = '© 2026 CareBridge — Government Healthcare Platform';

  const nav = document.createElement('ul');
  nav.className = 'footer-links';

  const links = [
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms of Use' },
    { id: 'support', label: 'Help & Support' }
  ];

  links.forEach(item => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${item.id}`;
    a.className = 'footer-link';
    a.textContent = item.label;
    a.id = `link-${item.id}`;

    a.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof onLinkClick === 'function') {
        onLinkClick(item.id, item.label);
      }
    });

    li.appendChild(a);
    nav.appendChild(li);
  });

  footer.appendChild(copyright);
  footer.appendChild(nav);

  return footer;
}
