/**
 * Role-Based Access Control Middleware
 * Enforces strict role checks on protected API routes.
 * 
 * @param {string|string[]} allowedRoles Single role string or array of allowed roles
 */
function requireRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const userRole = (req.user.role || '').toUpperCase();
    const hasRole = roles.map(r => r.toUpperCase()).includes(userRole);

    if (!hasRole) {
      return res.status(403).json({
        error: `Access Denied: Role '${req.user.role}' is not authorized for this operation.`,
        requiredRoles: roles
      });
    }

    next();
  };
}

module.exports = {
  requireRole
};
