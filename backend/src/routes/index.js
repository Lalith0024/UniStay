const express = require('express');
const router = express.Router();

const studentRoutes = require('./student.routes');
const roomRoutes = require('./room.routes');
const complaintRoutes = require('./complaint.routes');
const leaveRoutes = require('./leave.routes');
const noticeRoutes = require('./notice.routes');
const seedRoutes = require('./seed.routes');

router.use('/students', studentRoutes);
router.use('/rooms', roomRoutes);
router.use('/complaints', complaintRoutes);
router.use('/leaves', leaveRoutes);
router.use('/notices', noticeRoutes);
router.use('/seed', seedRoutes);

module.exports = router;
