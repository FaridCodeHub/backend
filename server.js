require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const routeRoutes = require("./routes/routeRoutes");

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

// Use route routes
app.use("/api", routeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});