/**
 * CareBridge Hospital Dashboard — LoginButton Component
 * Full-width Sign In button with idle, hover, active, disabled, and loading states.
 */
export function createLoginButton() {
  const container = document.createElement('div');
  container.className = 'btn-submit-container';

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'btn-sign-in';
  button.id = 'sign-in-button';
  button.innerHTML = `
    <span class="spinner-icon" aria-hidden="true"></span>
    <span class="btn-text">Sign In</span>
  `;

  container.appendChild(button);

  return {
    element: container,
    button: button,
    setLoading: (isLoading) => {
      const textSpan = button.querySelector('.btn-text');
      if (isLoading) {
        button.classList.add('is-loading');
        button.disabled = true;
        textSpan.textContent = 'Signing in...';
      } else {
        button.classList.remove('is-loading');
        button.disabled = false;
        textSpan.textContent = 'Sign In';
      }
    },
    setDisabled: (isDisabled) => {
      button.disabled = isDisabled;
    }
  };
}
