const Flight = require("../models/flight.model");

exports.searchFlights = async (req, res) => {
  try {
    const { source, destination, date } = req.query;
    const query = {};

    if (source) query.departureAirportCode = source.toUpperCase();
    if (destination) query.arrivalAirportCode = destination.toUpperCase();
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
