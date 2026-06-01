const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  issue: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium', index: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'], default: 'Pending', index: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
