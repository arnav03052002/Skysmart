const express = require("express");
const router = express.Router();

// Dummy DB to simulate city search
const cities = [
  { name: "Delhi", state: "Delhi" },
  { name: "Mumbai", state: "Maharashtra" },
  { name: "Chennai", state: "Tamil Nadu" },
  { name: "Kolkata", state: "West Bengal" },
];

// POST /city
router.post("/", (req, res) => {
  const { source, destination } = req.body;

  const query = source || destination;
  if (!query) return res.status(400).send({ message: "No city provided" });

  const result = cities.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  res.send(result);
});

// POST /city/showcity
router.post("/showcity", (req, res) => {
  const { source, destination, date } = req.body;

  if (!source || !destination || !date) {
    return res.status(400).send({ status: "fail", message: "Missing fields" });
  }

  // Simulate route availability
  if (source === destination) {
    return res.status(400).send({ status: "fail", message: "Same city" });
  }

  // You can check if the cities exist in a DB here
  return res.send({
    status: "success",
    data: { source, destination, date },
  });
});

module.exports = router;
