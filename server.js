require("dotenv").config();
const express = require("express");
const cors = require("cors");

const pool = require("./src/config/db");
const initDB = require("./src/database/initDB");
const authRoutes = require("./src/routes/authRoutes");
const routeRoutes = require("./src/routes/routeRoutes");
const tripRoutes = require("./src/routes/tripRoutes");

const savedRouteRoutes = require("./src/routes/savedRouteRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Home
app.get("/", (req, res) => {
  res.json({ message: "EcoRoute Backend Running" });
});

// Test DB
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Database connected!",
      time: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Routes
app.use("/api", authRoutes);
app.use("/api", routeRoutes);
app.use("/api", tripRoutes);
app.use("/api", savedRouteRoutes);

const PORT = process.env.PORT || 5000;

// Initialize DB then start server
async function startServer() {
  await initDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();