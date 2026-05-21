// Decorator: wraps a route handler and ensures req.user owns the resource.
// Admins bypass the check. Attaches the fetched resource to req.resource.
// Usage: requireOwnership(Course, 'vendorId')(handler)
const requireOwnership = (Model, ownerField = 'userId') => (handler) => async (req, res, next) => {
  try {
    const resource = await Model.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found.' });

    const isOwner = String(resource[ownerField]) === String(req.user.id);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Access denied. You do not own this resource.' });
    }

    req.resource = resource;
    return handler(req, res, next);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = requireOwnership;
