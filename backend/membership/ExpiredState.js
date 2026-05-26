const MembershipState = require('./MembershipState');

class ExpiredState extends MembershipState {
  getName()            { return 'expired'; }
  canBookClass()       { return false; }
  canAccessContent()   { return false; }
  getDescription()     { return 'Membership expired — renew to regain access.'; }
  allowedTransitions() { return ['trial', 'active']; }
}

module.exports = ExpiredState;
