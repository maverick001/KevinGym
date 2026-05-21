const express = require('express');
const router = express.Router();
const { getMembershipStatus, transitionMembership } = require('../controllers/membershipController');
const { protect } = require('../middleware/authMiddleware');

router.get('/status', protect, getMembershipStatus);
router.put('/:userId/transition', protect, transitionMembership);

module.exports = router;
