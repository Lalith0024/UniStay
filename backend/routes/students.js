const express = require('express');
const router = express.Router();
const { Student } = require('../models');
const apiHandler = require('../utils/apiHandler');

// GET Students (PSSF enabled)
router.get('/', (req, res) => apiHandler(Student, req, res, ['name', 'room', 'email']));

// Create Student
router.post('/', async (req, res) => {
  try {
    console.log('Creating student:', req.body);
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update Student
router.patch('/:id', async (req, res) => {
  try {
    console.log('Updating student:', req.params.id, req.body);
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Student
router.delete('/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
