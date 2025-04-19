const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connect = require("./src/configs/db");
const flightRoutes = require("./src/routes/flight.routes");
const userRoutes = require("./src/routes/user.routes"); // 👈 import user routes
const cityRoutes = require("./src/routes/city.route");


dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Root route to avoid "Cannot GET /"
app.get("/", (req, res) => {
  res.send("🛫 Welcome to SmartSky API - Backend is running!");
});

// ✅ Mount all routes
app.use("/flights", flightRoutes);
app.use("/user", userRoutes); // 👈 mounted at /user
app.use("/city", cityRoutes); // 👈 mount this

// Start server after DB connection
app.listen(port, async () => {
  try {
    await connect();
    console.log(`✅ Server running on http://localhost:${port}`);
  } catch (error) {
    console.log("❌ DB Connection Error:", error.message);
  }
});
