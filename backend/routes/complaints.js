const express = require('express');
const router = express.Router();
const { Complaint } = require('../models');
const apiHandler = require('../utils/apiHandler');

// fetching the complaints
router.get('/', (req, res) => apiHandler(Complaint, req, res, ['issue', 'status']));

// updating the complaint status
router.patch('/:id', async (req, res) => {
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
