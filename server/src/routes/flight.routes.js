const express = require("express");
const router = express.Router();
const flightController = require("../controllers/flight.controller");

router.get("/", flightController.searchFlights); // GET /flights

module.exports = router;
