require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Amadeus API credentials
const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;

const cityList = [
  "Ahmedabad", "Atlanta", "Austin", "Barcelona", "Beijing", "Berlin", "Charlotte", "Chengdu",
  "Chennai", "Chicago", "Columbus", "Colorado Springs", "Dallas", "Denver", "Detroit",
  "Dublin", "El Paso", "Fresno", "Fort Worth", "Guangzhou", "Genoa", "Houston", "Indianapolis",
  "Istanbul", "Jacksonville", "Jaipur", "Kansas City", "King City", "Kolkata", "Lake Geneva",
  "La Paz", "Leh", "Long Beach", "Los Angeles", "Madrid", "Melbourne", "Miami", "Milwaukee",
  "Minneapolis/ST Paul", "Mumbai", "Muscatine", "Nashville", "New Orleans", "New York",
  "Oakland", "Oklahoma City", "Omaha", "Panama City", "Paris", "Perth", "Philadelphia",
  "Phoenix", "Portland", "Pune", "Raleigh Durham", "Rome", "Sacramento", "San Antonio",
  "San Diego", "San Francisco", "San Jose", "Santiago de Compostela", "Seattle", "Shenzhen",
  "Surat Thani", "Tulsa", "Tucson", "Urumqi", "Virginia Beach", "Washington", "Wichita"
];

// Get Amadeus access token
async function getAmadeusToken() {
  const { data } = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: AMADEUS_CLIENT_ID,
    client_secret: AMADEUS_CLIENT_SECRET
  }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

  return data.access_token;
}

// Fetch city data safely with error handling
async function fetchCityData(token, city) {
  try {
    const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations', {
      headers: { Authorization: `Bearer ${token}` },
      params: { keyword: city, subType: 'CITY' }
    });

    if (response.data.data.length === 0) {
      console.warn(`⚠️ No data found for "${city}"`);
      return null; // gracefully continue
    }

    return response.data.data[0];

  } catch (error) {
    if (error.response) {
      const status = error.response.status;

      // Handle specific errors gracefully
      if (status === 404) {
        console.warn(`⚠️ 404 Not Found: "${city}"`);
      } else if (status === 429) {
        console.warn(`⚠️ Rate limit reached (429). Wait or retry later.`);
      } else {
        console.warn(`⚠️ HTTP ${status} error for "${city}"`);
      }
    } else {
      console.warn(`⚠️ Error fetching "${city}":`, error.message);
    }
    return null; // ensure continuation
  }
}

async function generateFullCityData() {
  try {
    const token = await getAmadeusToken();
    const enrichedCities = [];

    for (const city of cityList) {
      const cityData = await fetchCityData(token, city);

      if (cityData) {
        enrichedCities.push({
          name: cityData.name,
          iataCode: cityData.iataCode,
          country: cityData.address.countryName,
          latitude: cityData.geoCode.latitude,
          longitude: cityData.geoCode.longitude,
          timezone: cityData.timeZoneOffset || 'N/A'
        });

        console.log(`✅ Saved: ${cityData.name} (${cityData.iataCode})`);
      } else {
        console.log(`🔸 Skipping: ${city}`);
      }
    }

    fs.writeFileSync(
      path.join(__dirname, 'fullCities.json'),
      JSON.stringify(enrichedCities, null, 2)
    );

    console.log(`✅ Done! Successfully saved ${enrichedCities.length} cities into fullCities.json`);

  } catch (err) {
    console.error('❌ Critical error:', err.message);
  }
}

generateFullCityData();
