const express = require('express');
const router = express.Router();
const { Leave } = require('../models');
const apiHandler = require('../utils/apiHandler');

// fetching the leaves
router.get('/', (req, res) => apiHandler(Leave, req, res, ['reason', 'status']));

// creating a leave
router.post('/', async (req, res) => {
  try {
    const leave = await Leave.create(req.body);
    res.status(201).json(leave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// updating the leave status

router.patch('/:id/status', async (req, res) => {
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

router.patch('/:id/checkout', async (req, res) => {
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
router.patch('/:id/checkin', async (req, res) => {
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
