require("dotenv").config();
const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is missing in environment variables");
  process.exit(1);
}

const isRender = process.env.DATABASE_URL.includes("render");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isRender
    ? { rejectUnauthorized: false }
    : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Database connected");
    release();
  }
});

// Handle unexpected errors
pool.on("error", (err) => {
  console.error("❌ Unexpected database error:", err);
});

module.exports = pool;