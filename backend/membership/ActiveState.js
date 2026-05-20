const MembershipState = require('./MembershipState');

class ActiveState extends MembershipState {
  getName()            { return 'active'; }
  canBookClass()       { return true; }
  canAccessContent()   { return true; }
  getDescription()     { return 'Active membership — full access to all classes and content.'; }
  allowedTransitions() { return ['suspended', 'expired']; }
}

module.exports = ActiveState;
