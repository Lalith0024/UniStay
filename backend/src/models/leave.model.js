const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Checked Out', 'Completed'], default: 'Pending', index: true },
  checkoutDate: { type: Date },
  checkinDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
