const WorkoutPlan = require('../models/WorkoutPlan');
const User = require('../models/User');
const WorkoutPlanBuilder = require('../builder/WorkoutPlanBuilder');
const gymEvents = require('../events/gymEvents');

const createWorkoutPlan = async (req, res) => {
  const { memberEmail, title, difficulty, durationWeeks, exercises, notes } = req.body;
  try {
    const member = await User.findOne({ email: memberEmail, role: 'member' });
    if (!member) return res.status(404).json({ message: `No member found with email: ${memberEmail}` });

    const builder = new WorkoutPlanBuilder()
      .setTitle(title)
      .setDifficulty(difficulty)
      .setDuration(parseInt(durationWeeks, 10));

    (exercises || []).forEach(ex => builder.addExercise(ex));
    if (notes) builder.setNotes(notes);

    const planData = builder.build();

    const plan = await WorkoutPlan.create({
      ...planData,
      memberId:   member._id,
      assignedBy: req.user.id,
    });

    gymEvents.emit('planCreated', { title: plan.title, memberId: member._id });
    res.status(201).json(plan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({ memberId: req.user.id }).sort({ createdAt: -1 });
    if (!plan) return res.status(404).json({ message: 'No workout plan assigned yet.' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMemberPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findOne({ memberId: req.params.memberId }).sort({ createdAt: -1 });
    if (!plan) return res.status(404).json({ message: 'No workout plan found for this member.' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createWorkoutPlan, getMyPlan, getMemberPlan };
