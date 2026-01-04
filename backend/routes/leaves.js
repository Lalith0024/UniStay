const express = require('express');
const router = express.Router();
const { Leave, Student } = require('../models');
const apiHandler = require('../utils/apiHandler');
const ensureAuthenticated = require('../middleware/auth');

// fetching the leaves
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    // If user is a student, force filter by their studentId from JWT token
    if (req.user.role === 'student') {
      // Find the student profile using the user's email from JWT
      const student = await Student.findOne({ email: req.user.email });
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student profile not found' });
      }
      // Override any studentId query param with the authenticated user's studentId
      req.query.studentId = student._id.toString();
    }
    // Admin can see all leaves (no override)

    return apiHandler(Leave, req, res, ['reason', 'status']);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// creating a leave
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const leave = await Leave.create(req.body);
    res.status(201).json(leave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// updating the leave status
router.patch('/:id/status', ensureAuthenticated, async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(leave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// checkoutleave
router.patch('/:id/checkout', ensureAuthenticated, async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Checked Out',
        checkoutDate: new Date()
      },
      { new: true }
    );
    res.json(leave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Checkin Leave
router.patch('/:id/checkin', ensureAuthenticated, async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Completed',
        checkinDate: new Date()
      },
      { new: true }
    );
    res.json(leave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
