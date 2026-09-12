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
  hospitalAdmin: {
    username: 'hospital.admin@carebridge.local',
    password: 'Hospital@123',
    role: 'HOSPITAL_ADMIN',
    label: 'Hospital Administrator'
  },
  doctor: {
    username: 'doctor@carebridge.local',
    password: 'Doctor@123',
    role: 'DOCTOR',
    label: 'Doctor'
  },
  nurse: {
    username: 'nurse@carebridge.local',
    password: 'Nurse@123',
    role: 'NURSE',
    label: 'Nurse'
  },
  receptionist: {
    username: 'reception@carebridge.local',
    password: 'Reception@123',
    role: 'RECEPTIONIST',
    label: 'Receptionist'
  },
  pharmacist: {
    username: 'pharmacy@carebridge.local',
    password: 'Pharmacy@123',
    role: 'PHARMACIST',
    label: 'Pharmacist'
  },
  labStaff: {
    username: 'lab@carebridge.local',
    password: 'Lab@123',
    role: 'LAB_STAFF',
    label: 'Laboratory Staff'
  },
  billingStaff: {
    username: 'billing@carebridge.local',
    password: 'Billing@123',
    role: 'BILLING_STAFF',
    label: 'Billing Staff'
  },
  recordsStaff: {
    username: 'records@carebridge.local',
    password: 'Records@123',
    role: 'RECORDS_STAFF',
    label: 'Medical Records Staff'
  },
  emergencyStaff: {
    username: 'emergency@carebridge.local',
    password: 'Emergency@123',
    role: 'EMERGENCY_STAFF',
    label: 'Emergency Staff'
  },
  hrManager: {
    username: 'hr@carebridge.local',
    password: 'HR@123',
    role: 'HR_MANAGER',
    label: 'HR Manager'
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
      errorMessage: 'Unable to connect to CareBridge server'
    };
  }
}
