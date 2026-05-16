const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuthStrategy = require('./AuthStrategy');

class JWTStrategy extends AuthStrategy {
  async verify(req) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer')) throw new Error('No token');

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) throw new Error('User not found');
    return user;
  }
}

module.exports = JWTStrategy;
