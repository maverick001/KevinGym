const Course = require('../models/Course');
const gymEvents = require('../events/gymEvents');

const createCourse = async (req, res) => {
  const { name, schedule, time, description, studio } = req.body;
  try {
    const course = await Course.create({
      name, schedule, time, description, studio,
      vendorId: req.user.id,
    });
    gymEvents.emit('courseCreated', { name: course.name, vendorId: req.user.id });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  const { name, schedule, time, description, studio } = req.body;
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { name, schedule, time, description, studio },
      { new: true, runValidators: true }
    );
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const patchCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCourse, getCourses, updateCourse, patchCourse, deleteCourse };
