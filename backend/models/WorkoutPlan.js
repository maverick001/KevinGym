const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  sets:  { type: Number, default: 3 },
  reps:  { type: String, default: '10' },
  notes: { type: String },
}, { _id: false });

const workoutPlanSchema = new mongoose.Schema({
  memberId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:         { type: String, required: true },
  difficulty:    { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  durationWeeks: { type: Number, default: 4 },
  exercises:     [exerciseSchema],
  notes:         { type: String },
  createdAt:     { type: Date, default: Date.now },
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
