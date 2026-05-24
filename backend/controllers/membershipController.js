const User = require('../models/User');
const MembershipContext = require('../membership/MembershipContext');
const gymEvents = require('../events/gymEvents');

const getMembershipStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ctx = new MembershipContext(user.membershipStatus);
    res.json({
      status:             ctx.getName(),
      description:        ctx.getDescription(),
      canBookClass:       ctx.canBookClass(),
      canAccessContent:   ctx.canAccessContent(),
      allowedTransitions: ctx.allowedTransitions(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMembershipStatusById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const ctx = new MembershipContext(user.membershipStatus);
    res.json({
      status:             ctx.getName(),
      allowedTransitions: ctx.allowedTransitions(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const transitionMembership = async (req, res) => {
  const { userId } = req.params;
  const { newStatus } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ctx = new MembershipContext(user.membershipStatus);
    const previousStatus = ctx.getName();
    ctx.transitionTo(newStatus);

    user.membershipStatus = ctx.getName();
    await user.save();

    gymEvents.emit('membershipTransitioned', {
      name:  user.name,
      email: user.email,
      from:  previousStatus,
      to:    ctx.getName(),
    });

    res.json({
      userId:           user._id,
      status:           ctx.getName(),
      description:      ctx.getDescription(),
      canBookClass:     ctx.canBookClass(),
      canAccessContent: ctx.canAccessContent(),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getMembershipStatus, getMembershipStatusById, transitionMembership };
