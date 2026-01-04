const express = require('express');
const router = express.Router();
const { Student, Room } = require('../models');
const apiHandler = require('../utils/apiHandler');
const ensureAuthenticated = require('../middleware/auth');

// GET Students 
router.get('/', ensureAuthenticated, (req, res) => apiHandler(Student, req, res, ['name', 'room', 'email']));

// Auto Allocate Room
router.post('/:id/allocate-room', ensureAuthenticated, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.room) {
      return res.status(400).json({ message: 'Room already allocated to this student' });
    }

    // Find the first available room with capacity
    // We check where occupied < capacity
    const room = await Room.findOne({
      $expr: { $lt: ["$occupied", "$capacity"] }
    });

    if (!room) {
      return res.status(404).json({ message: 'No available rooms found. Please contact administration.' });
    }

    // Assign Room to Student
    student.room = room.number;
    student.block = room.block;
    await student.save();

    // Update Room Occupancy
    room.occupied += 1;
    if (room.occupied >= room.capacity) {
      room.status = 'Full';
    }
    await room.save();

    res.json({
      success: true,
      message: 'Room allocated successfully',
      data: {
        student,
        room
      }
    });

  } catch (error) {
    console.error('Allocation Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create Student
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    console.log('Creating student:', req.body);
    const student = await Student.create(req.body);

    // Also create User account for auth if it doesn't exist
    const User = require('../models/user');
    const bcrypt = require('bcrypt');
    const existingUser = await User.findOne({ email: student.email });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(req.body.password || '123456', 10);
      await User.create({
        name: student.name,
        email: student.email,
        password: hashedPassword,
        role: 'student'
      });
      console.log(`Created User account for student ${student.email}`);
    }

    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update Student
router.patch('/:id', ensureAuthenticated, async (req, res) => {
  try {
    console.log('Updating student:', req.params.id, req.body);
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Student
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

// above we did full crud and the endpoints once remember to test in local..
