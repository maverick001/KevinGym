const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  target:  { type: String, enum: ['members', 'vendors', 'all'], default: 'all' },
  source:  { type: String, enum: ['admin', 'system'], default: 'system' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);
