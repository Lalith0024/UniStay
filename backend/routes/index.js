const express = require('express');
const router = express.Router();

const studentRoutes = require('./students');
const roomRoutes = require('./rooms');
const complaintRoutes = require('./complaints');
const leaveRoutes = require('./leaves');
const noticeRoutes = require('./notices');
const seedRoutes = require('./seed');

router.use('/students', studentRoutes);
router.use('/rooms', roomRoutes);
router.use('/complaints', complaintRoutes);
router.use('/leaves', leaveRoutes);
router.use('/notices', noticeRoutes);
router.use('/seed', seedRoutes);

module.exports = router;
