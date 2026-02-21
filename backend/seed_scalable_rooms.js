const mongoose = require('mongoose');
require('dotenv').config();

const roomSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  block: { type: String, required: true },
  type: { type: String, enum: ['Single', 'Double', 'Triple'], required: true },
  capacity: { type: Number, required: true },
  occupied: { type: Number, default: 0 },
  rent: { type: Number, required: true },
  status: { type: String, enum: ['Available', 'Full', 'Maintenance'], default: 'Available' },
  facilities: [{ type: String }]
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      // Find highest room number to prevent collisions
      const rooms = await Room.find().sort({ number: -1 });
      let nextRoomNum = 500; // default start
      if (rooms.length > 0) {
        // Try to parse the highest room number
        for (let r of rooms) {
          const num = parseInt(r.number.replace(/\D/g, ''));
          if (!isNaN(num)) {
            nextRoomNum = num + 1;
            break;
          }
        }
      }

      console.log(`Starting to create 50 rooms from room number: ${nextRoomNum}`);

      const newRooms = [];
      for (let i = 0; i < 50; i++) {
        newRooms.push({
          number: String(nextRoomNum + i),
          block: i % 2 === 0 ? 'A' : 'B',
          type: 'Double',
          capacity: 2,
          occupied: 0,
          rent: 5000,
          status: 'Available',
          facilities: ['AC', 'WiFi', 'Attached Bath']
        });
      }

      await Room.insertMany(newRooms);
      console.log('✅ Successfully inserted 50 scalable rooms.');
    } catch (err) {
      console.error('Error inserting rooms:', err);
    } finally {
      process.exit(0);
    }
  })
  .catch(err => {
    console.error('DB Connection error:', err);
    process.exit(1);
  });
