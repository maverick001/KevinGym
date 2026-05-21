// Decorator: wraps a route handler with a per-user sliding-window rate limit.
// Usage: rateLimit(20, 60_000)(handler)  — max 20 requests per minute per user
const rateLimit = (maxRequests = 100, windowMs = 60 * 1000) => (handler) => {
  const store = new Map(); // userId -> { count, resetAt }

  return (req, res, next) => {
    const key = req.user?.id || req.ip;
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return handler(req, res, next);
    }

    if (entry.count >= maxRequests) {
      return res.status(429).json({ message: 'Too many requests. Please try again later.' });
    }

    entry.count++;
    return handler(req, res, next);
  };
};

module.exports = rateLimit;
