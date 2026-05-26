const express = require('express');
const router = express.Router();
const { createCourse, getCourses, updateCourse, patchCourse, deleteCourse } = require('../controllers/courseController');
const { protect, requireVendor } = require('../middleware/authMiddleware');

router.post('/',      protect, requireVendor, createCourse);
router.get('/',       protect, getCourses);
router.put('/:id',    protect, requireVendor, updateCourse);
router.patch('/:id',  protect, requireVendor, patchCourse);
router.delete('/:id', protect, requireVendor, deleteCourse);

module.exports = router;
