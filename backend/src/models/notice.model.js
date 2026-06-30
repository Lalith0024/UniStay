const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['Normal', 'Urgent', 'General', 'Important'], default: 'General' },
  audience: { type: String, enum: ['All', 'Specific Block', 'Specific Year'], default: 'All' },
  scheduledFor: { type: Date },
  isActive: { type: Boolean, default: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
