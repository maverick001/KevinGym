const express = require('express');
const router = express.Router();
const { createWorkoutPlan, getMyPlan, getMemberPlan } = require('../controllers/workoutPlanController');
const { protect } = require('../middleware/authMiddleware');

router.post('/',                      protect, createWorkoutPlan);
router.get('/my',                     protect, getMyPlan);
router.get('/member/:memberId',       protect, getMemberPlan);

module.exports = router;
