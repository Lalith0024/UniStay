const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Lost', 'Found'], required: true },
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  contact: { type: String },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('LostItem', lostItemSchema);
