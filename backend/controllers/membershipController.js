const User = require('../models/User');
const MembershipContext = require('../states/MembershipContext');

const getMembers = async (req, res) => {
  try {
    const members = await User.find({ role: { $in: ['member', 'vendor'] } }).select('name email membershipStatus');
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMembership = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { membershipStatus } = req.body;
    const ctx = new MembershipContext(user.membershipStatus || 'Trial');
    ctx.transitionTo(membershipStatus);

    user.membershipStatus = ctx.getName();
    await user.save();

    res.json({ id: user._id, name: user.name, membershipStatus: user.membershipStatus });
  } catch (error) {
    if (error.message.startsWith('Cannot transition')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMembers, updateMembership };
