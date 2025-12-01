const mongoose = require('mongoose');

// Student Schema
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

// Room Schema
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

// Complaint Schema
const complaintSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  issue: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium', index: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'], default: 'Pending', index: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

// Leave Schema
const leaveSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Checked Out', 'Completed'], default: 'Pending', index: true },
  checkoutDate: { type: Date },
  checkinDate: { type: Date }
}, { timestamps: true });

// Notice Schema
const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['Normal', 'Urgent'], default: 'Normal' },
  isActive: { type: Boolean, default: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

// LostItem Schema
const lostItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Lost', 'Found'], required: true },
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  contact: { type: String },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
const Room = mongoose.model('Room', roomSchema);
const Complaint = mongoose.model('Complaint', complaintSchema);
const Leave = mongoose.model('Leave', leaveSchema);
const Notice = mongoose.model('Notice', noticeSchema);
const LostItem = mongoose.model('LostItem', lostItemSchema);

module.exports = {
  Student,
  Room,
  Complaint,
  Leave,
  Notice,
  LostItem
};
