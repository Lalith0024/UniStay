const express = require('express');
const router = express.Router();
const { Student, Room, Complaint, Leave, Notice } = require('../models');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const firstNamesM = ['Aarav', 'Vihaan', 'Aditya', 'Sai', 'Arjun', 'Kabir', 'Rohan', 'Aryan', 'Dhruv', 'Ishaan', 'Rahul', 'Vikram', 'Karan', 'Rohit', 'Amit'];
const firstNamesF = ['Ananya', 'Diya', 'Sneha', 'Priya', 'Aditi', 'Neha', 'Pooja', 'Riya', 'Ishita', 'Kriti', 'Simran', 'Anjali', 'Meera', 'Kavya', 'Shruti'];
const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Verma', 'Reddy', 'Rao', 'Jain', 'Das', 'Malhotra', 'Kaur', 'Nair', 'Bose', 'Sengupta'];
const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'IT', 'EEE'];
const years = ['1st', '2nd', '3rd', '4th'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomStudent(index) {
  const isMale = Math.random() > 0.5;
  const firstName = isMale ? getRandomItem(firstNamesM) : getRandomItem(firstNamesF);
  const lastName = getRandomItem(lastNames);
  const genderDir = isMale ? 'men' : 'women';
  const picNum = getRandomInt(1, 99);

  return {
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@test.com`,
    department: getRandomItem(departments),
    year: getRandomItem(years),
    phone: `98765${getRandomInt(10000, 99999)}`,
    image: `https://randomuser.me/api/portraits/${genderDir}/${picNum}.jpg`,
    status: Math.random() > 0.05 ? 'Active' : 'Inactive',
  };
}

// Seed Data Endpoint
router.post('/', async (req, res) => {
  try {
    console.log('Starting seed process...');
    // Clear existing data
    await Student.deleteMany({});
    await Room.deleteMany({});
    await Complaint.deleteMany({});
    await Leave.deleteMany({});
    await Notice.deleteMany({});
    await User.deleteMany({ role: 'student' });

    const commonPassword = await bcrypt.hash('123', 10);

    // 1. Generate 100 Rooms (50 Block A, 50 Block B)
    const roomsToInsert = [];
    const roomTypes = [
      { type: 'Single', capacity: 1, rent: 8000 },
      { type: 'Double', capacity: 2, rent: 5000 },
      { type: 'Triple', capacity: 3, rent: 4000 }
    ];

    let totalCapacity = 0;

    for (let i = 1; i <= 50; i++) {
      const typeA = getRandomItem(roomTypes);
      const typeB = getRandomItem(roomTypes);
      
      roomsToInsert.push({
        number: `1${i.toString().padStart(2, '0')}`,
        block: 'A',
        type: typeA.type,
        capacity: typeA.capacity,
        occupied: 0,
        rent: typeA.rent,
        status: 'Available'
      });

      roomsToInsert.push({
        number: `2${i.toString().padStart(2, '0')}`,
        block: 'B',
        type: typeB.type,
        capacity: typeB.capacity,
        occupied: 0,
        rent: typeB.rent,
        status: 'Available'
      });

      totalCapacity += typeA.capacity + typeB.capacity;
    }

    // 2. Calculate 78% occupancy
    const targetOccupancy = Math.floor(totalCapacity * 0.78);
    console.log(`Total Capacity: ${totalCapacity}. Target Occupancy (78%): ${targetOccupancy}`);

    // 3. Allot students to rooms randomly
    const studentData = [];
    let studentsAllotted = 0;

    // Shuffle rooms to ensure random distribution
    const shuffledRooms = [...roomsToInsert].sort(() => Math.random() - 0.5);

    for (const room of shuffledRooms) {
      if (studentsAllotted >= targetOccupancy) break;

      const maxCanAdd = Math.min(room.capacity, targetOccupancy - studentsAllotted);
      
      let toAdd = 0;
      const rand = Math.random();
      if (rand > 0.3) {
        toAdd = maxCanAdd;
      } else if (rand > 0.1 && maxCanAdd > 1) {
        toAdd = maxCanAdd - 1;
      } else {
        toAdd = 0;
      }

      for (let s = 0; s < toAdd; s++) {
        const student = generateRandomStudent(studentsAllotted);
        student.password = commonPassword;
        student.room = room.number;
        student.block = room.block;
        studentData.push(student);
        studentsAllotted++;
        room.occupied++;
      }

      if (room.occupied === room.capacity) {
        room.status = 'Full';
      }
    }

    // 4. Create Documents
    console.log(`Creating ${roomsToInsert.length} rooms and ${studentData.length} students...`);
    await Room.create(roomsToInsert);
    const students = await Student.create(studentData);

    const userData = studentData.map(s => ({
      name: s.name,
      email: s.email,
      password: s.password,
      role: 'student'
    }));
    await User.create(userData);

    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@test.com',
        password: commonPassword,
        role: 'admin'
      });
    }

    // 5. Seed Activity (Complaints and Leaves)
    const complaints = [];
    const leaves = [];
    const issues = ['Leaking Tap', 'WiFi Not Working', 'Broken Chair', 'Power Cut', 'AC Not Working', 'Door Lock Issue', 'Bed Broken', 'No Hot Water', 'Window Broken', 'Fan Not Working'];
    const statuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
    const priorities = ['Low', 'Medium', 'High'];

    for (let i = 0; i < 40; i++) {
      const randomStudent = getRandomItem(students);
      const daysAgo = getRandomInt(0, 14);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      complaints.push({
        studentId: randomStudent._id,
        issue: getRandomItem(issues),
        description: 'Autogenerated complaint description.',
        priority: getRandomItem(priorities),
        status: getRandomItem(statuses),
        date: date
      });
    }

    for (let i = 0; i < 30; i++) {
      const randomStudent = getRandomItem(students);
      const daysAgo = getRandomInt(0, 14);
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - daysAgo);
      const toDate = new Date(fromDate);
      toDate.setDate(toDate.getDate() + getRandomInt(1, 5));

      leaves.push({
        studentId: randomStudent._id,
        fromDate,
        toDate,
        reason: 'Going home for holidays',
        status: getRandomItem(['Pending', 'Approved', 'Rejected'])
      });
    }

    await Complaint.create(complaints);
    await Leave.create(leaves);

    console.log('Seeding completed!');
    res.json({ message: `Successfully seeded 100 rooms and ${studentData.length} students (~78% occupancy)!` });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ message: 'Seed failed', error: error.message });
  }
});

module.exports = router;
