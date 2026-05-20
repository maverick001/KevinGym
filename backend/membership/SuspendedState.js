const MembershipState = require('./MembershipState');

class SuspendedState extends MembershipState {
  getName()            { return 'suspended'; }
  canBookClass()       { return false; }
  canAccessContent()   { return false; }
  getDescription()     { return 'Membership suspended — contact admin to reinstate.'; }
  allowedTransitions() { return ['active', 'expired']; }
}

module.exports = SuspendedState;
