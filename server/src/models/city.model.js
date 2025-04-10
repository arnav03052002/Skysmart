const { Schema, model } = require("mongoose");

const CitySchema = new Schema({
  name: { type: String, required: true },
  iataCode: { type: String, required: true },
  country: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timezone: { type: String, default: "N/A" }
});

const CityModel = model("cities", CitySchema);

module.exports = CityModel;
