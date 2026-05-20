class MembershipState {
  getName()             { throw new Error('getName() not implemented'); }
  canBookClass()        { throw new Error('canBookClass() not implemented'); }
  canAccessContent()    { throw new Error('canAccessContent() not implemented'); }
  getDescription()      { throw new Error('getDescription() not implemented'); }
  allowedTransitions()  { throw new Error('allowedTransitions() not implemented'); }
}

module.exports = MembershipState;
