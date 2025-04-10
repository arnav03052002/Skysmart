const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
    unique: true
  },
  departureCity: {
    type: String,
    required: true
  },
  arrivalCity: {
    type: String,
    required: true
  },
  departureAirportCode: {
    type: String,
    required: true
  },
  arrivalAirportCode: {
    type: String,
    required: true
  },
  departureTime: {
    type: Date,
    required: true
  },
  arrivalTime: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  airline: {
    type: String,
    required: true
  },
  duration: {
    type: String // e.g. "2h 30m"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Flight', flightSchema);
