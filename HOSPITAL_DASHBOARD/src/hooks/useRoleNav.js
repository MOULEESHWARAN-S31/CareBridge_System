/**
 * useRoleNav — returns a helper to build role-aware paths.
 *
 * Usage:
 *   const { path, go } = useRoleNav();
 *   path('patients')        → '/admin/dashboard/patients'
 *   path('patients/P1001')  → '/admin/dashboard/patients/P1001'
 *   go('appointments')      → navigates there
 */
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_ROUTES } from '../auth/accounts';

export function useRoleNav() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // base e.g. '/admin/dashboard'
  const base = ROLE_ROUTES[user?.roleId] || '/admin/dashboard';

  const path = useCallback(
    (sub) => (sub ? `${base}/${sub}` : base),
    [base]
  );

  const go = useCallback(
    (sub, opts) => navigate(path(sub), opts),
    [navigate, path]
  );

  return { base, path, go };
}
