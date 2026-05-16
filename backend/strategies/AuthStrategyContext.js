class AuthStrategyContext {
  static strategy = null;

  static use(strategy) {
    this.strategy = strategy;
  }

  static async verify(req) {
    if (!this.strategy) throw new Error('No auth strategy set');
    return this.strategy.verify(req);
  }
}

module.exports = AuthStrategyContext;
