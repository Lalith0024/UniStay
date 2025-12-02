const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  room: { type: String, index: true }, // Can be Room Number or ID
  block: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  role: { type: String, default: 'student' }, // Added for auth compatibility
  phone: { type: String },
  department: { type: String },
  year: { type: String },
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
