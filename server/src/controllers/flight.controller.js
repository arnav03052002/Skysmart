const Flight = require("../models/flight.model");

exports.searchFlights = async (req, res) => {
  try {
    const { from, to, date } = req.query;
    const query = {};

    if (from) query.departureAirportCode = from.toUpperCase();
    if (to) query.arrivalAirportCode = to.toUpperCase();
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.departureTime = { $gte: start, $lte: end };
    }

    const flights = await Flight.find(query).sort({ departureTime: 1 });
    res.status(200).json(flights);
  } catch (error) {
    res.status(500).json({ message: "Error searching flights", error: error.message });
  }
};