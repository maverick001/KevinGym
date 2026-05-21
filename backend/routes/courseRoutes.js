const express = require('express');
const router = express.Router();
const { createCourse, getCourses, deleteCourse } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const requireRole = require('../decorators/requireRole');
const rateLimit = require('../decorators/rateLimit');
const requireOwnership = require('../decorators/requireOwnership');
const Course = require('../models/Course');

const vendorOrAdmin = requireRole('vendor', 'admin');
const limitedCreate = rateLimit(10, 60_000); // 10 course creates/min

router.get('/',      protect, getCourses);
router.post('/',     protect, vendorOrAdmin(limitedCreate(createCourse)));
router.delete('/:id', protect, vendorOrAdmin(requireOwnership(Course, 'vendorId')(deleteCourse)));

module.exports = router;
