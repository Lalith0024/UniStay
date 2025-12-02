const express = require('express');
const router = express.Router();
const { Room } = require('../models');
const apiHandler = require('../utils/apiHandler');

// GET Rooms (PSSF enabled)
router.get('/', (req, res) => apiHandler(Room, req, res, ['number', 'block']));

// Create Room
router.post('/', async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update Room
router.patch('/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Room
router.delete('/:id', async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
