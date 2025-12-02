const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  block: { type: String, required: true },
  type: { type: String, enum: ['Single', 'Double', 'Triple'], required: true },
  capacity: { type: Number, required: true },
  occupied: { type: Number, default: 0 },
  rent: { type: Number, required: true },
  status: { type: String, enum: ['Available', 'Full', 'Maintenance'], default: 'Available' },
  facilities: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
