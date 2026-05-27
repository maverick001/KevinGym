class MembershipState {
  getName() { throw new Error('getName() must be implemented'); }
  getDescription() { throw new Error('getDescription() must be implemented'); }
  canBookClass() { throw new Error('canBookClass() must be implemented'); }
  canAccessContent() { throw new Error('canAccessContent() must be implemented'); }
  allowedTransitions() { throw new Error('allowedTransitions() must be implemented'); }
}

module.exports = MembershipState;
