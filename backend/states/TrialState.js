const MembershipState = require('./MembershipState');

class TrialState extends MembershipState {
  getName() { return 'Trial'; }
  getDescription() { return 'Trial membership — browse content only, cannot book classes.'; }
  canBookClass() { return false; }
  canAccessContent() { return true; }
  allowedTransitions() { return ['Active', 'Expired']; }
}

module.exports = TrialState;
