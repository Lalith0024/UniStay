const Student = require('./student.model');
const Room = require('./room.model');
const Complaint = require('./complaint.model');
const Leave = require('./leave.model');
const Notice = require('./notice.model');
const LostItem = require('./lost-item.model');
const User = require('./user.model');
const { connectDB } = require('../config/db.config');

module.exports = {
  Student,
  Room,
  Complaint,
  Leave,
  Notice,
  LostItem,
  User,
  connectDB
};
