const AuthStrategyContext = require('../strategies/AuthStrategyContext');

const protect = async (req, res, next) => {
  try {
    req.user = await AuthStrategyContext.verify(req);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, ' + error.message });
  }
};

module.exports = { protect };
