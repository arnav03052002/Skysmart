require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const City = require('../src/models/city.model');
const connect = require('../src/configs/db');

// Load API key from .env
const API_KEY = process.env.AVIATIONSTACK_API_KEY;
console.log("🔑 Your API Key is:", API_KEY);

const fetchAndSeedCities = async () => {
  try {
    await connect();
    console.log("✅ Connected to MongoDB");

    const url = `https://api.aviationstack.com/v1/airports?access_key=${API_KEY}&limit=1000`;
    const response = await axios.get(url);
    const airports = response.data.data;

    if (!airports || airports.length === 0) {
      console.log("❌ No airport data received from API.");
      return;
    }

    // 🔍 Log first 5 airport entries for inspection
    console.log("🔍 Sample airport data:");
    console.log(airports.slice(0, 5));

    const uniqueCities = new Map();

    airports.forEach(airport => {
      const city = airport.city?.trim();
      const country = airport.country_name?.trim();

      if (city && country) {
        const cityKey = `${city}-${country}`;
        if (!uniqueCities.has(cityKey)) {
          uniqueCities.set(cityKey, {
            name: city,
            state: airport.region_name || "",
            country: country
          });
        }
      }
    });

    const cities = Array.from(uniqueCities.values());

    if (cities.length === 0) {
      console.log("⚠️ No valid cities found to insert.");
      return;
    }

    await City.insertMany(cities);
    console.log(`🌍 Inserted ${cities.length} unique cities into DB`);
  } catch (error) {
    console.error("❌ Error seeding cities:", error.message);
  } finally {
    process.exit(0);
  }
};

fetchAndSeedCities();
