import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute component for guarding role-specific routes.
 * Validates authentication status, checks cross-role permissions,
 * and redirects unauthenticated users to the CareBridge Common Login.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isLoading, user, accessDenied } = useAuth();
  const location = useLocation();

  if (accessDenied?.isDenied) {
    window.location.replace(accessDenied.redirectUrl || 'http://localhost:3000');
    return null;
  }

  if (isLoading) return null;

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles) {
    const rolesList = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const isAllowed = rolesList.includes(user.roleId) ||
      rolesList.includes(user.role) ||
      (rolesList.includes('doctor') && (user.roleId === 'doctor' || user.role === 'DOCTOR')) ||
      (rolesList.includes('nurse') && (user.roleId === 'nurse' || user.role === 'NURSE')) ||
      (rolesList.includes('receptionist') && user.roleId === 'reception') ||
      (rolesList.includes('pharmacy') && user.roleId === 'pharmacist') ||
      (rolesList.includes('lab') && user.roleId === 'lab_staff') ||
      (rolesList.includes('billing') && user.roleId === 'billing_staff') ||
      (rolesList.includes('records') && user.roleId === 'records_staff') ||
      (rolesList.includes('emergency') && user.roleId === 'emergency_staff') ||
      (rolesList.includes('hr') && user.roleId === 'hr_manager') ||
      (rolesList.includes('admin') && user.roleId === 'hospital_admin');

    if (!isAllowed) {
      return <Navigate to={user.dashboardPath || '/'} replace />;
    }
  }

  return children;
}
