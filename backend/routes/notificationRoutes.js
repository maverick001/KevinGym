const express = require('express');
const router = express.Router();
const { getNotifications } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const requireRole = require('../decorators/requireRole');

router.get('/', protect, requireRole('admin')(getNotifications));

module.exports = router;
