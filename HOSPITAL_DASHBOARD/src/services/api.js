/**
 * CareBridge Hospital Portal — Central Backend API Service
 * Connects to the unified CareBridge REST API (Node.js/Express + PostgreSQL)
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? (import.meta.env.VITE_API_BASE_URL.endsWith('/api') 
      ? import.meta.env.VITE_API_BASE_URL 
      : `${import.meta.env.VITE_API_BASE_URL}/api`)
  : 'http://localhost:5000/api';

/**
 * Standard authenticated fetch helper
 */
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('cb_auth_token') || sessionStorage.getItem('cb_auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers
  });

  return response;
}

/**
 * Hospital Clinical API Endpoints
 */
export const HospitalAPI = {
  // 1. Patient lookup via ABHA ID, Mobile, or Name
  lookupPatients: async (query) => {
    try {
      const res = await apiFetch(`/abha/profiles?mobile=${encodeURIComponent(query)}`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  },

  // 2. Appointments
  getAppointments: async (hospitalId = 'GDH-SALEM-01') => {
    try {
      const res = await apiFetch(`/appointments?hospitalId=${encodeURIComponent(hospitalId)}`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  },

  // 3. Facilities / Hospital Info
  getFacilityInfo: async (hospitalId = 'GDH-SALEM-01') => {
    try {
      const res = await apiFetch(`/facilities/${encodeURIComponent(hospitalId)}`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  },

  // 4. Prescriptions & Orders
  getPrescriptions: async () => {
    try {
      const res = await apiFetch('/prescriptions');
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  },

  // 5. Medical Records & Lab Reports
  getMedicalRecords: async (patientId) => {
    try {
      const res = await apiFetch(`/records${patientId ? `?patientProfileId=${encodeURIComponent(patientId)}` : ''}`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  },

  getLabReports: async () => {
    try {
      const res = await apiFetch('/lab-reports');
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  }
};

export default HospitalAPI;
