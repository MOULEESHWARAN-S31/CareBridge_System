/**
 * CareBridge Hospital Portal — Central Backend API Service
 * Connects to the unified CareBridge REST API (Node.js/Express + PostgreSQL on port 5000)
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
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    return response;
  } catch (error) {
    // Network or server offline
    return {
      ok: false,
      status: 0,
      json: async () => ({ success: false, message: 'Server offline or network unavailable', error: error.message })
    };
  }
}

/**
 * Hospital Clinical API Endpoints (Mappable to backend/src/routes/api.js)
 */
export const HospitalAPI = {
  // 1. Hospital Overview & Live Bed Capacity
  getHospitalOverview: async () => {
    try {
      const res = await apiFetch('/hospital/overview');
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  },

  getBeds: async () => {
    try {
      const res = await apiFetch('/hospital/beds');
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  },

  updateBeds: async (bedData) => {
    try {
      const res = await apiFetch('/hospital/beds', {
        method: 'PUT',
        body: JSON.stringify(bedData)
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  },

  // 2. Patient lookup via ABHA ID, Mobile, or Name
  lookupPatients: async (query) => {
    try {
      const res = await apiFetch(`/hospital/patients/search?q=${encodeURIComponent(query)}`);
      if (res.ok) return await res.json();
      // Fallback to abha profiles lookup
      const abhaRes = await apiFetch(`/abha/profiles?mobile=${encodeURIComponent(query)}`);
      if (abhaRes.ok) return await abhaRes.json();
    } catch (_) {}
    return null;
  },

  // 3. Appointments & Queue Management
  getAppointments: async (hospitalId = 'GDH-SALEM-01') => {
    try {
      const res = await apiFetch(`/appointments?hospitalId=${encodeURIComponent(hospitalId)}`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  },

  cancelAppointment: async (appointmentId, reason = 'Cancelled by hospital') => {
    try {
      const res = await apiFetch(`/appointments/${encodeURIComponent(appointmentId)}/cancel`, {
        method: 'PUT',
        body: JSON.stringify({ reason })
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  },

  // 4. OPD Cards (Queue & Patient Registration)
  getOpdCards: async (date) => {
    try {
      const res = await apiFetch(`/opd${date ? `?date=${encodeURIComponent(date)}` : ''}`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  },

  createOpdCard: async (opdData) => {
    try {
      const res = await apiFetch('/opd', {
        method: 'POST',
        body: JSON.stringify(opdData)
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  },

  // 5. Prescriptions & Orders
  getPrescriptions: async () => {
    try {
      const res = await apiFetch('/prescriptions');
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  },

  // 6. Medical Records & Lab Reports
  getMedicalRecords: async (patientId) => {
    try {
      const res = await apiFetch(`/records${patientId ? `?patientProfileId=${encodeURIComponent(patientId)}` : ''}`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  },

  createMedicalRecord: async (recordData) => {
    try {
      const res = await apiFetch('/records', {
        method: 'POST',
        body: JSON.stringify(recordData)
      });
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
  },

  // 7. Teleconsultations
  getTeleconsultations: async () => {
    try {
      const res = await apiFetch('/teleconsultations');
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  },

  // 8. Referrals (PHC to Hospital Network)
  getReferrals: async () => {
    try {
      const res = await apiFetch('/referrals');
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  },

  // 9. Health Alerts & Emergency Coordination
  getHealthAlerts: async () => {
    try {
      const res = await apiFetch('/health-alerts');
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  },

  getEmergencyContacts: async () => {
    try {
      const res = await apiFetch('/emergency-contacts');
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  },

  // 10. AI Assistant & Multilingual Translation
  translateText: async (text, targetLang) => {
    try {
      const res = await apiFetch('/translate', {
        method: 'POST',
        body: JSON.stringify({ text, targetLang })
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  }
};

export default HospitalAPI;
