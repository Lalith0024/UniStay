const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const userModel = require('./models/user');
const Student = require('./models/Student');

const createTestUser = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("Missing MONGODB_URI");

    await mongoose.connect(uri);
    console.log("✓ Connected to MongoDB");

    // Get first seeded student
    const student = await Student.findOne({ email: 'rahul@test.com' });
    if (!student) {
      console.error("✗ Student not found. Run seed first!");
      process.exit(1);
    }

    console.log("Found student:", student.name, student.email);

    // Check if user already exists
    const existingUser = await userModel.findOne({ email: student.email });
    if (existingUser) {
      console.log("✓ User already exists");
      console.log("\nLogin with:");
      console.log("Email:", student.email);
      console.log("Password: 123");
      process.exit(0);
    }

    // Create user with hashed password
    const hashedPassword = await bcrypt.hash('123', 10);
    const newUser = new userModel({
      name: student.name,
      email: student.email,
      password: hashedPassword,
      role: 'student'
    });

    await newUser.save();
    console.log("✓ Created user account");

    console.log("\n=== LOGIN CREDENTIALS ===");
    console.log("Email:", student.email);
    console.log("Password: 123");
    console.log("========================\n");

    process.exit(0);
  } catch (error) {
    console.error("✗ Error:", error);
    process.exit(1);
  }
};

createTestUser();
