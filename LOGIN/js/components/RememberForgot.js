/**
 * CareBridge Hospital Dashboard — RememberForgot Component
 * Remember Me checkbox on left and Forgot Password link on right.
 */
export function createRememberForgot(onForgotPasswordClick) {
  const row = document.createElement('div');
  row.className = 'remember-forgot-row';

  row.innerHTML = `
    <label class="remember-me-label" for="remember-me-checkbox">
      <input type="checkbox" id="remember-me-checkbox" name="rememberMe" class="custom-checkbox" />
      <span>Remember me</span>
    </label>
    <a href="#forgot-password" class="forgot-password-link" id="forgot-password-link">
      Forgot Password?
    </a>
  `;

  const link = row.querySelector('#forgot-password-link');
  link.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof onForgotPasswordClick === 'function') {
      onForgotPasswordClick();
    }
  });

  return row;
}
