const express = require('express');
const router = express.Router();
const { getMembershipStatus, getMembershipStatusById, transitionMembership } = require('../controllers/membershipController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

router.get('/status',             protect,               getMembershipStatus);
router.get('/:userId/status',     protect, requireAdmin,  getMembershipStatusById);
router.put('/:userId/transition', protect, requireAdmin,  transitionMembership);

module.exports = router;
