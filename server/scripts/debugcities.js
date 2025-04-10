require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('../src/configs/db');
const City = require('../src/models/city.model');
const Flight = require('../src/models/flight.model');

async function checkDB() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await connect();
    console.log("✅ Connected to MongoDB");

    const totalCities = await City.countDocuments();
    const totalFlights = await Flight.countDocuments();

    const cities = await City.find().limit(10);
    const flights = await Flight.find().limit(10);

    console.log(`\n🗺️ Total Cities: ${totalCities}`);
    console.table(
      cities.map(c => ({
        City: c.name,
        IATA: c.iataCode,
        Country: c.country
      }))
    );

    console.log(`\n✈️ Total Flights: ${totalFlights}`);
    console.table(
      flights.map(f => ({
        Flight: f.flightNumber,
        From: `${f.departureCity} (${f.departureAirportCode})`,
        To: `${f.arrivalCity} (${f.arrivalAirportCode})`,
        Airline: f.airline,
        Price: `₹${f.price}`,
        Duration: f.duration
      }))
    );
  } catch (err) {
    console.error("❌ Error checking DB:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed.");
    process.exit(0);
  }
}

checkDB();
