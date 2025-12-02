const Student = require('./Student');
const Room = require('./Room');
const Complaint = require('./Complaint');
const Leave = require('./Leave');
const Notice = require('./Notice');
const LostItem = require('./LostItem');
const User = require('./user');
const { connectDB } = require('./db');

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
