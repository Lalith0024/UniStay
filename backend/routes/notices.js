const express = require('express');
const router = express.Router();
const { Notice } = require('../models');
const apiHandler = require('../utils/apiHandler');
const ensureAuthenticated = require('../middleware/auth');

// fetching the notices 
router.get('/', ensureAuthenticated, (req, res) => apiHandler(Notice, req, res, ['title', 'description']));

// creating a notice
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const notice = await Notice.create(req.body);
    res.status(201).json(notice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// updating a notice
router.patch('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(notice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// deleting a notice
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
