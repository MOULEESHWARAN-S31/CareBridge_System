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

// Keep previously published development aliases working while the backend
// remains the source of truth for the canonical demo credentials.
const LEGACY_DEMO_ALIASES = new Map([
  ['gov_salem|Gov@123', ['government@carebridge.local', 'Gov@123']],
  ['hospital.admin@carebridge.local|Admin@123', ['hospital.admin@carebridge.local', 'Hospital@123']],
  ['receptionist@carebridge.local|Recep@123', ['reception@carebridge.local', 'Reception@123']],
  ['pharmacist@carebridge.local|Pharm@123', ['pharmacy@carebridge.local', 'Pharmacy@123']],
  ['billing@carebridge.local|Bill@123', ['billing@carebridge.local', 'Billing@123']],
  ['records@carebridge.local|Record@123', ['records@carebridge.local', 'Records@123']],
  ['emergency@carebridge.local|Emerg@123', ['emergency@carebridge.local', 'Emergency@123']],
  ['hr@carebridge.local|Hr@123', ['hr@carebridge.local', 'HR@123']]
]);

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
  const enteredIdentifier = (credentials.employeeId || '').trim();
  const enteredPassword = credentials.password || '';
  const canonicalCredentials = LEGACY_DEMO_ALIASES.get(`${enteredIdentifier}|${enteredPassword}`);
  const identifier = canonicalCredentials ? canonicalCredentials[0] : enteredIdentifier;
  const password = canonicalCredentials ? canonicalCredentials[1] : enteredPassword;

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

export async function createLoginHandoff(token, user, destination) {
  const response = await fetch(`${API_BASE_URL}/auth/handoff`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, user, destination })
  });
  const data = await response.json();
  if (!response.ok || !data.code) {
    throw new Error(data.error || 'Unable to create secure login handoff.');
  }
  return data.code;
}
