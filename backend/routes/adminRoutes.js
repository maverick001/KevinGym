const express = require('express');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const requireRole = require('../decorators/requireRole');
const rateLimit = require('../decorators/rateLimit');
const router = express.Router();

const adminOnly = requireRole('admin');
const limitedWrite = rateLimit(30, 60_000); // 30 writes/min

router.get('/users',      protect, adminOnly(getUsers));
router.post('/users',     protect, adminOnly(limitedWrite(createUser)));
router.put('/users/:id',  protect, adminOnly(limitedWrite(updateUser)));
router.delete('/users/:id', protect, adminOnly(deleteUser));

module.exports = router;
