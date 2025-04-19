const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connect = require("./src/configs/db");
const flightRoutes = require("./src/routes/flight.routes");

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Root route to avoid "Cannot GET /"
app.get("/", (req, res) => {
  res.send("🛫 Welcome to SmartSky API - Backend is running!");
});


// ✅ Mount flight routes
app.use("/flights", flightRoutes);

app.listen(port, async () => {
  try {
    await connect();
    console.log(`✅ Server running on http://localhost:${port}`);
  } catch (error) {
    console.log("❌ DB Connection Error:", error.message);
  }
});
