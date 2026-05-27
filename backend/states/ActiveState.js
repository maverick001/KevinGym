const MembershipState = require('./MembershipState');

class ActiveState extends MembershipState {
  getName() { return 'Active'; }
  getDescription() { return 'Active membership — full access to classes and content.'; }
  canBookClass() { return true; }
  canAccessContent() { return true; }
  allowedTransitions() { return ['Trial', 'Expired']; }
}

module.exports = ActiveState;
