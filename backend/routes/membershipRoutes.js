const express = require('express');
const { getMembers, updateMembership } = require('../controllers/membershipController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, requireAdmin, getMembers);
router.put('/:id', protect, requireAdmin, updateMembership);

module.exports = router;
