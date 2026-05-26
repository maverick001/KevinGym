const express = require('express');
const router = express.Router();
const { getNotifications, createNotification, deleteNotification } = require('../controllers/notificationController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

router.get('/',       protect, getNotifications);
router.post('/',      protect, requireAdmin, createNotification);
router.delete('/:id', protect, requireAdmin, deleteNotification);

module.exports = router;
