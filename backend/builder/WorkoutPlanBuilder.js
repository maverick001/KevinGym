class WorkoutPlanBuilder {
  constructor() {
    this._title        = '';
    this._difficulty   = 'beginner';
    this._durationWeeks = 4;
    this._exercises    = [];
    this._notes        = '';
  }

  setTitle(title) {
    this._title = title;
    return this;
  }

  setDifficulty(difficulty) {
    const valid = ['beginner', 'intermediate', 'advanced'];
    if (!valid.includes(difficulty)) throw new Error(`Difficulty must be one of: ${valid.join(', ')}`);
    this._difficulty = difficulty;
    return this;
  }

  setDuration(weeks) {
    if (!Number.isInteger(weeks) || weeks < 1) throw new Error('Duration must be a positive integer (weeks)');
    this._durationWeeks = weeks;
    return this;
  }

  addExercise({ name, sets, reps, notes = '' }) {
    if (!name) throw new Error('Each exercise must have a name');
    this._exercises.push({ name, sets: sets || 3, reps: reps || '10', notes });
    return this;
  }

  setNotes(notes) {
    this._notes = notes;
    return this;
  }

  build() {
    if (!this._title) throw new Error('Workout plan must have a title');
    if (this._exercises.length === 0) throw new Error('Workout plan must have at least one exercise');
    return {
      title:         this._title,
      difficulty:    this._difficulty,
      durationWeeks: this._durationWeeks,
      exercises:     this._exercises,
      notes:         this._notes,
    };
  }
}

module.exports = WorkoutPlanBuilder;
