const express = require('express');
const router = express.Router();
const { createCourse, getCourses, updateCourse, patchCourse, deleteCourse } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const requireRole = require('../decorators/requireRole');
const rateLimit = require('../decorators/rateLimit');
const requireOwnership = require('../decorators/requireOwnership');
const Course = require('../models/Course');

const vendorOrAdmin = requireRole('vendor', 'admin');
const limitedCreate = rateLimit(10, 60_000);

router.get('/',       protect, getCourses);
router.post('/',      protect, vendorOrAdmin(limitedCreate(createCourse)));
router.put('/:id',    protect, vendorOrAdmin(requireOwnership(Course, 'vendorId')(updateCourse)));
router.patch('/:id',  protect, vendorOrAdmin(requireOwnership(Course, 'vendorId')(patchCourse)));
router.delete('/:id', protect, vendorOrAdmin(requireOwnership(Course, 'vendorId')(deleteCourse)));

module.exports = router;
