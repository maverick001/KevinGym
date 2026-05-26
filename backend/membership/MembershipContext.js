const TrialState     = require('./TrialState');
const ActiveState    = require('./ActiveState');
const SuspendedState = require('./SuspendedState');
const ExpiredState   = require('./ExpiredState');

const STATE_MAP = {
  trial:     TrialState,
  active:    ActiveState,
  suspended: SuspendedState,
  expired:   ExpiredState,
};

class MembershipContext {
  constructor(statusName = 'trial') {
    const StateClass = STATE_MAP[statusName] || TrialState;
    this.state = new StateClass();
  }

  transitionTo(newStatusName) {
    const allowed = this.state.allowedTransitions();
    if (!allowed.includes(newStatusName)) {
      throw new Error(`Cannot transition from '${this.state.getName()}' to '${newStatusName}'`);
    }
    const StateClass = STATE_MAP[newStatusName];
    if (!StateClass) throw new Error(`Unknown membership state: ${newStatusName}`);
    this.state = new StateClass();
  }

  canBookClass()       { return this.state.canBookClass(); }
  canAccessContent()   { return this.state.canAccessContent(); }
  getDescription()     { return this.state.getDescription(); }
  getName()            { return this.state.getName(); }
  allowedTransitions() { return this.state.allowedTransitions(); }
}

module.exports = MembershipContext;
