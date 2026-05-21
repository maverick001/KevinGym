const express = require('express');
const router = express.Router();
const { getMembershipStatus, transitionMembership } = require('../controllers/membershipController');
const { protect } = require('../middleware/authMiddleware');
const requireRole = require('../decorators/requireRole');

router.get('/status',              protect, getMembershipStatus);
router.put('/:userId/transition',  protect, requireRole('admin')(transitionMembership));

module.exports = router;
