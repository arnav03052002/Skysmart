require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('../src/configs/db');
const City = require('../src/models/city.model');
const Flight = require('../src/models/flight.model');

// 🔧 Utility to get random number
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// ✈️ Sample airline names
const airlines = ['SkyJet', 'FlyNova', 'AirZoom', 'CloudLine', 'JetFusion', 'AeroFly'];

// ✈️ Generate unique-looking flight number
const generateFlightNumber = () => {
  const code = airlines[getRandomInt(0, airlines.length - 1)].slice(0, 2).toUpperCase();
  return `${code}${getRandomInt(100, 999)}`;
};

// ⏱️ Duration + timing generator
const generateDurationAndTime = () => {
  const durationMins = getRandomInt(60, 600); // 1 to 10 hours
  const now = new Date();
  const departureTime = new Date(now.getTime() + getRandomInt(1, 10) * 24 * 60 * 60 * 1000);
  const arrivalTime = new Date(departureTime.getTime() + durationMins * 60 * 1000);
  const duration = `${Math.floor(durationMins / 60)}h ${durationMins % 60}m`;
  return { departureTime, arrivalTime, duration };
};

// 🧠 Smart flight generator
const generateFlights = async (count = 100) => {
  try {
    await connect();
    console.log("✅ Connected to MongoDB");

    const cities = await City.find();
    if (cities.length < 2) {
      console.log("❌ Not enough cities to generate flights");
      return;
    }

    const flights = [];

    for (let i = 0; i < count; i++) {
      let dep, arr;

      // Ensure departure ≠ arrival
      do {
        dep = cities[getRandomInt(0, cities.length - 1)];
        arr = cities[getRandomInt(0, cities.length - 1)];
      } while (dep.iataCode === arr.iataCode);

      const { departureTime, arrivalTime, duration } = generateDurationAndTime();

      const flight = {
        flightNumber: generateFlightNumber(),
        departureCity: dep.name,
        arrivalCity: arr.name,
        departureAirportCode: dep.iataCode,
        arrivalAirportCode: arr.iataCode,
        departureTime,
        arrivalTime,
        duration,
        price: getRandomInt(100, 800), // USD
        airline: airlines[getRandomInt(0, airlines.length - 1)],
      };

      console.log(`✈️ Generating flight ${i + 1}: ${flight.departureCity} (${flight.departureAirportCode}) ➜ ${flight.arrivalCity} (${flight.arrivalAirportCode})`);
      flights.push(flight);
    }

    await Flight.insertMany(flights);
    console.log(`✅ Seeded ${flights.length} flights into the database.`);
  } catch (err) {
    console.error("❌ Error generating flights:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
    process.exit(0);
  }
};

generateFlights(100);
