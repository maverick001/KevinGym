const MembershipState = require('./MembershipState');

class ExpiredState extends MembershipState {
  getName() { return 'Expired'; }
  getDescription() { return 'Expired membership — please renew to regain access.'; }
  canBookClass() { return false; }
  canAccessContent() { return false; }
  allowedTransitions() { return ['Trial', 'Active']; }
}

module.exports = ExpiredState;
