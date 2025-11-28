const mongoose = require("mongoose");
require("dotenv").config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Mongo is already connected");
    return;
  }

  const uri = process.env.MONGODB_URI;
  console.log(uri)

  if (!uri) throw new Error("Missing MONGODB_URI");

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

    isConnected = true;

    console.log("✓ Connected to MongoDB successfully");
    console.log(`Database: ${conn.connection.db.databaseName}`);

  } catch (err) {
    console.error("✗ Error connecting to MongoDB:", err.message);
    throw err;
  }
};

module.exports = { connectDB };
