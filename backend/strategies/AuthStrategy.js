class AuthStrategy {
  async verify(req) {
    throw new Error('verify() must be implemented by a strategy');
  }
}

module.exports = AuthStrategy;
