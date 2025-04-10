require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const connect = require('../src/configs/db');
const City = require('../src/models/city.model');

async function seedCities() {
  try {
    await connect();
    console.log("✅ MongoDB Connected");

    // Clearly corrected path according to your screenshot
    const citiesPath = path.join(__dirname, 'data', 'fullCities.json');
    const cities = JSON.parse(fs.readFileSync(citiesPath));

    await City.deleteMany({});
    console.log("🧹 Cleared old cities from DB");

    await City.insertMany(cities);
    console.log(`✅ Seeded ${cities.length} cities successfully!`);

  } catch (err) {
    console.error('❌ Error seeding cities:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
    process.exit(0);
  }
}

seedCities();
