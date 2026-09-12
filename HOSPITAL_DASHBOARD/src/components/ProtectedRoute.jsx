import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Redirects to login if not authenticated.
// Optionally checks roleId if allowedRoles prop is provided.
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.roleId)) {
    // User is authenticated but wrong role — send to their own dashboard
    return <Navigate to={user.dashboardPath} replace />;
  }

  return children;
}
