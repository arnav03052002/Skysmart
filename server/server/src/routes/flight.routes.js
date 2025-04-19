// const express = require("express");
// const router = express.Router();
// const flightController = require("../controllers/flight.controller");

// router.get("/", flightController.searchFlights); // GET /flights

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const Flight = require("../models/flight.model");

// // POST /flights/search
// router.post("/search", async (req, res) => {
//   const { source, destination, date } = req.body;

//   if (!source || !destination || !date) {
//     return res.status(400).send({ status: "fail", message: "Missing fields" });
//   }

//   try {
//     // Convert date string to start and end of that day
//     const startDate = new Date(date);
//     const endDate = new Date(date);
//     endDate.setHours(23, 59, 59, 999);

//     const flights = await Flight.find({
//       departureCity: source,
//       arrivalCity: destination,
//       departureTime: { $gte: startDate, $lte: endDate },
//     });

//     if (!flights.length) {
//       return res.status(404).send({ status: "fail", message: "No flights found" });
//     }

//     res.send({ status: "success", flights });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ status: "error", message: err.message });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const Flight = require("../models/flight.model");

const airlines = ['SkyJet', 'FlyNova', 'AirZoom', 'CloudLine', 'JetFusion', 'AeroFly'];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateFlightNumber = () => {
  const code = airlines[getRandomInt(0, airlines.length - 1)].slice(0, 2).toUpperCase();
  return `${code}${getRandomInt(100, 999)}`;
};
const generateDurationAndTime = (date) => {
  const durationMins = getRandomInt(60, 600);
  const departureTime = new Date(date);
  departureTime.setHours(getRandomInt(0, 20));
  const arrivalTime = new Date(departureTime.getTime() + durationMins * 60 * 1000);
  const duration = `${Math.floor(durationMins / 60)}h ${durationMins % 60}m`;
  return { departureTime, arrivalTime, duration };
};

router.post("/seed", async (req, res) => {
  const { source, destination, date } = req.body;

  if (!source || !destination || !date || source === destination) {
    return res.status(400).send({ status: "fail", message: "Invalid inputs" });
  }

  try {
    const flights = [];

    for (let i = 0; i < 10; i++) {
      const { departureTime, arrivalTime, duration } = generateDurationAndTime(date);

      flights.push({
        flightNumber: generateFlightNumber(),
        departureCity: source,
        arrivalCity: destination,
        departureAirportCode: source.slice(0, 3).toUpperCase(),
        arrivalAirportCode: destination.slice(0, 3).toUpperCase(),
        departureTime,
        arrivalTime,
        duration,
        price: getRandomInt(100, 800),
        airline: airlines[getRandomInt(0, airlines.length - 1)],
      });
    }

    await Flight.insertMany(flights);
    res.status(201).send({ status: "success", flights });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
});

router.post("/search", async (req, res) => {
    const { source, destination, date } = req.body;
  
    if (!source || !destination || !date) {
      return res.status(400).send({ status: "fail", message: "Missing fields" });
    }
  
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
  
    try {
      const flights = await Flight.find({
        departureCity: source,
        arrivalCity: destination,
        departureTime: { $gte: startDate, $lte: endDate },
      });
  
      if (!flights.length) {
        return res.status(404).send({ status: "fail", message: "No flights found" });
      }
  
      res.send({ status: "success", flights });
    } catch (err) {
      res.status(500).send({ status: "error", message: err.message });
    }
  });
  

module.exports = router;

