require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');
const City = require('../src/models/city.model');
const connect = require('../src/configs/db');

// Load Amadeus credentials
const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;

// Load city list from JSON file
const citiesPath = path.join(__dirname, 'data', 'cities.json');
const citiesToSeed = JSON.parse(fs.readFileSync(citiesPath, 'utf-8'));

async function getAmadeusToken() {
  try {
    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: AMADEUS_CLIENT_ID,
        client_secret: AMADEUS_CLIENT_SECRET
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    return response.data.access_token;
  } catch (err) {
    console.error("❌ Failed to get Amadeus token:", err.message);
    throw err;
  }
}

async function seedCities() {
  try {
    await connect();
    console.log("✅ Connected to MongoDB");

    const token = await getAmadeusToken();
    const saved = [];

    for (const keyword of citiesToSeed) {
      try {
        const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            keyword,
            subType: 'CITY'
          }
        });

        const match = response.data.data[0]; // Take the top result
        if (!match) {
          console.warn(`⚠️ No match found for "${keyword}"`);
          continue;
        }

        const newCity = {
          name: match.name,
          iataCode: match.iataCode,
          country: match.address.countryName || "Unknown"
        };

        await City.create(newCity);
        saved.push(newCity);
        console.log(`✅ Saved: ${newCity.name} (${newCity.iataCode}) - ${newCity.country}`);
      } catch (err) {
        console.warn(`❌ Failed for "${keyword}": ${err.response?.data?.error?.title || err.message}`);
      }
    }

    console.log(`🌍 Done! Seeded ${saved.length} of ${citiesToSeed.length} cities successfully.`);
  } catch (err) {
    console.error("❌ Seeder error:", err.message);
  } finally {
    process.exit(0);
  }
}

seedCities();
