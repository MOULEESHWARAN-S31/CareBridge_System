function isStateScope(user) {
  const district = String(user?.district || '').trim().toLowerCase();
  return district === 'all' || district === 'state level' || district === 'statewide';
}

function requireGovernmentScope(scope) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (String(req.user.role || '').toUpperCase() !== 'GOVERNMENT') {
      return res.status(403).json({ error: 'Government officer authorization is required.' });
    }

    const stateScope = isStateScope(req.user);
    if (scope === 'STATE' && !stateScope) {
      return res.status(403).json({ error: 'State-level Government authorization is required.' });
    }

    if (scope === 'DISTRICT' && stateScope) {
      return res.status(403).json({ error: 'District assignment is required for this operation.' });
    }

    req.governmentScope = {
      level: stateScope ? 'STATE_ADMIN' : 'DISTRICT_ADMIN',
      district: stateScope ? null : req.user.district
    };
    next();
  };
}

module.exports = {
  isStateScope,
  requireGovernmentScope
};
