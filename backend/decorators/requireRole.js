// Decorator: wraps a route handler and enforces role-based access.
// Usage: requireRole('admin')(handler)  or  requireRole('vendor', 'admin')(handler)
const requireRole = (...roles) => (handler) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      message: `Access denied. Required role: ${roles.join(' or ')}.`,
    });
  }
  return handler(req, res, next);
};

module.exports = requireRole;
