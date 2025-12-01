const express = require('express');
const router = express.Router();
const { Student, Room, Complaint, Leave, Notice, LostItem } = require('./models');

// Universal Filtering/Sorting/Pagination Helper
const apiHandler = async (Model, req, res, searchFields = []) => {
  try {
    const { page = 1, limit = 10, search, sort, ...filters } = req.query;

    // Build Query
    let query = {};

    // Search Logic
    if (search && searchFields.length > 0) {
      query.$or = searchFields.map(field => ({
        [field]: { $regex: search, $options: 'i' }
      }));
    }

    // Filter Logic (Exact match for other params)
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        query[key] = filters[key];
      }
    });

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    let sortQuery = { createdAt: -1 }; // Default sort
    if (sort) {
      const parts = sort.split(':');
      sortQuery = { [parts[0]]: parts[1] === 'desc' ? -1 : 1 };
    }

    // Execute Query
    const totalDocs = await Model.countDocuments(query);
    const docs = await Model.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum)
      .populate(Model.modelName === 'Complaint' || Model.modelName === 'Leave' ? 'studentId' : '');

    res.json({
      data: docs,
      meta: {
        total: totalDocs,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalDocs / limitNum)
      }
    });
  } catch (error) {
    console.error(`API Error for ${Model.modelName}:`, error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// --- ROUTES ---

// Students (PSSF enabled)
router.get('/students', (req, res) => apiHandler(Student, req, res, ['name', 'room', 'email']));

// Rooms (PSSF enabled)
router.get('/rooms', (req, res) => apiHandler(Room, req, res, ['number', 'block']));

// Complaints (PSSF enabled)
router.get('/complaints', (req, res) => apiHandler(Complaint, req, res, ['issue', 'status']));

// Leaves (PSSF enabled)
router.get('/leaves', (req, res) => apiHandler(Leave, req, res, ['reason', 'status']));
router.post('/leaves', async (req, res) => {
  try {
    const leave = await Leave.create(req.body);
    res.status(201).json(leave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Notices
router.get('/notices', (req, res) => apiHandler(Notice, req, res, ['title', 'description']));
router.post('/notices', async (req, res) => {
  try {
    const notice = await Notice.create(req.body);
    res.status(201).json(notice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update Complaint Status
router.patch('/complaints/:id', async (req, res) => {
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

// Update Leave Status
router.patch('/leaves/:id/status', async (req, res) => {
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

// Checkout Leave
router.patch('/leaves/:id/checkout', async (req, res) => {
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
router.patch('/leaves/:id/checkin', async (req, res) => {
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

// --- CRUD ROUTES ---

// Students
router.post('/students', async (req, res) => {
  try {
    console.log('Creating student:', req.body);
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/students/:id', async (req, res) => {
  try {
    console.log('Updating student:', req.params.id, req.body);
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Rooms
router.post('/rooms', async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/rooms/:id', async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Notices
router.delete('/notices/:id', async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Seed Data Endpoint
router.post('/seed', async (req, res) => {
  try {
    // Clear existing data to avoid duplicates on re-seed
    await Student.deleteMany({});
    await Room.deleteMany({});
    await Complaint.deleteMany({});
    await Leave.deleteMany({});
    await Notice.deleteMany({});

    // Create dummy data
    const students = await Student.create([
      { name: 'Rahul Sharma', email: 'rahul@test.com', password: '123', room: '101', block: 'A', status: 'Active', department: 'CSE', year: '3rd' },
      { name: 'Priya Patel', email: 'priya@test.com', password: '123', room: '102', block: 'A', status: 'Active', department: 'ECE', year: '2nd' },
      { name: 'Amit Kumar', email: 'amit@test.com', password: '123', room: '103', block: 'B', status: 'Inactive', department: 'MECH', year: '4th' },
      { name: 'Sneha Gupta', email: 'sneha@test.com', password: '123', room: '104', block: 'A', status: 'Active', department: 'CSE', year: '1st' },
      { name: 'Vikram Singh', email: 'vikram@test.com', password: '123', room: '105', block: 'B', status: 'Active', department: 'CIVIL', year: '3rd' },
      { name: 'Anjali Rai', email: 'anjali@test.com', password: '123', room: '106', block: 'A', status: 'Active', department: 'ECE', year: '2nd' },
      { name: 'Rohit Verma', email: 'rohit@test.com', password: '123', room: '107', block: 'B', status: 'Active', department: 'CSE', year: '4th' },
      { name: 'Neha Jain', email: 'neha@test.com', password: '123', room: '108', block: 'A', status: 'Inactive', department: 'MECH', year: '1st' },
      { name: 'Karan Malhotra', email: 'karan@test.com', password: '123', room: '109', block: 'B', status: 'Active', department: 'CIVIL', year: '3rd' },
      { name: 'Simran Kaur', email: 'simran@test.com', password: '123', room: '110', block: 'A', status: 'Active', department: 'CSE', year: '2nd' },
      { name: 'Arjun Das', email: 'arjun@test.com', password: '123', room: '111', block: 'B', status: 'Active', department: 'ECE', year: '4th' },
      { name: 'Meera Reddy', email: 'meera@test.com', password: '123', room: '112', block: 'A', status: 'Active', department: 'MECH', year: '1st' }
    ]);

    await Room.create([
      { number: '101', block: 'A', type: 'Double', capacity: 2, occupied: 1, rent: 5000, status: 'Available' },
      { number: '102', block: 'A', type: 'Single', capacity: 1, occupied: 1, rent: 8000, status: 'Full' },
      { number: '103', block: 'B', type: 'Triple', capacity: 3, occupied: 2, rent: 4000, status: 'Available' },
      { number: '104', block: 'A', type: 'Double', capacity: 2, occupied: 0, rent: 5000, status: 'Available' },
      { number: '105', block: 'B', type: 'Single', capacity: 1, occupied: 0, rent: 8000, status: 'Available' },
      { number: '106', block: 'A', type: 'Triple', capacity: 3, occupied: 3, rent: 4000, status: 'Full' },
      { number: '107', block: 'B', type: 'Double', capacity: 2, occupied: 2, rent: 5000, status: 'Full' },
      { number: '108', block: 'A', type: 'Single', capacity: 1, occupied: 0, rent: 8000, status: 'Maintenance' },
      { number: '109', block: 'B', type: 'Triple', capacity: 3, occupied: 1, rent: 4000, status: 'Available' },
      { number: '110', block: 'A', type: 'Double', capacity: 2, occupied: 1, rent: 5000, status: 'Available' },
      { number: '111', block: 'B', type: 'Single', capacity: 1, occupied: 1, rent: 8000, status: 'Full' },
      { number: '112', block: 'A', type: 'Triple', capacity: 3, occupied: 0, rent: 4000, status: 'Available' }
    ]);

    await Complaint.create([
      { studentId: students[0]._id, issue: 'Leaking Tap', description: 'Bathroom tap is leaking continuously.', priority: 'Medium', status: 'Pending', date: new Date('2023-10-25') },
      { studentId: students[1]._id, issue: 'WiFi Not Working', description: 'Internet connection is very slow in room 102.', priority: 'High', status: 'Resolved', date: new Date('2023-10-20') },
      { studentId: students[2]._id, issue: 'Broken Chair', description: 'Study chair leg is broken.', priority: 'Low', status: 'Pending', date: new Date('2023-10-26') },
      { studentId: students[3]._id, issue: 'Power Cut', description: 'No electricity in block A since morning.', priority: 'High', status: 'Pending', date: new Date('2023-10-27') },
      { studentId: students[4]._id, issue: 'Dirty Corridor', description: 'Corridor needs cleaning.', priority: 'Low', status: 'Rejected', date: new Date('2023-10-15') },
      { studentId: students[5]._id, issue: 'AC Not Working', description: 'Air conditioner is making loud noise.', priority: 'Medium', status: 'Pending', date: new Date('2023-10-28') },
      { studentId: students[6]._id, issue: 'Door Lock Issue', description: 'Room door lock is jammed.', priority: 'High', status: 'Resolved', date: new Date('2023-10-18') },
      { studentId: students[7]._id, issue: 'Bed Broken', description: 'Bed frame is damaged.', priority: 'Medium', status: 'Pending', date: new Date('2023-10-24') },
      { studentId: students[8]._id, issue: 'No Hot Water', description: 'Water heater not functioning.', priority: 'High', status: 'Pending', date: new Date('2023-10-29') },
      { studentId: students[9]._id, issue: 'Window Broken', description: 'Window pane is cracked.', priority: 'Medium', status: 'Resolved', date: new Date('2023-10-19') },
      { studentId: students[10]._id, issue: 'Fan Not Working', description: 'Ceiling fan is not rotating.', priority: 'Low', status: 'Pending', date: new Date('2023-10-30') },
      { studentId: students[11]._id, issue: 'Pest Problem', description: 'Rats spotted in the common area.', priority: 'High', status: 'Pending', date: new Date('2023-10-31') },
      { studentId: students[0]._id, issue: 'Light Not Working', description: 'Tube light needs replacement.', priority: 'Low', status: 'Rejected', date: new Date('2023-10-14') },
      { studentId: students[1]._id, issue: 'Bathroom Door', description: 'Bathroom door hinge is loose.', priority: 'Medium', status: 'Pending', date: new Date('2023-11-01') },
      { studentId: students[2]._id, issue: 'Drainage Issue', description: 'Bathroom drainage is clogged.', priority: 'High', status: 'Resolved', date: new Date('2023-10-22') }
    ]);

    await Leave.create([
      { studentId: students[0]._id, fromDate: new Date('2023-11-01'), toDate: new Date('2023-11-05'), reason: 'Going home for Diwali', status: 'Approved' },
      { studentId: students[1]._id, fromDate: new Date('2023-11-10'), toDate: new Date('2023-11-12'), reason: 'Medical Checkup', status: 'Pending' },
      { studentId: students[2]._id, fromDate: new Date('2023-11-15'), toDate: new Date('2023-11-20'), reason: 'Sister Wedding', status: 'Pending' },
      { studentId: students[3]._id, fromDate: new Date('2023-10-28'), toDate: new Date('2023-10-30'), reason: 'Personal work', status: 'Rejected' },
      { studentId: students[4]._id, fromDate: new Date('2023-11-05'), toDate: new Date('2023-11-08'), reason: 'Family function', status: 'Approved' },
      { studentId: students[5]._id, fromDate: new Date('2023-11-12'), toDate: new Date('2023-11-14'), reason: 'Exam preparation at home', status: 'Pending' },
      { studentId: students[6]._id, fromDate: new Date('2023-11-20'), toDate: new Date('2023-11-25'), reason: 'Cousin wedding', status: 'Pending' },
      { studentId: students[7]._id, fromDate: new Date('2023-10-25'), toDate: new Date('2023-10-27'), reason: 'Medical emergency', status: 'Approved' },
      { studentId: students[8]._id, fromDate: new Date('2023-11-08'), toDate: new Date('2023-11-10'), reason: 'Interview', status: 'Approved' },
      { studentId: students[9]._id, fromDate: new Date('2023-11-18'), toDate: new Date('2023-11-22'), reason: 'Going home', status: 'Pending' },
      { studentId: students[10]._id, fromDate: new Date('2023-10-20'), toDate: new Date('2023-10-22'), reason: 'Not feeling well', status: 'Rejected' },
      { studentId: students[11]._id, fromDate: new Date('2023-11-25'), toDate: new Date('2023-11-30'), reason: 'Project work', status: 'Pending' }
    ]);

    await Notice.create([
      { title: 'Diwali Vacation', description: 'Hostel will remain closed from Nov 1st to Nov 5th for Diwali.', priority: 'Normal', date: new Date('2023-10-25') },
      { title: 'Water Supply Maintenance', description: 'Water supply will be interrupted on Sunday from 10 AM to 2 PM.', priority: 'Urgent', date: new Date('2023-10-27') },
      { title: 'Guest Policy Update', description: 'New guest policy effective from next month. Check notice board.', priority: 'Normal', date: new Date('2023-10-20') },
      { title: 'Exam Schedule', description: 'Mid-semester exams will be held from 15th to 20th Nov.', priority: 'Urgent', date: new Date('2023-10-28') },
      { title: 'Hostel Fee Payment', description: 'Please clear hostel dues by 30th November.', priority: 'Urgent', date: new Date('2023-10-26') },
      { title: 'Cultural Event', description: 'Annual cultural fest on 5th December. Register now!', priority: 'Normal', date: new Date('2023-10-24') },
      { title: 'Mess Menu Update', description: 'New menu items added. Check the notice board.', priority: 'Normal', date: new Date('2023-10-23') },
      { title: 'Internet Upgrade', description: 'WiFi speed will be upgraded next week.', priority: 'Normal', date: new Date('2023-10-29') },
      { title: 'Safety Drill', description: 'Fire safety drill on Saturday at 4 PM. Attendance mandatory.', priority: 'Urgent', date: new Date('2023-10-30') },
      { title: 'Sports Day', description: 'Inter-hostel sports competition on 10th December.', priority: 'Normal', date: new Date('2023-10-21') }
    ]);

    res.json({ message: 'Seeded successfully with comprehensive dummy data' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
