const express = require('express');
const router = express.Router();
const { getNotifications, createNotification, deleteNotification } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getNotifications);
router.post('/', protect, createNotification);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
