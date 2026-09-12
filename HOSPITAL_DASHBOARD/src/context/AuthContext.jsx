import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEMO_ACCOUNTS, ROLE_ROUTES } from '../auth/accounts';

const AuthContext = createContext(null);

function parseJwt(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.warn('[AUTH] Could not parse JWT payload:', err);
    return null;
  }
}

const ROLE_MAP = {
  HOSPITAL_ADMIN: { roleId: 'admin', roleName: 'Hospital Administrator', dashboardPath: '/admin/dashboard', color: '#6366F1' },
  DOCTOR: { roleId: 'doctor', roleName: 'Doctor', dashboardPath: '/doctor/dashboard', color: '#0EA5E9' },
  NURSE: { roleId: 'nurse', roleName: 'Nurse', dashboardPath: '/nurse/dashboard', color: '#10B981' },
  RECEPTIONIST: { roleId: 'receptionist', roleName: 'Receptionist', dashboardPath: '/receptionist/dashboard', color: '#F59E0B' },
  LAB_STAFF: { roleId: 'lab', roleName: 'Laboratory Staff', dashboardPath: '/lab/dashboard', color: '#8B5CF6' },
  PHARMACIST: { roleId: 'pharmacy', roleName: 'Pharmacist', dashboardPath: '/pharmacy/dashboard', color: '#EC4899' },
  BILLING_STAFF: { roleId: 'billing', roleName: 'Billing Staff', dashboardPath: '/billing/dashboard', color: '#14B8A6' },
  RECORDS_STAFF: { roleId: 'records', roleName: 'Medical Records Staff', dashboardPath: '/records/dashboard', color: '#64748B' },
  EMERGENCY_STAFF: { roleId: 'emergency', roleName: 'Emergency Staff', dashboardPath: '/emergency/dashboard', color: '#EF4444' },
  HR_MANAGER: { roleId: 'hr', roleName: 'HR Manager', dashboardPath: '/hr/dashboard', color: '#F97316' },
};

function initAuth() {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, user: null, token: null, accessDenied: null };
  }

  // 1. Ingest URL Token Handoff (?token=...&user=...)
  const params = new URLSearchParams(window.location.search);
  const urlToken = params.get('token');
  const urlUserStr = params.get('user');

  if (urlToken) {
    const jwtPayload = parseJwt(urlToken);
    let urlUser = null;
    try {
      urlUser = urlUserStr ? JSON.parse(urlUserStr) : null;
    } catch (_) {}

    // Store in localStorage
    localStorage.setItem('cb_auth_token', urlToken);
    if (urlUser) {
      localStorage.setItem('cb_auth_user', JSON.stringify(urlUser));
    }

    // Immediately remove tokens from browser address bar
    const cleanUrl = window.location.pathname + (window.location.hash || '');
    window.history.replaceState({}, document.title, cleanUrl);

    return processAuthentication(urlToken, urlUser, jwtPayload);
  }

  // 2. Ingest from localStorage (cb_auth_token)
  const storedToken = localStorage.getItem('cb_auth_token') || sessionStorage.getItem('cb_auth_token');
  const storedUserStr = localStorage.getItem('cb_auth_user') || sessionStorage.getItem('cb_auth_user');
  let storedUser = null;
  try {
    storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;
  } catch (_) {}

  if (storedToken) {
    const jwtPayload = parseJwt(storedToken);
    return processAuthentication(storedToken, storedUser, jwtPayload);
  }

  // Fallback: unauthenticated
  return { isAuthenticated: false, user: null, token: null, accessDenied: null };
}

function processAuthentication(token, userObj, jwtPayload) {
  const serverRole = (jwtPayload?.role || userObj?.role || '').toUpperCase();

  // Cross-Role Protection: ADMIN visiting Hospital Dashboard
  if (serverRole === 'ADMIN') {
    return {
      isAuthenticated: false,
      user: null,
      token,
      accessDenied: {
        isDenied: true,
        role: 'ADMIN',
        message: 'Access Denied: Master Administrator must access the Admin Dashboard (:5173).',
        redirectUrl: 'http://localhost:5173',
        redirectLabel: 'Go to Admin Dashboard (:5173)'
      }
    };
  }

  // Cross-Role Protection: GOVERNMENT visiting Hospital Dashboard
  if (serverRole === 'GOVERNMENT') {
    return {
      isAuthenticated: false,
      user: null,
      token,
      accessDenied: {
        isDenied: true,
        role: 'GOVERNMENT',
        message: 'Access Denied: Government Health Officer must access the Government Dashboard (:5174).',
        redirectUrl: 'http://localhost:5174/dashboard',
        redirectLabel: 'Go to Government Dashboard (:5174)'
      }
    };
  }

  const roleMeta = ROLE_MAP[serverRole];
  if (!roleMeta) {
    return {
      isAuthenticated: false,
      user: null,
      token,
      accessDenied: {
        isDenied: true,
        role: serverRole || 'UNKNOWN',
        message: `Access Denied: Role '${serverRole || 'UNKNOWN'}' is not authorized for Hospital Management System.`,
        redirectUrl: 'http://localhost:3000',
        redirectLabel: 'Return to Common Login (:3000)'
      }
    };
  }

  const empId = jwtPayload?.employeeId || userObj?.employee_id || userObj?.employeeId || 'EMP-1001';
  const name = jwtPayload?.name || userObj?.full_name || userObj?.name || userObj?.username || roleMeta.roleName;
  const hospitalId = jwtPayload?.hospitalId || userObj?.hospital_id || userObj?.hospitalId || 'GDH-SALEM-01';

  const user = {
    id: 'USR_' + roleMeta.roleId.toUpperCase(),
    name,
    username: jwtPayload?.username || userObj?.username || empId,
    email: jwtPayload?.email || userObj?.email || `${empId.toLowerCase()}@carebridge.local`,
    role: serverRole,
    roleId: roleMeta.roleId,
    roleName: roleMeta.roleName,
    dashboardPath: roleMeta.dashboardPath,
    color: roleMeta.color,
    empId,
    hospital: 'Government District Hospital — Salem',
    hospitalId,
    district: jwtPayload?.district || userObj?.district || 'Salem',
    avatar: name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'HB'
  };

  return {
    isAuthenticated: true,
    user,
    token,
    accessDenied: null
  };
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(initAuth);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      localStorage.setItem('hms_auth', JSON.stringify({ isAuthenticated: true, user: auth.user }));
    }
  }, [auth]);

  const logout = useCallback(() => {
    localStorage.removeItem('cb_auth_token');
    localStorage.removeItem('cb_auth_user');
    localStorage.removeItem('hms_auth');
    sessionStorage.clear();
    setAuth({ isAuthenticated: false, user: null, token: null, accessDenied: null });
    window.location.href = 'http://localhost:3000';
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated: auth.isAuthenticated,
      user: auth.user,
      token: auth.token,
      accessDenied: auth.accessDenied,
      logout,
      DEMO_ACCOUNTS,
      ROLE_ROUTES
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

export default AuthProvider;
