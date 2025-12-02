const express = require('express');
const router = express.Router();
const { Complaint, Student } = require('../models');
const apiHandler = require('../utils/apiHandler');
const ensureAuthenticated = require('../middleware/auth');

// fetching the complaints - with authentication
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
    // Admin can see all complaints (no override)

    return apiHandler(Complaint, req, res, ['issue', 'status']);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// creating a new complaint - with authentication
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const complaint = new Complaint(req.body);
    await complaint.save();
    res.status(201).json({ success: true, data: complaint });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// updating the complaint status - with authentication
router.patch('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
