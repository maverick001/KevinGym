const express = require('express');
const router = express.Router();
const { getNotifications, createNotification, deleteNotification } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const requireRole = require('../decorators/requireRole');

const adminOnly = requireRole('admin');

router.get('/',       protect, adminOnly(getNotifications));
router.post('/',      protect, adminOnly(createNotification));
router.delete('/:id', protect, adminOnly(deleteNotification));

module.exports = router;
