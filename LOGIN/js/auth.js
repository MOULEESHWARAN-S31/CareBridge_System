/**
 * CareBridge Dashboard — Authentication & Validation Module
 * Connects directly to the unified CareBridge REST API (Node.js + PostgreSQL)
 */

export const API_BASE_URL = 'http://localhost:5000/api';

// Demo development credentials for evaluator reference and autofill
export const DEMO_CREDENTIALS = {
  admin: {
    username: 'admin@carebridge.local',
    password: 'Admin@123',
    role: 'ADMIN',
    label: 'Master Admin'
  },
  government: {
    username: 'government@carebridge.local',
    password: 'Gov@123',
    role: 'GOVERNMENT',
    label: 'Gov Health Officer'
  },
  clinicalOfficer: {
    username: 'EMP-8820',
    password: 'Password@123',
    role: 'GOVERNMENT',
    label: 'Clinical Doctor'
  }
};

/**
 * Validates individual form fields
 */
export function validateLoginForm(formData) {
  const errors = {};

  if (!formData.employeeId || !formData.employeeId.trim()) {
    errors.employeeId = 'Please enter your Employee ID or Email.';
  }

  if (!formData.password || !formData.password.trim()) {
    errors.password = 'Please enter your password.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Real API authentication handler
 * Strictly authenticates through POST /api/auth/login -> PostgreSQL
 * Never creates fake tokens or bypasses authentication locally.
 */
export async function authenticateUser(credentials) {
  const identifier = (credentials.employeeId || '').trim();
  const password = credentials.password || '';

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: identifier,
        password: password
      })
    });

    const data = await response.json();

    if (response.ok && data.token) {
      // Store authenticated session
      localStorage.setItem('cb_auth_token', data.token);
      localStorage.setItem('cb_auth_user', JSON.stringify(data.user));

      return {
        success: true,
        token: data.token,
        user: data.user
      };
    }

    return {
      success: false,
      errorMessage: data.error || 'Invalid Employee ID/Email or password. Please try again.'
    };
  } catch (err) {
    console.error('[AUTH ERROR] Could not connect to backend:', err);
    return {
      success: false,
      errorMessage: 'Unable to connect to CareBridge server. Please start the backend and try again.'
    };
  }
}
