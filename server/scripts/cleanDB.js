require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('../src/configs/db');
const City = require('../src/models/city.model');
const Flight = require('../src/models/flight.model');

async function cleanDatabase() {
  try {
    await connect();
    console.log("✅ Connected to MongoDB");

    const cityResult = await City.deleteMany({});
    console.log(`🧹 Deleted ${cityResult.deletedCount} city records`);

    const flightResult = await Flight.deleteMany({});
    console.log(`🧹 Deleted ${flightResult.deletedCount} flight records`);

    console.log("✅ Database clean-up complete!");
  } catch (err) {
    console.error("❌ Error cleaning database:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
    process.exit(0);
  }
}

cleanDatabase();