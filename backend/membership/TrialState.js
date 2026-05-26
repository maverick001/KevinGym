const MembershipState = require('./MembershipState');

class TrialState extends MembershipState {
  getName()            { return 'trial'; }
  canBookClass()       { return true; }
  canAccessContent()   { return true; }
  getDescription()     { return 'Trial membership — limited to 2 class bookings per month.'; }
  allowedTransitions() { return ['active', 'expired']; }
}

module.exports = TrialState;
